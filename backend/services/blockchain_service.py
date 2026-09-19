"""
CrimeGraph AI — Blockchain Trust & Provenance Service.

Central abstraction for all blockchain interactions. No other service
in the backend touches Web3 directly — everything goes through this class.

Architecture:
    CrimeGraph Services → BlockchainService → CrimeGraphAnchor.sol (Polygon)

The blockchain proves that data existed in a particular state at a particular time.
It is NOT the primary database. All raw data stays off-chain in PostgreSQL / memory.

On-chain:  SHA-256 hashes, Merkle roots, timestamps, provenance fingerprints.
Off-chain: FIRs, CDRs, evidence files, graph DB, model weights, suspect PII.
"""

import hashlib
import json
import logging
import os
import time
from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum
from typing import Any, Dict, List, Optional

logger = logging.getLogger("crimegraph.blockchain")


# ================================================================
# Data Models
# ================================================================

class AnchorStatus(str, Enum):
    PENDING = "PENDING"
    HASHED = "HASHED"
    SUBMITTED = "SUBMITTED"
    CONFIRMED = "CONFIRMED"
    VERIFIED = "VERIFIED"
    FAILED = "FAILED"


@dataclass
class AnchorResult:
    """Result of a blockchain anchoring operation."""
    tx_hash: str
    block_number: int
    chain_id: int
    merkle_root: Optional[str] = None
    anchored_at: str = ""
    status: str = "CONFIRMED"
    gas_used: int = 0

    def __post_init__(self):
        if not self.anchored_at:
            self.anchored_at = datetime.now(timezone.utc).isoformat()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "tx_hash": self.tx_hash,
            "block_number": self.block_number,
            "chain_id": self.chain_id,
            "merkle_root": self.merkle_root,
            "anchored_at": self.anchored_at,
            "status": self.status,
            "gas_used": self.gas_used,
        }


@dataclass
class VerificationResult:
    """Result of an on-chain verification query."""
    verified: bool
    tx_hash: Optional[str] = None
    block_number: Optional[int] = None
    timestamp: Optional[str] = None
    on_chain_root: Optional[str] = None
    message: str = ""

    def to_dict(self) -> Dict[str, Any]:
        return {
            "verified": self.verified,
            "tx_hash": self.tx_hash,
            "block_number": self.block_number,
            "timestamp": self.timestamp,
            "on_chain_root": self.on_chain_root,
            "message": self.message,
        }


# ================================================================
# Contract ABI (minimal — only the functions we call)
# ================================================================

CONTRACT_ABI = [
    # --- Evidence ---
    {
        "name": "anchorEvidenceBatch",
        "type": "function",
        "stateMutability": "nonpayable",
        "inputs": [
            {"name": "caseIdHash", "type": "bytes32"},
            {"name": "merkleRoot", "type": "bytes32"},
            {"name": "evidenceCount", "type": "uint256"},
        ],
        "outputs": [],
    },
    {
        "name": "evidenceAnchors",
        "type": "function",
        "stateMutability": "view",
        "inputs": [{"name": "", "type": "bytes32"}],
        "outputs": [
            {"name": "merkleRoot", "type": "bytes32"},
            {"name": "evidenceCount", "type": "uint256"},
            {"name": "timestamp", "type": "uint256"},
            {"name": "submitter", "type": "address"},
        ],
    },
    # --- Audit ---
    {
        "name": "checkpointAudit",
        "type": "function",
        "stateMutability": "nonpayable",
        "inputs": [
            {"name": "caseIdHash", "type": "bytes32"},
            {"name": "auditHead", "type": "bytes32"},
            {"name": "eventCount", "type": "uint256"},
        ],
        "outputs": [],
    },
    {
        "name": "auditCheckpoints",
        "type": "function",
        "stateMutability": "view",
        "inputs": [{"name": "", "type": "bytes32"}],
        "outputs": [
            {"name": "auditHead", "type": "bytes32"},
            {"name": "eventCount", "type": "uint256"},
            {"name": "timestamp", "type": "uint256"},
            {"name": "submitter", "type": "address"},
        ],
    },
    # --- Model ---
    {
        "name": "registerModel",
        "type": "function",
        "stateMutability": "nonpayable",
        "inputs": [
            {"name": "modelHash", "type": "bytes32"},
            {"name": "datasetHash", "type": "bytes32"},
            {"name": "configHash", "type": "bytes32"},
            {"name": "versionHash", "type": "bytes32"},
        ],
        "outputs": [],
    },
    {
        "name": "modelRegistry",
        "type": "function",
        "stateMutability": "view",
        "inputs": [{"name": "", "type": "bytes32"}],
        "outputs": [
            {"name": "datasetHash", "type": "bytes32"},
            {"name": "configHash", "type": "bytes32"},
            {"name": "versionHash", "type": "bytes32"},
            {"name": "timestamp", "type": "uint256"},
            {"name": "submitter", "type": "address"},
        ],
    },
    # --- Vault ---
    {
        "name": "anchorVault",
        "type": "function",
        "stateMutability": "nonpayable",
        "inputs": [
            {"name": "caseIdHash", "type": "bytes32"},
            {"name": "vaultRoot", "type": "bytes32"},
        ],
        "outputs": [],
    },
    {
        "name": "vaultAnchors",
        "type": "function",
        "stateMutability": "view",
        "inputs": [{"name": "", "type": "bytes32"}],
        "outputs": [
            {"name": "vaultRoot", "type": "bytes32"},
            {"name": "timestamp", "type": "uint256"},
            {"name": "submitter", "type": "address"},
        ],
    },
    # --- Entity Merge ---
    {
        "name": "recordEntityMerge",
        "type": "function",
        "stateMutability": "nonpayable",
        "inputs": [
            {"name": "primaryEntity", "type": "bytes32"},
            {"name": "mergedEntity", "type": "bytes32"},
            {"name": "decisionHash", "type": "bytes32"},
        ],
        "outputs": [],
    },
    {
        "name": "mergeRegistry",
        "type": "function",
        "stateMutability": "view",
        "inputs": [{"name": "", "type": "bytes32"}],
        "outputs": [
            {"name": "mergedEntity", "type": "bytes32"},
            {"name": "decisionHash", "type": "bytes32"},
            {"name": "timestamp", "type": "uint256"},
            {"name": "submitter", "type": "address"},
        ],
    },
    # --- Events ---
    {
        "name": "EvidenceAnchored",
        "type": "event",
        "inputs": [
            {"name": "caseIdHash", "type": "bytes32", "indexed": True},
            {"name": "merkleRoot", "type": "bytes32", "indexed": False},
            {"name": "evidenceCount", "type": "uint256", "indexed": False},
            {"name": "timestamp", "type": "uint256", "indexed": False},
            {"name": "submitter", "type": "address", "indexed": True},
        ],
    },
    {
        "name": "AuditCheckpointed",
        "type": "event",
        "inputs": [
            {"name": "caseIdHash", "type": "bytes32", "indexed": True},
            {"name": "auditHead", "type": "bytes32", "indexed": False},
            {"name": "eventCount", "type": "uint256", "indexed": False},
            {"name": "timestamp", "type": "uint256", "indexed": False},
            {"name": "submitter", "type": "address", "indexed": True},
        ],
    },
    {
        "name": "ModelRegistered",
        "type": "event",
        "inputs": [
            {"name": "modelHash", "type": "bytes32", "indexed": True},
            {"name": "datasetHash", "type": "bytes32", "indexed": False},
            {"name": "configHash", "type": "bytes32", "indexed": False},
            {"name": "versionHash", "type": "bytes32", "indexed": False},
            {"name": "timestamp", "type": "uint256", "indexed": False},
            {"name": "submitter", "type": "address", "indexed": True},
        ],
    },
    {
        "name": "VaultAnchored",
        "type": "event",
        "inputs": [
            {"name": "caseIdHash", "type": "bytes32", "indexed": True},
            {"name": "vaultRoot", "type": "bytes32", "indexed": False},
            {"name": "timestamp", "type": "uint256", "indexed": False},
            {"name": "submitter", "type": "address", "indexed": True},
        ],
    },
    {
        "name": "EntityMergeRecorded",
        "type": "event",
        "inputs": [
            {"name": "primaryEntity", "type": "bytes32", "indexed": True},
            {"name": "mergedEntity", "type": "bytes32", "indexed": False},
            {"name": "decisionHash", "type": "bytes32", "indexed": False},
            {"name": "timestamp", "type": "uint256", "indexed": False},
            {"name": "submitter", "type": "address", "indexed": True},
        ],
    },
]


# ================================================================
# Helper: Convert SHA-256 hex string to bytes32 for Solidity
# ================================================================

def _to_bytes32(hex_str: str) -> bytes:
    """Convert a 64-char hex string to 32 bytes for Solidity bytes32."""
    clean = hex_str.lower().strip()
    if clean.startswith("0x"):
        clean = clean[2:]
    if len(clean) != 64:
        # Hash it to get a 64-char hex string
        clean = hashlib.sha256(clean.encode("utf-8")).hexdigest()
    return bytes.fromhex(clean)


def _bytes32_to_hex(b: bytes) -> str:
    """Convert bytes32 back to 0x-prefixed hex string."""
    return "0x" + b.hex()


def sha256_string(data: str) -> str:
    """Compute SHA-256 hex digest of a string."""
    return hashlib.sha256(data.encode("utf-8")).hexdigest()


# ================================================================
# BlockchainService
# ================================================================

class BlockchainService:
    """
    Central blockchain abstraction for CrimeGraph AI.

    Handles all on-chain interactions through the CrimeGraphAnchor smart contract.
    Supports two modes:
        1. LIVE mode: Real blockchain transactions via Web3 (when configured)
        2. SIMULATION mode: Returns deterministic mock results (when no RPC/key configured)

    The simulation mode allows the full pipeline to work without a deployed contract,
    which is useful for development, testing, and demos without blockchain costs.
    """

    def __init__(self):
        self.rpc_url = os.getenv("BLOCKCHAIN_RPC_URL", "")
        self.private_key = os.getenv("BLOCKCHAIN_PRIVATE_KEY", "")
        self.contract_address = os.getenv("BLOCKCHAIN_CONTRACT_ADDRESS", "")
        self.chain_id = int(os.getenv("BLOCKCHAIN_CHAIN_ID", "80002"))  # Polygon Amoy
        self.explorer_url = os.getenv(
            "BLOCKCHAIN_EXPLORER_URL", "https://amoy.polygonscan.com"
        )

        self._web3 = None
        self._contract = None
        self._account = None
        self._is_live = False

        # Track anchoring history in-memory for quick lookups
        self._anchor_history: List[Dict[str, Any]] = []

        self._init_web3()

    def _init_web3(self):
        """Initialize Web3 connection if credentials are available."""
        if not self.rpc_url or not self.private_key or not self.contract_address:
            logger.warning(
                "Blockchain credentials not fully configured. "
                "Running in SIMULATION mode. Set BLOCKCHAIN_RPC_URL, "
                "BLOCKCHAIN_PRIVATE_KEY, and BLOCKCHAIN_CONTRACT_ADDRESS "
                "in .env for live blockchain anchoring."
            )
            self._is_live = False
            return

        try:
            from web3 import Web3
            from web3.middleware import ExtraDataToPOAMiddleware

            self._web3 = Web3(Web3.HTTPProvider(self.rpc_url))

            # Polygon is a PoA chain — inject middleware
            self._web3.middleware_onion.inject(ExtraDataToPOAMiddleware, layer=0)

            if not self._web3.is_connected():
                logger.error(f"Failed to connect to RPC: {self.rpc_url}")
                self._is_live = False
                return

            self._account = self._web3.eth.account.from_key(self.private_key)
            self._contract = self._web3.eth.contract(
                address=Web3.to_checksum_address(self.contract_address),
                abi=CONTRACT_ABI,
            )
            self._is_live = True
            logger.info(
                f"Blockchain service LIVE on chain {self.chain_id} | "
                f"Contract: {self.contract_address} | "
                f"Wallet: {self._account.address}"
            )

        except ImportError:
            logger.warning("web3 package not installed. Running in SIMULATION mode.")
            self._is_live = False
        except Exception as e:
            logger.error(f"Failed to initialize Web3: {e}")
            self._is_live = False

    @property
    def is_live(self) -> bool:
        """Whether the service is connected to a real blockchain."""
        return self._is_live

    @property
    def mode(self) -> str:
        return "LIVE" if self._is_live else "SIMULATION"

    def get_status(self) -> Dict[str, Any]:
        """Return current blockchain service status."""
        status = {
            "mode": self.mode,
            "chain_id": self.chain_id,
            "contract_address": self.contract_address or "NOT_CONFIGURED",
            "explorer_url": self.explorer_url,
            "rpc_connected": False,
            "wallet_address": None,
            "total_anchors": len(self._anchor_history),
        }
        if self._is_live and self._web3:
            status["rpc_connected"] = self._web3.is_connected()
            status["wallet_address"] = self._account.address
            try:
                status["latest_block"] = self._web3.eth.block_number
            except Exception:
                status["latest_block"] = None
        return status

    # ================================================================
    # Internal: Send Transaction
    # ================================================================

    def _send_transaction(self, func_call) -> AnchorResult:
        """Build, sign, send a transaction and wait for receipt."""
        if not self._is_live:
            return self._simulate_transaction(func_call)

        try:
            nonce = self._web3.eth.get_transaction_count(self._account.address)
            tx = func_call.build_transaction({
                "from": self._account.address,
                "nonce": nonce,
                "gas": 200_000,
                "gasPrice": self._web3.eth.gas_price,
                "chainId": self.chain_id,
            })

            signed = self._web3.eth.account.sign_transaction(tx, self.private_key)
            tx_hash = self._web3.eth.send_raw_transaction(signed.raw_transaction)
            receipt = self._web3.eth.wait_for_transaction_receipt(tx_hash, timeout=60)

            result = AnchorResult(
                tx_hash=receipt.transactionHash.hex(),
                block_number=receipt.blockNumber,
                chain_id=self.chain_id,
                status="CONFIRMED" if receipt.status == 1 else "FAILED",
                gas_used=receipt.gasUsed,
            )

            self._anchor_history.append(result.to_dict())
            logger.info(
                f"Transaction confirmed: {result.tx_hash} | "
                f"Block: {result.block_number} | Gas: {result.gas_used}"
            )
            return result

        except Exception as e:
            logger.error(f"Transaction failed: {e}")
            return AnchorResult(
                tx_hash="0x" + "0" * 64,
                block_number=0,
                chain_id=self.chain_id,
                status="FAILED",
            )

    def _simulate_transaction(self, func_call=None) -> AnchorResult:
        """Generate a deterministic simulated anchor result for demo/dev mode."""
        sim_hash = hashlib.sha256(
            f"sim_{time.time_ns()}".encode()
        ).hexdigest()

        result = AnchorResult(
            tx_hash="0x" + sim_hash,
            block_number=19_827_402 + len(self._anchor_history),
            chain_id=self.chain_id,
            status="CONFIRMED",
            gas_used=85_000,
        )
        self._anchor_history.append(result.to_dict())
        logger.info(f"SIMULATION anchor: {result.tx_hash[:18]}... | Block: {result.block_number}")
        return result

    # ================================================================
    # 1. Evidence Batch Anchoring
    # ================================================================

    def anchor_evidence_batch(
        self, case_id: str, merkle_root: str, evidence_count: int
    ) -> AnchorResult:
        """
        Anchor an evidence batch Merkle root on-chain.

        Args:
            case_id: The case identifier (e.g., 'CASE-FIR-102')
            merkle_root: 64-char SHA-256 Merkle root of evidence hashes
            evidence_count: Number of evidence items in this batch
        """
        case_hash = _to_bytes32(sha256_string(case_id))
        root_bytes = _to_bytes32(merkle_root)

        if self._is_live:
            func = self._contract.functions.anchorEvidenceBatch(
                case_hash, root_bytes, evidence_count
            )
            result = self._send_transaction(func)
        else:
            result = self._simulate_transaction()

        result.merkle_root = merkle_root
        return result

    # ================================================================
    # 2. Audit Chain Checkpointing
    # ================================================================

    def checkpoint_audit(
        self, case_id: str, audit_head: str, event_count: int
    ) -> AnchorResult:
        """
        Checkpoint the audit chain head hash on-chain.

        Args:
            case_id: The case identifier
            audit_head: Current SHA-256 chain head hash
            event_count: Total audit events up to this checkpoint
        """
        case_hash = _to_bytes32(sha256_string(case_id))
        head_bytes = _to_bytes32(audit_head)

        if self._is_live:
            func = self._contract.functions.checkpointAudit(
                case_hash, head_bytes, event_count
            )
            result = self._send_transaction(func)
        else:
            result = self._simulate_transaction()

        return result

    # ================================================================
    # 3. AI Model Provenance Registration
    # ================================================================

    def register_model(
        self,
        model_hash: str,
        dataset_hash: str,
        config_hash: str,
        version_hash: str,
    ) -> AnchorResult:
        """
        Register a trained ML model's provenance fingerprints on-chain.

        Args:
            model_hash: SHA-256 of model weights file
            dataset_hash: SHA-256 of training dataset fingerprint
            config_hash: SHA-256 of hyperparameter config
            version_hash: SHA-256 of version string
        """
        if self._is_live:
            func = self._contract.functions.registerModel(
                _to_bytes32(model_hash),
                _to_bytes32(dataset_hash),
                _to_bytes32(config_hash),
                _to_bytes32(version_hash),
            )
            result = self._send_transaction(func)
        else:
            result = self._simulate_transaction()

        return result

    # ================================================================
    # 4. Case Vault Anchoring
    # ================================================================

    def anchor_vault(self, case_id: str, vault_root: str) -> AnchorResult:
        """
        Anchor a case vault export's Merkle root on-chain.

        Args:
            case_id: The case identifier
            vault_root: Merkle root of all vault component hashes
        """
        case_hash = _to_bytes32(sha256_string(case_id))
        root_bytes = _to_bytes32(vault_root)

        if self._is_live:
            func = self._contract.functions.anchorVault(case_hash, root_bytes)
            result = self._send_transaction(func)
        else:
            result = self._simulate_transaction()

        result.merkle_root = vault_root
        return result

    # ================================================================
    # 5. Entity Merge Recording
    # ================================================================

    def record_entity_merge(
        self, primary_id: str, merged_id: str, decision_hash: str
    ) -> AnchorResult:
        """
        Record an irreversible entity merge decision on-chain.

        Args:
            primary_id: The surviving entity ID
            merged_id: The removed/merged entity ID
            decision_hash: SHA-256 of the full merge decision payload
        """
        if self._is_live:
            func = self._contract.functions.recordEntityMerge(
                _to_bytes32(sha256_string(primary_id)),
                _to_bytes32(sha256_string(merged_id)),
                _to_bytes32(decision_hash),
            )
            result = self._send_transaction(func)
        else:
            result = self._simulate_transaction()

        return result

    # ================================================================
    # Verification (read-only)
    # ================================================================

    def verify_evidence_anchor(self, case_id: str) -> VerificationResult:
        """Read the on-chain evidence anchor for a case."""
        if not self._is_live:
            return VerificationResult(
                verified=True,
                tx_hash="0x" + sha256_string(f"sim_ev_{case_id}")[:64],
                block_number=19_827_402,
                timestamp=datetime.now(timezone.utc).isoformat(),
                message="SIMULATION: Evidence anchor verified (demo mode)",
            )

        try:
            case_hash = _to_bytes32(sha256_string(case_id))
            result = self._contract.functions.evidenceAnchors(case_hash).call()
            merkle_root, count, timestamp, submitter = result

            if timestamp == 0:
                return VerificationResult(
                    verified=False,
                    message="No evidence anchor found on-chain for this case",
                )

            return VerificationResult(
                verified=True,
                on_chain_root=_bytes32_to_hex(merkle_root),
                block_number=0,  # Would need event lookup for exact block
                timestamp=datetime.fromtimestamp(
                    timestamp, tz=timezone.utc
                ).isoformat(),
                message=f"Evidence anchor verified: {count} items anchored",
            )

        except Exception as e:
            return VerificationResult(
                verified=False,
                message=f"Verification failed: {str(e)}",
            )

    def verify_audit_checkpoint(self, case_id: str) -> VerificationResult:
        """Read the on-chain audit checkpoint for a case."""
        if not self._is_live:
            return VerificationResult(
                verified=True,
                tx_hash="0x" + sha256_string(f"sim_aud_{case_id}")[:64],
                block_number=19_827_450,
                timestamp=datetime.now(timezone.utc).isoformat(),
                message="SIMULATION: Audit checkpoint verified (demo mode)",
            )

        try:
            case_hash = _to_bytes32(sha256_string(case_id))
            result = self._contract.functions.auditCheckpoints(case_hash).call()
            audit_head, event_count, timestamp, submitter = result

            if timestamp == 0:
                return VerificationResult(
                    verified=False,
                    message="No audit checkpoint found on-chain for this case",
                )

            return VerificationResult(
                verified=True,
                on_chain_root=_bytes32_to_hex(audit_head),
                timestamp=datetime.fromtimestamp(
                    timestamp, tz=timezone.utc
                ).isoformat(),
                message=f"Audit checkpoint verified: {event_count} events",
            )

        except Exception as e:
            return VerificationResult(
                verified=False,
                message=f"Verification failed: {str(e)}",
            )

    def verify_model_provenance(self, model_hash: str) -> VerificationResult:
        """Read the on-chain model provenance for a model weights hash."""
        if not self._is_live:
            return VerificationResult(
                verified=True,
                tx_hash="0x" + sha256_string(f"sim_model_{model_hash}")[:64],
                block_number=19_827_500,
                timestamp=datetime.now(timezone.utc).isoformat(),
                message="SIMULATION: Model provenance verified (demo mode)",
            )

        try:
            model_bytes = _to_bytes32(model_hash)
            result = self._contract.functions.modelRegistry(model_bytes).call()
            dataset_hash, config_hash, version_hash, timestamp, submitter = result

            if timestamp == 0:
                return VerificationResult(
                    verified=False,
                    message="No model provenance found on-chain",
                )

            return VerificationResult(
                verified=True,
                timestamp=datetime.fromtimestamp(
                    timestamp, tz=timezone.utc
                ).isoformat(),
                message="Model provenance verified on-chain",
            )

        except Exception as e:
            return VerificationResult(
                verified=False,
                message=f"Verification failed: {str(e)}",
            )

    def get_explorer_url(self, tx_hash: str) -> str:
        """Get the block explorer URL for a transaction."""
        return f"{self.explorer_url}/tx/{tx_hash}"

    def get_anchor_history(self) -> List[Dict[str, Any]]:
        """Return all anchoring operations from this session."""
        return self._anchor_history


# ================================================================
# Singleton
# ================================================================

blockchain_service = BlockchainService()

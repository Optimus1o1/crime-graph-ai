"""
CrimeGraph AI — Evidence Anchoring Service.

Manages evidence batching, Merkle tree construction, and on-chain anchoring
via the BlockchainService.

Pipeline:
    Evidence items -> SHA-256 digests -> Merkle Tree -> Merkle Root -> Blockchain Anchor
"""

import logging
from typing import Dict, List, Optional, Any
from datetime import datetime, timezone

from backend.utils.merkle import build_merkle_tree, get_merkle_proof, verify_merkle_proof, MerkleTree
from backend.services.blockchain_service import blockchain_service, AnchorResult, VerificationResult
from backend.models.schemas import EvidenceItem, BlockchainProof

logger = logging.getLogger("crimegraph.evidence_anchor")


class EvidenceAnchorService:
    def __init__(self):
        # Maps case_id -> MerkleTree instance
        self.case_trees: Dict[str, MerkleTree] = {}
        # Maps case_id -> latest AnchorResult
        self.case_anchors: Dict[str, AnchorResult] = {}
        # Pending evidence items waiting to be batched
        self.pending_evidence: Dict[str, List[str]] = {}

    def add_to_pending(self, case_id: str, sha256_hash: str):
        """Add an evidence SHA-256 hash to the pending batch for a case."""
        if case_id not in self.pending_evidence:
            self.pending_evidence[case_id] = []
        if sha256_hash not in self.pending_evidence[case_id]:
            self.pending_evidence[case_id].append(sha256_hash)

    def anchor_case_evidence(self, case_id: str, evidence_items: List[EvidenceItem]) -> AnchorResult:
        """
        Builds a Merkle tree from all evidence items in the case,
        anchors the Merkle root on blockchain, and updates each evidence item with proof metadata.
        """
        if not evidence_items:
            raise ValueError(f"No evidence items provided for case {case_id}")

        hashes = [e.sha256 for e in evidence_items]
        tree = build_merkle_tree(hashes)
        self.case_trees[case_id] = tree

        # Submit Merkle root to blockchain
        anchor_res = blockchain_service.anchor_evidence_batch(
            case_id=case_id,
            merkle_root=tree.root,
            evidence_count=len(evidence_items)
        )
        self.case_anchors[case_id] = anchor_res

        # Update evidence items with blockchain proof
        for item in evidence_items:
            try:
                proof_path = get_merkle_proof(tree, item.sha256)
            except Exception:
                proof_path = []

            item.blockchain = BlockchainProof(
                sha256=item.sha256,
                merkle_root=tree.root,
                tx_hash=anchor_res.tx_hash,
                block_number=anchor_res.block_number,
                chain_id=anchor_res.chain_id,
                anchored_at=anchor_res.anchored_at,
                verification_status="CONFIRMED" if anchor_res.status == "CONFIRMED" else "FAILED",
                explorer_url=blockchain_service.get_explorer_url(anchor_res.tx_hash)
            )

        logger.info(
            f"Successfully anchored case {case_id} ({len(evidence_items)} items) -> "
            f"Root: {tree.root[:16]}... | Tx: {anchor_res.tx_hash[:16]}..."
        )
        return anchor_res

    def verify_evidence(
        self,
        case_id: str,
        evidence_item: EvidenceItem,
        expected_sha256: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Verifies an evidence item's integrity against the case's on-chain anchor:
        1. Validates current SHA-256 matches expected file/record hash.
        2. Retrieves Merkle proof and verifies against local tree root.
        3. Checks on-chain anchor validity via blockchain_service.
        """
        target_sha = (expected_sha256 or evidence_item.sha256).lower().strip()
        
        # 1. Tamper check on local hash
        if expected_sha256 and target_sha != evidence_item.sha256.lower().strip():
            return {
                "verified": False,
                "reason": "SHA-256 mismatch: Data has been altered locally!",
                "status": "FAILED",
                "sha256": target_sha,
                "expected_sha256": evidence_item.sha256
            }

        # 2. Merkle Tree proof check
        tree = self.case_trees.get(case_id)
        if not tree:
            # If tree isn't cached, check if evidence has anchored metadata
            if evidence_item.blockchain and evidence_item.blockchain.merkle_root:
                on_chain_root = evidence_item.blockchain.merkle_root
            else:
                return {
                    "verified": False,
                    "reason": f"No Merkle tree or anchor record found for case {case_id}",
                    "status": "PENDING"
                }
        else:
            on_chain_root = tree.root
            try:
                proof = get_merkle_proof(tree, target_sha)
                proof_valid = verify_merkle_proof(target_sha, proof, on_chain_root)
                if not proof_valid:
                    return {
                        "verified": False,
                        "reason": "Merkle proof verification failed against root",
                        "status": "FAILED"
                    }
            except Exception as e:
                return {
                    "verified": False,
                    "reason": f"Failed to compute Merkle proof: {str(e)}",
                    "status": "FAILED"
                }

        # 3. On-chain validation
        on_chain_res = blockchain_service.verify_evidence_anchor(case_id)
        
        return {
            "verified": on_chain_res.verified,
            "status": "VERIFIED" if on_chain_res.verified else "FAILED",
            "sha256": target_sha,
            "merkle_root": on_chain_root,
            "tx_hash": evidence_item.blockchain.tx_hash if evidence_item.blockchain else on_chain_res.tx_hash,
            "block_number": evidence_item.blockchain.block_number if evidence_item.blockchain else on_chain_res.block_number,
            "anchored_at": evidence_item.blockchain.anchored_at if evidence_item.blockchain else on_chain_res.timestamp,
            "explorer_url": evidence_item.blockchain.explorer_url if evidence_item.blockchain else (
                blockchain_service.get_explorer_url(on_chain_res.tx_hash) if on_chain_res.tx_hash else None
            ),
            "message": on_chain_res.message
        }


evidence_anchor_service = EvidenceAnchorService()

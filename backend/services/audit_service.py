"""
CrimeGraph AI — Cryptographic SHA-256 Audit Ledger & Blockchain Checkpointing.

Replaces the previous demo-grade DJB2 in-memory hash chain with a true
cryptographic SHA-256 chained audit trail. Periodically checkpoints
the audit chain head to the blockchain (Polygon PoS / Amoy) for external
immutability and tamper-detection.

Audit Hash Formula:
    current_hash = SHA256(previous_hash + event_id + timestamp + actor_id + action + resource_id + payload_hash)
"""

import hashlib
import logging
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional

from backend.services.blockchain_service import blockchain_service, AnchorResult

logger = logging.getLogger("crimegraph.audit")

GENESIS_HASH = "0" * 64


class AuditService:
    def __init__(self):
        self.entries: List[Dict[str, Any]] = []
        self.last_hash: str = GENESIS_HASH
        self.event_counter: int = 0
        self.latest_checkpoint: Optional[Dict[str, Any]] = None
        self.checkpoint_interval: int = 25  # Checkpoint to blockchain every 25 events

        # Seed the genesis entry
        self._seed_genesis()

    def _seed_genesis(self):
        t = datetime.now(timezone.utc).isoformat()
        genesis_entry = {
            "event_id": "AUD-00000",
            "timestamp": t,
            "action": "Audit Ledger Initialized — Genesis Block",
            "user": "SYSTEM",
            "actor_id": "SYSTEM",
            "resource_id": "LEDGER",
            "payload_hash": hashlib.sha256(b"GENESIS_SEED").hexdigest(),
            "previous_hash": "0" * 64,
            "hash": hashlib.sha256(f"{GENESIS_HASH}|AUD-00000|{t}|SYSTEM|Genesis|LEDGER".encode()).hexdigest(),
            "checkpoint_tx": None,
            "checkpoint_block": None
        }
        self.entries.append(genesis_entry)
        self.last_hash = genesis_entry["hash"]

    def log(
        self,
        action: str,
        user: str = "investigator",
        resource_id: str = "DEFAULT",
        payload_data: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Appends a cryptographically linked SHA-256 event to the audit ledger.
        Automatically checkpoints to blockchain when threshold is met.
        """
        self.event_counter += 1
        event_id = f"AUD-{self.event_counter:05d}"
        t = datetime.now(timezone.utc).isoformat()
        
        payload_hash = hashlib.sha256(payload_data.encode("utf-8")).hexdigest() if payload_data else hashlib.sha256(b"").hexdigest()

        # Compute tamper-evident hash linking to the previous entry
        raw_string = f"{self.last_hash}|{event_id}|{t}|{user}|{action}|{resource_id}|{payload_hash}"
        new_hash = hashlib.sha256(raw_string.encode("utf-8")).hexdigest()

        entry = {
            "event_id": event_id,
            "timestamp": t,
            "action": action,
            "user": user,
            "actor_id": user,
            "resource_id": resource_id,
            "payload_hash": payload_hash,
            "previous_hash": self.last_hash,
            "hash": new_hash,
            "checkpoint_tx": None,
            "checkpoint_block": None
        }

        self.last_hash = new_hash
        self.entries.append(entry)

        # Periodic checkpointing to blockchain
        if len(self.entries) % self.checkpoint_interval == 0:
            try:
                self.checkpoint_to_blockchain(case_id="CG-GLOBAL-AUDIT")
            except Exception as e:
                logger.warning(f"Background checkpointing failed: {e}")

        return entry

    def get_entries(self) -> List[Dict[str, Any]]:
        return self.entries

    def get_chain_head(self) -> Dict[str, Any]:
        return {
            "head_hash": self.last_hash,
            "total_events": len(self.entries),
            "latest_checkpoint": self.latest_checkpoint
        }

    def checkpoint_to_blockchain(self, case_id: str = "CG-GLOBAL-AUDIT") -> AnchorResult:
        """
        Submits the current audit chain head to the blockchain.
        Updates the most recent entry with the transaction and block receipts.
        """
        res = blockchain_service.checkpoint_audit(
            case_id=case_id,
            audit_head=self.last_hash,
            event_count=len(self.entries)
        )

        self.latest_checkpoint = {
            "case_id": case_id,
            "audit_head": self.last_hash,
            "event_count": len(self.entries),
            "tx_hash": res.tx_hash,
            "block_number": res.block_number,
            "timestamp": res.anchored_at,
            "explorer_url": blockchain_service.get_explorer_url(res.tx_hash)
        }

        if self.entries:
            self.entries[-1]["checkpoint_tx"] = res.tx_hash
            self.entries[-1]["checkpoint_block"] = res.block_number

        logger.info(
            f"Audit chain checkpointed to blockchain: Block #{res.block_number} | "
            f"Head: {self.last_hash[:16]}... | Tx: {res.tx_hash[:16]}..."
        )
        return res

    def verify_chain(self) -> bool:
        """
        Replays the cryptographic hash chain from Genesis forward.
        Detects any tampering, reordering, deletion, or modification.
        """
        if not self.entries:
            return True

        # Verify from the second entry forward (first is genesis)
        for i in range(1, len(self.entries)):
            entry = self.entries[i]
            prev_entry = self.entries[i - 1]

            if entry["previous_hash"] != prev_entry["hash"]:
                logger.error(f"Broken chain link at {entry['event_id']}")
                return False

            raw_string = f"{entry['previous_hash']}|{entry['event_id']}|{entry['timestamp']}|{entry['user']}|{entry['action']}|{entry['resource_id']}|{entry['payload_hash']}"
            expected_hash = hashlib.sha256(raw_string.encode("utf-8")).hexdigest()

            if expected_hash != entry["hash"]:
                logger.error(f"Hash collision or data alteration detected at {entry['event_id']}")
                return False

        return True


# Singleton
audit_service = AuditService()

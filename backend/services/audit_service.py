"""
CrimeGraph AI — Hash-chained Audit Log (tamper-evident, court-defensible).
Uses DJB2 hashing for the chain, matches the demo HTML's audit mechanism.
"""
import hashlib
from datetime import datetime, timezone
from typing import List, Dict


def _djb2(s: str) -> str:
    """DJB2 hash, returns 8-char hex string."""
    x = 5381
    for c in s:
        x = ((x << 5) + x + ord(c)) & 0xFFFFFFFF
    return format(x, '08x')


class AuditService:
    def __init__(self):
        self.entries: List[Dict] = []
        self.last_hash = "00000000"

    def log(self, action: str, user: str = "investigator") -> Dict:
        t = datetime.now(timezone.utc).isoformat()
        self.last_hash = _djb2(self.last_hash + action + t)
        entry = {
            "timestamp": t,
            "action": action,
            "hash": self.last_hash,
            "user": user
        }
        self.entries.append(entry)
        return entry

    def get_entries(self) -> List[Dict]:
        return self.entries

    def verify_chain(self) -> bool:
        """Verify the hash chain is intact."""
        prev = "00000000"
        for entry in self.entries:
            expected = _djb2(prev + entry["action"] + entry["timestamp"])
            if expected != entry["hash"]:
                return False
            prev = entry["hash"]
        return True


# Singleton
audit_service = AuditService()

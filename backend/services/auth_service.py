"""
Authentication and Identity Service for CrimeGraph AI.
Implements PBKDF2-HMAC-SHA256 password hashing, signed session tokens,
Role-Based Access Control (RBAC), and default investigator credentials.
"""
import os
import hashlib
import hmac
import time
import json
import base64
from typing import Dict, Any, Optional

SECRET_KEY = os.getenv("JWT_SECRET", "crimegraph-enterprise-classified-secret-2026")


def hash_password(password: str, salt: Optional[str] = None) -> tuple[str, str]:
    if not salt:
        salt = os.urandom(16).hex()
    key = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt.encode('utf-8'),
        100000
    )
    return key.hex(), salt


def verify_password(password: str, stored_hash: str, salt: str) -> bool:
    key, _ = hash_password(password, salt)
    return hmac.compare_digest(key, stored_hash)


def create_token(payload: Dict[str, Any], expires_in_seconds: int = 86400) -> str:
    header = {"alg": "HS256", "typ": "JWT"}
    body = {**payload, "exp": int(time.time()) + expires_in_seconds}
    
    b64_header = base64.urlsafe_b64encode(json.dumps(header).encode()).decode().rstrip("=")
    b64_body = base64.urlsafe_b64encode(json.dumps(body).encode()).decode().rstrip("=")
    
    signature = hmac.new(
        SECRET_KEY.encode(),
        f"{b64_header}.{b64_body}".encode(),
        hashlib.sha256
    ).digest()
    b64_sig = base64.urlsafe_b64encode(signature).decode().rstrip("=")
    
    return f"{b64_header}.{b64_body}.{b64_sig}"


def verify_token(token: str) -> Optional[Dict[str, Any]]:
    try:
        parts = token.split(".")
        if len(parts) != 3:
            return None
        b64_header, b64_body, b64_sig = parts
        
        # Verify signature
        expected_sig = hmac.new(
            SECRET_KEY.encode(),
            f"{b64_header}.{b64_body}".encode(),
            hashlib.sha256
        ).digest()
        
        # Pad signature
        rem = len(b64_sig) % 4
        padded_sig = b64_sig + ("=" * (4 - rem) if rem else "")
        if not hmac.compare_digest(base64.urlsafe_b64decode(padded_sig), expected_sig):
            return None
            
        rem = len(b64_body) % 4
        padded_body = b64_body + ("=" * (4 - rem) if rem else "")
        payload = json.loads(base64.urlsafe_b64decode(padded_body).decode())
        
        if payload.get("exp", 0) < int(time.time()):
            return None
            
        return payload
    except Exception:
        return None


class AuthService:
    def __init__(self):
        # Pre-seed verified demo investigator accounts
        self.users: Dict[str, Dict[str, Any]] = {}
        
        # 1. Lead Investigator
        h1, s1 = hash_password("investigator123")
        self.users["lead.investigator@crimegraph.gov.in"] = {
            "id": "INV-001",
            "username": "inspector_aniket",
            "email": "lead.investigator@crimegraph.gov.in",
            "full_name": "Inspector Aniket Sharma",
            "agency": "Central Cyber Crime Police Station (CCPS)",
            "clearance_tier": "LEVEL 4 — TOP SECRET",
            "badge_id": "CCPS-BLR-8419",
            "password_hash": h1,
            "salt": s1,
            "role": "LEAD_INVESTIGATOR",
            "created_at": "2026-01-01"
        }
        
        # 2. Senior Analyst
        h2, s2 = hash_password("analyst123")
        self.users["analyst@crimegraph.gov.in"] = {
            "id": "INV-002",
            "username": "analyst_priya",
            "email": "analyst@crimegraph.gov.in",
            "full_name": "Priya Nair",
            "agency": "Financial Intelligence Unit (FIU-IND)",
            "clearance_tier": "LEVEL 3 — SECRET",
            "badge_id": "FIU-IND-104",
            "password_hash": h2,
            "salt": s2,
            "role": "SENIOR_ANALYST",
            "created_at": "2026-01-15"
        }

    def register(self, email: str, username: str, password: str, full_name: str = "", agency: str = "", clearance: str = "LEVEL 2 — CONFIDENTIAL") -> Dict[str, Any]:
        email_clean = email.strip().lower()
        username_clean = username.strip().lower()
        
        # Check duplicates
        for u in self.users.values():
            if u["email"] == email_clean:
                raise ValueError("An investigator account with this email address already exists.")
            if u["username"] == username_clean:
                raise ValueError("This username is already registered.")
                
        if len(password) < 6:
            raise ValueError("Password must be at least 6 characters long.")
            
        p_hash, salt = hash_password(password)
        inv_id = f"INV-{len(self.users) + 1:03d}"
        badge = f"{agency[:4].upper() if agency else 'LE'}-{inv_id}"
        
        user_record = {
            "id": inv_id,
            "username": username_clean,
            "email": email_clean,
            "full_name": full_name or username,
            "agency": agency or "National Cyber Investigation Bureau",
            "clearance_tier": clearance,
            "badge_id": badge,
            "password_hash": p_hash,
            "salt": salt,
            "role": "INVESTIGATOR",
            "created_at": time.strftime("%Y-%m-%d")
        }
        
        self.users[email_clean] = user_record
        token = create_token({
            "sub": inv_id,
            "email": email_clean,
            "username": username_clean,
            "role": user_record["role"],
            "clearance": clearance
        })
        
        # Sanitize password from return
        safe_user = {k: v for k, v in user_record.items() if k not in ["password_hash", "salt"]}
        return {"token": token, "user": safe_user}

    def login(self, identifier: str, password: str) -> Dict[str, Any]:
        ident = identifier.strip().lower()
        
        # Find user by email or username
        target_user = None
        for u in self.users.values():
            if u["email"] == ident or u["username"] == ident:
                target_user = u
                break
                
        if not target_user:
            raise ValueError("Invalid investigator credentials.")
            
        if not verify_password(password, target_user["password_hash"], target_user["salt"]):
            raise ValueError("Invalid investigator credentials.")
            
        token = create_token({
            "sub": target_user["id"],
            "email": target_user["email"],
            "username": target_user["username"],
            "role": target_user["role"],
            "clearance": target_user["clearance_tier"]
        })
        
        safe_user = {k: v for k, v in target_user.items() if k not in ["password_hash", "salt"]}
        return {"token": token, "user": safe_user}

    def get_profile(self, token: str) -> Optional[Dict[str, Any]]:
        payload = verify_token(token)
        if not payload:
            return None
            
        email = payload.get("email")
        user = self.users.get(email)
        if not user:
            return None
            
        return {k: v for k, v in user.items() if k not in ["password_hash", "salt"]}


auth_service = AuthService()

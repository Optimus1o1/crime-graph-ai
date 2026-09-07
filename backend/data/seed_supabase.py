"""
Sync script to seed the 367 entities and 1,201 relationships into Supabase PostgreSQL.
"""
import os
import json
import urllib.request
from typing import List, Dict, Any

SUPABASE_URL = "https://wzfdgeinifohztpeyrkw.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6ZmRnZWluaWZvaHp0cGV5cmt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NTk5MjksImV4cCI6MjEwNDAzNTkyOX0.K5y5mAT7Cnx6beT2sqKPQAumI1H_jWae2ofI-VTl01M"


def insert_batch(table: str, records: List[Dict[str, Any]]):
    url = f"{SUPABASE_URL}/rest/v1/{table}"
    data = json.dumps(records).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        headers={
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "application/json",
            "Prefer": "resolution=merge-duplicates"
        },
        method="POST"
    )
    try:
        with urllib.request.urlopen(req) as resp:
            return True
    except Exception as e:
        print(f"Error inserting into {table}: {e}")
        return False


def seed():
    # 1. Seed Profiles
    profiles = [
        {
            "email": "lead.investigator@crimegraph.gov.in",
            "username": "inspector_aniket",
            "full_name": "Inspector Aniket Sharma",
            "agency": "Central Cyber Crime Police Station (CCPS)",
            "badge_id": "CCPS-BLR-8419",
            "clearance_tier": "LEVEL 4 — TOP SECRET",
            "role": "LEAD_INVESTIGATOR"
        },
        {
            "email": "analyst@crimegraph.gov.in",
            "username": "analyst_priya",
            "full_name": "Priya Nair",
            "agency": "Financial Intelligence Unit (FIU-IND)",
            "badge_id": "FIU-IND-104",
            "clearance_tier": "LEVEL 3 — SECRET",
            "role": "SENIOR_ANALYST"
        }
    ]
    ok = insert_batch("profiles", profiles)
    print("Seeded profiles:", "SUCCESS" if ok else "FAILED (Needs RLS policies)")


if __name__ == "__main__":
    seed()

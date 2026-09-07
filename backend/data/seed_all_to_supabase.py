import os
import csv
import json
import urllib.request

SUPABASE_URL = "https://wzfdgeinifohztpeyrkw.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6ZmRnZWluaWZvaHp0cGV5cmt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NTk5MjksImV4cCI6MjEwNDAzNTkyOX0.K5y5mAT7Cnx6beT2sqKPQAumI1H_jWae2ofI-VTl01M"

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data")


def post_to_supabase(table, records):
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
            print(f"Successfully uploaded {len(records)} records to Supabase table '{table}'")
            return True
    except Exception as e:
        print(f"Error uploading to {table}: {e}")
        return False


def seed_cloud():
    # 1. Cases
    cases = [
        {"case_number": "FIR-1042/2025", "title": "Operation Falcon Syndicate - Multi-State Hawala", "status": "ACTIVE_INVESTIGATION", "jurisdiction": "Bengaluru Central", "section_law": "IPC 420, 120B, 384; IT Act 66D"},
        {"case_number": "FIR-2087/2025", "title": "Cyber Laundering Ring 404", "status": "ACTIVE_INVESTIGATION", "jurisdiction": "Mumbai Cyber Cell", "section_law": "IT Act 66C, 66D; PMLA Sec 3"},
        {"case_number": "FIR-0311/2026", "title": "Coastal Contraband Logistics Nexus", "status": "UNDER_SURVEILLANCE", "jurisdiction": "Delhi EOW", "section_law": "NDPS Act 8(c), 20(b), 27A"},
        {"case_number": "FIR-0450/2026", "title": "SIM Box Telecom Extortion", "status": "ACTIVE_INVESTIGATION", "jurisdiction": "Hyderabad Cyberabad", "section_law": "Indian Telegraph Act Sec 20"}
    ]
    post_to_supabase("cases", cases)

    # 2. Key Entities
    entities = [
        {"id": "P001", "label": "Rahul Kumar", "entity_type": "Person", "community_id": 1, "risk_level": "CRITICAL", "betweenness_score": 0.0405},
        {"id": "P002", "label": "Vikram Malhotra", "entity_type": "Person", "community_id": 2, "risk_level": "CRITICAL", "betweenness_score": 0.0388},
        {"id": "P003", "label": "Viktor Rao", "entity_type": "Person", "community_id": 2, "risk_level": "HIGH", "betweenness_score": 0.0294},
        {"id": "P004", "label": "Amit Sharma", "entity_type": "Person", "community_id": 1, "risk_level": "HIGH", "betweenness_score": 0.0210},
        {"id": "AC-CORE-101", "label": "Primary Hawala Pool Account", "entity_type": "Account", "community_id": 3, "risk_level": "CRITICAL", "betweenness_score": 0.0310},
        {"id": "AC-MULE-201", "label": "Mule Transit Account A", "entity_type": "Account", "community_id": 3, "risk_level": "HIGH", "betweenness_score": 0.0245},
        {"id": "AC-OFFSHORE-501", "label": "Offshore Treasury Shell", "entity_type": "Account", "community_id": 2, "risk_level": "CRITICAL", "betweenness_score": 0.0350},
        {"id": "PH-BURNER-01", "label": "Burner Device IMEI-84710", "entity_type": "Phone", "community_id": 1, "risk_level": "HIGH", "betweenness_score": 0.0180},
        {"id": "KA-01-MJ-4040", "label": "Black SUV - Sighted at Scene", "entity_type": "Vehicle", "community_id": 1, "risk_level": "MED", "betweenness_score": 0.0090}
    ]
    post_to_supabase("graph_entities", entities)

    # 3. Key Relationships
    relationships = [
        {"id": "REL-001", "source": "P001", "target": "AC-CORE-101", "relation_type": "OWNS", "amount": 0, "confidence": 1.00, "is_predicted": False},
        {"id": "REL-002", "source": "AC-CORE-101", "target": "AC-MULE-201", "relation_type": "TRANSFER", "amount": 950000, "confidence": 1.00, "is_predicted": False},
        {"id": "REL-003", "source": "P002", "target": "AC-OFFSHORE-501", "relation_type": "OWNS", "amount": 0, "confidence": 1.00, "is_predicted": False},
        {"id": "REL-004", "source": "P001", "target": "P003", "relation_type": "POTENTIAL_COORDINATION", "amount": 0, "confidence": 0.89, "is_predicted": True}
    ]
    post_to_supabase("graph_relationships", relationships)


if __name__ == "__main__":
    seed_cloud()

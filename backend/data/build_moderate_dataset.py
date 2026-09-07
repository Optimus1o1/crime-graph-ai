"""
Dataset Generator for CrimeGraph AI.
Builds a moderate, realistic investigative intelligence dataset:
- ~350 nodes (Persons, Phones, Accounts, Vehicles, Cases, Safehouses)
- ~1,200 edges (Calls, Transfers, Ownership, FIR citations, Sightings)
- 4 inter-connected syndicates:
  1. North Collection Syndicate (Extortion, street intimidation)
  2. Hawala & Cyber Laundering Ring (Mule accounts, structuring)
  3. Coastal Logistics & Transit Nexus (Contraband, vehicles, GPS tracks)
  4. Executive Syndicate Leadership (Offshore treasury, bridge brokers)
- Embedded Graph Anomalies (Circular mule ring, midnight call burst, bridge emergence)
- Embedded GNN Link Prediction targets (Unrecorded coordination channels)
"""
import os
import csv
import json
import random

random.seed(42)

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))

# -------------------------------------------------------------
# 1. PERSONS (~120 entities)
# -------------------------------------------------------------
FIRST_NAMES = [
    "Rahul", "Vikram", "Viktor", "Amit", "Suresh", "Pooja", "Harish", "Anil", "Deepak",
    "Manish", "Rajesh", "Sunil", "Karan", "Rakesh", "Sanjay", "Vinod", "Manoj", "Ajay",
    "Naveen", "Praveen", "Gaurav", "Rohit", "Mohit", "Ashish", "Sachin", "Nitin", "Vikas",
    "Arun", "Varun", "Tarun", "Kunal", "Alok", "Sameer", "Sumit", "Pankaj", "Neeraj"
]
LAST_NAMES = [
    "Kumar", "Malhotra", "Rao", "Sharma", "Varma", "Tiwari", "Qureshi", "Naik", "Gaikwad",
    "Deshmukh", "Patil", "Yadav", "Singh", "Verma", "Chauhan", "Joshi", "Bhat", "Hegde",
    "Reddy", "Mehta", "Shah", "Agarwal", "Bansal", "Gupta", "Mishra", "Pandey", "Dubey"
]

COMMUNITIES = ["north", "south", "finance", "cyber", "leadership"]

persons = []
# Pre-seed primary case figures
persons.append({"person_id": "P001", "name": "Rahul Kumar", "community_hint": "cyber", "prior_record": 1})
persons.append({"person_id": "P002", "name": "Vikram Malhotra", "community_hint": "leadership", "prior_record": 1})
persons.append({"person_id": "P003", "name": "Viktor Rao", "community_hint": "leadership", "prior_record": 1})
persons.append({"person_id": "P004", "name": "Amit Sharma", "community_hint": "north", "prior_record": 0})
persons.append({"person_id": "P005", "name": "Sunil Varma", "community_hint": "south", "prior_record": 1})

used_names = {"Rahul Kumar", "Vikram Malhotra", "Viktor Rao", "Amit Sharma", "Sunil Varma"}
for i in range(6, 126):
    pid = f"P{i:03d}"
    while True:
        fn = random.choice(FIRST_NAMES)
        ln = random.choice(LAST_NAMES)
        full_name = f"{fn} {ln}"
        if full_name not in used_names:
            used_names.add(full_name)
            break
    comm = random.choice(COMMUNITIES)
    prior = 1 if random.random() < 0.35 else 0
    persons.append({"person_id": pid, "name": full_name, "community_hint": comm, "prior_record": prior})

# -------------------------------------------------------------
# 2. PHONES (~120 devices)
# -------------------------------------------------------------
phones = []
for i, p in enumerate(persons, 1):
    ph_id = f"PH{i:03d}"
    prefix = random.choice(["98", "97", "93", "94", "91", "88", "77", "99"])
    rest = f"{random.randint(10000000, 99999999)}"
    num = f"{prefix}{rest[:8]}"
    m = random.randint(1, 12)
    d = random.randint(1, 28)
    activated = f"2025-{m:02d}-{d:02d}"
    phones.append({
        "phone_id": ph_id,
        "number": num,
        "owner_id": p["person_id"],
        "activated": activated
    })

# Add extra burner phones for leadership/cyber
burner_phones = [
    {"phone_id": "PH-BURNER-01", "number": "9844091823", "owner_id": "P001", "activated": "2026-01-10"},
    {"phone_id": "PH-BURNER-02", "number": "9844091824", "owner_id": "P002", "activated": "2026-01-12"},
    {"phone_id": "PH-BURNER-03", "number": "9844091825", "owner_id": "P003", "activated": "2026-01-15"},
    {"phone_id": "PH-BURNER-04", "number": "9731092841", "owner_id": "P004", "activated": "2026-02-01"},
    {"phone_id": "PH-BURNER-05", "number": "9731092842", "owner_id": "P005", "activated": "2026-02-05"},
]
phones.extend(burner_phones)

# -------------------------------------------------------------
# 3. ACCOUNTS (~65 accounts)
# -------------------------------------------------------------
accounts = []
# Pre-seed mule layering chain
accounts.append({"account_id": "AC-CORE-101", "holder_id": "P001", "opened": "2025-08-10"})
accounts.append({"account_id": "AC-MULE-201", "holder_id": "P006", "opened": "2026-01-15"})
accounts.append({"account_id": "AC-MULE-202", "holder_id": "P007", "opened": "2026-01-20"})
accounts.append({"account_id": "AC-MULE-203", "holder_id": "P008", "opened": "2026-02-01"})
accounts.append({"account_id": "AC-MULE-204", "holder_id": "P009", "opened": "2026-02-05"})
accounts.append({"account_id": "AC-CORP-301", "holder_id": "P002", "opened": "2025-05-12"})
accounts.append({"account_id": "AC-OFFSHORE-501", "holder_id": "P003", "opened": "2024-11-20"})

for i in range(10, 68):
    aid = f"AC{i:03d}"
    holder = persons[i % len(persons)]["person_id"]
    m = random.randint(1, 12)
    d = random.randint(1, 28)
    accounts.append({"account_id": aid, "holder_id": holder, "opened": f"2025-{m:02d}-{d:02d}"})

# -------------------------------------------------------------
# 4. VEHICLES (~35 vehicles)
# -------------------------------------------------------------
vehicles = []
vehicle_prefixes = ["KA-01", "KA-03", "KA-05", "MH-12", "MH-02", "DL-01", "DL-08", "TS-09"]
for i in range(1, 36):
    pref = random.choice(vehicle_prefixes)
    letter = random.choice(["AB", "MJ", "DE", "HA", "CD", "XY", "ZK"])
    num = random.randint(1000, 9999)
    vid = f"{pref}-{letter}-{num}"
    owner = persons[i % len(persons)]["person_id"]
    vehicles.append({"vehicle_id": vid, "owner_id": owner})

# Pre-seed specific vehicles from case evidence
vehicles.append({"vehicle_id": "KA-01-MJ-4040", "owner_id": "P001"})
vehicles.append({"vehicle_id": "MH-12-DE-8821", "owner_id": "P002"})

# -------------------------------------------------------------
# 5. CASES (~10 cases)
# -------------------------------------------------------------
cases = [
    {"case_id": "FIR-1042/2025", "district": "Bengaluru Central", "filed": "2025-11-15"},
    {"case_id": "FIR-2087/2025", "district": "Mumbai Cyber Cell", "filed": "2025-12-20"},
    {"case_id": "FIR-0311/2026", "district": "Delhi EOW", "filed": "2026-01-18"},
    {"case_id": "FIR-0450/2026", "district": "Hyderabad Cyberabad", "filed": "2026-02-04"},
    {"case_id": "FIR-0512/2026", "district": "Bengaluru CCPS", "filed": "2026-02-15"},
    {"case_id": "FIR-0620/2026", "district": "Pune Crime Branch", "filed": "2026-03-01"},
    {"case_id": "FIR-0715/2026", "district": "Kolkata STF", "filed": "2026-03-14"},
    {"case_id": "FIR-0890/2026", "district": "Chennai Cyber Cell", "filed": "2026-03-25"},
    {"case_id": "FIR-0910/2026", "district": "Goa ANC", "filed": "2026-04-02"},
    {"case_id": "FIR-1002/2026", "district": "Ahmedabad Crime Branch", "filed": "2026-04-18"}
]

# -------------------------------------------------------------
# 6. CALLS / CDR (~450 records)
# -------------------------------------------------------------
calls = []
call_records_set = set()

# Pre-seed burst calls between burner phones (Midnight Burst Anomaly)
burst_dates = ["2026-04-02", "2026-04-03", "2026-04-04"]
for bidx in range(1, 25):
    p_src = random.choice(["P001", "P002", "P004"])
    p_dst = random.choice(["P002", "P003", "P005", "P006"])
    if p_src != p_dst:
        cid = f"CDR-BURST-{bidx:03d}"
        calls.append({
            "caller_id": p_src,
            "callee_id": p_dst,
            "call_count": random.randint(5, 18),
            "first_date": random.choice(burst_dates),
            "record_id": cid
        })
        call_records_set.add((p_src, p_dst))

# Intra-community and inter-community calls
for idx in range(1, 420):
    src = random.choice(persons)["person_id"]
    dst = random.choice(persons)["person_id"]
    if src == dst or (src, dst) in call_records_set:
        continue
    call_records_set.add((src, dst))
    m = random.randint(1, 5)
    d = random.randint(1, 28)
    calls.append({
        "caller_id": src,
        "callee_id": dst,
        "call_count": random.randint(1, 14),
        "first_date": f"2026-{m:02d}-{d:02d}",
        "record_id": f"CDR-{len(calls)+1:04d}"
    })

# -------------------------------------------------------------
# 7. TRANSFERS / BANKING (~450 records)
# -------------------------------------------------------------
transfers = []

# Pre-seed Circular Mule Layering Ring (Anomaly #1)
mule_chain = ["AC-CORE-101", "AC-MULE-201", "AC-MULE-202", "AC-MULE-203", "AC-MULE-204", "AC-CORP-301", "AC-OFFSHORE-501"]
for i in range(len(mule_chain) - 1):
    src_ac = mule_chain[i]
    dst_ac = mule_chain[i+1]
    for sub in range(1, 4):
        amt = random.randint(920000, 985000) # Structuring under 10L CTR limit
        transfers.append({
            "src_account": src_ac,
            "dst_account": dst_ac,
            "amount": amt,
            "txn_date": f"2026-03-{14+sub:02d}",
            "record_id": f"TXN-MULE-{len(transfers)+1:03d}"
        })

# General syndicate transactions
acc_ids = [a["account_id"] for a in accounts]
for idx in range(1, 430):
    s = random.choice(acc_ids)
    d = random.choice(acc_ids)
    if s == d:
        continue
    m = random.randint(1, 5)
    day = random.randint(1, 28)
    amt = random.choice([
        random.randint(5000, 45000),
        random.randint(50000, 250000),
        random.randint(300000, 950000)
    ])
    transfers.append({
        "src_account": s,
        "dst_account": d,
        "amount": amt,
        "txn_date": f"2026-{m:02d}-{day:02d}",
        "record_id": f"TXN-{len(transfers)+1:04d}"
    })

# -------------------------------------------------------------
# 8. FIR LINKS (~90 evidentiary links)
# -------------------------------------------------------------
fir_links = []
# Link main accused to FIR-1042 and FIR-0512
fir_links.append({"case_id": "FIR-1042/2025", "entity_type": "person", "entity_id": "P001", "relation": "NAMED_ACCUSED"})
fir_links.append({"case_id": "FIR-1042/2025", "entity_type": "person", "entity_id": "P004", "relation": "NAMED_ACCUSED"})
fir_links.append({"case_id": "FIR-1042/2025", "entity_type": "phone", "entity_id": "PH001", "relation": "CITED"})
fir_links.append({"case_id": "FIR-1042/2025", "entity_type": "vehicle", "entity_id": "KA-01-MJ-4040", "relation": "SEEN_NEAR_SCENE"})

fir_links.append({"case_id": "FIR-0512/2026", "entity_type": "person", "entity_id": "P002", "relation": "NAMED_ACCUSED"})
fir_links.append({"case_id": "FIR-0512/2026", "entity_type": "person", "entity_id": "P003", "relation": "NAMED_ACCUSED"})
fir_links.append({"case_id": "FIR-0512/2026", "entity_type": "phone", "entity_id": "PH-BURNER-02", "relation": "CITED"})
fir_links.append({"case_id": "FIR-0512/2026", "entity_type": "vehicle", "entity_id": "MH-12-DE-8821", "relation": "SEEN_NEAR_SCENE"})

for c in cases:
    cid = c["case_id"]
    # Add 4-8 random persons / phones / vehicles
    for _ in range(random.randint(5, 8)):
        target_p = random.choice(persons)["person_id"]
        fir_links.append({"case_id": cid, "entity_type": "person", "entity_id": target_p, "relation": "NAMED_ACCUSED" if random.random() < 0.3 else "CITED"})
    for _ in range(random.randint(2, 4)):
        target_v = random.choice(vehicles)["vehicle_id"]
        fir_links.append({"case_id": cid, "entity_type": "vehicle", "entity_id": target_v, "relation": "SEEN_NEAR_SCENE"})

# -------------------------------------------------------------
# 9. WRITE CSV FILES
# -------------------------------------------------------------
def write_csv(filename, fieldnames, rows):
    path = os.path.join(CURRENT_DIR, filename)
    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
    print(f"Generated {filename}: {len(rows)} rows")

write_csv("persons.csv", ["person_id", "name", "community_hint", "prior_record"], persons)
write_csv("phones.csv", ["phone_id", "number", "owner_id", "activated"], phones)
write_csv("accounts.csv", ["account_id", "holder_id", "opened"], accounts)
write_csv("vehicles.csv", ["vehicle_id", "owner_id"], vehicles)
write_csv("cases.csv", ["case_id", "district", "filed"], cases)
write_csv("calls.csv", ["caller_id", "callee_id", "call_count", "first_date", "record_id"], calls)
write_csv("transfers.csv", ["src_account", "dst_account", "amount", "txn_date", "record_id"], transfers)
write_csv("fir_links.csv", ["case_id", "entity_type", "entity_id", "relation"], fir_links)

# -------------------------------------------------------------
# 10. PREDICTIONS.JSON (GNN Links for Frontend)
# -------------------------------------------------------------
predictions_data = [
    {"a": "P001", "b": "P003", "score": 0.89, "common_neighbors": ["AC-CORE-101", "AC-MULE-201", "P002"], "evidence": "GraphSAGE: Shared Hawala layering path"},
    {"a": "P002", "b": "AC-OFFSHORE-501", "score": 0.92, "common_neighbors": ["AC-CORP-301", "P003"], "evidence": "GraphSAGE: Offshore beneficial control"},
    {"a": "P001", "b": "P002", "score": 0.94, "common_neighbors": ["AC-CORE-101", "P004"], "evidence": "GraphSAGE: Syndicate bridge coordinator"},
    {"a": "PH-BURNER-01", "b": "PH-BURNER-03", "score": 0.86, "common_neighbors": ["P001", "P003"], "evidence": "GraphSAGE: Coordinated midnight burner burst"},
    {"a": "P004", "b": "P005", "score": 0.81, "common_neighbors": ["P001", "FIR-1042/2025"], "evidence": "GraphSAGE: Inter-state collection nexus"}
]
with open(os.path.join(CURRENT_DIR, "predictions.json"), "w", encoding="utf-8") as f:
    json.dump(predictions_data, f, indent=2)
print("Updated predictions.json with GraphSAGE predicted links")

print("\n--- DATASET GENERATION COMPLETE ---")
print(f"Total Persons:  {len(persons)}")
print(f"Total Phones:   {len(phones)}")
print(f"Total Accounts: {len(accounts)}")
print(f"Total Vehicles: {len(vehicles)}")
print(f"Total Cases:    {len(cases)}")
print(f"Total Calls:    {len(calls)}")
print(f"Total Transfers:{len(transfers)}")
print(f"Total Links:    {len(fir_links)}")

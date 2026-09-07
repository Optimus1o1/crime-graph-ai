"""
Pre-seeded realistic investigative dataset: 'Operation Falcon Syndicate' & 'Cyber Laundering Ring 404'.
Contains 50+ nodes, 100+ relationships, multi-hop shell accounts, burner phone bridges,
duplicate alias candidates, GIS coordinates, and temporal event logs.
"""

from typing import Dict, Any, List

CASES_DATA = [
    {
        "case_id": "CASE-FIR-102",
        "title": "Operation Falcon Syndicate - Multi-State Hawala & Cyber Extortion",
        "fir_number": "FIR-102/2025/CCPS",
        "section_law": "IPC 420, 120B, 384; IT Act 66D, 43; PMLA Sec 3",
        "police_station": "Central Cyber Crime Police Station, Bengaluru",
        "incident_date": "2025-02-15",
        "status": "ACTIVE_INVESTIGATION",
        "primary_accused": ["P-101", "P-104"],
        "description": "Multi-jurisdictional syndicate engaging in digital extortion, SIM box routing, and Hawala money laundering through layered shell bank accounts across Bengaluru, Mumbai, and Delhi.",
        "node_count": 28,
        "edge_count": 46
    },
    {
        "case_id": "CASE-FIR-208",
        "title": "Narcotics & Darknet Logistics Nexus - Coastal Corridor",
        "fir_number": "FIR-208/2025/ANC",
        "section_law": "NDPS Act 8(c), 20(b), 27A, 29",
        "police_station": "Anti-Narcotics Cell, Mumbai",
        "incident_date": "2025-03-01",
        "status": "UNDER_SURVEILLANCE",
        "primary_accused": ["P-106", "P-107"],
        "description": "Cross-border contraband transit leveraging refrigerated logistics front companies and cryptocurrency OTC settlement channels.",
        "node_count": 18,
        "edge_count": 27
    }
]

NODES_DATA: List[Dict[str, Any]] = [
    # Persons
    {
        "id": "P-101",
        "type": "Person",
        "label": "Rahul Kumar",
        "risk_level": "CRITICAL",
        "community_id": 1,
        "degree": 14,
        "betweenness": 0.42,
        "closeness": 0.65,
        "is_bridge": False,
        "properties": {
            "canonical_name": "Rahul Kumar",
            "aliases": ["RK", "Rahul K.", "Rocky BLR"],
            "national_id": "AADHAAR-XXXX-8921",
            "dob": "1988-06-14",
            "role": "Regional Field Coordinator & Fund Dispatcher",
            "status": "Primary Accused",
            "notes": "Coordinating local extortion collections and distributing funds via mule accounts."
        },
        "source_records": ["FIR-102/2025", "CDR-BLR-8891", "TXN-HDFC-9021"]
    },
    {
        "id": "P-102",
        "type": "Person",
        "label": "Ravi Shankar",
        "risk_level": "HIGH",
        "community_id": 1,
        "degree": 8,
        "betweenness": 0.18,
        "closeness": 0.52,
        "is_bridge": False,
        "properties": {
            "canonical_name": "Ravi Shankar",
            "aliases": ["Ravi Indiranagar", "RS-Ops"],
            "national_id": "AADHAAR-XXXX-3312",
            "dob": "1992-11-03",
            "role": "Enforcer & Safehouse Custodian",
            "status": "Suspect",
            "notes": "Frequent communications with Rahul Kumar; witnessed at Indiranagar safehouse."
        },
        "source_records": ["FIR-102/2025", "CDR-BLR-8892", "CCTV-IND-004"]
    },
    {
        "id": "P-103",
        "type": "Person",
        "label": "Vikram Malhotra",
        "risk_level": "CRITICAL",
        "community_id": 2,
        "degree": 12,
        "betweenness": 0.88,
        "closeness": 0.79,
        "is_bridge": True,
        "properties": {
            "canonical_name": "Vikram Malhotra",
            "aliases": ["VM Hawala", "V. Malhotra Mumbai"],
            "national_id": "PAN-XXXXX9910K",
            "dob": "1981-04-22",
            "role": "Hawala Broker & Inter-State Bridge",
            "status": "Key Intermediary",
            "notes": "Critical broker connecting Bengaluru ops cluster with Kingpin Viktor Rao's offshore syndicate."
        },
        "source_records": ["TXN-AXIS-7749", "CDR-MUM-4401", "IB-INTEL-2025-09"]
    },
    {
        "id": "P-104",
        "type": "Person",
        "label": "Viktor Rao",
        "risk_level": "CRITICAL",
        "community_id": 2,
        "degree": 16,
        "betweenness": 0.71,
        "closeness": 0.73,
        "is_bridge": False,
        "properties": {
            "canonical_name": "Viktor Rao",
            "aliases": ["The Architect", "VR-Dubai", "V. K. Rao"],
            "national_id": "PASSPORT-Z9920148",
            "dob": "1976-09-18",
            "role": "Syndicate Kingpin & Mastermind",
            "status": "Main Beneficiary / Wanted",
            "notes": "Controls Orion Global shell entities and orchestrates layered Hawala remittances."
        },
        "source_records": ["FIR-102/2025", "INTERPOL-RED-2024", "SWIFT-HSBC-0092"]
    },
    {
        "id": "P-105",
        "type": "Person",
        "label": "R. Kumar (Candidate)",
        "risk_level": "MEDIUM",
        "community_id": 1,
        "degree": 4,
        "betweenness": 0.05,
        "closeness": 0.45,
        "is_bridge": False,
        "properties": {
            "canonical_name": "R. Kumar",
            "aliases": ["Rahul K."],
            "national_id": "UNVERIFIED",
            "dob": "1988-06-14",
            "role": "Potential Duplicate Entity of Rahul Kumar",
            "status": "Entity Resolution Review Queue",
            "notes": "Registered with same IMEI (354892019284710) and matching DOB. 91% match."
        },
        "source_records": ["CDR-DUMP-AIRTEL-441"]
    },
    {
        "id": "P-106",
        "type": "Person",
        "label": "Ananya Verma",
        "risk_level": "HIGH",
        "community_id": 3,
        "degree": 9,
        "betweenness": 0.35,
        "closeness": 0.58,
        "is_bridge": True,
        "properties": {
            "canonical_name": "Ananya Verma",
            "aliases": ["AV Logistics", "Annie"],
            "national_id": "AADHAAR-XXXX-7721",
            "dob": "1994-02-19",
            "role": "Logistics & Transport Coordinator",
            "status": "Suspect",
            "notes": "Registered owner of Fortuner MH-02-CX-8899; bridges syndicate logistics to Goa corridor."
        },
        "source_records": ["FIR-208/2025", "VAHAN-REG-8899", "FASTAG-BLR-MUM-102"]
    },
    {
        "id": "P-107",
        "type": "Person",
        "label": "Tariq Sheikh",
        "risk_level": "CRITICAL",
        "community_id": 3,
        "degree": 11,
        "betweenness": 0.51,
        "closeness": 0.62,
        "is_bridge": False,
        "properties": {
            "canonical_name": "Tariq Sheikh",
            "aliases": ["TS-Goa", "Tariq Bhai"],
            "national_id": "PASSPORT-M3910241",
            "dob": "1984-12-05",
            "role": "Coastal Distribution & OTC Crypto Settler",
            "status": "Accused",
            "notes": "Receives funds from Viktor Rao's shell accounts and coordinates vehicle drops."
        },
        "source_records": ["FIR-208/2025", "BINANCE-OTC-882", "CDR-GOA-1029"]
    },
    {
        "id": "P-108",
        "type": "Person",
        "label": "Sunita Deshmukh",
        "risk_level": "MEDIUM",
        "community_id": 2,
        "degree": 5,
        "betweenness": 0.12,
        "closeness": 0.49,
        "is_bridge": False,
        "properties": {
            "canonical_name": "Sunita Deshmukh",
            "aliases": ["Director SD"],
            "national_id": "DIN-08910245",
            "dob": "1979-08-30",
            "role": "Nominee Director / Shell Front",
            "status": "Person of Interest",
            "notes": "Signatory on Orion Global Export bank accounts."
        },
        "source_records": ["MCA-ROC-DIR-2024", "BANK-KYC-HSBC-0092"]
    },
    {
        "id": "P-109",
        "type": "Person",
        "label": "Inspector K. Sharma",
        "risk_level": "LOW",
        "community_id": 0,
        "degree": 6,
        "betweenness": 0.02,
        "closeness": 0.35,
        "is_bridge": False,
        "properties": {
            "canonical_name": "Inspector K. Sharma",
            "aliases": ["IO Sharma"],
            "badge_id": "KA-POL-8840",
            "role": "Lead Investigating Officer",
            "status": "Law Enforcement",
            "notes": "Registered FIR-102 and issuing CDR requisition notices."
        },
        "source_records": ["FIR-102/2025"]
    },

    # Phones
    {
        "id": "PH-01",
        "type": "Phone",
        "label": "+91 98765 43210",
        "risk_level": "CRITICAL",
        "community_id": 1,
        "degree": 8,
        "properties": {
            "msisdn": "+919876543210",
            "imei": "354892019284710",
            "imsi": "404450918237461",
            "carrier": "Airtel Karnataka",
            "status": "Active Surveillance"
        },
        "source_records": ["CDR-BLR-8891", "CAF-REG-98765"]
    },
    {
        "id": "PH-02",
        "type": "Phone",
        "label": "+91 98112 23344",
        "risk_level": "HIGH",
        "community_id": 1,
        "degree": 5,
        "properties": {
            "msisdn": "+919811223344",
            "imei": "864910284719203",
            "imsi": "404450882716352",
            "carrier": "Jio Karnataka",
            "status": "Active"
        },
        "source_records": ["CDR-BLR-8892"]
    },
    {
        "id": "PH-03",
        "type": "Phone",
        "label": "+91 99001 12233 (Burner 1)",
        "risk_level": "CRITICAL",
        "community_id": 1,
        "degree": 6,
        "properties": {
            "msisdn": "+919900112233",
            "imei": "359910283746192",
            "imsi": "404200881726354",
            "carrier": "Vi Delhi (Roaming)",
            "is_burner": True,
            "status": "Discarded Post-Crime"
        },
        "source_records": ["CDR-DUMP-TOWER-842", "FIR-102/2025"]
    },
    {
        "id": "PH-04",
        "type": "Phone",
        "label": "+91 88776 65544 (Encrypted Line)",
        "risk_level": "CRITICAL",
        "community_id": 2,
        "degree": 7,
        "properties": {
            "msisdn": "+918877665544",
            "imei": "351092837461920",
            "carrier": "International Roaming eSIM",
            "status": "Encrypted VoIP Gateway"
        },
        "source_records": ["CDR-MUM-4401"]
    },
    {
        "id": "PH-05",
        "type": "Phone",
        "label": "+91 91234 56789",
        "risk_level": "HIGH",
        "community_id": 3,
        "degree": 4,
        "properties": {
            "msisdn": "+919123456789",
            "imei": "860192837461029",
            "carrier": "Airtel Goa",
            "status": "Active"
        },
        "source_records": ["CDR-GOA-1029"]
    },

    # Bank Accounts
    {
        "id": "BA-01",
        "type": "BankAccount",
        "label": "HDFC-90214820 (Rahul K.)",
        "risk_level": "CRITICAL",
        "community_id": 1,
        "degree": 6,
        "properties": {
            "account_number": "50100490214820",
            "bank_name": "HDFC Bank",
            "branch": "Indiranagar, Bengaluru",
            "ifsc": "HDFC0001042",
            "balance_inr": 850000.00
        },
        "source_records": ["TXN-HDFC-9021", "STR-FIU-2025-881"]
    },
    {
        "id": "BA-02",
        "type": "BankAccount",
        "label": "ICICI-38192049 (Account Y - Layering)",
        "risk_level": "CRITICAL",
        "community_id": 1,
        "degree": 5,
        "properties": {
            "account_number": "00290138192049",
            "bank_name": "ICICI Bank",
            "branch": "Koramangala, Bengaluru",
            "ifsc": "ICIC0000029",
            "balance_inr": 2400000.00
        },
        "source_records": ["TXN-ICICI-3819", "STR-FIU-2025-882"]
    },
    {
        "id": "BA-03",
        "type": "BankAccount",
        "label": "AXIS-77491023 (Account Z - Mule)",
        "risk_level": "CRITICAL",
        "community_id": 2,
        "degree": 7,
        "properties": {
            "account_number": "91802077491023",
            "bank_name": "Axis Bank",
            "branch": "BKC, Mumbai",
            "ifsc": "UTIB0000142",
            "balance_inr": 4800000.00
        },
        "source_records": ["TXN-AXIS-7749", "STR-FIU-2025-901"]
    },
    {
        "id": "BA-04",
        "type": "BankAccount",
        "label": "HSBC-00928174 (Orion Global Shell)",
        "risk_level": "CRITICAL",
        "community_id": 2,
        "degree": 6,
        "properties": {
            "account_number": "00294800928174",
            "bank_name": "HSBC India",
            "branch": "Fort, Mumbai",
            "ifsc": "HSBC0400002",
            "balance_inr": 18500000.00
        },
        "source_records": ["SWIFT-HSBC-0092", "ED-PMLA-NOTICE-14"]
    },
    {
        "id": "BA-05",
        "type": "BankAccount",
        "label": "ENBD-55829104 (Offshore Beneficiary)",
        "risk_level": "CRITICAL",
        "community_id": 2,
        "degree": 3,
        "properties": {
            "account_number": "AE29033000055829104",
            "bank_name": "Emirates NBD",
            "branch": "Dubai Internet City",
            "iban": "AE29033000055829104",
            "currency": "AED"
        },
        "source_records": ["SWIFT-WIRE-AE-991"]
    },

    # Vehicles
    {
        "id": "VH-01",
        "type": "Vehicle",
        "label": "KA-01-MJ-4040 (Scorpio)",
        "risk_level": "HIGH",
        "community_id": 1,
        "degree": 5,
        "properties": {
            "plate_number": "KA-01-MJ-4040",
            "make_model": "Mahindra Scorpio S11 (Black)",
            "chassis_vin": "MA1TA2SK4N2091823",
            "anpr_hits": 14
        },
        "source_records": ["ANPR-BLR-AIRPORT-12", "VAHAN-REG-4040"]
    },
    {
        "id": "VH-02",
        "type": "Vehicle",
        "label": "MH-02-CX-8899 (Fortuner)",
        "risk_level": "HIGH",
        "community_id": 3,
        "degree": 4,
        "properties": {
            "plate_number": "MH-02-CX-8899",
            "make_model": "Toyota Fortuner (White)",
            "chassis_vin": "MBJ11VE5008192847",
            "anpr_hits": 9
        },
        "source_records": ["FASTAG-TOLL-MUM-PUN-02", "VAHAN-REG-8899"]
    },
    {
        "id": "VH-03",
        "type": "Vehicle",
        "label": "DL-04-AB-1234 (Creta)",
        "risk_level": "MEDIUM",
        "community_id": 2,
        "degree": 3,
        "properties": {
            "plate_number": "DL-04-AB-1234",
            "make_model": "Hyundai Creta SX (Silver)",
            "chassis_vin": "MALC481CLNM882716",
            "anpr_hits": 6
        },
        "source_records": ["ANPR-DELHI-CP-08"]
    },

    # Cases
    {
        "id": "CASE-101",
        "type": "Case",
        "label": "FIR-102/2025 (Cyber Extortion)",
        "risk_level": "CRITICAL",
        "community_id": 1,
        "degree": 8,
        "properties": {
            "fir_number": "FIR-102/2025",
            "court": "Chief Metropolitan Magistrate, Bengaluru",
            "status": "Active Charge-sheet Stage",
            "crime_category": "Cyber Extortion & Organized Fraud"
        },
        "source_records": ["CCPS-BLR-FIR-102"]
    },
    {
        "id": "CASE-201",
        "type": "Case",
        "label": "FIR-208/2025 (NDPS Transit)",
        "risk_level": "HIGH",
        "community_id": 3,
        "degree": 5,
        "properties": {
            "fir_number": "FIR-208/2025",
            "court": "Special NDPS Court, Mumbai",
            "status": "Surveillance & Interception",
            "crime_category": "Narcotics Corridor"
        },
        "source_records": ["ANC-MUM-FIR-208"]
    },

    # Locations
    {
        "id": "LOC-01",
        "type": "Location",
        "label": "Indiranagar Safehouse, BLR",
        "risk_level": "CRITICAL",
        "community_id": 1,
        "degree": 6,
        "properties": {
            "name": "Indiranagar Safehouse",
            "city": "Bengaluru",
            "latitude": 12.9716,
            "longitude": 77.5946,
            "address": "12th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru 560008",
            "site_type": "Suspected Operational Safehouse"
        },
        "source_records": ["GEO-SURV-BLR-01", "ELECTRICITY-METER-IND-882"]
    },
    {
        "id": "LOC-02",
        "type": "Location",
        "label": "Kempegowda Airport Road, BLR",
        "risk_level": "HIGH",
        "community_id": 1,
        "degree": 5,
        "properties": {
            "name": "Airport Cargo Junction",
            "city": "Bengaluru",
            "latitude": 13.1986,
            "longitude": 77.7066,
            "address": "NH 44, Airport Approach Corridor, Devanahalli, Bengaluru",
            "site_type": "Meeting & Handover Point"
        },
        "source_records": ["ANPR-BLR-AIRPORT-12", "CCTV-AIR-JUNCT-09"]
    },
    {
        "id": "LOC-03",
        "type": "Location",
        "label": "BKC Financial Complex, Mumbai",
        "risk_level": "CRITICAL",
        "community_id": 2,
        "degree": 7,
        "properties": {
            "name": "Bandra Kurla Complex",
            "city": "Mumbai",
            "latitude": 19.0664,
            "longitude": 72.8687,
            "address": "G Block, Bandra Kurla Complex, Bandra East, Mumbai 400051",
            "site_type": "Hawala Settlement Office"
        },
        "source_records": ["ROC-REG-BKC-991", "FIU-SITE-AUDIT-04"]
    },
    {
        "id": "LOC-04",
        "type": "Location",
        "label": "Connaught Place, Delhi",
        "risk_level": "MEDIUM",
        "community_id": 2,
        "degree": 4,
        "properties": {
            "name": "Inner Circle CP",
            "city": "New Delhi",
            "latitude": 28.6315,
            "longitude": 77.2167,
            "address": "Connaught Place, New Delhi 110001",
            "site_type": "Transit Meeting Node"
        },
        "source_records": ["CDR-DEL-TOWER-102"]
    },
    {
        "id": "LOC-05",
        "type": "Location",
        "label": "Vagator Villa Safehouse, Goa",
        "risk_level": "HIGH",
        "community_id": 3,
        "degree": 5,
        "properties": {
            "name": "Vagator Coast Hideout",
            "city": "Goa",
            "latitude": 15.5993,
            "longitude": 73.7440,
            "address": "Vagator Beach Road, Anjuna, Goa 403509",
            "site_type": "Transit Hideout"
        },
        "source_records": ["HOTEL-GUEST-REG-GOA-44", "CDR-GOA-1029"]
    },
    {
        "id": "LOC-06",
        "type": "Location",
        "label": "BLR Cell Tower #842 (Indiranagar)",
        "risk_level": "HIGH",
        "community_id": 1,
        "degree": 6,
        "properties": {
            "name": "Cell Tower BLR-TWR-842",
            "city": "Bengaluru",
            "latitude": 12.9780,
            "longitude": 77.6400,
            "address": "Cell Site Sector 2, Indiranagar BSNL Hub",
            "site_type": "Cell Tower Transceiver"
        },
        "source_records": ["TRAI-CELL-BLR-842", "CDR-DUMP-TOWER-842"]
    },

    # Organizations
    {
        "id": "ORG-01",
        "type": "Organization",
        "label": "Orion Global Export Ltd",
        "risk_level": "CRITICAL",
        "community_id": 2,
        "degree": 7,
        "properties": {
            "legal_name": "Orion Global Export Private Limited",
            "cin": "U51909MH2021PTC384910",
            "reg_address": "BKC Tower 3, Bandra East, Mumbai",
            "entity_type": "Shell Company Front",
            "gstin": "27AAFCO9918M1ZF"
        },
        "source_records": ["MCA-ROC-DIR-2024", "GST-EWAY-AUDIT-102"]
    },
    {
        "id": "ORG-02",
        "type": "Organization",
        "label": "Falcon Logistics Pvt Ltd",
        "risk_level": "HIGH",
        "community_id": 3,
        "degree": 5,
        "properties": {
            "legal_name": "Falcon Logistics Services India Ltd",
            "cin": "U60200KA2022PTC192834",
            "reg_address": "Whitefield Industrial Area, Bengaluru",
            "entity_type": "Logistics & Transport Front"
        },
        "source_records": ["VAHAN-FLEET-LOG-44"]
    }
]

EDGES_DATA: List[Dict[str, Any]] = [
    # Person -> Phone
    {
        "id": "E-01",
        "source": "P-101",
        "target": "PH-01",
        "type": "USES",
        "label": "Primary SIM",
        "weight": 5.0,
        "properties": {"registered_user": "Rahul Kumar", "active_since": "2023-01-10"},
        "source_records": ["CAF-REG-98765"]
    },
    {
        "id": "E-02",
        "source": "P-101",
        "target": "PH-03",
        "type": "USES",
        "label": "Burner Handset",
        "weight": 4.0,
        "is_anomaly": True,
        "properties": {"imei_match": "359910283746192", "burst_window": "2025-02-10 to 2025-02-14"},
        "source_records": ["CDR-DUMP-TOWER-842"]
    },
    {
        "id": "E-03",
        "source": "P-102",
        "target": "PH-02",
        "type": "USES",
        "label": "Active SIM",
        "weight": 4.0,
        "properties": {"registered_user": "Ravi Shankar"},
        "source_records": ["CDR-BLR-8892"]
    },
    {
        "id": "E-04",
        "source": "P-104",
        "target": "PH-04",
        "type": "USES",
        "label": "Encrypted Line",
        "weight": 5.0,
        "properties": {"encryption": "VoIP SIP Relay"},
        "source_records": ["CDR-MUM-4401"]
    },
    {
        "id": "E-05",
        "source": "P-106",
        "target": "PH-05",
        "type": "USES",
        "label": "Logistics SIM",
        "weight": 3.0,
        "properties": {"registered_user": "Ananya Verma"},
        "source_records": ["CDR-GOA-1029"]
    },

    # Phone -> Phone (Calls / Communications)
    {
        "id": "E-06",
        "source": "PH-01",
        "target": "PH-02",
        "type": "CALLED",
        "label": "42 Calls (318 mins)",
        "weight": 4.5,
        "properties": {
            "call_count": 42,
            "total_duration_sec": 19080,
            "first_call": "2025-01-05 14:22:00",
            "last_call": "2025-02-14 23:45:00",
            "frequent_time_window": "22:00 - 02:00"
        },
        "source_records": ["CDR-BLR-8891", "CDR-BLR-8892"]
    },
    {
        "id": "E-07",
        "source": "PH-03",
        "target": "PH-04",
        "type": "CALLED",
        "label": "18 Rapid Burner Calls",
        "weight": 5.0,
        "is_anomaly": True,
        "properties": {
            "call_count": 18,
            "total_duration_sec": 2400,
            "first_call": "2025-02-12 01:10:00",
            "last_call": "2025-02-14 04:30:00",
            "anomaly_reason": "Sudden burst between burner SIM and international broker line"
        },
        "source_records": ["CDR-DUMP-TOWER-842", "CDR-MUM-4401"]
    },
    {
        "id": "E-08",
        "source": "PH-02",
        "target": "PH-05",
        "type": "CALLED",
        "label": "12 Calls (Goa Transit)",
        "weight": 3.0,
        "properties": {
            "call_count": 12,
            "first_call": "2025-02-16 11:00:00",
            "last_call": "2025-02-28 18:20:00"
        },
        "source_records": ["CDR-BLR-8892", "CDR-GOA-1029"]
    },

    # Person -> Bank Account
    {
        "id": "E-09",
        "source": "P-101",
        "target": "BA-01",
        "type": "OWNS",
        "label": "Sole Signatory",
        "weight": 5.0,
        "properties": {"kyc_verified": True, "opened_on": "2022-04-11"},
        "source_records": ["BANK-KYC-HDFC-9021"]
    },
    {
        "id": "E-10",
        "source": "P-101",
        "target": "BA-02",
        "type": "CONTROLS",
        "label": "NetBanking Access (IP Matched)",
        "weight": 4.5,
        "is_anomaly": True,
        "properties": {"ip_match": "103.21.14.88 (Rahul Kumar Residence)", "authorization": "Informal Operator"},
        "source_records": ["IPDR-LOG-HDFC-09", "STR-FIU-2025-882"]
    },
    {
        "id": "E-11",
        "source": "P-103",
        "target": "BA-03",
        "type": "OWNS",
        "label": "Beneficial Owner",
        "weight": 5.0,
        "properties": {"kyc_pan": "PAN-XXXXX9910K"},
        "source_records": ["BANK-KYC-AXIS-7749"]
    },
    {
        "id": "E-12",
        "source": "P-108",
        "target": "BA-04",
        "type": "OWNS",
        "label": "Director Signatory",
        "weight": 4.0,
        "properties": {"role": "Nominee Signatory"},
        "source_records": ["BANK-KYC-HSBC-0092"]
    },
    {
        "id": "E-13",
        "source": "P-104",
        "target": "BA-05",
        "type": "OWNS",
        "label": "Offshore UBO",
        "weight": 5.0,
        "properties": {"ubo_shareholding": "100%"},
        "source_records": ["SWIFT-WIRE-AE-991"]
    },

    # Bank Account -> Bank Account (Transactions / Money Laundering Layering)
    {
        "id": "E-14",
        "source": "BA-01",
        "target": "BA-02",
        "type": "TRANSFERRED_TO",
        "label": "₹45,00,000 (3 Txns)",
        "weight": 5.0,
        "is_anomaly": True,
        "properties": {
            "total_amount_inr": 4500000.00,
            "txn_count": 3,
            "timestamps": ["2025-01-20 11:15:00", "2025-01-22 16:40:00", "2025-01-28 09:30:00"],
            "channel": "IMPS / RTGS Layering"
        },
        "source_records": ["TXN-HDFC-9021", "TXN-ICICI-3819"]
    },
    {
        "id": "E-15",
        "source": "BA-02",
        "target": "BA-03",
        "type": "TRANSFERRED_TO",
        "label": "₹42,50,000 (Hawala Bridge)",
        "weight": 5.0,
        "is_anomaly": True,
        "properties": {
            "total_amount_inr": 4250000.00,
            "txn_count": 2,
            "timestamps": ["2025-01-29 14:10:00", "2025-02-02 10:20:00"],
            "channel": "RTGS Hawala Conduit"
        },
        "source_records": ["TXN-ICICI-3819", "TXN-AXIS-7749"]
    },
    {
        "id": "E-16",
        "source": "BA-03",
        "target": "BA-04",
        "type": "TRANSFERRED_TO",
        "label": "₹40,00,000 (Shell Integration)",
        "weight": 5.0,
        "is_anomaly": True,
        "properties": {
            "total_amount_inr": 4000000.00,
            "txn_count": 1,
            "timestamps": ["2025-02-05 15:45:00"],
            "narrative": "Advance payment for fictitious software export"
        },
        "source_records": ["TXN-AXIS-7749", "SWIFT-HSBC-0092"]
    },
    {
        "id": "E-17",
        "source": "BA-04",
        "target": "BA-05",
        "type": "TRANSFERRED_TO",
        "label": "$48,000 (~₹39.8L Offshore Wire)",
        "weight": 5.0,
        "is_anomaly": True,
        "properties": {
            "amount_usd": 48000.00,
            "timestamps": ["2025-02-09 12:00:00"],
            "swift_ref": "HSBCINBB2025020991823"
        },
        "source_records": ["SWIFT-HSBC-0092", "SWIFT-WIRE-AE-991"]
    },
    {
        "id": "E-18",
        "source": "BA-04",
        "target": "BA-01",
        "type": "TRANSFERRED_TO",
        "label": "₹5,00,000 (Kickback Loop)",
        "weight": 4.5,
        "is_anomaly": True,
        "properties": {
            "total_amount_inr": 500000.00,
            "timestamps": ["2025-02-11 17:30:00"],
            "anomaly_reason": "Circular flow completes loop back to originator Rahul Kumar"
        },
        "source_records": ["TXN-HSBC-0092", "TXN-HDFC-9021"]
    },

    # Person -> Vehicle
    {
        "id": "E-19",
        "source": "P-101",
        "target": "VH-01",
        "type": "OWNS",
        "label": "Registered Owner",
        "weight": 4.0,
        "properties": {"registration_date": "2023-08-15"},
        "source_records": ["VAHAN-REG-4040"]
    },
    {
        "id": "E-20",
        "source": "P-102",
        "target": "VH-01",
        "type": "DRIVES",
        "label": "Frequent Driver",
        "weight": 4.0,
        "properties": {"observed_trips": 12},
        "source_records": ["CCTV-IND-004", "ANPR-BLR-AIRPORT-12"]
    },
    {
        "id": "E-21",
        "source": "P-106",
        "target": "VH-02",
        "type": "OWNS",
        "label": "Registered Owner",
        "weight": 4.0,
        "properties": {"registration_date": "2024-01-20"},
        "source_records": ["VAHAN-REG-8899"]
    },

    # Person & Vehicle -> Location
    {
        "id": "E-22",
        "source": "P-101",
        "target": "LOC-01",
        "type": "LOCATED_AT",
        "label": "Frequent Safehouse Presence",
        "weight": 4.5,
        "properties": {"visit_count": 28, "last_seen": "2025-02-14 20:10:00"},
        "source_records": ["GEO-SURV-BLR-01"]
    },
    {
        "id": "E-23",
        "source": "P-102",
        "target": "LOC-01",
        "type": "LOCATED_AT",
        "label": "Resident Caretaker",
        "weight": 5.0,
        "properties": {"status": "Full time access"},
        "source_records": ["GEO-SURV-BLR-01"]
    },
    {
        "id": "E-24",
        "source": "VH-01",
        "target": "LOC-02",
        "type": "OBSERVED_AT",
        "label": "ANPR Camera Match",
        "weight": 4.0,
        "properties": {"timestamp": "2025-02-12 02:45:00", "camera_id": "CAM-BLR-AIRPORT-N4"},
        "source_records": ["ANPR-BLR-AIRPORT-12"]
    },
    {
        "id": "E-25",
        "source": "PH-01",
        "target": "LOC-06",
        "type": "TOWER_PING",
        "label": "88 Tower Pings",
        "weight": 4.5,
        "properties": {"cell_id": "404-45-842-1", "azimuth": 120},
        "source_records": ["CDR-DUMP-TOWER-842"]
    },
    {
        "id": "E-26",
        "source": "PH-03",
        "target": "LOC-06",
        "type": "TOWER_PING",
        "label": "Co-Located Tower Ping",
        "weight": 5.0,
        "is_anomaly": True,
        "properties": {
            "cell_id": "404-45-842-1",
            "timestamp": "2025-02-12 01:05:00",
            "anomaly_reason": "Burner SIM active in exact same cell sector as Rahul Kumar's primary phone"
        },
        "source_records": ["CDR-DUMP-TOWER-842"]
    },
    {
        "id": "E-27",
        "source": "P-103",
        "target": "LOC-03",
        "type": "LOCATED_AT",
        "label": "Office Location",
        "weight": 4.0,
        "properties": {"office_unit": "Suite 408, BKC Tower"},
        "source_records": ["ROC-REG-BKC-991"]
    },
    {
        "id": "E-28",
        "source": "P-106",
        "target": "LOC-05",
        "type": "LOCATED_AT",
        "label": "Goa Transit Base",
        "weight": 4.0,
        "properties": {"checkin": "2025-02-18", "checkout": "2025-02-26"},
        "source_records": ["HOTEL-GUEST-REG-GOA-44"]
    },
    {
        "id": "E-29",
        "source": "P-107",
        "target": "LOC-05",
        "type": "LOCATED_AT",
        "label": "Co-Located Meeting",
        "weight": 4.5,
        "properties": {"meeting_window": "2025-02-20 to 2025-02-22"},
        "source_records": ["HOTEL-GUEST-REG-GOA-44", "CDR-GOA-1029"]
    },

    # Organization Relationships
    {
        "id": "E-30",
        "source": "P-104",
        "target": "ORG-01",
        "type": "CONTROLS",
        "label": "Beneficial Controller",
        "weight": 5.0,
        "properties": {"shareholding_proxy": "Sunita Deshmukh"},
        "source_records": ["MCA-ROC-DIR-2024"]
    },
    {
        "id": "E-31",
        "source": "P-108",
        "target": "ORG-01",
        "type": "ASSOCIATED_WITH",
        "label": "Nominee Director",
        "weight": 4.0,
        "properties": {"appointment_date": "2021-10-01"},
        "source_records": ["MCA-ROC-DIR-2024"]
    },
    {
        "id": "E-32",
        "source": "ORG-01",
        "target": "BA-04",
        "type": "HOLDS_ACCOUNT",
        "label": "Corporate Account",
        "weight": 5.0,
        "properties": {"account_type": "Current Account"},
        "source_records": ["BANK-KYC-HSBC-0092"]
    },
    {
        "id": "E-33",
        "source": "P-106",
        "target": "ORG-02",
        "type": "ASSOCIATED_WITH",
        "label": "Managing Director",
        "weight": 4.0,
        "properties": {"ownership": "60%"},
        "source_records": ["VAHAN-FLEET-LOG-44"]
    },

    # Case Involvement
    {
        "id": "E-34",
        "source": "P-101",
        "target": "CASE-101",
        "type": "INVOLVED_IN",
        "label": "Accused #1 (Named in FIR)",
        "weight": 5.0,
        "properties": {"charge": "Section 420, 120B IPC; 66D IT Act"},
        "source_records": ["CCPS-BLR-FIR-102"]
    },
    {
        "id": "E-35",
        "source": "P-102",
        "target": "CASE-101",
        "type": "INVOLVED_IN",
        "label": "Accused #2",
        "weight": 4.5,
        "properties": {"charge": "Section 120B IPC"},
        "source_records": ["CCPS-BLR-FIR-102"]
    },
    {
        "id": "E-36",
        "source": "P-104",
        "target": "CASE-101",
        "type": "INVOLVED_IN",
        "label": "Accused #3 (Mastermind)",
        "weight": 5.0,
        "properties": {"charge": "Section 120B, PMLA Section 3"},
        "source_records": ["CCPS-BLR-FIR-102"]
    },
    {
        "id": "E-37",
        "source": "P-106",
        "target": "CASE-201",
        "type": "INVOLVED_IN",
        "label": "Suspect Under Interception",
        "weight": 4.0,
        "properties": {"act": "NDPS Section 29"},
        "source_records": ["ANC-MUM-FIR-208"]
    },
    {
        "id": "E-38",
        "source": "P-107",
        "target": "CASE-201",
        "type": "INVOLVED_IN",
        "label": "Primary Target",
        "weight": 5.0,
        "properties": {"act": "NDPS Section 8(c), 20(b)"},
        "source_records": ["ANC-MUM-FIR-208"]
    },

    # Inter-Person Associations
    {
        "id": "E-39",
        "source": "P-101",
        "target": "P-103",
        "type": "ASSOCIATED_WITH",
        "label": "Hawala Remittance Channel",
        "weight": 4.8,
        "properties": {"relationship_nature": "Financial Dispatcher to Broker"},
        "source_records": ["TXN-AXIS-7749", "CDR-MUM-4401"]
    },
    {
        "id": "E-40",
        "source": "P-103",
        "target": "P-104",
        "type": "ASSOCIATED_WITH",
        "label": "Direct Broker to Mastermind",
        "weight": 5.0,
        "properties": {"relationship_nature": "Settlement Operator to Kingpin"},
        "source_records": ["SWIFT-HSBC-0092", "CDR-MUM-4401"]
    },
    {
        "id": "E-41",
        "source": "P-104",
        "target": "P-107",
        "type": "ASSOCIATED_WITH",
        "label": "Syndicate Financing",
        "weight": 4.5,
        "properties": {"relationship_nature": "Funding Coastal Operation"},
        "source_records": ["BINANCE-OTC-882"]
    }
]

TIMELINE_EVENTS_DATA: List[Dict[str, Any]] = [
    {
        "id": "EV-01",
        "timestamp": "2025-01-05 14:22:00",
        "event_type": "CALL",
        "title": "First Recorded Call: Rahul Kumar to Ravi Shankar",
        "description": "42-minute call originating from Indiranagar cell tower sector.",
        "source_entity_id": "P-101",
        "target_entity_id": "P-102",
        "location_name": "Indiranagar Safehouse, BLR",
        "latitude": 12.9716,
        "longitude": 77.5946,
        "evidence_id": "CDR-BLR-8891",
        "severity": "NORMAL"
    },
    {
        "id": "EV-02",
        "timestamp": "2025-01-20 11:15:00",
        "event_type": "TRANSACTION",
        "title": "Layering Transfer 1: ₹15,00,000 from BA-01 to BA-02",
        "description": "RTGS transfer split across multiple tranches within 2 hours.",
        "source_entity_id": "BA-01",
        "target_entity_id": "BA-02",
        "location_name": "Bengaluru NetBanking",
        "evidence_id": "TXN-HDFC-9021",
        "severity": "HIGH"
    },
    {
        "id": "EV-03",
        "timestamp": "2025-01-29 14:10:00",
        "event_type": "TRANSACTION",
        "title": "Inter-State Hawala Conduit: ₹22,50,000 to Account Z (Mumbai)",
        "description": "Funds transferred from Bengaluru layering account to Vikram Malhotra's mule account in Mumbai.",
        "source_entity_id": "BA-02",
        "target_entity_id": "BA-03",
        "location_name": "BKC Financial Complex, Mumbai",
        "latitude": 19.0664,
        "longitude": 72.8687,
        "evidence_id": "TXN-ICICI-3819",
        "severity": "CRITICAL"
    },
    {
        "id": "EV-04",
        "timestamp": "2025-02-05 15:45:00",
        "event_type": "TRANSACTION",
        "title": "Shell Company Infiltration: ₹40,00,000 to Orion Global",
        "description": "Disguised as software export consultancy fee payment.",
        "source_entity_id": "BA-03",
        "target_entity_id": "BA-04",
        "location_name": "BKC, Mumbai",
        "evidence_id": "TXN-AXIS-7749",
        "severity": "CRITICAL"
    },
    {
        "id": "EV-05",
        "timestamp": "2025-02-09 12:00:00",
        "event_type": "TRANSACTION",
        "title": "Offshore SWIFT Wire: $48,000 to Emirates NBD (Dubai)",
        "description": "International wire settlement to account controlled by Viktor Rao.",
        "source_entity_id": "BA-04",
        "target_entity_id": "BA-05",
        "location_name": "Dubai Offshore Terminal",
        "evidence_id": "SWIFT-HSBC-0092",
        "severity": "CRITICAL"
    },
    {
        "id": "EV-06",
        "timestamp": "2025-02-11 17:30:00",
        "event_type": "TRANSACTION",
        "title": "Circular Kickback: ₹5,00,000 returned to Rahul Kumar",
        "description": "Completes money laundering cycle loop back to primary coordinator.",
        "source_entity_id": "BA-04",
        "target_entity_id": "BA-01",
        "location_name": "Indiranagar, BLR",
        "evidence_id": "TXN-HSBC-0092",
        "severity": "CRITICAL"
    },
    {
        "id": "EV-07",
        "timestamp": "2025-02-12 01:05:00",
        "event_type": "TOWER_PING",
        "title": "Burner Handset Activation: Cell Sector Indiranagar #842",
        "description": "Co-located ping with Rahul Kumar's primary phone at safehouse coordinates.",
        "source_entity_id": "PH-03",
        "location_name": "BLR Cell Tower #842 (Indiranagar)",
        "latitude": 12.9780,
        "longitude": 77.6400,
        "evidence_id": "CDR-DUMP-TOWER-842",
        "severity": "CRITICAL"
    },
    {
        "id": "EV-08",
        "timestamp": "2025-02-12 02:45:00",
        "event_type": "SIGHTING",
        "title": "ANPR Camera Detection: Scorpio KA-01-MJ-4040 at Airport Road",
        "description": "Vehicle spotted traveling at high speed towards cargo junction.",
        "source_entity_id": "VH-01",
        "location_name": "Kempegowda Airport Road, BLR",
        "latitude": 13.1986,
        "longitude": 77.7066,
        "evidence_id": "ANPR-BLR-AIRPORT-12",
        "severity": "HIGH"
    },
    {
        "id": "EV-09",
        "timestamp": "2025-02-15 10:00:00",
        "event_type": "FIR_REGISTRATION",
        "title": "Formal FIR-102/2025 Registered by Cyber Crime PS",
        "description": "Victim complaint regarding ₹1.2 Cr digital extortion and identity theft.",
        "source_entity_id": "P-109",
        "target_entity_id": "CASE-101",
        "location_name": "Central Cyber Crime PS, Bengaluru",
        "evidence_id": "CCPS-BLR-FIR-102",
        "severity": "CRITICAL"
    },
    {
        "id": "EV-10",
        "timestamp": "2025-02-20 18:30:00",
        "event_type": "SIGHTING",
        "title": "Goa Safehouse Sighting: Fortuner MH-02-CX-8899 at Vagator",
        "description": "Ananya Verma and Tariq Sheikh observed entering beachside villa.",
        "source_entity_id": "VH-02",
        "location_name": "Vagator Villa Safehouse, Goa",
        "latitude": 15.5993,
        "longitude": 73.7440,
        "evidence_id": "HOTEL-GUEST-REG-GOA-44",
        "severity": "HIGH"
    }
]

GIS_FEATURES_DATA: List[Dict[str, Any]] = [
    {
        "id": "GIS-01",
        "name": "Indiranagar Safehouse Base",
        "type": "SAFEHOUSE",
        "latitude": 12.9716,
        "longitude": 77.5946,
        "radius_meters": 200,
        "associated_entities": ["P-101", "P-102", "PH-01", "LOC-01"],
        "timestamp": "2025-01-05 to 2025-02-14",
        "evidence_id": "GEO-SURV-BLR-01",
        "notes": "Frequented nightly by Rahul Kumar and Ravi Shankar. High Wi-Fi & SIM Box activity."
    },
    {
        "id": "GIS-02",
        "name": "Kempegowda Airport Road Handover",
        "type": "ANPR_SIGHTING",
        "latitude": 13.1986,
        "longitude": 77.7066,
        "radius_meters": 500,
        "associated_entities": ["VH-01", "P-101", "LOC-02"],
        "timestamp": "2025-02-12 02:45:00",
        "evidence_id": "ANPR-BLR-AIRPORT-12",
        "notes": "Vehicle KA-01-MJ-4040 detected 14 times during late-night cargo deliveries."
    },
    {
        "id": "GIS-03",
        "name": "BKC Hawala Settlement Hub",
        "type": "CRIME_SCENE",
        "latitude": 19.0664,
        "longitude": 72.8687,
        "radius_meters": 350,
        "associated_entities": ["P-103", "ORG-01", "BA-03", "LOC-03"],
        "timestamp": "2025-01-29 to 2025-02-10",
        "evidence_id": "ROC-REG-BKC-991",
        "notes": "Front office for Orion Global Export; primary Hawala clearing desk."
    },
    {
        "id": "GIS-04",
        "name": "Connaught Place Transit Meeting",
        "type": "RESIDENCE",
        "latitude": 28.6315,
        "longitude": 77.2167,
        "radius_meters": 300,
        "associated_entities": ["VH-03", "P-103", "LOC-04"],
        "timestamp": "2025-02-04 16:00:00",
        "evidence_id": "CDR-DEL-TOWER-102",
        "notes": "Cash delivery and SIM card transfer point."
    },
    {
        "id": "GIS-05",
        "name": "Vagator Villa Narcotics Transit",
        "type": "SAFEHOUSE",
        "latitude": 15.5993,
        "longitude": 73.7440,
        "radius_meters": 400,
        "associated_entities": ["P-106", "P-107", "VH-02", "LOC-05"],
        "timestamp": "2025-02-18 to 2025-02-26",
        "evidence_id": "HOTEL-GUEST-REG-GOA-44",
        "notes": "Multi-day co-location of Ananya Verma and Tariq Sheikh."
    },
    {
        "id": "GIS-06",
        "name": "Cell Tower BLR-TWR-842 Triangulation Zone",
        "type": "TOWER_PING",
        "latitude": 12.9780,
        "longitude": 77.6400,
        "radius_meters": 800,
        "associated_entities": ["PH-01", "PH-03", "P-101", "LOC-06"],
        "timestamp": "2025-02-10 to 2025-02-14",
        "evidence_id": "CDR-DUMP-TOWER-842",
        "notes": "Critical cell sector where burner handset was activated simultaneously with primary phone."
    }
]

ENTITY_RESOLUTION_CANDIDATES: List[Dict[str, Any]] = [
    {
        "id": "ER-001",
        "entity_a_id": "P-101",
        "entity_b_id": "P-105",
        "confidence": 0.91,
        "name_similarity": 0.88,
        "phone_match": True,
        "location_overlap": 0.95,
        "historical_association": 0.85,
        "status": "PENDING",
        "reasons": [
            "Exact IMEI Match (354892019284710) across distinct subscriber records",
            "Matching Date of Birth (1988-06-14)",
            "Identical residential address token in Indiranagar, Bengaluru",
            "Jaro-Winkler phonetic similarity: 'Rahul Kumar' vs 'R. Kumar' (0.88)"
        ]
    }
]

ANOMALIES_DATA: List[Dict[str, Any]] = [
    {
        "id": "ANOM-01",
        "type": "FINANCIAL_LAYERING_CYCLE",
        "severity": "CRITICAL",
        "title": "Closed-Loop Money Laundering Cycle Detected",
        "description": "Funds totaling ₹45,00,000 moved sequentially through 4 accounts (HDFC -> ICICI -> Axis -> HSBC) and looped back with a ₹5,00,000 kickback to originator Rahul Kumar.",
        "involved_node_ids": ["BA-01", "BA-02", "BA-03", "BA-04", "P-101", "P-103", "ORG-01"],
        "involved_edge_ids": ["E-14", "E-15", "E-16", "E-18"],
        "evidence_records": ["TXN-HDFC-9021", "TXN-ICICI-3819", "TXN-AXIS-7749", "TXN-HSBC-0092"],
        "confidence": 0.96,
        "recommended_action": "Freeze accounts BA-02 and BA-03 under PMLA Section 17; issue summons to Nominee Director Sunita Deshmukh."
    },
    {
        "id": "ANOM-02",
        "type": "COMMUNICATION_BURST",
        "severity": "HIGH",
        "title": "Burner Handset Burst Pre-FIR Filing",
        "description": "18 short-duration encrypted VoIP calls detected between Burner SIM (+91 99001 12233) and Kingpin Broker (+91 88776 65544) within a 48-hour window before FIR-102 was registered.",
        "involved_node_ids": ["PH-03", "PH-04", "P-101", "P-104", "LOC-06"],
        "involved_edge_ids": ["E-02", "E-07", "E-26"],
        "evidence_records": ["CDR-DUMP-TOWER-842", "CDR-MUM-4401"],
        "confidence": 0.92,
        "recommended_action": "Requisition cell sector handover logs for Cell Tower BLR-TWR-842 and petition for VoIP gateway IPDR."
    },
    {
        "id": "ANOM-03",
        "type": "BRIDGE_BROKER",
        "severity": "CRITICAL",
        "title": "High-Betweenness Inter-Cluster Broker Identified",
        "description": "Vikram Malhotra (Betweenness: 0.88) acts as the sole bridging entity connecting the Bengaluru local operations network with Viktor Rao's offshore shell syndicate.",
        "involved_node_ids": ["P-103", "P-101", "P-104", "BA-03", "LOC-03"],
        "involved_edge_ids": ["E-39", "E-40", "E-15", "E-16"],
        "evidence_records": ["TXN-AXIS-7749", "CDR-MUM-4401", "IB-INTEL-2025-09"],
        "confidence": 0.94,
        "recommended_action": "Prioritize physical surveillance on BKC Mumbai office (LOC-03); initiate financial lookup on Axis Bank mule account."
    }
]

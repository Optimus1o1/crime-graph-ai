"""
CrimeGraph AI — Case & Evidence Management Service.
Manages formal cases, evidence items with cryptographic SHA-256 provenance hashes,
chain of custody tracking, and case-level summary statistics.
"""
from typing import List, Dict, Any, Optional
import hashlib
from backend.models.schemas import CaseModel, EvidenceItem
from backend.data.seed_data import CASES_DATA


class CaseService:
    def __init__(self):
        self.cases: Dict[str, CaseModel] = {}
        self.evidence: Dict[str, EvidenceItem] = {}
        self._init_data()

    def _init_data(self):
        for c in CASES_DATA:
            cid = c["case_id"]
            self.cases[cid] = CaseModel(
                case_id=cid,
                title=c["title"],
                fir_number=c["fir_number"],
                section_law=c["section_law"],
                police_station=c["police_station"],
                incident_date=c["incident_date"],
                status=c["status"],
                primary_accused=c["primary_accused"],
                description=c["description"],
                node_count=c["node_count"],
                edge_count=c["edge_count"],
                evidence_count=17 if cid == "CASE-FIR-102" else 8,
                alerts_count=3 if cid == "CASE-FIR-102" else 1,
                lead_investigator="Insp. Aniket Rao, Cyber Crime PS",
                last_activity="2 minutes ago"
            )

        # Seed realistic evidence items with SHA-256 provenance
        evidence_seed = [
            ("EVID-01", "CASE-FIR-102", "CDR", "Indiranagar Burner Handset Handover Dump", "Airtel Telecommunications NOC", "2025-02-12 01:05:00", ["PH-03", "PH-04", "P-101"]),
            ("EVID-02", "CASE-FIR-102", "BANK_STATEMENT", "HDFC Account Statement (Indiranagar)", "HDFC Bank Ltd, AML Cell", "2025-02-10 14:20:00", ["BA-01", "P-101"]),
            ("EVID-03", "CASE-FIR-102", "BANK_STATEMENT", "ICICI Layering Account Statement", "ICICI Bank Ltd, Cyber Cell", "2025-02-10 15:45:00", ["BA-02"]),
            ("EVID-04", "CASE-FIR-102", "BANK_STATEMENT", "Axis Bank Mule Account Statement (BKC)", "Axis Bank Ltd, FIU Cell", "2025-02-11 11:30:00", ["BA-03", "P-103"]),
            ("EVID-05", "CASE-FIR-102", "BANK_STATEMENT", "HSBC Shell Account Statement (Orion Global)", "HSBC India Corporate Branch", "2025-02-11 16:15:00", ["BA-04", "ORG-01"]),
            ("EVID-06", "CASE-FIR-102", "FIR", "Primary Cyber Extortion First Information Report", "Central Cyber Crime PS, BLR", "2025-02-15 10:00:00", ["P-101", "P-104"]),
            ("EVID-07", "CASE-FIR-102", "ANPR", "Automated Number Plate Recognition Kempegowda Corridor", "BLR City Traffic Command Center", "2025-02-12 02:45:00", ["VH-01", "LOC-02"]),
            ("EVID-08", "CASE-FIR-102", "SURVEILLANCE", "BKC Mumbai Safehouse Physical Intercept Log", "Special Task Force, Mumbai", "2025-02-04 16:00:00", ["LOC-03", "P-103", "ORG-01"]),
            ("EVID-09", "CASE-FIR-102", "DIGITAL_EXTRACTION", "IND Safehouse Wi-Fi & SIM Box Packet Capture", "Forensic Science Lab (FSL), Bengaluru", "2025-02-14 22:00:00", ["LOC-01", "PH-01", "PH-03"]),
        ]

        for eid, cid, etype, title, src, tstamp, entities in evidence_seed:
            raw_data = f"{eid}|{cid}|{title}|{src}|{tstamp}"
            sha = hashlib.sha256(raw_data.encode("utf-8")).hexdigest()
            self.evidence[eid] = EvidenceItem(
                id=eid,
                case_id=cid,
                type=etype,
                title=title,
                source=src,
                sha256=sha,
                timestamp=tstamp,
                verification_status="VERIFIED",
                confidence=0.96,
                related_entities=entities,
                related_edges=[],
                file_path=f"/evidence/{eid}_{etype}.pdf",
                notes="Cryptographically stamped; chain of custody intact."
            )

    def get_cases(self) -> List[CaseModel]:
        return list(self.cases.values())

    def get_case(self, case_id: str) -> Optional[CaseModel]:
        return self.cases.get(case_id)

    def get_evidence_for_case(self, case_id: str) -> List[EvidenceItem]:
        return [e for e in self.evidence.values() if e.case_id == case_id]

    def get_all_evidence(self) -> List[EvidenceItem]:
        return list(self.evidence.values())


case_service = CaseService()

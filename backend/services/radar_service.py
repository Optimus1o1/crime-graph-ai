"""
CrimeGraph AI — Radar & Operational Intelligence Service.
Powers the Cyber Intelligence Operations Console and Polar Threat Radar UI.
Provides real-time metrics, polar-coordinate threat blips, connector health,
temporal interaction volume histograms, and prioritized investigator action items.
"""
from typing import List, Dict, Any, Optional
import math
import hashlib
from backend.models.schemas import (
    RadarIncident, RadarMetrics, ConnectorStatus, ActionItem, ActivityHistogramItem
)


class RadarService:
    def __init__(self):
        self.metrics = RadarMetrics(
            recent_investigations=22,
            total_investigations=55,
            low_severity=5,
            medium_severity=10,
            high_severity=40,
            exposed_entities=152,
            exposed_entities_trend_24h=18,
            interactions_processed=100000,
            interactions_24h=4800,
        )

        self.connectors: List[ConnectorStatus] = [
            ConnectorStatus(
                id="CONN-01",
                name="Microsoft Defender CTI Feed",
                type="ENDPOINT_CTI",
                status="ACTIVE",
                last_sync="2026-09-03 21:30:12",
                records_synced=38400
            ),
            ConnectorStatus(
                id="CONN-02",
                name="Azure AD / Telco CDR Stream",
                type="IDENTITY_TELCO",
                status="ACTIVE",
                last_sync="2026-09-03 21:34:45",
                records_synced=52100
            ),
            ConnectorStatus(
                id="CONN-03",
                name="Financial Intelligence Unit (FIU) Gateway",
                type="BANKING_AML",
                status="ACTIVE",
                last_sync="2026-09-03 21:35:00",
                records_synced=9500
            )
        ]

        self.action_items: List[ActionItem] = [
            ActionItem(
                id="ACT-01",
                related_investigation_id="3",
                title="Reset compromised user account password",
                description="Credential stuffing pattern detected on indiranagar-safehouse VPN account. Mandate hardware token reset.",
                priority="HIGH",
                action_type="RESET_CREDENTIALS",
                created_at="2026-09-03 20:15:00",
                status="PENDING"
            ),
            ActionItem(
                id="ACT-02",
                related_investigation_id="2",
                title="Remove malware from a compromised system",
                description="Trojan RAT detected on Indiranagar safehouse terminal (LOC-01). Isolate binary for sandbox reversing.",
                priority="CRITICAL",
                action_type="REMEDIATE_HOST",
                created_at="2026-09-03 20:30:00",
                status="PENDING"
            ),
            ActionItem(
                id="ACT-03",
                related_investigation_id="3",
                title="Isolate compromised endpoint from network",
                description="Sever network link on terminal connected to burner phone hub PH-03.",
                priority="HIGH",
                action_type="NETWORK_ISOLATE",
                created_at="2026-09-03 20:45:00",
                status="PENDING"
            ),
            ActionItem(
                id="ACT-04",
                related_investigation_id="1",
                title="Enforce multi-factor authentication and conditional access policies",
                description="High-risk sign-ins detected across foreign ASN IP ranges targeting Orion Global directory.",
                priority="HIGH",
                action_type="ENFORCE_MFA",
                created_at="2026-09-03 21:00:00",
                status="PENDING"
            ),
            ActionItem(
                id="ACT-05",
                related_investigation_id="3",
                title="Apply latest patches to web applications and databases",
                description="Exploit scan detected against shell company corporate portal (U51909MH2021PTC384910).",
                priority="MEDIUM",
                action_type="PATCH_VULNERABILITY",
                created_at="2026-09-03 21:10:00",
                status="PENDING"
            ),
            ActionItem(
                id="ACT-06",
                related_investigation_id="2",
                title="Configure SharePoint access controls and permissions",
                description="Audit internal file share logs for unauthorized downloads of FIR-102 evidentiary dossiers.",
                priority="MEDIUM",
                action_type="AUDIT_PERMISSIONS",
                created_at="2026-09-03 21:15:00",
                status="PENDING"
            ),
            ActionItem(
                id="ACT-07",
                related_investigation_id="3",
                title="Suspicious email attachment download",
                description="Spear-phishing payload masquerading as ROC tax audit sent to Axis Bank mule liaison.",
                priority="CRITICAL",
                action_type="QUARANTINE_EMAIL",
                created_at="2026-09-03 21:20:00",
                status="PENDING"
            ),
            ActionItem(
                id="ACT-08",
                related_investigation_id="1",
                title="Freeze Axis & ICICI mule accounts under PMLA Section 17",
                description="Accounts BA-02 & BA-03 identified in ₹45,00,000 circular Hawala loop.",
                priority="CRITICAL",
                action_type="FREEZE_ACCOUNT",
                created_at="2026-09-03 21:22:00",
                status="PENDING"
            ),
            ActionItem(
                id="ACT-09",
                related_investigation_id="2",
                title="Requisition cell sector handover logs for Cell Tower BLR-842",
                description="Burner handset PH-03 burst communication detected 48h prior to FIR registration.",
                priority="HIGH",
                action_type="CDR_REQUISITION",
                created_at="2026-09-03 21:25:00",
                status="PENDING"
            ),
            ActionItem(
                id="ACT-10",
                related_investigation_id="3",
                title="Issue Section 91 CrPC notice for BKC Mumbai safehouse (LOC-03)",
                description="Vikram Malhotra operates Hawala clearing desk through Orion Global front office.",
                priority="HIGH",
                action_type="CRPC_NOTICE",
                created_at="2026-09-03 21:28:00",
                status="PENDING"
            )
        ]

        # Generate realistic polar radar incidents (angles 0-360, radius 0.15 - 0.95)
        self.incidents: List[RadarIncident] = self._generate_radar_incidents()

    def _generate_radar_incidents(self) -> List[RadarIncident]:
        raw = [
            ("INC-01", "Malware Infection & RAT Beaconing", "high", 112.0, 0.58, "LOC-01 (Indiranagar)", 3, "LOC-01", "3"),
            ("INC-02", "Hawala Money Laundering Cycle", "high", 45.0, 0.72, "BA-01 -> BA-02 -> BA-03", 4, "BA-03", "1"),
            ("INC-03", "Burner Handset Burst Pre-FIR", "high", 185.0, 0.42, "PH-03 <-> PH-04", 3, "PH-03", "2"),
            ("INC-04", "Bridge Broker Entity Signal", "high", 310.0, 0.82, "Vikram Malhotra (P-103)", 5, "P-103", "3"),
            ("INC-05", "ANPR Night Sighting Anomaly", "medium", 78.0, 0.35, "Scorpio KA-01-MJ-4040", 2, "VH-01", "2"),
            ("INC-06", "Indiranagar Safehouse Co-location", "medium", 240.0, 0.65, "Rahul Kumar & Ravi Shankar", 2, "P-101", "1"),
            ("INC-07", "Candidate Entity Collision (91% Match)", "medium", 155.0, 0.48, "Rahul Kumar vs R. Kumar", 2, "P-105", "1"),
            ("INC-08", "Offshore Wire: Dubai Emirates NBD", "high", 20.0, 0.91, "SWIFT-WIRE-AE-991", 3, "BA-05", "1"),
            ("INC-09", "Mule Structuring Pattern Detected", "high", 275.0, 0.75, "5 split credits in 48h", 2, "A009", "2"),
            ("INC-10", "Unregistered SIM Activation Spike", "low", 140.0, 0.25, "Airtel Goa Transit", 1, "PH-05", "3"),
            ("INC-11", "Vagator Villa Safehouse Sighting", "medium", 195.0, 0.70, "Fortuner MH-02-CX-8899", 2, "LOC-05", "3"),
            ("INC-12", "Orion Global MCA Shell Anomaly", "high", 335.0, 0.88, "U51909MH2021PTC384910", 3, "ORG-01", "1"),
            ("INC-13", "VoIP Gateway IPDR Tunneling", "low", 90.0, 0.20, "Signal Encrypted Proxy", 1, "LOC-04", "2"),
            ("INC-14", "Cash Delivery Node Ping", "low", 220.0, 0.30, "Connaught Place Transit", 2, "LOC-04", "2"),
            ("INC-15", "Cell Sector Handover Discontinuity", "medium", 168.0, 0.52, "BLR-TWR-842 Triangulation", 2, "LOC-06", "1"),
            ("INC-16", "High-Value RTGS Split Placement", "high", 30.0, 0.85, "TXN-ICICI-3819", 2, "BA-02", "1"),
            ("INC-17", "Duplicate IMEI Hardware Beacon", "high", 130.0, 0.62, "354892019284710", 2, "P-101", "3"),
            ("INC-18", "Narcotics Coastal Corridor Handover", "medium", 205.0, 0.78, "Falcon Logistics Fleet", 3, "ORG-02", "3"),
            ("INC-19", "Unverified PAN Number Flag", "low", 350.0, 0.18, "PAN-XXXXX9910K", 1, "P-103", "2"),
            ("INC-20", "Automated Graph Link Prediction hit", "high", 80.0, 0.68, "GraphSAGE P002 <-> P018", 2, "P002", "1"),
            ("INC-21", "Late-Night CDR Burst Cluster", "medium", 160.0, 0.44, "CDR-MUM-4401", 3, "P-104", "2"),
            ("INC-22", "High-Betweenness Transit Route", "high", 290.0, 0.80, "BKC - IND - CP Triangle", 3, "P-103", "3"),
        ]

        incidents = []
        for i, (iid, title, sev, angle, rad, desc, rel_cnt, evid, inv_id) in enumerate(raw):
            incidents.append(
                RadarIncident(
                    id=iid,
                    title=title,
                    severity=sev,
                    angle_degrees=angle,
                    radius_distance=rad,
                    first_detected_at="2026-08-28 09:00:12",
                    last_seen_at="2026-09-03 17:45:01",
                    related_entities_count=rel_cnt,
                    related_entities=[evid, "P-101", "P-103"][:rel_cnt],
                    current_status="Open",
                    description=desc,
                    evidence_id=evid,
                    investigation_id=inv_id
                )
            )
        return incidents

    def get_metrics(self) -> RadarMetrics:
        return self.metrics

    def get_connectors(self) -> List[ConnectorStatus]:
        return self.connectors

    def get_incidents(self, range_filter: str = "1m") -> List[RadarIncident]:
        if range_filter == "1d":
            return [inc for inc in self.incidents if inc.radius_distance >= 0.70]
        elif range_filter == "1w":
            return [inc for inc in self.incidents if inc.radius_distance >= 0.45]
        return self.incidents

    def get_action_items(self) -> List[ActionItem]:
        return self.action_items

    def get_activity_histogram(self) -> List[ActivityHistogramItem]:
        # Generate 24-hour histogram bins matching the bottom bar chart in the image
        time_slots = [
            ("12:00", 120, "low"), ("01:00", 140, "low"), ("02:00", 290, "high"),
            ("03:00", 380, "high"), ("04:00", 410, "high"), ("05:00", 260, "medium"),
            ("06:00", 310, "medium"), ("07:00", 490, "high"), ("08:00", 520, "high"),
            ("09:00", 460, "medium"), ("10:00", 390, "medium"), ("11:00", 310, "low"),
            ("12:00", 280, "low"), ("13:00", 340, "medium"), ("14:00", 290, "low"),
            ("02:00", 410, "high"), ("03:00", 460, "high"), ("04:00", 580, "high"),
            ("05:00", 470, "high"), ("06:00", 390, "medium"), ("Oct 08", 430, "high"),
            ("09:00", 510, "high"), ("10:00", 290, "low"), ("11:00", 180, "low")
        ]
        return [ActivityHistogramItem(time_label=slot, count=cnt, severity=sev) for slot, cnt, sev in time_slots]


radar_service = RadarService()

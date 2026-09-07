"""
CrimeGraph AI — Pydantic Schemas.
Unified enterprise schemas supporting:
1. Cytoscape Workbench MVP (GraphNode, GraphEdge, GraphResponse)
2. Cyber Intelligence Radar Operations Console (RadarIncident, Metrics, ActionItem, Connectors)
3. Controlled AI Investigation Copilot & Orchestration (AIOrchestratedResponse, AIToolCall)
4. Case & Evidence Management with SHA-256 Provenance (CaseModel, EvidenceItem)
5. Entity Resolution, Temporal Timeline, and Anomaly Detection
"""
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


# ============================================================
# Core Graph Models (Deep Investigative / Seed Data)
# ============================================================

class NodeModel(BaseModel):
    id: str
    label: str
    type: str
    risk_level: Optional[str] = "LOW"
    community_id: Optional[int] = 0
    degree: Optional[int] = 0
    betweenness: Optional[float] = 0.0
    closeness: Optional[float] = 0.0
    is_bridge: Optional[bool] = False
    properties: Dict[str, Any] = Field(default_factory=dict)
    source_records: List[str] = Field(default_factory=list)
    x: Optional[float] = None
    y: Optional[float] = None


class EdgeModel(BaseModel):
    id: str
    source: str
    target: str
    type: str
    label: Optional[str] = ""
    weight: Optional[float] = 1.0
    timestamp: Optional[str] = None
    evidence_records: List[str] = Field(default_factory=list)
    source_records: List[str] = Field(default_factory=list)
    is_corroborated: Optional[bool] = False
    confidence: Optional[float] = 0.9
    ingestion_source: Optional[str] = "SYSTEM"
    verification_status: Optional[str] = "VERIFIED"
    properties: Dict[str, Any] = Field(default_factory=dict)


class SubgraphResponse(BaseModel):
    nodes: List[NodeModel]
    edges: List[EdgeModel]
    total_nodes: int
    total_edges: int
    communities_count: Optional[int] = 0
    corroborating_paths: Optional[List[Any]] = None


# ============================================================
# Graph Workbench API Models (Cytoscape MVP UI)
# ============================================================

class GraphNode(BaseModel):
    id: str
    label: str
    type: str  # person, phone, account, vehicle, case, organization, location
    comm: str = ""  # community tag
    risk: str = "low"  # low, med, high, critical
    degree: int = 0
    betweenness: float = 0.0
    betweenness_rank: int = 0
    x: Optional[float] = None
    y: Optional[float] = None
    properties: Dict[str, Any] = Field(default_factory=dict)


class GraphEdge(BaseModel):
    id: str
    source: str
    target: str
    kind: str  # CALLED, OWNS, TRANSFER, LINKED, NAMED_IN, SEEN_NEAR, SUGGESTED, USES, CONTROLS
    label: str
    date: Optional[str] = None
    rec: str = ""  # record ID for audit trail
    weight: float = 1.0
    confidence: float = 0.9
    verification_status: str = "VERIFIED"
    ingestion_source: str = "TELCO"
    properties: Dict[str, Any] = Field(default_factory=dict)


class GraphResponse(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]
    stats: Dict[str, Any] = Field(default_factory=dict)


# ============================================================
# Path Finding Models
# ============================================================

class PathHop(BaseModel):
    from_node: str
    to_node: str
    edge_id: str
    kind: str
    label: str
    rec: str
    narrative: str


class PathResponse(BaseModel):
    shortest: List[PathHop]
    corroborating: Optional[List[PathHop]] = None
    distinct: bool = False


# ============================================================
# Centrality & Community Models
# ============================================================

class CentralityEntry(BaseModel):
    node_id: str
    label: str
    type: str
    degree: int
    betweenness: float
    rank: int
    is_mastermind: bool = False


class CommunityEntry(BaseModel):
    node_id: str
    community_id: int


# ============================================================
# AI Link Prediction & Anomaly Models
# ============================================================

class SuggestedLink(BaseModel):
    a: str
    b: str
    score: float


class AnomalyFlag(BaseModel):
    node: str
    type: str
    score: float
    reason: str = ""


class AnomalyReport(BaseModel):
    id: str
    type: str
    severity: str
    title: str
    description: str
    involved_node_ids: List[str]
    involved_edge_ids: List[str]
    evidence_records: List[str] = Field(default_factory=list)
    confidence: float = 0.9
    recommended_action: str = ""


# ============================================================
# Entity Resolution & Merging Models
# ============================================================

class MergeRequest(BaseModel):
    primary_id: str
    duplicate_id: str
    merged_name: Optional[str] = None
    notes: Optional[str] = None


class EntityResolutionCandidate(BaseModel):
    id: str
    entity_a: NodeModel
    entity_b: NodeModel
    confidence: float
    name_similarity: float
    phone_match: bool
    location_overlap: float
    historical_association: float
    status: str = "PENDING"
    reasons: List[str] = Field(default_factory=list)


# ============================================================
# Explainable AI (XAI) & Assistant Models
# ============================================================

class ExplainPayload(BaseModel):
    node_id: str
    role: str
    confidence: str
    why: str
    supporting_records: List[str]
    action: str


class XAIReasoningStep(BaseModel):
    step_number: int
    observation: str
    evidence_citation: str
    confidence_contribution: str


class AIChatRequest(BaseModel):
    query: str
    case_id: Optional[str] = None
    session_id: Optional[str] = None


class AIChatResponse(BaseModel):
    query: str
    answer: str
    identified_entities: List[str] = Field(default_factory=list)
    subgraph: Optional[SubgraphResponse] = None
    evidentiary_records: List[str] = Field(default_factory=list)
    confidence: float = 0.85
    structural_role: Optional[str] = None
    reasoning_steps: List[XAIReasoningStep] = Field(default_factory=list)
    suggested_actions: List[str] = Field(default_factory=list)


# ============================================================
# Professional AI Copilot Standardized Response (Point 33)
# ============================================================

class AIToolCall(BaseModel):
    tool: str
    operation: str
    parameters: Dict[str, Any] = Field(default_factory=dict)
    status: str = "EXECUTED"


class EvidenceItem(BaseModel):
    id: str
    case_id: str
    type: str  # CDR, BANK_STATEMENT, FIR, SURVEILLANCE, DIGITAL_EXTRACTION, ANPR
    title: str
    source: str
    sha256: str
    timestamp: str
    verification_status: str = "VERIFIED"
    confidence: float = 0.95
    related_entities: List[str] = Field(default_factory=list)
    related_edges: List[str] = Field(default_factory=list)
    file_path: Optional[str] = None
    notes: Optional[str] = None


class AIOrchestratedResponse(BaseModel):
    query: str
    answer: str
    evidence: List[EvidenceItem] = Field(default_factory=list)
    graph_correlation: str
    reasoning: List[XAIReasoningStep] = Field(default_factory=list)
    confidence: float = 0.89
    gaps: str
    suggested_next_steps: List[str] = Field(default_factory=list)
    sources: List[str] = Field(default_factory=list)
    tools_executed: List[AIToolCall] = Field(default_factory=list)
    disclaimer: str = "⚠ AI-generated analytical assessment. Investigators should independently verify evidence."


# ============================================================
# Radar Operations Console Models (Uploaded UI)
# ============================================================

class RadarIncident(BaseModel):
    id: str
    title: str
    severity: str  # low, medium, high
    angle_degrees: float  # polar spoke angle (0 - 360)
    radius_distance: float  # polar distance (0.1 - 1.0)
    first_detected_at: str
    last_seen_at: str
    related_entities_count: int
    related_entities: List[str] = Field(default_factory=list)
    current_status: str = "Open"
    description: str
    evidence_id: str
    investigation_id: str


class RadarMetrics(BaseModel):
    recent_investigations: int = 22
    total_investigations: int = 55
    low_severity: int = 5
    medium_severity: int = 10
    high_severity: int = 40
    exposed_entities: int = 152
    exposed_entities_trend_24h: int = 18
    interactions_processed: int = 100000
    interactions_24h: int = 4800


class ConnectorStatus(BaseModel):
    id: str
    name: str
    type: str
    status: str  # ACTIVE, STANDBY, DEGRADED
    last_sync: str
    records_synced: int


class ActionItem(BaseModel):
    id: str
    related_investigation_id: str
    title: str
    description: str
    priority: str  # CRITICAL, HIGH, MEDIUM
    action_type: str  # FREEZE_ACCOUNT, CDR_REQUISITION, CRPC_NOTICE, INTERCEPT, RESOLVE_ENTITY, EXPORT_DOSSIER
    created_at: str
    status: str = "PENDING"


class ActivityHistogramItem(BaseModel):
    time_label: str
    count: int
    severity: str = "low"


# ============================================================
# Case & Timeline Models
# ============================================================

class CaseModel(BaseModel):
    case_id: str
    title: str
    fir_number: str
    section_law: str
    police_station: str
    incident_date: str
    status: str
    primary_accused: List[str] = Field(default_factory=list)
    description: str
    node_count: int
    edge_count: int
    evidence_count: int = 0
    alerts_count: int = 0
    lead_investigator: str = "Inspector A. Rao"
    last_activity: str = "Just now"


class TimelineEvent(BaseModel):
    id: str
    timestamp: str
    event_type: str  # TRANSACTION, CALL, TOWER_PING, SIGHTING, FIR_REGISTRATION, KYC_OPEN
    title: str
    description: str
    source_entity_id: str
    target_entity_id: Optional[str] = None
    location_name: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    evidence_id: Optional[str] = None
    severity: str = "MEDIUM"


class TimelineResponse(BaseModel):
    events: List[TimelineEvent]
    total_events: int
    ai_summary: Optional[str] = None


# ============================================================
# NL Query & Ingest Models
# ============================================================

class QueryRequest(BaseModel):
    text: str


class QueryResponse(BaseModel):
    intent: str
    result: Any
    cypher: Optional[str] = None


class AuditEntry(BaseModel):
    timestamp: str
    action: str
    hash: str
    user: str = "investigator"


class IngestResponse(BaseModel):
    entities_loaded: int
    edges_loaded: int
    alerts: List[str] = Field(default_factory=list)

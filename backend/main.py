"""
CrimeGraph AI — Investigative Intelligence Platform API.
Enterprise API Gateway supporting:
1. Cyber Intelligence Operations Console & Radar UI (incidents, metrics, connectors, actions)
2. Interactive Cytoscape Network Graph Workbench (paths, centrality, communities, explainability)
3. Controlled AI Investigation Copilot with Tool Orchestration (7-part standardized insight)
4. Case & Cryptographic Evidence Management (SHA-256 hash chains, chain of custody)
5. Entity Resolution, Temporal Timeline, and Anomaly Detection
"""
import json
import os
import sys
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, Query, UploadFile, File, HTTPException, Response, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Ensure package imports resolve cleanly from any cwd
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(CURRENT_DIR)
for path in [CURRENT_DIR, ROOT_DIR]:
    if path not in sys.path:
        sys.path.insert(0, path)

try:
    from backend.services.graph_service import graph_service
    from backend.services.nl_query_service import translate_query
    from backend.services.audit_service import audit_service
    from backend.services.entity_resolution_service import entity_resolution_service
    from backend.services.anomaly_service import anomaly_service
    from backend.services.ai_assistant_service import ai_assistant_service
    from backend.services.ai_orchestrator import ai_orchestrator
    from backend.services.radar_service import radar_service
    from backend.services.case_service import case_service
    from backend.services.timeline_service import timeline_service
    from backend.services.obsidian_service import obsidian_service
    from backend.services.urbantwin_service import urbantwin_service
    from backend.services.gnn_service import gnn_service
    from backend.services.auth_service import auth_service
    from backend.services.security_service import SecurityMiddleware
    from backend.models.schemas import AIChatRequest, MergeRequest, AIOrchestratedResponse
except ImportError:
    from services.graph_service import graph_service
    from services.nl_query_service import translate_query
    from services.audit_service import audit_service
    from services.entity_resolution_service import entity_resolution_service
    from services.anomaly_service import anomaly_service
    from services.ai_assistant_service import ai_assistant_service
    from services.ai_orchestrator import ai_orchestrator
    from services.radar_service import radar_service
    from services.case_service import case_service
    from services.timeline_service import timeline_service
    from services.obsidian_service import obsidian_service
    from services.urbantwin_service import urbantwin_service
    from services.gnn_service import gnn_service
    from services.auth_service import auth_service
    from services.security_service import SecurityMiddleware
    from models.schemas import AIChatRequest, MergeRequest, AIOrchestratedResponse

app = FastAPI(
    title="CrimeGraph AI — Investigative Intelligence Platform API",
    description="Enterprise Explainable Criminal Network Analysis & Intelligence Platform",
    version="2.1.0",
)

# Production-configurable CORS origins for Render
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "*")
origins = [o.strip() for o in allowed_origins_env.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(SecurityMiddleware)


# ============================================================
# Health & Status
# ============================================================
@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "CrimeGraph AI Enterprise",
        "nodes": len(graph_service.nodes_dict),
        "edges": len(graph_service.edges_dict),
        "cases": len(case_service.cases),
        "evidence_items": len(case_service.evidence),
    }


# ============================================================
# Radar & Operational Intelligence (Uploaded Console UI)
# ============================================================
@app.get("/investigations/metrics")
def get_radar_metrics():
    return radar_service.get_metrics()


@app.get("/investigations/connectors")
def get_radar_connectors():
    return radar_service.get_connectors()


@app.get("/investigations/radar")
def get_radar_incidents(range: str = Query("1m")):
    audit_service.log(f"radar incidents query range={range}")
    return radar_service.get_incidents(range)


@app.get("/investigations/actions")
def get_action_items():
    return radar_service.get_action_items()


@app.get("/investigations/activity-volume")
def get_activity_histogram():
    return radar_service.get_activity_histogram()


# ============================================================
# AI Investigation Copilot (Controlled Tool Orchestrator)
# ============================================================
class CopilotQueryRequest(BaseModel):
    query: str
    case_id: Optional[str] = "CASE-FIR-102"

@app.post("/ai/copilot", response_model=AIOrchestratedResponse)
def copilot_investigate(req: CopilotQueryRequest):
    audit_service.log(f"AI Copilot: {req.query[:40]}")
    return ai_orchestrator.orchestrate_investigation(req.query, req.case_id)


@app.post("/chat")
def chat_investigation(req: AIChatRequest):
    audit_service.log(f"AI Assistant query: {req.query[:40]}")
    return ai_assistant_service.process_query(req)


# ============================================================
# Case & Cryptographic Evidence Management
# ============================================================
@app.get("/cases")
def get_all_cases():
    audit_service.log("case list queried")
    return case_service.get_cases()


@app.get("/cases/{case_id}")
def get_case_details(case_id: str):
    c = case_service.get_case(case_id)
    if not c:
        raise HTTPException(status_code=404, detail=f"Case {case_id} not found")
    return c


@app.get("/cases/{case_id}/evidence")
def get_case_evidence(case_id: str):
    return case_service.get_evidence_for_case(case_id)


@app.get("/evidence")
def get_all_evidence():
    return case_service.get_all_evidence()


# ============================================================
# Timeline & Temporal Intelligence
# ============================================================
@app.get("/timeline")
def get_timeline(
    start_time: Optional[str] = Query(None),
    end_time: Optional[str] = Query(None),
    entity_id: Optional[str] = Query(None)
):
    audit_service.log("timeline queried")
    return timeline_service.get_timeline_response(entity_id=entity_id)


# ============================================================
# Entity Resolution & Deduplication Queue
# ============================================================
@app.get("/entity-resolution/candidates")
def get_resolution_candidates(threshold: float = Query(0.70)):
    return entity_resolution_service.scan_for_duplicates(threshold=threshold)


@app.post("/entity-resolution/merge")
def merge_resolution_candidate(req: MergeRequest):
    audit_service.log(f"Entity merged: {req.duplicate_id} into {req.primary_id}")
    return entity_resolution_service.merge_candidate(req)


# ============================================================
# Graph Analytics (Cytoscape Graph Workbench)
# ============================================================
@app.get("/graph")
def get_graph(case_id: Optional[str] = Query(None)):
    audit_service.log(f"graph query case={case_id}")
    return graph_service.get_graph(case_id)


@app.get("/path")
def get_path(
    from_id: str = Query(..., alias="from"),
    to_id: str = Query(..., alias="to"),
):
    audit_service.log(f"path {from_id} → {to_id}")
    return graph_service.get_path(from_id, to_id)


@app.get("/centrality")
def get_centrality():
    audit_service.log("centrality query")
    return graph_service.get_centrality()


@app.get("/communities")
def get_communities():
    audit_service.log("community detection query")
    return graph_service.get_communities()


@app.get("/predict-links")
def get_predict_links():
    audit_service.log("predict-links query")
    return graph_service.get_predict_links()


@app.get("/anomaly-flags")
def get_anomaly_flags():
    audit_service.log("anomaly-flags query")
    return graph_service.get_anomaly_flags()


@app.get("/anomalies/detect")
def detect_anomalies_full():
    audit_service.log("Full graph anomaly scan executed")
    return anomaly_service.detect_anomalies()


@app.get("/explain")
def get_explain(node_id: str = Query(...)):
    audit_service.log(f"explain {node_id}")
    result = graph_service.get_explain(node_id)
    if not result:
        node = graph_service.nodes_dict.get(node_id)
        if not node:
            raise HTTPException(status_code=404, detail=f"No entity for {node_id}")
        return {
            "role": f"Standard {node.get('type', 'entity')}",
            "confidence": "baseline",
            "why": f"Degree {node.get('degree', 0)}, Betweenness {node.get('betweenness', 0.0)}. No elevated risk signature flagged.",
            "supporting_records": [e["edge"] for e in graph_service.adj.get(node_id, [])[:5]],
            "action": "Maintain standard case record."
        }
    return result


class QueryBody(BaseModel):
    text: str

@app.post("/query")
def post_query(body: QueryBody):
    audit_service.log(f'query: "{body.text[:40]}"')
    parsed = translate_query(body.text, graph_service.nodes_dict)
    intent = parsed["intent"]
    params = parsed.get("params", {})

    if intent == "path":
        result = graph_service.get_path(params["from"], params["to"])
    elif intent == "neighborhood":
        result = graph_service.get_neighborhood(params["node_id"], params.get("hops", 2))
    elif intent == "mastermind":
        centrality = graph_service.get_centrality()
        result = centrality[:5] if centrality else []
    elif intent == "anomalies":
        result = graph_service.get_anomaly_flags()
    elif intent == "hidden_links":
        result = graph_service.get_predict_links()
    elif intent == "entity_focus":
        nid = params["node_id"]
        result = {
            "node": graph_service.nodes_dict.get(nid),
            "neighborhood": graph_service.get_neighborhood(nid, 1),
            "explain": graph_service.get_explain(nid),
        }
    else:
        result = {"message": "Query pattern not recognised. Try: path between X and Y, "
                  "connections of X within N hops, who is the mastermind, show anomalies, "
                  "show hidden links, or type an entity name."}

    return {"intent": intent, "result": result}


# ============================================================
# Audit & Provenance
# ============================================================
@app.get("/audit")
def get_audit():
    return {
        "entries": audit_service.get_entries(),
        "chain_valid": audit_service.verify_chain(),
        "total": len(audit_service.entries),
    }


# ============================================================
# Dossier & Obsidian Vault Export
# ============================================================
@app.post("/dossier")
def generate_dossier(entity_id: str = Query(...)):
    audit_service.log(f"dossier generated for {entity_id}")
    node = graph_service.nodes_dict.get(entity_id)
    if not node:
        raise HTTPException(status_code=404, detail=f"Entity {entity_id} not found")
    return {
        "entity_id": entity_id,
        "label": node["label"],
        "status": "Dossier generated with hash-chained provenance trail.",
        "data": {
            "node": node,
            "explain": graph_service.get_explain(entity_id),
            "neighborhood": graph_service.get_neighborhood(entity_id, 2),
        }
    }


@app.get("/vault/export")
def export_obsidian_vault():
    audit_service.log("Obsidian case vault exported")
    zip_bytes = obsidian_service.create_vault_zip()
    return Response(
        content=zip_bytes,
        media_type="application/zip",
        headers={"Content-Disposition": "attachment; filename=CrimeGraph_Case_Vault.zip"}
    )


# ============================================================
# Ingestion Endpoint
# ============================================================
@app.post("/ingest")
async def ingest(file: UploadFile = File(...)):
    audit_service.log(f"ingest {file.filename}")
    content = await file.read()
    return {
        "filename": file.filename,
        "entities_loaded": len(graph_service.nodes_dict),
        "edges_loaded": len(graph_service.edges_dict),
        "alerts": ["Data loaded from pre-generated CSVs and validated."]
    }


# ============================================================
# UrbanTwin AI — Multi-Camera Traffic Intelligence & Digital Twin Endpoints
# ============================================================
class UrbanTwinSimulationRequest(BaseModel):
    scenario_id: Optional[str] = "signal_optimization_junction_a"
    custom_params: Optional[Dict[str, Any]] = None


@app.get("/api/cameras")
@app.get("/cameras")
def get_cameras():
    return urbantwin_service.get_cameras()


@app.get("/api/cameras/{camera_id}")
@app.get("/cameras/{camera_id}")
def get_camera(camera_id: str):
    cam = urbantwin_service.get_camera(camera_id)
    if not cam:
        raise HTTPException(status_code=404, detail=f"Camera {camera_id} not found")
    return cam


@app.get("/api/traffic/current")
@app.get("/traffic/current")
def get_traffic_current():
    return urbantwin_service.get_traffic_current()


@app.get("/api/traffic/history")
@app.get("/traffic/history")
def get_traffic_history():
    return urbantwin_service.get_traffic_history()


@app.get("/api/vehicles/{vehicle_id}/trajectory")
@app.get("/vehicles/{vehicle_id}/trajectory")
def get_vehicle_trajectory(vehicle_id: str):
    traj = urbantwin_service.get_vehicle_trajectory(vehicle_id)
    if not traj:
        raise HTTPException(status_code=404, detail=f"Trajectory for vehicle {vehicle_id} not found")
    return traj


@app.get("/api/vehicles/trajectories")
@app.get("/vehicles/trajectories")
def get_all_trajectories():
    return urbantwin_service.get_all_trajectories()


@app.get("/api/roads")
@app.get("/roads")
def get_roads():
    return urbantwin_service.get_roads_analytics()


@app.get("/api/roads/{road_id}/analytics")
@app.get("/roads/{road_id}/analytics")
def get_road_analytics(road_id: str):
    road = urbantwin_service.get_road_analytics(road_id)
    if not road:
        raise HTTPException(status_code=404, detail=f"Road {road_id} not found")
    return road


@app.get("/api/predictions")
@app.get("/predictions")
def get_predictions():
    return urbantwin_service.get_predictions()


@app.get("/api/anomalies")
@app.get("/anomalies")
def get_anomalies():
    return urbantwin_service.get_anomalies()


@app.post("/api/simulation")
@app.post("/simulation")
def run_simulation(req: UrbanTwinSimulationRequest):
    return urbantwin_service.run_simulation(req.scenario_id or "signal_optimization_junction_a", req.custom_params)


# ============================================================
# GNN Machine Learning Intelligence Layer Endpoints
# ============================================================
@app.get("/api/ml/predict-links")
@app.get("/ml/predict-links")
def get_ml_predict_links():
    return gnn_service.get_predicted_links()


@app.get("/api/ml/anomalies")
@app.get("/ml/anomalies")
def get_ml_anomalies():
    return gnn_service.get_anomalies()


@app.get("/api/ml/influence-scores")
@app.get("/ml/influence-scores")
def get_ml_influence_scores():
    return gnn_service.get_influence_scores()


@app.get("/api/ml/explain")
@app.get("/ml/explain")
def get_ml_explanation(link_id: str = Query("PRED-LINK-01")):
    return gnn_service.get_explanation(link_id)


@app.get("/api/ml/temporal-snapshots")
@app.get("/ml/temporal-snapshots")
def get_ml_temporal_snapshots():
    return gnn_service.get_temporal_snapshots()


@app.get("/api/ml/model-card")
@app.get("/ml/model-card")
def get_ml_model_card():
    return gnn_service.get_model_metadata()


# ============================================================
# User Authentication & Investigator Identity Endpoints
# ============================================================
class LoginPayload(BaseModel):
    identifier: str
    password: str


class RegisterPayload(BaseModel):
    email: str
    username: str
    password: str
    full_name: Optional[str] = ""
    agency: Optional[str] = ""
    clearance: Optional[str] = "LEVEL 2 — CONFIDENTIAL"


@app.post("/api/auth/register")
@app.post("/auth/register")
def api_register(req: RegisterPayload):
    try:
        return auth_service.register(
            email=req.email,
            username=req.username,
            password=req.password,
            full_name=req.full_name or "",
            agency=req.agency or "",
            clearance=req.clearance or "LEVEL 2 — CONFIDENTIAL"
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/auth/login")
@app.post("/auth/login")
def api_login(req: LoginPayload):
    try:
        return auth_service.login(req.identifier, req.password)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))


@app.get("/api/auth/me")
@app.get("/auth/me")
def api_get_me(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authentication token required.")
    token = authorization.replace("Bearer ", "").strip()
    profile = auth_service.get_profile(token)
    if not profile:
        raise HTTPException(status_code=401, detail="Invalid or expired session token.")
    return profile


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)

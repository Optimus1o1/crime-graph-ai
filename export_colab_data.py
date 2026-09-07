import json
import os
import sys

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(CURRENT_DIR, "backend", "data")
sys.path.insert(0, CURRENT_DIR)

from backend.data.seed_data import NODES_DATA, EDGES_DATA, CASES_DATA, ANOMALIES_DATA

def export_for_colab():
    # Load predictions if present
    predictions_path = os.path.join(DATA_DIR, "predictions.json")
    predictions_data = {}
    if os.path.exists(predictions_path):
        with open(predictions_path, "r", encoding="utf-8") as pf:
            predictions_data = json.load(pf)

    # Build node mapping
    node_id_to_idx = {n["id"]: idx for idx, n in enumerate(NODES_DATA)}
    
    # Format node features
    # Features: [degree, betweenness, closeness, risk_weight, is_person, is_phone, is_account, is_company, is_location]
    type_map = {"Person": 0, "Phone": 1, "Account": 2, "Bank_Account": 2, "Company": 3, "Organization": 3, "Location": 4, "Vehicle": 5}
    risk_map = {"CRITICAL": 1.0, "HIGH": 0.75, "MED": 0.5, "MEDIUM": 0.5, "LOW": 0.25}

    formatted_nodes = []
    for idx, n in enumerate(NODES_DATA):
        t_idx = type_map.get(n.get("type", "Person"), 0)
        risk_val = risk_map.get(n.get("risk_level", "MED"), 0.5)
        degree_val = float(n.get("degree", 1)) / 20.0
        betweenness_val = float(n.get("betweenness", 0.0))
        closeness_val = float(n.get("closeness", 0.5))

        feature_vector = [
            degree_val,
            betweenness_val,
            closeness_val,
            risk_val,
            1.0 if t_idx == 0 else 0.0,
            1.0 if t_idx == 1 else 0.0,
            1.0 if t_idx == 2 else 0.0,
            1.0 if t_idx == 3 else 0.0,
            1.0 if t_idx == 4 else 0.0,
            1.0 if t_idx == 5 else 0.0
        ]

        formatted_nodes.append({
            "index": idx,
            "id": n["id"],
            "label": n.get("label", n["id"]),
            "type": n.get("type", "Person"),
            "risk_level": n.get("risk_level", "MED"),
            "community_id": n.get("community_id", 0),
            "features": feature_vector
        })

    # Format edges (edge_index)
    formatted_edges = []
    edge_index_u = []
    edge_index_v = []
    
    for e in EDGES_DATA:
        src = e.get("source_id") or e.get("source")
        tgt = e.get("target_id") or e.get("target")
        if src in node_id_to_idx and tgt in node_id_to_idx:
            u = node_id_to_idx[src]
            v = node_id_to_idx[tgt]
            edge_index_u.append(u)
            edge_index_v.append(v)
            # Undirected graph for GNN
            edge_index_u.append(v)
            edge_index_v.append(u)
            formatted_edges.append({
                "source": src,
                "target": tgt,
                "source_idx": u,
                "target_idx": v,
                "type": e.get("type", "ASSOCIATED_WITH"),
                "weight": float(e.get("weight", 1.0))
            })

    output_dataset = {
        "metadata": {
            "name": "CrimeGraph AI Criminal Syndicate Topology Dataset",
            "description": "50+ Heterogeneous Nodes, 100+ Edges covering Hawala transactions, SIM Box CDRs, and Shell companies for GraphSAGE Link Prediction.",
            "num_nodes": len(formatted_nodes),
            "num_edges": len(formatted_edges),
            "feature_dim": 10,
            "feature_names": ["degree_norm", "betweenness", "closeness", "risk_weight", "is_person", "is_phone", "is_account", "is_company", "is_location", "is_vehicle"]
        },
        "nodes": formatted_nodes,
        "edges": formatted_edges,
        "edge_index": [edge_index_u, edge_index_v],
        "ground_truth_predictions": predictions_data,
        "anomalies": ANOMALIES_DATA,
        "cases": CASES_DATA
    }

    out_file = os.path.join(DATA_DIR, "crimegraph_dataset_for_colab.json")
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(output_dataset, f, indent=2)

    print(f"Successfully exported {len(formatted_nodes)} nodes and {len(formatted_edges)} edges to {out_file}")

if __name__ == "__main__":
    export_for_colab()

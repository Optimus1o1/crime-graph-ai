"""
CrimeGraph AI — GNN Test Suite.
Tests GraphSAGE link prediction, GAE anomaly detection, Influence scoring,
GNNExplainer feature attribution, and Temporal graph snapshots.
"""
import pytest
from backend.services.gnn_service import gnn_service


def test_graphsage_link_prediction():
    links = gnn_service.get_predicted_links()
    assert len(links) >= 3
    # Check Rahul Kumar (P-101) to Viktor Rao (P-104) link
    l1 = next(l for l in links if l["id"] == "PRED-LINK-01")
    assert l1["source"] in ["P001", "P-101"]
    assert l1["target"] in ["P003", "P-104"]
    assert l1["probability"] == 0.89
    assert l1["discovery_mode"] == "INDUCTIVE_GRAPHSAGE"
    assert l1["common_neighbors_count"] == 3


def test_gae_anomaly_detection():
    anomalies = gnn_service.get_anomalies()
    assert len(anomalies) >= 3
    # Check circular money-mule layering ring
    mule_anom = next(a for a in anomalies if a["subgraph_type"] == "MONEY_MULE_CHAIN")
    assert mule_anom["anomaly_score"] == 0.94
    assert mule_anom["cluster_id"] == 17
    assert len(mule_anom["involved_nodes"]) >= 4
    assert mule_anom["behavior_deviation"] > 0.90


def test_influence_scoring():
    scores = gnn_service.get_influence_scores()
    assert len(scores) >= 4
    # Check Vikram Malhotra (P-103) bridge broker
    p103 = next(s for s in scores if s["node_id"] == "P-103")
    assert p103["betweenness"] == 0.88
    assert p103["gnn_score"] == 0.92
    assert p103["classification"] == "CRITICAL_NETWORK_INFLUENCE"
    assert p103["visual_scale"] >= 1.4


def test_gnn_explainer_feature_attribution():
    exp = gnn_service.get_explanation("PRED-LINK-01")
    assert exp is not None
    assert exp["probability"] == "89%"
    attribs = exp["feature_attribution"]
    assert len(attribs) == 5
    total_pct = sum(a["importance_pct"] for a in attribs)
    assert total_pct == 100
    assert attribs[0]["importance_pct"] == 34  # Common Neighbors
    assert len(exp["subgraph_evidence"]) >= 2


def test_temporal_graph_snapshots():
    snapshots = gnn_service.get_temporal_snapshots()
    assert len(snapshots) == 5
    # Epochs progress chronologically
    assert snapshots[0]["label"] == "Jan 2026"
    assert snapshots[4]["label"] == "May 2026"
    assert snapshots[0]["nodes_count"] < snapshots[4]["nodes_count"]
    assert snapshots[0]["edges_count"] < snapshots[4]["edges_count"]


def test_model_card_metadata():
    card = gnn_service.get_model_metadata()
    assert "GraphSAGE" in card["architecture"]
    metrics = card["metrics"]
    assert metrics["auc_roc"] >= 0.50
    assert metrics["precision"] >= 0.50
    assert metrics["recall"] >= 0.50

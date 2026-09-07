"""
Unit & Integration Tests for CrimeGraph AI Backend.
Tests Graph Analytics, Louvain Communities, Shortest Path, Entity Resolution,
Anomaly Detection, AI Assistant, and Obsidian Export.
"""

import pytest
from backend.services.graph_service import graph_service
from backend.services.entity_resolution_service import entity_resolution_service
from backend.services.anomaly_service import anomaly_service
from backend.services.ai_assistant_service import ai_assistant_service
from backend.services.obsidian_service import obsidian_service
from backend.models.schemas import AIChatRequest, MergeRequest


def test_graph_initialization_and_metrics():
    graph_service.load_initial_data()
    subgraph = graph_service.get_full_graph()
    assert subgraph.total_nodes >= 20
    assert subgraph.total_edges >= 30
    assert subgraph.communities_count >= 2

    # Verify Vikram Malhotra is flagged as a bridge
    vm = graph_service.nodes_dict.get("P-103")
    assert vm is not None
    assert vm["betweenness"] >= 0.08
    assert vm["is_bridge"] is True


def test_multi_hop_subgraph():
    subgraph = graph_service.get_multi_hop_subgraph("P-101", hops=2)
    assert subgraph.total_nodes > 1
    assert any(n.id == "P-101" for n in subgraph.nodes)
    assert any(n.id == "BA-01" for n in subgraph.nodes)


def test_shortest_path():
    path_res = graph_service.find_shortest_path("P-101", "P-104")
    assert path_res.total_nodes >= 3
    node_ids = [n.id for n in path_res.nodes]
    assert "P-101" in node_ids
    assert "P-104" in node_ids
    assert len(node_ids) >= 3


def test_entity_resolution_scan_and_merge():
    candidates = entity_resolution_service.scan_for_duplicates(threshold=0.70)
    assert len(candidates) >= 1
    cand = candidates[0]
    assert cand.confidence >= 0.70

    # Test merge
    initial_count = len(graph_service.nodes_dict)
    req = MergeRequest(primary_id="P-101", duplicate_id="P-105", merged_name="Rahul Kumar (Merged)")
    res = entity_resolution_service.merge_candidate(req)
    assert res["success"] is True
    assert len(graph_service.nodes_dict) == initial_count - 1
    assert "P-105" not in graph_service.nodes_dict
    assert "Rahul Kumar (Merged)" in graph_service.nodes_dict["P-101"]["label"]

    # Reset for further tests
    graph_service.load_initial_data()
    entity_resolution_service.load_initial_candidates()


def test_anomaly_detection():
    anomalies = anomaly_service.detect_anomalies()
    assert len(anomalies) >= 2
    types = [a.type for a in anomalies]
    assert "FINANCIAL_LAYERING_CYCLE" in types
    assert "BRIDGE_BROKER" in types


def test_ai_investigation_assistant_xai():
    req = AIChatRequest(query="How is Rahul Kumar connected to Viktor Rao?")
    resp = ai_assistant_service.process_query(req)
    assert resp.confidence > 0.80
    assert len(resp.evidentiary_records) > 0
    assert len(resp.reasoning_steps) >= 2
    assert "Vikram Malhotra" in resp.answer or "P-103" in resp.answer or "Hawala" in resp.answer


def test_obsidian_vault_generation():
    notes = obsidian_service.generate_markdown_notes()
    assert len(notes) >= 20
    assert "Investigation/00_Syndicate_Overview.md" in notes
    assert "```mermaid" in notes["Investigation/00_Syndicate_Overview.md"]
    assert any("YAML" not in v for v in notes.values())

    zip_bytes = obsidian_service.create_vault_zip()
    assert len(zip_bytes) > 500

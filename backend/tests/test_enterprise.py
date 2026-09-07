"""
Unit & Integration Tests for CrimeGraph AI Enterprise Services.
Tests Radar Operational Intelligence, AI Copilot Tool Orchestration,
Case & Evidence Management with SHA-256 Provenance, and Timeline Intelligence.
"""
import pytest
from backend.services.radar_service import radar_service
from backend.services.case_service import case_service
from backend.services.ai_orchestrator import ai_orchestrator
from backend.services.timeline_service import timeline_service


def test_radar_service_metrics_and_incidents():
    metrics = radar_service.get_metrics()
    assert metrics.recent_investigations == 22
    assert metrics.total_investigations == 55
    assert metrics.low_severity == 5
    assert metrics.medium_severity == 10
    assert metrics.high_severity == 40
    assert metrics.exposed_entities == 152
    assert metrics.exposed_entities_trend_24h == 18

    incidents = radar_service.get_incidents("1m")
    assert len(incidents) >= 15
    for inc in incidents:
        assert 0.0 <= inc.angle_degrees <= 360.0
        assert 0.0 <= inc.radius_distance <= 1.0
        assert inc.severity in ["low", "medium", "high"]

    actions = radar_service.get_action_items()
    assert len(actions) >= 10

    histogram = radar_service.get_activity_histogram()
    assert len(histogram) >= 20


def test_case_and_evidence_provenance():
    cases = case_service.get_cases()
    assert len(cases) >= 2
    case_102 = case_service.get_case("CASE-FIR-102")
    assert case_102 is not None
    assert "Operation Falcon Syndicate" in case_102.title

    evidence = case_service.get_evidence_for_case("CASE-FIR-102")
    assert len(evidence) >= 8
    for item in evidence:
        assert len(item.sha256) == 64  # valid SHA-256 hex string
        assert item.verification_status == "VERIFIED"


def test_ai_copilot_tool_orchestration():
    resp = ai_orchestrator.orchestrate_investigation("How is Rahul Kumar connected to Viktor Rao?")
    assert resp.confidence >= 0.85
    assert len(resp.evidence) >= 1
    assert len(resp.reasoning) >= 2
    assert len(resp.tools_executed) >= 1
    assert "Rahul Kumar" in resp.answer
    assert "Vikram Malhotra" in resp.answer or "P-103" in resp.answer
    assert len(resp.suggested_next_steps) >= 1
    assert "disclaimer" in resp.model_dump()


def test_timeline_intelligence():
    t_resp = timeline_service.get_timeline_response()
    assert t_resp.total_events >= 5
    assert t_resp.ai_summary is not None
    assert "concentrated operational cluster" in t_resp.ai_summary.lower()

"""
Integration test suite for CrimeGraph AI Blockchain API endpoints.
Tests the FastAPI gateway endpoints using TestClient.
"""

import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)


def test_api_blockchain_status():
    response = client.get("/api/blockchain/status")
    assert response.status_code == 200
    data = response.json()
    assert "mode" in data
    assert data["chain_id"] == 80002
    assert "total_anchors" in data


def test_api_blockchain_history():
    response = client.get("/api/blockchain/history")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


def test_api_evidence_anchor():
    # Anchor evidence for case CG-2024-0847
    response = client.post("/api/evidence/anchor", json={"case_id": "CG-2024-0847"})
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "CONFIRMED"
    assert data["tx_hash"].startswith("0x")
    assert data["block_number"] > 0
    assert data["merkle_root"] is not None


def test_api_evidence_verify():
    # Get all evidence first
    ev_resp = client.get("/evidence")
    assert ev_resp.status_code == 200
    ev_list = ev_resp.json()
    assert len(ev_list) > 0

    first_ev = ev_list[0]
    ev_id = first_ev["id"]

    # Verify without expected SHA
    verif_resp = client.get(f"/api/evidence/{ev_id}/verify")
    assert verif_resp.status_code == 200
    verif_data = verif_resp.json()
    assert verif_data["verified"] is True
    assert verif_data["status"] == "VERIFIED"
    assert verif_data["tx_hash"].startswith("0x")

    # Verify with matching expected SHA
    verif_resp2 = client.get(f"/api/evidence/{ev_id}/verify?expected_sha256={first_ev['sha256']}")
    assert verif_resp2.status_code == 200
    assert verif_resp2.json()["verified"] is True

    # Tampering: verify with mismatched expected SHA
    tampered_sha = "0" * 64
    verif_tampered = client.get(f"/api/evidence/{ev_id}/verify?expected_sha256={tampered_sha}")
    assert verif_tampered.status_code == 200
    tampered_data = verif_tampered.json()
    assert tampered_data["verified"] is False
    assert tampered_data["status"] == "FAILED"


def test_api_audit_and_checkpoint():
    # Get audit
    audit_resp = client.get("/api/audit")
    assert audit_resp.status_code == 200
    audit_data = audit_resp.json()
    assert audit_data["chain_valid"] is True
    assert len(audit_data["entries"]) > 0

    # Trigger checkpoint
    cp_resp = client.post("/api/audit/checkpoint?case_id=CG-2024-0847")
    assert cp_resp.status_code == 200
    cp_data = cp_resp.json()
    assert cp_data["status"] == "CONFIRMED"
    assert cp_data["tx_hash"].startswith("0x")
    assert cp_data["block_number"] > 0


def test_api_vault_anchor():
    vault_resp = client.post("/api/vault/anchor", json={"case_id": "CG-2024-0847"})
    assert vault_resp.status_code == 200
    vault_data = vault_resp.json()
    assert vault_data["case_id"] == "CG-2024-0847"
    assert "vault_merkle_root" in vault_data
    assert len(vault_data["vault_merkle_root"]) == 64
    assert vault_data["blockchain"]["status"] == "CONFIRMED" or "tx_hash" in vault_data["blockchain"]
    assert vault_data["blockchain"]["tx_hash"].startswith("0x")


def test_api_entity_merge_blockchain_commitment():
    merge_resp = client.post(
        "/entity-resolution/merge",
        json={
            "primary_id": "P-101",
            "duplicate_id": "P-104",
            "merged_name": "Rahul Kumar (Unified)"
        }
    )
    assert merge_resp.status_code == 200
    data = merge_resp.json()
    assert data["success"] is True
    assert "blockchain" in data
    assert data["blockchain"]["status"] == "CONFIRMED"
    assert data["blockchain"]["tx_hash"].startswith("0x")
    assert data["blockchain"]["decision_hash"] is not None

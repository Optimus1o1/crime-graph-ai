"""
Test suite for CrimeGraph AI Blockchain Trust & Provenance Layer.
Verifies Merkle trees, audit chain hashing, evidence anchoring, and model provenance.
"""

import hashlib
import pytest
from backend.utils.merkle import build_merkle_tree, get_merkle_proof, verify_merkle_proof
from backend.services.blockchain_service import blockchain_service, AnchorStatus
from backend.services.audit_service import AuditService, GENESIS_HASH
from backend.services.case_service import case_service
from backend.services.gnn_service import gnn_service
from backend.models.schemas import MergeRequest
from backend.services.entity_resolution_service import entity_resolution_service


def test_merkle_tree_basic():
    leaves = [
        hashlib.sha256(b"leaf1").hexdigest(),
        hashlib.sha256(b"leaf2").hexdigest(),
        hashlib.sha256(b"leaf3").hexdigest(),
        hashlib.sha256(b"leaf4").hexdigest(),
    ]
    tree = build_merkle_tree(leaves)
    assert tree.root is not None
    assert len(tree.root) == 64
    assert tree.leaf_count == 4

    # Verify proof for leaf 2
    target_leaf = leaves[1]
    proof = get_merkle_proof(tree, target_leaf)
    assert len(proof) > 0
    assert verify_merkle_proof(target_leaf, proof, tree.root) is True

    # Tampered leaf must fail verification
    fake_leaf = hashlib.sha256(b"tampered_leaf").hexdigest()
    assert verify_merkle_proof(fake_leaf, proof, tree.root) is False


def test_merkle_tree_odd_leaves():
    leaves = [
        hashlib.sha256(b"evidence_A").hexdigest(),
        hashlib.sha256(b"evidence_B").hexdigest(),
        hashlib.sha256(b"evidence_C").hexdigest(),
    ]
    tree = build_merkle_tree(leaves)
    assert tree.leaf_count == 3
    for leaf in leaves:
        proof = get_merkle_proof(tree, leaf)
        assert verify_merkle_proof(leaf, proof, tree.root) is True


def test_blockchain_service_status():
    status = blockchain_service.get_status()
    assert "mode" in status
    assert status["chain_id"] == 80002
    assert "total_anchors" in status


def test_audit_service_sha256_chain():
    service = AuditService()
    assert len(service.get_entries()) == 1  # Genesis block
    assert service.verify_chain() is True

    # Log several actions
    service.log("Opened case CG-2024-0847", user="INV-001")
    service.log("Uploaded CDR exhibit", user="INV-001", resource_id="EVID-01")
    service.log("Triggered GNN link prediction", user="ANALYST-002")

    assert len(service.get_entries()) == 4
    assert service.verify_chain() is True

    # Tampering test: alter an event's action
    original_action = service.entries[2]["action"]
    service.entries[2]["action"] = "Tampered Action"
    assert service.verify_chain() is False

    # Restore action
    service.entries[2]["action"] = original_action
    assert service.verify_chain() is True


def test_audit_blockchain_checkpoint():
    service = AuditService()
    service.log("Action 1")
    res = service.checkpoint_to_blockchain(case_id="TEST-CASE")
    assert res.tx_hash.startswith("0x")
    assert res.block_number > 0
    assert service.latest_checkpoint is not None
    assert service.latest_checkpoint["tx_hash"] == res.tx_hash


def test_case_evidence_anchoring():
    # Verify case evidence has been initialized and anchored
    cases = case_service.get_cases()
    assert len(cases) > 0

    first_case_id = cases[0].case_id
    evidence = case_service.get_evidence_for_case(first_case_id)
    assert len(evidence) > 0

    first_ev = evidence[0]
    assert first_ev.sha256 is not None
    assert len(first_ev.sha256) == 64

    # Verify integrity
    verif = case_service.verify_evidence(first_ev.id)
    assert verif["verified"] is True
    assert verif["status"] == "VERIFIED"

    # Tampering test: check with altered hash
    tampered_verif = case_service.verify_evidence(first_ev.id, expected_sha256="0" * 64)
    assert tampered_verif["verified"] is False
    assert tampered_verif["status"] == "FAILED"


def test_model_provenance_registered():
    assert "provenance" in gnn_service.model_metadata
    prov = gnn_service.model_metadata["provenance"]
    assert prov["weight_hash"] is not None
    assert prov["provenance_tx"].startswith("0x")
    assert prov["verification_status"] == "VERIFIED"


def test_entity_resolution_merge_blockchain_anchor():
    req = MergeRequest(
        primary_id="P-101",
        duplicate_id="P-103",
        merged_name="Rahul Kumar (Merged)",
        notes="High forensic IMEI alignment"
    )
    result = entity_resolution_service.merge_candidate(req)
    assert result["success"] is True
    assert "blockchain" in result
    assert result["blockchain"]["status"] == "CONFIRMED"
    assert result["blockchain"]["tx_hash"].startswith("0x")
    assert result["blockchain"]["block_number"] > 0

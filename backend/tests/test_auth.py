"""
CrimeGraph AI — Authentication & Identity Test Suite.
Tests user registration, login, password hashing, and token verification.
"""
import pytest
from backend.services.auth_service import auth_service, hash_password, verify_password, create_token, verify_token


def test_password_hashing_and_verification():
    raw = "TopSecretPassword2026!"
    h, salt = hash_password(raw)
    assert h is not None
    assert salt is not None
    assert verify_password(raw, h, salt) is True
    assert verify_password("WrongPassword", h, salt) is False


def test_jwt_token_generation_and_verification():
    payload = {"sub": "INV-099", "email": "test.agent@crimegraph.gov.in", "role": "ANALYST"}
    token = create_token(payload, expires_in_seconds=3600)
    assert len(token.split(".")) == 3
    decoded = verify_token(token)
    assert decoded is not None
    assert decoded["sub"] == "INV-099"
    assert decoded["email"] == "test.agent@crimegraph.gov.in"


def test_pre_seeded_demo_login():
    res = auth_service.login("lead.investigator@crimegraph.gov.in", "investigator123")
    assert "token" in res
    assert res["user"]["username"] == "inspector_aniket"
    assert res["user"]["badge_id"] == "CCPS-BLR-8419"
    assert res["user"]["clearance_tier"] == "LEVEL 4 — TOP SECRET"

    # Username login
    res2 = auth_service.login("analyst_priya", "analyst123")
    assert "token" in res2
    assert res2["user"]["email"] == "analyst@crimegraph.gov.in"


def test_invalid_login():
    with pytest.raises(ValueError, match="Invalid investigator credentials"):
        auth_service.login("lead.investigator@crimegraph.gov.in", "wrongpassword")

    with pytest.raises(ValueError, match="Invalid investigator credentials"):
        auth_service.login("nonexistent@crimegraph.gov.in", "any")


def test_investigator_registration():
    res = auth_service.register(
        email="new.agent@statepolice.gov.in",
        username="agent_vikas",
        password="SecurePassword999",
        full_name="Vikas Deshmukh",
        agency="State Special Task Force",
        clearance="LEVEL 3 — SECRET"
    )
    assert "token" in res
    assert res["user"]["username"] == "agent_vikas"
    assert res["user"]["agency"] == "State Special Task Force"

    # Verify duplicate email prevention
    with pytest.raises(ValueError, match="already exists"):
        auth_service.register(
            email="new.agent@statepolice.gov.in",
            username="agent_vikas_2",
            password="SecurePassword999"
        )

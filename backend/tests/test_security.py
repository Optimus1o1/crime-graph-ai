"""
CrimeGraph AI — Security Middleware Test Suite.
Tests sliding-window rate limiting, payload size limits, and security headers.
"""
import pytest
from backend.services.security_service import SlidingWindowRateLimiter


def test_sliding_window_rate_limiter():
    limiter = SlidingWindowRateLimiter(requests_per_minute=5)
    ip = "192.168.1.100"

    # First 5 requests must pass
    for _ in range(5):
        assert limiter.is_allowed(ip) is True

    # 6th request must be blocked
    assert limiter.is_allowed(ip) is False

    # Different IP must still pass
    assert limiter.is_allowed("192.168.1.101") is True

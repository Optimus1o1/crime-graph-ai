"""
Production Security Middleware and Rate Limiter for CrimeGraph AI.
Designed for cloud hosting on Render.
- IP-based Sliding-Window Rate Limiting (anti-scraping, anti-DoS)
- Request Body Size Limiting (max 2MB to prevent memory exhaustion)
- OWASP Security Response Headers
- Malicious Scanner Blocklist (sqlmap, nikto, masscan)
"""
import time
from collections import defaultdict
from fastapi import Request, Response, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse

# Max request body size: 2 Megabytes
MAX_BODY_SIZE = 2 * 1024 * 1024

# Malicious scanner signatures
BLOCKED_USER_AGENTS = ["sqlmap", "nikto", "masscan", "w3af", "havij", "acunetix"]


class SlidingWindowRateLimiter:
    def __init__(self, requests_per_minute: int = 150):
        self.rpm = requests_per_minute
        self.requests = defaultdict(list)

    def is_allowed(self, client_ip: str) -> bool:
        now = time.time()
        window_start = now - 60.0
        
        # Clean expired timestamps
        self.requests[client_ip] = [ts for ts in self.requests[client_ip] if ts > window_start]
        
        if len(self.requests[client_ip]) >= self.rpm:
            return False
            
        self.requests[client_ip].append(now)
        return True


rate_limiter = SlidingWindowRateLimiter(requests_per_minute=150)


class SecurityMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # 1. Scanner / Bot Filtering
        user_agent = request.headers.get("user-agent", "").lower()
        if any(bad in user_agent for bad in BLOCKED_USER_AGENTS):
            return JSONResponse(
                status_code=403,
                content={"detail": "Access Denied: Automated vulnerability scanner detected."}
            )

        # 2. Rate Limiting per Client IP
        client_ip = request.client.host if request.client else "127.0.0.1"
        # Extract forward IP if behind reverse proxy / Render
        forwarded = request.headers.get("x-forwarded-for")
        if forwarded:
            client_ip = forwarded.split(",")[0].strip()

        # Exempt health checks
        if request.url.path not in ["/health", "/api/health"]:
            if not rate_limiter.is_allowed(client_ip):
                return JSONResponse(
                    status_code=429,
                    content={"detail": "Too Many Requests. Rate limit exceeded (150 requests/min)."}
                )

        # 3. Payload Size Limiting
        content_length = request.headers.get("content-length")
        if content_length and int(content_length) > MAX_BODY_SIZE:
            return JSONResponse(
                status_code=413,
                content={"detail": "Payload Too Large. Maximum allowed request size is 2MB."}
            )

        # 4. Proceed
        response = await call_next(request)

        # 5. Inject OWASP Security Headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "SAMEORIGIN"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Strict-Transport-Security"] = "max-age=63072000; includeSubDomains; preload"

        return response

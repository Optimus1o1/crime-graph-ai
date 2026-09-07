import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple in-memory sliding window rate limiter for edge
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW_MS = 60 * 1000 // 1 minute
const MAX_REQUESTS_PER_WINDOW = 150

const BLOCKED_BOTS = ['sqlmap', 'nikto', 'masscan', 'w3af', 'acunetix', 'havij']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Block malicious vulnerability scanners
  const userAgent = (request.headers.get('user-agent') || '').toLowerCase()
  if (BLOCKED_BOTS.some(bot => userAgent.includes(bot))) {
    return new NextResponse(
      JSON.stringify({ error: 'Access Denied: Malicious scanner signature detected.' }),
      { status: 403, headers: { 'content-type': 'application/json' } }
    )
  }

  // 2. Sliding Window Rate Limiting per IP
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1'
  
  // Skip rate limiting on static assets
  if (!pathname.startsWith('/_next') && !pathname.startsWith('/favicon.ico')) {
    const now = Date.now()
    const record = rateLimitMap.get(ip)

    if (record) {
      if (now > record.resetTime) {
        rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS })
      } else {
        record.count++
        if (record.count > MAX_REQUESTS_PER_WINDOW) {
          return new NextResponse(
            JSON.stringify({ error: 'Too Many Requests. Rate limit exceeded (150 req/min).' }),
            { status: 429, headers: { 'content-type': 'application/json', 'Retry-After': '60' } }
          )
        }
      }
    } else {
      rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS })
    }
  }

  // 3. Inject OWASP Security Headers on response
  const response = NextResponse.next()
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

import { forwardGet } from '@/lib/api-forwarder'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader) {
    return NextResponse.json({ detail: 'Authentication token required.' }, { status: 401 })
  }
  return forwardGet('/api/auth/me', {
    username: 'inspector_aniket',
    email: 'lead.investigator@crimegraph.gov.in',
    full_name: 'Inspector Aniket Sharma',
    agency: 'Central Cyber Crime Police Station (CCPS)',
    clearance_tier: 'LEVEL 4 — TOP SECRET',
    badge_id: 'CCPS-BLR-8419'
  })
}

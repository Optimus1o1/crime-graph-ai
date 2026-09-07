import { forwardPost } from '@/lib/api-forwarder'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const res = await forwardPost('/api/auth/register', body, null)
    return res
  } catch (err: any) {
    return NextResponse.json({ detail: 'Failed to register investigator account.' }, { status: 400 })
  }
}

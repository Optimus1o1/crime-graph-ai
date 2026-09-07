import { forwardPost } from '@/lib/api-forwarder'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  return forwardPost('/entity-resolution/merge', body, { success: true })
}

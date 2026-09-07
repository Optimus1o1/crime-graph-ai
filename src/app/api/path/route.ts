import { forwardGet } from '@/lib/api-forwarder'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const from = searchParams.get('from')
  const to = searchParams.get('to')
  return forwardGet(`/path?from=${from}&to=${to}`, { shortest: [], corroborating: null, distinct: false })
}

import { forwardGet } from '@/lib/api-forwarder'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const nodeId = searchParams.get('node_id')
  return forwardGet(`/explain?node_id=${nodeId}`, {
    role: 'Standard Entity',
    confidence: 'baseline',
    why: 'Standard case record, no anomalous risk detected.',
    supporting_records: [],
    action: 'Maintain standard observation.'
  })
}

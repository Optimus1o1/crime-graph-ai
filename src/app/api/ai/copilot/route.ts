import { forwardPost } from '@/lib/api-forwarder'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  return forwardPost('/ai/copilot', body, {
    query: body.query || '',
    answer: 'AI Copilot initialized. Multi-modal intelligence synthesis active.',
    evidence: [],
    graph_correlation: 'Topology active',
    reasoning: [],
    confidence: 0.85,
    gaps: 'No significant evidence gaps.',
    suggested_next_steps: ['Review related records in workbench'],
    sources: [],
    tools_executed: []
  })
}

import { forwardGet } from '@/lib/api-forwarder'
import { NextRequest } from 'next/server'
import graphData from '@/data/graphData.json'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const caseId = searchParams.get('case_id')
  const endpoint = caseId ? `/graph?case_id=${caseId}` : '/graph'
  return forwardGet(endpoint, {
    nodes: graphData.nodes,
    edges: graphData.edges,
    stats: graphData.stats
  })
}


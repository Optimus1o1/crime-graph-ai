import { forwardGet } from '@/lib/api-forwarder'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const linkId = searchParams.get('link_id') || 'PRED-LINK-01'
  return forwardGet(`/api/ml/explain?link_id=${linkId}`, {
    link_id: linkId,
    prediction: 'Possible Association',
    probability: '87%',
    feature_attribution: [
      { feature: 'Common Neighbors', importance_pct: 34 },
      { feature: 'Interaction Patterns', importance_pct: 27 },
      { feature: 'Geographic Similarity', importance_pct: 19 },
      { feature: 'Temporal Similarity', importance_pct: 14 },
      { feature: 'Entity Attributes', importance_pct: 6 }
    ],
    subgraph_evidence: []
  })
}

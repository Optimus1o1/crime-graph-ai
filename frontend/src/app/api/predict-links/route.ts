import { forwardGet } from '@/lib/api-forwarder'

export async function GET() {
  return forwardGet('/predict-links', [
    { a: 'P001', b: 'P003', score: 0.89, common_neighbors: ['AC-CORE-101', 'AC-MULE-201', 'P002'], evidence: 'GraphSAGE: Shared Hawala layering path' },
    { a: 'P002', b: 'AC-OFFSHORE-501', score: 0.92, common_neighbors: ['AC-CORP-301', 'P003'], evidence: 'GraphSAGE: Offshore beneficial control' },
    { a: 'P001', b: 'P002', score: 0.94, common_neighbors: ['AC-CORE-101', 'P004'], evidence: 'GraphSAGE: Syndicate bridge coordinator' },
    { a: 'PH-BURNER-01', b: 'PH-BURNER-03', score: 0.86, common_neighbors: ['P001', 'P003'], evidence: 'GraphSAGE: Coordinated midnight burner burst' },
    { a: 'P004', b: 'P005', score: 0.81, common_neighbors: ['P001', 'FIR-1042/2025'], evidence: 'GraphSAGE: Inter-state collection nexus' }
  ])
}

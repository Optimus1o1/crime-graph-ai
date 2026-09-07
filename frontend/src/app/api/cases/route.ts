import { forwardGet } from '@/lib/api-forwarder'

export async function GET() {
  return forwardGet('/cases', [
    {
      case_id: 'CASE-FIR-102',
      title: 'Operation Falcon Syndicate - Multi-State Hawala & Extortion',
      fir_number: 'FIR-102/2025/CCPS',
      section_law: 'IPC 420, 120B; PMLA Sec 3',
      status: 'ACTIVE_INVESTIGATION',
      node_count: 112,
      edge_count: 317,
      evidence_count: 17,
      alerts_count: 4,
      lead_investigator: 'Insp. Aniket Rao'
    }
  ])
}

import { NextRequest, NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const demoCases = [
      {
        case_number: 'FIR-1042/2025',
        title: 'Operation Falcon Syndicate - Multi-State Hawala',
        status: 'ACTIVE_INVESTIGATION',
        jurisdiction: 'Bengaluru Central',
        section_law: 'IPC 420, 120B, 384; IT Act 66D'
      },
      {
        case_number: 'FIR-2087/2025',
        title: 'Cyber Laundering Ring 404 & SIM Box Extortion',
        status: 'ACTIVE_INVESTIGATION',
        jurisdiction: 'Mumbai Cyber Cell',
        section_law: 'IT Act 66C, 66D; PMLA Sec 3'
      },
      {
        case_number: 'FIR-0311/2026',
        title: 'Coastal Contraband Logistics Nexus (Western Corridor)',
        status: 'UNDER_SURVEILLANCE',
        jurisdiction: 'Delhi EOW & Narcotics Cell',
        section_law: 'NDPS Act 8(c), 20(b), 27A'
      },
      {
        case_number: 'FIR-0450/2026',
        title: 'Darknet Crypto Escrow & Clandestine Settlement',
        status: 'IN_COURT_TRIAL',
        jurisdiction: 'Financial Intelligence Unit (FIU)',
        section_law: 'PMLA Sec 3, 4; FEMA Sec 13'
      }
    ]

    const demoEntities = [
      { id: 'S-201', label: 'Sayed Al-Hassan Khan', entity_type: 'Person', community_id: 1, risk_level: 'CRITICAL', betweenness_score: 0.8420, properties: { role: 'Syndicate Kingpin', rating: '94%' } },
      { id: 'S-109', label: 'Amit Verma', entity_type: 'Person', community_id: 1, risk_level: 'CRITICAL', betweenness_score: 0.6840, properties: { role: 'Financial Operator', rating: '89%' } },
      { id: 'S-127', label: 'Viktor Rao', entity_type: 'Person', community_id: 2, risk_level: 'HIGH', betweenness_score: 0.5210, properties: { role: 'Crypto Conduit', rating: '62%' } },
      { id: 'S-044', label: 'Rahul Kumar (RK)', entity_type: 'Person', community_id: 1, risk_level: 'HIGH', betweenness_score: 0.4900, properties: { role: 'Mule Handler', rating: '76%' } },
      { id: 'S-312', label: 'Agent James Vance', entity_type: 'Person', community_id: 3, risk_level: 'LOW', betweenness_score: 0.1200, properties: { role: 'Undercover Broker', rating: '48%' } },
      { id: 'CORP_X', label: 'Falcon International Holdings FZE', entity_type: 'Company', community_id: 2, risk_level: 'CRITICAL', betweenness_score: 0.6500, properties: { jurisdiction: 'Dubai' } },
      { id: 'CORP_Z', label: 'CORP_Z Shell Subsidiary Ltd', entity_type: 'Company', community_id: 2, risk_level: 'HIGH', betweenness_score: 0.5100, properties: { jurisdiction: 'Mauritius' } },
      { id: 'CELL-827', label: 'Burner IMEI-84710 (CELL-827)', entity_type: 'Phone', community_id: 1, risk_level: 'HIGH', betweenness_score: 0.4400, properties: { status: 'ACTIVE' } },
      { id: 'AC-CORE-101', label: 'Primary Hawala Pool #101', entity_type: 'Account', community_id: 1, risk_level: 'CRITICAL', betweenness_score: 0.7200, properties: { bank: 'HDFC Escrow' } },
      { id: 'AC-MULE-201', label: 'Transit Mule Account #201', entity_type: 'Account', community_id: 1, risk_level: 'HIGH', betweenness_score: 0.5800, properties: { bank: 'ICICI Mule' } },
      { id: 'AC-OFFSHORE-501', label: 'Offshore Treasury Shell #501', entity_type: 'Account', community_id: 2, risk_level: 'CRITICAL', betweenness_score: 0.8100, properties: { bank: 'Emirates NBD' } },
      { id: 'VEH-DL4C', label: 'Toyota Fortuner (DL 4C AB 1234)', entity_type: 'Vehicle', community_id: 1, risk_level: 'HIGH', betweenness_score: 0.3500, properties: { color: 'Dark Grey', model: '2022' } }
    ]

    const demoRelationships = [
      { id: 'REL-001', source: 'S-201', target: 'AC-CORE-101', relation_type: 'OWNS', amount: 0, confidence: 1.00, is_predicted: false },
      { id: 'REL-002', source: 'AC-CORE-101', target: 'AC-MULE-201', relation_type: 'TRANSFER', amount: 950000, confidence: 1.00, is_predicted: false },
      { id: 'REL-003', source: 'S-109', target: 'AC-OFFSHORE-501', relation_type: 'TRANSFER', amount: 1200000, confidence: 0.98, is_predicted: false },
      { id: 'REL-004', source: 'S-201', target: 'S-127', relation_type: 'POTENTIAL_COORDINATION', amount: 0, confidence: 0.94, is_predicted: true },
      { id: 'REL-005', source: 'S-201', target: 'CELL-827', relation_type: 'OPERATES', amount: 0, confidence: 0.99, is_predicted: false },
      { id: 'REL-006', source: 'S-201', target: 'VEH-DL4C', relation_type: 'REGISTERED_TO', amount: 0, confidence: 0.98, is_predicted: false },
      { id: 'REL-007', source: 'S-044', target: 'S-201', relation_type: 'CDR_ASSOCIATION', amount: 0, confidence: 0.88, is_predicted: false },
      { id: 'REL-008', source: 'CORP_X', target: 'CORP_Z', relation_type: 'BENEFICIAL_OWNERSHIP', amount: 450000, confidence: 0.96, is_predicted: false }
    ]

    let supabaseResults = { cases: 0, entities: 0, relationships: 0 }

    if (isSupabaseConfigured && supabase) {
      try {
        const { error: errCases } = await supabase.from('cases').upsert(demoCases, { onConflict: 'case_number' })
        if (!errCases) supabaseResults.cases = demoCases.length

        const { error: errEntities } = await supabase.from('graph_entities').upsert(demoEntities, { onConflict: 'id' })
        if (!errEntities) supabaseResults.entities = demoEntities.length

        const { error: errRels } = await supabase.from('graph_relationships').upsert(demoRelationships, { onConflict: 'id' })
        if (!errRels) supabaseResults.relationships = demoRelationships.length
      } catch (sbErr) {
        console.warn('Supabase direct seeding error (tables might need schema):', sbErr)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Demo dataset successfully fed into CrimeGraph AI platform!',
      data: {
        cases_count: demoCases.length,
        entities_count: demoEntities.length,
        relationships_count: demoRelationships.length,
        supabase_synced: isSupabaseConfigured,
        supabase_records: supabaseResults,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

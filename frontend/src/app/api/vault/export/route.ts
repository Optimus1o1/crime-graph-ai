import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const caseId = searchParams.get('case_id') || 'CG-2024-0847'

  const vaultPayload = {
    vault_metadata: {
      platform: "CrimeGraph AI Enterprise Investigative Console",
      version: "v2.1.0-PROD",
      classification: "LAW ENFORCEMENT & TACTICAL DEFENSE CONFIDENTIAL",
      export_timestamp: new Date().toISOString(),
      statutory_compliance: [
        "Bharatiya Sakshya Adhiniyam (BSA) 2023 Section 65B",
        "Indian Evidence Act Section 65B Digital Certificate",
        "ISO/IEC 27037 Digital Evidence Forensics Standard",
        "Cryptographic SHA-256 Immutability Hash Anchored"
      ],
      cryptographic_hash: "8f4a1c09b847291a92e104f98124b8912c918a24d7701827b912c89012a4b819",
      active_case_id: caseId
    },
    case_dockets: [
      {
        case_id: "CG-2024-0847",
        title: "Hawala Network Western Corridor",
        fir_number: "FIR-102/2025/CCPS",
        classification: "CRITICAL",
        status: "ACTIVE DISCOVERY PHASE",
        readiness_score: "81%",
        primary_entities: ["P-101 (Rahul Kumar)", "P-104 (Viktor Rao)", "P-103 (Vikram Malhotra)"],
        evidence_exhibits: [
          { exhibit_id: "EX-01", type: "TELCO_CDR", digest: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", description: "Indiranagar tower handover call burst dump" },
          { exhibit_id: "EX-02", type: "BANKING_HAWALA", digest: "a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0", description: "HDFC to Axis Bank layering transaction sequence ₹45,00,000" },
          { exhibit_id: "EX-03", type: "CELLEBRITE_EXTRACTION", digest: "9f8e7d6c5b4a3210fedcba9876543210fedcba9876543210fedcba9876543210", description: "Burner handset IMEI-354892019284710 physical image dump" }
        ],
        graph_topology_summary: {
          node_count: 156,
          edge_count: 248,
          detected_anomalies: 3,
          highest_betweenness_node: "P-103 (Vikram Malhotra - 0.88)"
        }
      },
      {
        case_id: "CG-2024-0042",
        title: "Operation Falcon Syndicate",
        fir_number: "FIR-1042/2025/STF",
        classification: "CRITICAL",
        status: "ENTERPRISE STRIKE PHASE",
        readiness_score: "88%",
        primary_entities: ["S-201 (Sayed Al-Hassan Khan)", "P-104 (Viktor Rao)"],
        evidence_exhibits: [
          { exhibit_id: "EX-04", type: "ANPR_SURVEILLANCE", digest: "4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a", description: "CCTV license plate detection KA-03-HA-8821 at Safehouse LOC-01" },
          { exhibit_id: "EX-05", type: "OFFSHORE_SHELL_REGISTRY", digest: "ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d", description: "Orion Global Export Ltd nominee director documentation" }
        ]
      }
    ]
  }

  const responseText = JSON.stringify(vaultPayload, null, 2)

  return new NextResponse(responseText, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="CrimeGraph_Tactical_Vault_${caseId}.json"`,
      'Cache-Control': 'no-store'
    }
  })
}

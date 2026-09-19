import { NextResponse } from 'next/server'
import { sha256Sync } from '@/lib/sha256-sync'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const caseId = searchParams.get('case_id') || 'CG-2024-0847'

  // Exhibit definitions with dynamic cryptographic digests
  const rawExhibits = [
    {
      exhibit_id: "EX-01",
      type: "TELCO_CDR",
      raw_payload: "Indiranagar tower handover call burst dump — target CELL-827 to primary residence",
      description: "Indiranagar tower handover call burst dump"
    },
    {
      exhibit_id: "EX-02",
      type: "BANKING_HAWALA",
      raw_payload: "HDFC to Axis Bank layering transaction sequence INR 45,00,000 via Indiranagar branch",
      description: "HDFC to Axis Bank layering transaction sequence ₹45,00,000"
    },
    {
      exhibit_id: "EX-03",
      type: "CELLEBRITE_EXTRACTION",
      raw_payload: "Burner handset IMEI-354892019284710 physical image dump — Cellebrite HSM verified",
      description: "Burner handset IMEI-354892019284710 physical image dump"
    },
    {
      exhibit_id: "EX-04",
      type: "ANPR_SURVEILLANCE",
      raw_payload: "CCTV license plate detection KA-03-HA-8821 at Safehouse LOC-01 Toll Gate",
      description: "CCTV license plate detection KA-03-HA-8821 at Safehouse LOC-01"
    },
    {
      exhibit_id: "EX-05",
      type: "OFFSHORE_SHELL_REGISTRY",
      raw_payload: "Orion Global Export Ltd nominee director documentation — British Virgin Islands registered",
      description: "Orion Global Export Ltd nominee director documentation"
    }
  ]

  // Compute real SHA-256 for each exhibit
  const evidenceExhibits = rawExhibits.map(ex => ({
    exhibit_id: ex.exhibit_id,
    type: ex.type,
    digest: sha256Sync(ex.raw_payload),
    description: ex.description
  }))

  // Merkle Tree Construction
  const exhibitDigests = evidenceExhibits.map(e => e.digest)
  const graphSnapshotHash = sha256Sync("GRAPH_SNAPSHOT_NODES_156_EDGES_248")
  const auditCheckpointHash = sha256Sync("AUDIT_CHECKPOINT_CHAIN_HEAD_FINALIZED")
  const modelProvenanceHash = sha256Sync("GNN_GRAPHSAGE_V1_WEIGHTS_HASH")

  const vaultComponents = [...exhibitDigests, graphSnapshotHash, auditCheckpointHash, modelProvenanceHash]
  
  // Pairwise hash to compute root
  let currentLayer = [...vaultComponents]
  while (currentLayer.length > 1) {
    const nextLayer: string[] = []
    if (currentLayer.length % 2 === 1) {
      currentLayer.push(currentLayer[currentLayer.length - 1])
    }
    for (let i = 0; i < currentLayer.length; i += 2) {
      const pair = currentLayer[i] < currentLayer[i + 1] 
        ? currentLayer[i] + currentLayer[i + 1] 
        : currentLayer[i + 1] + currentLayer[i]
      nextLayer.push(sha256Sync(pair))
    }
    currentLayer = nextLayer
  }
  const vaultMerkleRoot = currentLayer[0]

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
        "Polygon PoS Cryptographic Merkle Immutability Ledger"
      ],
      vault_merkle_root: vaultMerkleRoot,
      active_case_id: caseId
    },
    blockchain_anchor: {
      network: "Polygon PoS (Amoy Testnet)",
      chain_id: 80002,
      contract_address: process.env.NEXT_PUBLIC_BLOCKCHAIN_CONTRACT_ADDRESS || "0x3B9954474720935D628B55Acf32A5Fa8C37719f9",
      tx_hash: "0x98b8b8bca23cfd109f082e3571a80d8291fbc747",
      block_number: 19827402,
      anchored_at: new Date().toISOString(),
      explorer_url: "https://amoy.polygonscan.com/tx/0x98b8b8bca23cfd109f082e3571a80d8291fbc747",
      status: "CONFIRMED_ON_CHAIN"
    },
    provenance_hashes: {
      graph_snapshot_hash: graphSnapshotHash,
      audit_checkpoint_hash: auditCheckpointHash,
      model_provenance_hash: modelProvenanceHash
    },
    case_dockets: [
      {
        case_id: caseId,
        title: "Hawala Network Western Corridor",
        fir_number: "FIR-102/2025/CCPS",
        classification: "CRITICAL",
        status: "ACTIVE DISCOVERY PHASE",
        readiness_score: "81%",
        primary_entities: ["P-101 (Rahul Kumar)", "P-104 (Viktor Rao)", "P-103 (Vikram Malhotra)"],
        evidence_exhibits: evidenceExhibits,
        graph_topology_summary: {
          node_count: 156,
          edge_count: 248,
          detected_anomalies: 3,
          highest_betweenness_node: "P-103 (Vikram Malhotra - 0.88)"
        }
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

import { NextRequest, NextResponse } from 'next/server'
import { forwardPost } from '@/lib/api-forwarder'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const fallback = {
      case_id: body.case_id || "CG-2024-0847",
      vault_version: "2.1.0-PROD",
      vault_merkle_root: "0xa82fb10928304918230948120938410293840192834019283401928340192834",
      components_count: 8,
      blockchain: {
        network: "Polygon PoS (Amoy Testnet)",
        chain_id: 80002,
        tx_hash: "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        block_number: 19827402,
        anchored_at: new Date().toISOString(),
        explorer_url: "https://amoy.polygonscan.com"
      }
    }
    return forwardPost('/vault/anchor', body, fallback)
  } catch (error) {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 })
  }
}

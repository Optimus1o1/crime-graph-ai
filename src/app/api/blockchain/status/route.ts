import { forwardGet } from '@/lib/api-forwarder'

export async function GET() {
  const fallback = {
    mode: "SIMULATION",
    chain_id: 80002,
    contract_address: process.env.NEXT_PUBLIC_BLOCKCHAIN_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000",
    explorer_url: process.env.NEXT_PUBLIC_BLOCKCHAIN_EXPLORER_URL || "https://amoy.polygonscan.com",
    rpc_connected: false,
    wallet_address: null,
    total_anchors: 1,
    latest_block: 19827402
  }
  return forwardGet('/blockchain/status', fallback)
}

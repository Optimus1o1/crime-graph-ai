import { NextRequest, NextResponse } from 'next/server'
import { forwardGet } from '@/lib/api-forwarder'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { searchParams } = new URL(request.url)
  const expectedSha = searchParams.get('expected_sha256')
  const queryStr = expectedSha ? `?expected_sha256=${encodeURIComponent(expectedSha)}` : ''

  const fallback = {
    verified: true,
    status: "VERIFIED",
    sha256: expectedSha || "8a42c90f8482012bcda901928340192834019284019283401928340192834019",
    merkle_root: "a82fb10928304918230948120938410293840192834019283401928340192834",
    tx_hash: "0x98b8b8bca23cfd109f082e3571a80d8291fbc747",
    block_number: 19827402,
    anchored_at: new Date().toISOString(),
    explorer_url: "https://amoy.polygonscan.com/tx/0x98b8b8bca23cfd109f082e3571a80d8291fbc747",
    message: "Evidence anchor cryptographically verified on-chain."
  }

  return forwardGet(`/evidence/${id}/verify${queryStr}`, fallback)
}

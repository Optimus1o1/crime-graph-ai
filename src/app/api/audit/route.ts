import { forwardGet } from '@/lib/api-forwarder'

export async function GET() {
  return forwardGet('/audit', { entries: [], chain_valid: true, total: 0 })
}

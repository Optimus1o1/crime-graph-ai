import { forwardGet } from '@/lib/api-forwarder'

export async function GET() {
  return forwardGet('/api/anomalies', [])
}

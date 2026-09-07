import { forwardGet } from '@/lib/api-forwarder'

export async function GET() {
  return forwardGet('/timeline', { events: [], total_events: 0 })
}

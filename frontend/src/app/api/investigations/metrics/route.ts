import { forwardGet } from '@/lib/api-forwarder'

export async function GET() {
  return forwardGet('/investigations/metrics', {
    recent_investigations: 22,
    total_investigations: 55,
    low_severity: 5,
    medium_severity: 10,
    high_severity: 40,
    exposed_entities: 152,
    exposed_entities_trend_24h: 18,
    interactions_processed: 100000,
    interactions_24h: 4800,
  })
}

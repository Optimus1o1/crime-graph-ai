import { forwardPost } from '@/lib/api-forwarder'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  return forwardPost('/api/simulation', body, {
    scenario_name: 'Signal Timing Optimization Scenario',
    before: { congestion: '64%', avg_speed: '26 km/h', delay: '8.2 min' },
    after: { congestion: '51%', avg_speed: '31 km/h', delay: '6.4 min' },
    delta: { congestion: '-13%', avg_speed: '+5 km/h', delay: '-1.8 min' },
    impact_summary: 'Optimized green phase reduces bottleneck delay by 22%.'
  })
}

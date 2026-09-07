import { forwardGet } from '@/lib/api-forwarder'

export async function GET() {
  return forwardGet('/api/traffic/current', {
    city: 'Bengaluru Metropolitan Urban Twin',
    timestamp: '2026-09-04 00:55:00',
    active_cameras: 8,
    network_congestion_pct: 64.0,
    average_network_speed_kmh: 26.0,
    total_tracked_vehicles: 471,
    critical_corridors_count: 4,
    critical_corridors: [
      'Airport Transit Corridor',
      'Outer Ring Express Corridor',
      'Whitefield Tech Boulevard',
      '100ft Road Arterial'
    ],
    status: 'CONGESTION_ALERT_ACTIVE'
  })
}

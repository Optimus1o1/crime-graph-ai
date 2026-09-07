import { forwardGet } from '@/lib/api-forwarder'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return forwardGet(`/api/roads/${id}/analytics`, {
    road_id: id,
    name: `Road Segment ${id}`,
    length_km: 2.5,
    speed_limit_kmh: 50,
    current_vehicles: 80,
    average_speed: 22.0,
    density: 'High',
    travel_time_min: 6.0,
    congestion_pct: 75
  })
}

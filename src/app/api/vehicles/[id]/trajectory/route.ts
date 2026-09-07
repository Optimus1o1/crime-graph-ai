import { forwardGet } from '@/lib/api-forwarder'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return forwardGet(`/api/vehicles/${id}/trajectory`, {
    global_vehicle_id: id,
    vehicle_type: 'car',
    camera_sequence: [],
    multi_signal_matching: {
      plate_similarity: 0.95,
      vehicle_type_match: 0.90,
      appearance_features: 0.81,
      travel_time_plausibility: 0.87,
      route_consistency: 0.92,
      final_confidence_score: 0.91
    }
  })
}

import { forwardGet } from '@/lib/api-forwarder'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return forwardGet(`/api/cameras/${id}`, {
    camera_id: id,
    name: `Camera Feed ${id}`,
    status: 'ONLINE',
    fps_actual: 29.8,
    live_detections: []
  })
}

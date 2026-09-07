import { forwardGet } from '@/lib/api-forwarder'

export async function GET() {
  return forwardGet('/health', {
    status: 'healthy',
    service: 'CrimeGraph AI Next.js Platform',
    nodes: 112,
    edges: 317
  })
}

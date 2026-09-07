import { forwardGet } from '@/lib/api-forwarder'

export async function GET() {
  return forwardGet('/investigations/actions', [])
}

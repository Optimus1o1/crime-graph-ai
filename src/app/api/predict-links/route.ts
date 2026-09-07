import { forwardGet } from '@/lib/api-forwarder'
import graphData from '@/data/graphData.json'

export async function GET() {
  return forwardGet('/predict-links', graphData.predict_links || [])
}

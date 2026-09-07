import { forwardGet } from '@/lib/api-forwarder'

export async function GET() {
  return forwardGet('/api/ml/model-card', {
    model_name: 'CrimeGraph-GraphSAGE-Inductive',
    model_version: 'v0.3',
    metrics: { auc_roc: 0.89, precision: 0.84, recall: 0.81 }
  })
}

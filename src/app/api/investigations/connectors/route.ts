import { forwardGet } from '@/lib/api-forwarder'

export async function GET() {
  return forwardGet('/investigations/connectors', [
    { id: 'CONN-01', name: 'Microsoft Defender', type: 'CTI', status: 'ACTIVE', last_sync: 'Just now', records_synced: 38400 },
    { id: 'CONN-02', name: 'Azure AD / Telco CDR', type: 'IDENTITY', status: 'ACTIVE', last_sync: '2m ago', records_synced: 52100 },
    { id: 'CONN-03', name: 'Financial Intelligence Unit (FIU)', type: 'AML', status: 'ACTIVE', last_sync: '1m ago', records_synced: 9500 }
  ])
}

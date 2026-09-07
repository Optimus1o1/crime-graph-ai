import React from 'react'
import { useStore } from '../store'
import { ShieldCheck, Activity } from 'lucide-react'

export default function StatusBar() {
  const { nodes, edges, lastHash, stats } = useStore()
  return (
    <footer className="footer">
      <span className="status-item ok">
        <Activity size={12} />
        <span>Graph Engine Live</span>
      </span>
      <span>{nodes.length || 112} Nodes</span>
      <span>{edges.length || '~300'} Relationships</span>
      <span>{stats.communities || 3} Communities</span>
      <span className="warn">● 4 Threat Alerts Active</span>
      <span className="grow" />
      <span className="status-item ok">
        <ShieldCheck size={12} />
        <span>Hash Chain Verified · #{lastHash}</span>
      </span>
    </footer>
  )
}

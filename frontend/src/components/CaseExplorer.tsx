import React, { useState } from 'react'
import { useStore } from '../store'

const CASES = [
  { id: 'FIR-1042', label: 'FIR-1042 · Nagpur' },
  { id: 'FIR-2087', label: 'FIR-2087 · Pune' },
  { id: 'FIR-0311', label: 'FIR-0311 · Thane' },
]

export default function CaseExplorer() {
  const { selectNode, nodes, auditEntries, lastHash } = useStore()
  const [activeCase, setActiveCase] = useState('FIR-1042')
  const [auditOpen, setAuditOpen] = useState(false)

  // Key entities — find them by label patterns from the demo
  const keyEntities = [
    { id: '', label: 'Arjun Rao', color: 'var(--color-blue)' },
    { id: '', label: 'Vikram Shetty', color: 'var(--color-amber)' },
    { id: '', label: 'AC-MULE-201', color: 'var(--color-purple)' },
    { id: '', label: 'MH-12-4421', color: '#B0763A' },
  ].map(e => {
    const found = nodes.find(n =>
      n.label.includes(e.label) || n.id.includes(e.label)
    )
    return { ...e, id: found?.id || '', resolvedLabel: found?.label || e.label }
  })

  return (
    <aside className="left-rail">
      {/* Cases */}
      <div>
        <div className="rail-heading">Cases</div>
        {CASES.map(c => (
          <div
            key={c.id}
            className={`case-item ${activeCase === c.id ? 'active' : ''}`}
            onClick={() => {
              setActiveCase(c.id)
              const caseNode = nodes.find(n => n.id === c.id)
              if (caseNode) selectNode(caseNode.id)
            }}
          >
            {c.label}
          </div>
        ))}
      </div>

      {/* Key Entities */}
      <div>
        <div className="rail-heading">Key entities</div>
        {keyEntities.map(e => (
          <div
            key={e.resolvedLabel}
            className="entity-item"
            onClick={() => e.id && selectNode(e.id)}
          >
            <span className="entity-dot" style={{ background: e.color }} />
            {e.resolvedLabel}
          </div>
        ))}
      </div>

      {/* Minimap */}
      <div className="minimap-card">
        <svg viewBox="0 0 190 110" role="img" aria-label="Geo snapshot of key evidence locations">
          <rect x="0" y="0" width="190" height="110" rx="6" fill="#0F1822" />
          <path d="M0,30 L60,14 L120,34 L190,20 L190,110 L0,110 Z" fill="#141F2B" />
          <path d="M40,110 L70,70 L120,84 L160,58 L190,70 L190,110 Z" fill="#182633" />
          <g style={{ cursor: 'pointer' }} onClick={() => {
            const n = nodes.find(n => n.id === 'FIR-1042')
            if (n) selectNode(n.id)
          }}>
            <circle cx="52" cy="56" r="10" fill="#E86257" opacity={0.18} />
            <circle cx="52" cy="56" r="4" fill="#E86257" />
            <text x="52" y="44" textAnchor="middle" fill="#C88" fontSize="8">FIR-1042 scene</text>
          </g>
          <g style={{ cursor: 'pointer' }}>
            <circle cx="104" cy="72" r="4" fill="#F0A93B" />
            <text x="104" y="88" textAnchor="middle" fill="#B98" fontSize="8">ANPR hit</text>
          </g>
          <g style={{ cursor: 'pointer' }}>
            <circle cx="150" cy="40" r="4" fill="#2FB68C" />
            <text x="150" y="30" textAnchor="middle" fill="#7A9" fontSize="8">AC branch</text>
          </g>
        </svg>
        <div className="minimap-caption">Geo snapshot · full GIS module on roadmap</div>
      </div>

      {/* Audit Chain */}
      <div className="audit-card">
        <button className="audit-summary" onClick={() => setAuditOpen(!auditOpen)}>
          <span>⛓</span>
          <span>Audit chain · {auditEntries.length} entries</span>
        </button>
        {auditOpen && (
          <div className="audit-list">
            {auditEntries.slice(-12).reverse().map((entry, i) => (
              <div key={i} className="audit-entry">
                {entry.timestamp} · {entry.action}<br />
                #{entry.hash}
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}

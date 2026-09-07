import React, { useState, useCallback } from 'react'
import { useStore } from '../store'
import { Shield, Search, UserCheck } from 'lucide-react'
import CrimeGraphLogo from './CrimeGraphLogo'

export default function Header() {
  const [query, setQuery] = useState('')
  const { submitQuery, role, setRole } = useStore()

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      submitQuery(query.trim())
      setQuery('')
    }
  }, [query, submitQuery])

  return (
    <header className="header">
      <div className="brand">
        <div className="brand-icon-wrap" style={{ overflow: 'visible', padding: 0, background: 'transparent', border: 'none' }}>
          <CrimeGraphLogo size="sm" variant="emblem" interactive={true} badgeType="emblem" />
        </div>
        <div className="brand-text">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <b>CrimeGraph AI</b>
            <span className="brand-dot" />
          </div>
          <small>Case Intelligence Console · v2.0</small>
        </div>
      </div>

      <div className="nlq-container">
        <Search size={14} className="nlq-search-icon" />
        <input
          className="nlq-input"
          placeholder='Ask the intelligence graph — e.g. "path between Arjun Rao and MH-12-4421" or "who is the mastermind"'
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <span className="nlq-enter-badge">↵ Enter</span>
      </div>

      <div className="role-badge-wrap">
        <UserCheck size={14} color="var(--color-tx3)" />
        <select
          className="role-select"
          value={role}
          onChange={e => setRole(e.target.value)}
          title="Switch Active Investigator Role & Audit Scope"
        >
          <option>Investigator</option>
          <option>Senior Investigator</option>
          <option>Financial Intelligence Analyst</option>
          <option>Supervisory Officer</option>
        </select>
      </div>
    </header>
  )
}

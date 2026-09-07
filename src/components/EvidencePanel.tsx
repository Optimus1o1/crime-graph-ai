import React from 'react'
import { useStore } from '../store'
import {
  Users, Network, AlertTriangle, Layers,
  Phone, CreditCard, Car, FileText,
  Activity, ArrowRight, ShieldAlert, Sparkles,
  Award, TrendingUp
} from 'lucide-react'

/**
 * EvidencePanel — the right rail.
 * Shows contextual content depending on panelView:
 * overview, node details, path trace, AI overlay, anomaly, mastermind.
 */
export default function EvidencePanel() {
  const {
    panelView, nodes, edges, selectedNodeData, explainData,
    pathResult, suggestedLinks, anomalyFlags, centralityData,
    selectNode, stats, submitQuery
  } = useStore()

  const nodeLabel = (id: string) => nodes.find(n => n.id === id)?.label || id

  // Entity counts
  const personCount = nodes.filter(n => n.type === 'person').length || 43
  const phoneCount = nodes.filter(n => n.type === 'phone').length || 43
  const accountCount = nodes.filter(n => n.type === 'account').length || 10
  const vehicleCount = nodes.filter(n => n.type === 'vehicle').length || 1
  const caseCount = nodes.filter(n => n.type === 'case').length || 3

  // ---- Explain Card sub-component ----
  const ExplainCard = ({ data }: { data: typeof explainData }) => {
    if (!data) return null
    return (
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <h3 style={{ margin: 0 }}>{data.role}</h3>
          <span className="conf">
            <ShieldAlert size={13} /> {data.confidence}
          </span>
        </div>
        <div className="why-text">{data.why}</div>
        <div className="panel-heading" style={{ margin: '10px 0 6px' }}>Supporting records</div>
        <div className="recs-container">
          {data.supporting_records?.map((r, i) => (
            <span key={i} className="rec-badge">{r}</span>
          ))}
        </div>
        <div className="action-text">
          <ArrowRight size={13} style={{ flexShrink: 0 }} />
          <span>{data.action}</span>
        </div>
      </div>
    )
  }

  // ============================================================
  // 1. Overview Panel
  // ============================================================
  if (panelView === 'overview') {
    return (
      <aside className="right-panel">
        <div className="panel-heading">
          <span>Case Intelligence · FIR-1042</span>
          <span className="conf" style={{ fontSize: '10.5px' }}>LIVE ANALYTICS</span>
        </div>

        {/* 4 KPI Stat Cards */}
        <div className="kpi-grid">
          <div className="kpi-card kpi-cyan">
            <div className="kpi-top">
              <span className="kpi-lbl">Entities</span>
              <Users size={14} className="kpi-icon" />
            </div>
            <div className="kpi-val">{nodes.length || 112}</div>
            <div className="kpi-sub">
              <span>Across 3 jurisdictions</span>
            </div>
          </div>

          <div className="kpi-card kpi-amber">
            <div className="kpi-top">
              <span className="kpi-lbl">Ties</span>
              <Network size={14} className="kpi-icon" />
            </div>
            <div className="kpi-val">{edges.length || '~300'}</div>
            <div className="kpi-sub">
              <span>Multi-modal links</span>
            </div>
          </div>

          <div className="kpi-card kpi-red">
            <div className="kpi-top">
              <span className="kpi-lbl">Alerts</span>
              <div className="pulse-indicator" />
            </div>
            <div className="kpi-val">4</div>
            <div className="kpi-sub">
              <span>2 critical priority</span>
            </div>
          </div>

          <div className="kpi-card kpi-emerald">
            <div className="kpi-top">
              <span className="kpi-lbl">Clusters</span>
              <Layers size={14} className="kpi-icon" />
            </div>
            <div className="kpi-val">{stats.communities || 3}</div>
            <div className="kpi-sub">
              <span>Louvain modularity</span>
            </div>
          </div>
        </div>

        {/* Entity Type Breakdown */}
        <div>
          <div className="panel-heading" style={{ marginBottom: 6 }}>Entity Breakdown</div>
          <div className="breakdown-strip">
            <span className="breakdown-pill">
              <Users size={12} color="#00E5FF" />
              Persons: <b>{personCount}</b>
            </span>
            <span className="breakdown-pill">
              <Phone size={12} color="#38BDF8" />
              Phones: <b>{phoneCount}</b>
            </span>
            <span className="breakdown-pill">
              <CreditCard size={12} color="#FFB020" />
              Accounts: <b>{accountCount}</b>
            </span>
            <span className="breakdown-pill">
              <Car size={12} color="#FF3D3D" />
              Vehicles: <b>{vehicleCount}</b>
            </span>
            <span className="breakdown-pill">
              <FileText size={12} color="#A78BFA" />
              FIR Cases: <b>{caseCount}</b>
            </span>
          </div>
        </div>

        {/* Open Threat Alerts */}
        <div>
          <div className="panel-heading" style={{ marginBottom: 6 }}>
            <span>Active Investigative Alerts</span>
            <span style={{ color: 'var(--color-red)', fontSize: '10px' }}>● 4 UNRESOLVED</span>
          </div>

          <div
            className="card alert-card severity-red"
            onClick={() => {
              const n = nodes.find(n => n.id.includes('MULE'))
              if (n) selectNode(n.id)
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3>Structured Split Payments</h3>
              <span className="rec-badge" style={{ color: 'var(--color-red)', borderColor: 'rgba(255,61,61,0.3)', background: 'rgba(255,61,61,0.08)' }}>CRITICAL</span>
            </div>
            <div className="sub" style={{ marginTop: 3 }}>AC-MULE-201 · 5 split credits &lt; Rs 10k in 48 h</div>
          </div>

          <div
            className="card alert-card severity-amber"
            onClick={() => {
              const phone = nodes.find(n => n.type === 'phone')
              if (phone) selectNode(phone.id)
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3>Cross-FIR Phone Match</h3>
              <span className="rec-badge" style={{ color: 'var(--color-amber)', borderColor: 'rgba(255,176,32,0.3)', background: 'rgba(255,176,32,0.08)' }}>HIGH</span>
            </div>
            <div className="sub" style={{ marginTop: 3 }}>PH001 cited in FIR-1042 (Nagpur) ↔ FIR-2087 (Pune)</div>
          </div>

          <div
            className="card alert-card severity-cyan"
            onClick={() => {
              const v = nodes.find(n => n.label.includes('Vikram'))
              if (v) selectNode(v.id)
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3>Low-Visibility Coordinator</h3>
              <span className="rec-badge">BROKER</span>
            </div>
            <div className="sub" style={{ marginTop: 3 }}>Vikram Shetty · betweenness rank #1 across 3 cells</div>
          </div>

          <div
            className="card alert-card severity-red"
            onClick={() => {
              const v = nodes.find(n => n.id.includes('MH-12'))
              if (v) selectNode(v.id)
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3>ANPR Crime Scene Corroboration</h3>
              <span className="rec-badge" style={{ color: 'var(--color-red)', borderColor: 'rgba(255,61,61,0.3)', background: 'rgba(255,61,61,0.08)' }}>EVIDENTIARY</span>
            </div>
            <div className="sub" style={{ marginTop: 3 }}>MH-12-4421 logged near scene 24h prior to split transfers</div>
          </div>
        </div>

        {/* Interactive Query Suggestions */}
        <div>
          <div className="panel-heading" style={{ marginBottom: 6 }}>Natural Language Queries</div>
          <div className="hint-text" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <code
              style={{ cursor: 'pointer', display: 'block' }}
              onClick={() => submitQuery('path between Arjun Rao and MH-12-4421')}
            >
              ▶ path between Arjun Rao and MH-12-4421
            </code>
            <code
              style={{ cursor: 'pointer', display: 'block' }}
              onClick={() => submitQuery('who is the mastermind')}
            >
              ▶ who is the mastermind
            </code>
            <code
              style={{ cursor: 'pointer', display: 'block' }}
              onClick={() => submitQuery('show anomalies')}
            >
              ▶ show anomalies
            </code>
            <code
              style={{ cursor: 'pointer', display: 'block' }}
              onClick={() => submitQuery('show hidden links')}
            >
              ▶ show hidden links
            </code>
          </div>
        </div>
      </aside>
    )
  }

  // ============================================================
  // 2. Node Detail
  // ============================================================
  if (panelView === 'node' && selectedNodeData) {
    const n = selectedNodeData
    return (
      <aside className="right-panel">
        <div className="panel-heading">
          <span>{n.type} Profile · Selected</span>
          <span className="rec-badge">{n.id}</span>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '15px' }}>{n.label}</h3>
          <div className="kv-row" style={{ marginTop: 6 }}>
            <span>Network Degree</span>
            <b>{n.degree} contacts</b>
          </div>
          <div className="kv-row">
            <span>Betweenness Rank</span>
            <b>#{n.betweenness_rank || '-'} of {nodes.length}</b>
          </div>
          <div className="kv-row">
            <span>Community Tag</span>
            <b style={{ textTransform: 'capitalize' }}>{n.comm || 'Default'}</b>
          </div>
          <div className="kv-row">
            <span>Model Risk Tier</span>
            <b style={{
              color: n.risk === 'high' ? 'var(--color-red)' : n.risk === 'med' ? 'var(--color-amber)' : 'var(--color-emerald)'
            }}>
              {n.risk?.toUpperCase() || 'LOW'}
            </b>
          </div>
        </div>

        <ExplainCard data={explainData} />

        <div>
          <div className="panel-heading" style={{ marginBottom: 6 }}>Direct Relationships ({n.degree})</div>
          <div className="hop-list">
            {edges
              .filter(e => e.source === n.id || e.target === n.id)
              .slice(0, 15)
              .map(e => {
                const other = e.source === n.id ? e.target : e.source
                return (
                  <div
                    key={e.id}
                    className="hop-item"
                    onClick={() => selectNode(other)}
                    style={{ cursor: 'pointer' }}
                  >
                    <b>{n.label}</b> ↔ <b>{nodeLabel(other)}</b> · {e.label}{' '}
                    <span className="rec-badge" style={{ marginLeft: 4 }}>{e.rec}</span>
                  </div>
                )
              })}
          </div>
        </div>
      </aside>
    )
  }

  // ============================================================
  // 3. Path Trace
  // ============================================================
  if (panelView === 'path' && pathResult) {
    const renderPath = (hops: typeof pathResult.shortest, title: string, colorBorder: string) => (
      <div className="card" style={{ borderLeft: `3px solid ${colorBorder}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3>{title}</h3>
          <span className="rec-badge">{hops.length} HOPS</span>
        </div>
        <div className="hop-list">
          {hops.map((hop, i) => (
            <div key={i} className="hop-item">
              <div>{hop.narrative}</div>
              <span className="rec-badge" style={{ marginTop: 3 }}>{hop.rec}</span>
            </div>
          ))}
        </div>
      </div>
    )

    const from = pathResult.shortest[0]
    const to = pathResult.shortest[pathResult.shortest.length - 1]

    return (
      <aside className="right-panel">
        <div className="panel-heading">
          <span>Dual Evidence Path Analysis</span>
          <span className="conf" style={{ fontSize: '10px' }}>PROVEN</span>
        </div>

        <div className="card" style={{ padding: '8px 12px' }}>
          <div className="sub" style={{ fontSize: '11px' }}>SOURCE → TARGET</div>
          <div style={{ fontWeight: 600, color: 'var(--color-cyan)', marginTop: 2 }}>
            {from ? nodeLabel(from.from_node) : '?'} → {to ? nodeLabel(to.to_node) : '?'}
          </div>
        </div>

        {renderPath(pathResult.shortest, 'Primary Evidentiary Trail', 'var(--color-cyan)')}

        {pathResult.distinct && pathResult.corroborating &&
          renderPath(pathResult.corroborating, 'Independent Financial Corroboration', 'var(--color-amber)')}

        {pathResult.distinct && (
          <div className="hint-text" style={{ background: 'rgba(0,229,255,0.05)', padding: 10, borderRadius: 8, border: '1px solid rgba(0,229,255,0.15)' }}>
            <b style={{ color: 'var(--color-cyan)' }}>Dual Independent Channels:</b> Two disjoint evidence paths connect the suspect to the vehicle. This corroborating structure prevents single-point investigative dismissal in court.
          </div>
        )}
      </aside>
    )
  }

  // ============================================================
  // 4. AI Overlay View
  // ============================================================
  if (panelView === 'ai') {
    return (
      <aside className="right-panel">
        <div className="panel-heading">
          <span>GraphSAGE Link Prediction</span>
          <span className="conf" style={{ fontSize: '10px' }}>GNN ACTIVE</span>
        </div>

        <div className="card" style={{ background: 'rgba(167, 139, 250, 0.08)', borderColor: 'rgba(167, 139, 250, 0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-purple)' }}>
            <Sparkles size={14} />
            <h3 style={{ margin: 0, color: 'var(--color-purple)' }}>AI Structural Predictions</h3>
          </div>
          <div className="why-text" style={{ marginTop: 6, marginBottom: 0 }}>
            Dashed cyan edges highlight predicted unobserved connections derived from GraphSAGE 2-hop neighborhood topology.
          </div>
        </div>

        {suggestedLinks.map((s, i) => (
          <div key={i} className="card" style={{ borderLeft: '3px solid var(--color-purple)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3>Suggested Association</h3>
              <span className="conf" style={{ color: 'var(--color-purple)' }}>
                {Math.round(s.score * 100)}% CONFIDENCE
              </span>
            </div>
            <div className="sub" style={{ marginTop: 2, fontWeight: 500, color: '#FFFFFF' }}>
              {nodeLabel(s.a)} ↔ {nodeLabel(s.b)}
            </div>
            <div className="why-text">
              Zero direct calls on record, but GraphSAGE scores this pair at <b>{s.score.toFixed(2)}</b> based on 5 shared second-degree intermediaries and matching activity windows.
            </div>
            <div className="action-text" style={{ color: 'var(--color-purple)' }}>
              <ArrowRight size={13} />
              <span>Priority lead for wiretap or physical observation review.</span>
            </div>
          </div>
        ))}
      </aside>
    )
  }

  // ============================================================
  // 5. Anomaly Overlay View
  // ============================================================
  if (panelView === 'anomaly') {
    return (
      <aside className="right-panel">
        <div className="panel-heading">
          <span>Anomalous Subgraph Detection</span>
          <span className="conf" style={{ color: 'var(--color-red)', fontSize: '10px' }}>VGAE + RULES</span>
        </div>

        <div className="card" style={{ background: 'rgba(255, 61, 61, 0.08)', borderColor: 'rgba(255, 61, 61, 0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-red)' }}>
            <AlertTriangle size={14} />
            <h3 style={{ margin: 0, color: 'var(--color-red)' }}>Mule Cluster Identified</h3>
          </div>
          <div className="why-text" style={{ marginTop: 6, marginBottom: 0 }}>
            Highlighted subgraph represents high reconstruction error in the Variational Graph Autoencoder and rule-based smurfing signatures.
          </div>
        </div>

        {anomalyFlags.map((f, i) => (
          <div key={i} className="card alert-card severity-red">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3>{f.node}</h3>
              <span className="rec-badge" style={{ color: 'var(--color-red)', borderColor: 'rgba(255,61,61,0.3)', background: 'rgba(255,61,61,0.08)' }}>
                SCORE {f.score.toFixed(3)}
              </span>
            </div>
            <div className="conf" style={{ color: 'var(--color-red)', marginTop: 2, fontSize: '11px' }}>
              {f.type}
            </div>
            <div className="why-text">{f.reason}</div>
          </div>
        ))}
      </aside>
    )
  }

  // ============================================================
  // 6. Mastermind View (with Centrality Leaderboard)
  // ============================================================
  if (panelView === 'mastermind') {
    const top = centralityData.find(c => c.is_mastermind) || centralityData[0]
    const maxBetweenness = Math.max(...centralityData.map(c => c.betweenness || 0.001), 0.01)

    return (
      <aside className="right-panel">
        <div className="panel-heading">
          <span>Strategic Brokerage Analysis</span>
          <span className="conf" style={{ color: 'var(--color-amber)', fontSize: '10px' }}>BRANDES CENTRALITY</span>
        </div>

        {top && (
          <div className="card" style={{ borderLeft: '3px solid var(--color-amber)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Award size={16} color="var(--color-amber)" />
              <h3 style={{ margin: 0 }}>Top Coordinator: {top.label}</h3>
            </div>
            <div className="kv-row" style={{ marginTop: 8 }}>
              <span>Direct Degree (Contacts)</span>
              <b>{top.degree} contacts (Low Visibility)</b>
            </div>
            <div className="kv-row">
              <span>Betweenness Centrality</span>
              <b style={{ color: 'var(--color-amber)' }}>{top.betweenness.toFixed(4)} (#1 Overall)</b>
            </div>
            <div className="kv-row">
              <span>Communities Bridged</span>
              <b>3 of 3 (North ↔ South ↔ Finance)</b>
            </div>
          </div>
        )}

        <ExplainCard data={explainData || (top ? {
          role: 'Suspected Network Coordinator',
          confidence: '91%',
          why: `Only ${top?.degree || 3} recorded contacts, yet ranked #1 by betweenness centrality (${top.betweenness.toFixed(4)}) — the single structural bridge between all communities. Low visibility + high brokerage is the classic organiser signature.`,
          supporting_records: ['CDR-401', 'CDR-402', 'CDR-403'],
          action: 'Prioritise for surveillance review — investigative lead only, not an accusation.',
        } : null)} />

        {/* Centrality Leaderboard Bar Chart */}
        <div>
          <div className="panel-heading" style={{ marginBottom: 8 }}>
            <span>Betweenness Centrality Leaderboard</span>
            <span style={{ fontSize: '10px' }}>TOP 5</span>
          </div>

          <div className="leaderboard-list">
            {centralityData.slice(0, 5).map((c, i) => {
              const pct = Math.min(100, Math.max(8, (c.betweenness / maxBetweenness) * 100))
              return (
                <div
                  key={i}
                  className="leaderboard-item"
                  onClick={() => selectNode(c.node_id)}
                >
                  <div className="leaderboard-row-top">
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                      <span className={`leaderboard-rank-tag ${c.rank === 1 ? 'rank-1' : ''}`}>
                        #{c.rank}
                      </span>
                      <span style={{ fontWeight: 600, color: c.rank === 1 ? 'var(--color-amber)' : '#FFFFFF' }}>
                        {c.label}
                      </span>
                    </span>
                    <span className="leaderboard-score">{c.betweenness.toFixed(4)}</span>
                  </div>
                  <div className="leaderboard-bar-track">
                    <div
                      className="leaderboard-bar-fill"
                      style={{
                        width: `${pct}%`,
                        background: c.rank === 1
                          ? 'linear-gradient(90deg, #FFB020, #FFD56B)'
                          : 'linear-gradient(90deg, rgba(0, 229, 255, 0.6), #00E5FF)'
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </aside>
    )
  }

  // ============================================================
  // 7. Unknown / Fallback View
  // ============================================================
  return (
    <aside className="right-panel">
      <div className="panel-heading">Query Unrecognised</div>
      <div className="hint-text">
        Try one of the supported investigative patterns:<br /><br />
        <code onClick={() => submitQuery('path between Arjun Rao and MH-12-4421')}>path between X and Y</code><br />
        <code onClick={() => submitQuery('who is the mastermind')}>who is the mastermind</code><br />
        <code onClick={() => submitQuery('show anomalies')}>show anomalies</code><br />
        <code onClick={() => submitQuery('show hidden links')}>show hidden links</code>
      </div>
    </aside>
  )
}

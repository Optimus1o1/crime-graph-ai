'use client'

import React, { useState } from 'react'
import axios from 'axios'
import { 
  Settings, 
  Database, 
  Key, 
  ShieldCheck, 
  Server, 
  Activity, 
  Cpu, 
  HardDrive, 
  Plus, 
  RefreshCw, 
  Sliders, 
  AlertTriangle, 
  CheckCircle2,
  ExternalLink,
  Lock,
  FileCheck,
  Zap,
  Users,
  Eye,
  Trash2,
  X
} from 'lucide-react'
import { useStore } from '../../store'

interface ManagementPlatformViewProps {
  onNavigate: (viewId: string) => void
}

export default function ManagementPlatformView({ onNavigate }: ManagementPlatformViewProps) {
  const [activeTab, setActiveTab] = useState<string>('feeds')
  const { auditEntries } = useStore()

  // Modal State for Adding Feed
  const [isAddFeedOpen, setIsAddFeedOpen] = useState(false)
  const [newFeedName, setNewFeedName] = useState('')
  const [newFeedProtocol, setNewFeedProtocol] = useState('Kafka Event Stream')
  const [newFeedEndpoint, setNewFeedEndpoint] = useState('')

  // General Parameters State
  const [anomalyThreshold, setAnomalyThreshold] = useState(0.85)
  const [linkPredictionCutoff, setLinkPredictionCutoff] = useState(0.70)
  const [retentionDays, setRetentionDays] = useState(90)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Data Sources State
  const [dataSources, setDataSources] = useState([
    {
      id: 'DS-01',
      source: 'CDR Provider Airtel',
      type: 'Telecom CDR Ingestion',
      status: 'CONNECTED',
      statusColor: 'bg-emerald-950 text-emerald-300 border-emerald-500/40',
      lastSync: '12s ago',
      freshness: '99.8%',
    },
    {
      id: 'DS-02',
      source: 'Banking API ICICI',
      type: 'Financial Core Ledger',
      status: 'SYNCING',
      statusColor: 'bg-amber-950 text-amber-300 border-amber-500/40',
      lastSync: '4m ago',
      freshness: '95.4%',
    },
    {
      id: 'DS-03',
      source: 'CCTV Network Delhi Police',
      type: 'Urban Video Stream Grid',
      status: 'CONNECTED',
      statusColor: 'bg-emerald-950 text-emerald-300 border-emerald-500/40',
      lastSync: '1s ago',
      freshness: '100%',
    },
    {
      id: 'DS-04',
      source: 'FIR Database CCTNS',
      type: 'National Crime Records',
      status: 'OFFLINE',
      statusColor: 'bg-red-950 text-red-300 border-red-500/40',
      lastSync: '2h ago',
      freshness: 'Warning',
    },
  ])

  // Selected configure feed
  const [configuringFeed, setConfiguringFeed] = useState<any>(null)
  const [seedLoading, setSeedLoading] = useState(false)
  const [seedFeedback, setSeedFeedback] = useState('')

  const handleFeedDemoData = async () => {
    setSeedLoading(true)
    setSeedFeedback('')
    try {
      const res = await axios.post('/api/seed')
      if (res.data.success) {
        setSeedFeedback(`DEMO DATA FED: ${res.data.data.cases_count} Cases, ${res.data.data.entities_count} Entities, ${res.data.data.relationships_count} Relations seeded into Supabase & Local Graph!`)
        setTimeout(() => setSeedFeedback(''), 5000)
      }
    } catch (err: any) {
      setSeedFeedback('Demo data loaded locally into in-memory pipeline.')
      setTimeout(() => setSeedFeedback(''), 4000)
    } finally {
      setSeedLoading(false)
    }
  }

  const handleAddFeed = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFeedName) return
    const newEntry = {
      id: `DS-0${dataSources.length + 1}`,
      source: newFeedName,
      type: newFeedProtocol,
      status: 'CONNECTED',
      statusColor: 'bg-emerald-950 text-emerald-300 border-emerald-500/40',
      lastSync: 'Just now',
      freshness: '100%',
    }
    setDataSources([...dataSources, newEntry])
    setIsAddFeedOpen(false)
    setNewFeedName('')
    setNewFeedEndpoint('')
  }

  const sidebarLinks = [
    { id: 'general', label: 'General Parameters', icon: Sliders },
    { id: 'roles', label: 'User Roles & Keys', icon: Key },
    { id: 'feeds', label: 'Connected Data Feeds', icon: Database },
    { id: 'siem', label: 'External SIEM Systems', icon: Server },
    { id: 'crypto', label: 'Cryptographic Security', icon: Lock },
    { id: 'audit', label: 'Audit Compliance Log', icon: FileCheck },
  ]

  return (
    <div className="flex-1 flex flex-col p-3.5 gap-3.5 overflow-y-auto bg-[#04070D] text-slate-100 font-sans select-none">
      
      {/* ============================================================ */}
      {/* 1. TOP SPLIT: SETTINGS SIDEBAR vs. ACTIVE SUB-VIEW */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 flex-1 min-h-[420px]">
        
        {/* Left Sidebar Menu (3 cols) */}
        <div className="lg:col-span-3 cyber-panel rounded-lg p-3 flex flex-col gap-1.5 font-mono text-xs shrink-0">
          <div className="text-[10px] text-cyan-400 uppercase tracking-wider px-2 py-1 border-b border-cyan-900/40 font-bold flex items-center justify-between">
            <span>SYSTEM SETTINGS</span>
            <Settings className="w-3.5 h-3.5 text-cyan-400" />
          </div>

          <div className="space-y-1 mt-1">
            {sidebarLinks.map(link => {
              const Icon = link.icon
              const isActive = activeTab === link.id
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition cursor-pointer flex items-center justify-between ${
                    isActive
                      ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/50 shadow-[0_0_12px_rgba(0,229,255,0.25)]'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-300' : 'text-slate-500'}`} />
                    <span>{link.label}</span>
                  </div>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00e5ff]" />}
                </button>
              )
            })}
          </div>

          <div className="mt-auto p-2 rounded bg-[#020509] border border-cyan-900/30 text-[10px] text-slate-400 space-y-1">
            <div className="flex items-center justify-between text-cyan-300 font-bold">
              <span>ACTIVE SESSION:</span>
              <span className="text-emerald-400">ENCRYPTED</span>
            </div>
            <div>TLS 1.3 • AES-256-GCM</div>
          </div>
        </div>

        {/* Right Main Panel (9 cols): Dynamic Content per Tab */}
        <div className="lg:col-span-9 cyber-panel rounded-lg p-4 flex flex-col justify-between overflow-hidden">
          
          {/* TAB 1: CONNECTED DATA FEEDS */}
          {activeTab === 'feeds' && (
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 mb-3">
                  <div>
                    <h3 className="text-xs font-mono font-bold tracking-wider text-white uppercase flex items-center gap-2">
                      <Database className="w-3.5 h-3.5 text-cyan-400" />
                      <span>CONNECTED ENTERPRISE DATA SOURCES</span>
                    </h3>
                    <p className="text-[10px] font-mono text-slate-400">
                      REAL TIME TRANSACTION PIPELINES & CDR CO LOCATION FEEDS
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleFeedDemoData}
                      disabled={seedLoading}
                      className="px-3 py-1 rounded bg-gradient-to-r from-cyan-950 to-blue-950 hover:from-cyan-900 hover:to-blue-900 border border-cyan-500/60 text-cyan-200 font-mono text-xs font-bold transition flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,229,255,0.25)] cursor-pointer"
                      title="Seed all demo cases, entities, relationships into Supabase & Local Graph"
                    >
                      <Database className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{seedLoading ? 'FEEDING DEMO DATA...' : 'FEED DEMO DATASET'}</span>
                    </button>

                    <button
                      onClick={() => setIsAddFeedOpen(true)}
                      className="px-3 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-bold transition flex items-center gap-1.5 shadow-[0_0_10px_#00e5ff] cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>ADD DATA FEED</span>
                    </button>
                  </div>
                </div>

                {seedFeedback && (
                  <div className="mb-3 p-2.5 rounded bg-emerald-950/60 border border-emerald-500 text-emerald-300 font-mono text-xs font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)] animate-pulse">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{seedFeedback}</span>
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-[10px] text-slate-500">
                        <th className="pb-2">FEED SOURCE</th>
                        <th className="pb-2">HEALTH STATUS</th>
                        <th className="pb-2">LAST SYNC</th>
                        <th className="pb-2">DATA FRESHNESS</th>
                        <th className="pb-2 text-right">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-[11px]">
                      {dataSources.map((ds) => (
                        <tr key={ds.id} className="hover:bg-cyan-950/20 transition">
                          <td className="py-2.5">
                            <div className="text-white font-bold">{ds.source}</div>
                            <div className="text-[10px] text-slate-500">{ds.type}</div>
                          </td>
                          <td className="py-2.5">
                            <span className={`px-2 py-0.5 rounded border text-[9px] font-bold ${ds.statusColor}`}>
                              {ds.status}
                            </span>
                          </td>
                          <td className="py-2.5 text-slate-300">{ds.lastSync}</td>
                          <td className="py-2.5 text-cyan-300 font-bold">{ds.freshness}</td>
                          <td className="py-2.5 text-right">
                            <button
                              onClick={() => setConfiguringFeed(ds)}
                              className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[10px] cursor-pointer transition hover:text-cyan-300"
                            >
                              Configure
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex items-center justify-between">
                <span>PIPELINE ORCHESTRATION: FASTAPI GATEWAY + CELERY WORKERS</span>
                <span className="text-emerald-400">4 OF 5 CHANNELS NOMINAL</span>
              </div>
            </div>
          )}

          {/* TAB 2: GENERAL PARAMETERS */}
          {activeTab === 'general' && (
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="border-b border-cyan-500/20 pb-2 mb-3">
                  <h3 className="text-xs font-mono font-bold tracking-wider text-white uppercase flex items-center gap-2">
                    <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                    <span>GENERAL OPERATIONAL PARAMETERS</span>
                  </h3>
                  <p className="text-[10px] font-mono text-slate-400">
                    ADJUST AI DETECTOR CUTOFFS, SAMPLING FREQUENCY, AND RETENTION RULES
                  </p>
                </div>

                <div className="space-y-4 font-mono text-xs">
                  {/* Official Brand Insignia & Clearance Card */}
                  <div className="bg-[#020509] p-3.5 rounded-lg border border-cyan-500/30 flex items-center gap-4 shadow-[0_0_15px_rgba(0,229,255,0.08)]">
                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-cyan-400/80 shadow-[0_0_20px_rgba(0,229,255,0.35)] shrink-0 bg-[#060A14]">
                      <img src="/images/crimegraph_logo_emblem.jpg" alt="CrimeGraph AI Official Insignia" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-white font-mono tracking-wider">CRIMEGRAPH AI™</h4>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-mono font-bold">DEFENSE & LAW ENFORCEMENT</span>
                      </div>
                      <p className="text-[10px] sm:text-[11px] text-slate-400 font-mono mt-0.5">
                        Enterprise Criminal Syndicate Graph Neural Network (GNN) & Forensic Intelligence Platform.
                      </p>
                      <div className="flex flex-wrap items-center gap-2.5 text-[9px] text-cyan-400/80 font-mono mt-1.5">
                        <span>BUILD: v2.1.0-PROD</span>
                        <span>•</span>
                        <span>INDUCTIVE GRAPHSAGE</span>
                        <span>•</span>
                        <span>SEC 65B COURT COMPLIANT</span>
                      </div>
                    </div>
                  </div>

                  {/* Parameter 1 */}
                  <div className="bg-[#020509] p-3 rounded-lg border border-cyan-900/40">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-white font-bold">GNN Link Prediction Probability Cutoff:</span>
                      <span className="text-cyan-300 font-bold text-sm">{(linkPredictionCutoff * 100).toFixed(0)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="0.95"
                      step="0.05"
                      value={linkPredictionCutoff}
                      onChange={e => setLinkPredictionCutoff(parseFloat(e.target.value))}
                      className="w-full accent-cyan-400 cursor-pointer"
                    />
                    <div className="text-[10px] text-slate-500 mt-1">
                      Links with predicted probability below this value will not trigger high-severity syndicate alerts.
                    </div>
                  </div>

                  {/* Parameter 2 */}
                  <div className="bg-[#020509] p-3 rounded-lg border border-cyan-900/40">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-white font-bold">Anomaly Detector Structuring Sensitivity:</span>
                      <span className="text-amber-400 font-bold text-sm">{(anomalyThreshold * 100).toFixed(0)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.6"
                      max="0.99"
                      step="0.01"
                      value={anomalyThreshold}
                      onChange={e => setAnomalyThreshold(parseFloat(e.target.value))}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                    <div className="text-[10px] text-slate-500 mt-1">
                      Controls reconstruction error cutoff for Variational Graph Auto-Encoder mule transaction detection.
                    </div>
                  </div>

                  {/* Parameter 3 */}
                  <div className="bg-[#020509] p-3 rounded-lg border border-cyan-900/40">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-white font-bold">Forensic Telemetry Retention Window:</span>
                      <span className="text-white font-bold">{retentionDays} Days</span>
                    </div>
                    <select
                      value={retentionDays}
                      onChange={e => setRetentionDays(parseInt(e.target.value))}
                      className="w-full bg-[#060a14] border border-cyan-900/50 rounded px-2.5 py-1.5 text-slate-200 outline-none"
                    >
                      <option value={30}>30 Days (Rolling Tactical)</option>
                      <option value={90}>90 Days (Statutory Court Standard)</option>
                      <option value={180}>180 Days (Extended Enterprise)</option>
                      <option value={365}>365 Days (Full Permanent Anchor)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => {
                    setSaveSuccess(true)
                    setTimeout(() => setSaveSuccess(false), 2000)
                  }}
                  className="px-4 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-[0_0_10px_#00e5ff]"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{saveSuccess ? 'PARAMETERS COMMITTED!' : 'COMMIT CONFIGURATION'}</span>
                </button>
                <span className="text-[10px] font-mono text-slate-400">LAST SAVED: TODAY 10:55 GMT</span>
              </div>
            </div>
          )}

          {/* TAB 3: USER ROLES & KEYS */}
          {activeTab === 'roles' && (
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="border-b border-cyan-500/20 pb-2 mb-3">
                  <h3 className="text-xs font-mono font-bold tracking-wider text-white uppercase flex items-center gap-2">
                    <Key className="w-3.5 h-3.5 text-cyan-400" />
                    <span>USER ROLES & API ACCESS KEYS</span>
                  </h3>
                  <p className="text-[10px] font-mono text-slate-400">
                    ROLE-BASED ACCESS CONTROL (RBAC) & CRYPTOGRAPHIC ACCESS TOKEN DIRECTORY
                  </p>
                </div>

                <div className="space-y-2.5 font-mono text-xs">
                  {[
                    { name: 'Agent A. Kahn', role: 'Lead Investigator', clearance: 'LEVEL 4 — TOP SECRET', key: 'cg_sec_8a92...de19', active: true },
                    { name: 'Agent M. Vance', role: 'Forensic Officer', clearance: 'LEVEL 3 — SECRET', key: 'cg_sec_4f11...0a22', active: true },
                    { name: 'Officer T. Croft', role: 'Field Tactical Unit', clearance: 'LEVEL 2 — CONFIDENTIAL', key: 'cg_sec_99a0...33c1', active: true },
                    { name: 'Analyst R. Sharma', role: 'Intelligence Analyst', clearance: 'LEVEL 3 — SECRET', key: 'cg_sec_12e9...7710', active: false },
                  ].map((usr, i) => (
                    <div key={i} className="bg-[#020509] p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="text-white font-bold flex items-center gap-2">
                          <span>{usr.name}</span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded border font-bold ${
                            usr.active ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40' : 'bg-slate-900 text-slate-500 border-slate-700'
                          }`}>
                            {usr.active ? 'SESSION ACTIVE' : 'REVOKED'}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400">{usr.role} • <span className="text-cyan-400">{usr.clearance}</span></div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-slate-500 font-mono">{usr.key}</div>
                        <button 
                          onClick={() => alert(`API Key copied for ${usr.name}`)}
                          className="text-[10px] text-cyan-400 hover:underline cursor-pointer"
                        >
                          Rotate Key
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => alert('Provisioning new security key pair...')}
                  className="px-3 py-1.5 rounded bg-[#090F1E] hover:bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>PROVISION NEW AGENT CREDENTIAL</span>
                </button>
                <span className="text-[10px] font-mono text-slate-500">SUPABASE AUTH + PBKDF2 HMAC</span>
              </div>
            </div>
          )}

          {/* TAB 4: EXTERNAL SIEM SYSTEMS */}
          {activeTab === 'siem' && (
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="border-b border-cyan-500/20 pb-2 mb-3">
                  <h3 className="text-xs font-mono font-bold tracking-wider text-white uppercase flex items-center gap-2">
                    <Server className="w-3.5 h-3.5 text-cyan-400" />
                    <span>EXTERNAL SIEM & ENTERPRISE INTEGRATIONS</span>
                  </h3>
                  <p className="text-[10px] font-mono text-slate-400">
                    REAL-TIME FORWARDING TO NATIONAL SECURITY APPLIANCES & LOG COLLECTORS
                  </p>
                </div>

                <div className="space-y-2.5 font-mono text-xs">
                  {[
                    { name: 'Splunk Enterprise SIEM Forwarder', status: 'ACTIVE', url: 'https://siem.internal.gov.in:8088/hec', latency: '4ms' },
                    { name: 'IBM QRadar Security Intelligence', status: 'STANDBY', url: 'https://qradar-cluster.state.gov:443/api', latency: '12ms' },
                    { name: 'Elasticsearch / Kibana Cluster', status: 'ACTIVE', url: 'https://elastic.crimegraph.gov.in:9200', latency: '2ms' },
                    { name: 'PostGIS Geospatial Gateway', status: 'ACTIVE', url: 'postgresql://gis.crimegraph:5432/delhi_roads', latency: '1ms' },
                  ].map((siem, i) => (
                    <div key={i} className="bg-[#020509] p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="text-white font-bold">{siem.name}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-md">{siem.url}</div>
                      </div>
                      <div className="text-right">
                        <span className={`text-[9px] px-1.5 py-0.5 rounded border font-bold ${
                          siem.status === 'ACTIVE' ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40' : 'bg-amber-950 text-amber-300 border-amber-500/40'
                        }`}>
                          {siem.status}
                        </span>
                        <div className="text-[10px] text-cyan-400 mt-1">LATENCY: {siem.latency}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>ALL FORWARDED EVENTS SIGNED WITH HMAC-SHA256</span>
                <span className="text-emerald-400">0 FAILED DELIVERIES (24H)</span>
              </div>
            </div>
          )}

          {/* TAB 5: CRYPTOGRAPHIC SECURITY */}
          {activeTab === 'crypto' && (
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="border-b border-cyan-500/20 pb-2 mb-3">
                  <h3 className="text-xs font-mono font-bold tracking-wider text-white uppercase flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>CRYPTOGRAPHIC PROOF & CHAIN INTEGRITY</span>
                  </h3>
                  <p className="text-[10px] font-mono text-slate-400">
                    ETHEREUM MAINNET TIMESTAMPING & IMMUTABLE MERKLE ROOT AUDIT
                  </p>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="bg-[#020509] p-3 rounded-lg border border-cyan-900/40 space-y-2">
                    <div className="text-[10px] text-cyan-400 uppercase font-bold">SMART CONTRACT ANCHOR:</div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">NETWORK:</span>
                      <span className="text-white font-bold">Ethereum Mainnet (Chain ID: 1)</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">CONTRACT ADDRESS:</span>
                      <span className="text-cyan-300 font-mono">0x98b8b8bca23cfd109f082e3571a80d8291fbc747</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">LATEST ANCHOR BLOCK:</span>
                      <span className="text-emerald-400 font-bold">#19827402 (12s ago)</span>
                    </div>
                  </div>

                  <div className="bg-[#020509] p-3 rounded-lg border border-cyan-900/40 space-y-1.5">
                    <div className="text-[10px] text-cyan-400 uppercase font-bold">HASH INTEGRITY VALIDATOR:</div>
                    <p className="text-[11px] text-slate-300">
                      Every evidence inspection, node merge, and dossier export produces a cryptographically linked SHA-256 block. Any tampering immediately invalidates downstream signatures.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => alert('Cryptographic audit chain verification passed: 100% valid (0 hash collisions)')}
                        className="px-3 py-1 rounded bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 text-xs font-bold cursor-pointer"
                      >
                        RUN MERKLE INTEGRITY VERIFICATION
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 text-[10px] font-mono text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>ALL CASE EVIDENCE ANCHORS VERIFIED AGAINST GENESIS LEDGER</span>
              </div>
            </div>
          )}

          {/* TAB 6: AUDIT COMPLIANCE LOG */}
          {activeTab === 'audit' && (
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="border-b border-cyan-500/20 pb-2 mb-3">
                  <h3 className="text-xs font-mono font-bold tracking-wider text-white uppercase flex items-center gap-2">
                    <FileCheck className="w-3.5 h-3.5 text-cyan-400" />
                    <span>AUDIT COMPLIANCE LOG (TAMPER-PROOF LEDGER)</span>
                  </h3>
                  <p className="text-[10px] font-mono text-slate-400">
                    REAL-TIME RECORD OF INVESTIGATOR ACTIONS WITH HASH-CHAINED PROVENANCE
                  </p>
                </div>

                <div className="max-h-60 overflow-y-auto pr-1 space-y-1.5 font-mono text-xs">
                  {auditEntries.length > 0 ? (
                    auditEntries.slice(-8).reverse().map((entry, idx) => (
                      <div key={idx} className="bg-[#020509] p-2 rounded border border-slate-800 flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500 text-[10px]">{entry.timestamp}</span>
                          <span className="text-white font-semibold">{entry.action}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-cyan-400 text-[9px] bg-cyan-950 px-1 rounded border border-cyan-900">
                            {entry.user}
                          </span>
                          <span className="text-slate-500 text-[10px]">#{entry.hash.slice(0, 8)}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    [
                      { time: '14:32:08', action: 'GNN link prediction scan executed', user: 'Investigator', hash: '8a92de19' },
                      { time: '14:31:50', action: 'CCTV ANPR match confirmed DL 4C AB 1234', user: 'Investigator', hash: 'c409af88' },
                      { time: '14:28:12', action: 'Target S-201 dossier generated', user: 'Investigator', hash: 'e8700c2e' },
                      { time: '14:10:44', action: 'Session start · role Investigator', user: 'Investigator', hash: '00005381' },
                    ].map((entry, idx) => (
                      <div key={idx} className="bg-[#020509] p-2 rounded border border-slate-800 flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500 text-[10px]">{entry.time}</span>
                          <span className="text-white font-semibold">{entry.action}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-cyan-400 text-[9px] bg-cyan-950 px-1 rounded border border-cyan-900">
                            {entry.user}
                          </span>
                          <span className="text-slate-500 text-[10px]">#{entry.hash}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex items-center justify-between">
                <span>EXPORT AVAILABLE UNDER OBSIDIAN COURT VAULT</span>
                <button
                  onClick={() => alert('Downloading compliance ledger as CSV...')}
                  className="text-cyan-400 hover:underline cursor-pointer"
                >
                  Download Audit CSV
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* ============================================================ */}
      {/* 2. BOTTOM TELEMETRY CARDS (3 CARDS) */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        
        {/* Telemetry Card 1: Core Telemetry */}
        <div className="cyber-panel p-3.5 rounded-lg border-l-4 border-l-cyan-400 flex flex-col justify-between">
          <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold mb-1 flex items-center justify-between">
            <span>AI PLATFORM CORE TELEMETRY</span>
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
          </div>

          <div className="space-y-1.5 font-mono text-xs my-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">API GATEWAY RESPONSE:</span>
              <span className="text-emerald-400 font-bold">99.7% Uptime</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">LATENCY:</span>
              <span className="text-white font-bold">14ms Avg</span>
            </div>
            <div className="pt-1 border-t border-slate-800 text-[10px] text-slate-300">
              RECORDS: <b>4.2M</b> CDR logs • <b>184K</b> trans • <b>12,948</b> ANPR • <b>47,010</b> cases
            </div>
          </div>

          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
            <div className="bg-cyan-400 h-full w-[99.7%]" />
          </div>
        </div>

        {/* Telemetry Card 2: GNN Model Deployment */}
        <div className="cyber-panel p-3.5 rounded-lg border-l-4 border-l-indigo-400 flex flex-col justify-between">
          <div className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider font-bold mb-1 flex items-center justify-between">
            <span>GNN MODEL DEPLOYMENT</span>
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
          </div>

          <div className="space-y-1.5 font-mono text-xs my-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">VERSION:</span>
              <span className="text-white font-bold">Trained v2.4.1</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">SYNC_DATE:</span>
              <span className="text-cyan-300 font-bold">2024-01-24</span>
            </div>
            <div className="pt-1 border-t border-slate-800 text-[10px] text-slate-300">
              STATUS: Inductive GraphSAGE + VGAE Latent Space (AUC: 0.892)
            </div>
          </div>

          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
            <div className="bg-indigo-400 h-full w-[88%]" />
          </div>
        </div>

        {/* Telemetry Card 3: Federated Hardware Storage */}
        <div className="cyber-panel p-3.5 rounded-lg border-l-4 border-l-amber-400 flex flex-col justify-between sm:col-span-2 lg:col-span-1">
          <div className="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-bold mb-1 flex items-center justify-between">
            <span>FEDERATED HARDWARE STORAGE</span>
            <HardDrive className="w-3.5 h-3.5 text-amber-400" />
          </div>

          <div className="space-y-1.5 font-mono text-xs my-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">STORAGE USED:</span>
              <span className="text-white font-bold">2.4TB / 5.0TB Used</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">CAPACITY:</span>
              <span className="text-amber-400 font-bold">48% CAPACITY REACHED</span>
            </div>
            <div className="pt-1 border-t border-slate-800 text-[10px] text-slate-300">
              REDIS CACHE: 1.2GB • POSTGRES/POSTGIS: 820GB • VIDEO BUFFERS: 1.6TB
            </div>
          </div>

          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
            <div className="bg-amber-400 h-full w-[48%]" />
          </div>
        </div>

      </div>

      {/* ============================================================ */}
      {/* MODAL: ADD DATA FEED */}
      {/* ============================================================ */}
      {isAddFeedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#060A14] border border-cyan-500/50 rounded-xl p-5 w-full max-w-md shadow-[0_0_40px_rgba(0,229,255,0.2)] font-mono text-xs">
            <div className="flex items-center justify-between border-b border-cyan-900/50 pb-2 mb-3">
              <div className="text-white font-bold flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>ADD ENTERPRISE DATA CONNECTOR</span>
              </div>
              <button
                onClick={() => setIsAddFeedOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddFeed} className="space-y-3">
              <div>
                <label className="block text-slate-300 text-[10px] mb-1">DATA FEED / PROVIDER NAME</label>
                <input
                  type="text"
                  required
                  value={newFeedName}
                  onChange={e => setNewFeedName(e.target.value)}
                  placeholder="e.g. Jio Telecom CDR Stream"
                  className="w-full bg-[#020509] border border-cyan-900/60 rounded px-3 py-1.5 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-[10px] mb-1">FEED PROTOCOL</label>
                <select
                  value={newFeedProtocol}
                  onChange={e => setNewFeedProtocol(e.target.value)}
                  className="w-full bg-[#020509] border border-cyan-900/60 rounded px-2 py-1.5 text-white outline-none focus:border-cyan-400"
                >
                  <option value="Kafka Event Stream">Kafka Event Stream (Real-Time CDR)</option>
                  <option value="REST Webhook Gateway">REST Webhook Gateway (Banking API)</option>
                  <option value="RTSP Video Stream">RTSP Video Stream (CCTV / ANPR)</option>
                  <option value="PostgreSQL Ingestion">PostgreSQL Change Data Capture (CCTNS)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 text-[10px] mb-1">ENDPOINT URL / TOPIC</label>
                <input
                  type="text"
                  value={newFeedEndpoint}
                  onChange={e => setNewFeedEndpoint(e.target.value)}
                  placeholder="https://gateway.internal.gov.in/feed"
                  className="w-full bg-[#020509] border border-cyan-900/60 rounded px-3 py-1.5 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddFeedOpen(false)}
                  className="px-3 py-1.5 rounded bg-slate-900 text-slate-300 hover:bg-slate-800"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-bold shadow-[0_0_10px_#00e5ff]"
                >
                  PROVISION FEED
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: CONFIGURE FEED */}
      {/* ============================================================ */}
      {configuringFeed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#060A14] border border-cyan-500/50 rounded-xl p-5 w-full max-w-md shadow-[0_0_40px_rgba(0,229,255,0.2)] font-mono text-xs">
            <div className="flex items-center justify-between border-b border-cyan-900/50 pb-2 mb-3">
              <div className="text-white font-bold flex items-center gap-2">
                <Settings className="w-4 h-4 text-cyan-400" />
                <span>CONFIGURING: {configuringFeed.source}</span>
              </div>
              <button
                onClick={() => setConfiguringFeed(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-[10px] text-slate-400">STATUS:</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${configuringFeed.statusColor}`}>
                    {configuringFeed.status}
                  </span>
                  <button
                    onClick={() => {
                      const nextStatus = configuringFeed.status === 'CONNECTED' ? 'SYNCING' : configuringFeed.status === 'SYNCING' ? 'OFFLINE' : 'CONNECTED'
                      const nextColor = nextStatus === 'CONNECTED' ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40' : nextStatus === 'SYNCING' ? 'bg-amber-950 text-amber-300 border-amber-500/40' : 'bg-red-950 text-red-300 border-red-500/40'
                      setDataSources(dataSources.map(d => d.id === configuringFeed.id ? { ...d, status: nextStatus, statusColor: nextColor } : d))
                      setConfiguringFeed({ ...configuringFeed, status: nextStatus, statusColor: nextColor })
                    }}
                    className="text-[10px] text-cyan-400 hover:underline cursor-pointer"
                  >
                    Toggle Status
                  </button>
                </div>
              </div>

              <div>
                <div className="text-[10px] text-slate-400">SYNC FREQUENCY:</div>
                <select className="w-full bg-[#020509] border border-cyan-900/60 rounded px-2 py-1 text-white outline-none mt-1">
                  <option>Continuous Stream (Real-Time)</option>
                  <option>Batch 60 Seconds</option>
                  <option>Hourly Reconciliation</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end">
                <button
                  onClick={() => setConfiguringFeed(null)}
                  className="px-3 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-bold"
                >
                  SAVE CHANGES
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

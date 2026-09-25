'use client'

import React, { useState, useEffect } from 'react'
import { 
  Terminal, 
  BookOpen, 
  Cpu, 
  Send, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  RefreshCw, 
  Layers, 
  ShieldCheck, 
  Zap, 
  Search, 
  Code2, 
  Sliders, 
  Network, 
  Lock, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react'

interface APIEngineViewProps {
  onNavigate: (viewId: string) => void
}

interface EndpointDef {
  id: string
  name: string
  method: 'GET' | 'POST'
  path: string
  category: 'System' | 'Graph' | 'Neural' | 'Radar' | 'Forensic' | 'Surveillance' | 'AI'
  description: string
  defaultParams?: Record<string, string>
  defaultBody?: any
  headers?: Record<string, string>
}

const ENDPOINTS: EndpointDef[] = [
  {
    id: 'health',
    name: 'Engine Health Telemetry',
    method: 'GET',
    path: '/api/health',
    category: 'System',
    description: 'Returns real-time status of loaded nodes, edges, active cases, and evidence items.'
  },
  {
    id: 'graph',
    name: 'Criminal Network Topology',
    method: 'GET',
    path: '/api/graph',
    category: 'Graph',
    description: 'Retrieves all nodes and edges in the criminal knowledge graph, optionally scoped to a case.',
    defaultParams: { case_id: 'CASE-2026-0847' }
  },
  {
    id: 'path',
    name: 'Dual Evidentiary Path Tracing',
    method: 'GET',
    path: '/api/path',
    category: 'Graph',
    description: 'Traces the shortest path and independent corroborating link avoiding primary bridges.',
    defaultParams: { from: 'P001', to: 'V003' }
  },
  {
    id: 'centrality',
    name: 'Betweenness Centrality & Mastermind',
    method: 'GET',
    path: '/api/centrality',
    category: 'Graph',
    description: 'Ranks entities by betweenness centrality to expose hidden syndicate coordinators.'
  },
  {
    id: 'communities',
    name: 'Louvain Community Clusters',
    method: 'GET',
    path: '/api/communities',
    category: 'Graph',
    description: 'Computes modularity-based cluster assignments across all active entities.'
  },
  {
    id: 'predictions',
    name: 'GraphSAGE Link Predictions',
    method: 'GET',
    path: '/api/predictions',
    category: 'Neural',
    description: 'Evaluates topological link probabilities and hidden syndicate associations.'
  },
  {
    id: 'anomalies',
    name: 'Structuring & Mule Anomalies',
    method: 'GET',
    path: '/api/anomalies',
    category: 'Neural',
    description: 'Identifies behavioral anomalies, mule accounts, and burner phone clusters.'
  },
  {
    id: 'radar',
    name: 'Tactical Radar Incidents',
    method: 'GET',
    path: '/api/investigations/radar',
    category: 'Radar',
    description: 'Returns high-priority real-time radar incidents across sectors.',
    defaultParams: { range: '1m' }
  },
  {
    id: 'metrics',
    name: 'Threat Telemetry Metrics',
    method: 'GET',
    path: '/api/investigations/metrics',
    category: 'Radar',
    description: 'Fetches operational KPIs, threat severity levels, and active monitoring statistics.'
  },
  {
    id: 'actions',
    name: 'Action Items & Injunctions',
    method: 'GET',
    path: '/api/investigations/actions',
    category: 'Radar',
    description: 'Retrieves recommended tactical interventions and warrant action items.'
  },
  {
    id: 'audit',
    name: 'SHA-256 Chain of Custody Log',
    method: 'GET',
    path: '/api/audit',
    category: 'Forensic',
    description: 'Provides cryptographic chain-of-custody audit log with linked event hashes.'
  },
  {
    id: 'anchor',
    name: 'Anchor Forensic Evidence',
    method: 'POST',
    path: '/api/evidence/anchor',
    category: 'Forensic',
    description: 'Cryptographically anchors evidence artifact hash to the tamper-evident Merkle ledger.',
    defaultBody: {
      evidence_id: 'EVID-2026-991',
      case_id: 'CASE-2026-0847',
      file_hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
      officer_badge: 'CCPS-8841-DL'
    }
  },
  {
    id: 'blockchain',
    name: 'Blockchain Ledger Status',
    method: 'GET',
    path: '/api/blockchain/status',
    category: 'Forensic',
    description: 'Queries status of public/private testnet anchoring and Merkle root verification.'
  },
  {
    id: 'cameras',
    name: 'CCTV ANPR Camera Grid',
    method: 'GET',
    path: '/api/cameras',
    category: 'Surveillance',
    description: 'Lists all metropolitan ANPR optical sensors, status, and recognition confidence.'
  },
  {
    id: 'traffic',
    name: 'Urban Road Network Telemetry',
    method: 'GET',
    path: '/api/traffic/current',
    category: 'Surveillance',
    description: 'Provides real-time road link velocity, congestion indexes, and vehicle tracking alerts.'
  },
  {
    id: 'candidates',
    name: 'Entity Resolution Candidates',
    method: 'GET',
    path: '/api/entity-resolution/candidates',
    category: 'System',
    description: 'Fuzzy resolution matching suspect names, phone IMEI, and bank accounts for merge review.'
  },
  {
    id: 'copilot',
    name: 'AI Investigation Copilot Query',
    method: 'POST',
    path: '/api/ai/copilot',
    category: 'AI',
    description: 'Submits natural language investigative queries to the controlled AI reasoning engine.',
    defaultBody: {
      query: 'Who is the coordinator connecting the hawala mule accounts to the Dubai syndicate?',
      case_id: 'CASE-2026-0847',
      include_graph_context: true
    }
  }
]

export default function APIEngineView({ onNavigate }: APIEngineViewProps) {
  const [activeTab, setActiveTab] = useState<'console' | 'redoc' | 'architecture'>('console')
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointDef>(ENDPOINTS[0])
  const [categoryFilter, setCategoryFilter] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Request builder state
  const [queryParams, setQueryParams] = useState<Record<string, string>>({})
  const [requestBodyText, setRequestBodyText] = useState<string>('')
  const [requestHeaders, setRequestHeaders] = useState<Record<string, string>>({
    'Authorization': 'Bearer CCPS_INTELLIGENCE_TOKEN_2026',
    'Content-Type': 'application/json'
  })
  const [codeLang, setCodeLang] = useState<'curl' | 'python' | 'ts'>('curl')

  // Response state
  const [isExecuting, setIsExecuting] = useState(false)
  const [responseData, setResponseData] = useState<any>(null)
  const [responseStatus, setResponseStatus] = useState<number | null>(null)
  const [responseStatusText, setResponseStatusText] = useState<string>('')
  const [latencyMs, setLatencyMs] = useState<number | null>(null)
  const [payloadSize, setPayloadSize] = useState<string | null>(null)
  const [hasCopied, setHasCopied] = useState(false)

  // Sync params when selected endpoint changes
  useEffect(() => {
    setQueryParams(selectedEndpoint.defaultParams || {})
    if (selectedEndpoint.defaultBody) {
      setRequestBodyText(JSON.stringify(selectedEndpoint.defaultBody, null, 2))
    } else {
      setRequestBodyText('')
    }
  }, [selectedEndpoint])

  // Filter endpoints
  const filteredEndpoints = ENDPOINTS.filter(ep => {
    const matchesCat = categoryFilter === 'All' || ep.category === categoryFilter
    const matchesSearch = !searchQuery.trim() || 
      ep.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      ep.path.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCat && matchesSearch
  })

  // Execute API Request
  const handleExecute = async () => {
    setIsExecuting(true)
    const startTime = performance.now()
    try {
      let url = selectedEndpoint.path
      const queryKeys = Object.keys(queryParams).filter(k => queryParams[k].trim() !== '')
      if (queryKeys.length > 0) {
        const qs = new URLSearchParams(queryParams).toString()
        url += `?${qs}`
      }

      const options: RequestInit = {
        method: selectedEndpoint.method,
        headers: {
          'Content-Type': 'application/json'
        }
      }

      if (selectedEndpoint.method === 'POST' && requestBodyText.trim()) {
        try {
          JSON.parse(requestBodyText)
          options.body = requestBodyText
        } catch {
          // If invalid JSON, still pass raw
          options.body = requestBodyText
        }
      }

      const res = await fetch(url, options)
      const endTime = performance.now()
      setLatencyMs(Math.round(endTime - startTime))
      setResponseStatus(res.status)
      setResponseStatusText(res.statusText || (res.ok ? 'OK' : 'Error'))

      const text = await res.text()
      setPayloadSize(`${(new Blob([text]).size / 1024).toFixed(2)} KB`)

      try {
        const json = JSON.parse(text)
        setResponseData(json)
      } catch {
        setResponseData(text)
      }
    } catch (err: any) {
      const endTime = performance.now()
      setLatencyMs(Math.round(endTime - startTime))
      setResponseStatus(500)
      setResponseStatusText('Client Network Error')
      setResponseData({ error: err.message || 'Failed to dispatch request' })
      setPayloadSize('0.2 KB')
    } finally {
      setIsExecuting(false)
    }
  }

  // Generate code snippets
  const generateSnippet = () => {
    let fullUrl = `https://crimegraph.gov.in${selectedEndpoint.path}`
    const queryKeys = Object.keys(queryParams).filter(k => queryParams[k].trim() !== '')
    if (queryKeys.length > 0) {
      fullUrl += `?${new URLSearchParams(queryParams).toString()}`
    }

    if (codeLang === 'curl') {
      let cmd = `curl -X ${selectedEndpoint.method} "${fullUrl}" \\\n  -H "Authorization: Bearer CCPS_TOKEN" \\\n  -H "Content-Type: application/json"`
      if (selectedEndpoint.method === 'POST' && requestBodyText.trim()) {
        cmd += ` \\\n  -d '${requestBodyText.replace(/\n/g, '').replace(/\s+/g, ' ')}'`
      }
      return cmd
    }

    if (codeLang === 'python') {
      if (selectedEndpoint.method === 'GET') {
        return `import requests\n\nurl = "${fullUrl}"\nheaders = {\n    "Authorization": "Bearer CCPS_TOKEN"\n}\n\nresponse = requests.get(url, headers=headers)\nprint(response.json())`
      } else {
        return `import requests\n\nurl = "${fullUrl}"\nheaders = {\n    "Authorization": "Bearer CCPS_TOKEN",\n    "Content-Type": "application/json"\n}\npayload = ${requestBodyText || '{}'}\n\nresponse = requests.post(url, json=payload, headers=headers)\nprint(response.json())`
      }
    }

    if (codeLang === 'ts') {
      return `const response = await fetch("${fullUrl}", {\n  method: "${selectedEndpoint.method}",\n  headers: {\n    "Authorization": "Bearer CCPS_TOKEN",\n    "Content-Type": "application/json"\n  }${selectedEndpoint.method === 'POST' && requestBodyText.trim() ? `,\n  body: JSON.stringify(${requestBodyText.trim()})` : ''}\n});\nconst data = await response.json();\nconsole.log(data);`
    }

    return ''
  }

  const handleCopyResponse = () => {
    if (responseData) {
      navigator.clipboard.writeText(typeof responseData === 'string' ? responseData : JSON.stringify(responseData, null, 2))
      setHasCopied(true)
      setTimeout(() => setHasCopied(false), 2000)
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#050811] text-slate-100 font-sans select-none overflow-hidden">
      
      {/* ============================================================ */}
      {/* 1. TOP CONTROL BAR & MODE SWITCHER */}
      {/* ============================================================ */}
      <div className="h-14 border-b border-cyan-900/30 bg-[#070b16] px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-md">
        
        {/* Left: View Identity & Status */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_10px_rgba(0,229,255,0.25)]">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-white font-mono">
                CRIMEGRAPH API ENGINE & EXPLORER
              </h2>
              <span className="hidden md:inline text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-bold">
                v2.1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              High-throughput graph telemetry gateway, neural endpoints & interactive ReDoc specification
            </p>
          </div>
        </div>

        {/* Center: Mode Switcher Tabs */}
        <div className="flex items-center bg-[#03050a] p-1 rounded-xl border border-cyan-900/40">
          <button
            onClick={() => setActiveTab('console')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
              activeTab === 'console'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-400 shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>PLAYGROUND</span>
          </button>

          <button
            onClick={() => setActiveTab('redoc')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
              activeTab === 'redoc'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-400 shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>REDOC DOCS</span>
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
              activeTab === 'architecture'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-400 shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>PIPELINE</span>
          </button>
        </div>

        {/* Right: Quick Links & Actions */}
        <div className="flex items-center gap-2">
          <a
            href="/redoc"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-cyan-300 hover:text-white transition px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/40 hover:border-cyan-400 shadow-sm"
            title="Open standalone ReDoc interactive documentation page"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>FULLSCREEN REDOC</span>
          </a>

          <a
            href="/api/openapi"
            download="crimegraph_openapi_3.1.0.json"
            className="flex items-center gap-1.5 text-xs font-mono text-slate-300 hover:text-white transition px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700/60 hover:border-slate-500"
            title="Download OpenAPI 3.1.0 JSON Schema"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">OAS 3.1</span>
          </a>
        </div>

      </div>

      {/* ============================================================ */}
      {/* 2. MODE: CONSOLE / PLAYGROUND */}
      {/* ============================================================ */}
      {activeTab === 'console' && (
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left Panel: Endpoints Catalog (280px) */}
          <div className="w-full md:w-80 bg-[#060a14] border-r border-cyan-900/30 flex flex-col shrink-0 overflow-hidden">
            
            {/* Search & Filter Header */}
            <div className="p-3 border-b border-cyan-900/30 space-y-2">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter endpoints..."
                  className="w-full h-8 bg-[#020509] border border-cyan-900/50 focus:border-cyan-400 rounded-lg pl-8 pr-3 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none"
                />
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
                {['All', 'Graph', 'Neural', 'Radar', 'Forensic', 'Surveillance', 'AI'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono whitespace-nowrap transition cursor-pointer ${
                      categoryFilter === cat
                        ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/50'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Endpoints List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-slate-800/30">
              {filteredEndpoints.map(ep => {
                const isSelected = selectedEndpoint.id === ep.id
                return (
                  <div
                    key={ep.id}
                    onClick={() => setSelectedEndpoint(ep)}
                    className={`p-2.5 rounded-xl cursor-pointer transition flex flex-col gap-1 border ${
                      isSelected
                        ? 'bg-cyan-950/70 border-cyan-400/80 shadow-[0_0_12px_rgba(0,229,255,0.2)]'
                        : 'border-transparent hover:bg-slate-900/60 hover:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-black tracking-wider ${
                        ep.method === 'GET'
                          ? 'bg-sky-950 text-sky-400 border border-sky-500/40'
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                      }`}>
                        {ep.method}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 uppercase">{ep.category}</span>
                    </div>
                    <div className="text-xs font-bold text-slate-100 font-mono truncate">{ep.name}</div>
                    <div className="text-[11px] font-mono text-cyan-400/80 truncate">{ep.path}</div>
                  </div>
                )
              })}
            </div>

            {/* Bottom Engine Status */}
            <div className="p-3 border-t border-cyan-900/30 bg-[#03050a] flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                GATEWAY: ACTIVE
              </span>
              <span className="text-cyan-400 font-bold">{ENDPOINTS.length} ROUTES</span>
            </div>

          </div>

          {/* Center Column: Request Composer & Runner */}
          <div className="flex-1 flex flex-col bg-[#070b16] border-r border-cyan-900/30 overflow-hidden">
            
            {/* Request Header Bar */}
            <div className="p-4 border-b border-cyan-900/30 bg-[#090f1f]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={`text-xs font-mono px-2 py-1 rounded font-black tracking-wider shrink-0 ${
                  selectedEndpoint.method === 'GET'
                    ? 'bg-sky-950 text-sky-400 border border-sky-500/50'
                    : 'bg-emerald-950 text-emerald-400 border border-emerald-500/50'
                }`}>
                  {selectedEndpoint.method}
                </span>
                <span className="text-sm font-mono font-bold text-cyan-300 truncate">
                  {selectedEndpoint.path}
                </span>
              </div>

              {/* Big Execute Request Button */}
              <button
                onClick={handleExecute}
                disabled={isExecuting}
                className="flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-cyan-950 hover:bg-cyan-900 text-cyan-300 hover:text-white font-mono text-xs font-bold border border-cyan-400 shadow-[0_0_15px_rgba(0,229,255,0.35)] transition cursor-pointer disabled:opacity-50 shrink-0 hover:scale-[1.02]"
              >
                {isExecuting ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                ) : (
                  <Send className="w-4 h-4 text-cyan-400" />
                )}
                <span>{isExecuting ? 'DISPATCHING...' : 'EXECUTE CALL'}</span>
              </button>
            </div>

            {/* Endpoint Description */}
            <div className="px-4 py-2 bg-[#050813] border-b border-cyan-900/20 text-xs text-slate-300">
              {selectedEndpoint.description}
            </div>

            {/* Request Config Panels */}
            <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-4">
              
              {/* 1. Query Parameters */}
              <div className="bg-[#04060d] rounded-xl border border-cyan-900/30 p-3 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-300 pb-1 border-b border-slate-800">
                  <span className="flex items-center gap-1.5 text-cyan-400">
                    <Sliders className="w-3.5 h-3.5" />
                    QUERY PARAMETERS
                  </span>
                  <span className="text-[11px] text-slate-500 font-normal">HTTP GET URL PARAMS</span>
                </div>

                {Object.keys(queryParams).length === 0 ? (
                  <div className="text-xs text-slate-500 font-mono italic py-2">
                    No query parameters required for this endpoint.
                  </div>
                ) : (
                  <div className="space-y-2 pt-1">
                    {Object.entries(queryParams).map(([key, val]) => (
                      <div key={key} className="flex items-center gap-2 font-mono text-xs">
                        <span className="w-28 text-cyan-300 font-bold shrink-0">{key}:</span>
                        <input
                          type="text"
                          value={val}
                          onChange={(e) => setQueryParams({ ...queryParams, [key]: e.target.value })}
                          className="flex-1 h-8 bg-[#090f1f] border border-cyan-900/50 rounded-lg px-2.5 text-slate-200 focus:border-cyan-400 focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. Request Body (JSON) for POST */}
              {selectedEndpoint.method === 'POST' && (
                <div className="bg-[#04060d] rounded-xl border border-cyan-900/30 p-3 space-y-2 flex-1 flex flex-col min-h-[160px]">
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-300 pb-1 border-b border-slate-800">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <Code2 className="w-3.5 h-3.5" />
                      REQUEST BODY (JSON)
                    </span>
                    <button
                      onClick={() => setRequestBodyText(JSON.stringify(selectedEndpoint.defaultBody, null, 2))}
                      className="text-[10px] text-cyan-400 hover:underline cursor-pointer"
                    >
                      Reset Payload
                    </button>
                  </div>
                  <textarea
                    value={requestBodyText}
                    onChange={(e) => setRequestBodyText(e.target.value)}
                    rows={6}
                    className="flex-1 w-full bg-[#020408] border border-slate-800 focus:border-cyan-400 rounded-lg p-3 text-xs font-mono text-emerald-300 placeholder-slate-600 focus:outline-none resize-none leading-relaxed"
                    placeholder="Enter valid JSON payload..."
                  />
                </div>
              )}

              {/* 3. Multi-Language Code Snippet Generator */}
              <div className="bg-[#04060d] rounded-xl border border-cyan-900/30 p-3 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-300 pb-1 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-amber-400" />
                    <span>CLIENT INTEGRATION SNIPPET</span>
                  </div>

                  <div className="flex items-center gap-1 bg-[#020509] p-0.5 rounded-lg border border-slate-800">
                    {(['curl', 'python', 'ts'] as const).map(lang => (
                      <button
                        key={lang}
                        onClick={() => setCodeLang(lang)}
                        className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono transition cursor-pointer ${
                          codeLang === lang
                            ? 'bg-amber-950/80 text-amber-300 font-bold border border-amber-500/50'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative bg-[#020408] border border-slate-800/80 rounded-lg p-3">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generateSnippet())
                      setHasCopied(true)
                      setTimeout(() => setHasCopied(false), 2000)
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-md bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 transition"
                    title="Copy code snippet"
                  >
                    {hasCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <pre className="text-xs font-mono text-amber-200/90 overflow-x-auto pr-8 whitespace-pre-wrap leading-relaxed">
                    {generateSnippet()}
                  </pre>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Live Response Viewer (400px) */}
          <div className="w-full md:w-96 bg-[#04060d] flex flex-col shrink-0 overflow-hidden">
            
            {/* Response Status Bar */}
            <div className="h-14 border-b border-cyan-900/30 px-4 bg-[#060a14] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-300">RESPONSE:</span>
                {responseStatus !== null ? (
                  <span className={`text-xs font-mono px-2 py-0.5 rounded font-bold border ${
                    responseStatus >= 200 && responseStatus < 300
                      ? 'bg-emerald-950/90 text-emerald-400 border-emerald-500/50'
                      : 'bg-red-950/90 text-red-400 border-red-500/50'
                  }`}>
                    {responseStatus} {responseStatusText}
                  </span>
                ) : (
                  <span className="text-xs font-mono text-slate-500">AWAITING TRIGGER</span>
                )}
              </div>

              {/* Latency & Size Tags */}
              <div className="flex items-center gap-2">
                {latencyMs !== null && (
                  <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                    {latencyMs} ms
                  </span>
                )}
                {payloadSize && (
                  <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700/60">
                    {payloadSize}
                  </span>
                )}
              </div>
            </div>

            {/* Action Bar */}
            <div className="px-4 py-2 border-b border-slate-800/80 bg-[#03050a] flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 font-medium">JSON PAYLOAD VIEWER</span>
              <button
                onClick={handleCopyResponse}
                disabled={!responseData}
                className="flex items-center gap-1.5 text-cyan-400 hover:text-white transition disabled:opacity-40 cursor-pointer"
              >
                {hasCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{hasCopied ? 'COPIED' : 'COPY JSON'}</span>
              </button>
            </div>

            {/* JSON Output Viewer */}
            <div className="flex-1 bg-[#020307] p-4 overflow-y-auto font-mono text-xs leading-relaxed text-slate-200">
              {responseData ? (
                <pre className="text-cyan-300 whitespace-pre-wrap word-break">
                  {typeof responseData === 'string'
                    ? responseData
                    : JSON.stringify(responseData, null, 2)}
                </pre>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 select-none">
                  <div className="w-12 h-12 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-center text-slate-600">
                    <Terminal className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-mono font-bold text-slate-400 uppercase">
                      NO ACTIVE PAYLOAD
                    </div>
                    <p className="text-[11px] text-slate-500 max-w-xs">
                      Click "EXECUTE CALL" to query the live API gateway and inspect real-time JSON response telemetry.
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* ============================================================ */}
      {/* 3. MODE: EMBEDDED REDOC DOCUMENTATION */}
      {/* ============================================================ */}
      {activeTab === 'redoc' && (
        <div className="flex-1 flex flex-col relative bg-[#03050A] overflow-hidden">
          
          {/* Subheader with Link to Fullscreen */}
          <div className="h-10 bg-[#050813] border-b border-cyan-900/40 px-4 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              INTERACTIVE REDOC RUNTIME SPECIFICATION (OAS 3.0.3)
            </span>
            <a
              href="/redoc"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-white flex items-center gap-1.5 transition"
            >
              <span>OPEN STANDALONE REDOC</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Embedded ReDoc Frame */}
          <iframe
            src="/redoc"
            title="ReDoc Interactive Documentation"
            allow="clipboard-write"
            className="w-full flex-1 border-0 bg-[#050813]"
          />

        </div>
      )}

      {/* ============================================================ */}
      {/* 4. MODE: ARCHITECTURE & PIPELINE */}
      {/* ============================================================ */}
      {activeTab === 'architecture' && (
        <div className="flex-1 p-6 overflow-y-auto bg-[#04070D] space-y-6">
          
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="border-b border-cyan-900/40 pb-4">
              <h3 className="text-base font-bold font-mono text-white tracking-wider uppercase">
                CRIMEGRAPH AI — DISTRIBUTED ENGINE TOPOLOGY & PIPELINES
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Zero-hallucination graph analysis, PyG neural link prediction, and tamper-proof evidence custody.
              </p>
            </div>

            {/* Architecture Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className="bg-[#080d1a] border border-cyan-900/50 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-cyan-400 font-mono font-bold text-xs">
                  <Zap className="w-4 h-4" />
                  <span>1. EDGE API GATEWAY</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Next.js 16 App Router Route Handlers serving low-latency REST endpoints with automatic OpenAPI 3.1.0 schema compilation.
                </p>
                <div className="text-[11px] font-mono text-cyan-300 bg-cyan-950/60 p-2 rounded border border-cyan-500/30">
                  Proxy Forwarder & Fallback Resiliency
                </div>
              </div>

              <div className="bg-[#080d1a] border border-indigo-900/50 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-indigo-400 font-mono font-bold text-xs">
                  <Network className="w-4 h-4" />
                  <span>2. GRAPH & GNN ENGINE</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  FastAPI backend with NetworkX dual-path routing and PyTorch-Geometric GraphSAGE for counterfactual link prediction.
                </p>
                <div className="text-[11px] font-mono text-indigo-300 bg-indigo-950/60 p-2 rounded border border-indigo-500/30">
                  Louvain Modularity & Betweenness Centrality
                </div>
              </div>

              <div className="bg-[#080d1a] border border-emerald-900/50 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>3. CRYPTOGRAPHIC LEDGER</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  SHA-256 Merkle root verification and blockchain custody anchoring ensuring court admissibility under legal scrutiny.
                </p>
                <div className="text-[11px] font-mono text-emerald-300 bg-emerald-950/60 p-2 rounded border border-emerald-500/30">
                  Immutable Audit Chain & Merkle Receipts
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  )
}

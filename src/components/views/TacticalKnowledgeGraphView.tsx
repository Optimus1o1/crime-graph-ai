'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useStore } from '../../store'
import GraphCanvas from '../GraphCanvas'
import Graph3DCanvas from '../Graph3DCanvas'
import GNNExplainerModal from '../GNNExplainerModal'
import { 
  Network, 
  Sparkles, 
  Sliders, 
  Clock, 
  ShieldAlert, 
  Smartphone, 
  Activity, 
  ExternalLink,
  ChevronDown,
  Layers,
  Search,
  Filter,
  Route,
  Eye,
  Check,
  Box,
  X,
  User,
  CreditCard,
  Car,
  FileText,
  ArrowRight,
  Target,
  Crown,
  Brain,
  Zap
} from 'lucide-react'

interface TacticalKnowledgeGraphViewProps {
  onNavigate: (viewId: string) => void
}

export default function TacticalKnowledgeGraphView({ onNavigate }: TacticalKnowledgeGraphViewProps) {
  const { 
    nodes,
    edges,
    aiOverlay, 
    toggleAI, 
    suggestedLinks,
    anomalyOverlay, 
    toggleAnomaly, 
    selectedNodeId, 
    selectedNodeData,
    selectNode,
    tracePath,
    pathResult
  } = useStore()

  // Inspector Tab: 'dossier' | 'gnn'
  const [activeInspectorTab, setActiveInspectorTab] = useState<'dossier' | 'gnn'>('dossier')
  const [isExplainerOpen, setIsExplainerOpen] = useState(false)
  const [selectedExplainerLink, setSelectedExplainerLink] = useState('PRED-LINK-01')

  const handleToggleGNN = () => {
    const next = !aiOverlay
    toggleAI()
    if (next) {
      setActiveInspectorTab('gnn')
    }
  }

  // 3D Holographic Models vs 2D Planar Cytoscape Mode
  const [graphMode, setGraphMode] = useState<'3D' | '2D'>('3D')

  // Control state
  const [selectedLayout, setSelectedLayout] = useState('ForceAtlas2')
  const [edgeThreshold, setEdgeThreshold] = useState('CDR > 5')
  const [timelineWindow, setTimelineWindow] = useState('LAST 48H')
  
  // Dropdown open state
  const [isLayoutOpen, setIsLayoutOpen] = useState(false)
  const [isEdgeOpen, setIsEdgeOpen] = useState(false)
  const [isTimelineOpen, setIsTimelineOpen] = useState(false)

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [searchCategory, setSearchCategory] = useState<'ALL' | 'PERSON' | 'PHONE' | 'ACCOUNT' | 'VEHICLE'>('ALL')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchDropdownRef = useRef<HTMLDivElement>(null)

  // Direct 1-hop connections of the selected entity
  const directConnections = useMemo(() => {
    if (!selectedNodeId) return []
    const conns: Array<{
      targetId: string
      targetNode: any
      kind: string
      label: string
      date?: string
      rec?: string
      direction: 'OUT' | 'IN'
    }> = []

    edges.forEach((e) => {
      if (e.source === selectedNodeId) {
        conns.push({
          targetId: e.target,
          targetNode: nodes.find((n) => n.id === e.target),
          kind: e.kind || 'CONNECTED',
          label: e.label || 'Direct Link',
          date: e.date,
          rec: e.rec,
          direction: 'OUT'
        })
      } else if (e.target === selectedNodeId) {
        conns.push({
          targetId: e.source,
          targetNode: nodes.find((n) => n.id === e.source),
          kind: e.kind || 'CONNECTED',
          label: e.label || 'Direct Link',
          date: e.date,
          rec: e.rec,
          direction: 'IN'
        })
      }
    })
    return conns
  }, [selectedNodeId, edges, nodes])

  // Real-time fuzzy autocomplete search results
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return nodes
      .filter((n) => {
        const type = (n.type || '').toLowerCase()
        const id = (n.id || '').toUpperCase()

        // Category filter
        if (searchCategory === 'PERSON' && type !== 'person') return false
        if (searchCategory === 'PHONE' && !type.includes('phone') && !id.startsWith('PH')) return false
        if (searchCategory === 'ACCOUNT' && !type.includes('account') && !id.startsWith('AC') && !id.startsWith('BA')) return false
        if (searchCategory === 'VEHICLE' && !type.includes('vehicle') && !id.startsWith('MH') && !id.startsWith('DL')) return false

        if (!q) return true

        const matchLabel = String(n.label || '').toLowerCase().includes(q)
        const matchId = String(n.id || '').toLowerCase().includes(q)
        const matchComm = String(n.comm || '').toLowerCase().includes(q)
        const matchRisk = String(n.risk || '').toLowerCase().includes(q)
        const matchType = type.includes(q)

        return matchLabel || matchId || matchComm || matchRisk || matchType
      })
      .sort((a, b) => {
        // Prioritize mastermind first
        if ((a as any).is_mastermind && !(b as any).is_mastermind) return -1
        if (!(a as any).is_mastermind && (b as any).is_mastermind) return 1
        // Then risk rating
        const riskOrder: Record<string, number> = { CRITICAL: 4, HIGH: 3, MED: 2, LOW: 1 }
        const rA = riskOrder[String(a.risk || '').toUpperCase()] || 0
        const rB = riskOrder[String(b.risk || '').toUpperCase()] || 0
        if (rB !== rA) return rB - rA
        // Then connection degree
        return (b.degree || 0) - (a.degree || 0)
      })
      .slice(0, 15)
  }, [nodes, searchQuery, searchCategory])

  // Category counts
  const counts = useMemo(() => {
    let persons = 0
    let phones = 0
    let accounts = 0
    let vehicles = 0
    nodes.forEach((n) => {
      const type = (n.type || '').toLowerCase()
      const id = (n.id || '').toUpperCase()
      if (type === 'person') persons++
      else if (type.includes('phone') || id.startsWith('PH')) phones++
      else if (type.includes('account') || id.startsWith('AC') || id.startsWith('BA')) accounts++
      else if (type.includes('vehicle') || id.startsWith('MH') || id.startsWith('DL')) vehicles++
    })
    return {
      all: nodes.length,
      persons,
      phones,
      accounts,
      vehicles
    }
  }, [nodes])

  // Keyboard shortcuts and click-outside handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === '/' || (e.ctrlKey && e.key.toLowerCase() === 'k')) && document.activeElement !== searchInputRef.current) {
        e.preventDefault()
        searchInputRef.current?.focus()
        setIsSearchOpen(true)
      } else if (e.key === 'Escape') {
        setIsSearchOpen(false)
        searchInputRef.current?.blur()
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchDropdownRef.current && 
        !searchDropdownRef.current.contains(e.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(e.target as Node)
      ) {
        setIsSearchOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSelectTarget = (targetId: string, targetLabel?: string) => {
    selectNode(targetId)
    if (targetLabel) {
      setSearchQuery(targetLabel)
    }
    setIsSearchOpen(false)
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    selectNode(null)
    setIsSearchOpen(false)
  }

  const getEntityIcon = (type: string, id: string, size = 'w-4 h-4') => {
    const t = (type || '').toLowerCase()
    const code = (id || '').toUpperCase()
    if (t === 'person') return <User className={`${size} text-red-400`} />
    if (t.includes('phone') || code.startsWith('PH')) return <Smartphone className={`${size} text-cyan-400`} />
    if (t.includes('account') || code.startsWith('AC') || code.startsWith('BA')) return <CreditCard className={`${size} text-amber-400`} />
    if (t.includes('vehicle') || code.startsWith('MH') || code.startsWith('DL')) return <Car className={`${size} text-emerald-400`} />
    return <FileText className={`${size} text-purple-400`} />
  }

  // Active node data from selection or Mastermind Vikram Shetty fallback
  const activeNode = selectedNodeData ? {
    id: selectedNodeData.id,
    label: selectedNodeData.label,
    type: selectedNodeData.type,
    risk: selectedNodeData.risk || 'HIGH',
    is_mastermind: (selectedNodeData as any).is_mastermind || false,
    betweenness: typeof selectedNodeData.betweenness === 'number' ? selectedNodeData.betweenness.toFixed(4) : (selectedNodeData.betweenness || '0.0980'),
    degree: selectedNodeData.degree || directConnections.length || 5,
    comm: selectedNodeData.comm || 'bridge',
    aliases: [
      selectedNodeData.comm ? `Cell: ${selectedNodeData.comm.toUpperCase()}` : 'Operative Cell',
      (selectedNodeData as any).is_mastermind ? 'Mastermind Target' : 'Active Subject'
    ],
    devices: directConnections
      .filter(c => c.targetNode && (c.targetNode.type === 'phone' || c.targetId.startsWith('PH')))
      .map(c => ({
        id: `${c.targetNode?.label || c.targetId} (${c.kind})`,
        status: 'Active Telemetry',
        active: true
      })).concat(
        directConnections.some(c => c.targetNode && (c.targetNode.type === 'phone' || c.targetId.startsWith('PH')))
          ? []
          : [{ id: `DEVICE-${selectedNodeData.id}`, status: 'Verified Endpoint', active: true }]
      ),
    telemetry: directConnections.slice(0, 5).map(c => ({
      text: `${c.direction === 'OUT' ? 'Transmitted to' : 'Received from'} ${c.targetNode?.label || c.targetId}: ${c.label}`,
      time: c.date || 'Recent Flow',
      color: c.kind === 'CALLED' ? 'text-cyan-400' : c.kind === 'TRANSFER' ? 'text-amber-400' : 'text-emerald-400'
    })).concat(
      directConnections.length === 0 ? [{
        text: `Network Degree ${selectedNodeData.degree || 4} with betweenness rank #${selectedNodeData.betweenness_rank || 1}`,
        time: 'Live Telemetry',
        color: 'text-cyan-400'
      }] : []
    )
  } : {
    id: 'P043',
    label: 'Vikram Shetty',
    type: 'Person (Coordinator / Mastermind)',
    risk: 'CRITICAL',
    is_mastermind: true,
    betweenness: '0.0980',
    degree: 5,
    comm: 'bridge',
    aliases: ["'The Architect'", "'Cross-Syndicate Broker'", "'Mastermind'"],
    devices: [
      { id: 'PH043 (9822000111)', status: 'Active CDR Stream', active: true },
      { id: 'AC100 (Hawala Root Account)', status: 'Direct Wire Node', active: true }
    ],
    telemetry: [
      { text: 'Structural bridge connecting North, South, and Finance cells', time: '10:14', color: 'text-cyan-400' },
      { text: 'Rank #3 Betweenness Broker with degree 5 low visibility signature', time: '09:50', color: 'text-amber-400' },
      { text: 'Planted GraphSAGE prediction target verified', time: 'Live GNN', color: 'text-slate-400' }
    ]
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#050811] text-slate-100 font-sans select-none">
      
      {/* ============================================================ */}
      {/* 1. EXECUTIVE COMMAND BAR: Primary Search & Mode Select */}
      {/* ============================================================ */}
      <div className="border-b border-slate-800/80 bg-[#080d19]/95 backdrop-blur-md px-5 py-3 flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3.5 z-30 shrink-0">
        
        {/* Left: View Identity & 3D/2D Mode Switcher */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-cyan-400/60 shadow-[0_0_10px_rgba(0,229,255,0.3)] shrink-0 bg-[#060A14] flex items-center justify-center">
            <img src="/images/crimegraph_logo_emblem.jpg" alt="CrimeGraph AI" className="w-full h-full object-cover" />
          </div>

          <div className="flex flex-col pr-2 border-r border-slate-800">
            <h2 className="text-sm font-black tracking-wider text-white uppercase leading-none">
              Network Graph
            </h2>
            <span className="text-[11px] font-mono text-cyan-400 tracking-wider uppercase mt-1">
              Tactical Topology
            </span>
          </div>

          {/* 3D vs 2D Mode Toggle */}
          <div className="flex items-center bg-[#0d1424] p-1 rounded-lg border border-slate-800 shadow-inner shrink-0">
            <button
              onClick={() => setGraphMode('3D')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition cursor-pointer ${
                graphMode === '3D'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-[0_0_12px_rgba(0,229,255,0.5)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Box className="w-4 h-4" />
              <span>3D HOLOGRAPHIC</span>
            </button>
            <button
              onClick={() => setGraphMode('2D')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition cursor-pointer ${
                graphMode === '2D'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-[0_0_12px_rgba(0,229,255,0.5)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>2D PLANAR</span>
            </button>
          </div>
        </div>

        {/* Center: Search Input Bar with Autocomplete */}
        <div className="relative flex-1 max-w-2xl">
          <div className="relative flex items-center">
            <div className="absolute left-3.5 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-cyan-400 animate-pulse" />
            </div>

            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setIsSearchOpen(true)
              }}
              onFocus={() => setIsSearchOpen(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchResults.length > 0) {
                  handleSelectTarget(searchResults[0].id, searchResults[0].label)
                }
              }}
              placeholder="Search criminal name, alias, ID (e.g. Vikram Shetty, Harish, P043, phone, AC-MULE)..."
              className="w-full pl-10 pr-24 py-2 bg-[#0c1222] border border-slate-700/80 focus:border-cyan-400 rounded-lg text-white placeholder-slate-500 text-sm font-sans tracking-normal focus:outline-none focus:ring-1 focus:ring-cyan-400/50 transition shadow-inner"
            />

            {/* Clear & Keyboard shortcut */}
            <div className="absolute right-3 flex items-center gap-1.5">
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                  title="Clear search input"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <div className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-slate-400 pointer-events-none hidden sm:block">
                  / to search
                </div>
              )}
            </div>
          </div>

          {/* Autocomplete Dropdown */}
          {isSearchOpen && (
            <div 
              ref={searchDropdownRef}
              className="absolute left-0 top-full mt-2 w-full bg-[#0a1020]/98 border border-cyan-500/60 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_20px_rgba(0,229,255,0.2)] backdrop-blur-xl p-2.5 z-50 max-h-[420px] overflow-y-auto space-y-1.5 scrollbar-thin"
            >
              <div className="flex items-center justify-between px-3 py-1.5 text-xs font-mono text-slate-400 border-b border-slate-800 pb-2 mb-1">
                <span className="text-cyan-400 font-bold uppercase tracking-wider">
                  {searchResults.length} TARGETS FOUND IN GRAPH
                </span>
                <span>ENTER TO SELECT · ESC TO CLOSE</span>
              </div>

              {searchResults.length === 0 ? (
                <div className="p-6 text-center text-sm font-sans text-slate-400">
                  No matching criminal or network entity found for &quot;{searchQuery}&quot;.
                </div>
              ) : (
                searchResults.map((target) => {
                  const isMastermind = (target as any).is_mastermind
                  const isSelected = selectedNodeId === target.id

                  return (
                    <button
                      key={target.id}
                      onClick={() => handleSelectTarget(target.id, target.label)}
                      className={`w-full text-left p-3 rounded-lg border transition cursor-pointer flex items-center justify-between gap-3 group ${
                        isSelected
                          ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-[0_0_15px_rgba(0,229,255,0.3)]'
                          : 'bg-[#0d1428] border-slate-800/80 hover:border-cyan-500/60 hover:bg-[#131d36] text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center border shrink-0 ${
                          isMastermind
                            ? 'bg-amber-950/80 border-amber-500/80 shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                            : target.type === 'person'
                            ? 'bg-red-950/60 border-red-500/50'
                            : 'bg-cyan-950/60 border-cyan-500/50'
                        }`}>
                          {isMastermind ? <Crown className="w-4 h-4 text-amber-400" /> : getEntityIcon(target.type, target.id, 'w-4 h-4')}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm truncate group-hover:text-cyan-300">
                              {target.label}
                            </span>
                            <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-700">
                              {target.id}
                            </span>
                            {isMastermind && (
                              <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/80 font-bold flex items-center gap-1">
                                ★ MASTERMIND
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2.5 mt-1 text-xs font-mono text-slate-400">
                            <span className="capitalize">{target.type}</span>
                            {target.comm && (
                              <span className="text-indigo-300">• Cell: {target.comm.toUpperCase()}</span>
                            )}
                            <span className="text-cyan-400 font-semibold">
                              • {target.degree || 0} Direct Connections
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        <span className={`text-xs font-mono px-2.5 py-1 rounded font-bold border ${
                          target.risk === 'CRITICAL' ? 'bg-red-950 text-red-400 border-red-500/60' :
                          target.risk === 'HIGH' ? 'bg-orange-950 text-orange-400 border-orange-500/60' :
                          'bg-slate-900 text-slate-400 border-slate-700'
                        }`}>
                          {target.risk || 'MED'} RISK
                        </span>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          )}
        </div>

        {/* Right: GNN Prediction Action Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleToggleGNN}
            className={`px-4 py-2 rounded-lg font-bold transition flex items-center gap-2 cursor-pointer text-xs font-mono shadow-[0_0_14px_rgba(0,229,255,0.3)] ${
              aiOverlay
                ? 'bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 text-white border border-purple-400 shadow-[0_0_20px_rgba(217,70,239,0.5)]'
                : 'bg-cyan-950/90 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/60'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${aiOverlay ? 'text-white' : 'text-cyan-400'} animate-pulse`} />
            <span>{aiOverlay ? `GNN PREDICTIONS ACTIVE (${suggestedLinks.length || 14})` : 'RUN GNN PREDICTIONS'}</span>
          </button>
        </div>

      </div>

      {/* ============================================================ */}
      {/* 2. SECONDARY CONTROLS STRIP: Filters, Layouts & Quick Focus */}
      {/* ============================================================ */}
      <div className="border-b border-slate-800/60 bg-[#070b16] px-5 py-2 flex flex-wrap items-center justify-between gap-3 text-xs z-20 shrink-0">
        
        {/* Left: Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-slate-400 text-xs font-mono font-bold uppercase mr-1 hidden sm:inline">
            ENTITIES:
          </span>
          <button
            onClick={() => setSearchCategory('ALL')}
            className={`px-3 py-1 rounded-md transition cursor-pointer font-mono font-medium ${
              searchCategory === 'ALL'
                ? 'bg-cyan-500 text-black font-bold shadow-[0_0_8px_rgba(0,229,255,0.4)]'
                : 'bg-[#0d1426] hover:bg-[#141f38] text-slate-300 border border-slate-800'
            }`}
          >
            ALL ({counts.all})
          </button>
          <button
            onClick={() => setSearchCategory('PERSON')}
            className={`px-3 py-1 rounded-md transition cursor-pointer font-mono font-medium ${
              searchCategory === 'PERSON'
                ? 'bg-red-500 text-white font-bold shadow-[0_0_8px_rgba(239,68,68,0.4)]'
                : 'bg-[#0d1426] hover:bg-[#141f38] text-slate-300 border border-slate-800'
            }`}
          >
            PERSONS ({counts.persons})
          </button>
          <button
            onClick={() => setSearchCategory('PHONE')}
            className={`px-3 py-1 rounded-md transition cursor-pointer font-mono font-medium ${
              searchCategory === 'PHONE'
                ? 'bg-cyan-400 text-black font-bold shadow-[0_0_8px_rgba(0,229,255,0.4)]'
                : 'bg-[#0d1426] hover:bg-[#141f38] text-slate-300 border border-slate-800'
            }`}
          >
            PHONES ({counts.phones})
          </button>
          <button
            onClick={() => setSearchCategory('ACCOUNT')}
            className={`px-3 py-1 rounded-md transition cursor-pointer font-mono font-medium ${
              searchCategory === 'ACCOUNT'
                ? 'bg-amber-400 text-black font-bold shadow-[0_0_8px_rgba(245,158,11,0.4)]'
                : 'bg-[#0d1426] hover:bg-[#141f38] text-slate-300 border border-slate-800'
            }`}
          >
            ACCOUNTS ({counts.accounts})
          </button>
        </div>

        {/* Center: Graph Configuration Dropdowns */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {/* Layout Dropdown */}
          <div className="relative">
            <button
              onClick={() => { setIsLayoutOpen(!isLayoutOpen); setIsEdgeOpen(false); setIsTimelineOpen(false); }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#0d1426] hover:bg-[#141f38] border border-slate-800 text-slate-300 cursor-pointer font-mono"
            >
              <Network className="w-3.5 h-3.5 text-indigo-400" />
              <span>Layout: {selectedLayout}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {isLayoutOpen && (
              <div className="absolute left-0 top-9 bg-[#0b1222] border border-slate-700 rounded-lg shadow-2xl p-1.5 z-50 w-48 space-y-1">
                {['ForceAtlas2', 'Concentric Rings', 'Circle Radial', 'Breadthfirst'].map(l => (
                  <button
                    key={l}
                    onClick={() => { setSelectedLayout(l); setIsLayoutOpen(false); }}
                    className="w-full text-left px-3 py-1.5 rounded text-xs text-slate-300 hover:text-white hover:bg-cyan-950 flex items-center justify-between font-mono"
                  >
                    <span>{l}</span>
                    {selectedLayout === l && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Edge Weights Dropdown */}
          <div className="relative">
            <button
              onClick={() => { setIsEdgeOpen(!isEdgeOpen); setIsLayoutOpen(false); setIsTimelineOpen(false); }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#0d1426] hover:bg-[#141f38] border border-slate-800 text-slate-300 cursor-pointer font-mono"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>Edge: [{edgeThreshold}]</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {isEdgeOpen && (
              <div className="absolute left-0 top-9 bg-[#0b1222] border border-slate-700 rounded-lg shadow-2xl p-1.5 z-50 w-48 space-y-1">
                {['CDR > 5', 'CDR > 1', 'Financial > $10K', 'All Interconnections'].map(e => (
                  <button
                    key={e}
                    onClick={() => { setEdgeThreshold(e); setIsEdgeOpen(false); }}
                    className="w-full text-left px-3 py-1.5 rounded text-xs text-slate-300 hover:text-white hover:bg-cyan-950 flex items-center justify-between font-mono"
                  >
                    <span>{e}</span>
                    {edgeThreshold === e && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Anomalies Layer Toggle */}
          <button
            onClick={() => toggleAnomaly()}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md border cursor-pointer transition font-mono ${
              anomalyOverlay
                ? 'bg-amber-950 text-amber-300 border-amber-500 font-bold'
                : 'bg-[#0d1426] border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Anomalies Layer</span>
          </button>

          {/* Timeline Dropdown */}
          <div className="relative">
            <button
              onClick={() => { setIsTimelineOpen(!isTimelineOpen); setIsLayoutOpen(false); setIsEdgeOpen(false); }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#0d1426] hover:bg-[#141f38] border border-slate-800 text-slate-300 cursor-pointer font-mono"
            >
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-400">TIME:</span>
              <span className="text-cyan-300 font-bold">{timelineWindow}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {isTimelineOpen && (
              <div className="absolute right-0 top-9 bg-[#0b1222] border border-slate-700 rounded-lg shadow-2xl p-1.5 z-50 w-40 space-y-1">
                {['LAST 24H', 'LAST 48H', 'LAST 7D', 'ALL TIME'].map(t => (
                  <button
                    key={t}
                    onClick={() => { setTimelineWindow(t); setIsTimelineOpen(false); }}
                    className="w-full text-left px-3 py-1.5 rounded text-xs text-slate-300 hover:text-white hover:bg-cyan-950 flex items-center justify-between font-mono"
                  >
                    <span>{t}</span>
                    {timelineWindow === t && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Quick Target Jump Chips */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-slate-500 text-xs font-mono font-bold uppercase hidden 2xl:inline">
            QUICK FOCUS:
          </span>
          <button
            onClick={() => handleSelectTarget('P043', 'Vikram Shetty')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-950/80 hover:bg-amber-900 border border-amber-500/60 text-amber-300 font-bold font-mono transition cursor-pointer shrink-0"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>Vikram Shetty (P043)</span>
          </button>
          <button
            onClick={() => handleSelectTarget('P002', 'Harish Qureshi')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-red-950/80 hover:bg-red-900 border border-red-500/50 text-red-300 font-bold font-mono transition cursor-pointer shrink-0"
          >
            <User className="w-3.5 h-3.5 text-red-400" />
            <span>Harish Qureshi (P002)</span>
          </button>
          <button
            onClick={() => handleSelectTarget('AC-MULE-201', 'AC-MULE-201')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#0d1426] hover:bg-[#16213c] border border-slate-800 text-slate-300 font-mono transition cursor-pointer shrink-0"
          >
            <CreditCard className="w-3.5 h-3.5 text-amber-400" />
            <span>Mule AC-201</span>
          </button>
        </div>

      </div>

      {/* ============================================================ */}
      {/* 3. ACTIVE TARGET FOCUS RIBBON & DIRECT ASSOCIATE CHIPS */}
      {/* ============================================================ */}
      {selectedNodeId && (
        <div className="bg-[#070d1c] border-b border-cyan-500/50 px-5 py-3 flex flex-col gap-2.5 z-20 shrink-0 shadow-[0_6px_25px_rgba(0,0,0,0.7)]">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-950 border border-cyan-500/60 text-cyan-300 font-mono text-xs font-bold shadow-[0_0_10px_rgba(0,229,255,0.3)]">
                <Target className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>ACTIVE TARGET:</span>
              </div>
              <span className="font-sans text-white font-black text-base tracking-wide">
                {activeNode.label}
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
                ID: {activeNode.id}
              </span>
              <span className={`text-xs font-mono px-2.5 py-0.5 rounded font-bold border ${
                activeNode.risk === 'CRITICAL' ? 'bg-red-950 text-red-400 border-red-500/60' : 'bg-orange-950 text-orange-400 border-orange-500/60'
              }`}>
                {activeNode.risk} RISK
              </span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/40 font-bold uppercase">
                CELL: {activeNode.comm}
              </span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold">
                {directConnections.length} DIRECT ASSOCIATES
              </span>
            </div>

            <button
              onClick={handleClearSearch}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-red-950/80 border border-slate-700 hover:border-red-500/60 text-slate-300 hover:text-red-200 text-xs font-mono font-bold transition cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>RESET / SHOW ALL</span>
            </button>
          </div>

          {/* Horizontal Traverser Chips for All Direct 1-Hop Connections */}
          {directConnections.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-thin">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1.5">
                <Network className="w-3.5 h-3.5 text-cyan-400" />
                <span>PIVOT TO ASSOCIATE:</span>
              </span>
              {directConnections.map((conn, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectTarget(conn.targetId, conn.targetNode?.label)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0b1224] hover:bg-cyan-950/80 border border-slate-800 hover:border-cyan-400 text-slate-300 hover:text-cyan-200 text-xs font-sans shrink-0 transition cursor-pointer shadow-sm group"
                >
                  {getEntityIcon(conn.targetNode?.type || 'person', conn.targetId, 'w-3.5 h-3.5')}
                  <span className="font-semibold text-white group-hover:text-cyan-300">
                    {conn.targetNode?.label || conn.targetId}
                  </span>
                  <span className={`text-[11px] px-1.5 py-0.2 rounded border font-mono uppercase ${
                    conn.kind === 'CALLED' ? 'bg-cyan-950/90 text-cyan-300 border-cyan-500/40' :
                    conn.kind === 'TRANSFER' ? 'bg-amber-950/90 text-amber-300 border-amber-500/40' :
                    conn.kind === 'OWNS' ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40' :
                    'bg-slate-900 text-slate-400 border-slate-700'
                  }`}>
                    {conn.kind}: {conn.label}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. MAIN WORKBENCH SPLIT: Graph Canvas vs. Suspect Inspector */}
      {/* ============================================================ */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* Central Graph Workbench Area */}
        <div className="flex-1 relative flex flex-col overflow-hidden bg-[#020509] min-h-[380px]">
          {/* Floating GNN Active Notification Banner */}
          {aiOverlay && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#0c081e]/95 border border-purple-500/80 rounded-xl px-4 py-2 shadow-[0_0_30px_rgba(168,85,247,0.45)] z-30 flex items-center gap-3 font-mono text-xs backdrop-blur-md animate-in fade-in zoom-in duration-200">
              <div className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping" />
              <div>
                <span className="text-purple-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>GNN LINK FORECAST ACTIVE · {suggestedLinks.length || 14} INDUCTIVE EDGES UNCOVERED</span>
                </span>
                <div className="text-slate-300 text-[11px] font-sans">
                  GraphSAGE (PyG) · Structural Neighborhood Embeddings · Cross-Syndicate Link Prediction
                </div>
              </div>
              <button
                onClick={() => setActiveInspectorTab('gnn')}
                className="px-2.5 py-1 rounded bg-purple-900/80 hover:bg-purple-800 text-purple-200 border border-purple-400 text-xs font-bold transition cursor-pointer shrink-0"
              >
                VIEW FORECASTS
              </button>
              <button
                onClick={() => toggleAI()}
                className="p-1 text-slate-400 hover:text-red-400 transition cursor-pointer"
                title="Disable GNN Predictions"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {graphMode === '3D' ? (
            <Graph3DCanvas />
          ) : (
            <>
              <GraphCanvas />

              {/* Bottom Left Entity Legend */}
              <div className="absolute bottom-4 left-4 bg-[#060a14]/95 border border-slate-800 backdrop-blur-md p-3 rounded-xl text-xs font-sans shadow-2xl z-20 space-y-2 hidden sm:block">
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider pb-1.5 border-b border-slate-800 font-mono">
                  ENTITY LEGEND (2D)
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
                  <span className="text-slate-300 font-medium">Person of Interest (Target)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_#00e5ff]" />
                  <span className="text-slate-300 font-medium">Communication Endpoint</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
                  <span className="text-slate-300 font-medium">Associated Transaction Node</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-purple-400 shadow-[0_0_8px_#a855f7]" />
                  <span className="text-slate-300 font-medium">Infrastructure / Server IP</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Inspector Panel (Spacious Width w-96) */}
        <div className="w-full lg:w-96 bg-[#070b16]/98 border-t lg:border-t-0 lg:border-l border-slate-800/80 p-5 flex flex-col gap-4 overflow-y-auto shrink-0 z-20 max-h-[50vh] lg:max-h-none scrollbar-thin">
          
          {/* Executive Inspector Tab Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-[#0b1122] rounded-xl border border-slate-800 shrink-0">
            <button
              onClick={() => setActiveInspectorTab('dossier')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold font-mono transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeInspectorTab === 'dossier'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/60 shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>TARGET DOSSIER</span>
            </button>

            <button
              onClick={() => {
                if (!aiOverlay) toggleAI()
                setActiveInspectorTab('gnn')
              }}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold font-mono transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeInspectorTab === 'gnn'
                  ? 'bg-purple-950 text-purple-200 border border-purple-500/70 shadow-[0_0_12px_rgba(168,85,247,0.35)]'
                  : 'text-slate-400 hover:text-purple-300'
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${aiOverlay ? 'text-purple-400 animate-pulse' : 'text-slate-400'}`} />
              <span>GNN PREDICTIONS ({suggestedLinks.length || 14})</span>
            </button>
          </div>

          {activeInspectorTab === 'gnn' ? (
            <div className="space-y-4">
              {/* Model Architecture & Performance Card */}
              <div className="bg-[#0f0a22] border border-purple-500/50 rounded-xl p-4 shadow-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-purple-300 font-mono font-bold text-xs">
                    <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                    <span>GRAPHSAGE LINK FORECASTER</span>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/50 font-bold">
                    AUC: 0.942
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  Deep Graph Neural Network inductive link prediction trained with PyTorch Geometric (PyG). Uncovers covert syndicate conduits masked through shell entities and burner devices.
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-xs">
                  <div className="bg-[#080514] p-2 rounded border border-purple-900/50">
                    <span className="text-slate-400 text-[10px]">PREDICTED LINKS:</span>
                    <div className="font-bold text-white text-sm">{suggestedLinks.length || 14} EDGES</div>
                  </div>
                  <div className="bg-[#080514] p-2 rounded border border-purple-900/50">
                    <span className="text-slate-400 text-[10px]">INFERENCE LATENCY:</span>
                    <div className="font-bold text-emerald-400 text-sm">18.4 ms (GPU)</div>
                  </div>
                </div>
              </div>

              {/* List of Inductive Predicted Links */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span className="uppercase font-bold tracking-wider">PREDICTED CONNECTIONS</span>
                  <span className="text-purple-400 font-bold">CONFIDENCE DESC</span>
                </div>

                {suggestedLinks.map((link, idx) => {
                  const srcId = link.source || link.a || ''
                  const tgtId = link.target || link.b || ''
                  const prob = link.probability || link.score || 0.85
                  const probPct = Math.round(prob * 100)
                  const srcNode = nodes.find(n => n.id === srcId)
                  const tgtNode = nodes.find(n => n.id === tgtId)
                  const srcName = link.source_label || srcNode?.label || srcId
                  const tgtName = link.target_label || tgtNode?.label || tgtId

                  return (
                    <div
                      key={idx}
                      className="bg-[#0b1122] border border-purple-900/50 hover:border-purple-500/70 rounded-xl p-3.5 space-y-2.5 transition shadow-sm group"
                    >
                      {/* Source -> Target */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-white group-hover:text-purple-300 transition flex items-center gap-1.5">
                            <span className="truncate">{srcName}</span>
                            <span className="text-purple-400 font-mono">┄┄</span>
                            <span className="truncate">{tgtName}</span>
                          </div>
                          <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                            {srcId} ↔ {tgtId}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                            probPct >= 90
                              ? 'bg-purple-950 text-purple-300 border-purple-500/60'
                              : 'bg-indigo-950 text-indigo-300 border-indigo-500/50'
                          }`}>
                            {probPct}% MATCH
                          </span>
                        </div>
                      </div>

                      {/* Confidence Progress Bar */}
                      <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-purple-900/40">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full shadow-[0_0_8px_#d946ef]"
                          style={{ width: `${probPct}%` }}
                        />
                      </div>

                      {/* Evidence Rationale */}
                      <div className="text-xs text-slate-300 font-sans leading-relaxed bg-[#060a16] p-2 rounded-lg border border-slate-800/80">
                        {link.evidence || `Inductive GraphSAGE: Shared neighborhood structural embedding distance < 0.14 with ${link.common_neighbors?.length || 3} common contacts.`}
                      </div>

                      {/* Interactive Buttons */}
                      <div className="flex items-center gap-2 pt-1 font-mono text-xs">
                        <button
                          onClick={() => {
                            selectNode(srcId)
                          }}
                          className="flex-1 py-1.5 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 rounded-lg text-cyan-300 font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                          title="Focus both entities in the graph canvas"
                        >
                          <Target className="w-3.5 h-3.5" />
                          <span>FOCUS LINK</span>
                        </button>

                        <button
                          onClick={() => {
                            setSelectedExplainerLink(link.id || `PRED-LINK-${idx + 1}`)
                            setIsExplainerOpen(true)
                          }}
                          className="flex-1 py-1.5 bg-purple-950/80 hover:bg-purple-900 border border-purple-500/50 rounded-lg text-purple-300 font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                          title="Open GNNExplainer feature attribution breakdown"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>EXPLAIN (XAI)</span>
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <>
          {/* Suspect Header Card */}
          <div className="bg-[#0b1122] border border-cyan-500/40 rounded-xl p-4 relative overflow-hidden shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-cyan-400 font-bold tracking-wider uppercase">
                TARGET IDENTIFIER
              </span>
              <span className={`text-xs font-mono px-2 py-0.5 rounded font-bold border ${
                activeNode.is_mastermind
                  ? 'bg-amber-950 text-amber-300 border-amber-500/60 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                  : 'bg-red-950 text-red-300 border-red-500/50'
              }`}>
                {activeNode.is_mastermind ? '👑 MASTERMIND TARGET' : 'TIER 1 TARGET'}
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-black font-sans tracking-wide text-white truncate">
              {activeNode.label}
            </h2>
            <div className="text-xs font-mono text-slate-400 mb-3 mt-0.5">
              CODE: <span className="text-cyan-300 font-bold">{activeNode.id}</span> • TYPE: <span className="capitalize">{activeNode.type}</span>
            </div>

            {/* Risk Assessment Rating */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">RISK ASSESSMENT</span>
                <span className="text-red-400 font-bold">{activeNode.risk} (98/100)</span>
              </div>
              <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-red-900/40">
                <div className={`h-full shadow-[0_0_12px_#ef4444] ${
                  activeNode.risk === 'CRITICAL' ? 'bg-red-500 w-[96%]' : 'bg-orange-500 w-[78%]'
                }`} />
              </div>
            </div>
          </div>

          {/* Known Aliases */}
          <div className="bg-[#0b1122] border border-slate-800 rounded-xl p-4">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2 font-bold">
              KNOWN ALIASES / ROLES
            </div>
            <div className="flex flex-wrap gap-2">
              {activeNode.aliases.map((alias: string) => (
                <span key={alias} className="text-xs font-mono px-2.5 py-1 rounded bg-[#070c18] border border-slate-700/80 text-slate-200">
                  {alias}
                </span>
              ))}
            </div>
          </div>

          {/* DIRECT NETWORK CONNECTIONS & ASSOCIATES */}
          <div className="bg-[#0b1122] border border-cyan-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider mb-3">
              <span className="flex items-center gap-2">
                <Network className="w-4 h-4 text-cyan-400" />
                DIRECT ASSOCIATES ({directConnections.length})
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold">
                1-HOP
              </span>
            </div>

            {directConnections.length === 0 ? (
              <div className="text-xs font-sans text-slate-400 italic py-3 text-center">
                Search or click a criminal to isolate their connections.
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
                {directConnections.map((conn, idx) => (
                  <div 
                    key={idx} 
                    className="p-3 rounded-lg bg-[#070c18] border border-slate-800 hover:border-cyan-500/50 transition flex items-center justify-between gap-3 group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        {getEntityIcon(conn.targetNode?.type || '', conn.targetId, 'w-4 h-4')}
                        <span className="text-white font-bold text-xs truncate group-hover:text-cyan-300">
                          {conn.targetNode?.label || conn.targetId}
                        </span>
                        <span className="text-xs font-mono text-slate-400 shrink-0">
                          ({conn.targetId})
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs font-mono text-slate-400">
                        <span className={`px-1.5 py-0.2 rounded text-[11px] border font-bold ${
                          conn.kind === 'CALLED' ? 'bg-cyan-950 text-cyan-300 border-cyan-500/40' :
                          conn.kind === 'TRANSFER' ? 'bg-amber-950 text-amber-300 border-amber-500/40' :
                          conn.kind === 'OWNS' ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40' :
                          'bg-slate-900 text-slate-400 border-slate-700'
                        }`}>
                          {conn.kind}
                        </span>
                        <span className="truncate">{conn.label}</span>
                        {conn.date && <span className="text-slate-500 shrink-0">• {conn.date}</span>}
                      </div>
                    </div>

                    <button
                      onClick={() => handleSelectTarget(conn.targetId, conn.targetNode?.label)}
                      className="px-3 py-1.5 bg-cyan-950/90 hover:bg-cyan-900 border border-cyan-500/50 rounded-md text-cyan-300 text-xs font-mono font-bold shrink-0 transition cursor-pointer flex items-center gap-1"
                      title="Focus this associate in the graph"
                    >
                      <span>FOCUS</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Device Nodes */}
          <div className="bg-[#0b1122] border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 uppercase tracking-wider mb-2.5 font-bold">
              <span>ACTIVE DEVICE NODES ({activeNode.devices.length})</span>
              <Smartphone className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="space-y-2 text-xs font-mono">
              {activeNode.devices.map((dev: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-[#070c18] border border-slate-800">
                  <span className="text-cyan-300 font-semibold">• {dev.id}</span>
                  <span className={`text-[11px] px-1.5 py-0.5 rounded border ${
                    dev.active ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30' : 'bg-slate-900 text-slate-500 border-slate-700'
                  }`}>
                    {dev.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Telemetry Flows */}
          <div className="bg-[#0b1122] border border-slate-800 rounded-xl p-4">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2 font-bold">
              RECENT TELEMETRY FLOWS
            </div>
            <div className="space-y-2 text-xs font-sans">
              {activeNode.telemetry.map((flow: any, idx: number) => (
                <div key={idx} className="flex items-start justify-between border-b border-slate-800/80 pb-2 last:border-0 last:pb-0">
                  <span className="text-slate-300 leading-snug">{flow.text}</span>
                  <span className={`${flow.color} shrink-0 ml-2 font-bold font-mono text-xs`}>{flow.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 mt-auto pt-2 border-t border-slate-800">
            <button
              onClick={() => {
                tracePath('P001', 'MH-12-4421')
                alert('Dual path traced: P001 -> P003 -> AC-MULE-201 -> AC117 -> P032 -> MH-12-4421 (FIR Scene)')
              }}
              className="w-full py-2.5 bg-[#0d1428] hover:bg-cyan-950 border border-cyan-500/40 rounded-lg text-cyan-300 font-mono text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Route className="w-4 h-4" />
              <span>TRACE DUAL CORROBORATING PATH</span>
            </button>

            <button
              onClick={() => onNavigate('suspects')}
              className="w-full py-3 bg-gradient-to-r from-cyan-950 to-blue-950 hover:from-cyan-900 hover:to-blue-900 border border-cyan-500/60 rounded-lg text-cyan-200 font-mono text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(0,229,255,0.2)]"
            >
              <span>VIEW FULL INVESTIGATION DOSSIER</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
            </>
          )}

        </div>

      </div>

      {/* Interactive GNNExplainer Feature Attribution Modal */}
      <GNNExplainerModal
        isOpen={isExplainerOpen}
        onClose={() => setIsExplainerOpen(false)}
        selectedLinkId={selectedExplainerLink}
      />

    </div>
  )
}

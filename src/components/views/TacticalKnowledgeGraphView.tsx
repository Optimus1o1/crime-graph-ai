'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useStore } from '../../store'
import GraphCanvas from '../GraphCanvas'
import Graph3DCanvas from '../Graph3DCanvas'
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
  Crown
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
    anomalyOverlay, 
    toggleAnomaly, 
    selectedNodeId, 
    selectedNodeData,
    selectNode,
    tracePath,
    pathResult
  } = useStore()

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

  const getEntityIcon = (type: string, id: string) => {
    const t = (type || '').toLowerCase()
    const code = (id || '').toUpperCase()
    if (t === 'person') return <User className="w-3.5 h-3.5 text-red-400" />
    if (t.includes('phone') || code.startsWith('PH')) return <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
    if (t.includes('account') || code.startsWith('AC') || code.startsWith('BA')) return <CreditCard className="w-3.5 h-3.5 text-amber-400" />
    if (t.includes('vehicle') || code.startsWith('MH') || code.startsWith('DL')) return <Car className="w-3.5 h-3.5 text-emerald-400" />
    return <FileText className="w-3.5 h-3.5 text-purple-400" />
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
      selectedNodeData.comm ? `Syndicate Cell: ${selectedNodeData.comm.toUpperCase()}` : 'Operative Cell',
      (selectedNodeData as any).is_mastermind ? 'High Value Target (Mastermind)' : 'Key Operative'
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
    telemetry: directConnections.slice(0, 4).map(c => ({
      text: `${c.direction === 'OUT' ? 'Transmitted to' : 'Received from'} ${c.targetNode?.label || c.targetId}: ${c.label}`,
      time: c.date || 'Recent Flow',
      color: c.kind === 'CALLED' ? 'text-cyan-400' : c.kind === 'TRANSFER' ? 'text-amber-400' : 'text-emerald-400'
    })).concat(
      directConnections.length === 0 ? [{
        text: `Network Degree ${selectedNodeData.degree || 4} with betweenness rank #${selectedNodeData.betweenness_rank || 1}`,
        time: 'Live',
        color: 'text-cyan-400'
      }] : []
    )
  } : {
    id: 'P043',
    label: 'Vikram Shetty',
    type: 'Person (Suspected Coordinator / Mastermind)',
    risk: 'CRITICAL',
    is_mastermind: true,
    betweenness: '0.0980',
    degree: 5,
    comm: 'bridge',
    aliases: ["'The Architect'", "'Cross-Syndicate Broker'", "'Mastermind'"],
    devices: [
      { id: 'PH043 (9822000111)', status: 'Active CDR', active: true },
      { id: 'AC100 (Hawala Root Account)', status: 'Direct Wire', active: true }
    ],
    telemetry: [
      { text: 'Single structural bridge connecting North, South, and Finance cells', time: '10:14', color: 'text-cyan-400' },
      { text: 'Rank #3 Betweenness Broker with degree 5 low visibility signature', time: '09:50', color: 'text-amber-400' },
      { text: 'Planted GraphSAGE prediction target verified', time: 'Live GNN', color: 'text-slate-400' }
    ]
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#04070D] text-slate-100 font-sans select-none">
      
      {/* ============================================================ */}
      {/* 1. SUB-HEADER CONTROLS STRIP */}
      {/* ============================================================ */}
      <div className="h-10 border-b border-cyan-900/40 px-4 flex items-center justify-between z-20 shrink-0 bg-[#060A12]/90 backdrop-blur-md text-xs font-mono flex-wrap gap-2">
        
        {/* Left: Filter Controls */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <div className="w-6 h-6 rounded overflow-hidden border border-cyan-400 shadow-[0_0_8px_rgba(0,229,255,0.4)] shrink-0 bg-[#060A14] flex items-center justify-center">
            <img src="/images/crimegraph_logo_emblem.jpg" alt="CrimeGraph AI" className="w-full h-full object-cover" />
          </div>

          {/* 3D vs 2D Mode Switcher */}
          <div className="flex items-center bg-[#070d1a] p-0.5 rounded-lg border border-cyan-500/50 shadow-[0_0_12px_rgba(0,229,255,0.2)] shrink-0">
            <button
              onClick={() => setGraphMode('3D')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold transition cursor-pointer ${
                graphMode === '3D'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-[0_0_10px_rgba(0,229,255,0.6)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>3D HOLOGRAPHIC (MODELS)</span>
            </button>
            <button
              onClick={() => setGraphMode('2D')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold transition cursor-pointer ${
                graphMode === '2D'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-[0_0_10px_rgba(0,229,255,0.6)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>2D PLANAR</span>
            </button>
          </div>

          {/* Layout Dropdown */}
          <div className="relative">
            <button
              onClick={() => { setIsLayoutOpen(!isLayoutOpen); setIsEdgeOpen(false); setIsTimelineOpen(false); }}
              className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#0b101c] hover:bg-[#12182c] border border-cyan-500/30 text-slate-300 cursor-pointer"
            >
              <Network className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-[11px]">Layout: {selectedLayout}</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {isLayoutOpen && (
              <div className="absolute left-0 top-8 bg-[#0a101d] border border-cyan-500/50 rounded-lg shadow-xl p-1.5 z-50 w-44 space-y-1">
                {['ForceAtlas2', 'Concentric Rings', 'Circle Radial', 'Breadthfirst'].map(l => (
                  <button
                    key={l}
                    onClick={() => { setSelectedLayout(l); setIsLayoutOpen(false); }}
                    className="w-full text-left px-2 py-1 rounded text-[11px] text-slate-300 hover:text-white hover:bg-cyan-950 flex items-center justify-between"
                  >
                    <span>{l}</span>
                    {selectedLayout === l && <Check className="w-3 h-3 text-cyan-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Edge Weights Dropdown */}
          <div className="relative">
            <button
              onClick={() => { setIsEdgeOpen(!isEdgeOpen); setIsLayoutOpen(false); setIsTimelineOpen(false); }}
              className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#0b101c] hover:bg-[#12182c] border border-cyan-500/30 text-slate-300 cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px]">Edge: [{edgeThreshold}]</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {isEdgeOpen && (
              <div className="absolute left-0 top-8 bg-[#0a101d] border border-cyan-500/50 rounded-lg shadow-xl p-1.5 z-50 w-44 space-y-1">
                {['CDR > 5', 'CDR > 1', 'Financial > $10K', 'All Interconnections'].map(e => (
                  <button
                    key={e}
                    onClick={() => { setEdgeThreshold(e); setIsEdgeOpen(false); }}
                    className="w-full text-left px-2 py-1 rounded text-[11px] text-slate-300 hover:text-white hover:bg-cyan-950 flex items-center justify-between"
                  >
                    <span>{e}</span>
                    {edgeThreshold === e && <Check className="w-3 h-3 text-amber-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Anomalies Layer Toggle */}
          <button
            onClick={() => toggleAnomaly()}
            className={`flex items-center gap-1 px-2 py-1 rounded border cursor-pointer transition ${
              anomalyOverlay
                ? 'bg-amber-950 text-amber-300 border-amber-500 font-bold'
                : 'bg-[#0b101c] border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3 h-3 text-amber-400" />
            <span className="text-[11px]">Anomalies Layer</span>
          </button>
        </div>

        {/* Center/Right: Action Buttons & Timeline */}
        <div className="flex items-center gap-2">
          {/* GNN Prediction Action Button */}
          <button
            onClick={() => toggleAI()}
            className={`px-3 py-1 rounded font-bold transition flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(0,229,255,0.3)] ${
              aiOverlay
                ? 'bg-cyan-400 text-black border border-cyan-300'
                : 'bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>{aiOverlay ? 'GNN PREDICTIONS ON' : 'RUN GNN PREDICTION'}</span>
          </button>

          {/* Timeline Dropdown */}
          <div className="relative">
            <button
              onClick={() => { setIsTimelineOpen(!isTimelineOpen); setIsLayoutOpen(false); setIsEdgeOpen(false); }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0b101c] hover:bg-[#12182c] border border-cyan-500/30 text-slate-300 cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-400 text-[10px]">TIME:</span>
              <span className="text-cyan-300 font-bold">{timelineWindow}</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {isTimelineOpen && (
              <div className="absolute right-0 top-8 bg-[#0a101d] border border-cyan-500/50 rounded-lg shadow-xl p-1.5 z-50 w-36 space-y-1">
                {['LAST 24H', 'LAST 48H', 'LAST 7D', 'ALL TIME'].map(t => (
                  <button
                    key={t}
                    onClick={() => { setTimelineWindow(t); setIsTimelineOpen(false); }}
                    className="w-full text-left px-2 py-1 rounded text-[11px] text-slate-300 hover:text-white hover:bg-cyan-950 flex items-center justify-between"
                  >
                    <span>{t}</span>
                    {timelineWindow === t && <Check className="w-3 h-3 text-cyan-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ============================================================ */}
      {/* 2. DEDICATED CRIMINAL SEARCH & TARGET LOCATOR STRIP */}
      {/* ============================================================ */}
      <div className="border-b border-cyan-900/40 bg-[#060B15]/95 px-4 py-2.5 flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3 z-30 shrink-0">
        
        {/* Search Input Container with Dropdown */}
        <div className="relative flex-1 max-w-2xl">
          <div className="relative flex items-center">
            <div className="absolute left-3 flex items-center pointer-events-none">
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
              className="w-full pl-9 pr-24 py-1.5 bg-[#091122] border border-cyan-500/40 focus:border-cyan-400 rounded-lg text-white placeholder-slate-500 text-xs font-mono tracking-wide focus:outline-none focus:ring-1 focus:ring-cyan-400/50 transition shadow-[0_0_15px_rgba(0,229,255,0.15)]"
            />

            {/* Right Input Badges & Clear */}
            <div className="absolute right-2 flex items-center gap-1.5">
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                  title="Clear search input"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <div className="px-1.5 py-0.5 rounded bg-slate-900/80 border border-slate-700/60 text-[10px] font-mono text-slate-400 pointer-events-none hidden sm:block">
                  / to search
                </div>
              )}
            </div>
          </div>

          {/* Autocomplete Dropdown */}
          {isSearchOpen && (
            <div 
              ref={searchDropdownRef}
              className="absolute left-0 top-full mt-1.5 w-full bg-[#080E1C]/98 border border-cyan-500/60 rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.9),0_0_20px_rgba(0,229,255,0.25)] backdrop-blur-xl p-2 z-50 max-h-[380px] overflow-y-auto space-y-1 scrollbar-thin"
            >
              <div className="flex items-center justify-between px-2 py-1 text-[10px] font-mono text-slate-400 border-b border-slate-800 pb-1.5 mb-1">
                <span className="text-cyan-400 font-bold uppercase tracking-wider">
                  {searchResults.length} MATCHING TARGETS IN NETWORK GRAPH
                </span>
                <span>ENTER TO SELECT FIRST · ESC TO CLOSE</span>
              </div>

              {searchResults.length === 0 ? (
                <div className="p-4 text-center text-xs font-mono text-slate-400">
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
                      className={`w-full text-left p-2 rounded-lg border transition cursor-pointer flex items-center justify-between gap-3 group ${
                        isSelected
                          ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-[0_0_12px_rgba(0,229,255,0.3)]'
                          : 'bg-[#0a1224] border-slate-800 hover:border-cyan-500/60 hover:bg-[#101b36] text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 ${
                          isMastermind
                            ? 'bg-amber-950/80 border-amber-500/80 shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                            : target.type === 'person'
                            ? 'bg-red-950/60 border-red-500/50'
                            : 'bg-cyan-950/60 border-cyan-500/50'
                        }`}>
                          {isMastermind ? <Crown className="w-4 h-4 text-amber-400" /> : getEntityIcon(target.type, target.id)}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white text-xs truncate group-hover:text-cyan-300">
                              {target.label}
                            </span>
                            <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-700">
                              {target.id}
                            </span>
                            {isMastermind && (
                              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-500/80 font-bold flex items-center gap-0.5">
                                ★ MASTERMIND
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 mt-0.5 text-[10px] font-mono text-slate-400">
                            <span className="capitalize">{target.type}</span>
                            {target.comm && (
                              <span className="text-indigo-300">• Cell: {target.comm.toUpperCase()}</span>
                            )}
                            <span className="text-cyan-400 font-semibold">
                              • {target.degree || 0} Connections
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold border ${
                          target.risk === 'CRITICAL' ? 'bg-red-950 text-red-400 border-red-500/60' :
                          target.risk === 'HIGH' ? 'bg-orange-950 text-orange-400 border-orange-500/60' :
                          'bg-slate-900 text-slate-400 border-slate-700'
                        }`}>
                          {target.risk || 'MED'}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono">
          <span className="text-slate-400 text-[10px] uppercase font-bold shrink-0 hidden sm:inline mr-1">FILTER:</span>
          <button
            onClick={() => setSearchCategory('ALL')}
            className={`px-2 py-1 rounded transition cursor-pointer shrink-0 ${
              searchCategory === 'ALL'
                ? 'bg-cyan-500 text-black font-bold shadow-[0_0_8px_rgba(0,229,255,0.5)]'
                : 'bg-[#091122] hover:bg-[#121e38] text-slate-300 border border-slate-800'
            }`}
          >
            ALL ({counts.all})
          </button>
          <button
            onClick={() => setSearchCategory('PERSON')}
            className={`px-2 py-1 rounded transition cursor-pointer shrink-0 ${
              searchCategory === 'PERSON'
                ? 'bg-red-500 text-white font-bold shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                : 'bg-[#091122] hover:bg-[#121e38] text-slate-300 border border-slate-800'
            }`}
          >
            PERSONS ({counts.persons})
          </button>
          <button
            onClick={() => setSearchCategory('PHONE')}
            className={`px-2 py-1 rounded transition cursor-pointer shrink-0 ${
              searchCategory === 'PHONE'
                ? 'bg-cyan-400 text-black font-bold shadow-[0_0_8px_rgba(0,229,255,0.5)]'
                : 'bg-[#091122] hover:bg-[#121e38] text-slate-300 border border-slate-800'
            }`}
          >
            PHONES ({counts.phones})
          </button>
          <button
            onClick={() => setSearchCategory('ACCOUNT')}
            className={`px-2 py-1 rounded transition cursor-pointer shrink-0 ${
              searchCategory === 'ACCOUNT'
                ? 'bg-amber-400 text-black font-bold shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                : 'bg-[#091122] hover:bg-[#121e38] text-slate-300 border border-slate-800'
            }`}
          >
            ACCOUNTS ({counts.accounts})
          </button>
        </div>

        {/* Quick Target Jump Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-[10px] font-mono shrink-0">
          <span className="text-slate-500 text-[9px] uppercase font-bold shrink-0 hidden xl:inline">QUICK FOCUS:</span>
          <button
            onClick={() => handleSelectTarget('P043', 'Vikram Shetty')}
            className="flex items-center gap-1 px-2 py-1 rounded bg-amber-950/70 hover:bg-amber-900 border border-amber-500/60 text-amber-300 font-bold transition cursor-pointer shrink-0"
          >
            <Crown className="w-3 h-3 text-amber-400" />
            <span>VIKRAM SHETTY (P043)</span>
          </button>
          <button
            onClick={() => handleSelectTarget('P002', 'Harish Qureshi')}
            className="flex items-center gap-1 px-2 py-1 rounded bg-red-950/70 hover:bg-red-900 border border-red-500/50 text-red-300 font-bold transition cursor-pointer shrink-0"
          >
            <User className="w-3 h-3 text-red-400" />
            <span>HARISH QURESHI (P002)</span>
          </button>
          <button
            onClick={() => handleSelectTarget('AC-MULE-201', 'AC-MULE-201')}
            className="flex items-center gap-1 px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition cursor-pointer shrink-0"
          >
            <CreditCard className="w-3 h-3 text-amber-400" />
            <span>MULE AC-201</span>
          </button>
        </div>

      </div>

      {/* ============================================================ */}
      {/* 3. ACTIVE TARGET FOCUS RIBBON & DIRECT ASSOCIATE CHIPS */}
      {/* ============================================================ */}
      {selectedNodeId && (
        <div className="bg-[#050A14] border-b border-cyan-500/40 px-4 py-2 flex flex-col gap-1.5 z-20 shrink-0 shadow-[0_4px_15px_rgba(0,0,0,0.6)]">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/60 text-cyan-300 font-mono text-[11px] font-bold">
                <Target className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>TARGET ISOLATION:</span>
              </div>
              <span className="font-mono text-white font-black text-sm tracking-wide">
                {activeNode.label}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900 text-slate-300 border border-slate-700">
                ID: {activeNode.id}
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.2 rounded font-bold border ${
                activeNode.risk === 'CRITICAL' ? 'bg-red-950 text-red-400 border-red-500/60' : 'bg-orange-950 text-orange-400 border-orange-500/60'
              }`}>
                {activeNode.risk} RISK
              </span>
              <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/40 font-bold uppercase">
                CELL: {activeNode.comm}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold">
                {directConnections.length} DIRECT ASSOCIATES
              </span>
            </div>

            <button
              onClick={handleClearSearch}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 hover:bg-red-950/80 border border-slate-700 hover:border-red-500/60 text-slate-300 hover:text-red-200 text-xs font-mono transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>RESET / SHOW ALL</span>
            </button>
          </div>

          {/* Horizontal Traverser Chips for All Direct 1-Hop Connections */}
          {directConnections.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-thin">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
                <Network className="w-3 h-3 text-cyan-400" />
                <span>PIVOT TO ASSOCIATE:</span>
              </span>
              {directConnections.map((conn, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectTarget(conn.targetId, conn.targetNode?.label)}
                  className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#091122] hover:bg-cyan-950/80 border border-cyan-900 hover:border-cyan-400 text-slate-300 hover:text-cyan-200 text-[11px] font-mono shrink-0 transition cursor-pointer shadow-sm group"
                >
                  {getEntityIcon(conn.targetNode?.type || 'person', conn.targetId)}
                  <span className="font-semibold text-white group-hover:text-cyan-300">
                    {conn.targetNode?.label || conn.targetId}
                  </span>
                  <span className={`text-[9px] px-1 rounded border uppercase ${
                    conn.kind === 'CALLED' ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40' :
                    conn.kind === 'TRANSFER' ? 'bg-amber-950/80 text-amber-300 border-amber-500/40' :
                    conn.kind === 'OWNS' ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40' :
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
      {/* 4. MAIN SPLIT: Graph Canvas vs. Suspect Inspector Panel */}
      {/* ============================================================ */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* Central Graph Workbench Area */}
        <div className="flex-1 relative flex flex-col overflow-hidden bg-[#020509] min-h-[350px]">
          {graphMode === '3D' ? (
            <Graph3DCanvas />
          ) : (
            <>
              <GraphCanvas />

              {/* Bottom Left Entity Legend */}
              <div className="absolute bottom-3 left-3 bg-[#060a14]/90 border border-cyan-500/30 backdrop-blur-md p-2.5 rounded-lg text-[10px] font-mono shadow-[0_4px_20px_rgba(0,0,0,0.8)] z-20 space-y-1.5 hidden sm:block">
                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider pb-1 border-b border-slate-800">
                  ENTITY LEGEND (2D)
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_6px_#ef4444]" />
                  <span className="text-slate-300">Person of Interest (Target)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00e5ff]" />
                  <span className="text-slate-300">Communication Endpoint</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]" />
                  <span className="text-slate-300">Associated Transaction Node</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-[0_0_6px_#a855f7]" />
                  <span className="text-slate-300">Infrastructure / Server IP</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Inspector Panel */}
        <div className="w-full lg:w-84 bg-[#060A12]/95 border-t lg:border-t-0 lg:border-l border-cyan-900/40 p-4 flex flex-col gap-3.5 overflow-y-auto shrink-0 z-20 max-h-[50vh] lg:max-h-none">
          
          {/* Suspect Header Card */}
          <div className="bg-[#0b101c] border border-cyan-500/40 rounded-lg p-3 relative overflow-hidden">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-mono text-cyan-400 font-bold tracking-wider">
                TARGET IDENTIFIER
              </span>
              <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold border ${
                activeNode.is_mastermind
                  ? 'bg-amber-950 text-amber-300 border-amber-500/50'
                  : 'bg-red-950 text-red-300 border-red-500/40'
              }`}>
                {activeNode.is_mastermind ? '👑 MASTERMIND TARGET' : 'TIER 1 TARGET'}
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-black font-mono tracking-wide text-white truncate">
              {activeNode.label}
            </h2>
            <div className="text-[10px] font-mono text-slate-400 mb-2">
              CODE: {activeNode.id} • TYPE: {activeNode.type}
            </div>

            {/* Risk Assessment Rating */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-400">RISK ASSESSMENT RATING</span>
                <span className="text-red-400 font-bold">{activeNode.risk}</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-red-900/40">
                <div className={`h-full shadow-[0_0_10px_#ef4444] ${
                  activeNode.risk === 'CRITICAL' ? 'bg-red-500 w-[96%]' : 'bg-orange-500 w-[78%]'
                }`} />
              </div>
            </div>
          </div>

          {/* Known Aliases */}
          <div className="bg-[#0b101c] border border-cyan-900/30 rounded-lg p-3">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">
              KNOWN ALIASES / ROLES
            </div>
            <div className="flex flex-wrap gap-1.5">
              {activeNode.aliases.map((alias: string) => (
                <span key={alias} className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700/60 text-slate-300">
                  {alias}
                </span>
              ))}
            </div>
          </div>

          {/* DIRECT NETWORK CONNECTIONS & ASSOCIATES */}
          <div className="bg-[#0b101c] border border-cyan-500/30 rounded-lg p-3">
            <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider mb-2">
              <span className="flex items-center gap-1.5">
                <Network className="w-3.5 h-3.5" />
                DIRECT ASSOCIATES ({directConnections.length})
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                1-HOP GRAPH
              </span>
            </div>

            {directConnections.length === 0 ? (
              <div className="text-[11px] font-mono text-slate-500 italic py-2 text-center">
                Search or click a criminal to isolate their connections.
              </div>
            ) : (
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {directConnections.map((conn, idx) => (
                  <div 
                    key={idx} 
                    className="p-2 rounded bg-[#060a12] border border-cyan-900/30 hover:border-cyan-500/50 transition flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        {getEntityIcon(conn.targetNode?.type || '', conn.targetId)}
                        <span className="text-white font-bold text-xs truncate">
                          {conn.targetNode?.label || conn.targetId}
                        </span>
                        <span className="text-[9px] font-mono text-slate-400 shrink-0">
                          ({conn.targetId})
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5 text-[10px] font-mono text-slate-400">
                        <span className={`px-1 rounded text-[9px] border ${
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
                      className="px-2 py-1 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 rounded text-cyan-300 text-[10px] font-mono font-bold shrink-0 transition cursor-pointer flex items-center gap-1"
                      title="Focus this associate in the graph"
                    >
                      <span>FOCUS</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Device Nodes */}
          <div className="bg-[#0b101c] border border-cyan-900/30 rounded-lg p-3">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2">
              <span>ACTIVE DEVICE NODES ({activeNode.devices.length})</span>
              <Smartphone className="w-3 h-3 text-cyan-400" />
            </div>
            <div className="space-y-1.5 text-xs font-mono">
              {activeNode.devices.map((dev: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-1.5 rounded bg-[#060a12] border border-cyan-900/40">
                  <span className="text-cyan-300 font-semibold">• {dev.id}</span>
                  <span className={`text-[9px] px-1 rounded border ${
                    dev.active ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30' : 'bg-slate-900 text-slate-500 border-slate-700'
                  }`}>
                    {dev.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Telemetry Flows */}
          <div className="bg-[#0b101c] border border-cyan-900/30 rounded-lg p-3">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">
              RECENT TELEMETRY FLOWS
            </div>
            <div className="space-y-1.5 text-[11px] font-mono">
              {activeNode.telemetry.map((flow: any, idx: number) => (
                <div key={idx} className="flex items-start justify-between border-b border-slate-800/60 pb-1.5 last:border-0 last:pb-0">
                  <span className="text-slate-300 leading-snug">{flow.text}</span>
                  <span className={`${flow.color} shrink-0 ml-2 font-bold text-[10px]`}>{flow.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 mt-auto pt-2 border-t border-cyan-900/30">
            <button
              onClick={() => {
                tracePath('P001', 'MH-12-4421')
                alert('Dual path traced: P001 -> P003 -> AC-MULE-201 -> AC117 -> P032 -> MH-12-4421 (FIR Scene)')
              }}
              className="w-full py-1.5 bg-[#090F1E] hover:bg-cyan-950 border border-cyan-500/40 rounded-lg text-cyan-300 font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Route className="w-3.5 h-3.5" />
              <span>TRACE DUAL CORROBORATING PATH</span>
            </button>

            <button
              onClick={() => onNavigate('suspects')}
              className="w-full py-2 bg-gradient-to-r from-cyan-950 to-blue-950 hover:from-cyan-900 hover:to-blue-900 border border-cyan-500/60 rounded-lg text-cyan-200 font-mono text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_12px_rgba(0,229,255,0.25)]"
            >
              <span>VIEW FULL DOSSIER</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  )
}

'use client'

import React, { useState, useEffect } from 'react'
import { useStore } from '../store'
import { 
  Sparkles, 
  Flame, 
  Crosshair, 
  RotateCcw, 
  Route, 
  ArrowRight, 
  Search, 
  SlidersHorizontal,
  Layers,
  CheckCircle2
} from 'lucide-react'

export default function Toolbar() {
  const {
    aiOverlay, anomalyOverlay, mastermindMode, toggleAI, toggleAnomaly,
    findMastermind, resetView, nodes, edges, tracePath, selectNode, selectedNodeId
  } = useStore()

  const nonCaseNodes = nodes.filter(n => n.type !== 'case')
  const [fromId, setFromId] = useState('')
  const [toId, setToId] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // Set defaults once nodes load
  useEffect(() => {
    if (nonCaseNodes.length > 0 && !fromId) {
      const p1 = nonCaseNodes.find(n => n.id === 'P001' || n.label.includes('Rahul'))
      const p2 = nonCaseNodes.find(n => n.id === 'P003' || n.label.includes('Viktor'))
      setFromId(p1?.id || nonCaseNodes[0]?.id || '')
      setToId(p2?.id || nonCaseNodes[1]?.id || '')
    }
  }, [nonCaseNodes.length])

  const handleSearchSelect = (nodeId: string) => {
    if (nodeId) {
      selectNode(nodeId)
      setSearchQuery('')
    }
  }

  return (
    <div className="h-12 bg-[#090b14]/90 border-b border-purple-900/40 px-4 flex items-center justify-between z-20 shrink-0 font-mono text-xs select-none backdrop-blur-md">
      
      {/* Left Group: Core Interactive Analytics Triggers */}
      <div className="flex items-center gap-2">
        {/* AI Link Prediction Toggle */}
        <button
          onClick={toggleAI}
          title="Toggle GraphSAGE predicted unobserved criminal links"
          className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 transition font-semibold ${
            aiOverlay
              ? 'bg-purple-900/80 text-purple-200 border-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.5)]'
              : 'bg-[#121422] text-slate-300 border-slate-800 hover:border-purple-500/50 hover:text-white'
          }`}
        >
          <Sparkles className={`w-3.5 h-3.5 ${aiOverlay ? 'text-purple-300 animate-pulse' : 'text-purple-400'}`} />
          <span>AI Suggestions</span>
          <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${aiOverlay ? 'bg-purple-700 text-white' : 'bg-slate-800 text-slate-400'}`}>
            {aiOverlay ? 'ACTIVE' : 'OFF'}
          </span>
        </button>

        {/* Anomaly Detection Toggle */}
        <button
          onClick={toggleAnomaly}
          title="Highlight VGAE structuring & circular transaction anomalies"
          className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 transition font-semibold ${
            anomalyOverlay
              ? 'bg-red-950/80 text-red-200 border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.5)]'
              : 'bg-[#121422] text-slate-300 border-slate-800 hover:border-red-500/50 hover:text-white'
          }`}
        >
          <Flame className={`w-3.5 h-3.5 ${anomalyOverlay ? 'text-red-300 animate-pulse' : 'text-red-400'}`} />
          <span>Anomalies</span>
          <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${anomalyOverlay ? 'bg-red-700 text-white' : 'bg-slate-800 text-slate-400'}`}>
            {anomalyOverlay ? 'FLAGGED' : 'OFF'}
          </span>
        </button>

        {/* Mastermind Betweenness Centrality */}
        <button
          onClick={findMastermind}
          title="Identify key network brokers bridging distinct cells (Betweenness Centrality)"
          className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 transition font-semibold ${
            mastermindMode
              ? 'bg-amber-950/80 text-amber-200 border-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
              : 'bg-[#121422] text-slate-300 border-slate-800 hover:border-amber-500/50 hover:text-white'
          }`}
        >
          <Crosshair className={`w-3.5 h-3.5 ${mastermindMode ? 'text-amber-300 animate-spin' : 'text-amber-400'}`} />
          <span>Find Mastermind</span>
        </button>

        {/* Reset View */}
        <button
          onClick={resetView}
          title="Reset graph zoom and clear overlays"
          className="px-2.5 py-1.5 bg-[#121422] hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-800 hover:border-slate-700 transition flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Middle Search & Entity Quick Jump */}
      <div className="flex items-center gap-2">
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
          <select
            value={selectedNodeId || ''}
            onChange={e => handleSearchSelect(e.target.value)}
            className="bg-[#121422] border border-slate-800 hover:border-purple-500/50 focus:border-purple-400 text-slate-200 pl-8 pr-4 py-1.5 rounded-lg outline-none text-xs font-mono transition max-w-[190px] truncate cursor-pointer"
          >
            <option value="">Jump to Entity...</option>
            {nodes.slice(0, 80).map(n => (
              <option key={n.id} value={n.id}>
                {n.label} ({n.type})
              </option>
            ))}
          </select>
        </div>

        {/* Graph Scale Indicator */}
        <div className="px-2.5 py-1 rounded bg-purple-950/40 border border-purple-900/40 text-[10px] text-purple-300 flex items-center gap-1.5 font-bold">
          <Layers className="w-3 h-3 text-purple-400" />
          <span>{nodes.length} NODES</span>
          <span className="text-slate-600">·</span>
          <span>{edges.length} TIES</span>
        </div>
      </div>

      {/* Right Group: Shortest Evidentiary Path Tracer */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-slate-400 font-bold uppercase">Trace:</span>
        <select
          className="bg-[#121422] border border-slate-800 hover:border-purple-500/50 text-slate-200 px-2 py-1.5 rounded-lg text-xs outline-none max-w-[120px] truncate"
          value={fromId}
          onChange={e => setFromId(e.target.value)}
        >
          {nonCaseNodes.slice(0, 40).map(n => (
            <option key={n.id} value={n.id}>{n.label}</option>
          ))}
        </select>

        <ArrowRight className="w-3.5 h-3.5 text-purple-400" />

        <select
          className="bg-[#121422] border border-slate-800 hover:border-purple-500/50 text-slate-200 px-2 py-1.5 rounded-lg text-xs outline-none max-w-[120px] truncate"
          value={toId}
          onChange={e => setToId(e.target.value)}
        >
          {nonCaseNodes.slice(0, 40).map(n => (
            <option key={n.id} value={n.id}>{n.label}</option>
          ))}
        </select>

        <button
          onClick={() => fromId && toId && tracePath(fromId, toId)}
          title="Compute shortest evidentiary path"
          className="px-3 py-1.5 bg-gradient-to-r from-purple-800 to-indigo-700 hover:from-purple-700 hover:to-indigo-600 text-white rounded-lg border border-purple-500/40 shadow-[0_0_10px_rgba(124,58,237,0.3)] transition flex items-center gap-1.5 font-bold"
        >
          <Route className="w-3.5 h-3.5" />
          <span>Trace Path</span>
        </button>
      </div>

    </div>
  )
}

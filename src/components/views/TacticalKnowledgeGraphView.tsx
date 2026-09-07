'use client'

import React, { useState, useEffect } from 'react'
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
  Box
} from 'lucide-react'

interface TacticalKnowledgeGraphViewProps {
  onNavigate: (viewId: string) => void
}

export default function TacticalKnowledgeGraphView({ onNavigate }: TacticalKnowledgeGraphViewProps) {
  const { 
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

  // Mastermind Vikram Shetty fallback or real selected node
  const activeNode = selectedNodeData ? {
    id: selectedNodeData.id,
    label: selectedNodeData.label,
    type: selectedNodeData.type,
    risk: selectedNodeData.risk || '75 / 100',
    betweenness: typeof selectedNodeData.betweenness === 'number' ? selectedNodeData.betweenness.toFixed(4) : (selectedNodeData.betweenness || '0.1240'),
    degree: selectedNodeData.degree || 5,
    aliases: [selectedNodeData.comm ? `Syndicate: ${selectedNodeData.comm.toUpperCase()}` : 'Operative', 'Key Figure'],
    devices: [
      { id: `PH-${selectedNodeData.id}`, status: 'Active Telemetry', active: true },
      { id: 'SIM-CO-LOC-01', status: 'Cell Tower Ping', active: false }
    ],
    telemetry: [
      { text: `Network Degree ${selectedNodeData.degree || 4} with betweenness rank #${selectedNodeData.betweenness_rank || 1}`, time: 'Live', color: 'text-cyan-400' },
      { text: `Coordinated in cluster ${selectedNodeData.comm || 'bridge'}`, time: '12h ago', color: 'text-amber-400' }
    ]
  } : {
    id: 'P043',
    label: 'VIKRAM SHETTY',
    type: 'Person (Suspected Coordinator / Mastermind)',
    risk: '98 / 100',
    betweenness: '0.0980',
    degree: 3,
    aliases: ["'The Architect'", "'Cross-Syndicate Broker'", "'Mastermind'"],
    devices: [
      { id: 'PH043 (9822000111)', status: 'Active CDR', active: true },
      { id: 'CELL-ENC-9901', status: 'Inactive', active: false },
      { id: 'IMEI-88910-210', status: 'Burner', active: true }
    ],
    telemetry: [
      { text: 'Single structural bridge connecting North, South, and Finance cells', time: '10:14', color: 'text-cyan-400' },
      { text: 'Rank #1 Betweenness Broker with degree 3 low visibility signature', time: '09:50', color: 'text-amber-400' },
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
      {/* 2. MAIN SPLIT: Graph Canvas vs. Suspect Inspector Panel */}
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
        <div className="w-full lg:w-80 bg-[#060A12]/95 border-t lg:border-t-0 lg:border-l border-cyan-900/40 p-4 flex flex-col gap-3.5 overflow-y-auto shrink-0 z-20 max-h-[50vh] lg:max-h-none">
          
          {/* Suspect Header Card */}
          <div className="bg-[#0b101c] border border-cyan-500/40 rounded-lg p-3 relative overflow-hidden">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-mono text-cyan-400 font-bold tracking-wider">
                TARGET IDENTIFIER
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/40 font-bold">
                TIER 1 TARGET
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
                <div className="bg-red-500 h-full w-[94%] shadow-[0_0_10px_#ef4444]" />
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

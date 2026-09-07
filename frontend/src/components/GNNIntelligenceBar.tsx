'use client'

import React from 'react'
import { Sparkles, Flame, ShieldAlert, GitBranch, Cpu, Info, Activity, Radio } from 'lucide-react'

interface GNNIntelligenceBarProps {
  showPredictedLinks: boolean
  setShowPredictedLinks: (val: boolean) => void
  showAnomalies: boolean
  setShowAnomalies: (val: boolean) => void
  showInfluenceHalo: boolean
  setShowInfluenceHalo: (val: boolean) => void
  onOpenExplainer: (linkId?: string) => void
}

export default function GNNIntelligenceBar({
  showPredictedLinks,
  setShowPredictedLinks,
  showAnomalies,
  setShowAnomalies,
  showInfluenceHalo,
  setShowInfluenceHalo,
  onOpenExplainer
}: GNNIntelligenceBarProps) {
  return (
    <div className="h-14 bg-[#080912]/95 border-t border-purple-800/50 px-5 flex items-center justify-between z-30 shrink-0 font-mono text-xs select-none backdrop-blur-xl shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
      
      {/* Left: Model Telemetry & Pipeline Status */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-purple-950/70 border border-purple-500/50 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.3)]">
          <Cpu className="w-4 h-4 text-purple-400 animate-pulse" />
          <span className="font-bold tracking-wider text-[11px]">GNN INTELLIGENCE DECK</span>
        </div>
        
        <div className="hidden lg:flex items-center gap-2 text-[10px] text-slate-400 bg-[#101322] border border-purple-900/40 px-2.5 py-1 rounded-lg">
          <span>Model: <strong className="text-purple-300">GraphSAGE v0.3</strong></span>
          <span className="text-slate-600">|</span>
          <span>AUC: <strong className="text-emerald-400">0.892</strong></span>
          <span className="text-slate-600">|</span>
          <span>Precision: <strong className="text-emerald-400">0.841</strong></span>
          <span className="text-slate-600">|</span>
          <span>Inference: <strong className="text-cyan-400">42ms</strong></span>
        </div>
      </div>

      {/* Center: The 4 Core ML Telemetry Toggles (Section 29) */}
      <div className="flex items-center gap-2.5">
        
        {/* 1. Predicted Links */}
        <button
          onClick={() => setShowPredictedLinks(!showPredictedLinks)}
          title="Toggle Inductive GraphSAGE predicted unrecorded ties"
          className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 transition duration-200 cursor-pointer ${
            showPredictedLinks
              ? 'bg-purple-950/90 text-purple-100 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)] scale-[1.02]'
              : 'bg-[#121424] text-slate-300 border-slate-800 hover:border-purple-500/50 hover:text-white'
          }`}
        >
          <div className="relative flex items-center justify-center">
            <Sparkles className={`w-3.5 h-3.5 ${showPredictedLinks ? 'text-purple-300' : 'text-purple-400'}`} />
            {showPredictedLinks && (
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_6px_#a855f7] animate-ping" />
            )}
          </div>
          <span>Predicted Links: <strong className="text-purple-200">14</strong></span>
          <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
            showPredictedLinks ? 'bg-purple-700 text-white' : 'bg-slate-800 text-slate-400'
          }`}>
            {showPredictedLinks ? 'ACTIVE' : 'OFF'}
          </span>
        </button>

        {/* 2. Graph Anomalies */}
        <button
          onClick={() => setShowAnomalies(!showAnomalies)}
          title="Toggle VGAE circular mule chain and burst anomalies"
          className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 transition duration-200 cursor-pointer ${
            showAnomalies
              ? 'bg-red-950/90 text-red-100 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)] scale-[1.02]'
              : 'bg-[#121424] text-slate-300 border-slate-800 hover:border-red-500/50 hover:text-white'
          }`}
        >
          <div className="relative flex items-center justify-center">
            <Flame className={`w-3.5 h-3.5 ${showAnomalies ? 'text-red-300' : 'text-red-400'}`} />
            {showAnomalies && (
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-red-400 shadow-[0_0_6px_#ef4444] animate-ping" />
            )}
          </div>
          <span>Anomalies: <strong className="text-red-200">7</strong></span>
          <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
            showAnomalies ? 'bg-red-700 text-white' : 'bg-slate-800 text-slate-400'
          }`}>
            {showAnomalies ? 'FLAGGED' : 'OFF'}
          </span>
        </button>

        {/* 3. Risk / Influence Scores */}
        <button
          onClick={() => setShowInfluenceHalo(!showInfluenceHalo)}
          title="Toggle high-influence broker node sizing and halos"
          className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 transition duration-200 cursor-pointer ${
            showInfluenceHalo
              ? 'bg-amber-950/90 text-amber-100 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)] scale-[1.02]'
              : 'bg-[#121424] text-slate-300 border-slate-800 hover:border-amber-500/50 hover:text-white'
          }`}
        >
          <div className="relative flex items-center justify-center">
            <ShieldAlert className={`w-3.5 h-3.5 ${showInfluenceHalo ? 'text-amber-300' : 'text-amber-400'}`} />
            {showInfluenceHalo && (
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b] animate-ping" />
            )}
          </div>
          <span>Influence Scores: <strong className="text-amber-200">23</strong></span>
          <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
            showInfluenceHalo ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-400'
          }`}>
            {showInfluenceHalo ? 'HALO ON' : 'OFF'}
          </span>
        </button>

        {/* 4. Network Changes */}
        <div className="bg-[#121424] border border-slate-800 px-3 py-1.5 rounded-xl text-slate-300 flex items-center gap-2">
          <GitBranch className="w-3.5 h-3.5 text-purple-400" />
          <span>Network Changes: <strong className="text-purple-300">4</strong></span>
        </div>

      </div>

      {/* Right: GNNExplainer Trigger */}
      <button
        onClick={() => onOpenExplainer()}
        className="px-3.5 py-1.5 bg-gradient-to-r from-purple-800 to-indigo-700 hover:from-purple-700 hover:to-indigo-600 text-white rounded-xl border border-purple-400/40 flex items-center gap-2 transition shadow-[0_0_15px_rgba(168,85,247,0.4)] cursor-pointer font-bold active:scale-95"
      >
        <Sparkles className="w-3.5 h-3.5 text-purple-200 animate-pulse" />
        <span>GNNExplainer</span>
      </button>

    </div>
  )
}

'use client'

import React, { useState } from 'react'
import Telemetry3DRibbonCanvas from '../Telemetry3DRibbonCanvas'
import { 
  TrendingUp, 
  BarChart3, 
  AlertTriangle, 
  Brain, 
  DownloadCloud, 
  ExternalLink,
  ShieldCheck, 
  Layers, 
  Sparkles,
  DollarSign,
  Scale
} from 'lucide-react'

interface CrimeAnalyticsIntelViewProps {
  onNavigate: (viewId: string) => void
}

export default function CrimeAnalyticsIntelView({ onNavigate }: CrimeAnalyticsIntelViewProps) {
  const [timeRange, setTimeRange] = useState<'24H' | '7D' | '30D' | '90D'>('30D')
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false)
  const [exportFeedback, setExportFeedback] = useState<string>('')

  return (
    <div className="flex-1 flex flex-col p-3.5 gap-3.5 overflow-y-auto bg-[#04070D] text-slate-100 font-sans select-none">
      
      {/* ============================================================ */}
      {/* 1. TOP TIME FILTER & EXPORT BAR */}
      {/* ============================================================ */}
      <div className="flex items-center justify-between border-b border-cyan-900/40 pb-2">
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-cyan-400/80 shadow-[0_0_10px_rgba(0,229,255,0.35)] shrink-0 bg-[#060A14] flex items-center justify-center">
            <img src="/images/crimegraph_logo_emblem.jpg" alt="CrimeGraph Analytics" className="w-full h-full object-cover" />
          </div>
          {(['24H', '7D', '30D', '90D'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded transition ${
                timeRange === range
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/60 font-bold shadow-[0_0_8px_rgba(0,229,255,0.3)]'
                  : 'text-slate-400 hover:text-white bg-slate-900/40 border border-slate-800'
              }`}
            >
              {range}
            </button>
          ))}
          <button 
            onClick={() => setTimeRange('30D')}
            className="px-3 py-1 rounded text-slate-500 hover:text-slate-300 bg-slate-900/40 border border-slate-800 cursor-pointer"
          >
            CUSTOM
          </button>
        </div>

        <button 
          onClick={() => setIsExportModalOpen(true)}
          className="px-3 py-1 rounded bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/60 text-cyan-200 font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(0,229,255,0.2)] hover:scale-105"
        >
          <DownloadCloud className="w-3.5 h-3.5 text-cyan-400" />
          <span>EXPORT REPORTS</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* 2. TOP SPLIT: Incident Trends vs. Top Threat Actors */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 min-h-[260px]">
        
        {/* Left (7 cols): Crime Incident Trends (Overview Model) */}
        <div className="lg:col-span-7 cyber-panel rounded-lg p-3.5 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
              <h3 className="text-xs font-mono font-bold tracking-wider text-white uppercase">
                CRIME INCIDENT TRENDS (OVERVIEW MODEL)
              </h3>
            </div>
            
            {/* Week 3 Anomaly Callout Badge */}
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-950/90 border border-red-500/50 text-[10px] font-mono text-red-300 font-bold animate-pulse">
              <AlertTriangle className="w-3 h-3 text-red-400" />
              <span>WEEK 3 ANOMALY: Cyber Fraud: +41% SPIKE | Financial Flow: $1.2M</span>
            </div>
          </div>

          {/* 3D Volumetric Telemetry Ribbon Mesh Canvas */}
          <div className="flex-1 relative min-h-[160px] bg-[#020509] rounded border border-cyan-900/40 overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
            <Telemetry3DRibbonCanvas />
          </div>

          {/* Graph Legend */}
          <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-800 text-[10px] font-mono text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-1 bg-red-500 inline-block" /> Cyber Fraud (+41%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-1 bg-amber-400 inline-block" /> Financial Volume ($1.2M)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-1 bg-cyan-400 inline-block" /> Comms Correlation
              </span>
            </div>
            <span className="text-cyan-300">W1 → W2 → W3 (PEAK) → W4</span>
          </div>
        </div>

        {/* Right (5 cols): Top Threat Actors (Risk Cognition Ratio) */}
        <div className="lg:col-span-5 cyber-panel rounded-lg p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 mb-2">
            <h3 className="text-xs font-mono font-bold tracking-wider text-white uppercase">
              TOP THREAT ACTORS (RISK COGNITION RATIO)
            </h3>
            <span className="text-[10px] font-mono text-red-400">RANKED</span>
          </div>

          <div className="space-y-2.5 font-mono text-xs">
            {[
              { id: 'S-201 (Sayed Khan)', pct: 94, color: 'bg-red-500', glow: '#ef4444' },
              { id: 'S-109 (Verma)', pct: 89, color: 'bg-red-400', glow: '#f87171' },
              { id: 'S-044 (Tyagi)', pct: 76, color: 'bg-amber-500', glow: '#f59e0b' },
              { id: 'S-127 (Rao)', pct: 62, color: 'bg-cyan-500', glow: '#06b6d4' },
              { id: 'S-312 (Vance)', pct: 48, color: 'bg-slate-400', glow: '#94a3b8' },
            ].map((actor, idx) => (
              <div 
                key={idx}
                onClick={() => onNavigate('suspects')}
                className="cursor-pointer hover:bg-slate-900/40 p-1 rounded transition"
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-slate-200 font-bold">{actor.id}</span>
                  <span className="font-bold text-white">{actor.pct}%</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className={`${actor.color} h-full rounded-full`}
                    style={{ width: `${actor.pct}%`, boxShadow: `0 0 8px ${actor.glow}` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800 text-[9px] font-mono text-slate-500">
            COMPUTED VIA COMBINED BETWEENNESS & EMBEDDING DISTANCE
          </div>
        </div>

      </div>

      {/* ============================================================ */}
      {/* 3. MIDDLE SPLIT: Hotspot Simulation vs. GNN Link Predictions */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 min-h-[220px]">
        
        {/* Left (5 cols): Predictive Hotspot Simulation */}
        <div className="lg:col-span-5 cyber-panel rounded-lg p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 mb-2">
            <h3 className="text-xs font-mono font-bold tracking-wider text-white uppercase">
              PREDICTIVE HOTSPOT SIMULATION
            </h3>
            <span className="text-[10px] font-mono text-cyan-400">NEXT 72H</span>
          </div>

          {/* Zones layout */}
          <div className="grid grid-cols-3 gap-2 my-2 text-center font-mono">
            <div className="bg-red-950/60 border border-red-500/40 p-2 rounded">
              <div className="text-[9px] text-red-400 font-bold">ZONE A: RED_RISK</div>
              <div className="text-lg font-black text-white">88.4%</div>
              <div className="text-[8px] text-slate-400">Chandni Chowk</div>
            </div>
            <div className="bg-amber-950/60 border border-amber-500/40 p-2 rounded">
              <div className="text-[9px] text-amber-400 font-bold">ZONE B: WARNING</div>
              <div className="text-lg font-black text-white">54.2%</div>
              <div className="text-[8px] text-slate-400">Connaught Pl. Gate 4</div>
            </div>
            <div className="bg-emerald-950/60 border border-emerald-500/40 p-2 rounded">
              <div className="text-[9px] text-emerald-400 font-bold">ZONE C: NORMAL</div>
              <div className="text-lg font-black text-white">12.0%</div>
              <div className="text-[8px] text-slate-400">Airport T3 Corridor</div>
            </div>
          </div>

          <div className="text-[10px] font-mono text-slate-400 bg-[#020509] p-2 rounded border border-slate-800">
            Tactical Recommendation: Pre-position intercept units at Junction 4 underpass ahead of 16:00 scheduled cash delivery.
          </div>
        </div>

        {/* Right (7 cols): GNN Neural Relation Predictions Table */}
        <div className="lg:col-span-7 cyber-panel rounded-lg p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 mb-2">
            <div className="flex items-center gap-2">
              <Brain className="w-3.5 h-3.5 text-cyan-400" />
              <h3 className="text-xs font-mono font-bold tracking-wider text-white uppercase">
                GNN NEURAL RELATION PREDICTIONS
              </h3>
            </div>
            <span className="text-[10px] font-mono text-cyan-400">GraphSAGE v2.4</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] text-slate-500">
                  <th className="pb-1.5">SOURCE</th>
                  <th className="pb-1.5">TARGET</th>
                  <th className="pb-1.5">RELATION</th>
                  <th className="pb-1.5">CONF</th>
                  <th className="pb-1.5 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-[11px]">
                <tr>
                  <td className="py-2 text-white font-bold">S-201</td>
                  <td className="py-2 text-cyan-300">S-127</td>
                  <td className="py-2 text-slate-300">Financial Link</td>
                  <td className="py-2 text-emerald-400 font-bold">94.2%</td>
                  <td className="py-2 text-right">
                    <button 
                      onClick={() => onNavigate('network')}
                      className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[9px] hover:bg-cyan-900 cursor-pointer"
                    >
                      INVESTIGATE
                    </button>
                  </td>
                </tr>

                <tr>
                  <td className="py-2 text-white font-bold">S-089</td>
                  <td className="py-2 text-cyan-300">S-312</td>
                  <td className="py-2 text-slate-300">CDR Association</td>
                  <td className="py-2 text-emerald-400 font-bold">81.7%</td>
                  <td className="py-2 text-right">
                    <button 
                      onClick={() => onNavigate('network')}
                      className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[9px] hover:bg-cyan-900 cursor-pointer"
                    >
                      INVESTIGATE
                    </button>
                  </td>
                </tr>

                <tr>
                  <td className="py-2 text-white font-bold">S-109</td>
                  <td className="py-2 text-cyan-300">Node-74</td>
                  <td className="py-2 text-slate-300">Geographic Co-Loc</td>
                  <td className="py-2 text-amber-400 font-bold">76.4%</td>
                  <td className="py-2 text-right">
                    <button 
                      onClick={() => onNavigate('network')}
                      className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[9px] hover:bg-cyan-900 cursor-pointer"
                    >
                      INVESTIGATE
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ============================================================ */}
      {/* 4. BOTTOM 4 KPI CARDS STRIP (Exact from Spec Image) */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
        
        <div className="cyber-panel p-3 rounded-lg border-l-4 border-l-cyan-400">
          <div className="text-[10px] font-mono text-slate-400 uppercase">New Cases Filed</div>
          <div className="text-xl font-bold font-mono text-white mt-1">14 Active</div>
          <div className="text-[9px] font-mono text-cyan-400 mt-0.5">+3 THIS MONTH</div>
        </div>

        <div className="cyber-panel p-3 rounded-lg border-l-4 border-l-red-500">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Networks Disrupted</div>
          <div className="text-xl font-bold font-mono text-white mt-1">3 Corridors</div>
          <div className="text-[9px] font-mono text-red-400 mt-0.5">98.1% DISABILITY RATE</div>
        </div>

        <div className="cyber-panel p-3 rounded-lg border-l-4 border-l-emerald-400">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Assets Seized Value</div>
          <div className="text-xl font-bold font-mono text-white mt-1">$2.4M USD</div>
          <div className="text-[9px] font-mono text-emerald-400 mt-0.5">HAWALA PIPELINE FREEZE</div>
        </div>

        <div className="cyber-panel p-3 rounded-lg border-l-4 border-l-indigo-400">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Conviction Rate %</div>
          <div className="text-xl font-bold font-mono text-white mt-1">92.4% Ready</div>
          <div className="text-[9px] font-mono text-indigo-400 mt-0.5">COURT TRIAL COGNIZANCE</div>
        </div>

      </div>

      {/* ============================================================ */}
      {/* 5. INTELLIGENCE SYNTHESIS & RISK REPORT MODAL */}
      {/* ============================================================ */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#050914] border border-cyan-500/60 rounded-xl w-full max-w-2xl shadow-[0_0_50px_rgba(0,229,255,0.3)] overflow-hidden flex flex-col font-mono max-h-[90vh]">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-950/80 to-blue-950/80 border-b border-cyan-500/40 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden border border-cyan-400 shadow-[0_0_12px_rgba(0,229,255,0.4)] shrink-0 bg-[#060A14] flex items-center justify-center">
                  <img src="/images/crimegraph_logo_emblem.jpg" alt="CrimeGraph Analytics" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wider">
                    CRIME INTEL SYNTHESIS & THREAT DOSSIER
                  </h3>
                  <div className="text-[10px] text-cyan-400 tracking-wider">
                    TIMEFRAME: {timeRange} • COMPILED VIA GRAPHSAGE NEURAL FORECAST
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="w-7 h-7 rounded-md bg-slate-900 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              
              {/* Executive Summary */}
              <div className="bg-[#020509] p-3.5 rounded-lg border border-cyan-900/40 space-y-1.5">
                <span className="text-slate-500 text-[10px] block font-bold uppercase">EXECUTIVE SUMMARY</span>
                <p className="text-slate-200 text-xs font-sans leading-relaxed">
                  During the evaluated {timeRange} window, multi-sensor surveillance identified a <b>+41% surge in Cyber Fraud transactions</b> clustered in Week 3, correlating with <b>$1.2M in clandestine financial settlement</b> through hawala conduits.
                </p>
              </div>

              {/* Threat Actor Rankings Breakdown */}
              <div className="bg-[#020509] p-3.5 rounded-lg border border-cyan-900/40 space-y-2">
                <span className="text-slate-500 text-[10px] block font-bold uppercase">PRIMARY TARGET THREAT INDEX</span>
                <div className="space-y-1.5 font-mono text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold">1. Sayed Khan (S-201)</span>
                    <span className="text-red-400 font-bold">94.0% Risk (Syndicate Kingpin)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold">2. Amit Verma (S-109)</span>
                    <span className="text-red-400 font-bold">89.0% Risk (Financial Operator)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">3. Rahul Tyagi (S-044)</span>
                    <span className="text-amber-400 font-bold">76.0% Risk (Logistics Runner)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">4. Viktor Rao (S-127)</span>
                    <span className="text-cyan-400 font-bold">62.0% Risk (Crypto Conduit)</span>
                  </div>
                </div>
              </div>

              {/* Spatial Forecast */}
              <div className="bg-[#020509] p-3.5 rounded-lg border border-cyan-900/40 space-y-1.5">
                <span className="text-slate-500 text-[10px] block font-bold uppercase">HOTSPOT TACTICAL DIRECTIVE</span>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-300">Zone A: Chandni Chowk Junction 4</span>
                  <span className="text-red-400 font-bold">88.4% Probability Spike</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  Pre-position intercept tactical unit and maintain active ANPR tracking on vehicle DL-4C-AB-1234.
                </div>
              </div>

              {/* Status / Feedback message */}
              {exportFeedback && (
                <div className="p-2.5 rounded bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 text-[11px] font-bold text-center">
                  {exportFeedback}
                </div>
              )}

            </div>

            {/* Footer / Actions */}
            <div className="p-4 bg-[#03060C] border-t border-cyan-900/40 flex items-center justify-between gap-3">
              <span className="text-[10px] text-slate-500">FORMATS: PDF, CSV, JSON</span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const csvContent = `Target,RiskPct,Classification\nSayed Khan,94,Kingpin\nAmit Verma,89,Operator\nRahul Tyagi,76,Logistics\nViktor Rao,62,Crypto Conduit`
                    const blob = new Blob([csvContent], { type: 'text/csv' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `CrimeGraph_Intel_Report_${timeRange}.csv`
                    a.click()
                    setExportFeedback('CSV INTEL DATASET DOWNLOADED')
                    setTimeout(() => setExportFeedback(''), 3000)
                  }}
                  className="px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
                >
                  EXPORT CSV
                </button>

                <button
                  onClick={() => {
                    window.print()
                  }}
                  className="px-4 py-1.5 rounded bg-gradient-to-r from-cyan-950 to-blue-950 hover:from-cyan-900 hover:to-blue-900 border border-cyan-500/60 text-cyan-200 text-xs font-bold shadow-[0_0_12px_rgba(0,229,255,0.3)] transition cursor-pointer flex items-center gap-1.5"
                >
                  <DownloadCloud className="w-3.5 h-3.5 text-cyan-400" />
                  <span>PRINT / SAVE PDF</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

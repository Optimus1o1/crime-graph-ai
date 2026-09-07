'use client'

import React, { useState } from 'react'
import MiniGraph3DCanvas from '../MiniGraph3DCanvas'
import { 
  ShieldAlert, 
  Users, 
  AlertTriangle, 
  Activity, 
  ArrowRight, 
  Video, 
  Radio, 
  Clock, 
  Eye, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react'

interface IntelCoreDashboardViewProps {
  onNavigate: (viewId: string) => void
}

export default function IntelCoreDashboardView({ onNavigate }: IntelCoreDashboardViewProps) {
  const [selectedFeed, setSelectedFeed] = useState<string>('CAM NE-001')

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-5 gap-4 sm:gap-5 overflow-y-auto bg-[#04070D] text-slate-100 font-sans select-none">
      
      {/* ============================================================ */}
      {/* 1. TOP METRICS ROW (4 KPI Tactical Cards) */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Active Cases */}
        <div className="cyber-panel p-4 rounded-xl border-l-4 border-l-cyan-400 relative overflow-hidden group hover:border-cyan-400/60 transition bg-[#080d1a]/80 shadow-lg">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
            <span className="tracking-wider uppercase">Active Investigation Cases</span>
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl sm:text-4xl font-black font-sans tracking-tight text-white">47</div>
            <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 font-bold">
              +3 NEW
            </span>
          </div>
          <div className="w-full bg-slate-800/80 h-1.5 mt-3 rounded-full overflow-hidden">
            <div className="bg-cyan-400 h-full w-[65%] shadow-[0_0_8px_#00e5ff]" />
          </div>
        </div>

        {/* Metric 2: Suspects Under Tracking */}
        <div className="cyber-panel p-4 rounded-xl border-l-4 border-l-indigo-400 relative overflow-hidden group hover:border-indigo-400/60 transition bg-[#080d1a]/80 shadow-lg">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
            <span className="tracking-wider uppercase">Suspects Under Tracking</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl sm:text-4xl font-black font-sans tracking-tight text-white">312</div>
            <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-indigo-950/80 border border-indigo-500/50 text-indigo-300 font-bold">
              38 BLOCKED
            </span>
          </div>
          <div className="w-full bg-slate-800/80 h-1.5 mt-3 rounded-full overflow-hidden">
            <div className="bg-indigo-400 h-full w-[82%] shadow-[0_0_8px_#818cf8]" />
          </div>
        </div>

        {/* Metric 3: System Network Alerts */}
        <div className="cyber-panel p-4 rounded-xl border-l-4 border-l-amber-400 relative overflow-hidden group hover:border-amber-400/60 transition bg-[#080d1a]/80 shadow-lg">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
            <span className="tracking-wider uppercase">System Network Alerts</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl sm:text-4xl font-black font-sans tracking-tight text-white">23</div>
            <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-amber-950/80 border border-amber-500/50 text-amber-300 font-bold">
              4 CRITICAL
            </span>
          </div>
          <div className="w-full bg-slate-800/80 h-1.5 mt-3 rounded-full overflow-hidden">
            <div className="bg-amber-400 h-full w-[45%] shadow-[0_0_8px_#fbbf24]" />
          </div>
        </div>

        {/* Metric 4: Overall Operation Threat Level */}
        <div className="cyber-panel p-4 rounded-xl border-l-4 border-l-red-500 relative overflow-hidden group hover:border-red-500/60 transition bg-red-950/20 shadow-lg">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
            <span className="tracking-wider uppercase">Overall Threat Level</span>
            <Activity className="w-4 h-4 text-red-400 animate-pulse" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl sm:text-4xl font-black font-sans tracking-wider text-red-400 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping inline-block" />
              HIGH
            </div>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-red-950/90 border border-red-500/60 text-red-300 font-bold">
              LEVEL IV
            </span>
          </div>
          <div className="w-full bg-slate-800/80 h-1.5 mt-3 rounded-full overflow-hidden">
            <div className="bg-red-500 h-full w-[94%] shadow-[0_0_8px_#ef4444]" />
          </div>
        </div>

      </div>

      {/* ============================================================ */}
      {/* 2. MIDDLE SPLIT: Graph Preview vs. CCTV Surveillance Feed */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-[340px]">
        
        {/* Left (7 cols): Criminal Network Graph (Active Sub-Set #7) */}
        <div className="lg:col-span-7 cyber-panel rounded-xl p-4 flex flex-col relative overflow-hidden bg-[#080d1a]/80 shadow-lg border border-cyan-900/40">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg overflow-hidden border border-cyan-400/80 shadow-[0_0_8px_rgba(0,229,255,0.4)] shrink-0 bg-[#060A14] flex items-center justify-center">
                <img src="/images/crimegraph_logo_emblem.jpg" alt="CrimeGraph AI" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-sm font-bold tracking-wider text-white uppercase font-sans">
                Criminal Network Graph (Active Sub-Set #7)
              </h3>
            </div>
            <button
              onClick={() => onNavigate('network')}
              className="text-xs font-bold text-cyan-300 hover:text-white transition flex items-center gap-1.5 bg-cyan-950/60 hover:bg-cyan-900/80 px-3 py-1.5 rounded-lg border border-cyan-500/40 cursor-pointer shadow-[0_0_10px_rgba(0,229,255,0.2)]"
            >
              <span>EXPLORE GRAPH</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 3D Holographic Interactive Network Topology Canvas */}
          <div className="flex-1 bg-[#020509] rounded-lg border border-cyan-900/40 relative overflow-hidden min-h-[230px] shadow-[inset_0_0_25px_rgba(0,0,0,0.85)]">
            <MiniGraph3DCanvas 
              onExpand={() => onNavigate('network')}
              onSelectNode={(nodeId) => onNavigate('suspects')}
            />
          </div>

          {/* Legend Strip */}
          <div className="flex flex-wrap items-center justify-between mt-3 pt-2.5 border-t border-cyan-900/30 text-xs font-sans text-slate-300 gap-2">
            <div className="flex items-center gap-5">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-cyan-400 inline-block rounded-full shadow-[0_0_4px_#00e5ff]" /> Communication
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-amber-400 inline-block rounded-full shadow-[0_0_4px_#fbbf24]" /> Financial Flow
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-red-400 inline-block rounded-full shadow-[0_0_4px_#ef4444]" /> Geographic Link
              </span>
            </div>
            <span className="text-cyan-300 font-mono font-bold text-xs bg-cyan-950/60 px-2.5 py-0.5 rounded border border-cyan-500/30">
              112 NODES / 340 EDGES
            </span>
          </div>
        </div>

        {/* Right (5 cols): CCTV Live Surveillance Feed & ANPR */}
        <div className="lg:col-span-5 cyber-panel rounded-xl p-4 flex flex-col relative overflow-hidden bg-[#080d1a]/80 shadow-lg border border-cyan-900/40">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3 mb-3">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_#ef4444]" />
              <h3 className="text-sm font-bold tracking-wider text-white uppercase font-sans">
                CCTV Live ANPR Surveillance Feed
              </h3>
            </div>
            <button
              onClick={() => onNavigate('camera')}
              className="text-xs font-bold text-cyan-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer bg-cyan-950/60 hover:bg-cyan-900/80 px-2.5 py-1 rounded-lg border border-cyan-500/40"
            >
              <span>HUB</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 4 Camera Feeds Grid */}
          <div className="grid grid-cols-2 gap-3 flex-1">
            {[
              { id: 'CAM NE-001', loc: 'Chandni Chowk', plate: 'DL 4C AB 1234', conf: '98.1%', match: true, image: '/images/cctv_suv_tracking.jpg' },
              { id: 'CAM SW-014', loc: 'Industrial Sector C', plate: 'MH 12 PQ 9988', conf: '94.3%', match: true, image: '/images/cctv_suv_tracking.jpg' },
              { id: 'CAM CP-004', loc: 'Connaught Place Gate 4', plate: 'HR 26 XX 8812', conf: '89.2%', match: false, image: '/images/cctv_cam_01.jpg' },
              { id: 'CAM ST-109', loc: 'Old Railway Crossing', plate: 'DL 01 AA 4001', conf: '91.0%', match: false, image: '/images/cctv_cam_01.jpg' },
            ].map(cam => (
              <div
                key={cam.id}
                onClick={() => onNavigate('camera')}
                className={`bg-[#020509] rounded-xl border p-2 flex flex-col justify-between cursor-pointer transition hover:border-cyan-400 hover:scale-[1.01] ${
                  cam.match ? 'border-cyan-500/60 shadow-[0_0_12px_rgba(0,229,255,0.2)]' : 'border-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-200 font-bold">{cam.id}</span>
                  <span className="flex items-center gap-1.5 text-red-400 font-bold">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    LIVE
                  </span>
                </div>

                {/* Simulated Lens Screen */}
                <div className="h-20 bg-[#04070d] rounded-lg my-1.5 relative overflow-hidden flex items-center justify-center border border-slate-800/80">
                  <img 
                    src={cam.image} 
                    alt={cam.loc} 
                    className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none"
                  />
                  <div className="scanline pointer-events-none" />
                  <span className="text-xs text-white font-medium tracking-wide z-10 bg-black/75 px-2 py-0.5 rounded-md backdrop-blur-sm">
                    {cam.loc}
                  </span>
                  {cam.match && (
                    <div className="absolute top-1.5 right-1.5 bg-red-950/95 text-red-300 border border-red-500/70 text-[10px] font-mono px-1.5 py-0.5 rounded z-10 font-bold shadow-md">
                      TARGET MATCH
                    </div>
                  )}
                  {/* Bounding box indicator */}
                  <div className="absolute border border-cyan-400/90 w-9 h-9 rounded z-10" style={{ left: '30%', top: '25%' }}>
                    <span className="text-[8px] font-mono text-cyan-300 absolute -top-3 left-0 font-bold">YOLO-V9</span>
                  </div>
                </div>

                {/* Plate Match Tag */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-mono font-medium truncate">{cam.plate}</span>
                  <span className="text-cyan-300 font-bold font-mono bg-cyan-950/80 px-2 py-0.5 rounded-md border border-cyan-500/40 text-[11px]">
                    {cam.conf}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* ============================================================ */}
      {/* 3. BOTTOM SPLIT: Real-Time Intel Alerts Feed vs. Operations Tracker */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[250px]">
        
        {/* Left (6 cols): Real-Time Intel Alerts Feed */}
        <div className="lg:col-span-6 cyber-panel rounded-xl p-4 flex flex-col bg-[#080d1a]/80 shadow-lg border border-cyan-900/40">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3 mb-3">
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold tracking-wider text-white uppercase font-sans">
                Real-Time Intel Alerts Feed
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400 bg-slate-900/80 px-2.5 py-0.5 rounded border border-slate-700/50">
              STREAMING LIVE (2s)
            </span>
          </div>

          <div className="flex-1 flex flex-col gap-2.5 overflow-y-auto pr-1">
            {[
              {
                time: '14:32:08',
                level: 'CRIT',
                badgeBg: 'bg-red-950/90 text-red-300 border-red-500/60',
                text: 'Suspicious transaction cluster detected in Hawala Network #7 ($80K volume)',
                action: () => onNavigate('analytics'),
              },
              {
                time: '13:58:14',
                level: 'LINK',
                badgeBg: 'bg-cyan-950/90 text-cyan-300 border-cyan-500/60',
                text: 'New burner phone link identified: Node S-127 ↔ S-089 [CDR Match]',
                action: () => onNavigate('network'),
              },
              {
                time: '12:14:50',
                level: 'WARN',
                badgeBg: 'bg-amber-950/90 text-amber-300 border-amber-500/60',
                text: 'Target S-201 spotted at perimeter boundary CAM-CP-004 Connaught Place Gate 4',
                action: () => onNavigate('camera'),
              },
              {
                time: '11:45:02',
                level: 'INFO',
                badgeBg: 'bg-emerald-950/90 text-emerald-300 border-emerald-500/60',
                text: 'Cryptographic case vault re-anchored to Ethereum block #19827402',
                action: () => onNavigate('evidence'),
              },
            ].map((alert, i) => (
              <div
                key={i}
                onClick={alert.action}
                className="bg-[#020509]/90 border border-slate-800/80 hover:border-cyan-500/50 p-2.5 rounded-xl flex items-start gap-3 cursor-pointer transition text-xs group"
              >
                <span className="text-slate-400 text-xs font-mono shrink-0 pt-0.5">{alert.time}</span>
                <span className={`text-xs px-2 py-0.5 rounded-md border shrink-0 font-mono font-bold ${alert.badgeBg}`}>
                  {alert.level}
                </span>
                <span className="text-slate-200 text-xs sm:text-sm leading-snug flex-1 font-sans font-normal">
                  {alert.text}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 shrink-0 self-center transition-transform group-hover:translate-x-1" />
              </div>
            ))}
          </div>
        </div>

        {/* Right (6 cols): Active Intel Operations Tracker Table */}
        <div className="lg:col-span-6 cyber-panel rounded-xl p-4 flex flex-col bg-[#080d1a]/80 shadow-lg border border-cyan-900/40">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3 mb-3">
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold tracking-wider text-white uppercase font-sans">
                Active Intel Operations Tracker
              </h3>
            </div>
            <button
              onClick={() => onNavigate('cases')}
              className="text-xs font-bold text-cyan-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer bg-cyan-950/60 hover:bg-cyan-900/80 px-2.5 py-1 rounded-lg border border-cyan-500/40"
            >
              <span>ALL CASES</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400">
                  <th className="pb-2.5">OP NAME</th>
                  <th className="pb-2.5">STATUS</th>
                  <th className="pb-2.5">LEAD ANALYST</th>
                  <th className="pb-2.5 text-right">UPDATED</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                <tr 
                  onClick={() => onNavigate('cases')}
                  className="hover:bg-cyan-950/30 cursor-pointer transition"
                >
                  <td className="py-2.5 text-cyan-300 font-bold flex items-center gap-2 font-mono">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#00e5ff]" />
                    HAWALA SHELL
                  </td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded-md bg-red-950/80 text-red-300 border border-red-500/40 text-xs font-mono font-bold">
                      STRIKE_PHASE
                    </span>
                  </td>
                  <td className="py-2.5 text-slate-200 font-sans">M. Vance</td>
                  <td className="py-2.5 text-right text-slate-400 text-xs font-mono">4m ago</td>
                </tr>

                <tr 
                  onClick={() => onNavigate('cases')}
                  className="hover:bg-cyan-950/30 cursor-pointer transition"
                >
                  <td className="py-2.5 text-cyan-300 font-bold flex items-center gap-2 font-mono">
                    <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_#fbbf24]" />
                    VIPER CELL
                  </td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded-md bg-amber-950/80 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold">
                      MONITORING
                    </span>
                  </td>
                  <td className="py-2.5 text-slate-200 font-sans">T. Croft</td>
                  <td className="py-2.5 text-right text-slate-400 text-xs font-mono">19m ago</td>
                </tr>

                <tr 
                  onClick={() => onNavigate('cases')}
                  className="hover:bg-cyan-950/30 cursor-pointer transition"
                >
                  <td className="py-2.5 text-cyan-300 font-bold flex items-center gap-2 font-mono">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_6px_#ef4444]" />
                    RED CORRIDOR
                  </td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold">
                      INTERCEPT
                    </span>
                  </td>
                  <td className="py-2.5 text-slate-200 font-sans">A. Kahn</td>
                  <td className="py-2.5 text-right text-emerald-400 font-bold text-xs font-mono">12s ago</td>
                </tr>

                <tr 
                  onClick={() => onNavigate('cases')}
                  className="hover:bg-cyan-950/30 cursor-pointer transition"
                >
                  <td className="py-2.5 text-slate-300 font-semibold flex items-center gap-2 font-mono">
                    <span className="w-2 h-2 rounded-full bg-slate-600" />
                    CYBER-RANSOM
                  </td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded-md bg-slate-900 text-slate-400 border border-slate-700 text-xs font-mono">
                      DISCOVERY
                    </span>
                  </td>
                  <td className="py-2.5 text-slate-200 font-sans">R. Sharma</td>
                  <td className="py-2.5 text-right text-slate-400 text-xs font-mono">1h ago</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  )
}

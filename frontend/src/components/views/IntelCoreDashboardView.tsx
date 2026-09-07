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
    <div className="flex-1 flex flex-col p-3.5 gap-3.5 overflow-y-auto bg-[#04070D] text-slate-100 font-sans select-none">
      
      {/* ============================================================ */}
      {/* 1. TOP METRICS ROW (4 KPI Tactical Cards) */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* Metric 1: Active Cases */}
        <div className="cyber-panel p-3.5 rounded-lg border-l-4 border-l-cyan-400 relative overflow-hidden group hover:border-cyan-400/60 transition">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
            <span className="tracking-wider uppercase">Active Investigation Cases</span>
            <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-bold font-mono tracking-tight text-white">47</div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 font-semibold">
              +3 NEW
            </span>
          </div>
          <div className="w-full bg-slate-900/60 h-1 mt-2.5 rounded-full overflow-hidden">
            <div className="bg-cyan-400 h-full w-[65%] shadow-[0_0_8px_#00e5ff]" />
          </div>
        </div>

        {/* Metric 2: Suspects Under Tracking */}
        <div className="cyber-panel p-3.5 rounded-lg border-l-4 border-l-indigo-400 relative overflow-hidden group hover:border-indigo-400/60 transition">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
            <span className="tracking-wider uppercase">Suspects Under Tracking</span>
            <Users className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-bold font-mono tracking-tight text-white">312</div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-950/70 border border-indigo-500/40 text-indigo-300 font-semibold">
              38 BLOCKED
            </span>
          </div>
          <div className="w-full bg-slate-900/60 h-1 mt-2.5 rounded-full overflow-hidden">
            <div className="bg-indigo-400 h-full w-[82%] shadow-[0_0_8px_#818cf8]" />
          </div>
        </div>

        {/* Metric 3: System Network Alerts */}
        <div className="cyber-panel p-3.5 rounded-lg border-l-4 border-l-amber-400 relative overflow-hidden group hover:border-amber-400/60 transition">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
            <span className="tracking-wider uppercase">System Network Alerts</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-bold font-mono tracking-tight text-white">23</div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950/70 border border-amber-500/40 text-amber-300 font-semibold">
              4 CRITICAL
            </span>
          </div>
          <div className="w-full bg-slate-900/60 h-1 mt-2.5 rounded-full overflow-hidden">
            <div className="bg-amber-400 h-full w-[45%] shadow-[0_0_8px_#fbbf24]" />
          </div>
        </div>

        {/* Metric 4: Overall Operation Threat Level */}
        <div className="cyber-panel p-3.5 rounded-lg border-l-4 border-l-red-500 relative overflow-hidden group hover:border-red-500/60 transition bg-red-950/10">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
            <span className="tracking-wider uppercase">Overall Operation Threat Level</span>
            <Activity className="w-3.5 h-3.5 text-red-400 animate-pulse" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-black font-mono tracking-wider text-red-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
              HIGH
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-950/90 border border-red-500/50 text-red-300 font-bold">
              THREAT LEVEL IV
            </span>
          </div>
          <div className="w-full bg-slate-900/60 h-1 mt-2.5 rounded-full overflow-hidden">
            <div className="bg-red-500 h-full w-[94%] shadow-[0_0_8px_#ef4444]" />
          </div>
        </div>

      </div>

      {/* ============================================================ */}
      {/* 2. MIDDLE SPLIT: Graph Preview vs. CCTV Surveillance Feed */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 flex-1 min-h-[300px]">
        
        {/* Left (7 cols): Criminal Network Graph (Active Sub-Set #7) */}
        <div className="lg:col-span-7 cyber-panel rounded-lg p-3.5 flex flex-col relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 mb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded overflow-hidden border border-cyan-400/80 shadow-[0_0_8px_rgba(0,229,255,0.4)] shrink-0 bg-[#060A14] flex items-center justify-center">
                <img src="/images/crimegraph_logo_emblem.jpg" alt="CrimeGraph AI" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xs font-mono font-bold tracking-wider text-white uppercase">
                Criminal Network Graph (Active Sub-Set #7)
              </h3>
            </div>
            <button
              onClick={() => onNavigate('network')}
              className="text-[10px] font-mono text-cyan-400 hover:text-cyan-200 transition flex items-center gap-1 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/40 cursor-pointer shadow-[0_0_8px_rgba(0,229,255,0.2)]"
            >
              <span>LIVE GRAPH EXPLORER</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* 3D Holographic Interactive Network Topology Canvas */}
          <div className="flex-1 bg-[#020509] rounded border border-cyan-900/40 relative overflow-hidden min-h-[210px] shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
            <MiniGraph3DCanvas 
              onExpand={() => onNavigate('network')}
              onSelectNode={(nodeId) => onNavigate('suspects')}
            />
          </div>

          {/* Legend Strip */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-cyan-900/30 text-[10px] font-mono text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-cyan-400 inline-block" /> Communication
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-amber-400 inline-block" /> Financial Flow
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-red-400 inline-block" /> Geographic Link
              </span>
            </div>
            <span className="text-cyan-300 font-bold">112 NODES / 340 EDGES LOADED</span>
          </div>
        </div>

        {/* Right (5 cols): CCTV Live Surveillance Feed & ANPR */}
        <div className="lg:col-span-5 cyber-panel rounded-lg p-3.5 flex flex-col relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]" />
              <h3 className="text-xs font-mono font-bold tracking-wider text-white uppercase">
                CCTV Live Surveillance Feed & ANPR
              </h3>
            </div>
            <button
              onClick={() => onNavigate('camera')}
              className="text-[10px] font-mono text-cyan-400 hover:text-cyan-200 transition flex items-center gap-1 cursor-pointer"
            >
              <span>HUB</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          {/* 4 Camera Feeds Grid */}
          <div className="grid grid-cols-2 gap-2 flex-1">
            {[
              { id: 'CAM NE-001', loc: 'Chandni Chowk', plate: 'DL 4C AB 1234', conf: '98.1%', match: true, image: '/images/cctv_suv_tracking.jpg' },
              { id: 'CAM SW-014', loc: 'Industrial Sector C', plate: 'MH 12 PQ 9988', conf: '94.3%', match: true, image: '/images/cctv_suv_tracking.jpg' },
              { id: 'CAM CP-004', loc: 'Connaught Place Gate 4', plate: 'HR 26 XX 8812', conf: '89.2%', match: false, image: '/images/cctv_cam_01.jpg' },
              { id: 'CAM ST-109', loc: 'Old Railway Crossing', plate: 'DL 01 AA 4001', conf: '91.0%', match: false, image: '/images/cctv_cam_01.jpg' },
            ].map(cam => (
              <div
                key={cam.id}
                onClick={() => onNavigate('camera')}
                className={`bg-[#020509] rounded border p-1.5 flex flex-col justify-between cursor-pointer transition hover:border-cyan-400 ${
                  cam.match ? 'border-cyan-500/50 shadow-[0_0_10px_rgba(0,229,255,0.15)]' : 'border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between text-[9px] font-mono">
                  <span className="text-slate-300 font-bold">{cam.id}</span>
                  <span className="flex items-center gap-1 text-red-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    LIVE
                  </span>
                </div>

                {/* Simulated Lens Screen */}
                <div className="h-16 bg-[#04070d] rounded my-1 relative overflow-hidden flex items-center justify-center border border-slate-800/80">
                  <img 
                    src={cam.image} 
                    alt={cam.loc} 
                    className="absolute inset-0 w-full h-full object-cover opacity-50 pointer-events-none"
                  />
                  <div className="scanline pointer-events-none" />
                  <span className="text-[10px] text-white/90 font-mono tracking-widest z-10 bg-black/60 px-1 rounded backdrop-blur-xs">
                    {cam.loc}
                  </span>
                  {cam.match && (
                    <div className="absolute top-1 right-1 bg-red-950/90 text-red-300 border border-red-500/60 text-[8px] font-mono px-1 rounded z-10 font-bold">
                      TARGET DETECTED
                    </div>
                  )}
                  {/* Bounding box indicator */}
                  <div className="absolute border border-cyan-400/90 w-8 h-8 rounded z-10" style={{ left: '30%', top: '25%' }}>
                    <span className="text-[7px] font-mono text-cyan-300 absolute -top-2.5 left-0">YOLO</span>
                  </div>
                </div>

                {/* Plate Match Tag */}
                <div className="flex items-center justify-between text-[9px] font-mono">
                  <span className="text-slate-400 truncate">{cam.plate}</span>
                  <span className="text-cyan-400 font-bold bg-cyan-950/70 px-1 rounded border border-cyan-500/30">
                    MATCH [{cam.conf}]
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 min-h-[220px]">
        
        {/* Left (6 cols): Real-Time Intel Alerts Feed */}
        <div className="lg:col-span-6 cyber-panel rounded-lg p-3.5 flex flex-col">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 mb-2">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <h3 className="text-xs font-mono font-bold tracking-wider text-white uppercase">
                Real-Time Intel Alerts Feed
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">STREAMING (2s)</span>
          </div>

          <div className="flex-1 flex flex-col gap-2 overflow-y-auto pr-1">
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
                className="bg-[#020509]/80 border border-slate-800/80 hover:border-cyan-500/50 p-2 rounded flex items-start gap-2.5 cursor-pointer transition text-xs font-mono"
              >
                <span className="text-slate-500 text-[10px] shrink-0 pt-0.5">{alert.time}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded border shrink-0 font-bold ${alert.badgeBg}`}>
                  {alert.level}
                </span>
                <span className="text-slate-300 text-[11px] leading-snug flex-1">
                  {alert.text}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400 shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Right (6 cols): Active Intel Operations Tracker Table */}
        <div className="lg:col-span-6 cyber-panel rounded-lg p-3.5 flex flex-col">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 mb-2">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
              <h3 className="text-xs font-mono font-bold tracking-wider text-white uppercase">
                Active Intel Operations Tracker
              </h3>
            </div>
            <button
              onClick={() => onNavigate('cases')}
              className="text-[10px] font-mono text-cyan-400 hover:text-cyan-200 transition flex items-center gap-1 cursor-pointer"
            >
              <span>ALL CASES</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] text-slate-500">
                  <th className="pb-1.5">OP NAME</th>
                  <th className="pb-1.5">STATUS</th>
                  <th className="pb-1.5">LEAD ANALYST</th>
                  <th className="pb-1.5 text-right">UPDATED</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-[11px]">
                <tr 
                  onClick={() => onNavigate('cases')}
                  className="hover:bg-cyan-950/20 cursor-pointer transition"
                >
                  <td className="py-2 text-cyan-300 font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    HAWALA SHELL
                  </td>
                  <td className="py-2">
                    <span className="px-1.5 py-0.5 rounded bg-red-950/80 text-red-300 border border-red-500/40 text-[9px] font-bold">
                      STRIKE_PHASE
                    </span>
                  </td>
                  <td className="py-2 text-slate-300">M. Vance</td>
                  <td className="py-2 text-right text-slate-500 text-[10px]">4m ago</td>
                </tr>

                <tr 
                  onClick={() => onNavigate('cases')}
                  className="hover:bg-cyan-950/20 cursor-pointer transition"
                >
                  <td className="py-2 text-cyan-300 font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    VIPER CELL
                  </td>
                  <td className="py-2">
                    <span className="px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/40 text-[9px] font-bold">
                      MONITORING
                    </span>
                  </td>
                  <td className="py-2 text-slate-300">T. Croft</td>
                  <td className="py-2 text-right text-slate-500 text-[10px]">19m ago</td>
                </tr>

                <tr 
                  onClick={() => onNavigate('cases')}
                  className="hover:bg-cyan-950/20 cursor-pointer transition"
                >
                  <td className="py-2 text-cyan-300 font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    RED CORRIDOR
                  </td>
                  <td className="py-2">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold">
                      INTERCEPT
                    </span>
                  </td>
                  <td className="py-2 text-slate-300">A. Kahn</td>
                  <td className="py-2 text-right text-emerald-400 font-bold text-[10px]">12s ago</td>
                </tr>

                <tr 
                  onClick={() => onNavigate('cases')}
                  className="hover:bg-cyan-950/20 cursor-pointer transition"
                >
                  <td className="py-2 text-slate-400 font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                    CYBER-RANSOM SYNDICATE
                  </td>
                  <td className="py-2">
                    <span className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-700 text-[9px]">
                      DISCOVERY
                    </span>
                  </td>
                  <td className="py-2 text-slate-300">R. Sharma</td>
                  <td className="py-2 text-right text-slate-500 text-[10px]">1h ago</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  )
}

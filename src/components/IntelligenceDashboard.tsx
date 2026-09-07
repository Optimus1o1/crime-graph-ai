'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import RadarSpokeCanvas, { RadarIncidentItem } from './RadarSpokeCanvas'
import ActivityHistogram, { ActivityHistogramItem } from './ActivityHistogram'
import { 
  ShieldAlert, 
  Users, 
  Activity, 
  CheckCircle2, 
  ChevronDown, 
  Radio, 
  Compass, 
  Flame,
  ArrowUpRight
} from 'lucide-react'

interface IntelligenceDashboardProps {
  onNavigateToGraph: (incident?: RadarIncidentItem) => void
}

export default function IntelligenceDashboard({ onNavigateToGraph }: IntelligenceDashboardProps) {
  const [metrics, setMetrics] = useState({
    recent_investigations: 22,
    total_investigations: 55,
    low_severity: 5,
    medium_severity: 10,
    high_severity: 40,
    exposed_entities: 152,
    exposed_entities_trend_24h: 18,
  })

  const [connectors, setConnectors] = useState([
    { id: 'CONN-01', name: 'YOLOv11 Detector (CAM 1-8)', status: 'ACTIVE' },
    { id: 'CONN-02', name: 'ANPR Plate Recognition Stream', status: 'ACTIVE' },
    { id: 'CONN-03', name: 'PostGIS Geospatial Gateway', status: 'ACTIVE' },
  ])

  const [incidents, setIncidents] = useState<RadarIncidentItem[]>([])
  const [actionItems, setActionItems] = useState<any[]>([])
  const [activityVolume, setActivityVolume] = useState<ActivityHistogramItem[]>([])
  const [timeRange, setTimeRange] = useState<'1d' | '1w' | '1m'>('1m')

  // Fetch live metrics & radar incidents
  useEffect(() => {
    // 1. Metrics
    axios.get('/api/investigations/metrics')
      .then(res => setMetrics(res.data))
      .catch(() => {})

    // 2. Connectors
    axios.get('/api/investigations/connectors')
      .then(res => setConnectors(res.data))
      .catch(() => {})

    // 3. Radar Incidents
    axios.get(`/api/investigations/radar?range=${timeRange}`)
      .then(res => setIncidents(res.data))
      .catch(() => {})

    // 4. Action Items
    axios.get('/api/investigations/actions')
      .then(res => setActionItems(res.data))
      .catch(() => {})

    // 5. Activity Histogram
    axios.get('/api/investigations/activity-volume')
      .then(res => setActivityVolume(res.data))
      .catch(() => {})
  }, [timeRange])

  // Fallback action items matching the uploaded screenshot if API is loading
  const displayActions = actionItems.length > 0 ? actionItems : [
    { id: 'ACT-01', rel: '3', title: 'Adjust Junction B signal green time: 30s -> 40s' },
    { id: 'ACT-02', rel: '2', title: 'Dispatch recovery crane to Marathahalli Underpass' },
    { id: 'ACT-03', rel: '3', title: 'Activate ramp metering on Domlur flyover slip lane' },
    { id: 'ACT-04', rel: '1', title: 'Issue variable message sign (VMS) detour alert' },
    { id: 'ACT-05', rel: '3', title: 'Flag suspect vehicle KA-01-MJ-4040 cross-camera route' },
    { id: 'ACT-06', rel: '2', title: 'Simulate Road A temporary closure outcome in Digital Twin' },
  ]

  return (
    <div className="flex-1 flex flex-col bg-[#07080d] p-3 text-slate-100 overflow-hidden font-sans">
      {/* Outer Cyber HUD Frame with Corner Cutouts */}
      <div className="cyber-hud-container flex-1 flex flex-col overflow-hidden relative">
        {/* Sci-Fi Corner Brackets */}
        <div className="cyber-corner-tl" />
        <div className="cyber-corner-tr" />
        <div className="cyber-corner-bl" />
        <div className="cyber-corner-br" />

        {/* 3-Column Console Layout */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* ============================================================ */}
          {/* LEFT COLUMN: Metrics, Exposed Entities, Connectors, Guide */}
          {/* ============================================================ */}
          <div className="w-64 bg-[#090a12]/70 border-r border-purple-900/30 p-4 flex flex-col gap-4 overflow-y-auto shrink-0 font-sans">
            
            {/* 1. Investigations Metric Card */}
            <div className="bg-[#0e101a] border border-purple-900/40 rounded-lg p-3 shadow-[0_0_12px_rgba(124,58,237,0.1)]">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
                <span>Investigations</span>
                <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
              </div>

              {/* Counters */}
              <div className="flex items-baseline justify-between mb-3">
                <div>
                  <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Recent</div>
                  <div className="text-2xl font-bold font-mono text-slate-100">{metrics.recent_investigations}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Total</div>
                  <div className="text-2xl font-bold font-mono text-slate-100">{metrics.total_investigations}</div>
                </div>
              </div>

              {/* Severity Pills Row */}
              <div className="grid grid-cols-3 gap-1.5 font-mono text-center">
                <div className="bg-[#141624] py-1 px-1.5 rounded border border-slate-700/40 text-[11px]">
                  <div className="text-[9px] text-slate-500">LOW</div>
                  <div className="font-semibold text-slate-300">{metrics.low_severity}</div>
                </div>
                <div className="bg-amber-950/40 py-1 px-1.5 rounded border border-amber-500/30 text-[11px]">
                  <div className="text-[9px] text-amber-500">MEDIUM</div>
                  <div className="font-semibold text-amber-300">{metrics.medium_severity}</div>
                </div>
                <div className="bg-red-950/40 py-1 px-1.5 rounded border border-red-500/40 text-[11px]">
                  <div className="text-[9px] text-red-500">HIGH</div>
                  <div className="font-semibold text-red-400">{metrics.high_severity}</div>
                </div>
              </div>
            </div>

            {/* 2. Exposed Entities Card */}
            <div className="bg-[#0e101a] border border-purple-900/40 rounded-lg p-3">
              <div className="text-xs text-slate-400 font-mono mb-1">Exposed Entities</div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold font-mono text-slate-100">{metrics.exposed_entities}</span>
                <span className="text-[10px] font-mono text-emerald-400 font-medium">
                  +{metrics.exposed_entities_trend_24h} in last 24 hours
                </span>
              </div>
            </div>

            {/* 3. Connectors Card */}
            <div className="bg-[#0e101a] border border-purple-900/40 rounded-lg p-3">
              <div className="text-xs text-slate-400 font-mono mb-2">Connectors</div>
              <div className="space-y-2 text-xs font-mono">
                {connectors.map(c => (
                  <div key={c.id} className="flex items-center justify-between text-slate-300">
                    <span className="truncate pr-2">{c.name}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase bg-emerald-950/60 text-emerald-400 border border-emerald-500/40 shrink-0">
                      ACTIVE
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Guide / Mini-Radar Widget (Exact replica from screenshot) */}
            <div className="bg-[#0e101a] border border-purple-900/40 rounded-lg p-3 flex flex-col items-center relative overflow-hidden">
              <div className="w-full flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
                <span>Guide</span>
                <Compass className="w-3.5 h-3.5 text-purple-400" />
              </div>

              {/* Mini Polar Diagram */}
              <div className="relative w-28 h-28 my-1 flex items-center justify-center">
                <svg width="112" height="112">
                  <circle cx="56" cy="56" r="48" fill="none" stroke="rgba(124, 58, 237, 0.25)" strokeDasharray="2, 4" />
                  <circle cx="56" cy="56" r="30" fill="none" stroke="rgba(124, 58, 237, 0.2)" />
                  <line x1="56" y1="8" x2="56" y2="104" stroke="rgba(124, 58, 237, 0.2)" />
                  <line x1="8" y1="56" x2="104" y2="56" stroke="rgba(124, 58, 237, 0.2)" />
                  {/* Highlight Sector */}
                  <path d="M56 56 L88 24 A48 48 0 0 1 104 56 Z" fill="rgba(168, 85, 247, 0.18)" />
                  {/* Mini Blip */}
                  <circle cx="75" cy="40" r="3.5" fill="#f8fafc" style={{ filter: 'drop-shadow(0 0 5px #fff)' }} />
                </svg>

                {/* Callout Tag: "Each day of Month" */}
                <div className="absolute top-1 right-1 text-[8px] font-mono text-purple-300">
                  Each day of Month
                </div>

                {/* Callout Button: "Investigate" */}
                <button 
                  onClick={() => onNavigateToGraph()}
                  className="absolute bottom-4 right-1 text-[9px] bg-purple-900/80 hover:bg-purple-800 text-purple-200 px-1.5 py-0.5 rounded border border-purple-500/60 font-mono shadow-[0_0_8px_rgba(168,85,247,0.4)]"
                >
                  Investigate
                </button>
              </div>

              {/* Bottom Legend dots */}
              <div className="flex gap-2 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              </div>
            </div>

          </div>

          {/* ============================================================ */}
          {/* CENTER PANE: Investigations Over Time Polar Radar & Histogram */}
          {/* ============================================================ */}
          <div className="flex-1 flex flex-col overflow-hidden bg-[#07080d] relative">
            
            {/* Top Header Bar */}
            <div className="h-12 border-b border-purple-900/30 px-6 flex items-center justify-between z-20 shrink-0">
              {/* Title & Legend */}
              <div className="flex items-center gap-6">
                <h2 className="text-base font-semibold text-slate-100 font-sans tracking-wide">
                  Investigations Over Time
                </h2>

                {/* Risk Legend */}
                <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-500" /> Low
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" /> Medium
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_6px_#ef4444]" /> High
                  </span>
                </div>
              </div>

              {/* Time Range Pills Toggle */}
              <div className="flex items-center bg-[#111320] rounded-lg p-1 border border-purple-900/40 text-xs font-mono">
                <button
                  onClick={() => setTimeRange('1d')}
                  className={`px-3 py-1 rounded transition ${
                    timeRange === '1d' ? 'bg-purple-900/80 text-purple-200 font-bold border border-purple-500/50 shadow-[0_0_8px_rgba(168,85,247,0.4)]' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  1 Day
                </button>
                <button
                  onClick={() => setTimeRange('1w')}
                  className={`px-3 py-1 rounded transition ${
                    timeRange === '1w' ? 'bg-purple-900/80 text-purple-200 font-bold border border-purple-500/50 shadow-[0_0_8px_rgba(168,85,247,0.4)]' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  1 Week
                </button>
                <button
                  onClick={() => setTimeRange('1m')}
                  className={`px-3 py-1 rounded transition ${
                    timeRange === '1m' ? 'bg-purple-900/80 text-purple-200 font-bold border border-purple-500/50 shadow-[0_0_8px_rgba(168,85,247,0.4)]' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  1 Month
                </button>
              </div>
            </div>

            {/* Central Polar Threat Radar Spoke Area */}
            <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-tech-grid">
              <RadarSpokeCanvas
                incidents={incidents}
                onInvestigate={(inc) => onNavigateToGraph(inc)}
              />
            </div>

            {/* Bottom Activity Histogram Bar Chart */}
            <ActivityHistogram items={activityVolume} />
          </div>

          {/* ============================================================ */}
          {/* RIGHT COLUMN: Action Items (20) matching the uploaded UI */}
          {/* ============================================================ */}
          <div className="w-80 bg-[#090a12]/70 border-l border-purple-900/30 p-4 flex flex-col shrink-0 overflow-hidden font-sans">
            {/* Header */}
            <div className="flex items-center justify-between mb-3 shrink-0">
              <div className="text-sm font-semibold text-slate-100 font-sans">
                Action Items ({displayActions.length})
              </div>
              <span className="text-[10px] text-purple-300 font-mono">
                4 new in the last 24 hours
              </span>
            </div>

            {/* Scrollable Action Cards List */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {displayActions.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="bg-[#0e101a] border border-purple-900/30 hover:border-purple-600/50 rounded-lg p-3 transition shadow-sm hover:shadow-[0_0_12px_rgba(124,58,237,0.15)]"
                >
                  {/* Tag */}
                  <div className="text-[10px] font-mono text-slate-500 mb-1">
                    Related investigation: <span className="text-purple-300">{item.rel || item.related_investigation_id || '3'}</span>
                  </div>

                  {/* Title */}
                  <h4 className="text-xs font-medium text-slate-200 mb-2.5 line-clamp-2">
                    {item.title}
                  </h4>

                  {/* Button Row */}
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => onNavigateToGraph()}
                      className="px-2.5 py-1 text-xs bg-[#161828] hover:bg-purple-950/60 text-slate-300 rounded border border-slate-700/50 font-mono transition"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => onNavigateToGraph()}
                      className="px-2.5 py-1 text-xs bg-[#161828] hover:bg-purple-950/60 text-slate-300 rounded border border-slate-700/50 font-mono flex items-center gap-1 transition"
                    >
                      <span>Actions</span>
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

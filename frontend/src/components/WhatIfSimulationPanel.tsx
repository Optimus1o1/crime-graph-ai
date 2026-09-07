'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Sliders, Play, RefreshCw, AlertTriangle, CheckCircle2, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react'

export default function WhatIfSimulationPanel() {
  const [selectedPreset, setSelectedPreset] = useState('signal_optimization_junction_a')
  const [closeRoadA, setCloseRoadA] = useState(false)
  const [trafficVolumeDelta, setTrafficVolumeDelta] = useState(0)
  const [greenTimeSeconds, setGreenTimeSeconds] = useState(40)
  const [simResult, setSimResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const runSim = async (presetId?: string) => {
    setLoading(true)
    try {
      const pId = presetId || selectedPreset
      const payload: any = { scenario_id: pId }
      if (pId === 'custom') {
        payload.custom_params = {
          close_road_a: closeRoadA,
          traffic_increase_pct: trafficVolumeDelta,
          green_time_seconds: greenTimeSeconds
        }
      }
      const res = await axios.post('/api/simulation', payload)
      setSimResult(res.data)
    } catch (err) {
      console.error('Simulation failed:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    runSim('signal_optimization_junction_a')
  }, [])

  return (
    <div className="flex-1 flex flex-col bg-[#07080d] p-4 text-slate-100 overflow-hidden font-sans">
      {/* Header */}
      <div className="h-12 border-b border-purple-900/40 px-3 flex items-center justify-between shrink-0 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-950/80 border border-purple-500/60 flex items-center justify-center text-purple-300">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-100">Digital Twin What-If Traffic Simulation Engine</h2>
            <p className="text-[10px] text-slate-400 font-mono">Predictive Scenario Modeling & Intervention Testing (PDF Feature 13)</p>
          </div>
        </div>

        <button
          onClick={() => runSim()}
          disabled={loading}
          className="px-4 py-1.5 bg-purple-900/80 hover:bg-purple-800 text-purple-200 text-xs font-mono font-medium rounded-lg border border-purple-500/60 flex items-center gap-2 shadow-[0_0_12px_rgba(168,85,247,0.3)] transition disabled:opacity-50"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{loading ? 'Simulating...' : 'Run Simulation'}</span>
        </button>
      </div>

      {/* Main 2-Column Split */}
      <div className="flex-1 flex gap-4 overflow-hidden">
        
        {/* Left Parameter Controls */}
        <div className="w-80 bg-[#0c0d16] border border-purple-900/30 rounded-xl p-4 flex flex-col gap-4 overflow-y-auto shrink-0">
          <h3 className="text-xs font-mono text-purple-400 font-bold uppercase tracking-wider">
            1. Select Pre-Configured Scenario
          </h3>

          <div className="space-y-2">
            {[
              { id: 'signal_optimization_junction_a', label: 'Junction A Signal: 30s → 40s Green', desc: 'Flushes 100ft Road bottleneck queues' },
              { id: 'road_closure_road_a', label: 'Close Road A (100ft Road Maintenance)', desc: 'Tests arterial detour saturation' },
              { id: 'traffic_surge_20', label: 'City-Wide Rush: +20% Traffic Surge', desc: 'Evaluates network breakdown thresholds' },
              { id: 'custom', label: 'Custom Parameterized Scenario', desc: 'Freely adjust toggles & sliders below' },
            ].map(sc => (
              <div
                key={sc.id}
                onClick={() => { setSelectedPreset(sc.id); runSim(sc.id); }}
                className={`p-2.5 rounded-lg border cursor-pointer transition ${
                  selectedPreset === sc.id
                    ? 'bg-purple-950/60 border-purple-500 text-purple-200 shadow-[0_0_10px_rgba(168,85,247,0.25)]'
                    : 'bg-[#121422] border-slate-800 text-slate-300 hover:border-purple-800'
                }`}
              >
                <div className="text-xs font-semibold">{sc.label}</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">{sc.desc}</div>
              </div>
            ))}
          </div>

          {/* Custom Interactive Sliders */}
          <h3 className="text-xs font-mono text-purple-400 font-bold uppercase tracking-wider pt-2 border-t border-purple-950">
            2. Interactive Intervention Knobs
          </h3>

          {/* Road A Toggle */}
          <div className="bg-[#121422] p-3 rounded-lg border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300">Close Road A (100ft Arterial)</span>
              <input
                type="checkbox"
                checked={closeRoadA}
                onChange={(e) => { setCloseRoadA(e.target.checked); setSelectedPreset('custom'); }}
                className="w-4 h-4 accent-purple-500 cursor-pointer"
              />
            </div>
            <div className="text-[10px] text-slate-500 font-mono">Forces traffic diversion onto 12th Main Corridor</div>
          </div>

          {/* Volume Slider */}
          <div className="bg-[#121422] p-3 rounded-lg border border-slate-800 space-y-2 font-mono text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Traffic Volume Delta:</span>
              <span className={`font-bold ${trafficVolumeDelta > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                {trafficVolumeDelta > 0 ? `+${trafficVolumeDelta}%` : `${trafficVolumeDelta}%`}
              </span>
            </div>
            <input
              type="range"
              min="-20"
              max="50"
              step="5"
              value={trafficVolumeDelta}
              onChange={(e) => { setTrafficVolumeDelta(Number(e.target.value)); setSelectedPreset('custom'); }}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>

          {/* Signal Timing Slider */}
          <div className="bg-[#121422] p-3 rounded-lg border border-slate-800 space-y-2 font-mono text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Junction A Green Time:</span>
              <span className="font-bold text-purple-300">{greenTimeSeconds} sec</span>
            </div>
            <input
              type="range"
              min="20"
              max="60"
              step="5"
              value={greenTimeSeconds}
              onChange={(e) => { setGreenTimeSeconds(Number(e.target.value)); setSelectedPreset('custom'); }}
              className="w-full accent-purple-500 cursor-pointer"
            />
            <div className="text-[10px] text-slate-500">Baseline default: 30 seconds</div>
          </div>
        </div>

        {/* Right Simulation Outcome Table & Visual Deltas */}
        <div className="flex-1 bg-[#0c0d16] border border-purple-900/30 rounded-xl p-5 flex flex-col justify-between overflow-y-auto">
          {simResult && (
            <div className="space-y-5">
              {/* Scenario Name & Header */}
              <div>
                <span className="text-[10px] text-purple-400 font-mono font-bold uppercase">
                  SIMULATION OUTCOME REPORT
                </span>
                <h3 className="text-base font-bold text-slate-100 mt-1">{simResult.scenario_name}</h3>
                <p className="text-xs text-slate-400 font-sans mt-1">{simResult.impact_summary}</p>
              </div>

              {/* Exact BEFORE vs AFTER Comparison Table (Page 5 from PDF) */}
              <div className="bg-[#121422] border border-purple-900/50 rounded-xl p-4">
                <div className="grid grid-cols-4 gap-4 text-center font-mono py-2 border-b border-purple-900/40 text-xs text-slate-400">
                  <div className="text-left font-bold text-slate-300">METRIC</div>
                  <div className="font-bold text-slate-400 uppercase">BEFORE</div>
                  <div className="font-bold text-purple-300 uppercase">AFTER (SIM)</div>
                  <div className="font-bold text-emerald-400 uppercase">NET DELTA</div>
                </div>

                {/* Row 1: Congestion */}
                <div className="grid grid-cols-4 gap-4 text-center font-mono py-3 border-b border-slate-800/60 items-center text-xs">
                  <div className="text-left text-slate-300 font-medium">Congestion Level</div>
                  <div className="text-slate-400 text-sm">{simResult.before.congestion}</div>
                  <div className="text-purple-200 font-bold text-base">{simResult.after.congestion}</div>
                  <div>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      simResult.delta.congestion.startsWith('-')
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                        : 'bg-red-950 text-red-300 border border-red-500/40'
                    }`}>
                      {simResult.delta.congestion}
                    </span>
                  </div>
                </div>

                {/* Row 2: Average Speed */}
                <div className="grid grid-cols-4 gap-4 text-center font-mono py-3 border-b border-slate-800/60 items-center text-xs">
                  <div className="text-left text-slate-300 font-medium">Average Speed</div>
                  <div className="text-slate-400 text-sm">{simResult.before.avg_speed}</div>
                  <div className="text-purple-200 font-bold text-base">{simResult.after.avg_speed}</div>
                  <div>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      simResult.delta.avg_speed.startsWith('+')
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                        : 'bg-red-950 text-red-300 border border-red-500/40'
                    }`}>
                      {simResult.delta.avg_speed}
                    </span>
                  </div>
                </div>

                {/* Row 3: Travel Delay */}
                <div className="grid grid-cols-4 gap-4 text-center font-mono py-3 items-center text-xs">
                  <div className="text-left text-slate-300 font-medium">Travel Delay</div>
                  <div className="text-slate-400 text-sm">{simResult.before.delay}</div>
                  <div className="text-purple-200 font-bold text-base">{simResult.after.delay}</div>
                  <div>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      simResult.delta.delay.startsWith('-')
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                        : 'bg-red-950 text-red-300 border border-red-500/40'
                    }`}>
                      {simResult.delta.delay}
                    </span>
                  </div>
                </div>
              </div>

              {/* Visual Performance Gauge Cards */}
              <div className="grid grid-cols-3 gap-3 font-mono text-xs">
                <div className="bg-[#121422] p-3 rounded-lg border border-purple-950 text-center">
                  <div className="text-[10px] text-slate-500">CONGESTION SHIFT</div>
                  <div className="text-xl font-bold text-slate-100 mt-1">{simResult.after.congestion}</div>
                  <div className="text-[9px] text-purple-400 mt-0.5">Model: Spatial Macro-Sim</div>
                </div>

                <div className="bg-[#121422] p-3 rounded-lg border border-purple-950 text-center">
                  <div className="text-[10px] text-slate-500">SPEED ESTIMATE</div>
                  <div className="text-xl font-bold text-slate-100 mt-1">{simResult.after.avg_speed}</div>
                  <div className="text-[9px] text-purple-400 mt-0.5">Free-Flow Calibration</div>
                </div>

                <div className="bg-[#121422] p-3 rounded-lg border border-purple-950 text-center">
                  <div className="text-[10px] text-slate-500">DELAY REDUCTION</div>
                  <div className="text-xl font-bold text-emerald-400 mt-1">{simResult.delta.delay}</div>
                  <div className="text-[9px] text-emerald-300 mt-0.5">Net Corridor Benefit</div>
                </div>
              </div>
            </div>
          )}

          {/* Mandatory Research / Portfolio Disclaimer from PDF page 9 */}
          <div className="pt-3 border-t border-purple-900/30 text-[10px] font-mono text-slate-500">
            * <strong>Implementation Note (PDF Page 9):</strong> The outputs above are digital-twin simulation estimates based on macro-traffic modeling and should not be represented as guaranteed real-world outcomes.
          </div>
        </div>

      </div>
    </div>
  )
}

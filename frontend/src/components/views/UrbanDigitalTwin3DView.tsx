'use client'

import React, { useState, useEffect } from 'react'
import Metropolitan3DCanvas from '../Metropolitan3DCanvas'
import { 
  Network, 
  MapPin, 
  Car, 
  Play, 
  Pause, 
  RotateCcw, 
  Layers, 
  Sliders, 
  Radio, 
  Compass, 
  Eye, 
  ChevronRight,
  ShieldAlert
} from 'lucide-react'

interface UrbanDigitalTwin3DViewProps {
  onNavigate: (viewId: string) => void
}

export default function UrbanDigitalTwin3DView({ onNavigate }: UrbanDigitalTwin3DViewProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(true)
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1)
  const [activeTrack, setActiveTrack] = useState<string>('DL-4C-AB-1234')
  const [timeOffset, setTimeOffset] = useState<number>(65)

  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setTimeOffset(prev => (prev >= 100 ? 0 : prev + 1))
    }, 1200 / playbackSpeed)
    return () => clearInterval(interval)
  }, [isPlaying, playbackSpeed])

  const hours = Math.floor((timeOffset / 100) * 24)
  const minutes = Math.floor(((timeOffset / 100) * 1440) % 60)
  const seconds = Math.floor(((timeOffset / 100) * 86400) % 60)
  const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} GMT`

  return (
    <div className="flex-1 flex flex-col p-3.5 gap-3.5 overflow-hidden bg-[#04070D] text-slate-100 font-sans select-none">
      
      {/* ============================================================ */}
      {/* 1. MAIN METROPOLITAN SPATIAL MESH & TELEMETRY SPLIT */}
      {/* ============================================================ */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3.5 min-h-[460px] overflow-hidden">
        
        {/* Left Panel (4 cols): Active Intel Tracks & Location Intel Summary */}
        <div className="lg:col-span-4 cyber-panel rounded-lg p-3.5 flex flex-col gap-3.5 overflow-y-auto">
          
          {/* Active Intel Tracks (2) */}
          <div>
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 mb-2 font-mono text-xs">
              <span className="text-cyan-400 font-bold tracking-wider uppercase flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-cyan-400" />
                <span>ACTIVE INTEL TRACKS (2)</span>
              </span>
              <span className="text-red-400 font-bold animate-pulse text-[10px]">LIVE REPLAY</span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              {/* Track 1 */}
              <div 
                onClick={() => setActiveTrack('DL-4C-AB-1234')}
                className={`p-2.5 rounded border cursor-pointer transition ${
                  activeTrack === 'DL-4C-AB-1234'
                    ? 'bg-[#091220] border-cyan-400 shadow-[0_0_12px_rgba(0,229,255,0.25)]'
                    : 'bg-[#020509] border-slate-800 hover:border-cyan-500/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold">DL-4C-AB-1234</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-red-950 text-red-300 border border-red-500/40 font-bold">
                    PRIORITY TARGET
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 mt-1">
                  Fortuner • Delhi gate sector 4
                </div>
                <div className="flex items-center justify-between text-[10px] text-cyan-300 mt-1 pt-1 border-t border-slate-800">
                  <span>Speed: <b>42km/h</b></span>
                  <span>Heading: <b>SE (142°)</b></span>
                </div>
              </div>

              {/* Track 2 */}
              <div 
                onClick={() => setActiveTrack('HR-26-XX-8812')}
                className={`p-2.5 rounded border cursor-pointer transition ${
                  activeTrack === 'HR-26-XX-8812'
                    ? 'bg-[#091220] border-cyan-400 shadow-[0_0_12px_rgba(0,229,255,0.25)]'
                    : 'bg-[#020509] border-slate-800 hover:border-cyan-500/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-slate-200 font-bold">HR-26 XX 8812</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-500/40 font-bold">
                    CO-CONSPIRATOR
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Black Honda City • Station Rd
                </div>
                <div className="flex items-center justify-between text-[10px] text-amber-300 mt-1 pt-1 border-t border-slate-800">
                  <span>Speed: <b>58km/h</b></span>
                  <span>Heading: <b>NW (310°)</b></span>
                </div>
              </div>
            </div>
          </div>

          {/* Location Intel Summary */}
          <div className="bg-[#020509] border border-cyan-900/40 rounded-lg p-3 space-y-2 font-mono text-xs">
            <div className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider flex items-center justify-between border-b border-slate-800 pb-1.5">
              <span>LOCATION INTEL SUMMARY</span>
              <MapPin className="w-3 h-3 text-cyan-400" />
            </div>

            <div>
              <div className="text-sm font-bold text-white">CHANDNI CHOWK G-4</div>
              <div className="text-[10px] text-slate-400">
                Classification: Private Residence / Meeting Point
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 space-y-1.5 text-[11px]">
              <div className="text-[10px] text-slate-500 uppercase">CO OCCURRING VISITS</div>
              <div className="flex items-center justify-between">
                <span className="text-slate-200">Sayed Khan (S-201)</span>
                <span className="text-red-400 font-bold">24 visits</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-200">Amit Verma (S-109)</span>
                <span className="text-amber-400 font-bold">18 visits</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase mb-1">ACTIVE GEOFENCE PROXIMITY</div>
              <div className="text-[11px] text-cyan-300 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                CP GATE 4 (ANPR MATCH)
              </div>
            </div>
          </div>

        </div>

        {/* Center / Right Panel (8 cols): True 3D WebGL Metropolitan Digital Twin Canvas */}
        <div className="lg:col-span-8 cyber-panel rounded-lg flex flex-col justify-between relative overflow-hidden bg-[#020509] min-h-[440px]">
          <Metropolitan3DCanvas 
            activeTrack={activeTrack}
            isPlaying={isPlaying}
            playbackSpeed={playbackSpeed}
            timeOffset={timeOffset}
            onSelectTrack={(trackId) => setActiveTrack(trackId)}
          />
        </div>

      </div>

      {/* ============================================================ */}
      {/* 2. BOTTOM 24H REPLAY MODE CONTROLLER */}
      {/* ============================================================ */}
      <div className="cyber-panel p-3 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs border-t-2 border-t-cyan-400">
        
        {/* Title */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-white font-bold uppercase tracking-wider">
            REPLAY TIME INDEX: <span className="text-cyan-300 font-mono">{formattedTime}</span> (LAST 24H TRACKING)
          </span>
        </div>

        {/* Timeline Slider */}
        <div className="flex-1 w-full max-w-xl flex items-center gap-2">
          <span className="text-slate-500 text-[10px]">T-24H</span>
          <input
            type="range"
            min="0"
            max="100"
            value={timeOffset}
            onChange={(e) => setTimeOffset(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
          <span className="text-cyan-400 font-bold text-[10px]">NOW</span>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 transition cursor-pointer"
            title={isPlaying ? 'Pause Replay' : 'Play Replay'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setTimeOffset(0)}
            className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition cursor-pointer"
            title="Rewind to start of 24h cycle"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Speed Pills */}
          <div className="flex items-center gap-1 bg-[#020509] p-0.5 rounded border border-slate-800">
            {[1, 2, 5].map(spd => (
              <button
                key={spd}
                onClick={() => setPlaybackSpeed(spd)}
                className={`px-2 py-0.5 rounded text-[10px] ${
                  playbackSpeed === spd
                    ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>
  )
}

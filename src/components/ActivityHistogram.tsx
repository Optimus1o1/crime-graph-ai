'use client'

import React, { useState } from 'react'
import { Box, Sparkles } from 'lucide-react'

export interface ActivityHistogramItem {
  time_label: string
  count: number
  severity?: string
}

interface ActivityHistogramProps {
  items?: ActivityHistogramItem[]
  onSelectBin?: (item: ActivityHistogramItem) => void
}

export default function ActivityHistogram({ items, onSelectBin }: ActivityHistogramProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)

  const defaultItems = [
    { time_label: '12:00', count: 120, severity: 'low' },
    { time_label: '01:00', count: 150, severity: 'low' },
    { time_label: '02:00', count: 320, severity: 'high' },
    { time_label: '03:00', count: 410, severity: 'high' },
    { time_label: '04:00', count: 450, severity: 'high' },
    { time_label: '05:00', count: 280, severity: 'medium' },
    { time_label: '06:00', count: 340, severity: 'medium' },
    { time_label: '07:00', count: 510, severity: 'high' },
    { time_label: '08:00', count: 540, severity: 'high' },
    { time_label: '09:00', count: 470, severity: 'medium' },
    { time_label: '10:00', count: 380, severity: 'medium' },
    { time_label: '11:00', count: 290, severity: 'low' },
    { time_label: '12:00', count: 310, severity: 'low' },
    { time_label: '13:00', count: 360, severity: 'medium' },
    { time_label: '14:00', count: 300, severity: 'low' },
    { time_label: '02:00', count: 430, severity: 'high' },
    { time_label: '03:00', count: 480, severity: 'high' },
    { time_label: '04:00', count: 590, severity: 'high' },
    { time_label: '05:00', count: 490, severity: 'high' },
    { time_label: '06:00', count: 400, severity: 'medium' },
    { time_label: 'Oct 08', count: 460, severity: 'high' },
    { time_label: '09:00', count: 530, severity: 'high' },
    { time_label: '10:00', count: 310, severity: 'low' },
    { time_label: '11:00', count: 210, severity: 'low' },
  ]

  const data = items && items.length > 0 ? items : defaultItems
  const maxCount = Math.max(...data.map(d => d.count), 600)

  return (
    <div className="w-full pt-3 pb-2.5 px-5 border-t border-cyan-900/30 bg-[#060812]/90 backdrop-blur-md select-none">
      {/* Header Info */}
      <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-bold">
            <Box className="w-3 h-3 text-cyan-400" />
            <span>3D ISOMETRIC TELEMETRY VOXELS</span>
          </span>
          <span className="text-slate-300">
            <strong className="text-cyan-300 font-bold">100,000</strong> Interactions Processed ·{' '}
            <span className="text-emerald-400 font-medium">+4.8k in last 24h</span>
          </span>
        </div>
        <span className="text-[10px] text-slate-500 hidden sm:inline-block">
          HOVER FOR 3D HUD · CLICK TO ISOLATE HOUR
        </span>
      </div>

      {/* 3D Isometric Voxel Bar Field */}
      <div 
        className="h-14 flex items-end gap-1.5 w-full pt-2"
        style={{ perspective: '600px', transformStyle: 'preserve-3d' }}
      >
        {data.map((bin, idx) => {
          const heightPct = Math.round((bin.count / maxCount) * 100)
          const isHigh = bin.severity === 'high' || bin.count > 450
          const isMed = bin.severity === 'medium' || (bin.count > 300 && bin.count <= 450)
          const isSelected = selectedIdx === idx

          // Colors
          const baseColor = isHigh ? '#ef4444' : isMed ? '#8b5cf6' : '#00f0ff'
          const topColor = isHigh ? '#fca5a5' : isMed ? '#c084fc' : '#a5f3fc'
          const sideColor = isHigh ? '#991b1b' : isMed ? '#581c87' : '#0e7490'

          return (
            <div
              key={idx}
              onClick={() => {
                setSelectedIdx(isSelected ? null : idx)
                if (onSelectBin) onSelectBin(bin)
              }}
              className="flex-1 flex flex-col items-center justify-end h-full group relative cursor-pointer"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Floating 3D Tooltip */}
              <div className="absolute -top-8 bg-[#050b14]/95 text-[10px] font-mono px-2 py-0.5 rounded border border-cyan-400 text-white opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-40 shadow-[0_0_12px_rgba(0,240,255,0.4)] transform -translate-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: baseColor }} />
                  <span className="font-bold">{bin.time_label}</span>: <span>{bin.count} events</span>
                </div>
              </div>

              {/* 3D Extruded Voxel Column */}
              <div
                style={{ 
                  height: `${Math.max(heightPct, 15)}%`,
                  transform: isSelected 
                    ? 'translateY(-6px) scale(1.1) rotateX(15deg)' 
                    : 'rotateX(15deg)',
                  transformStyle: 'preserve-3d',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                className={`w-full relative group-hover:-translate-y-2 group-hover:scale-105 ${
                  isSelected ? 'shadow-[0_0_15px_rgba(0,240,255,0.6)]' : ''
                }`}
              >
                {/* 3D Front Face */}
                <div 
                  className="w-full h-full rounded-b-xs"
                  style={{
                    background: `linear-gradient(to top, ${sideColor}55, ${baseColor}dd)`,
                    borderLeft: `1px solid ${topColor}66`,
                    borderRight: `1px solid ${sideColor}`,
                    borderBottom: `1px solid ${sideColor}`,
                  }}
                />

                {/* 3D Top Cap (Glowing Isometric Lid) */}
                <div
                  className="absolute -top-1.5 left-0 w-full h-2 rounded-xs"
                  style={{
                    backgroundColor: topColor,
                    transform: 'rotateX(60deg) translateY(-2px)',
                    boxShadow: `0 0 8px ${baseColor}`,
                    border: `1px solid #ffffffaa`
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Bottom Timeline Axis */}
      <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-2 px-1">
        <span>12:00</span>
        <span>02:00</span>
        <span>04:00</span>
        <span>06:00</span>
        <span>08:00</span>
        <span>10:00</span>
        <span>12:00</span>
        <span>02:00</span>
        <span>04:00</span>
        <span className="text-cyan-400 font-bold">Oct 08</span>
        <span>09:00</span>
        <span>10:00</span>
      </div>
    </div>
  )
}

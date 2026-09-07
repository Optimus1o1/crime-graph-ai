'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { AlertCircle, ExternalLink, ShieldAlert, Crosshair } from 'lucide-react'

export interface RadarIncidentItem {
  id: string
  title: string
  severity: 'low' | 'medium' | 'high'
  angle_degrees: number
  radius_distance: number
  first_detected_at: string
  last_seen_at: string
  related_entities_count: number
  related_entities: string[]
  current_status: string
  description: string
  evidence_id: string
}

interface RadarSpokeCanvasProps {
  incidents: RadarIncidentItem[]
  onInvestigate: (incident: RadarIncidentItem) => void
}

export default function RadarSpokeCanvas({ incidents, onInvestigate }: RadarSpokeCanvasProps) {
  const [selectedIncident, setSelectedIncident] = useState<RadarIncidentItem | null>(null)

  // Default to selecting the primary critical incident on load (matches the uploaded screenshot)
  useEffect(() => {
    if (incidents.length > 0 && !selectedIncident) {
      const topIncident = incidents.find(i => i.title.toLowerCase().includes('malware') || i.severity === 'high') || incidents[0]
      setSelectedIncident(topIncident)
    }
  }, [incidents])

  // Radar geometry
  const size = 520
  const cx = size / 2
  const cy = size / 2
  const maxRadius = 220
  const rings = [0.2, 0.4, 0.6, 0.8, 1.0]
  const spokesCount = 24

  // Calculate coordinates for an incident
  const getCoordinates = (angleDeg: number, radiusNorm: number) => {
    const rad = (angleDeg - 90) * (Math.PI / 180)
    const r = radiusNorm * maxRadius
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad)
    }
  }

  return (
    <div className="relative w-full h-[540px] flex items-center justify-center select-none overflow-hidden">
      {/* Outer Rotating Radar Sweep Cone */}
      <div className="absolute w-[460px] h-[460px] rounded-full pointer-events-none overflow-hidden">
        <div 
          className="w-full h-full rounded-full"
          style={{
            background: 'conic-gradient(from 0deg at 50% 50%, rgba(124, 58, 237, 0.28) 0deg, rgba(124, 58, 237, 0.04) 45deg, transparent 75deg)',
            animation: 'radar-sweep 8s linear infinite'
          }}
        />
      </div>

      {/* SVG Polar Grid */}
      <svg width={size} height={size} className="relative z-10">
        {/* Concentric Polar Circles */}
        {rings.map((rNorm, idx) => (
          <circle
            key={idx}
            cx={cx}
            cy={cy}
            r={rNorm * maxRadius}
            fill="none"
            stroke="rgba(124, 58, 237, 0.2)"
            strokeWidth={idx === rings.length - 1 ? "1.5" : "1"}
            strokeDasharray={idx === rings.length - 1 ? "none" : "3, 5"}
          />
        ))}

        {/* Radial Spoke Lines */}
        {Array.from({ length: spokesCount }).map((_, idx) => {
          const angle = (idx * (360 / spokesCount) - 90) * (Math.PI / 180)
          const x2 = cx + maxRadius * Math.cos(angle)
          const y2 = cy + maxRadius * Math.sin(angle)
          return (
            <line
              key={idx}
              x1={cx}
              y1={cy}
              x2={x2}
              y2={y2}
              stroke="rgba(124, 58, 237, 0.12)"
              strokeWidth="1"
            />
          )
        })}

        {/* Perimeter Degree / Day Markers */}
        {Array.from({ length: 31 }).map((_, idx) => {
          const day = idx + 1
          const angle = ((idx * (360 / 31)) - 90) * (Math.PI / 180)
          const tx = cx + (maxRadius + 14) * Math.cos(angle)
          const ty = cy + (maxRadius + 14) * Math.sin(angle)
          return (
            <text
              key={idx}
              x={tx}
              y={ty}
              fill="rgba(148, 163, 184, 0.45)"
              fontSize="9"
              fontFamily="var(--font-mono)"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {day % 5 === 0 || day === 1 ? day : '·'}
            </text>
          )
        })}

        {/* Threat Blips */}
        {incidents.map((incident) => {
          const { x, y } = getCoordinates(incident.angle_degrees, incident.radius_distance)
          const isSelected = selectedIncident?.id === incident.id

          let fillColor = '#c084fc'
          let filterGlow = 'rgba(168, 85, 247, 0.5)'
          let blipRadius = 4.5

          if (incident.severity === 'high') {
            fillColor = '#ef4444'
            filterGlow = 'rgba(239, 68, 68, 0.85)'
            blipRadius = 6.5
          } else if (incident.severity === 'medium') {
            fillColor = '#f59e0b'
            filterGlow = 'rgba(245, 158, 11, 0.75)'
            blipRadius = 5.5
          }

          return (
            <g
              key={incident.id}
              className="cursor-pointer group"
              onClick={() => setSelectedIncident(incident)}
            >
              {/* Outer pulsing ring for selected or high severity */}
              {(isSelected || incident.severity === 'high') && (
                <circle
                  cx={x}
                  cy={y}
                  r={blipRadius + 6}
                  fill="none"
                  stroke={fillColor}
                  strokeWidth="1.2"
                  opacity={isSelected ? 0.9 : 0.4}
                  className={incident.severity === 'high' ? 'blip-red' : ''}
                />
              )}

              {/* Main Core Dot */}
              <circle
                cx={x}
                cy={y}
                r={blipRadius}
                fill={fillColor}
                style={{ filter: `drop-shadow(0 0 6px ${filterGlow})` }}
                className="transition-transform group-hover:scale-125"
              />
            </g>
          )
        })}
      </svg>

      {/* Interactive Detail Popover Card (Matches exact position and styling from uploaded screenshot) */}
      {selectedIncident && (
        <div 
          className="absolute z-30 w-64 bg-[#0d0e17]/95 border border-purple-500/70 rounded-lg p-3.5 shadow-[0_0_24px_rgba(124,58,237,0.4)] backdrop-blur-md transition-all"
          style={{
            top: '22%',
            left: '30%',
          }}
        >
          {/* Header Row */}
          <div className="flex items-start justify-between gap-2 border-b border-purple-900/40 pb-2">
            <div>
              <h4 className="text-xs font-semibold text-slate-100 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                {selectedIncident.title}
              </h4>
            </div>
            <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono uppercase font-bold shrink-0 ${
              selectedIncident.severity === 'high'
                ? 'bg-red-950/80 text-red-300 border border-red-500/50'
                : 'bg-amber-950/80 text-amber-300 border border-amber-500/50'
            }`}>
              {selectedIncident.severity}
            </span>
          </div>

          {/* Metadata Rows */}
          <div className="py-2.5 space-y-1.5 text-[11px] font-mono text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-500">First Detected At</span>
              <span className="text-slate-300">{selectedIncident.first_detected_at}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Last Seen At</span>
              <span className="text-slate-300">{selectedIncident.last_seen_at}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Related Entities</span>
              <span className="text-purple-300 font-bold">{selectedIncident.related_entities_count}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Current Status</span>
              <span className="text-emerald-400">{selectedIncident.current_status}</span>
            </div>
          </div>

          {/* Action CTA Button */}
          <button
            onClick={() => onInvestigate(selectedIncident)}
            className="w-full mt-1.5 py-1.5 px-3 bg-purple-900/60 hover:bg-purple-800 text-purple-200 text-xs font-medium rounded border border-purple-500/60 flex items-center justify-center gap-2 shadow-[0_0_10px_rgba(168,85,247,0.3)] transition"
          >
            <span>Investigate</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  )
}

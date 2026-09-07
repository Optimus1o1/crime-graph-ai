'use client'

import React, { useEffect, useRef, useState } from 'react'
import cytoscape from 'cytoscape'
import axios from 'axios'
import RoadNetwork3DCanvas from './RoadNetwork3DCanvas'
import { Network, Activity, AlertTriangle, ShieldCheck, Layers, Compass, ArrowRight, Box } from 'lucide-react'

export default function DigitalTwinRoadGraph() {
  const containerRef = useRef<HTMLDivElement>(null)
  const cyRef = useRef<cytoscape.Core | null>(null)
  const [selectedRoad, setSelectedRoad] = useState<any>(null)
  const [roads, setRoads] = useState<any[]>([])
  const [viewMode, setViewMode] = useState<'3D' | '2D'>('3D')

  useEffect(() => {
    // Fetch roads analytics
    axios.get('/api/roads')
      .then(res => {
        setRoads(res.data)
        if (res.data.length > 0) setSelectedRoad(res.data[0])
      })
      .catch(() => {})

    if (!containerRef.current) return

    // Initialize Cytoscape Digital Twin Road Network Graph
    const cy = cytoscape({
      container: containerRef.current,
      style: [
        {
          selector: 'node[type = "intersection"]',
          style: {
            'background-color': '#1e1b4b',
            'border-color': '#8b5cf6',
            'border-width': 2,
            'label': 'data(label)',
            'color': '#f8fafc',
            'font-size': '10px',
            'font-family': 'monospace',
            'text-valign': 'center',
            'text-halign': 'center',
            'width': 38,
            'height': 38,
            'text-outline-color': '#07080d',
            'text-outline-width': 2,
          }
        },
        {
          selector: 'node[type = "camera"]',
          style: {
            'background-color': '#0f766e',
            'border-color': '#2dd4bf',
            'border-width': 2,
            'label': 'data(label)',
            'color': '#5eead4',
            'font-size': '9px',
            'font-family': 'monospace',
            'text-valign': 'bottom',
            'text-margin-y': 4,
            'width': 24,
            'height': 24,
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 'mapData(congestion, 20, 100, 3, 8)',
            'line-color': 'data(color)',
            'curve-style': 'bezier',
            'label': 'data(label)',
            'font-size': '8px',
            'font-family': 'monospace',
            'color': '#94a3b8',
            'text-rotation': 'autorotate',
            'text-background-opacity': 0.85,
            'text-background-color': '#07080d',
            'text-background-padding': '2px',
            'target-arrow-shape': 'triangle',
            'target-arrow-color': 'data(color)',
          }
        },
        {
          selector: ':selected',
          style: {
            'border-color': '#ec4899',
            'border-width': 4,
            'line-color': '#ec4899',
            'target-arrow-color': '#ec4899',
          }
        }
      ],
      elements: [
        // Intersections
        { data: { id: 'JCT_INDIRA_N', label: 'Indiranagar N', type: 'intersection' }, position: { x: 180, y: 120 } },
        { data: { id: 'JCT_INDIRA_S', label: 'Indiranagar S', type: 'intersection' }, position: { x: 220, y: 240 } },
        { data: { id: 'JCT_DOMLUR', label: 'Domlur Flyover', type: 'intersection' }, position: { x: 300, y: 340 } },
        { data: { id: 'JCT_AIRPORT', label: 'Airport Hub', type: 'intersection' }, position: { x: 480, y: 320 } },
        { data: { id: 'JCT_MG_ROAD', label: 'MG Road Trinity', type: 'intersection' }, position: { x: 100, y: 220 } },
        { data: { id: 'JCT_KORAMANGALA', label: 'Koramangala 80ft', type: 'intersection' }, position: { x: 280, y: 460 } },
        { data: { id: 'JCT_MARATHAHALLI', label: 'Marathahalli Brg', type: 'intersection' }, position: { x: 520, y: 220 } },
        { data: { id: 'JCT_BELLANDUR', label: 'Bellandur EcoSpace', type: 'intersection' }, position: { x: 440, y: 460 } },
        { data: { id: 'JCT_WHITEFIELD', label: 'Whitefield ITPL', type: 'intersection' }, position: { x: 680, y: 180 } },

        // Cameras
        { data: { id: 'CAM_01', label: 'CAM-01', type: 'camera' }, position: { x: 140, y: 90 } },
        { data: { id: 'CAM_02', label: 'CAM-02', type: 'camera' }, position: { x: 260, y: 210 } },
        { data: { id: 'CAM_03', label: 'CAM-03', type: 'camera' }, position: { x: 340, y: 310 } },
        { data: { id: 'CAM_04', label: 'CAM-04', type: 'camera' }, position: { x: 70, y: 250 } },
        { data: { id: 'CAM_05', label: 'CAM-05', type: 'camera' }, position: { x: 250, y: 490 } },
        { data: { id: 'CAM_06', label: 'CAM-06', type: 'camera' }, position: { x: 550, y: 190 } },
        { data: { id: 'CAM_07', label: 'CAM-07', type: 'camera' }, position: { x: 720, y: 150 } },
        { data: { id: 'CAM_08', label: 'CAM-08', type: 'camera' }, position: { x: 470, y: 490 } },

        // Edges (Road Segments)
        { data: { id: 'ROAD-101', source: 'JCT_INDIRA_N', target: 'JCT_INDIRA_S', label: '100ft Rd (78%)', congestion: 78, color: '#f59e0b' } },
        { data: { id: 'ROAD-102', source: 'JCT_INDIRA_S', target: 'JCT_DOMLUR', label: '12th Main (42%)', congestion: 42, color: '#a855f7' } },
        { data: { id: 'ROAD-103', source: 'JCT_DOMLUR', target: 'JCT_AIRPORT', label: 'Airport Cor (86%)', congestion: 86, color: '#ef4444' } },
        { data: { id: 'ROAD-104', source: 'JCT_MG_ROAD', target: 'JCT_INDIRA_N', label: 'CBD Link (62%)', congestion: 62, color: '#f59e0b' } },
        { data: { id: 'ROAD-105', source: 'JCT_DOMLUR', target: 'JCT_KORAMANGALA', label: 'Tech Conn (48%)', congestion: 48, color: '#a855f7' } },
        { data: { id: 'ROAD-106', source: 'JCT_MARATHAHALLI', target: 'JCT_BELLANDUR', label: 'ORR Express (82%)', congestion: 82, color: '#ef4444' } },
        { data: { id: 'ROAD-107', source: 'JCT_MARATHAHALLI', target: 'JCT_WHITEFIELD', label: 'Whitefield (89%)', congestion: 89, color: '#ef4444' } },
        { data: { id: 'ROAD-108', source: 'JCT_BELLANDUR', target: 'JCT_KORAMANGALA', label: 'Bellandur (74%)', congestion: 74, color: '#f59e0b' } },
      ],
      layout: { name: 'preset' },
      userZoomingEnabled: true,
      userPanningEnabled: true,
    })

    cy.on('tap', 'edge', (evt) => {
      const edge = evt.target
      const roadId = edge.id()
      axios.get(`/api/roads/${roadId}/analytics`)
        .then(res => setSelectedRoad(res.data))
        .catch(() => {})
    })

    cyRef.current = cy
  }, [])

  return (
    <div className="flex-1 flex bg-[#07080d] overflow-hidden font-sans">
      {/* Central Graph Canvas */}
      <div className="flex-1 flex flex-col relative overflow-hidden bg-tech-grid">
        {/* Top Floating Controls */}
        <div className="absolute top-3 left-4 z-10 bg-[#0d0e17]/90 border border-purple-900/40 rounded-lg p-2 flex items-center gap-3 text-xs font-mono shadow-[0_0_15px_rgba(124,58,237,0.25)] backdrop-blur-md">
          {/* Mode Switcher */}
          <div className="flex items-center bg-[#07080d] p-0.5 rounded border border-purple-500/40">
            <button
              onClick={() => setViewMode('3D')}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold transition ${
                viewMode === '3D'
                  ? 'bg-purple-600 text-white shadow-[0_0_8px_rgba(168,85,247,0.6)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Box className="w-3 h-3" />
              <span>3D SPATIAL ARCS</span>
            </button>
            <button
              onClick={() => setViewMode('2D')}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold transition ${
                viewMode === '2D'
                  ? 'bg-purple-600 text-white shadow-[0_0_8px_rgba(168,85,247,0.6)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Network className="w-3 h-3" />
              <span>2D SCHEMATIC</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-slate-400 text-[10px]">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" /> &lt;40% Flow</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-400" /> 40-60% Med</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> 60-80% High</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400 shadow-[0_0_6px_#ef4444]" /> &gt;80% Critical</span>
          </div>
        </div>

        {/* Dynamic 3D / 2D Container */}
        {viewMode === '3D' ? (
          <div className="w-full h-full relative">
            <RoadNetwork3DCanvas onSelectRoad={(road) => setSelectedRoad(road)} />
          </div>
        ) : (
          <div ref={containerRef} className="w-full h-full" />
        )}
      </div>

      {/* Right Road Analytics Panel */}
      <div className="w-80 bg-[#090a12]/80 border-l border-purple-900/30 p-4 flex flex-col shrink-0 overflow-y-auto">
        <h3 className="text-sm font-semibold text-slate-100 mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-purple-400" />
          <span>Road Segment Telemetry</span>
        </h3>

        {selectedRoad ? (
          <div className="space-y-3 font-sans text-xs">
            {/* Header Badge */}
            <div className="bg-[#121422] border border-purple-900/50 rounded-lg p-3">
              <div className="text-[10px] text-purple-400 font-mono font-bold uppercase">{selectedRoad.road_id}</div>
              <div className="text-sm font-bold text-slate-100">{selectedRoad.name}</div>
              <div className="mt-2 flex items-center justify-between">
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase ${
                  selectedRoad.congestion_pct >= 80 ? 'bg-red-950 text-red-300 border border-red-500/50' : 'bg-amber-950 text-amber-300 border border-amber-500/50'
                }`}>
                  Congestion: {selectedRoad.congestion_pct}%
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Density: <strong className="text-slate-200">{selectedRoad.density}</strong>
                </span>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              <div className="bg-[#0e101a] p-2.5 rounded border border-purple-950">
                <div className="text-[9px] text-slate-500">AVERAGE SPEED</div>
                <div className="text-lg font-bold text-slate-100">{selectedRoad.average_speed} <span className="text-xs font-normal text-slate-400">km/h</span></div>
                <div className="text-[9px] text-slate-500">Limit: {selectedRoad.speed_limit_kmh} km/h</div>
              </div>

              <div className="bg-[#0e101a] p-2.5 rounded border border-purple-950">
                <div className="text-[9px] text-slate-500">TRAVEL TIME</div>
                <div className="text-lg font-bold text-purple-300">{selectedRoad.travel_time_min} <span className="text-xs font-normal text-slate-400">min</span></div>
                <div className="text-[9px] text-slate-500">Length: {selectedRoad.length_km} km</div>
              </div>
            </div>

            {/* Current Active Vehicles */}
            <div className="bg-[#0e101a] p-3 rounded border border-purple-950 font-mono">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Current Vehicles in Segment:</span>
                <span className="text-base font-bold text-emerald-400">{selectedRoad.current_vehicles}</span>
              </div>
            </div>

            {/* Critical Anomaly Alert if Congestion High */}
            {selectedRoad.congestion_pct >= 80 && (
              <div className="bg-red-950/40 border border-red-500/40 rounded-lg p-3 space-y-1 text-red-300 text-[11px] font-mono">
                <div className="flex items-center gap-1.5 font-bold text-red-400">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Bottleneck Alert</span>
                </div>
                <p>Speed collapse detected on this corridor. Queue spillover risk high.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-slate-500 font-mono text-xs py-8 text-center">
            Click on any road edge on the digital twin canvas to inspect live metrics.
          </div>
        )}
      </div>
    </div>
  )
}

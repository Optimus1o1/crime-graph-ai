'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Video, Radio, Cpu, ShieldCheck, Eye, Layers, Car, Bus, Truck, AlertTriangle } from 'lucide-react'

export default function CameraFeedsView() {
  const [cameras, setCameras] = useState<any[]>([])
  const [selectedCam, setSelectedCam] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/cameras')
      .then(res => {
        setCameras(res.data)
        if (res.data.length > 0) {
          setSelectedCam(res.data[0])
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex-1 flex flex-col bg-[#07080d] p-4 text-slate-100 overflow-hidden font-sans">
      {/* Top Header */}
      <div className="h-12 border-b border-purple-900/40 px-3 flex items-center justify-between shrink-0 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-950/80 border border-purple-500/60 flex items-center justify-center text-purple-300">
            <Video className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-100">Multi-Camera Video Feeds & YOLO Detection Grid</h2>
            <p className="text-[10px] text-slate-400 font-mono">Real-Time ByteTrack Multi-Object Tracking & ANPR Plate Recognition</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
            8 CAMERAS ONLINE
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-purple-300">YOLOv11x · 29.8 avg FPS · 14.2ms Latency</span>
        </div>
      </div>

      {/* Grid of Camera Feeds */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 overflow-y-auto pr-1">
        {cameras.map((cam) => {
          const isSelected = selectedCam?.camera_id === cam.camera_id

          return (
            <div
              key={cam.camera_id}
              onClick={() => setSelectedCam(cam)}
              className={`bg-[#0c0d16] border rounded-xl overflow-hidden flex flex-col cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'border-purple-500 shadow-[0_0_20px_rgba(124,58,237,0.35)]'
                  : 'border-purple-900/30 hover:border-purple-700/50'
              }`}
            >
              {/* Simulated Camera Video Stream Screen */}
              <div className="relative h-44 bg-[#05060a] overflow-hidden flex items-center justify-center border-b border-purple-900/30">
                {/* Visual Video Background Simulation with Road Lanes */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0c16] via-[#101322] to-[#060810] opacity-90" />
                
                {/* Road Perspective Lines */}
                <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none">
                  <line x1="50%" y1="20%" x2="15%" y2="100%" stroke="rgba(168, 85, 247, 0.4)" strokeWidth="2" strokeDasharray="6,6" />
                  <line x1="50%" y1="20%" x2="85%" y2="100%" stroke="rgba(168, 85, 247, 0.4)" strokeWidth="2" strokeDasharray="6,6" />
                  <line x1="50%" y1="20%" x2="50%" y2="100%" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="2" strokeDasharray="8,8" />
                </svg>

                {/* Live YOLO Bounding Boxes Simulation */}
                <div 
                  className="absolute border border-emerald-400 bg-emerald-500/10 rounded"
                  style={{ top: '35%', left: '22%', width: '28%', height: '38%' }}
                >
                  <span className="absolute -top-4 left-0 bg-emerald-950 text-emerald-300 border border-emerald-400 text-[8px] font-mono px-1 rounded">
                    car 94% #7831
                  </span>
                  <div className="absolute -bottom-3 left-0 bg-black/80 text-[8px] font-mono text-purple-200 px-1 rounded border border-purple-600/40">
                    KA-01-MJ-4040
                  </div>
                </div>

                <div 
                  className="absolute border border-amber-400 bg-amber-500/10 rounded"
                  style={{ top: '22%', right: '18%', width: '32%', height: '45%' }}
                >
                  <span className="absolute -top-4 left-0 bg-amber-950 text-amber-300 border border-amber-400 text-[8px] font-mono px-1 rounded">
                    bus 96% #7832
                  </span>
                </div>

                {/* Top Status Bar on Video */}
                <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-10 text-[9px] font-mono">
                  <span className="bg-black/70 px-1.5 py-0.5 rounded text-slate-200 border border-slate-700/50 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    REC · {cam.camera_id}
                  </span>
                  <span className="bg-black/70 px-1.5 py-0.5 rounded text-emerald-400 border border-emerald-900/60">
                    {cam.fps || 29.8} FPS
                  </span>
                </div>

                {/* Bottom Overlay Label */}
                <div className="absolute bottom-1 right-2 text-[9px] font-mono text-slate-400 bg-black/60 px-1 rounded">
                  {cam.direction || 'SOUTHBOUND'}
                </div>
              </div>

              {/* Camera Metadata Card */}
              <div className="p-3 flex flex-col gap-1.5 text-xs font-sans">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-100 text-xs truncate" title={cam.name}>
                    {cam.name}
                  </h4>
                </div>

                <div className="text-[10px] text-purple-400 font-mono flex items-center justify-between">
                  <span>Assigned Road: {cam.road_id}</span>
                  <span className="text-slate-400">Lat: {cam.latitude.toFixed(3)}</span>
                </div>

                <div className="grid grid-cols-2 gap-1.5 pt-1.5 border-t border-purple-950 text-[10px] font-mono">
                  <div className="bg-[#121422] p-1 rounded text-center">
                    <div className="text-slate-500 text-[8px]">ACTIVE FLOW</div>
                    <div className="text-slate-200 font-bold">{cam.active_vehicles || 42} veh</div>
                  </div>
                  <div className="bg-[#121422] p-1 rounded text-center">
                    <div className="text-slate-500 text-[8px]">TOTAL 24H</div>
                    <div className="text-purple-300 font-bold">{(cam.total_detections_today || 18450).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

'use client'

import React, { useState } from 'react'
import SensorMatrix3DCanvas from '../SensorMatrix3DCanvas'
import { 
  Video, 
  Car, 
  Radio, 
  Compass, 
  ShieldAlert, 
  MapPin, 
  Eye, 
  CheckCircle2, 
  AlertTriangle,
  Clock,
  Layers,
  ExternalLink,
  Search
} from 'lucide-react'

interface CCTVTrackingHubViewProps {
  onNavigate: (viewId: string) => void
}

export default function CCTVTrackingHubView({ onNavigate }: CCTVTrackingHubViewProps) {
  const [selectedCamId, setSelectedCamId] = useState<string>('CAM NE-001')

  const cameraFeeds = [
    {
      id: 'CAM NE-001',
      name: 'Chandni Chowk Junction',
      time: '14:28:12',
      status: 'FACE_MATCH',
      statusColor: 'bg-red-950/90 text-red-300 border-red-500/50',
      plate: 'DL 4C AB 1234',
      conf: '94.7%',
      speed: '42 km/h',
      target: 'S-201 (Sayed Khan)',
      image: '/images/cctv_suv_tracking.jpg',
      boxPos: { top: '28%', left: '20%', width: '45%', height: '48%' },
      detections: [
        { id: 'ANPR DET: DL-4C-AB-1234', time: '14:28:12', conf: '94.7%', status: 'LOGGED', color: 'text-emerald-400 bg-emerald-950/70 border-emerald-500/40', meta: 'Toyota Fortuner (White) • Matched Target S-201 Vehicle Registry' },
        { id: 'FACE DET: SAYED AL-HASSAN', time: '14:28:10', conf: '92.1%', status: 'CONFIRMED', color: 'text-red-400 bg-red-950/70 border-red-500/40', meta: 'Biometric cross-verification against Interpol dossier ALPHA-201' }
      ]
    },
    {
      id: 'CAM CP-004',
      name: 'Airport Departure T3',
      time: '14:10:44',
      status: 'ANPR_PASS',
      statusColor: 'bg-cyan-950/90 text-cyan-300 border-cyan-500/50',
      plate: 'HR 26 XX 8812',
      conf: '89.2%',
      speed: '58 km/h',
      target: 'S-109 (Verma)',
      image: '/images/cctv_cam_01.jpg',
      boxPos: { top: '35%', left: '35%', width: '40%', height: '42%' },
      detections: [
        { id: 'ANPR DET: HR 26 XX 8812', time: '14:10:44', conf: '89.2%', status: 'LOGGED', color: 'text-cyan-400 bg-cyan-950/70 border-cyan-500/40', meta: 'Black Honda City • Passed VIP Departure Gate checkpoint' }
      ]
    },
    {
      id: 'CAM SW-014',
      name: 'Industrial Sector C Entrance',
      time: '14:31:50',
      status: 'ANPR_MATCH',
      statusColor: 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50',
      plate: 'MH 12 PQ 9988',
      conf: '98.5%',
      speed: '34 km/h',
      target: 'Syndicate Logistics',
      image: '/images/cctv_suv_tracking.jpg',
      boxPos: { top: '22%', left: '25%', width: '50%', height: '52%' },
      detections: [
        { id: 'ANPR DET: MH 12 PQ 9988', time: '14:31:50', conf: '98.5%', status: 'INTERCEPT_DEPLOYED', color: 'text-red-400 bg-red-950/70 border-red-500/40', meta: 'Commercial Transit Van • Cash haul structuring corridor #7' }
      ]
    },
    {
      id: 'CAM WS-802',
      name: 'Old Railway Crossing',
      time: '14:32:01',
      status: 'DISPATCH_ALERT',
      statusColor: 'bg-amber-950/90 text-amber-300 border-amber-500/50',
      plate: 'DL 01 AA 4001',
      conf: '91.8%',
      speed: '28 km/h',
      target: 'Perimeter Breach',
      image: '/images/cctv_cam_01.jpg',
      boxPos: { top: '30%', left: '40%', width: '38%', height: '40%' },
      detections: [
        { id: 'ANPR DET: DL 01 AA 4001', time: '14:32:01', conf: '91.8%', status: 'DISPATCH_ALERT', color: 'text-amber-400 bg-amber-950/70 border-amber-500/40', meta: 'Unregistered transport vehicle loitering near signal box' }
      ]
    },
    {
      id: 'CAM EC-092',
      name: 'Toll Road Terminal',
      time: '14:30:19',
      status: 'INTERCEPT_DEPLOYED',
      statusColor: 'bg-purple-950/90 text-purple-300 border-purple-500/50',
      plate: 'UP 16 Z 9090',
      conf: '96.2%',
      speed: '65 km/h',
      target: 'Intercept Zone',
      image: '/images/cctv_suv_tracking.jpg',
      boxPos: { top: '25%', left: '30%', width: '42%', height: '46%' },
      detections: [
        { id: 'ANPR DET: UP 16 Z 9090', time: '14:30:19', conf: '96.2%', status: 'LOGGED', color: 'text-purple-400 bg-purple-950/70 border-purple-500/40', meta: 'Toll plaza electronic tag matched to dummy company front' }
      ]
    }
  ]

  const activeCam = cameraFeeds.find(c => c.id === selectedCamId) || cameraFeeds[0]

  return (
    <div className="flex-1 flex flex-col p-3.5 gap-3.5 overflow-y-auto bg-[#04070D] text-slate-100 font-sans select-none">
      
      {/* ============================================================ */}
      {/* 1. TOP 5-CAM MATRIX GRID */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {cameraFeeds.map(cam => {
          const isSelected = selectedCamId === cam.id
          return (
            <div
              key={cam.id}
              onClick={() => setSelectedCamId(cam.id)}
              className={`cyber-panel rounded-lg p-2.5 flex flex-col justify-between cursor-pointer transition relative overflow-hidden ${
                isSelected ? 'border-cyan-400 shadow-[0_0_15px_rgba(0,229,255,0.25)] bg-[#09111e]' : 'hover:border-cyan-500/40'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
                <span className="text-white font-bold">{cam.id}</span>
                <span className="text-slate-400">{cam.time}</span>
              </div>

              {/* Mini Lens View */}
              <div className="h-28 bg-[#020509] rounded border border-slate-800/80 relative overflow-hidden flex flex-col justify-between p-1.5 my-1">
                <img 
                  src={cam.image || '/images/cctv_suv_tracking.jpg'} 
                  alt={cam.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-50 pointer-events-none"
                />
                <div className="scanline" />
                
                <div className="flex items-center justify-between z-10 text-[8px] font-mono">
                  <span className="bg-black/70 px-1 py-0.5 rounded text-slate-300 border border-slate-700/60 truncate max-w-[110px]">
                    {cam.name}
                  </span>
                  <span className="flex items-center gap-1 text-red-400 font-bold bg-black/60 px-1 py-0.5 rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    LIVE
                  </span>
                </div>

                <div 
                  className="absolute border border-cyan-400 bg-cyan-500/10 rounded"
                  style={cam.boxPos}
                >
                  <span className="absolute -top-3 left-0 bg-cyan-950 text-cyan-300 border border-cyan-400 text-[7px] font-mono px-0.5 rounded">
                    {cam.conf}
                  </span>
                  <div className="absolute -bottom-3 left-0 bg-black/80 text-[7px] font-mono text-white px-1 rounded border border-cyan-500/50 truncate">
                    {cam.plate}
                  </div>
                </div>

                <div className="z-10 flex items-center justify-between text-[8px] font-mono">
                  <span className="text-slate-400">{cam.speed}</span>
                  <span className={`px-1 py-0.2 rounded border font-bold ${cam.statusColor}`}>
                    {cam.status}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[9px] font-mono pt-1 text-slate-400">
                <span className="truncate">{cam.target}</span>
                <span className="text-cyan-400 font-bold">{cam.conf}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* ============================================================ */}
      {/* 2. BOTTOM SPLIT: Real-Time Detection Log vs. Target Vehicles & Sensor Map */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 flex-1 min-h-[320px]">
        
        {/* Left (7 cols): Real-Time Detection Log for Selected Camera */}
        <div className="lg:col-span-7 cyber-panel rounded-lg p-3.5 flex flex-col">
          
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 mb-2 flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded overflow-hidden border border-cyan-400/80 shadow-[0_0_8px_rgba(0,229,255,0.4)] shrink-0 bg-[#060A14]">
                <img src="/images/crimegraph_logo_emblem.jpg" alt="CrimeGraph AI" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xs font-mono font-bold tracking-wider text-white uppercase">
                REAL-TIME DETECTION LOG [{activeCam.id}]
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/50 font-bold">
              CONFIDENCE: {activeCam.conf} [TARGET VEHICLE MATCH]
            </span>
          </div>

          {/* Active Camera Live Snapshot Banner */}
          <div className="relative w-full h-44 rounded-lg overflow-hidden border border-cyan-500/50 bg-[#020509] mb-3 group shadow-inner">
            <img 
              src={activeCam.image || '/images/cctv_suv_tracking.jpg'} 
              alt={activeCam.name}
              className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition"
            />
            <div className="scanline pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020509] via-transparent to-transparent pointer-events-none" />
            
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 border border-cyan-400 text-[9px] font-mono text-cyan-300 font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              LIVE OCR TRACKING: {activeCam.id} • {activeCam.name}
            </div>
            
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-cyan-950/90 border border-cyan-400 text-[10px] font-mono text-cyan-300 font-bold">
              ANPR CONF: {activeCam.conf}
            </div>

            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] font-mono text-white bg-black/75 px-3 py-1.5 rounded backdrop-blur-sm border border-slate-800">
              <span className="text-amber-400 font-bold">PLATE: {activeCam.plate}</span>
              <span className="text-slate-300">{activeCam.target}</span>
              <span className="text-cyan-400 font-bold">{activeCam.speed}</span>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-2 overflow-y-auto pr-1">
            {activeCam.detections.map((det, i) => (
              <div
                key={i}
                onClick={() => onNavigate('digital_twin')}
                className="bg-[#020509]/80 border border-slate-800/80 hover:border-cyan-500/50 p-2.5 rounded flex flex-col gap-1 cursor-pointer transition font-mono"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="text-cyan-300 font-bold">{det.id}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-[10px]">{det.time}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded border font-bold ${det.color}`}>
                      {det.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-300">
                  <span>{activeCam.name}</span>
                  <span className="text-cyan-400 font-bold">CONF: {det.conf}</span>
                </div>
                <div className="text-[10px] text-slate-500">
                  {det.meta}
                </div>
              </div>
            ))}

            {/* Other recent global matches */}
            <div className="text-[10px] font-mono text-slate-500 uppercase mt-2 pt-1 border-t border-slate-800">
              CORRELATED SENSOR MATCHES (OTHER NODES):
            </div>

            <div 
              onClick={() => onNavigate('digital_twin')}
              className="bg-[#020509]/60 border border-slate-800/60 p-2 rounded flex items-center justify-between font-mono text-xs cursor-pointer hover:border-slate-700"
            >
              <div>
                <span className="text-slate-300 font-bold">ANPR DET: MH 12 PQ 9988</span>
                <div className="text-[10px] text-slate-500">Industrial Sector C Entrance • Sector 4 Ring</div>
              </div>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/40 font-bold">
                INTERCEPT
              </span>
            </div>
          </div>

        </div>

        {/* Right (5 cols): Live Target Vehicles List & City Sensor Map */}
        <div className="lg:col-span-5 cyber-panel rounded-lg p-3.5 flex flex-col gap-3">
          
          <div>
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 mb-2">
              <div className="flex items-center gap-2">
                <Car className="w-3.5 h-3.5 text-cyan-400" />
                <h3 className="text-xs font-mono font-bold tracking-wider text-white uppercase">
                  LIVE TARGET VEHICLES LIST (3)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">ACTIVE TRACKING</span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div 
                onClick={() => onNavigate('digital_twin')}
                className="bg-[#020509] border border-cyan-500/40 p-2 rounded flex items-center justify-between cursor-pointer hover:border-cyan-300 transition"
              >
                <div>
                  <div className="text-cyan-300 font-bold">DL 4C AB 1234</div>
                  <div className="text-[10px] text-slate-400">White Toyota Fortuner</div>
                </div>
                <div className="text-right">
                  <div className="text-red-400 text-[10px] font-bold">LAST: CAM NE-001</div>
                  <div className="text-[9px] text-slate-500">1m ago</div>
                </div>
              </div>

              <div 
                onClick={() => onNavigate('digital_twin')}
                className="bg-[#020509] border border-slate-800 p-2 rounded flex items-center justify-between cursor-pointer hover:border-cyan-500/40 transition"
              >
                <div>
                  <div className="text-slate-200 font-bold">HR 26 XX 8812</div>
                  <div className="text-[10px] text-slate-400">Black Honda City</div>
                </div>
                <div className="text-right">
                  <div className="text-amber-400 text-[10px] font-bold">LAST: CAM SW-014</div>
                  <div className="text-[9px] text-slate-500">15m ago</div>
                </div>
              </div>

              <div 
                onClick={() => onNavigate('digital_twin')}
                className="bg-[#020509] border border-slate-800 p-2 rounded flex items-center justify-between cursor-pointer hover:border-cyan-500/40 transition"
              >
                <div>
                  <div className="text-slate-200 font-bold">MH 12 PQ 9988</div>
                  <div className="text-[10px] text-slate-400">Transit Cargo Van</div>
                </div>
                <div className="text-right">
                  <div className="text-emerald-400 text-[10px] font-bold">LAST: CAM SW-014</div>
                  <div className="text-[9px] text-slate-500">4m ago</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <div className="text-xs font-mono font-bold tracking-wider text-white uppercase mb-2 flex items-center justify-between">
              <span>CITY SENSOR POSITIONS MAP</span>
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
            </div>

            <div className="flex-1 bg-[#020509] rounded border border-cyan-900/40 relative overflow-hidden min-h-[140px] shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
              <SensorMatrix3DCanvas 
                onSelectCamera={(camId) => setSelectedCamId(camId)}
                onExploreTwin={() => onNavigate('digital_twin')}
              />
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}

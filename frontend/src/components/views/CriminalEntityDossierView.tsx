'use client'

import React, { useState } from 'react'
import EntityTopology3DCanvas from '../EntityTopology3DCanvas'
import Radar3DCanvas from '../Radar3DCanvas'
import { 
  User, 
  Fingerprint, 
  MapPin, 
  Radio, 
  DollarSign, 
  Clock, 
  FileText, 
  ShieldAlert, 
  ExternalLink,
  ArrowRight,
  BookmarkPlus,
  Compass,
  CheckCircle2,
  DownloadCloud,
  X,
  ChevronDown
} from 'lucide-react'

interface CriminalEntityDossierViewProps {
  onNavigate: (viewId: string) => void
}

export default function CriminalEntityDossierView({ onNavigate }: CriminalEntityDossierViewProps) {
  const [selectedSuspectId, setSelectedSuspectId] = useState<'kahn' | 'viktor' | 'rahul'>('kahn')
  const [isWatchlisted, setIsWatchlisted] = useState(true)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)

  const suspectsData = {
    kahn: {
      id: 'ENTITY CG-2024-ALPHA-201',
      name: 'SAYED AL-HASSAN KHAN',
      rating: '94% CRITICAL',
      aliases: 'Aliases: "The Baker" • "Hawala Uncle" • Syndicate Coordinator',
      photo: '/images/suspect_sayed_khan.jpg',
      height: '178 cm',
      gender: 'MALE',
      fingerprints: 'ON RECORD [MATCH_SEC_8]',
      location: 'Chandni Chowk, DL (Sector 4)',
      coordinates: '28.6562° N, 77.2410° E',
      transferAmount: '$45,000 TRANSFER',
      transferTarget: 'CORP_Z SHELL LTD',
      transferOrigin: 'AL-HASSAN KHAN',
      transferDate: '2024-01-24',
      topologyNodes: [
        { id: 'CELL-827', x: 50, y: 70, r: 10, color: '#00e5ff' },
        { id: 'S-201', x: 130, y: 70, r: 14, color: '#ef4444' },
        { id: 'S-109', x: 210, y: 40, r: 10, color: '#a855f7' },
        { id: 'HAWALA-07', x: 210, y: 100, r: 10, color: '#f59e0b' },
      ],
      timeline: [
        { time: '14:12', title: 'Burner phone activated', desc: 'CELL-827 pinged tower Chandni Chowk Sector 4', dot: 'bg-cyan-400', border: 'border-cyan-500' },
        { time: '11:50', title: 'Transaction approved ($45K)', desc: 'Traced to offshore holding subsidiary CORP_Z LTD', dot: 'bg-amber-400', border: 'border-amber-500' },
        { time: '09:22', title: 'Spotted via CAM NE-001', desc: 'Toyota Fortuner DL 4C AB 1234 verified via ANPR OCR', dot: 'bg-red-500', border: 'border-red-500' },
        { time: '07:10', title: 'Encrypted message burst', desc: '12 packets exchanged with Node S-109 (Verma)', dot: 'bg-purple-400', border: 'border-purple-500' }
      ]
    },
    viktor: {
      id: 'ENTITY CG-2024-ALPHA-003',
      name: 'VIKTOR RAO',
      rating: '98% CRITICAL (KINGPIN)',
      aliases: 'Aliases: "The Ghost" • "VR" • Strategic Financier',
      photo: '/images/suspect_viktor_rao.jpg',
      height: '183 cm',
      gender: 'MALE',
      fingerprints: 'INTERPOL RED NOTICE #8841',
      location: 'Dubai Marina & Bangalore Central',
      coordinates: '25.0772° N, 55.1333° E',
      transferAmount: '$1,200,000 ESCROW',
      transferTarget: 'OVERSEAS TREASURY CORP',
      transferOrigin: 'VIKTOR RAO HOLDINGS',
      transferDate: '2024-01-20',
      topologyNodes: [
        { id: 'SHELL-DBX', x: 50, y: 70, r: 12, color: '#f59e0b' },
        { id: 'VIKTOR-P03', x: 130, y: 70, r: 16, color: '#ef4444' },
        { id: 'RAHUL-P01', x: 210, y: 40, r: 12, color: '#00e5ff' },
        { id: 'HAWALA-CORE', x: 210, y: 100, r: 12, color: '#a855f7' },
      ],
      timeline: [
        { time: 'Yesterday', title: 'Offshore wire clearance', desc: 'Beneficial ownership masked behind nominee director', dot: 'bg-amber-400', border: 'border-amber-500' },
        { time: '3 days ago', title: 'Satellite phone activation', desc: 'Iridium uplink detected in international airspace', dot: 'bg-red-500', border: 'border-red-500' },
        { time: '1 week ago', title: 'Cross-border proxy meeting', desc: 'Broker Vikram Malhotra routed payment schedules', dot: 'bg-purple-400', border: 'border-purple-500' }
      ]
    },
    rahul: {
      id: 'ENTITY CG-2024-ALPHA-101',
      name: 'RAHUL KUMAR',
      rating: '82% HIGH (FRONT OPERATIVE)',
      aliases: 'Aliases: "RK Logistics" • "Mule Handler"',
      photo: '/images/suspect_sayed_khan.jpg',
      height: '172 cm',
      gender: 'MALE',
      fingerprints: 'ON RECORD [DELHI POLICE]',
      location: 'Connaught Place Sector 2',
      coordinates: '28.6315° N, 77.2167° E',
      transferAmount: '$24,500 DISBURSED',
      transferTarget: 'MULE CHAIN #4',
      transferOrigin: 'RAHUL KUMAR',
      transferDate: '2024-01-22',
      topologyNodes: [
        { id: 'ATM-BLR', x: 50, y: 70, r: 10, color: '#a855f7' },
        { id: 'RAHUL-P01', x: 130, y: 70, r: 13, color: '#00e5ff' },
        { id: 'MULE-AC1', x: 210, y: 40, r: 10, color: '#f59e0b' },
        { id: 'MULE-AC2', x: 210, y: 100, r: 10, color: '#f59e0b' },
      ],
      timeline: [
        { time: '13:40', title: 'Cash structuring withdrawal', desc: '5 micro-withdrawals of $4,900 each from 3 ATM branches', dot: 'bg-amber-400', border: 'border-amber-500' },
        { time: '10:15', title: 'CDR handoff to Sayed Khan', desc: '384s duration encrypted VOIP connection recorded', dot: 'bg-cyan-400', border: 'border-cyan-500' },
      ]
    }
  }

  const current = suspectsData[selectedSuspectId]

  return (
    <div className="flex-1 flex flex-col p-3.5 gap-3.5 overflow-y-auto bg-[#04070D] text-slate-100 font-sans select-none">
      
      {/* ============================================================ */}
      {/* 1. SUSPECT DOSSIER HERO BANNER */}
      {/* ============================================================ */}
      <div className="cyber-panel p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-l-4 border-l-red-500">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden border border-cyan-400/80 shadow-[0_0_15px_rgba(0,229,255,0.35)] shrink-0 bg-[#060A14] flex items-center justify-center">
            <img src="/images/crimegraph_logo_emblem.jpg" alt="CrimeGraph AI Insignia" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-red-950 text-red-300 border border-red-500/50 font-bold">
                HIGH RISK PROFILE
              </span>
              <span className="text-xs font-mono text-cyan-400 font-bold">
                {current.id}
              </span>
              <span className="text-slate-500">|</span>
              <span className="text-xs font-mono text-red-400 font-bold">
                RATING: {current.rating}
              </span>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black font-mono tracking-wide text-white">
                {current.name}
              </h1>

              {/* Suspect Switcher Dropdown */}
              <select
                value={selectedSuspectId}
                onChange={e => setSelectedSuspectId(e.target.value as any)}
                className="bg-[#0b101c] border border-cyan-500/40 rounded px-2 py-1 text-xs text-cyan-300 font-mono outline-none cursor-pointer"
              >
                <option value="kahn">Sayed Khan (Coordinator)</option>
                <option value="viktor">Viktor Rao (Kingpin)</option>
                <option value="rahul">Rahul Kumar (Mule Handler)</option>
              </select>
            </div>

            <p className="text-xs text-slate-400 font-mono mt-0.5">
              {current.aliases}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 font-mono text-xs flex-wrap">
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="px-3 py-1.5 rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/60 text-cyan-200 font-bold transition flex items-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(0,229,255,0.2)]"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>GENERATE REPORT</span>
          </button>
          
          <button
            onClick={() => setIsWatchlisted(!isWatchlisted)}
            className={`px-3 py-1.5 rounded border transition flex items-center gap-1.5 cursor-pointer ${
              isWatchlisted
                ? 'bg-amber-950 text-amber-300 border-amber-500 font-bold shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200'
            }`}
          >
            <BookmarkPlus className="w-3.5 h-3.5 text-amber-400" />
            <span>{isWatchlisted ? 'ON WATCHLIST' : 'ADD WATCHLIST'}</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. THREE-COLUMN DOSSIER BODY */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 flex-1 min-h-[450px]">
        
        {/* Left Column (4 cols): Biometrics & Last Known Location Map */}
        <div className="lg:col-span-4 flex flex-col gap-3.5">
          
          {/* Biometric Identification */}
          <div className="cyber-panel p-3.5 rounded-lg flex flex-col gap-2.5">
            <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold border-b border-cyan-900/30 pb-1.5 flex items-center justify-between">
              <span>BIOMETRIC IDENTIFICATION & MUGSHOT</span>
              <Fingerprint className="w-3.5 h-3.5 text-cyan-400" />
            </div>

            {/* Suspect Photo with Cyber HUD Scanner Overlay */}
            <div className="relative w-full h-48 rounded-lg overflow-hidden border border-cyan-500/50 bg-[#020509] group shadow-inner">
              <img 
                src={current.photo || '/images/suspect_sayed_khan.jpg'} 
                alt={current.name}
                className="w-full h-full object-cover object-top opacity-90 transition group-hover:scale-105"
              />
              <div className="scanline pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020509] via-transparent to-transparent pointer-events-none" />
              
              {/* Top HUD Badges */}
              <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/80 border border-cyan-400 text-[9px] font-mono text-cyan-300 font-bold">
                FACE_REC: 99.4%
              </div>
              <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-red-950/90 border border-red-500 text-[9px] font-mono text-red-300 font-bold animate-pulse">
                RED NOTICE
              </div>

              {/* Bottom Biometric Tag */}
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[9px] font-mono text-slate-200 bg-black/70 px-2 py-1 rounded backdrop-blur-sm border border-slate-800">
                <span>BIO_SIG: #77482-B</span>
                <span className="text-cyan-400 font-bold">{current.id}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-[#020509] p-2 rounded border border-slate-800">
                <div className="text-[9px] text-slate-500">HEIGHT</div>
                <div className="font-bold text-slate-100">{current.height}</div>
              </div>
              <div className="bg-[#020509] p-2 rounded border border-slate-800">
                <div className="text-[9px] text-slate-500">GENDER</div>
                <div className="font-bold text-slate-100">{current.gender}</div>
              </div>
              <div className="bg-[#020509] p-2 rounded border border-slate-800 col-span-2">
                <div className="text-[9px] text-slate-500">FINGERPRINTS</div>
                <div className="font-bold text-emerald-400 text-[11px]">
                  {current.fingerprints}
                </div>
              </div>
              <div className="bg-[#020509] p-2 rounded border border-slate-800 col-span-2">
                <div className="text-[9px] text-slate-500">LAST KNOWN LOC</div>
                <div className="font-bold text-slate-100 text-[11px] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-red-400 shrink-0" />
                  <span>{current.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Last Known Location Sensor Map (Polar HUD) */}
          <div className="cyber-panel p-3.5 rounded-lg flex-1 flex flex-col">
            <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold mb-2 flex items-center justify-between">
              <span>LAST KNOWN LOCATION SENSOR MAP</span>
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
            </div>

            <div className="flex-1 bg-[#020509] rounded border border-cyan-900/40 relative overflow-hidden min-h-[160px] shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
              <Radar3DCanvas 
                targetName={current.name}
                coordinates="28.6562° N, 77.2410° E"
                geoAccuracy="98.4%"
                onExplore={() => onNavigate('digital_twin')}
              />
            </div>
          </div>

        </div>

        {/* Middle Column (4 cols): Edge Topology & Shell Pipeline */}
        <div className="lg:col-span-4 flex flex-col gap-3.5">
          
          {/* Communication Edge Topology */}
          <div className="cyber-panel p-3.5 rounded-lg flex-1 flex flex-col">
            <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold mb-2 flex items-center justify-between border-b border-cyan-900/30 pb-1.5">
              <span>COMMUNICATION EDGE TOPOLOGY [CDR CO-LOCATIONS]</span>
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
            </div>

            <div className="flex-1 bg-[#020509] rounded border border-cyan-900/40 relative overflow-hidden min-h-[140px] shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
              <EntityTopology3DCanvas 
                targetLabel={current.name}
                targetId={current.id}
                onSelectNode={(nodeId) => onNavigate('network')}
              />
            </div>
          </div>

          {/* Shell Transaction Pipeline Correlator */}
          <div className="cyber-panel p-3.5 rounded-lg flex flex-col gap-2 border-l-4 border-l-amber-400">
            <div className="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-bold flex items-center justify-between border-b border-amber-900/30 pb-1.5">
              <span>SHELL TRANSACTION PIPELINE CORRELATOR</span>
              <DollarSign className="w-3.5 h-3.5 text-amber-400" />
            </div>

            <div className="bg-[#020509] p-2.5 rounded border border-amber-500/30 text-xs font-mono space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[10px]">TRANSFER AMOUNT:</span>
                <span className="text-amber-400 font-bold text-sm">{current.transferAmount}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-300">ORIGIN: {current.transferOrigin}</span>
                <ArrowRight className="w-3 h-3 text-amber-400" />
                <span className="text-slate-200 font-bold">{current.transferTarget}</span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800">
                <span>DATE: {current.transferDate}</span>
                <span className="text-emerald-400">STATUS: RECONCILED</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (4 cols): Tactical Intel Activity Timeline */}
        <div className="lg:col-span-4 cyber-panel p-3.5 rounded-lg flex flex-col">
          <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold mb-3 flex items-center justify-between border-b border-cyan-900/30 pb-1.5">
            <span>TACTICAL INTEL ACTIVITY TIMELINE</span>
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
          </div>

          <div className="flex-1 flex flex-col gap-3 font-mono text-xs overflow-y-auto pr-1">
            {current.timeline.map((ev, idx) => (
              <div key={idx} className={`border-l-2 ${ev.border} pl-3 relative py-0.5`}>
                <div className={`absolute -left-[5px] top-1.5 w-2 h-2 rounded-full ${ev.dot}`} />
                <div className="flex items-center justify-between">
                  <span className="text-slate-100 font-bold">{ev.title}</span>
                  <span className="text-slate-500 text-[10px]">{ev.time}</span>
                </div>
                <div className="text-[11px] text-slate-400 leading-snug mt-0.5">
                  {ev.desc}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigate('evidence')}
            className="w-full mt-3 py-2 bg-[#020509] hover:bg-slate-800 border border-cyan-500/40 rounded text-cyan-300 font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>VIEW COMPLETE FORENSIC TRAIL</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* ============================================================ */}
      {/* MODAL: GENERATE DOSSIER REPORT */}
      {/* ============================================================ */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#060A14] border border-cyan-500/60 rounded-xl p-5 w-full max-w-lg shadow-[0_0_40px_rgba(0,229,255,0.3)] font-mono text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-cyan-900/50 pb-2 mb-3">
              <div className="text-white font-bold flex items-center gap-2.5">
                <div className="w-6 h-6 rounded overflow-hidden border border-cyan-400/80 shadow-[0_0_8px_rgba(0,229,255,0.4)] shrink-0 bg-[#060A14]">
                  <img src="/images/crimegraph_logo_emblem.jpg" alt="" className="w-full h-full object-cover" />
                </div>
                <span>INTELLIGENCE DOSSIER REPORT: {current.name}</span>
              </div>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-slate-300 text-xs">
              <div className="bg-[#020509] p-3 rounded border border-slate-800 space-y-1">
                <div className="text-cyan-400 font-bold">CASE FILE: CG-2024-0847 (Hawala Western Corridor)</div>
                <div>CLASSIFICATION: TIER 1 RESTRICTED LAW ENFORCEMENT DOSSIER</div>
                <div>GENERATED BY: AGENT A. KAHN (SEC_LEVEL_4)</div>
                <div>HASH_PROOF: SHA256-8a42c90f238d102e88a19de19</div>
              </div>

              <div>
                <div className="text-white font-bold mb-1">EXECUTIVE SUMMARY:</div>
                <p className="leading-relaxed text-[11px] text-slate-300">
                  Target {current.name} ({current.id}) is identified as the primary operational coordinator of the clandestine financial routing pipeline bypassing verified clearinghouses. Intercepted signals confirm regular burner phone activations linking to offshore shell accounts.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                <a
                  href={`/api/vault/export`}
                  download
                  className="px-3 py-1.5 rounded bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 font-bold flex items-center gap-1.5"
                >
                  <DownloadCloud className="w-3.5 h-3.5" />
                  <span>EXPORT VAULT ZIP</span>
                </a>

                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-bold shadow-[0_0_10px_#00e5ff]"
                >
                  PRINT PDF REPORT
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

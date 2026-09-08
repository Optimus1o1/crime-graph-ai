'use client'

import React, { useState } from 'react'
import EntityTopology3DCanvas from '../EntityTopology3DCanvas'
import Radar3DCanvas from '../Radar3DCanvas'
import BiometricFingerprintModal from '../BiometricFingerprintModal'
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
  const [isFingerprintModalOpen, setIsFingerprintModalOpen] = useState(false)

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
      photo: '/images/suspect_rahul_kumar.jpg',
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
    <div className="flex-1 flex flex-col p-4 sm:p-5 gap-4 sm:gap-5 overflow-y-auto bg-[#04070D] text-slate-100 font-sans select-none">
      
      {/* ============================================================ */}
      {/* 1. SUSPECT DOSSIER HERO BANNER */}
      {/* ============================================================ */}
      <div className="cyber-panel p-5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-l-4 border-l-red-500 bg-[#080d1a]/80 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl overflow-hidden border border-cyan-400/80 shadow-[0_0_15px_rgba(0,229,255,0.35)] shrink-0 bg-[#060A14] flex items-center justify-center">
            <img src="/images/crimegraph_logo_emblem.jpg" alt="CrimeGraph AI Insignia" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-red-950 text-red-300 border border-red-500/50 font-bold">
                HIGH RISK PROFILE
              </span>
              <span className="text-xs font-mono text-cyan-400 font-bold">
                {current.id}
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-xs font-mono text-red-400 font-bold">
                RATING: {current.rating}
              </span>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black font-sans tracking-wide text-white">
                {current.name}
              </h1>

              {/* Suspect Switcher Dropdown */}
              <select
                value={selectedSuspectId}
                onChange={e => setSelectedSuspectId(e.target.value as any)}
                className="bg-[#0b101c] border border-cyan-500/50 rounded-lg px-3 py-1.5 text-xs sm:text-sm text-cyan-300 font-mono outline-none cursor-pointer hover:border-cyan-400 transition"
              >
                <option value="kahn">Sayed Khan (Coordinator)</option>
                <option value="viktor">Viktor Rao (Kingpin)</option>
                <option value="rahul">Rahul Kumar (Mule Handler)</option>
              </select>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 font-sans mt-1">
              {current.aliases}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 text-xs sm:text-sm flex-wrap">
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/60 text-cyan-200 font-bold transition flex items-center gap-2 cursor-pointer shadow-[0_0_12px_rgba(0,229,255,0.25)]"
          >
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>GENERATE REPORT</span>
          </button>
          
          <button
            onClick={() => setIsWatchlisted(!isWatchlisted)}
            className={`px-4 py-2 rounded-lg border transition flex items-center gap-2 cursor-pointer font-bold ${
              isWatchlisted
                ? 'bg-amber-950/80 text-amber-300 border-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200'
            }`}
          >
            <BookmarkPlus className="w-4 h-4 text-amber-400" />
            <span>{isWatchlisted ? 'ON WATCHLIST' : 'ADD WATCHLIST'}</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. THREE-COLUMN DOSSIER BODY */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-[480px]">
        
        {/* Left Column (4 cols): Biometrics & Last Known Location Map */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          {/* Biometric Identification */}
          <div className="cyber-panel p-4 rounded-xl flex flex-col gap-3 bg-[#080d1a]/80 shadow-lg border border-cyan-900/40">
            <div className="text-xs font-mono text-cyan-300 uppercase tracking-wider font-bold border-b border-cyan-900/40 pb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-cyan-400" />
                <span>BIOMETRIC IDENTIFICATION</span>
              </span>
              <button
                type="button"
                onClick={() => setIsFingerprintModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-950/90 hover:bg-cyan-900 border border-cyan-500/60 text-cyan-300 hover:text-cyan-200 text-xs font-mono font-bold transition cursor-pointer shadow-[0_0_12px_rgba(0,229,255,0.25)] group"
                title="Launch Automated Fingerprint Identification System (AFIS) Comparator"
              >
                <Fingerprint className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform animate-pulse" />
                <span>SCAN AFIS</span>
              </button>
            </div>

            {/* Suspect Photo with Cyber HUD Scanner Overlay */}
            <div className="relative w-full h-72 sm:h-80 rounded-xl overflow-hidden border border-cyan-500/60 bg-[#020509] group shadow-[0_0_20px_rgba(0,229,255,0.15)]">
              <img 
                src={current.photo || '/images/suspect_sayed_khan.jpg'} 
                alt={current.name}
                className="w-full h-full object-cover object-[center_35%] opacity-95 transition-transform duration-500 group-hover:scale-105"
              />
              
              {/* Dynamic Biometric Face Tracking Reticle Overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                {/* Facial Recognition Target Box */}
                <div className="w-44 h-48 sm:w-48 sm:h-52 border border-cyan-400/40 rounded-lg relative -translate-y-2">
                  {/* Corner Reticles */}
                  <span className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
                  <span className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
                  <span className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />
                  
                  {/* Biometric Point Crosshairs */}
                  <div className="absolute top-1/3 left-1/4 w-1.5 h-1.5 rounded-full bg-cyan-400/70 animate-ping" />
                  <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 rounded-full bg-cyan-400/70 animate-ping" />
                  <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400/70" />
                  
                  {/* Facial Mesh Wireframe Center Tag */}
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-cyan-950/90 border border-cyan-500/50 text-[10px] font-mono text-cyan-300 whitespace-nowrap">
                    FACIAL MESH: 128 PTS
                  </div>
                </div>
              </div>

              {/* Animated Laser Scanline */}
              <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse shadow-[0_0_10px_#00e5ff] top-1/3 pointer-events-none" />
              <div className="scanline pointer-events-none opacity-40" />

              {/* Subtle Bottom Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#020509]/90 via-transparent to-black/20 pointer-events-none" />
              
              {/* Top HUD Badges */}
              <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/80 border border-cyan-400 text-xs font-mono text-cyan-300 font-bold backdrop-blur-sm">
                FACE_REC: 99.4%
              </div>
              <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-red-950/90 border border-red-500 text-xs font-mono text-red-300 font-bold animate-pulse backdrop-blur-sm">
                RED NOTICE
              </div>

              {/* Bottom Biometric Tag */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs font-mono text-slate-200 bg-black/85 px-3 py-1.5 rounded-lg backdrop-blur-md border border-slate-700/80">
                <span>BIO_SIG: #77482-B</span>
                <span className="text-cyan-400 font-bold">{current.id}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs sm:text-sm">
              <div className="bg-[#020509] p-2.5 rounded-lg border border-slate-800">
                <div className="text-xs text-slate-400 font-medium">HEIGHT</div>
                <div className="font-bold text-slate-100 text-sm mt-0.5">{current.height}</div>
              </div>
              <div className="bg-[#020509] p-2.5 rounded-lg border border-slate-800">
                <div className="text-xs text-slate-400 font-medium">GENDER</div>
                <div className="font-bold text-slate-100 text-sm mt-0.5">{current.gender}</div>
              </div>
              <button
                type="button"
                onClick={() => setIsFingerprintModalOpen(true)}
                className="bg-[#020509] hover:bg-[#071124] p-2.5 rounded-lg border border-slate-800 hover:border-cyan-500/60 col-span-2 text-left transition group cursor-pointer"
                title="Click to launch AFIS Biometric Comparator"
              >
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                    <Fingerprint className="w-3.5 h-3.5 text-cyan-400" />
                    <span>FINGERPRINT BIOMETRICS (AFIS)</span>
                  </div>
                  <span className="text-[11px] font-mono text-cyan-400 group-hover:text-cyan-300 flex items-center gap-1 font-bold">
                    <span>VERIFY AFIS</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
                <div className="font-bold text-emerald-400 text-xs font-mono mt-1 flex items-center justify-between">
                  <span>{current.fingerprints}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/90 text-emerald-300 border border-emerald-500/40">
                    MATCH: 99.8%
                  </span>
                </div>
              </button>
              <div className="bg-[#020509] p-2.5 rounded-lg border border-slate-800 col-span-2">
                <div className="text-xs text-slate-400 font-medium">LAST KNOWN LOCATION</div>
                <div className="font-semibold text-slate-100 text-xs sm:text-sm flex items-center gap-1.5 mt-0.5 font-sans">
                  <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span>{current.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Last Known Location Sensor Map (Polar HUD) */}
          <div className="cyber-panel p-4 rounded-xl flex-1 flex flex-col bg-[#080d1a]/80 shadow-lg border border-cyan-900/40">
            <div className="text-xs font-mono text-cyan-300 uppercase tracking-wider font-bold mb-2.5 flex items-center justify-between">
              <span>LAST KNOWN LOCATION SENSOR MAP</span>
              <Compass className="w-4 h-4 text-cyan-400" />
            </div>

            <div className="flex-1 bg-[#020509] rounded-lg border border-cyan-900/40 relative overflow-hidden min-h-[170px] shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
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
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          {/* Communication Edge Topology */}
          <div className="cyber-panel p-4 rounded-xl flex-1 flex flex-col bg-[#080d1a]/80 shadow-lg border border-cyan-900/40">
            <div className="text-xs font-mono text-cyan-300 uppercase tracking-wider font-bold mb-2.5 flex items-center justify-between border-b border-cyan-900/40 pb-2">
              <span>COMMUNICATION EDGE TOPOLOGY</span>
              <Radio className="w-4 h-4 text-cyan-400" />
            </div>

            <div className="flex-1 bg-[#020509] rounded-lg border border-cyan-900/40 relative overflow-hidden min-h-[150px] shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
              <EntityTopology3DCanvas 
                targetLabel={current.name}
                targetId={current.id}
                onSelectNode={(nodeId) => onNavigate('network')}
              />
            </div>
          </div>

          {/* Shell Transaction Pipeline Correlator */}
          <div className="cyber-panel p-4 rounded-xl flex flex-col gap-2.5 border-l-4 border-l-amber-400 bg-[#080d1a]/80 shadow-lg border border-cyan-900/40">
            <div className="text-xs font-mono text-amber-300 uppercase tracking-wider font-bold flex items-center justify-between border-b border-amber-900/30 pb-2">
              <span>SHELL TRANSACTION CORRELATOR</span>
              <DollarSign className="w-4 h-4 text-amber-400" />
            </div>

            <div className="bg-[#020509] p-3 rounded-lg border border-amber-500/30 text-xs font-sans space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-xs font-medium">TRANSFER AMOUNT:</span>
                <span className="text-amber-400 font-bold font-mono text-base">{current.transferAmount}</span>
              </div>
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-slate-300 font-medium">ORIGIN: {current.transferOrigin}</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-slate-100 font-bold">{current.transferTarget}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800 font-mono">
                <span>DATE: {current.transferDate}</span>
                <span className="text-emerald-400 font-semibold">STATUS: RECONCILED</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (4 cols): Tactical Intel Activity Timeline */}
        <div className="lg:col-span-4 cyber-panel p-4 rounded-xl flex flex-col bg-[#080d1a]/80 shadow-lg border border-cyan-900/40">
          <div className="text-xs font-mono text-cyan-300 uppercase tracking-wider font-bold mb-3 flex items-center justify-between border-b border-cyan-900/40 pb-2">
            <span>TACTICAL INTEL ACTIVITY TIMELINE</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>

          <div className="flex-1 flex flex-col gap-3.5 overflow-y-auto pr-1">
            {current.timeline.map((ev, idx) => (
              <div key={idx} className={`border-l-2 ${ev.border} pl-3.5 relative py-1`}>
                <div className={`absolute -left-[5px] top-2 w-2 h-2 rounded-full ${ev.dot}`} />
                <div className="flex items-center justify-between">
                  <span className="text-slate-100 font-bold text-xs sm:text-sm font-sans">{ev.title}</span>
                  <span className="text-slate-400 text-xs font-mono">{ev.time}</span>
                </div>
                <div className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-0.5 font-sans font-normal">
                  {ev.desc}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigate('evidence')}
            className="w-full mt-4 py-2.5 bg-[#020509] hover:bg-slate-800 border border-cyan-500/40 rounded-lg text-cyan-300 font-sans text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <span>VIEW COMPLETE FORENSIC TRAIL</span>
            <ExternalLink className="w-4 h-4" />
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

      {/* Biometric AFIS Comparator Modal */}
      <BiometricFingerprintModal
        isOpen={isFingerprintModalOpen}
        onClose={() => setIsFingerprintModalOpen(false)}
        suspect={current}
      />

    </div>
  )
}

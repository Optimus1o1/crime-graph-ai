'use client'

import React, { useState, useEffect } from 'react'
import { 
  Fingerprint, 
  X, 
  ShieldCheck, 
  Scan, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Download, 
  Copy, 
  RefreshCw, 
  Eye, 
  Lock, 
  Sparkles,
  Search
} from 'lucide-react'

interface BiometricFingerprintModalProps {
  isOpen: boolean
  onClose: () => void
  suspect: {
    id: string
    name: string
    rating: string
    fingerprints: string
    location: string
  }
}

export default function BiometricFingerprintModal({
  isOpen,
  onClose,
  suspect
}: BiometricFingerprintModalProps) {
  const [isScanning, setIsScanning] = useState(true)
  const [scanProgress, setScanProgress] = useState(0)
  const [showMinutiae, setShowMinutiae] = useState(true)
  const [selectedMinutiae, setSelectedMinutiae] = useState<number | null>(null)
  const [copiedHash, setCopiedHash] = useState(false)
  const [selectedDigit, setSelectedDigit] = useState('R-INDEX')

  // Run scanning animation on open or re-scan
  useEffect(() => {
    if (!isOpen) return

    setIsScanning(true)
    setScanProgress(0)

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsScanning(false)
          return 100
        }
        return prev + 4
      })
    }, 40)

    return () => clearInterval(interval)
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  // Fingerprint data per suspect
  const isViktor = suspect.name.includes('VIKTOR')
  const isRahul = suspect.name.includes('RAHUL')

  const profile = isViktor
    ? {
        afisRecordId: 'INTERPOL-BIO-8841-B',
        patternType: 'Accidental Whorl / Scarred Ridge',
        ridgeCount: 19,
        matchingPoints: 52,
        matchingScore: '99.94%',
        confidenceTier: 'CRITICAL MATCH (INTERPOL)',
        latentOrigin: 'Satellite Phone Casing & Escrow Vault Keypad',
        recoveredBy: 'Special Operations Taskforce / Interpol Lyon Liaison',
        hash: '7c4a8d9b1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b',
        courtAdmissibility: 'BSA 2023 Sec 39 / Interpol Red Notice Annex IV'
      }
    : isRahul
    ? {
        afisRecordId: 'NAFIS-DL-2024-9918-P',
        patternType: 'Right Ulnar Loop (Delta Left)',
        ridgeCount: 16,
        matchingPoints: 39,
        matchingScore: '98.85%',
        confidenceTier: 'DEFINITIVE POSITIVE MATCH',
        latentOrigin: 'ATM Keypad Terminal #04 (Connaught Place Sector 2)',
        recoveredBy: 'Forensic Science Laboratory (FSL) Rohini, Delhi',
        hash: '3d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e',
        courtAdmissibility: 'Indian Evidence Act Sec 45 / BSA 2023 Sec 39'
      }
    : {
        afisRecordId: 'CFSL-CBI-2023-AFIS-4421',
        patternType: 'Composite Double Loop Whorl',
        ridgeCount: 22,
        matchingPoints: 47,
        matchingScore: '99.82%',
        confidenceTier: 'HIGH FIDELITY COURT MATCH',
        latentOrigin: 'Steering Wheel Toyota Fortuner & Hawala Cash Ledger',
        recoveredBy: 'Central Forensic Science Laboratory (CFSL) CBI, New Delhi',
        hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        courtAdmissibility: 'Indian Evidence Act Sec 45 / BSA 2023 Sec 39'
      }

  // Minutiae Galton Points across the fingerprint
  const minutiaePoints = [
    { id: 1, x: 130, y: 90, type: 'Bifurcation', label: 'Bifurcation Alpha-1' },
    { id: 2, x: 170, y: 110, type: 'Ridge Ending', label: 'Ridge Ending Beta-3' },
    { id: 3, x: 105, y: 140, type: 'Island (Dot)', label: 'Island Dot Gamma' },
    { id: 4, x: 155, y: 160, type: 'Core Point', label: 'Primary Core Focus' },
    { id: 5, x: 195, y: 180, type: 'Bifurcation', label: 'Bifurcation Delta-2' },
    { id: 6, x: 120, y: 200, type: 'Ridge Ending', label: 'Ridge Ending Epsilon' },
    { id: 7, x: 165, y: 225, type: 'Lake / Enclosure', label: 'Enclosure Loop Zeta' },
    { id: 8, x: 80, y: 180, type: 'Delta', label: 'Left Triradius Delta' },
    { id: 9, x: 215, y: 195, type: 'Ridge Ending', label: 'Right Ridge Terminus' },
    { id: 10, x: 145, y: 260, type: 'Bifurcation', label: 'Basal Ridge Fork' }
  ]

  const tenPrintCards = [
    { code: 'R-THUMB', label: 'R. Thumb', pattern: 'Whorl', match: false },
    { code: 'R-INDEX', label: 'R. Index', pattern: 'Loop', match: true },
    { code: 'R-MIDDLE', label: 'R. Middle', pattern: 'Loop', match: false },
    { code: 'R-RING', label: 'R. Ring', pattern: 'Whorl', match: false },
    { code: 'R-LITTLE', label: 'R. Pinky', pattern: 'Arch', match: false },
    { code: 'L-THUMB', label: 'L. Thumb', pattern: 'Whorl', match: false },
    { code: 'L-INDEX', label: 'L. Index', pattern: 'Loop', match: false },
    { code: 'L-MIDDLE', label: 'L. Middle', pattern: 'Loop', match: false },
    { code: 'L-RING', label: 'L. Ring', pattern: 'Arch', match: false },
    { code: 'L-LITTLE', label: 'L. Pinky', pattern: 'Loop', match: false }
  ]

  const handleCopyHash = () => {
    navigator.clipboard.writeText(profile.hash)
    setCopiedHash(true)
    setTimeout(() => setCopiedHash(false), 2000)
  }

  const handleExportCertificate = () => {
    const cert = {
      title: 'AFIS Biometric Forensic Evidence Certificate',
      suspect: suspect.name,
      entityId: suspect.id,
      afisRecordId: profile.afisRecordId,
      matchScore: profile.matchingScore,
      patternType: profile.patternType,
      matchingGaltonPoints: profile.matchingPoints,
      latentOrigin: profile.latentOrigin,
      evidenceHashSha256: profile.hash,
      legalStatute: profile.courtAdmissibility,
      timestampUtc: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(cert, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `AFIS_CERTIFICATE_${suspect.id}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-[#060b18] border border-cyan-500/60 rounded-2xl shadow-[0_0_50px_rgba(0,229,255,0.25)] overflow-hidden text-slate-100 font-sans"
        onClick={e => e.stopPropagation()}
      >
        
        {/* ============================================================ */}
        {/* 1. MODAL HEADER */}
        {/* ============================================================ */}
        <div className="px-5 py-4 border-b border-cyan-900/60 bg-[#080f22] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-400/60 flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.35)]">
              <Fingerprint className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black font-sans tracking-wide text-white flex items-center gap-2">
                  <span>AFIS BIOMETRIC SCANNER & COMPARATOR</span>
                </h2>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/50 font-bold">
                  NAFIS / CFSL LIVE
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                SUBJECT: <span className="text-cyan-300 font-bold">{suspect.name}</span> ({suspect.id}) • AFIS REF: <span className="text-purple-300 font-bold">{profile.afisRecordId}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-900/80 hover:bg-red-950 text-slate-400 hover:text-red-300 border border-slate-800 hover:border-red-500/50 transition cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ============================================================ */}
        {/* 2. BODY CONTENT (SPLIT SCREEN: SCANNER vs FORENSIC DOSSIER) */}
        {/* ============================================================ */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 custom-scrollbar">
          
          {/* Left Column (5 Cols): Latent Fingerprint Scanner & Laser HUD */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            <div className="bg-[#030712] border border-cyan-500/50 rounded-xl p-4 relative flex flex-col items-center justify-center overflow-hidden shadow-inner">
              
              {/* Scan Status Pill */}
              <div className="w-full flex items-center justify-between mb-3 text-xs font-mono">
                <span className="text-cyan-400 flex items-center gap-1.5 font-bold">
                  <Scan className="w-3.5 h-3.5 animate-spin" />
                  <span>{isScanning ? `OPTICAL SCANNING: ${scanProgress}%` : 'SCAN ACQUISITION COMPLETE'}</span>
                </span>
                <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">
                  {profile.matchingScore} MATCH
                </span>
              </div>

              {/* Holographic Fingerprint Visualization Box */}
              <div className="relative w-72 h-80 bg-[#02050b] border border-cyan-500/40 rounded-xl flex items-center justify-center overflow-hidden shadow-[0_0_30px_rgba(0,229,255,0.15)]">
                
                {/* SVG Fingerprint Ridges & Galton Minutiae Overlay */}
                <svg viewBox="0 0 300 340" className="w-full h-full p-4">
                  <defs>
                    <linearGradient id="ridgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity="0.7" />
                    </linearGradient>
                    <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="2" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Concentric Fingerprint Loops & Arcs */}
                  <g fill="none" stroke="url(#ridgeGrad)" strokeWidth="2.8" strokeLinecap="round" opacity="0.85">
                    {/* Outer Loops */}
                    <path d="M 60 270 C 40 200, 45 120, 110 70 C 160 30, 230 40, 250 110 C 265 170, 255 240, 240 270" />
                    <path d="M 75 270 C 55 210, 60 135, 115 90 C 155 55, 215 65, 235 120 C 250 170, 240 230, 225 270" />
                    <path d="M 90 270 C 75 220, 80 150, 125 110 C 155 80, 200 85, 220 135 C 230 175, 225 230, 210 270" />
                    
                    {/* Middle Core Loops */}
                    <path d="M 105 270 C 95 230, 95 170, 135 130 C 160 105, 185 110, 200 150 C 210 185, 205 230, 195 270" />
                    <path d="M 120 270 C 115 240, 115 190, 145 155 C 165 135, 175 140, 185 170 C 190 200, 185 240, 180 270" />
                    
                    {/* Center Whorl / Delta Core */}
                    <ellipse cx="150" cy="185" rx="16" ry="24" transform="rotate(-10 150 185)" strokeWidth="3" />
                    <ellipse cx="150" cy="185" rx="8" ry="12" transform="rotate(-10 150 185)" strokeWidth="3.2" />
                    
                    {/* Triradius Delta Ridges */}
                    <path d="M 70 230 L 100 240 L 80 270" stroke="#f59e0b" strokeWidth="2.5" />
                    <path d="M 230 230 L 200 240 L 220 270" stroke="#f59e0b" strokeWidth="2.5" />
                  </g>

                  {/* Minutiae Points (Galton Markers) */}
                  {showMinutiae && minutiaePoints.map(pt => (
                    <g 
                      key={pt.id} 
                      className="cursor-pointer transition-transform hover:scale-125"
                      onClick={() => setSelectedMinutiae(pt.id)}
                    >
                      <circle 
                        cx={pt.x} 
                        cy={pt.y} 
                        r={selectedMinutiae === pt.id ? "6" : "3.5"} 
                        fill={selectedMinutiae === pt.id ? "#ef4444" : "#10b981"} 
                        stroke="#ffffff" 
                        strokeWidth="1.5" 
                      />
                      <circle 
                        cx={pt.x} 
                        cy={pt.y} 
                        r="8" 
                        fill="none" 
                        stroke={selectedMinutiae === pt.id ? "#ef4444" : "#10b981"} 
                        strokeWidth="1" 
                        strokeDasharray="2,2" 
                        className="animate-spin"
                      />
                      <text 
                        x={pt.x + 8} 
                        y={pt.y - 4} 
                        fill="#00e5ff" 
                        fontSize="9" 
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        #{pt.id}
                      </text>
                    </g>
                  ))}
                </svg>

                {/* Animated Horizontal Laser Scan Bar */}
                <div 
                  className={`absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#00e5ff] pointer-events-none transition-all duration-75 ${
                    isScanning ? 'opacity-100' : 'opacity-30'
                  }`}
                  style={{ top: `${scanProgress}%` }}
                />

                {/* Cyber Scan Grid Lines */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#00e5ff0d_1px,transparent_1px),linear-gradient(to_bottom,#00e5ff0d_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

                {/* Target Corners */}
                <span className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
                <span className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
                <span className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400 pointer-events-none" />
                <span className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400 pointer-events-none" />

                {/* Center Reticle Tag */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] font-mono text-slate-300 bg-black/80 px-2 py-1 rounded border border-slate-700">
                  <span>RIDGE FLOW: {profile.ridgeCount} LINES</span>
                  <span className="text-cyan-400 font-bold">{selectedDigit}</span>
                </div>
              </div>

              {/* Scanner Control Bar */}
              <div className="w-full grid grid-cols-2 gap-2 mt-3 text-xs font-mono">
                <button
                  onClick={() => {
                    setIsScanning(true)
                    setScanProgress(0)
                  }}
                  disabled={isScanning}
                  className="py-2 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 rounded-lg text-cyan-300 font-bold transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                  <span>RE-SCAN PRINT</span>
                </button>

                <button
                  onClick={() => setShowMinutiae(!showMinutiae)}
                  className={`py-2 border rounded-lg font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    showMinutiae
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/60'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{showMinutiae ? 'MINUTIAE ON' : 'MINUTIAE OFF'}</span>
                </button>
              </div>

              {/* Selected Minutiae Info Box */}
              {selectedMinutiae && (
                <div className="w-full mt-2 p-2 bg-[#061020] border border-cyan-500/40 rounded-lg text-xs font-mono flex items-center justify-between">
                  <span className="text-emerald-300 font-bold">
                    MINUTIAE #{selectedMinutiae}: {minutiaePoints.find(p => p.id === selectedMinutiae)?.label}
                  </span>
                  <span className="text-slate-400">
                    TYPE: {minutiaePoints.find(p => p.id === selectedMinutiae)?.type}
                  </span>
                </div>
              )}

            </div>

          </div>

          {/* Right Column (7 Cols): Forensic Analysis & Chain of Custody */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            
            {/* Primary Match Result Card */}
            <div className="bg-[#0b1122] border border-emerald-500/50 rounded-xl p-4 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>AFIS POSITIVE MATCH CONFIRMATION</span>
                </div>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500 font-bold">
                  {profile.confidenceTier}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-mono">
                <div className="bg-[#060a16] p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] uppercase">MATCH SCORE</span>
                  <div className="text-base font-bold text-emerald-400">{profile.matchingScore}</div>
                </div>
                <div className="bg-[#060a16] p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] uppercase">GALTON POINTS</span>
                  <div className="text-base font-bold text-cyan-400">{profile.matchingPoints} VERIFIED</div>
                </div>
                <div className="bg-[#060a16] p-2.5 rounded-lg border border-slate-800 col-span-2 sm:col-span-1">
                  <span className="text-slate-400 text-[10px] uppercase">PATTERN TYPE</span>
                  <div className="text-xs font-bold text-slate-200 mt-1 truncate">{profile.patternType}</div>
                </div>
              </div>

              <div className="text-xs text-slate-300 font-sans leading-relaxed bg-[#060a16] p-3 rounded-lg border border-slate-800/80">
                <div className="font-mono text-cyan-300 font-bold mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>FORENSIC RECOVERY EVIDENCE:</span>
                </div>
                <p>
                  {profile.latentOrigin}. Print lifted using fluorescent cyanoacrylate fuming and 532nm forensic coherent laser illumination.
                </p>
              </div>
            </div>

            {/* Ten-Print Digital Card Strip */}
            <div className="bg-[#0b1122] border border-slate-800 rounded-xl p-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 font-bold">
                <span>TEN-PRINT RECORD REGISTER (ROLLED / FLAT)</span>
                <span className="text-cyan-400">MATCH: RIGHT INDEX</span>
              </div>

              <div className="grid grid-cols-5 gap-1.5 text-center text-xs font-mono">
                {tenPrintCards.map(d => (
                  <button
                    key={d.code}
                    onClick={() => setSelectedDigit(d.code)}
                    className={`p-2 rounded-lg border transition cursor-pointer flex flex-col items-center gap-1 ${
                      selectedDigit === d.code
                        ? 'bg-cyan-950 text-cyan-200 border-cyan-400 shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                        : d.match
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/50'
                        : 'bg-[#070c18] text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <Fingerprint className={`w-4 h-4 ${d.match ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <span className="text-[10px] font-bold truncate w-full">{d.label}</span>
                    <span className={`text-[9px] px-1 py-0.2 rounded ${
                      d.match ? 'bg-emerald-900 text-emerald-300 font-bold' : 'text-slate-500'
                    }`}>
                      {d.match ? 'MATCH' : d.pattern}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Legal Chain of Custody & BSA 2023 Certification */}
            <div className="bg-[#0b1122] border border-slate-800 rounded-xl p-4 space-y-2.5">
              <div className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider">
                COURT ADMISSIBILITY & EVIDENCE HASH
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between bg-[#070c18] p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400">LEGAL STATUTE:</span>
                  <span className="text-cyan-300 font-bold">{profile.courtAdmissibility}</span>
                </div>
                <div className="flex items-center justify-between bg-[#070c18] p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400">VERIFYING AGENCY:</span>
                  <span className="text-slate-200 font-bold">{profile.recoveredBy}</span>
                </div>
                
                {/* Evidence Hash */}
                <div className="bg-[#070c18] p-2.5 rounded-lg border border-slate-800 flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] text-slate-500">SHA-256 FORENSIC INTEGRITY HASH:</div>
                    <div className="text-[11px] font-mono text-slate-300 truncate font-semibold">
                      {profile.hash}
                    </div>
                  </div>
                  <button
                    onClick={handleCopyHash}
                    className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-700 shrink-0 cursor-pointer"
                    title="Copy SHA-256 evidence hash"
                  >
                    {copiedHash ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* ============================================================ */}
        {/* 3. MODAL FOOTER */}
        {/* ============================================================ */}
        <div className="px-5 py-3 border-t border-slate-800 bg-[#080f22] flex items-center justify-between gap-3 shrink-0 flex-wrap">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>AUTHENTICATED EVIDENCE CONTAINER • SECTION 65B CERTIFIED</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExportCertificate}
              className="px-4 py-2 bg-gradient-to-r from-cyan-950 to-blue-950 hover:from-cyan-900 hover:to-blue-900 border border-cyan-500/60 rounded-lg text-cyan-200 font-mono text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-[0_0_12px_rgba(0,229,255,0.2)]"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>EXPORT AFIS CERTIFICATE (JSON)</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-slate-300 font-mono text-xs font-bold transition cursor-pointer"
            >
              DISMISS
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

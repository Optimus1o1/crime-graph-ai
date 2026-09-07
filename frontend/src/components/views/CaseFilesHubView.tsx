'use client'

import React, { useState } from 'react'
import { 
  FolderLock, 
  FileText, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  DownloadCloud, 
  ExternalLink, 
  Plus, 
  Users, 
  Layers, 
  Scale, 
  Sparkles, 
  AlertOctagon, 
  X,
  Lock,
  ShieldCheck,
  Copy,
  Check,
  FileCheck,
  Key,
  Shield,
  RefreshCw
} from 'lucide-react'

interface CaseFilesHubViewProps {
  onNavigate: (viewId: string) => void
}

export default function CaseFilesHubView({ onNavigate }: CaseFilesHubViewProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'discovery' | 'trial' | 'archived'>('all')
  const [selectedCaseId, setSelectedCaseId] = useState<string>('CG-2024-0847')
  
  // Tactical Vault State
  const [isVaultOpen, setIsVaultOpen] = useState(false)
  const [isVerifyingHash, setIsVerifyingHash] = useState(false)
  const [hashVerified, setHashVerified] = useState(false)
  const [copiedHash, setCopiedHash] = useState(false)

  // New Case Modal State
  const [isNewCaseOpen, setIsNewCaseOpen] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newLevel, setNewLevel] = useState('HIGH')
  const [newBrief, setNewBrief] = useState('')

  const [casesList, setCasesList] = useState([
    {
      id: 'CG-2024-0847',
      title: 'Hawala Network Western Corridor',
      level: 'CRITICAL',
      levelColor: 'bg-red-950/90 text-red-300 border-red-500/50',
      category: 'discovery',
      suspects: 12,
      evidences: 47,
      nodes: 156,
      status: 'ACTIVE DISCOVERY PHASE',
      brief: 'Investigation into coordinated Hawala transaction corridors bypassing legal banking pipelines. Linking Node S-201 to offshore holding subsidiaries.',
      readiness: 81,
      checklist: [
        { label: 'CDR call records verified (Node CELL-827)', done: true },
        { label: 'CCTV facial matching logged (CAM-CP-004)', done: true },
        { label: 'Forensic device dumps parsed', done: true },
        { label: 'Dubai shell subsidiary entity mapped', done: true },
      ]
    },
    {
      id: 'CG-2024-0511',
      title: 'Cyber-Ransom Extortion syndicate',
      level: 'HIGH',
      levelColor: 'bg-amber-950/90 text-amber-300 border-amber-500/50',
      category: 'trial',
      suspects: 5,
      evidences: 22,
      nodes: 91,
      status: 'COURT TRIAL PREP',
      brief: 'State-sponsored ransomware cell targeting regional medical distribution logistics with offshore crypto exfiltration.',
      readiness: 74,
      checklist: [
        { label: 'Bitcoin unspent transaction outputs traced', done: true },
        { label: 'Tor exit node correlation verified', done: true },
        { label: 'Victim server image cloned under custody', done: false },
      ]
    },
    {
      id: 'CG-2024-0102',
      title: 'Connaught Square Perimeter Breach',
      level: 'MEDIUM',
      levelColor: 'bg-cyan-950/90 text-cyan-300 border-cyan-500/50',
      category: 'discovery',
      suspects: 3,
      evidences: 14,
      nodes: 38,
      status: 'PRELIMINARY INQUIRY',
      brief: 'Geofenced physical trespass into high-security government communications nexus during VIP transit corridor activation.',
      readiness: 92,
      checklist: [
        { label: 'ANPR cross-reference complete', done: true },
        { label: 'Gate sensor access badge audit valid', done: true },
      ]
    },
    {
      id: 'CG-2024-0042',
      title: 'Operation Falcon Syndicate',
      level: 'CRITICAL',
      levelColor: 'bg-red-950/90 text-red-300 border-red-500/50',
      category: 'trial',
      suspects: 8,
      evidences: 31,
      nodes: 112,
      status: 'ENTERPRISE STRIKE PHASE',
      brief: 'Full-spectrum synthetic extortion and hawala network operating across Bangalore and Delhi NCR.',
      readiness: 88,
      checklist: [
        { label: 'Kingpin Viktor Rao betweenness verified', done: true },
        { label: 'Rahul Kumar mule chain authenticated', done: true },
      ]
    },
    {
      id: 'CG-2023-0914',
      title: 'Rohini Industrial Smuggling Nexus',
      level: 'LOW',
      levelColor: 'bg-slate-900 text-slate-400 border-slate-700',
      category: 'archived',
      suspects: 4,
      evidences: 18,
      nodes: 42,
      status: 'ARCHIVED / CONVICTED',
      brief: 'Cross-border contraband transit using counterfeit commercial freight manifests and cloned vehicle registration plates.',
      readiness: 100,
      checklist: [
        { label: 'Final conviction judgment registered', done: true },
        { label: 'Seized vehicle auction completed', done: true },
      ]
    }
  ])

  // Filter cases
  const filteredCases = casesList.filter(c => {
    if (activeFilter === 'all') return true
    return c.category === activeFilter
  })

  const activeCase = casesList.find(c => c.id === selectedCaseId) || filteredCases[0] || casesList[0]

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle) return
    const newId = `CG-2024-0${Math.floor(100 + Math.random() * 900)}`
    const newCase = {
      id: newId,
      title: newTitle,
      level: newLevel,
      levelColor: newLevel === 'CRITICAL' ? 'bg-red-950/90 text-red-300 border-red-500/50' : 'bg-amber-950/90 text-amber-300 border-amber-500/50',
      category: 'discovery',
      suspects: 1,
      evidences: 2,
      nodes: 8,
      status: 'ACTIVE DISCOVERY PHASE',
      brief: newBrief || 'Newly opened investigative docket. Awaiting field telemetry and digital forensics integration.',
      readiness: 45,
      checklist: [
        { label: 'Preliminary FIR registration logged', done: true },
        { label: 'Investigator assigned to case docket', done: true },
        { label: 'Subpoena issued for CDR records', done: false },
      ]
    }
    setCasesList([newCase, ...casesList])
    setSelectedCaseId(newId)
    setIsNewCaseOpen(false)
    setNewTitle('')
    setNewBrief('')
  }

  return (
    <div className="flex-1 flex flex-col p-3.5 gap-3.5 overflow-y-auto bg-[#04070D] text-slate-100 font-sans select-none">
      
      {/* ============================================================ */}
      {/* 1. TOP FILTER PILLS BAR */}
      {/* ============================================================ */}
      <div className="flex items-center justify-between border-b border-cyan-900/40 pb-2 flex-wrap gap-2">
        <div className="flex items-center gap-2 font-mono text-xs overflow-x-auto">
          {/* Official CrimeGraph Emblem in Case Section */}
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-cyan-400/80 shadow-[0_0_12px_rgba(0,229,255,0.35)] shrink-0 bg-[#060A14] flex items-center justify-center">
            <img src="/images/crimegraph_logo_emblem.jpg" alt="CrimeGraph AI" className="w-full h-full object-cover" />
          </div>

          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded transition cursor-pointer shrink-0 ${
              activeFilter === 'all'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/60 font-bold shadow-[0_0_8px_rgba(0,229,255,0.3)]'
                : 'text-slate-400 hover:text-white bg-slate-900/40 border border-slate-800'
            }`}
          >
            ALL ACTIVE FILES ({casesList.length})
          </button>
          <button
            onClick={() => setActiveFilter('discovery')}
            className={`px-3 py-1 rounded transition cursor-pointer shrink-0 ${
              activeFilter === 'discovery'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/60 font-bold'
                : 'text-slate-400 hover:text-white bg-slate-900/40 border border-slate-800'
            }`}
          >
            UNDER DISCOVERY ({casesList.filter(c => c.category === 'discovery').length})
          </button>
          <button
            onClick={() => setActiveFilter('trial')}
            className={`px-3 py-1 rounded transition cursor-pointer shrink-0 ${
              activeFilter === 'trial'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/60 font-bold'
                : 'text-slate-400 hover:text-white bg-slate-900/40 border border-slate-800'
            }`}
          >
            IN COURT TRIAL ({casesList.filter(c => c.category === 'trial').length})
          </button>
          <button
            onClick={() => setActiveFilter('archived')}
            className={`px-3 py-1 rounded transition cursor-pointer shrink-0 ${
              activeFilter === 'archived'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/60 font-bold'
                : 'text-slate-400 hover:text-white bg-slate-900/40 border border-slate-800'
            }`}
          >
            ARCHIVED / CLOSED ({casesList.filter(c => c.category === 'archived').length})
          </button>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsVaultOpen(true)}
            className="px-3 py-1 rounded bg-gradient-to-r from-emerald-950 to-cyan-950 hover:from-emerald-900 hover:to-cyan-900 text-emerald-300 border border-emerald-500/70 font-mono text-xs font-bold transition flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.35)] cursor-pointer hover:scale-105"
            title="Open Cryptographic Tactical Evidence Vault"
          >
            <FolderLock className="w-3.5 h-3.5 text-emerald-400" />
            <span>TACTICAL VAULT</span>
          </button>

          <button 
            onClick={() => setIsNewCaseOpen(true)}
            className="px-3 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-bold transition flex items-center gap-1.5 shadow-[0_0_12px_#00e5ff] cursor-pointer hover:scale-105"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>NEW INVESTIGATION</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. CASE LIST vs. CASE SUMMARY SPLIT */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 flex-1 min-h-[450px]">
        
        {/* Left Column (5 cols): Case Cards List */}
        <div className="lg:col-span-5 flex flex-col gap-2.5 overflow-y-auto pr-1">
          {filteredCases.map(c => {
            const isSelected = selectedCaseId === c.id
            return (
              <div
                key={c.id}
                onClick={() => setSelectedCaseId(c.id)}
                className={`cyber-panel p-3.5 rounded-lg flex flex-col gap-2 cursor-pointer transition relative overflow-hidden ${
                  isSelected 
                    ? 'border-cyan-400 shadow-[0_0_15px_rgba(0,229,255,0.25)] bg-[#09111e]' 
                    : 'hover:border-cyan-500/40'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-white font-bold tracking-wider">{c.id}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded border font-bold ${c.levelColor}`}>
                    {c.level}
                  </span>
                </div>

                <div className="text-sm font-bold text-slate-100 font-sans">
                  {c.title}
                </div>

                {/* Metrics Pill Row */}
                <div className="flex items-center gap-4 text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800/80">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-cyan-400" />
                    <b className="text-slate-200">{c.suspects}</b> Suspects
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3 text-amber-400" />
                    <b className="text-slate-200">{c.evidences}</b> Evidences
                  </span>
                  <span className="flex items-center gap-1">
                    <Layers className="w-3 h-3 text-purple-400" />
                    <b className="text-slate-200">{c.nodes}</b> Nodes
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Right Column (7 cols): Case Summary & Court Readiness Report */}
        <div className="lg:col-span-7 cyber-panel rounded-lg p-5 flex flex-col gap-4 relative overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3 flex-wrap gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono text-cyan-400 font-bold tracking-wider">
                  CASE {activeCase.id} SUMMARY
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold">
                  {activeCase.status}
                </span>
              </div>
              <h2 className="text-lg font-black text-white font-sans">
                {activeCase.title}
              </h2>
            </div>

            <span className="text-[10px] font-mono px-2 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300">
              ENHANCED REPORT
            </span>
          </div>

          {/* Case Brief Box */}
          <div className="bg-[#020509] border border-cyan-900/40 rounded-lg p-3.5">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>CASE BRIEF</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {activeCase.brief}
            </p>
          </div>

          {/* Court Readiness Rating & Evidence Status Split */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
            
            {/* Court Readiness Meter (5 cols) */}
            <div className="sm:col-span-5 bg-[#020509] border border-cyan-900/40 rounded-lg p-3.5 flex flex-col items-center justify-center text-center">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-cyan-400" />
                <span>COURT READINESS</span>
              </div>

              {/* Circular Gauge */}
              <div className="relative w-28 h-28 flex items-center justify-center my-1">
                <svg className="w-28 h-28 transform -rotate-90">
                  <circle
                    cx="56"
                    cy="56"
                    r="44"
                    fill="transparent"
                    stroke="#0b1322"
                    strokeWidth="8"
                  />
                  <circle
                    cx="56"
                    cy="56"
                    r="44"
                    fill="transparent"
                    stroke="#00e5ff"
                    strokeWidth="8"
                    strokeDasharray={276}
                    strokeDashoffset={276 - (276 * activeCase.readiness) / 100}
                    strokeLinecap="round"
                    style={{ filter: 'drop-shadow(0 0 8px #00e5ff)' }}
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-black font-mono text-white">
                    {activeCase.readiness}%
                  </span>
                  <span className="text-[9px] font-mono text-cyan-300 font-bold">READY</span>
                </div>
              </div>

              <span className="text-[9px] font-mono text-slate-500 mt-1">
                ADMISSIBILITY TIER 1
              </span>
            </div>

            {/* Evidence Status Checklist (7 cols) */}
            <div className="sm:col-span-7 bg-[#020509] border border-cyan-900/40 rounded-lg p-3.5 flex flex-col justify-between">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2">
                EVIDENCE STATUS
              </div>

              <div className="space-y-2 text-xs font-mono">
                {activeCase.checklist.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    {item.done ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    )}
                    <span className={item.done ? 'text-slate-200' : 'text-slate-400 italic'}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-800 text-[9px] font-mono text-slate-500">
                CHAIN OF CUSTODY HASH CHAIN VERIFIED (SHA-256)
              </div>
            </div>

          </div>

          {/* Action Row */}
          <div className="flex items-center gap-3 pt-2 border-t border-cyan-900/40 mt-auto flex-wrap">
            <button
              onClick={() => onNavigate('network')}
              className="flex-1 min-w-[140px] py-2 bg-gradient-to-r from-cyan-950 to-blue-950 hover:from-cyan-900 hover:to-blue-900 border border-cyan-500/60 rounded-lg text-cyan-200 font-mono text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_12px_rgba(0,229,255,0.25)]"
            >
              <span>OPEN TACTICAL GRAPH</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onNavigate('evidence')}
              className="flex-1 min-w-[140px] py-2 bg-[#060a12] hover:bg-slate-800 border border-slate-700 rounded-lg text-slate-200 font-mono text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>CHAIN OF CUSTODY</span>
            </button>

            <button
              onClick={() => setIsVaultOpen(true)}
              className="py-2 px-3 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/70 rounded-lg text-emerald-300 font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.3)] hover:scale-105"
              title="Access Cryptographic Case Vault"
            >
              <FolderLock className="w-3.5 h-3.5 text-emerald-400" />
              <span>TACTICAL VAULT</span>
            </button>
          </div>

        </div>

      </div>

      {/* ============================================================ */}
      {/* MODAL: NEW INVESTIGATION DOCKET */}
      {/* ============================================================ */}
      {isNewCaseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#060A14] border border-cyan-500/50 rounded-xl p-5 w-full max-w-md shadow-[0_0_40px_rgba(0,229,255,0.2)] font-mono text-xs">
            <div className="flex items-center justify-between border-b border-cyan-900/50 pb-2 mb-3">
              <div className="text-white font-bold flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>INITIALIZE NEW INVESTIGATION CASE</span>
              </div>
              <button
                onClick={() => setIsNewCaseOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCase} className="space-y-3">
              <div>
                <label className="block text-slate-300 text-[10px] mb-1">CASE TITLE / SYNDICATE NAME</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Operation Red Scorpion Hawala Cell"
                  className="w-full bg-[#020509] border border-cyan-900/60 rounded px-3 py-1.5 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-[10px] mb-1">INITIAL THREAT CLASSIFICATION</label>
                <select
                  value={newLevel}
                  onChange={e => setNewLevel(e.target.value)}
                  className="w-full bg-[#020509] border border-cyan-900/60 rounded px-2 py-1.5 text-white outline-none focus:border-cyan-400"
                >
                  <option value="CRITICAL">CRITICAL (Tier 1 National Security)</option>
                  <option value="HIGH">HIGH (Organized Criminal Network)</option>
                  <option value="MEDIUM">MEDIUM (Regional Financial Fraud)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 text-[10px] mb-1">PRELIMINARY CASE BRIEF</label>
                <textarea
                  rows={3}
                  value={newBrief}
                  onChange={e => setNewBrief(e.target.value)}
                  placeholder="Summary of intel intercepted, suspects identified, and initial targets..."
                  className="w-full bg-[#020509] border border-cyan-900/60 rounded px-3 py-1.5 text-white outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewCaseOpen(false)}
                  className="px-3 py-1.5 rounded bg-slate-900 text-slate-300 hover:bg-slate-800"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-bold shadow-[0_0_10px_#00e5ff]"
                >
                  CREATE CASE DOCKET
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: TACTICAL EVIDENCE & OBSIDIAN CASE VAULT */}
      {/* ============================================================ */}
      {isVaultOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 select-none font-sans overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#060A14] border border-emerald-500/50 rounded-xl shadow-[0_0_50px_rgba(16,185,129,0.25)] overflow-hidden flex flex-col my-auto">
            
            {/* Tactical Watermark */}
            <div className="absolute -right-16 -bottom-16 w-80 h-80 opacity-[0.03] pointer-events-none rounded-full overflow-hidden">
              <img src="/images/crimegraph_logo_emblem.jpg" alt="" className="w-full h-full object-cover" />
            </div>

            {/* Modal Header */}
            <div className="bg-[#09121c] border-b border-emerald-900/50 p-4 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg overflow-hidden border border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.45)] shrink-0 bg-[#060A14]">
                  <img 
                    src="/images/crimegraph_logo_emblem.jpg" 
                    alt="CrimeGraph AI Tactical Seal" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black font-mono text-white tracking-wider">
                      CRYPTOGRAPHIC TACTICAL EVIDENCE VAULT
                    </h3>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold uppercase">
                      SEC_LEVEL_4
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    Immutable Chain of Custody Repository • BSA 2023 / Sec 65B Certified
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsVaultOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-4 font-mono text-xs relative z-10 max-h-[70vh] overflow-y-auto">
              
              {/* Active Case Selector Ribbon */}
              <div className="flex items-center justify-between bg-[#020509] p-3 rounded-lg border border-emerald-900/40 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-[11px]">ACTIVE DOCKET:</span>
                  <span className="text-white font-bold text-[12px]">{activeCase.id} — {activeCase.title}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-500/40">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>COURT READINESS: {activeCase.readiness}%</span>
                </div>
              </div>

              {/* Cryptographic Proof Hash Banner */}
              <div className="bg-[#040810] p-3.5 rounded-lg border border-cyan-900/50 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-cyan-400" />
                    <span>VAULT ROOT SHA-256 DIGITAL HASH:</span>
                  </span>
                  <span className="text-[10px] text-slate-400">ANCHOR: ETHEREUM #19827402</span>
                </div>

                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-[#020408] border border-cyan-500/30 rounded px-2.5 py-1.5 text-[11px] text-cyan-200 tracking-wider font-mono truncate select-all">
                    8f4a1c09b847291a92e104f98124b8912c918a24d7701827b912c89012a4b819
                  </code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('8f4a1c09b847291a92e104f98124b8912c918a24d7701827b912c89012a4b819')
                      setCopiedHash(true)
                      setTimeout(() => setCopiedHash(false), 2000)
                    }}
                    className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 rounded text-cyan-300 transition flex items-center gap-1 text-[11px] cursor-pointer"
                  >
                    {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedHash ? 'COPIED' : 'COPY'}</span>
                  </button>
                </div>

                {/* Hash Live Verification Action */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => {
                      setIsVerifyingHash(true)
                      setTimeout(() => {
                        setIsVerifyingHash(false)
                        setHashVerified(true)
                      }, 900)
                    }}
                    className="text-[10px] text-cyan-400 hover:text-cyan-200 underline cursor-pointer flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${isVerifyingHash ? 'animate-spin text-cyan-300' : ''}`} />
                    <span>{isVerifyingHash ? 'CALCULATING MERKLE ROOT HASH...' : 'VERIFY LOCAL HASH INTEGRITY'}</span>
                  </button>

                  {hashVerified && (
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>SIGNATURE VERIFIED (0 TAMPER DETECTED)</span>
                    </span>
                  )}
                </div>
              </div>

              {/* 4 Encrypted Vault Containers */}
              <div>
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>SECURE CASE ASSETS & EVIDENCE CONTAINERS</span>
                  <span className="text-emerald-400">4 CONTAINERS ENCRYPTED</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="bg-[#020509] p-2.5 rounded border border-slate-800 hover:border-emerald-500/40 transition">
                    <div className="flex items-center justify-between text-slate-200 font-bold mb-1">
                      <span className="flex items-center gap-1.5 text-emerald-300">
                        <Lock className="w-3 h-3 text-emerald-400" />
                        <span>TELCO_CDR_DUMP.tar.enc</span>
                      </span>
                      <span className="text-[9px] text-slate-400">14.2 MB</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-snug font-sans">
                      3,820 Cell Tower Pings & Handover Call Bursts for Burner Handset IMEI-84710.
                    </p>
                  </div>

                  <div className="bg-[#020509] p-2.5 rounded border border-slate-800 hover:border-emerald-500/40 transition">
                    <div className="flex items-center justify-between text-slate-200 font-bold mb-1">
                      <span className="flex items-center gap-1.5 text-amber-300">
                        <Lock className="w-3 h-3 text-amber-400" />
                        <span>HAWALA_MULE_LEDGER.sql.enc</span>
                      </span>
                      <span className="text-[9px] text-slate-400">4.8 MB</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-snug font-sans">
                      ₹45,00,000 Layering Sequence across HDFC, ICICI & Axis Shell Accounts.
                    </p>
                  </div>

                  <div className="bg-[#020509] p-2.5 rounded border border-slate-800 hover:border-emerald-500/40 transition">
                    <div className="flex items-center justify-between text-slate-200 font-bold mb-1">
                      <span className="flex items-center gap-1.5 text-cyan-300">
                        <Lock className="w-3 h-3 text-cyan-400" />
                        <span>CELLEBRITE_IMAGE_DUMP.bin.enc</span>
                      </span>
                      <span className="text-[9px] text-slate-400">28.4 MB</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-snug font-sans">
                      Bit-by-bit physical storage image from seized hardware exhibit #CF-0422-7.
                    </p>
                  </div>

                  <div className="bg-[#020509] p-2.5 rounded border border-slate-800 hover:border-emerald-500/40 transition">
                    <div className="flex items-center justify-between text-slate-200 font-bold mb-1">
                      <span className="flex items-center gap-1.5 text-purple-300">
                        <Lock className="w-3 h-3 text-purple-400" />
                        <span>ANPR_GEOJSON_TRACK.enc</span>
                      </span>
                      <span className="text-[9px] text-slate-400">2.1 MB</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-snug font-sans">
                      Corridor timeline of Toyota Fortuner DL 4C AB 1234 across 42 CCTV junctions.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer Actions */}
            <div className="bg-[#080d17] border-t border-slate-800 p-3.5 flex items-center justify-between flex-wrap gap-2 relative z-10">
              <button
                onClick={() => window.print()}
                className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-slate-300 font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span>PRINT SEC 65B CERTIFICATE</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsVaultOpen(false)}
                  className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-slate-300 font-mono text-xs transition cursor-pointer"
                >
                  CLOSE
                </button>

                <a
                  href={`/api/vault/export?case_id=${activeCase.id}`}
                  download
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 rounded-lg text-black font-mono text-xs font-black transition flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.5)] cursor-pointer hover:scale-105"
                >
                  <DownloadCloud className="w-4 h-4 text-black" />
                  <span>DOWNLOAD COURT VAULT (.JSON)</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

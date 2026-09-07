'use client'

import React, { useState } from 'react'
import { 
  FileCheck2, 
  ShieldCheck, 
  Lock, 
  Link2, 
  DownloadCloud, 
  Clock, 
  CheckCircle2, 
  ExternalLink,
  Layers,
  FileText
} from 'lucide-react'

interface ForensicEvidenceAuditViewProps {
  onNavigate: (viewId: string) => void
}

export default function ForensicEvidenceAuditView({ onNavigate }: ForensicEvidenceAuditViewProps) {
  const [selectedArtifactId, setSelectedArtifactId] = useState<string>('EVD-2024-0341')
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false)
  const [copyFeedback, setCopyFeedback] = useState<string>('')

  const evidenceRecords = [
    {
      id: 'EVD-2024-0341',
      title: 'Cell tower ping analysis linking target device CELL-827 to primary residence',
      officer: 'Agent Vance',
      time: '14:12:05 GMT',
      sha256: '8a42c90f...de19',
      status: 'Submitted',
      statusColor: 'bg-cyan-950 text-cyan-300 border-cyan-500/50',
      chainAnchor: 'Ethereum Mainnet',
      blockHeight: '#19827402',
      txSig: '0x98b8b8bca23cfd109f082e3571a80d8291fbc747',
      correlation: 'Linked target S-201 with confidence 94.7% based on location coincidence at Chandni Chowk junction tower #4.'
    },
    {
      id: 'EVD-2024-0342',
      title: 'Encrypted ledger logs exported from Delhi central holding node',
      officer: 'Analyst Kahn',
      time: '11:50:11 GMT',
      sha256: 'c409fa23...af88',
      status: 'Collected',
      statusColor: 'bg-amber-950 text-amber-300 border-amber-500/50',
      chainAnchor: 'Ethereum Mainnet',
      blockHeight: '#19827380',
      txSig: '0x71a2e948cbb281902fcda819023450912abcf012',
      correlation: 'Correlates $45,000 transfer from Al-Hassan Khan to shell subsidiary CORP_Z LTD.'
    },
    {
      id: 'EVD-2024-0343',
      title: 'ANPR capture of Toyota Fortuner boundary clearance at Toll T3 gate',
      officer: 'Officer Croft',
      time: '09:22:45 GMT',
      sha256: 'e87002db...0c2e',
      status: 'Verified',
      statusColor: 'bg-emerald-950 text-emerald-300 border-emerald-500/50',
      chainAnchor: 'Ethereum Mainnet',
      blockHeight: '#19827290',
      txSig: '0x55dc9812a0918239487123985712903487129034',
      correlation: 'Confirms suspect vehicle DL 4C AB 1234 trajectory towards Industrial Sector C entrance.'
    }
  ]

  const selectedArtifact = evidenceRecords.find(e => e.id === selectedArtifactId) || evidenceRecords[0]

  return (
    <div className="flex-1 flex flex-col p-3.5 gap-3.5 overflow-y-auto bg-[#04070D] text-slate-100 font-sans select-none">
      
      {/* ============================================================ */}
      {/* 1. TOP CASE CONTEXT STRIP */}
      {/* ============================================================ */}
      <div className="cyber-panel p-3 rounded-lg flex items-center justify-between border-l-4 border-l-emerald-400">
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-emerald-400/80 shadow-[0_0_12px_rgba(16,185,129,0.35)] shrink-0 bg-[#060A14] flex items-center justify-center">
            <img src="/images/crimegraph_logo_emblem.jpg" alt="CrimeGraph Forensic Seal" className="w-full h-full object-cover" />
          </div>
          <span className="text-slate-400">CASE FILE:</span>
          <span className="text-white font-bold bg-[#020509] px-2.5 py-1 rounded border border-cyan-500/40">
            CG-2024-0847 (Hawala Western Corridor)
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 font-bold shadow-[0_0_10px_rgba(16,185,129,0.3)]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>EVIDENCE INTEGRITY: VERIFIED</span>
          </span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. CHRONOLOGICAL CHAIN OF CUSTODY vs. ARTIFACT INSPECTOR */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 flex-1 min-h-[450px]">
        
        {/* Left Column (6 cols): Chronological Chain of Custody */}
        <div className="lg:col-span-6 cyber-panel rounded-lg p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
            <h3 className="text-xs font-mono font-bold tracking-wider text-white uppercase flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>CHRONOLOGICAL CHAIN OF CUSTODY</span>
            </h3>
            <span className="text-[10px] font-mono text-cyan-400">3 ARTIFACTS PARSED</span>
          </div>

          <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-1">
            {evidenceRecords.map(item => {
              const isSelected = selectedArtifactId === item.id
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedArtifactId(item.id)}
                  className={`p-3.5 rounded-lg border font-mono text-xs cursor-pointer transition flex flex-col gap-1.5 ${
                    isSelected
                      ? 'bg-[#09111e] border-cyan-400 shadow-[0_0_15px_rgba(0,229,255,0.25)]'
                      : 'bg-[#020509]/90 border-slate-800 hover:border-cyan-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-300 font-bold tracking-wider">{item.id}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded border font-bold ${item.statusColor}`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="text-slate-100 font-sans text-xs font-medium leading-snug">
                    {item.title}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
                    <span>Officer: <b className="text-slate-200">{item.officer}</b></span>
                    <span>Time: <b className="text-slate-200">{item.time}</b></span>
                  </div>

                  <div className="text-[10px] text-slate-500 truncate flex items-center gap-1">
                    <Lock className="w-3 h-3 text-cyan-400 shrink-0" />
                    <span>SHA256: {item.sha256}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Column (6 cols): Selected Forensic Artifact */}
        <div className="lg:col-span-6 cyber-panel rounded-lg p-5 flex flex-col justify-between gap-4">
          
          <div>
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 mb-3">
              <span className="text-[10px] font-mono text-cyan-400 font-bold tracking-wider uppercase">
                SELECTED FORENSIC ARTIFACT UID: {selectedArtifact.id}
              </span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/50 font-bold">
                VERIFIED
              </span>
            </div>

            <h2 className="text-sm font-bold text-white font-sans leading-relaxed mb-3">
              {selectedArtifact.title}
            </h2>

            {/* Physical Forensic Evidence Photographic Artifact */}
            <div className="relative w-full h-44 rounded-lg overflow-hidden border border-cyan-500/40 bg-[#020509] mb-4 group shadow-inner">
              <img 
                src="/images/forensic_evidence_device.jpg" 
                alt="Physical Forensic Laboratory Evidence"
                className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition"
              />
              <div className="scanline pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020509] via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 border border-cyan-400 text-[9px] font-mono text-cyan-300 font-bold">
                FORENSIC LAB SEIZURE RECORD
              </div>
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[9px] font-mono text-slate-200 bg-black/75 px-2.5 py-1 rounded backdrop-blur-sm border border-slate-800">
                <span>EXHIBIT TAG: #CF-0422-7</span>
                <span className="text-emerald-400 font-bold">CELLEBRITE HSM DUMP PASS</span>
              </div>
            </div>

            {/* Blockchain Proof of Custody Card */}
            <div className="bg-[#020509] border border-cyan-900/40 rounded-lg p-3.5 space-y-2 mb-4">
              <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
                <Link2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>BLOCKCHAIN PROOF OF CUSTODY</span>
              </div>

              <div className="space-y-1 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">CHAIN_ANCHOR:</span>
                  <span className="text-white font-bold">{selectedArtifact.chainAnchor}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">BLOCK_HEIGHT:</span>
                  <span className="text-cyan-300 font-bold">{selectedArtifact.blockHeight}</span>
                </div>
                <div className="flex flex-col pt-1 border-t border-slate-800">
                  <span className="text-slate-500 text-[10px]">TX_SIGNATURE:</span>
                  <span className="text-slate-300 text-[10px] font-mono truncate">
                    {selectedArtifact.txSig}
                  </span>
                </div>
              </div>
            </div>

            {/* Knowledge Graph Relationship */}
            <div className="bg-[#020509] border border-cyan-900/40 rounded-lg p-3.5 space-y-1.5">
              <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>KNOWLEDGE GRAPH RELATIONSHIP</span>
              </div>

              <p className="text-xs font-mono text-slate-300 leading-relaxed">
                {selectedArtifact.correlation}
              </p>
            </div>
          </div>

          {/* Bottom Action Button */}
          <div className="pt-3 border-t border-cyan-900/40">
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="w-full py-2.5 bg-gradient-to-r from-cyan-950 to-blue-950 hover:from-cyan-900 hover:to-blue-900 border border-cyan-500/60 rounded-lg text-cyan-200 font-mono text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_12px_rgba(0,229,255,0.25)] hover:scale-[1.01]"
            >
              <FileCheck2 className="w-4 h-4 text-cyan-400" />
              <span>GENERATE COURT REPORT & SECTION 65B CERTIFICATE</span>
            </button>
          </div>

        </div>

      </div>

      {/* ============================================================ */}
      {/* 3. COURT-ADMISSIBLE FORENSIC CERTIFICATE MODAL */}
      {/* ============================================================ */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#050914] border border-cyan-500/60 rounded-xl w-full max-w-2xl shadow-[0_0_50px_rgba(0,229,255,0.3)] overflow-hidden flex flex-col font-mono max-h-[90vh]">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-950/80 to-blue-950/80 border-b border-cyan-500/40 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden border border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.4)] shrink-0 bg-[#060A14] flex items-center justify-center">
                  <img src="/images/crimegraph_logo_emblem.jpg" alt="CrimeGraph Seal" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wider">
                    COURT-ADMISSIBLE FORENSIC INTEGRITY CERTIFICATE
                  </h3>
                  <div className="text-[10px] text-cyan-400 tracking-wider">
                    SEC 65B INDIAN EVIDENCE ACT & ISO/IEC 27037 COMPLIANT
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="w-7 h-7 rounded-md bg-slate-900 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              
              {/* Seal Banner */}
              <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-emerald-200 text-xs font-semibold">
                    Cryptographic Integrity Verification Passed • Immutable Block Hash Match
                  </span>
                </div>
                <span className="text-[10px] bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40 font-bold">
                  EVIDENCE READY
                </span>
              </div>

              {/* Case & Evidence Identification Grid */}
              <div className="grid grid-cols-2 gap-3 bg-[#020509] p-3.5 rounded-lg border border-cyan-900/40">
                <div>
                  <span className="text-slate-500 text-[10px] block">DOCKET CASE NUMBER</span>
                  <span className="text-white font-bold text-xs">CG-2024-0847 (Hawala Western Corridor)</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">ARTIFACT RECORD UID</span>
                  <span className="text-cyan-300 font-bold text-xs">{selectedArtifact.id}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">EVIDENCE CUSTODIAN</span>
                  <span className="text-slate-200 text-xs">{selectedArtifact.officer} (Cyber Forensics)</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">EXTRACTION TIMESTAMP</span>
                  <span className="text-slate-200 text-xs">{selectedArtifact.time}</span>
                </div>
              </div>

              {/* Artifact Description */}
              <div className="bg-[#020509] p-3.5 rounded-lg border border-cyan-900/40 space-y-1">
                <span className="text-slate-500 text-[10px] block">ARTIFACT DESCRIPTION & COGNIZANCE</span>
                <p className="text-slate-200 text-xs font-sans leading-relaxed">
                  {selectedArtifact.title}
                </p>
                <div className="text-[11px] text-cyan-400 font-mono pt-1">
                  Corroboration: {selectedArtifact.correlation}
                </div>
              </div>

              {/* Cryptographic Chain of Custody */}
              <div className="bg-[#020509] p-3.5 rounded-lg border border-cyan-900/40 space-y-2">
                <span className="text-slate-500 text-[10px] block">BLOCKCHAIN ANCHOR & HASH INTEGRITY</span>
                
                <div className="flex items-center justify-between text-[11px] border-b border-slate-800 pb-1">
                  <span className="text-slate-400">HASH ALGORITHM:</span>
                  <span className="text-slate-200">SHA-256 (FIPS 180-4)</span>
                </div>

                <div className="flex flex-col gap-0.5 text-[11px] border-b border-slate-800 pb-1">
                  <span className="text-slate-400">ARTIFACT DIGEST (SHA-256):</span>
                  <span className="text-cyan-300 break-all text-[10px]">{selectedArtifact.sha256}</span>
                </div>

                <div className="flex items-center justify-between text-[11px] border-b border-slate-800 pb-1">
                  <span className="text-slate-400">LEDGER ANCHOR:</span>
                  <span className="text-white font-bold">{selectedArtifact.chainAnchor} (Block {selectedArtifact.blockHeight})</span>
                </div>

                <div className="flex flex-col gap-0.5 text-[11px]">
                  <span className="text-slate-400">TRANSACTION PROOF SIGNATURE:</span>
                  <span className="text-slate-400 break-all text-[10px]">{selectedArtifact.txSig}</span>
                </div>
              </div>

              {/* Legal Certificate Statement */}
              <div className="text-[10px] text-slate-400 leading-relaxed bg-[#0a101d] p-3 rounded border border-slate-800">
                <span className="text-cyan-300 font-bold block mb-1">CERTIFICATION STATEMENT:</span>
                I hereby certify that the electronic record produced herein has been generated and managed under strict chain-of-custody protocols without alteration. The cryptographic hash was anchored upon discovery and verified through distributed ledger consensus. Admissible under Section 65B of the Indian Evidence Act, 1872.
              </div>

            </div>

            {/* Footer Buttons */}
            <div className="p-4 bg-[#03060C] border-t border-cyan-900/40 flex items-center justify-between gap-3">
              <div className="text-[10px] text-slate-400">
                {copyFeedback ? (
                  <span className="text-emerald-400 font-bold">{copyFeedback}</span>
                ) : (
                  <span>STATUS: READY FOR COURT SUBMISSION</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`ARTIFACT: ${selectedArtifact.id}\nSHA256: ${selectedArtifact.sha256}\nTX: ${selectedArtifact.txSig}\nBLOCK: ${selectedArtifact.blockHeight}`)
                    setCopyFeedback('COPIED HASH & ANCHOR TO CLIPBOARD')
                    setTimeout(() => setCopyFeedback(''), 3000)
                  }}
                  className="px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
                >
                  COPY HASH
                </button>

                <button
                  onClick={() => {
                    window.print()
                  }}
                  className="px-4 py-1.5 rounded bg-gradient-to-r from-cyan-950 to-blue-950 hover:from-cyan-900 hover:to-blue-900 border border-cyan-500/60 text-cyan-200 text-xs font-bold shadow-[0_0_12px_rgba(0,229,255,0.3)] transition cursor-pointer flex items-center gap-1.5"
                >
                  <DownloadCloud className="w-3.5 h-3.5 text-cyan-400" />
                  <span>PRINT / SAVE PDF</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

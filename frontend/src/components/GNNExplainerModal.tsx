'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Sparkles, X, ShieldAlert, Cpu, CheckCircle2, ArrowRight, Info, AlertTriangle } from 'lucide-react'

interface GNNExplainerModalProps {
  isOpen: boolean
  onClose: () => void
  selectedLinkId?: string
}

export default function GNNExplainerModal({ isOpen, onClose, selectedLinkId }: GNNExplainerModalProps) {
  const [linkId, setLinkId] = useState(selectedLinkId || 'PRED-LINK-01')
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (selectedLinkId) setLinkId(selectedLinkId)
  }, [selectedLinkId])

  useEffect(() => {
    if (isOpen) {
      setLoading(true)
      axios.get(`/api/ml/explain?link_id=${linkId}`)
        .then(res => setData(res.data))
        .catch(() => {})
        .finally(() => setLoading(false))
    }
  }, [isOpen, linkId])

  if (!isOpen) return null

  const sampleLinks = [
    { id: 'PRED-LINK-01', label: 'Rahul Kumar ┄┄ Viktor Rao (89%)' },
    { id: 'PRED-LINK-02', label: 'Vikram Malhotra ┄┄ Offshore BA-05 (92%)' },
  ]

  const featureAttribution = data?.feature_attribution || [
    { feature: 'Common neighbors', importance_pct: 34 },
    { feature: 'Interaction patterns', importance_pct: 27 },
    { feature: 'Geographic similarity', importance_pct: 19 },
    { feature: 'Temporal similarity', importance_pct: 14 },
    { feature: 'Entity attributes', importance_pct: 6 },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 select-none">
      <div className="w-full max-w-2xl bg-[#0d0e17] border border-purple-500/70 rounded-xl shadow-[0_0_35px_rgba(124,58,237,0.35)] flex flex-col max-h-[85vh] overflow-hidden font-sans">
        
        {/* Header */}
        <div className="h-14 border-b border-purple-900/40 px-5 flex items-center justify-between bg-[#111320] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-950/80 border border-purple-500/60 flex items-center justify-center text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.4)]">
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-100">GNNExplainer — Machine Learning Explainability</h3>
              <p className="text-[11px] text-slate-400 font-mono">Sub-graph Feature Attribution & Inductive Link Evidence</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Link Switcher Chips */}
        <div className="px-5 py-2.5 bg-[#090a12] border-b border-purple-900/30 flex items-center gap-2 font-mono text-xs">
          <span className="text-slate-400">Predicted Links:</span>
          {sampleLinks.map(sl => (
            <button
              key={sl.id}
              onClick={() => setLinkId(sl.id)}
              className={`px-3 py-1 rounded text-xs transition ${
                linkId === sl.id
                  ? 'bg-purple-900/80 text-purple-200 border border-purple-500/60 font-bold shadow-[0_0_8px_rgba(168,85,247,0.3)]'
                  : 'bg-[#121422] text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {sl.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 font-sans text-xs">
          {data && (
            <>
              {/* Prediction Summary Card */}
              <div className="bg-[#121422] border border-purple-900/50 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-purple-400 font-mono font-bold uppercase">
                    PREDICTED RELATIONSHIP (INDUCTIVE GRAPHSAGE)
                  </div>
                  <div className="text-base font-bold text-slate-100 mt-0.5">
                    {data.source} ┄┄ {data.target}
                  </div>
                  <div className="text-[11px] text-purple-300 font-mono mt-1">
                    {data.prediction}
                  </div>
                </div>

                <div className="text-right font-mono">
                  <div className="text-[10px] text-slate-400">PREDICTION PROBABILITY</div>
                  <div className="text-2xl font-bold text-purple-300">{data.probability}</div>
                  <div className="text-[9px] text-emerald-400">CALIBRATED HIGH CONFIDENCE</div>
                </div>
              </div>

              {/* Exact Horizontal Bar Attribution (Prompt Section 23) */}
              <div className="bg-[#121422] border border-purple-900/50 rounded-xl p-4 font-mono text-xs space-y-3">
                <div className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Important Feature Attributions (GNNExplainer Subgraph Mask)</span>
                </div>

                <div className="space-y-2.5 pt-1">
                  {featureAttribution.map((item: any, idx: number) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300 font-medium">{item.feature}</span>
                        <span className="text-purple-300 font-bold">{item.importance_pct}%</span>
                      </div>
                      
                      {/* Bar */}
                      <div className="w-full h-2.5 bg-[#0a0b12] rounded-full overflow-hidden border border-purple-950">
                        <div
                          style={{ width: `${item.importance_pct * 2.2}%` }}
                          className="h-full bg-gradient-to-r from-purple-800 via-purple-500 to-emerald-400 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.5)] transition-all duration-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Evidentiary Justification */}
              <div className="bg-[#121422] border border-purple-900/50 rounded-xl p-4 font-mono text-xs space-y-2">
                <div className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                  Corroborating Graph Evidence
                </div>
                <ul className="list-disc list-inside text-slate-300 space-y-1 text-[11px]">
                  {data.subgraph_evidence?.map((ev: string, idx: number) => (
                    <li key={idx}>{ev}</li>
                  ))}
                </ul>
              </div>

              {/* Disclaimer Status */}
              <div className="pt-2 border-t border-purple-900/30 flex items-center justify-between text-[10px] font-mono">
                <span className="text-amber-400 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>STATUS: {data.status}</span>
                </span>
                <span className="text-slate-500">
                  Model: GraphSAGE + GNNExplainer
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

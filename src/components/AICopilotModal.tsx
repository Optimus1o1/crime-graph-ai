'use client'

import React, { useState } from 'react'
import axios from 'axios'
import { Bot, Send, ShieldCheck, AlertTriangle, ArrowRight, X, Cpu } from 'lucide-react'

interface AICopilotModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AICopilotModal({ isOpen, onClose }: AICopilotModalProps) {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<any>(null)

  if (!isOpen) return null

  const handleSearch = async (textToSearch?: string) => {
    const q = textToSearch || query
    if (!q.trim()) return
    setLoading(true)
    try {
      const res = await axios.post('/api/ai/copilot', { query: q })
      setResponse(res.data)
    } catch (err) {
      console.error('AI Copilot query failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const sampleQueries = [
    'How is Rahul Kumar connected to Viktor Rao?',
    'Why is Vikram Malhotra important to the network?',
    'Show me the circular financial layering cycle',
    'Explain the burner phone communication burst'
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
      <div className="w-full max-w-3xl bg-[#0d0e17] border border-purple-500/70 rounded-xl shadow-[0_0_35px_rgba(124,58,237,0.35)] flex flex-col max-h-[85vh] overflow-hidden">
        
        {/* Modal Header */}
        <div className="h-14 border-b border-purple-900/40 px-5 flex items-center justify-between bg-[#111320] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-950/80 border border-purple-500/60 flex items-center justify-center text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.4)]">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-100">AI Investigation Copilot</h3>
              <p className="text-[11px] text-slate-400 font-mono">Controlled Multi-Modal Graph & Evidence Orchestrator</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-4 border-b border-purple-900/30 bg-[#090a12]/90 shrink-0">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask an investigative question (e.g. How is Rahul Kumar connected to Viktor Rao?)..."
              className="flex-1 bg-[#141624] border border-purple-800/50 rounded-lg px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-500 font-mono focus:outline-none focus:border-purple-500 shadow-inner"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-purple-900/80 hover:bg-purple-800 text-purple-200 text-xs font-medium rounded-lg border border-purple-500/60 flex items-center gap-1.5 transition shadow-[0_0_10px_rgba(168,85,247,0.3)] disabled:opacity-50"
            >
              <span>{loading ? 'Synthesizing...' : 'Inquire'}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Query Chips */}
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {sampleQueries.map((sq, idx) => (
              <button
                key={idx}
                onClick={() => { setQuery(sq); handleSearch(sq); }}
                className="text-[10px] bg-[#141624] hover:bg-purple-950/60 text-purple-300 border border-purple-900/50 hover:border-purple-600/60 rounded px-2 py-0.5 font-mono transition"
              >
                {sq}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 font-sans text-xs">
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-purple-300 font-mono">
              <Cpu className="w-8 h-8 animate-spin text-purple-400" />
              <span>Synthesizing multi-hop paths, banking records, and cellular intelligence...</span>
            </div>
          )}

          {!loading && response && (
            <div className="space-y-4">
              {/* 1. Answer */}
              <div className="bg-[#121422] border border-purple-900/50 rounded-lg p-4">
                <div className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider mb-1">
                  1. Analytical Assessment & Answer
                </div>
                <div className="text-slate-200 leading-relaxed font-sans text-sm">
                  {response.answer}
                </div>
                <div className="mt-2.5 flex items-center gap-2">
                  <span className="text-[10px] bg-purple-950/80 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded font-mono font-bold">
                    Confidence: {Math.round(response.confidence * 100)}%
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {response.tools_executed?.length || 2} Controlled Tools Executed
                  </span>
                </div>
              </div>

              {/* 2. Graph Correlation */}
              <div className="bg-[#121422] border border-purple-900/50 rounded-lg p-3.5">
                <div className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider mb-1">
                  2. Graph Correlation & Relationship Flow
                </div>
                <div className="font-mono text-xs text-purple-200 bg-[#0a0b12] p-2.5 rounded border border-purple-900/40">
                  {response.graph_correlation}
                </div>
              </div>

              {/* 3. Reasoning Steps */}
              {response.reasoning && response.reasoning.length > 0 && (
                <div className="bg-[#121422] border border-purple-900/50 rounded-lg p-3.5">
                  <div className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider mb-2">
                    3. Evidentiary Reasoning Steps
                  </div>
                  <div className="space-y-2 font-mono text-xs">
                    {response.reasoning.map((step: any) => (
                      <div key={step.step_number} className="bg-[#0a0b12] p-2.5 rounded border border-slate-800 flex flex-col gap-1">
                        <div className="text-slate-200">
                          <strong className="text-purple-300">Step {step.step_number}:</strong> {step.observation}
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span>Evidence: <code className="text-emerald-400">{step.evidence_citation}</code></span>
                          <span className="text-purple-300 font-bold">{step.confidence_contribution}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Gaps & Suggested Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-[#121422] border border-amber-900/40 rounded-lg p-3.5">
                  <div className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Evidence Gaps
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {response.gaps}
                  </p>
                </div>

                <div className="bg-[#121422] border border-emerald-900/40 rounded-lg p-3.5">
                  <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Suggested Investigator Actions
                  </div>
                  <ul className="list-disc list-inside text-slate-300 text-[11px] space-y-1">
                    {response.suggested_next_steps?.map((step: string, i: number) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Sources & Disclaimer */}
              <div className="pt-2 border-t border-purple-900/30 text-[10px] font-mono text-slate-500 flex flex-col gap-1">
                <div>
                  <strong>Sources Cited:</strong> {response.sources?.map((s: string) => `[${s}]`).join(' ')}
                </div>
                <div className="text-amber-500/80">
                  {response.disclaimer}
                </div>
              </div>
            </div>
          )}

          {!loading && !response && (
            <div className="py-12 text-center text-slate-500 font-mono text-xs">
              Type an investigative question or select one of the prompts above.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

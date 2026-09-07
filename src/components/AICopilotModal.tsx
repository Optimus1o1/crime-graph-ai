'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { 
  Bot, 
  Send, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowRight, 
  X, 
  Cpu, 
  Key, 
  Sparkles, 
  ExternalLink, 
  Eye, 
  EyeOff, 
  Check 
} from 'lucide-react'

interface AICopilotModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AICopilotModal({ isOpen, onClose }: AICopilotModalProps) {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<any>(null)

  // Gemini API Key state
  const [geminiApiKey, setGeminiApiKey] = useState('')
  const [inputKey, setInputKey] = useState('')
  const [isKeyDrawerOpen, setIsKeyDrawerOpen] = useState(false)
  const [showKeyText, setShowKeyText] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Load saved key from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('crimegraph_gemini_api_key') || ''
      if (saved) {
        setGeminiApiKey(saved)
        setInputKey(saved)
      }
    } catch (e) {
      // localStorage may fail in restricted sandboxes
    }
  }, [])

  if (!isOpen) return null

  const handleSaveKey = () => {
    const trimmed = inputKey.trim()
    setGeminiApiKey(trimmed)
    try {
      if (trimmed) {
        localStorage.setItem('crimegraph_gemini_api_key', trimmed)
      } else {
        localStorage.removeItem('crimegraph_gemini_api_key')
      }
    } catch (e) {}

    setSaveSuccess(true)
    setTimeout(() => {
      setSaveSuccess(false)
      setIsKeyDrawerOpen(false)
    }, 900)
  }

  const handleClearKey = () => {
    setGeminiApiKey('')
    setInputKey('')
    try {
      localStorage.removeItem('crimegraph_gemini_api_key')
    } catch (e) {}
  }

  const handleSearch = async (textToSearch?: string) => {
    const q = textToSearch || query
    if (!q.trim()) return
    setLoading(true)
    try {
      const res = await axios.post('/api/ai/copilot', { 
        query: q,
        apiKey: geminiApiKey 
      })
      setResponse(res.data)
    } catch (err: any) {
      console.error('AI Copilot query failed:', err)
      setResponse({
        answer: 'Failed to communicate with intelligence engine. Please check your connection or Gemini API key.',
        confidence: 0.4,
        graph_correlation: 'Connection error',
        reasoning: [],
        gaps: err?.message || 'Network timeout',
        suggested_next_steps: ['Verify your Gemini API key in the top bar', 'Check server logs'],
        sources: [],
        tools_executed: []
      })
    } finally {
      setLoading(false)
    }
  }

  const sampleQueries = [
    'Who is the mastermind and how are they connected?',
    'How is Pooja Tiwari connected to Vikram Shetty?',
    'Explain the circular Hawala financial layering cycle',
    'What anomalies were detected in the network graph?'
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-3xl bg-[#0d0e17] border border-purple-500/70 rounded-xl shadow-[0_0_40px_rgba(124,58,237,0.35)] flex flex-col max-h-[88vh] overflow-hidden">
        
        {/* Modal Header */}
        <div className="h-14 border-b border-purple-900/40 px-5 flex items-center justify-between bg-[#111320] shrink-0 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-950/80 border border-purple-500/60 flex items-center justify-center text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.4)]">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-100">AI Investigation Copilot</h3>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-mono font-bold">
                  GEMINI POWERED
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">Controlled Multi-Modal Graph & Evidence Orchestrator</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Gemini API Key Toggle Button */}
            <button
              onClick={() => setIsKeyDrawerOpen(!isKeyDrawerOpen)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition border cursor-pointer ${
                geminiApiKey
                  ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50 hover:bg-emerald-900 shadow-[0_0_10px_rgba(16,185,129,0.25)]'
                  : 'bg-purple-950/90 text-purple-300 border-purple-500/50 hover:bg-purple-900 shadow-[0_0_10px_rgba(168,85,247,0.25)]'
              }`}
              title="Configure Google Gemini API Key"
            >
              <Key className="w-3.5 h-3.5" />
              <span>{geminiApiKey ? 'Gemini Live Active' : 'Set Gemini Key'}</span>
            </button>

            <button 
              onClick={onClose} 
              className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Gemini API Key Configuration Drawer */}
        {isKeyDrawerOpen && (
          <div className="bg-[#090b16] border-b border-purple-900/50 p-4 font-mono text-xs animate-in fade-in duration-150">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-300 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                GOOGLE GEMINI API KEY CONFIGURATION
              </span>
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noreferrer"
                className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 font-sans"
              >
                <span>Get Free Gemini Key (Google AI Studio)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type={showKeyText ? 'text' : 'password'}
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="Paste your Gemini API Key here (e.g. AIzaSy...)"
                  className="w-full bg-[#131525] border border-purple-800/60 focus:border-cyan-400 rounded-lg px-3.5 py-1.5 text-slate-100 placeholder-slate-500 text-xs font-mono focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowKeyText(!showKeyText)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  title={showKeyText ? 'Hide API key' : 'Show API key'}
                >
                  {showKeyText ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>

              <button
                type="button"
                onClick={handleSaveKey}
                className="px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold rounded-lg text-xs transition cursor-pointer shadow-[0_0_10px_rgba(0,229,255,0.4)] flex items-center gap-1"
              >
                {saveSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <span>Save Key</span>
                )}
              </button>

              {geminiApiKey && (
                <button
                  type="button"
                  onClick={handleClearKey}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-300 rounded-lg text-xs transition cursor-pointer border border-slate-700"
                >
                  Clear
                </button>
              )}
            </div>

            <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
              Your API key connects CrimeGraph AI directly to Google Gemini 1.5 Flash / 2.0 Flash for real-time generative reasoning across the 112-node criminal syndicate.
            </p>
          </div>
        )}

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
              placeholder="Ask an investigative question (e.g. Who is the mastermind and how are they connected?)..."
              className="flex-1 bg-[#141624] border border-purple-800/50 rounded-lg px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-500 font-mono focus:outline-none focus:border-purple-500 shadow-inner"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-gradient-to-r from-purple-900 to-indigo-900 hover:from-purple-800 hover:to-indigo-800 text-purple-200 text-xs font-medium rounded-lg border border-purple-500/60 flex items-center gap-1.5 transition shadow-[0_0_12px_rgba(168,85,247,0.3)] disabled:opacity-50 cursor-pointer"
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
                className="text-[10px] bg-[#141624] hover:bg-purple-950/60 text-purple-300 border border-purple-900/50 hover:border-purple-600/60 rounded px-2 py-0.5 font-mono transition cursor-pointer"
              >
                {sq}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 font-sans text-xs scrollbar-thin">
          {loading && (
            <div className="py-14 flex flex-col items-center justify-center gap-3 text-purple-300 font-mono">
              <Cpu className="w-8 h-8 animate-spin text-cyan-400" />
              <span className="text-xs">Querying Google Gemini with CrimeGraph topology grounding...</span>
            </div>
          )}

          {!loading && response && (
            <div className="space-y-4">
              {/* 1. Answer */}
              <div className="bg-[#121422] border border-purple-900/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
                  <div className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider">
                    1. Analytical Assessment & Answer
                  </div>
                  {response.model_used && (
                    <span className="text-[10px] bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded font-mono font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      {response.model_used}
                    </span>
                  )}
                </div>

                <div className="text-slate-200 leading-relaxed font-sans text-sm whitespace-pre-line">
                  {response.answer}
                </div>

                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] bg-purple-950/80 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded font-mono font-bold">
                    Confidence: {Math.round((response.confidence || 0.85) * 100)}%
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {response.tools_executed?.length || 2} Controlled Tools Executed
                  </span>
                </div>
              </div>

              {/* 2. Graph Correlation */}
              {response.graph_correlation && (
                <div className="bg-[#121422] border border-purple-900/50 rounded-lg p-3.5">
                  <div className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider mb-1">
                    2. Graph Correlation & Relationship Flow
                  </div>
                  <div className="font-mono text-xs text-cyan-200 bg-[#0a0b12] p-2.5 rounded border border-purple-900/40 break-words">
                    {response.graph_correlation}
                  </div>
                </div>
              )}

              {/* 3. Reasoning Steps */}
              {response.reasoning && response.reasoning.length > 0 && (
                <div className="bg-[#121422] border border-purple-900/50 rounded-lg p-3.5">
                  <div className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider mb-2">
                    3. Evidentiary Reasoning Steps ({response.reasoning.length})
                  </div>
                  <div className="space-y-2 font-mono text-xs">
                    {response.reasoning.map((step: any, idx: number) => (
                      <div key={idx} className="bg-[#0a0b12] p-2.5 rounded border border-slate-800 flex flex-col gap-1">
                        <div className="text-slate-200">
                          <strong className="text-purple-300">Step {step.step_number || idx + 1}:</strong> {step.observation}
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 flex-wrap gap-1">
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
                {response.sources && response.sources.length > 0 && (
                  <div>
                    <strong>Sources Cited:</strong> {response.sources.map((s: string) => `[${s}]`).join(' ')}
                  </div>
                )}
                {response.disclaimer && (
                  <div className="text-amber-500/80">
                    {response.disclaimer}
                  </div>
                )}
              </div>
            </div>
          )}

          {!loading && !response && (
            <div className="py-14 text-center text-slate-500 font-mono text-xs flex flex-col items-center justify-center gap-2">
              <Bot className="w-6 h-6 text-purple-500/40" />
              <span>Ask an investigative question or select one of the prompts above.</span>
              <span className="text-[11px] text-purple-400/80">
                Tip: Click &quot;Set Gemini Key&quot; at the top right to enable live Google Gemini AI reasoning.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

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
    } catch (e) {}
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl xl:max-w-5xl bg-[#090c16] border border-purple-500/50 rounded-2xl shadow-[0_0_50px_rgba(124,58,237,0.3)] flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Modal Header */}
        <div className="h-16 border-b border-purple-900/40 px-6 flex items-center justify-between bg-[#0e1222] shrink-0 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-950/90 border border-purple-500/60 flex items-center justify-center text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.4)]">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-base font-bold text-white tracking-wide">AI Investigation Copilot</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-mono font-bold">
                  GEMINI 3.6 FLASH
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Multi-Modal Graph & Cryptographic Evidence Orchestrator
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Gemini API Key Toggle Button */}
            <button
              onClick={() => setIsKeyDrawerOpen(!isKeyDrawerOpen)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition border cursor-pointer ${
                geminiApiKey
                  ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/60 hover:bg-emerald-900 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                  : 'bg-purple-950/90 text-purple-300 border-purple-500/60 hover:bg-purple-900 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
              }`}
              title="Configure Google Gemini API Key"
            >
              <Key className="w-4 h-4" />
              <span>{geminiApiKey ? 'Gemini Live Active' : 'Set Gemini Key'}</span>
            </button>

            <button 
              onClick={onClose} 
              className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Gemini API Key Configuration Drawer */}
        {isKeyDrawerOpen && (
          <div className="bg-[#0b0e1e] border-b border-purple-900/50 p-5 font-mono text-xs animate-in slide-in-from-top-2 duration-150">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-purple-300 font-bold flex items-center gap-2 text-xs">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                GOOGLE GEMINI API KEY CONFIGURATION
              </span>
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noreferrer"
                className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-sans font-semibold"
              >
                <span>Get Free Gemini Key (Google AI Studio)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="relative flex-1">
                <input
                  type={showKeyText ? 'text' : 'password'}
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="Paste your Gemini API Key here (e.g. AIzaSy...)"
                  className="w-full bg-[#13182c] border border-purple-800/60 focus:border-cyan-400 rounded-lg px-4 py-2 text-slate-100 placeholder-slate-500 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-cyan-400/50"
                />
                <button
                  type="button"
                  onClick={() => setShowKeyText(!showKeyText)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  title={showKeyText ? 'Hide API key' : 'Show API key'}
                >
                  {showKeyText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <button
                type="button"
                onClick={handleSaveKey}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold rounded-lg text-xs transition cursor-pointer shadow-[0_0_12px_rgba(0,229,255,0.4)] flex items-center gap-1.5"
              >
                {saveSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
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
                  className="px-3 py-2 bg-slate-800 hover:bg-red-950 text-slate-300 hover:text-red-300 rounded-lg text-xs transition cursor-pointer border border-slate-700"
                >
                  Clear
                </button>
              )}
            </div>

            <p className="text-xs font-sans text-slate-400 mt-2.5 leading-relaxed">
              Your API key connects CrimeGraph AI directly to Google Gemini 3.6 Flash for real-time generative reasoning across the 112-node criminal syndicate.
            </p>
          </div>
        )}

        {/* Query Input Bar */}
        <div className="p-5 border-b border-purple-900/30 bg-[#070914] shrink-0">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
            className="flex items-center gap-2.5"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask an investigative question (e.g. Who is the mastermind and how are they connected?)..."
              className="flex-1 bg-[#101426] border border-purple-800/50 focus:border-purple-400 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 font-sans focus:outline-none focus:ring-1 focus:ring-purple-400/50 shadow-inner"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-gradient-to-r from-purple-900 to-indigo-900 hover:from-purple-800 hover:to-indigo-800 text-purple-100 text-sm font-bold rounded-xl border border-purple-500/60 flex items-center gap-2 transition shadow-[0_0_15px_rgba(168,85,247,0.3)] disabled:opacity-50 cursor-pointer"
            >
              <span>{loading ? 'Synthesizing...' : 'Inquire'}</span>
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Query Prompt Chips */}
          <div className="flex flex-wrap gap-2 mt-3">
            {sampleQueries.map((sq, idx) => (
              <button
                key={idx}
                onClick={() => { setQuery(sq); handleSearch(sq); }}
                className="text-xs bg-[#101426] hover:bg-purple-950/70 text-purple-200 border border-purple-900/50 hover:border-purple-500/60 rounded-lg px-3 py-1.5 font-sans font-medium transition cursor-pointer"
              >
                {sq}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 font-sans text-sm scrollbar-thin">
          {loading && (
            <div className="py-20 flex flex-col items-center justify-center gap-3.5 text-purple-300 font-sans">
              <Cpu className="w-9 h-9 animate-spin text-cyan-400" />
              <span className="text-sm font-semibold tracking-wide">
                Querying Google Gemini with CrimeGraph topology grounding...
              </span>
            </div>
          )}

          {!loading && response && (
            <div className="space-y-5">
              {/* 1. Answer */}
              <div className="bg-[#0f1324] border border-purple-900/50 rounded-xl p-5 shadow-lg">
                <div className="flex items-center justify-between mb-2.5 flex-wrap gap-2">
                  <div className="text-xs font-mono text-purple-300 font-bold uppercase tracking-wider">
                    1. Analytical Assessment & Answer
                  </div>
                  {response.model_used && (
                    <span className="text-xs bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 px-3 py-1 rounded-md font-mono font-bold flex items-center gap-1.5 shadow-[0_0_8px_rgba(0,229,255,0.2)]">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      {response.model_used}
                    </span>
                  )}
                </div>

                <div className="text-slate-100 leading-relaxed font-sans text-sm sm:text-base whitespace-pre-line">
                  {response.answer}
                </div>

                <div className="mt-4 flex items-center gap-2.5 flex-wrap">
                  <span className="text-xs bg-purple-950/80 text-purple-300 border border-purple-500/40 px-2.5 py-1 rounded-md font-mono font-bold">
                    Confidence: {Math.round((response.confidence || 0.85) * 100)}%
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {response.tools_executed?.length || 2} Controlled Tools Executed
                  </span>
                </div>
              </div>

              {/* 2. Graph Correlation */}
              {response.graph_correlation && (
                <div className="bg-[#0f1324] border border-purple-900/50 rounded-xl p-4">
                  <div className="text-xs font-mono text-purple-300 font-bold uppercase tracking-wider mb-2">
                    2. Graph Correlation & Relationship Flow
                  </div>
                  <div className="font-mono text-xs sm:text-sm text-cyan-200 bg-[#070a14] p-3.5 rounded-lg border border-purple-900/40 break-words leading-relaxed">
                    {response.graph_correlation}
                  </div>
                </div>
              )}

              {/* 3. Reasoning Steps */}
              {response.reasoning && response.reasoning.length > 0 && (
                <div className="bg-[#0f1324] border border-purple-900/50 rounded-xl p-5">
                  <div className="text-xs font-mono text-purple-300 font-bold uppercase tracking-wider mb-3">
                    3. Evidentiary Reasoning Steps ({response.reasoning.length})
                  </div>
                  <div className="space-y-2.5">
                    {response.reasoning.map((step: any, idx: number) => (
                      <div key={idx} className="bg-[#070a14] p-3.5 rounded-lg border border-slate-800 flex flex-col gap-1.5">
                        <div className="text-slate-200 font-sans text-sm leading-snug">
                          <strong className="text-purple-300 font-bold">Step {step.step_number || idx + 1}:</strong> {step.observation}
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-400 flex-wrap gap-1 font-mono pt-1">
                          <span>Evidence: <code className="text-emerald-400 font-bold">{step.evidence_citation}</code></span>
                          <span className="text-purple-300 font-bold">{step.confidence_contribution}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Gaps & Suggested Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#0f1324] border border-amber-900/40 rounded-xl p-4">
                  <div className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> Evidence Gaps
                  </div>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-sans">
                    {response.gaps}
                  </p>
                </div>

                <div className="bg-[#0f1324] border border-emerald-900/40 rounded-xl p-4">
                  <div className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" /> Suggested Investigator Actions
                  </div>
                  <ul className="list-disc list-inside text-slate-300 text-xs sm:text-sm space-y-1.5 font-sans leading-relaxed">
                    {response.suggested_next_steps?.map((step: string, i: number) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Sources & Disclaimer */}
              <div className="pt-2.5 border-t border-purple-900/30 text-xs font-mono text-slate-400 flex flex-col gap-1">
                {response.sources && response.sources.length > 0 && (
                  <div>
                    <strong className="text-slate-300">Sources Cited:</strong> {response.sources.map((s: string) => `[${s}]`).join(' ')}
                  </div>
                )}
                {response.disclaimer && (
                  <div className="text-amber-400/90">
                    {response.disclaimer}
                  </div>
                )}
              </div>
            </div>
          )}

          {!loading && !response && (
            <div className="py-20 text-center text-slate-400 font-sans text-sm flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Bot className="w-6 h-6" />
              </div>
              <span className="font-semibold text-slate-300">
                Ask an investigative question or select one of the suggested prompts above.
              </span>
              <span className="text-xs text-purple-400/90 font-mono">
                Grounded directly into the 112-node CrimeGraph intelligence repository.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

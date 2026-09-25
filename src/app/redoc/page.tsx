'use client'

import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { ArrowLeft, Download, Terminal, RefreshCw, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react'

export default function RedocPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loadingStep, setLoadingStep] = useState<string>('Initializing API engine...')
  const initRef = useRef(false)

  const loadDocumentation = async () => {
    setLoading(true)
    setError(null)
    setLoadingStep('Fetching OpenAPI specification...')

    try {
      // 1. Fetch OpenAPI specification JSON directly from the platform API
      const specResponse = await fetch('/api/openapi', {
        headers: { 'Accept': 'application/json' },
        cache: 'no-store'
      })

      if (!specResponse.ok) {
        throw new Error(`OpenAPI spec endpoint returned HTTP ${specResponse.status}: ${specResponse.statusText}`)
      }

      const specData = await specResponse.json()
      setLoadingStep('Loading ReDoc rendering engine...')

      // 2. Load ReDoc standalone script with local vendor first, then resilient CDN fallbacks
      const scriptSources = [
        '/vendor/redoc.standalone.js',
        'https://cdn.jsdelivr.net/npm/redoc@2.2.0/bundles/redoc.standalone.js',
        'https://unpkg.com/redoc@2.2.0/bundles/redoc.standalone.js'
      ]

      const ensureRedocLoaded = async (): Promise<void> => {
        // @ts-ignore
        if (window.Redoc) {
          return
        }

        for (const src of scriptSources) {
          try {
            await new Promise<void>((resolve, reject) => {
              const script = document.createElement('script')
              script.src = src
              script.async = true
              script.onload = () => resolve()
              script.onerror = () => reject(new Error(`Failed to load script from ${src}`))
              document.body.appendChild(script)
            })
            // @ts-ignore
            if (window.Redoc) {
              return
            }
          } catch (e) {
            console.warn(`[ReDoc Loader] Source failed: ${src}, attempting fallback...`)
          }
        }

        // @ts-ignore
        if (!window.Redoc) {
          throw new Error('Could not load ReDoc library from local bundle or CDN fallbacks')
        }
      }

      await ensureRedocLoaded()

      setLoadingStep('Compiling interactive documentation...')

      const container = document.getElementById('redoc-container')
      if (!container) {
        throw new Error('ReDoc mount target container element (#redoc-container) not found in DOM')
      }

      container.innerHTML = ''

      // 3. Initialize ReDoc directly using the pre-fetched spec object (no internal ReDoc fetch required)
      // @ts-ignore
      window.Redoc.init(
        specData,
        {
          theme: {
            colors: {
              primary: { main: '#00E5FF' },
              success: { main: '#00C48C' },
              warning: { main: '#FFB020' },
              error: { main: '#FF3D3D' },
              text: { primary: '#F1F5F9', secondary: '#94A3B8' },
              http: {
                get: '#00E5FF',
                post: '#10B981',
                put: '#F59E0B',
                delete: '#EF4444'
              }
            },
            typography: {
              fontSize: '14px',
              fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
              headings: {
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                fontWeight: '700'
              },
              code: {
                fontFamily: 'JetBrains Mono, Menlo, monospace',
                fontSize: '12.5px'
              }
            },
            sidebar: {
              backgroundColor: '#050813',
              textColor: '#94A3B8',
              activeTextColor: '#00E5FF',
              width: '280px'
            },
            rightPanel: {
              backgroundColor: '#03050A',
              textColor: '#FFFFFF',
              width: '42%'
            }
          },
          scrollYOffset: 56,
          hideDownloadButton: false,
          expandResponses: '200,201',
          nativeScrollbars: false
        },
        container,
        () => {
          setLoading(false)
        }
      )
    } catch (err: any) {
      console.error('[ReDoc Init Error]:', err)
      setError(err?.message || 'Failed to establish connection to documentation engine')
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!initRef.current) {
      initRef.current = true
      loadDocumentation()
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#050813] text-slate-100 flex flex-col font-sans select-none">
      
      {/* Top ReDoc Tactical Control Bar */}
      <header className="h-14 bg-[#03050A] border-b border-cyan-900/50 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-50 shadow-lg">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 hover:text-white transition px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/40 hover:border-cyan-400"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>RETURN TO CONSOLE</span>
          </Link>

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00e5ff]" />
            <h1 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-white font-mono">
              CrimeGraph AI — Enterprise API Specification
            </h1>
            <span className="hidden md:inline text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 font-bold">
              OAS 3.0.3
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="/api/openapi"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-mono text-slate-300 hover:text-cyan-300 transition px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700/60 hover:border-cyan-500/50"
            title="Download raw OpenAPI specification JSON"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">openapi.json</span>
          </a>

          <Link
            href="/?view=api_engine"
            className="flex items-center gap-1.5 text-xs font-mono font-bold text-white transition px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-400 shadow-[0_0_12px_rgba(0,229,255,0.3)]"
          >
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>API PLAYGROUND</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 relative bg-[#04060C]">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050813] z-20 space-y-4">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
              <div className="w-6 h-6 rounded-full border border-indigo-500/30 border-b-indigo-400 animate-spin" style={{ animationDirection: 'reverse' }} />
            </div>
            <div className="text-center font-mono space-y-1">
              <div className="text-xs font-bold tracking-widest text-cyan-400 uppercase">
                {loadingStep}
              </div>
              <div className="text-[11px] text-slate-500">
                Compiling 40+ CrimeGraph REST Endpoints & Tactical Schemas
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="p-8 max-w-xl mx-auto mt-12 bg-red-950/40 border border-red-500/50 rounded-xl text-center space-y-4 font-mono">
            <div className="w-10 h-10 mx-auto rounded-full bg-red-900/40 border border-red-500/60 flex items-center justify-center text-red-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="text-red-400 font-bold text-sm">CONNECTION FAILED TO REDOC ENGINE</div>
            <p className="text-xs text-slate-400 leading-relaxed">{error}</p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => loadDocumentation()}
                className="px-4 py-2 bg-red-900/60 hover:bg-red-800 text-white rounded-lg text-xs font-bold inline-flex items-center gap-2 border border-red-400/60 transition cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Connection</span>
              </button>
              <a
                href="/api/openapi"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold inline-flex items-center gap-2 border border-slate-600 transition"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Open Raw Spec</span>
              </a>
            </div>
          </div>
        )}

        {/* ReDoc Mounted Container */}
        <div id="redoc-container" className="min-h-screen text-slate-100" />
      </main>

    </div>
  )
}

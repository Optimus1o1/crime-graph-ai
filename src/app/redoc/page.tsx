'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Download, Terminal, RefreshCw, ExternalLink } from 'lucide-react'

export default function RedocPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Dynamically load ReDoc standalone script
    const scriptId = 'redoc-standalone-script'
    let existingScript = document.getElementById(scriptId) as HTMLScriptElement | null

    const initRedoc = () => {
      // @ts-ignore
      if (window.Redoc) {
        try {
          // @ts-ignore
          window.Redoc.init(
            '/api/openapi',
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
                  fontSize: '13.5px',
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
            document.getElementById('redoc-container'),
            () => {
              setLoading(false)
            }
          )
        } catch (err: any) {
          setError(err?.message || 'Failed to initialize ReDoc engine')
          setLoading(false)
        }
      }
    }

    if (!existingScript) {
      const script = document.createElement('script')
      script.id = scriptId
      script.src = 'https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js'
      script.async = true
      script.onload = () => {
        initRedoc()
      }
      script.onerror = () => {
        setError('Failed to load ReDoc documentation engine from CDN. Verify network connection.')
        setLoading(false)
      }
      document.body.appendChild(script)
    } else {
      initRedoc()
    }

    return () => {
      // Cleanup if needed
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
              CrimeGraph AI — Enterprise API Specification (ReDoc)
            </h1>
            <span className="hidden md:inline text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 font-bold">
              OAS 3.1.0
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="/api/openapi"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-mono text-slate-300 hover:text-cyan-300 transition px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700/60 hover:border-cyan-500/50"
            title="Download raw OpenAPI 3.1.0 specification JSON"
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
                COMPILING REDOC API ENGINE...
              </div>
              <div className="text-[11px] text-slate-500">
                Parsing 40+ CrimeGraph REST Endpoints & Schemas
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="p-8 max-w-xl mx-auto mt-12 bg-red-950/40 border border-red-500/50 rounded-xl text-center space-y-3 font-mono">
            <div className="text-red-400 font-bold text-sm">FAILED TO LOAD REDOC SPECIFICATION</div>
            <p className="text-xs text-slate-400">{error}</p>
            <div className="pt-2">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-900/60 hover:bg-red-800 text-white rounded-lg text-xs font-bold inline-flex items-center gap-2 border border-red-400/60"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Connection</span>
              </button>
            </div>
          </div>
        )}

        {/* ReDoc Mounted Container */}
        <div id="redoc-container" className="min-h-screen text-slate-100" />
      </main>

    </div>
  )
}

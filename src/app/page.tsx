'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import NavigationRail from '@/components/NavigationRail'
import CrimeGraphLogo from '@/components/CrimeGraphLogo'

function ViewLoadingSkeleton({ label }: { label: string }) {
  return (
    <div className="flex-1 w-full h-full min-h-[400px] flex flex-col items-center justify-center bg-[#050A0F] font-mono text-cyan-400 p-6 space-y-4 select-none">
      <div className="relative w-14 h-14 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
        <div className="w-7 h-7 rounded-full border border-purple-500/30 border-b-purple-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.2s' }} />
      </div>
      <div className="text-center space-y-1">
        <div className="text-xs tracking-widest text-cyan-300 font-bold uppercase animate-pulse">
          INITIALIZING {label}
        </div>
        <div className="text-[10px] text-slate-500 tracking-wider">STREAMING TACTICAL TELEMETRY MODULE...</div>
      </div>
    </div>
  )
}

const IntelCoreDashboardView = dynamic(() => import('@/components/views/IntelCoreDashboardView'), {
  loading: () => <ViewLoadingSkeleton label="INTEL CORE DASHBOARD" />,
  ssr: false,
})

const TacticalKnowledgeGraphView = dynamic(() => import('@/components/views/TacticalKnowledgeGraphView'), {
  loading: () => <ViewLoadingSkeleton label="TACTICAL KNOWLEDGE GRAPH" />,
  ssr: false,
})

const CCTVTrackingHubView = dynamic(() => import('@/components/views/CCTVTrackingHubView'), {
  loading: () => <ViewLoadingSkeleton label="CCTV ANPR TRACKING HUB" />,
  ssr: false,
})

const CaseFilesHubView = dynamic(() => import('@/components/views/CaseFilesHubView'), {
  loading: () => <ViewLoadingSkeleton label="CASE FILES & DOSSIERS" />,
  ssr: false,
})

const CriminalEntityDossierView = dynamic(() => import('@/components/views/CriminalEntityDossierView'), {
  loading: () => <ViewLoadingSkeleton label="CRIMINAL ENTITY DOSSIER" />,
  ssr: false,
})

const CrimeAnalyticsIntelView = dynamic(() => import('@/components/views/CrimeAnalyticsIntelView'), {
  loading: () => <ViewLoadingSkeleton label="CRIME ANALYTICS & GNN PREDICTIONS" />,
  ssr: false,
})

const ForensicEvidenceAuditView = dynamic(() => import('@/components/views/ForensicEvidenceAuditView'), {
  loading: () => <ViewLoadingSkeleton label="FORENSIC EVIDENCE AUDIT" />,
  ssr: false,
})

const UrbanDigitalTwin3DView = dynamic(() => import('@/components/views/UrbanDigitalTwin3DView'), {
  loading: () => <ViewLoadingSkeleton label="3D URBAN DIGITAL TWIN" />,
  ssr: false,
})

const ManagementPlatformView = dynamic(() => import('@/components/views/ManagementPlatformView'), {
  loading: () => <ViewLoadingSkeleton label="MANAGEMENT PLATFORM" />,
  ssr: false,
})

const APIEngineView = dynamic(() => import('@/components/views/APIEngineView'), {
  loading: () => <ViewLoadingSkeleton label="API ENGINE & REDOC SPECIFICATION" />,
  ssr: false,
})

const VehicleJourneyModal = dynamic(() => import('@/components/VehicleJourneyModal'), { ssr: false })
const PredictionAnalyticsModal = dynamic(() => import('@/components/PredictionAnalyticsModal'), { ssr: false })
const AICopilotModal = dynamic(() => import('@/components/AICopilotModal'), { ssr: false })
const GNNExplainerModal = dynamic(() => import('@/components/GNNExplainerModal'), { ssr: false })
const AuthView = dynamic(() => import('@/components/AuthView'), { ssr: false })
import GlobalSearchCommand from '@/components/GlobalSearchCommand'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useStore } from '@/store'
import { 
  ShieldAlert, 
  Search, 
  Bot, 
  DownloadCloud, 
  LogOut, 
  Bell,
  Sparkles,
  Layers,
  Radio,
  UserCheck,
  Terminal
} from 'lucide-react'

export default function Home() {
  const [activeView, setActiveView] = useState<string>('dashboard')
  const [isJourneyOpen, setIsJourneyOpen] = useState(false)
  const [isPredictionsOpen, setIsPredictionsOpen] = useState(false)
  const [isCopilotOpen, setIsCopilotOpen] = useState(false)
  const [isExplainerOpen, setIsExplainerOpen] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)

  // Authentication state
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false)

  const { loadGraph, selectNode, nodes } = useStore()

  useEffect(() => {
    loadGraph()
    const storedToken = localStorage.getItem('crimegraph_token')
    const storedUser = localStorage.getItem('crimegraph_user')
    if (storedToken && storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser))
        setIsAuthenticated(true)
      } catch {
        setIsAuthenticated(false)
      }
    } else {
      setIsAuthenticated(false)
    }

    // Check live Supabase session if available
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data }) => {
        if (data?.session?.user) {
          const u = data.session.user
          const userObj = {
            id: u.id,
            username: u.user_metadata?.username || u.email?.split('@')[0] || 'Investigator',
            full_name: u.user_metadata?.full_name || 'Investigator',
            email: u.email,
            agency: u.user_metadata?.agency || 'Central Cyber Crime Police Station',
            badge_id: u.user_metadata?.badge_id || 'CCPS-SUPABASE-01',
            clearance: u.user_metadata?.clearance || 'LEVEL 4 — TOP SECRET',
            role: 'INVESTIGATOR'
          }
          setCurrentUser(userObj)
          setIsAuthenticated(true)
          localStorage.setItem('crimegraph_user', JSON.stringify(userObj))
        }
      }).catch(err => console.warn('Supabase session check:', err))
    }

    // Check URL parameters for view navigation
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const requestedView = urlParams.get('view')
      if (requestedView) {
        setActiveView(requestedView)
      }
    }
  }, [])

  // Professional, authoritative Title & Subtitle Hierarchy for all 10 core views
  const viewTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'Intel Core Dashboard',
      subtitle: 'Surveillance overview & active threat telemetry'
    },
    network: {
      title: 'Tactical Knowledge Graph',
      subtitle: 'Force-directed network analysis & relation modeling'
    },
    camera: {
      title: 'CCTV Live Tracking Hub',
      subtitle: 'ANPR camera matrix & optical plate recognition'
    },
    cases: {
      title: 'Case Files & Dossiers',
      subtitle: 'Syndicate investigation records & court readiness'
    },
    suspects: {
      title: 'Criminal Entity Dossier',
      subtitle: 'Tactical profile, behavioral telemetry & network links'
    },
    analytics: {
      title: 'Crime Analytics & GNN',
      subtitle: 'Graph neural network predictions & threat forecasts'
    },
    evidence: {
      title: 'Forensic Audit Trail',
      subtitle: 'Chain of custody timeline & SHA-256 evidence integrity'
    },
    digital_twin: {
      title: '3D Urban Digital Twin',
      subtitle: 'Metropolitan spatial correlation & sensor telemetry'
    },
    api_engine: {
      title: 'API Engine & ReDoc',
      subtitle: 'REST runtime gateway & OpenAPI 3.1.0 specification'
    },
    settings: {
      title: 'System Management',
      subtitle: 'Platform configuration, data pipelines & compliance'
    }
  }

  const currentTitle = viewTitles[activeView] || viewTitles.dashboard

  if (!isAuthenticated) {
    return (
      <AuthView 
        onAuthenticated={(user) => {
          setCurrentUser(user)
          setIsAuthenticated(true)
        }} 
      />
    )
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-[#04070D] text-slate-100 overflow-hidden font-sans select-none">
      
      {/* ============================================================ */}
      {/* UNIFIED TACTICAL CYBER HEADER (Matching Specification Screens) */}
      {/* ============================================================ */}
      <header className="h-16 bg-[#050814] border-b border-cyan-900/40 px-3 sm:px-5 flex items-center justify-between z-40 shrink-0 select-none shadow-[0_4px_25px_rgba(0,0,0,0.8)]">
        
        {/* Left: CG_AI Emblem & View Title / Subtitle */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <CrimeGraphLogo 
            size="sm" 
            variant="emblem" 
            interactive={true} 
            badgeType="emblem"
            onClick={() => setActiveView('dashboard')}
            title="CrimeGraph AI Tactical Center"
          />

          <div className="flex flex-col justify-center min-w-0">
            <h1 className="text-sm sm:text-base font-bold text-white tracking-normal font-sans leading-tight truncate max-w-[150px] xs:max-w-[200px] sm:max-w-[280px] md:max-w-[340px]">
              {currentTitle.title}
            </h1>
            <span className="hidden sm:block text-xs font-sans text-slate-400 tracking-normal truncate mt-0.5">
              {currentTitle.subtitle}
            </span>
          </div>
        </div>

        {/* Center: Global Search Command Center */}
        <div className="hidden md:flex flex-1 max-w-xs lg:max-w-sm xl:max-w-md mx-3 lg:mx-6 justify-center">
          <GlobalSearchCommand 
            onNavigate={setActiveView} 
            onSelectNode={selectNode} 
          />
        </div>

        {/* Right: API Engine Launcher, Copilot, Alerts & User Clearance Card */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          
          {/* Mobile Search Bar Trigger (<md) */}
          <button
            type="button"
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            className="md:hidden p-2 rounded-lg bg-slate-900/90 text-cyan-400 border border-cyan-900/60 hover:bg-slate-800 transition cursor-pointer"
            title="Search criminal entities"
            aria-label="Toggle search input"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Operation Classification Pill */}
          <div className="hidden 2xl:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#00e5ff]" />
            <span>RED CORRIDOR</span>
          </div>

          {/* Quick API Engine Launcher */}
          <button
            onClick={() => setActiveView('api_engine')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeView === 'api_engine'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-400 shadow-[0_0_12px_rgba(0,229,255,0.35)]'
                : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-cyan-900/50 hover:border-cyan-500/50'
            }`}
            title="Launch API Engine & ReDoc Documentation"
          >
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">API ENGINE</span>
          </button>

          {/* Quick AI Copilot Trigger */}
          <button
            onClick={() => setIsCopilotOpen(true)}
            className="px-2.5 sm:px-3 py-1.5 bg-indigo-950/80 hover:bg-indigo-900/90 border border-indigo-500/40 rounded-lg text-indigo-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm hover:border-indigo-400"
            title="Launch AI Investigation Copilot"
          >
            <Bot className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline font-sans">COPILOT</span>
          </button>

          {/* Clean Alert Notification Pill */}
          <div 
            onClick={() => setActiveView('dashboard')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-950/80 border border-red-500/50 text-red-300 text-xs font-bold cursor-pointer hover:border-red-400 transition"
            title="9+ Critical Intel Telemetry Alerts"
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>9+<span className="hidden xl:inline"> ALERTS</span></span>
          </div>

          {/* User Profile / Security Clearance Card */}
          <div className="flex items-center gap-2 pl-2 border-l border-cyan-900/40">
            <div 
              onClick={() => setIsAuthModalOpen(true)}
              className="hidden lg:flex flex-col text-right cursor-pointer hover:opacity-80 transition"
              title="Click to view security clearance"
            >
              <span className="text-xs font-bold text-white leading-tight">
                {currentUser?.username || 'ANALYST_KAHN'}
              </span>
              <span className="text-[10px] font-mono text-cyan-400 font-medium tracking-wider">
                {currentUser?.badge_id || 'SEC_LEVEL_4'}
              </span>
            </div>

            <div 
              onClick={() => setIsAuthModalOpen(true)}
              className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-400/80 flex items-center justify-center text-cyan-200 font-black text-xs shadow-[0_0_8px_rgba(0,229,255,0.25)] cursor-pointer hover:scale-105 transition shrink-0"
              title="Open Security Clearance & Account Modal"
            >
              {currentUser?.username ? currentUser.username[0].toUpperCase() : 'K'}
            </div>

            <button
              onClick={() => {
                localStorage.removeItem('crimegraph_token')
                localStorage.removeItem('crimegraph_user')
                if (isSupabaseConfigured && supabase) {
                  supabase.auth.signOut().catch(() => {})
                }
                setCurrentUser(null)
                setIsAuthenticated(false)
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/40 transition cursor-pointer"
              title="Sign Out to Login Screen"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>

      </header>

      {/* Mobile Search Overlay Bar (<md) */}
      {isMobileSearchOpen && (
        <div className="md:hidden bg-[#070c18] border-b border-cyan-500/50 p-2.5 px-3 flex items-center justify-between gap-2 z-30 shadow-lg animate-in slide-in-from-top-2 duration-150 shrink-0">
          <div className="flex-1">
            <GlobalSearchCommand 
              onNavigate={(v) => {
                setActiveView(v)
                setIsMobileSearchOpen(false)
              }} 
              onSelectNode={(nodeId) => {
                if (selectNode) selectNode(nodeId)
                setIsMobileSearchOpen(false)
              }} 
            />
          </div>
          <button
            type="button"
            onClick={() => setIsMobileSearchOpen(false)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-xs font-mono shrink-0 cursor-pointer"
          >
            Close
          </button>
        </div>
      )}

      {/* ============================================================ */}
      {/* MAIN WORKSPACE FRAME (Left Navigation Rail + View Router) */}
      {/* ============================================================ */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Navigation Rail (9 Spec Tabs, Desktop Rail & Mobile Bottom Bar) */}
        <NavigationRail 
          activeView={activeView}
          setActiveView={setActiveView}
          onOpenCopilot={() => setIsCopilotOpen(true)}
        />

        {/* Primary View Workspace */}
        <main className="flex-1 flex flex-col overflow-hidden relative pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] md:pb-0">
          {activeView === 'dashboard' && (
            <IntelCoreDashboardView onNavigate={setActiveView} />
          )}

          {activeView === 'network' && (
            <TacticalKnowledgeGraphView onNavigate={setActiveView} />
          )}

          {activeView === 'camera' && (
            <CCTVTrackingHubView onNavigate={setActiveView} />
          )}

          {activeView === 'cases' && (
            <CaseFilesHubView onNavigate={setActiveView} />
          )}

          {activeView === 'suspects' && (
            <CriminalEntityDossierView onNavigate={setActiveView} />
          )}

          {activeView === 'analytics' && (
            <CrimeAnalyticsIntelView onNavigate={setActiveView} />
          )}

          {activeView === 'evidence' && (
            <ForensicEvidenceAuditView onNavigate={setActiveView} />
          )}

          {activeView === 'digital_twin' && (
            <UrbanDigitalTwin3DView onNavigate={setActiveView} />
          )}

          {activeView === 'api_engine' && (
            <APIEngineView onNavigate={setActiveView} />
          )}

          {activeView === 'settings' && (
            <ManagementPlatformView onNavigate={setActiveView} />
          )}
        </main>

      </div>

      {/* ============================================================ */}
      {/* CONTROLLED SPECIALIZED MODALS (Intact Capabilities) */}
      {/* ============================================================ */}
      {isCopilotOpen && (
        <AICopilotModal
          isOpen={isCopilotOpen}
          onClose={() => setIsCopilotOpen(false)}
        />
      )}

      {isExplainerOpen && (
        <GNNExplainerModal
          isOpen={isExplainerOpen}
          onClose={() => setIsExplainerOpen(false)}
          selectedLinkId="PRED-LINK-01"
        />
      )}

      {isJourneyOpen && (
        <VehicleJourneyModal
          isOpen={isJourneyOpen}
          onClose={() => setIsJourneyOpen(false)}
        />
      )}

      {isPredictionsOpen && (
        <PredictionAnalyticsModal
          isOpen={isPredictionsOpen}
          onClose={() => setIsPredictionsOpen(false)}
        />
      )}

      {/* Supabase Login & Registration Modal */}
      {isAuthModalOpen && (
        <AuthView
          asModal={true}
          onClose={() => setIsAuthModalOpen(false)}
          onAuthenticated={(user) => {
            setCurrentUser(user)
            setIsAuthenticated(true)
            setIsAuthModalOpen(false)
          }}
        />
      )}

    </div>
  )
}

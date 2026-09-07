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

const VehicleJourneyModal = dynamic(() => import('@/components/VehicleJourneyModal'), { ssr: false })
const PredictionAnalyticsModal = dynamic(() => import('@/components/PredictionAnalyticsModal'), { ssr: false })
const AICopilotModal = dynamic(() => import('@/components/AICopilotModal'), { ssr: false })
const GNNExplainerModal = dynamic(() => import('@/components/GNNExplainerModal'), { ssr: false })
const AuthView = dynamic(() => import('@/components/AuthView'), { ssr: false })
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
  UserCheck
} from 'lucide-react'

export default function Home() {
  const [activeView, setActiveView] = useState<string>('dashboard')
  const [isJourneyOpen, setIsJourneyOpen] = useState(false)
  const [isPredictionsOpen, setIsPredictionsOpen] = useState(false)
  const [isCopilotOpen, setIsCopilotOpen] = useState(false)
  const [isExplainerOpen, setIsExplainerOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

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
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    const q = searchQuery.toLowerCase().trim()

    // Match suspect/entity
    if (q.includes('sayed') || q.includes('kahn') || q.includes('alpha') || q.includes('201')) {
      setActiveView('suspects')
      return
    }

    // Match cases
    if (q.includes('case') || q.includes('hawala') || q.includes('0847') || q.includes('falcon')) {
      setActiveView('cases')
      return
    }

    // Match camera / anpr
    if (q.includes('cam') || q.includes('plate') || q.includes('fortuner') || q.includes('vehicle')) {
      setActiveView('camera')
      return
    }

    // Default search in graph
    const match = nodes.find(n => n.label.toLowerCase().includes(q) || n.id.toLowerCase().includes(q))
    if (match) {
      selectNode(match.id)
      setActiveView('network')
    } else {
      setActiveView('network')
    }
  }

  // Titles mapping matching the 9 specification screens
  const viewTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'INTEL-CORE DASHBOARD',
      subtitle: 'SURVEILLANCE OVERVIEW & THREAT TELEMETRY'
    },
    network: {
      title: 'TACTICAL KNOWLEDGE GRAPH',
      subtitle: 'FORCE DIRECTED NETWORK MODELING & NEURAL RELATION PREDICTIONS'
    },
    camera: {
      title: 'CCTV LIVE TRACKING HUB',
      subtitle: 'LIVE ANPR DEPLOYMENT & METROPOLITAN CORRELATION GRID'
    },
    cases: {
      title: 'CASE FILES HUB & DOSSIER RETRIEVAL',
      subtitle: 'ACTIVE CRIMINAL ENTERPRISE RECORDS & COURT READINESS ASSESSMENT'
    },
    suspects: {
      title: 'CRIMINAL ENTITY DOSSIER',
      subtitle: 'TACTICAL INTEL REPORT & INTERCONNECTION PROFILE'
    },
    analytics: {
      title: 'CRIME ANALYTICS & PREDICTIVE INTEL',
      subtitle: 'TELEMETRY ANALYSIS, THREAT TRENDING & GRAPH LINK FORECASTING'
    },
    evidence: {
      title: 'FORENSIC EVIDENCE & AUDIT TRAIL',
      subtitle: 'COURT ADMISSIBLE INTEGRITY TIMELINE & BLOCKCHAIN ANCHOR COMPLIANCE'
    },
    digital_twin: {
      title: '3D URBAN DIGITAL TWIN',
      subtitle: 'METROPOLITAN CORRELATION GRID & REAL TIME SENSOR SPATIAL MAPPING'
    },
    settings: {
      title: 'CRIMEGRAPH AI MANAGEMENT PLATFORM',
      subtitle: 'SYSTEM CONFIGURATION, DATA PIPELINES & MODEL COMPLIANCE'
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
      <header className="h-16 bg-[#050814] border-b border-cyan-900/40 px-5 flex items-center justify-between z-40 shrink-0 select-none shadow-[0_4px_25px_rgba(0,0,0,0.8)]">
        
        {/* Left: CG_AI Emblem & View Title / Subtitle */}
        <div className="flex items-center gap-3 shrink-0">
          <CrimeGraphLogo 
            size="sm" 
            variant="emblem" 
            interactive={true} 
            badgeType="emblem"
            onClick={() => setActiveView('dashboard')}
            title="CrimeGraph AI Tactical Center"
          />

          <div className="flex flex-col justify-center min-w-0">
            <h1 className="text-sm sm:text-base font-bold tracking-wider text-white uppercase leading-tight truncate max-w-[170px] sm:max-w-[320px] md:max-w-none">
              {currentTitle.title}
            </h1>
            <span className="hidden sm:block text-xs font-mono text-cyan-400 tracking-wider uppercase mt-0.5 truncate">
              {currentTitle.subtitle}
            </span>
          </div>
        </div>

        {/* Center: Global Entity Search Bar */}
        <form 
          onSubmit={handleSearchSubmit}
          className="hidden md:flex items-center w-full max-w-md mx-6"
        >
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Query entity [UID, codename, plate, phone]..."
              className="w-full h-10 bg-[#020509]/90 border border-cyan-900/50 focus:border-cyan-400 rounded-lg px-4 pl-10 text-sm font-sans text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition shadow-inner"
            />
            <Search className="w-4 h-4 text-cyan-500/70 absolute left-3.5 top-3" />
          </div>
        </form>

        {/* Right: Operation Badge, Notification Pill & User Clearance Card */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Operation Classification Pill */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-bold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse-dot shadow-[0_0_8px_#00e5ff]" />
            <span>OP: RED CORRIDOR</span>
          </div>

          {/* Red Alert Notification Pill (9+) */}
          <div 
            onClick={() => setActiveView('dashboard')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/90 border border-red-500/60 text-red-300 text-xs font-bold cursor-pointer shadow-[0_0_10px_rgba(239,68,68,0.35)] hover:scale-105 transition"
            title="9+ Critical Intel Telemetry Alerts"
          >
            <Bell className="w-3.5 h-3.5 text-red-400 animate-bounce" />
            <span>9+ ALERTS</span>
          </div>

          {/* Quick AI Copilot Trigger */}
          <button
            onClick={() => setIsCopilotOpen(true)}
            className="px-3.5 py-1.5 bg-indigo-950/90 hover:bg-indigo-900 border border-indigo-500/50 rounded-lg text-indigo-200 text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-[0_0_14px_rgba(129,140,248,0.35)] cyber-btn-glow hover:scale-105"
            title="Launch AI Investigation Copilot"
          >
            <Bot className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span className="hidden sm:inline font-sans">AI COPILOT</span>
          </button>

          {/* User Profile / Supabase Auth Badge */}
          <div className="flex items-center gap-2.5 pl-2.5 border-l border-cyan-900/40">
            <div 
              onClick={() => setIsAuthModalOpen(true)}
              className="hidden lg:flex flex-col text-right cursor-pointer hover:opacity-80 transition"
              title="Click to view security clearance"
            >
              <span className="text-xs font-bold text-white leading-tight">
                {currentUser?.username || 'ANALYST_KAHN'}
              </span>
              <span className="text-[11px] font-mono text-cyan-400 font-medium tracking-wider">
                {currentUser?.badge_id || 'SEC_LEVEL_4'}
              </span>
            </div>

            <div 
              onClick={() => setIsAuthModalOpen(true)}
              className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-400 flex items-center justify-center text-cyan-200 font-black text-xs shadow-[0_0_10px_#00e5ff] cursor-pointer hover:scale-110 transition shrink-0 animate-breathe-glow"
              title="Open Supabase Account & Registration Modal"
            >
              {currentUser?.username ? currentUser.username[0].toUpperCase() : 'K'}
            </div>

            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="hidden sm:inline-flex px-3 py-1 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 hover:border-cyan-400 rounded-lg text-xs font-mono text-cyan-300 font-bold transition cursor-pointer cyber-btn-glow"
              title="Sign In / Register with Supabase"
            >
              AUTH
            </button>

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
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/40 transition cursor-pointer ml-0.5"
              title="Sign Out to Login Screen"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>

      </header>

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
        <main className="flex-1 flex flex-col overflow-hidden relative pb-14 md:pb-0">
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

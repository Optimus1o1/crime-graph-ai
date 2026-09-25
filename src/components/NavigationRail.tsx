'use client'

import React from 'react'
import { 
  LayoutDashboard, 
  Network, 
  Video, 
  FolderLock, 
  Users, 
  BarChart3, 
  FileCheck2, 
  Layers, 
  Settings,
  ShieldAlert,
  Bot,
  Terminal
} from 'lucide-react'
import CrimeGraphLogo from './CrimeGraphLogo'

interface NavigationRailProps {
  activeView: string
  setActiveView: (view: string) => void
  onOpenCopilot?: () => void
}

export default function NavigationRail({ activeView, setActiveView, onOpenCopilot }: NavigationRailProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', tooltip: 'Intel-Core Surveillance Overview', icon: LayoutDashboard },
    { id: 'network', label: 'Network', tooltip: 'Tactical Knowledge Graph', icon: Network },
    { id: 'camera', label: 'Camera', tooltip: 'CCTV Live Tracking Hub', icon: Video },
    { id: 'cases', label: 'Cases', tooltip: 'Case Files Hub & Dossier Retrieval', icon: FolderLock },
    { id: 'suspects', label: 'Suspects', tooltip: 'Criminal Entity Dossier', icon: Users },
    { id: 'analytics', label: 'Analytics', tooltip: 'Crime Analytics & Predictive Intel', icon: BarChart3 },
    { id: 'evidence', label: 'Evidence', tooltip: 'Forensic Evidence & Audit Trail', icon: FileCheck2 },
    { id: 'digital_twin', label: 'Digital Twin', tooltip: '3D Urban Digital Twin', icon: Layers },
    { id: 'api_engine', label: 'API Engine', tooltip: 'API Engine & ReDoc Documentation', icon: Terminal },
    { id: 'settings', label: 'System', tooltip: 'Management Platform & Settings', icon: Settings },
  ]

  return (
    <>
      {/* Desktop & Tablet Left Navigation Rail (>=md) */}
      <aside className="hidden md:flex w-20 bg-[#060913] border-r border-cyan-900/40 flex-col items-center py-4 justify-between z-30 shrink-0 select-none shadow-[4px_0_20px_rgba(0,0,0,0.5)]">
        
        {/* Top Brand Hexagon Emblem */}
        <div className="flex flex-col items-center gap-4 w-full px-2">
          <CrimeGraphLogo 
            size="sm" 
            variant="emblem" 
            interactive={true} 
            badgeType="emblem"
            onClick={() => setActiveView('dashboard')}
            title="CrimeGraph AI Tactical Center"
          />

          {/* 9 Tactical Nav Buttons */}
          <nav className="flex flex-col gap-2 w-full items-center">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeView === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`relative group w-14 h-14 rounded-xl flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-cyan-950/90 text-cyan-300 border border-cyan-400 shadow-[0_0_18px_rgba(0,229,255,0.4)]'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 border border-transparent hover:scale-105'
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-cyan-300' : 'text-slate-400 group-hover:text-cyan-400'}`} />
                  <span className={`text-[11px] font-sans mt-1 tracking-tight leading-none ${isActive ? 'font-bold text-cyan-300' : 'text-slate-400 font-medium group-hover:text-slate-200'}`}>
                    {item.label}
                  </span>

                  {/* Left Active Glow Notch */}
                  {isActive && (
                    <div className="absolute -left-2 w-1.5 h-7 bg-cyan-400 rounded-r shadow-[0_0_10px_#00e5ff] animate-pulse-dot" />
                  )}

                  {/* Tooltip */}
                  <span className="absolute left-20 bg-[#0a101d] text-xs font-sans font-medium px-3 py-2 rounded-lg border border-cyan-500/40 text-slate-100 opacity-0 pointer-events-none group-hover:opacity-100 transition duration-200 whitespace-nowrap z-50 shadow-2xl backdrop-blur-md">
                    {item.tooltip}
                  </span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Bottom Live Heartbeat Indicator */}
        <div className="flex flex-col items-center gap-2.5 pt-3 border-t border-cyan-900/30 w-full px-2">
          {onOpenCopilot && (
            <button
              onClick={onOpenCopilot}
              className="w-12 h-12 rounded-xl bg-indigo-950/80 border border-indigo-500/50 flex items-center justify-center text-indigo-300 hover:bg-indigo-900 transition-all cursor-pointer shadow-[0_0_14px_rgba(129,140,248,0.35)] hover:scale-105 mb-1"
              title="Open AI Investigation Copilot"
            >
              <Bot className="w-5 h-5 text-indigo-300 animate-pulse" />
            </button>
          )}

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-xs font-mono text-emerald-400 font-bold shadow-[0_0_10px_rgba(16,185,129,0.3)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-dot" />
            <span>LIVE</span>
          </div>
        </div>

      </aside>

      {/* Mobile Bottom Navigation Bar (<md screens) with Safe-Area & Auto-Centering */}
      <nav 
        aria-label="Mobile Navigation"
        className="flex md:hidden fixed bottom-0 left-0 right-0 h-[calc(4rem+env(safe-area-inset-bottom,0px))] pb-[env(safe-area-inset-bottom,0px)] bg-[#050814]/95 backdrop-blur-xl border-t border-cyan-900/60 items-center justify-between px-2.5 z-50 shadow-[0_-8px_30px_rgba(0,0,0,0.9)] overflow-x-auto no-scrollbar gap-1.5 touch-momentum"
      >
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeView === item.id
          return (
            <button
              key={item.id}
              onClick={(e) => {
                setActiveView(item.id)
                e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
              }}
              className={`shrink-0 min-w-[58px] min-h-[44px] flex flex-col items-center justify-center px-2 py-1 rounded-xl transition-all duration-200 cursor-pointer active:scale-95 ${
                isActive 
                  ? 'bg-cyan-950/90 text-cyan-300 border border-cyan-400 shadow-[0_0_12px_rgba(0,229,255,0.4)] font-bold' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
              }`}
              title={item.tooltip}
            >
              <Icon className={`w-4 h-4 transition-transform ${isActive ? 'text-cyan-300 scale-110' : 'text-slate-400'}`} />
              <span className={`text-[10px] font-sans mt-0.5 whitespace-nowrap tracking-tight ${isActive ? 'font-bold text-cyan-300' : 'text-slate-400'}`}>
                {item.label}
              </span>
            </button>
          )
        })}

        {onOpenCopilot && (
          <button
            onClick={onOpenCopilot}
            className="shrink-0 min-w-[58px] min-h-[44px] flex flex-col items-center justify-center px-2 py-1 rounded-xl bg-indigo-950/90 border border-indigo-500/60 text-indigo-300 shadow-[0_0_10px_rgba(129,140,248,0.3)] cursor-pointer active:scale-95 ml-0.5"
            title="AI Copilot"
          >
            <Bot className="w-4 h-4 text-indigo-300 animate-pulse" />
            <span className="text-[10px] font-sans mt-0.5 font-bold">Copilot</span>
          </button>
        )}
      </nav>
    </>
  )
}


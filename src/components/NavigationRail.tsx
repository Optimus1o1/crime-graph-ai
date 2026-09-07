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
  Bot
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
    { id: 'settings', label: 'System', tooltip: 'Management Platform & Settings', icon: Settings },
  ]

  return (
    <>
      {/* Desktop & Tablet Left Navigation Rail (>=md) */}
      <aside className="hidden md:flex w-16 bg-[#060912] border-r border-cyan-900/40 flex-col items-center py-3 justify-between z-30 shrink-0 select-none">
        
        {/* Top Brand Hexagon Emblem */}
        <div className="flex flex-col items-center gap-4">
          <CrimeGraphLogo 
            size="sm" 
            variant="emblem" 
            interactive={true} 
            badgeType="emblem"
            onClick={() => setActiveView('dashboard')}
            title="CrimeGraph AI Tactical Center"
          />

          {/* 9 Tactical Nav Buttons */}
          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeView === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`relative group w-11 h-11 rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-400 shadow-[0_0_18px_rgba(0,229,255,0.4)]'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40 border border-transparent hover:scale-105'
                  }`}
                >
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-cyan-300' : 'text-slate-400 group-hover:text-cyan-400'}`} />
                  <span className={`text-[8px] font-mono mt-0.5 tracking-tight ${isActive ? 'font-bold text-cyan-300' : 'text-slate-500'}`}>
                    {item.label}
                  </span>

                  {/* Left Active Glow Notch */}
                  {isActive && (
                    <div className="absolute -left-[1px] w-1 h-5 bg-cyan-400 rounded-r shadow-[0_0_10px_#00e5ff] animate-pulse-dot" />
                  )}

                  {/* Tooltip */}
                  <span className="absolute left-16 bg-[#0a101d] text-xs px-2.5 py-1.5 rounded border border-cyan-500/50 text-slate-200 opacity-0 pointer-events-none group-hover:opacity-100 transition duration-200 whitespace-nowrap z-50 shadow-2xl font-mono">
                    {item.tooltip}
                  </span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Bottom Live Heartbeat Indicator (Exact from Screenshot) */}
        <div className="flex flex-col items-center gap-2 pt-2 border-t border-cyan-900/30 w-full">
          {onOpenCopilot && (
            <button
              onClick={onOpenCopilot}
              className="w-10 h-10 rounded-lg bg-indigo-950/70 border border-indigo-500/50 flex items-center justify-center text-indigo-300 hover:bg-indigo-900/80 transition cursor-pointer shadow-[0_0_12px_rgba(129,140,248,0.35)] hover:scale-105 mb-1"
              title="Open AI Investigation Copilot"
            >
              <Bot className="w-4 h-4 text-indigo-300" />
            </button>
          )}

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/50 text-[9px] font-mono text-emerald-400 font-bold shadow-[0_0_8px_rgba(16,185,129,0.3)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
            <span>LIVE</span>
          </div>
        </div>

      </aside>

      {/* Mobile Bottom Navigation Bar (<md screens) */}
      <div className="flex md:hidden fixed bottom-0 left-0 right-0 h-14 bg-[#050814]/95 backdrop-blur-md border-t border-cyan-900/60 items-center justify-between px-2 z-50 shadow-[0_-4px_25px_rgba(0,0,0,0.9)] overflow-x-auto gap-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeView === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`shrink-0 flex flex-col items-center justify-center px-2 py-1 rounded-md transition-all ${
                isActive 
                  ? 'bg-cyan-950/90 text-cyan-300 border border-cyan-400/80 shadow-[0_0_10px_rgba(0,229,255,0.3)] font-bold' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-300' : 'text-slate-400'}`} />
              <span className="text-[9px] font-mono tracking-tighter mt-0.5 whitespace-nowrap">
                {item.label}
              </span>
            </button>
          )
        })}

        {onOpenCopilot && (
          <button
            onClick={onOpenCopilot}
            className="shrink-0 flex flex-col items-center justify-center px-2 py-1 rounded-md bg-indigo-950/80 border border-indigo-500/50 text-indigo-300"
            title="AI Copilot"
          >
            <Bot className="w-3.5 h-3.5 text-indigo-300" />
            <span className="text-[9px] font-mono tracking-tighter mt-0.5">Copilot</span>
          </button>
        )}
      </div>
    </>
  )
}


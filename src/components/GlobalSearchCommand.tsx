'use client'

import React, { useState, useEffect, useRef } from 'react'
import { 
  Search, 
  X, 
  User, 
  FolderLock, 
  Video, 
  Network, 
  Terminal, 
  ShieldAlert, 
  Layers, 
  FileCheck2, 
  BarChart3, 
  CornerDownLeft, 
  Sparkles 
} from 'lucide-react'
import { useStore } from '@/store'

interface GlobalSearchCommandProps {
  onNavigate: (viewId: string) => void
  onSelectNode?: (nodeId: string) => void
}

interface SearchItem {
  id: string
  title: string
  subtitle: string
  category: 'suspect' | 'case' | 'camera' | 'view'
  actionView: string
  nodeId?: string
  badge: string
  badgeColor?: string
}

export default function GlobalSearchCommand({ onNavigate, onSelectNode }: GlobalSearchCommandProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isMac, setIsMac] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { nodes } = useStore()

  // Detect OS for shortcut hint
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0)
    }
  }, [])

  // Global hotkey: Ctrl+K / Cmd+K or "/"
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
        setIsOpen(true)
      } else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault()
        inputRef.current?.focus()
        setIsOpen(true)
      } else if (e.key === 'Escape') {
        setIsOpen(false)
        inputRef.current?.blur()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Static knowledge index
  const baseItems: SearchItem[] = [
    // Views
    { id: 'view-dashboard', title: 'Intel Core Dashboard', subtitle: 'Threat telemetry & surveillance overview', category: 'view', actionView: 'dashboard', badge: 'VIEW' },
    { id: 'view-network', title: 'Tactical Knowledge Graph', subtitle: 'Force-directed network analysis & links', category: 'view', actionView: 'network', badge: 'VIEW' },
    { id: 'view-camera', title: 'CCTV Live Tracking Hub', subtitle: 'ANPR camera matrix & optical plates', category: 'view', actionView: 'camera', badge: 'VIEW' },
    { id: 'view-cases', title: 'Case Files & Dossiers', subtitle: 'Syndicate investigation records', category: 'view', actionView: 'cases', badge: 'VIEW' },
    { id: 'view-suspects', title: 'Criminal Entity Dossier', subtitle: 'Suspect behavioral profile & relations', category: 'view', actionView: 'suspects', badge: 'VIEW' },
    { id: 'view-analytics', title: 'Crime Analytics & GNN', subtitle: 'Graph neural network predictions', category: 'view', actionView: 'analytics', badge: 'VIEW' },
    { id: 'view-evidence', title: 'Forensic Audit Trail', subtitle: 'Cryptographic chain of custody log', category: 'view', actionView: 'evidence', badge: 'VIEW' },
    { id: 'view-twin', title: '3D Urban Digital Twin', subtitle: 'City spatial correlation & sensors', category: 'view', actionView: 'digital_twin', badge: 'VIEW' },
    { id: 'view-api', title: 'API Engine & ReDoc', subtitle: 'REST runtime gateway & OpenAPI 3.1.0', category: 'view', actionView: 'api_engine', badge: 'VIEW' },
    { id: 'view-settings', title: 'System Management', subtitle: 'Platform configuration & pipelines', category: 'view', actionView: 'settings', badge: 'VIEW' },

    // Known Cases
    { id: 'case-0847', title: 'CASE-2026-0847: Hawala Falcon Syndicate', subtitle: 'Active money laundering corridor (₹14.2M)', category: 'case', actionView: 'cases', badge: 'CASE', badgeColor: 'text-amber-400 border-amber-500/50 bg-amber-950/60' },
    { id: 'case-0912', title: 'CASE-2026-0912: Red Corridor Cross-Border Ring', subtitle: 'Arms trafficking & encrypted burner cellular grid', category: 'case', actionView: 'cases', badge: 'CASE', badgeColor: 'text-red-400 border-red-500/50 bg-red-950/60' },
    { id: 'case-0419', title: 'CASE-2026-0419: Digital Phishing & SIM Swap', subtitle: 'Targeted high-net-worth cyber extortion', category: 'case', actionView: 'cases', badge: 'CASE', badgeColor: 'text-indigo-400 border-indigo-500/50 bg-indigo-950/60' },

    // Vehicles / ANPR
    { id: 'veh-1234', title: 'DL 4C AB 1234 — White Toyota Fortuner', subtitle: 'Target ANPR match 98.1% · Chandni Chowk Gate 2', category: 'camera', actionView: 'camera', badge: 'ANPR', badgeColor: 'text-cyan-300 border-cyan-500/50 bg-cyan-950/60' },
    { id: 'veh-9988', title: 'MH 12 PQ 9988 — Dark Gray Scorpio', subtitle: 'Target ANPR match 94.3% · Industrial Sector C', category: 'camera', actionView: 'camera', badge: 'ANPR', badgeColor: 'text-cyan-300 border-cyan-500/50 bg-cyan-950/60' },
    { id: 'cam-001', title: 'CAM NE-001 — North-East Highway Toll', subtitle: 'Optical 4K PTZ sensor with YOLOv9 plate detection', category: 'camera', actionView: 'camera', badge: 'CAM', badgeColor: 'text-emerald-400 border-emerald-500/50 bg-emerald-950/60' },
  ]

  // Add graph nodes dynamically
  const nodeItems: SearchItem[] = (nodes || []).slice(0, 30).map(n => ({
    id: `node-${n.id}`,
    title: `${n.label} (${n.id})`,
    subtitle: `${n.comm || 'Syndicate Member'} · Degree ${n.degree || 0} · Risk: ${n.risk || 'MODERATE'}`,
    category: 'suspect',
    actionView: 'network',
    nodeId: n.id,
    badge: n.risk === 'HIGH' ? 'HIGH RISK' : 'ENTITY',
    badgeColor: n.risk === 'HIGH' ? 'text-red-400 border-red-500/50 bg-red-950/60' : 'text-cyan-300 border-cyan-500/40 bg-cyan-950/60'
  }))

  const allItems = [...nodeItems, ...baseItems]

  // Filter items based on query
  const filteredItems = query.trim() === ''
    ? baseItems.slice(0, 7)
    : allItems.filter(item => {
        const q = query.toLowerCase()
        return (
          item.title.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q) ||
          item.badge.toLowerCase().includes(q)
        )
      }).slice(0, 10)

  const handleSelectItem = (item: SearchItem) => {
    if (item.nodeId && onSelectNode) {
      onSelectNode(item.nodeId)
    }
    onNavigate(item.actionView)
    setIsOpen(false)
    setQuery('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredItems.length))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filteredItems[selectedIndex]) {
        handleSelectItem(filteredItems[selectedIndex])
      }
    }
  }

  const getCategoryIcon = (category: SearchItem['category']) => {
    switch (category) {
      case 'suspect':
        return <User className="w-4 h-4 text-cyan-400" />
      case 'case':
        return <FolderLock className="w-4 h-4 text-amber-400" />
      case 'camera':
        return <Video className="w-4 h-4 text-emerald-400" />
      case 'view':
      default:
        return <Network className="w-4 h-4 text-indigo-400" />
    }
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-xs sm:max-w-sm md:max-w-md">
      
      {/* Search Input Box */}
      <div className={`relative flex items-center h-10 w-full rounded-xl bg-[#03060e] border transition-all shadow-inner ${
        isOpen
          ? 'border-cyan-400 ring-1 ring-cyan-400/40 shadow-[0_0_15px_rgba(0,229,255,0.2)]'
          : 'border-cyan-900/50 hover:border-cyan-700/60'
      }`}>
        <Search className={`w-4 h-4 ml-3.5 shrink-0 transition-colors ${isOpen ? 'text-cyan-300' : 'text-slate-400'}`} />
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setSelectedIndex(0)
            if (!isOpen) setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search entities, cases, plates..."
          className="w-full h-full bg-transparent px-3 text-xs sm:text-sm font-sans text-slate-100 placeholder-slate-500 focus:outline-none"
        />

        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              inputRef.current?.focus()
            }}
            className="p-1 mr-2 text-slate-400 hover:text-white transition rounded-md hover:bg-slate-800"
            title="Clear search query"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <div className="hidden sm:flex items-center gap-0.5 mr-3 px-1.5 py-0.5 rounded bg-slate-900/90 border border-slate-700/70 text-[10px] font-mono text-slate-400 select-none">
            <span>{isMac ? '⌘' : 'Ctrl'}</span>
            <span>K</span>
          </div>
        )}
      </div>

      {/* Interactive Dropdown Popover */}
      {isOpen && (
        <div className="absolute left-0 right-0 sm:-left-6 sm:-right-6 top-full mt-2 bg-[#050813]/95 backdrop-blur-xl border border-cyan-500/40 rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.85)] z-50 overflow-hidden divide-y divide-slate-800/40 animate-in fade-in-0 zoom-in-95 duration-100">
          
          {/* Header Tag */}
          <div className="px-3.5 py-2 bg-[#03050c] flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-cyan-900/30">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              {query.trim() ? `SEARCH RESULTS FOR "${query}"` : 'QUICK INTELLIGENCE COMMANDS'}
            </span>
            <span className="text-[10px] text-slate-500 hidden sm:inline">Use ↑↓ to navigate, Enter to select</span>
          </div>

          {/* Results List */}
          <div className="max-h-72 sm:max-h-80 overflow-y-auto p-1.5 space-y-1">
            {filteredItems.length > 0 ? (
              filteredItems.map((item, idx) => {
                const isSelected = idx === selectedIndex
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectItem(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`px-3 py-2 rounded-lg cursor-pointer transition flex items-center justify-between gap-3 border ${
                      isSelected
                        ? 'bg-cyan-950/70 border-cyan-400/70 text-white shadow-[0_0_12px_rgba(0,229,255,0.2)]'
                        : 'border-transparent hover:bg-slate-900/60 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-slate-900/90 border border-slate-700/60 flex items-center justify-center shrink-0">
                        {getCategoryIcon(item.category)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold font-sans text-slate-100 truncate">
                          {item.title}
                        </div>
                        <div className="text-[11px] font-sans text-slate-400 truncate">
                          {item.subtitle}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
                        item.badgeColor || 'text-slate-400 border-slate-700 bg-slate-900'
                      }`}>
                        {item.badge}
                      </span>
                      {isSelected && (
                        <CornerDownLeft className="w-3.5 h-3.5 text-cyan-400 hidden sm:block" />
                      )}
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="p-6 text-center space-y-1.5 font-sans">
                <div className="text-xs font-bold text-slate-300">No matching intelligence records found</div>
                <div className="text-[11px] text-slate-500">
                  Try searching for suspect name, plate number (e.g. DL 4C), or case ID (e.g. 0847).
                </div>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="px-3.5 py-1.5 bg-[#020409] flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>ESC to close</span>
            <span className="text-cyan-400/80">CrimeGraph Global Intelligence Grid</span>
          </div>

        </div>
      )}

    </div>
  )
}

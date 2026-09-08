/**
 * CrimeGraph AI — Zustand Global Store.
 * Manages: selected node, active overlays, path results, audit entries,
 * graph data, and AI prediction state.
 */
import { create } from 'zustand'
import axios from 'axios'

export interface GraphNode {
  id: string
  label: string
  type: string
  comm: string
  risk: string
  degree: number
  betweenness: number
  betweenness_rank: number
  x?: number
  y?: number
  properties?: Record<string, any>
}

export interface GraphEdge {
  id: string
  source: string
  target: string
  kind: string
  label: string
  date?: string
  rec: string
  weight?: number
  properties?: Record<string, any>
}

export interface PathHop {
  from_node: string
  to_node: string
  edge_id: string
  kind: string
  label: string
  rec: string
  narrative: string
}

export interface ExplainData {
  role: string
  confidence: string
  why: string
  supporting_records: string[]
  action: string
}

export interface AuditEntry {
  timestamp: string
  action: string
  hash: string
  user: string
}

export interface SuggestedLink {
  a?: string
  b?: string
  source?: string
  target?: string
  source_label?: string
  target_label?: string
  score?: number
  probability?: number
  common_neighbors?: string[]
  evidence?: string
  [key: string]: any
}

export interface AnomalyFlag {
  node: string
  type: string
  score: number
  reason?: string
}

interface AppState {
  // Graph data
  nodes: GraphNode[]
  edges: GraphEdge[]
  stats: Record<string, any>
  loaded: boolean

  // Selection / focus
  selectedNodeId: string | null
  selectedNodeData: GraphNode | null

  // Overlays
  aiOverlay: boolean
  anomalyOverlay: boolean
  mastermindMode: boolean

  // Path results
  pathResult: { shortest: PathHop[]; corroborating: PathHop[] | null; distinct: boolean } | null

  // AI predictions
  suggestedLinks: SuggestedLink[]
  anomalyFlags: AnomalyFlag[]

  // Audit
  auditEntries: AuditEntry[]
  lastHash: string

  // Right panel view
  panelView: 'overview' | 'node' | 'path' | 'ai' | 'anomaly' | 'mastermind' | 'unknown'
  explainData: ExplainData | null

  // Centrality data for mastermind
  centralityData: any[]

  // Role
  role: string

  // Actions
  loadGraph: () => Promise<void>
  selectNode: (nodeId: string | null) => void
  toggleAI: () => void
  toggleAnomaly: () => void
  findMastermind: () => void
  resetView: () => void
  tracePath: (from: string, to: string) => Promise<void>
  submitQuery: (text: string) => Promise<void>
  setRole: (role: string) => void
  addAudit: (action: string) => void
  setPanelView: (view: AppState['panelView']) => void
  fetchExplain: (nodeId: string) => Promise<void>
}

function djb2(s: string): string {
  let x = 5381
  for (const c of s) {
    x = ((x << 5) + x + c.charCodeAt(0)) >>> 0
  }
  return x.toString(16).padStart(8, '0')
}

import graphData from '@/data/graphData.json'

const API = '/api' // Next.js App Router API routes

export const useStore = create<AppState>((set, get) => ({
  nodes: (graphData.nodes || []) as GraphNode[],
  edges: (graphData.edges || []) as GraphEdge[],
  stats: graphData.stats || { total_nodes: 367, total_edges: 1201, communities: 6 },
  loaded: true,
  selectedNodeId: null,
  selectedNodeData: null,
  aiOverlay: false,
  anomalyOverlay: false,
  mastermindMode: false,
  pathResult: null,
  suggestedLinks: (graphData.predict_links || []) as SuggestedLink[],
  anomalyFlags: (graphData.anomaly_flags || []) as AnomalyFlag[],
  auditEntries: [],
  lastHash: '00000000',
  panelView: 'overview',
  explainData: null,
  centralityData: graphData.centrality || [],
  role: 'Investigator',

  loadGraph: async () => {
    try {
      const res = await axios.get(`${API}/graph`)
      const { nodes, edges, stats } = res.data
      set({ nodes, edges, stats, loaded: true })
      get().addAudit('session start · role Investigator')
    } catch (err) {
      console.error('Failed to load graph:', err)
    }
  },

  selectNode: (nodeId) => {
    const { nodes } = get()
    const node = nodeId ? nodes.find(n => n.id === nodeId) || null : null
    set({
      selectedNodeId: nodeId,
      selectedNodeData: node,
      panelView: nodeId ? 'node' : 'overview',
      mastermindMode: false,
    })
    if (nodeId) {
      get().addAudit(`inspect ${nodeId}`)
      get().fetchExplain(nodeId)
    }
  },

  toggleAI: () => {
    const { aiOverlay } = get()
    const next = !aiOverlay
    set({ aiOverlay: next, panelView: next ? 'ai' : 'overview' })
    get().addAudit(`ai overlay ${next ? 'on' : 'off'}`)
    if (next && get().suggestedLinks.length === 0) {
      axios.get(`${API}/predict-links`).then(res => set({ suggestedLinks: res.data }))
    }
  },

  toggleAnomaly: () => {
    const { anomalyOverlay } = get()
    const next = !anomalyOverlay
    set({ anomalyOverlay: next, panelView: next ? 'anomaly' : 'overview' })
    get().addAudit(`anomaly layer ${next ? 'on' : 'off'}`)
    if (next && get().anomalyFlags.length === 0) {
      axios.get(`${API}/anomaly-flags`).then(res => set({ anomalyFlags: res.data }))
    }
  },

  findMastermind: () => {
    set({ mastermindMode: true, panelView: 'mastermind' })
    get().addAudit('centrality: mastermind scan')
    axios.get(`${API}/centrality`).then(res => set({ centralityData: res.data }))
  },

  resetView: () => {
    set({
      selectedNodeId: null,
      selectedNodeData: null,
      aiOverlay: false,
      anomalyOverlay: false,
      mastermindMode: false,
      pathResult: null,
      panelView: 'overview',
      explainData: null,
    })
    get().addAudit('view reset')
  },

  tracePath: async (from, to) => {
    try {
      const res = await axios.get(`${API}/path`, { params: { from, to } })
      set({ pathResult: res.data, panelView: 'path' })
      get().addAudit(`trace ${from} → ${to}`)
    } catch (err) {
      console.error('Path trace failed:', err)
    }
  },

  submitQuery: async (text) => {
    get().addAudit(`query: "${text.slice(0, 40)}"`)
    try {
      const res = await axios.post(`${API}/query`, { text })
      const { intent, result } = res.data
      if (intent === 'path' && result) {
        set({ pathResult: result, panelView: 'path' })
      } else if (intent === 'mastermind') {
        set({ centralityData: result, panelView: 'mastermind', mastermindMode: true })
      } else if (intent === 'anomalies') {
        set({ anomalyFlags: result, anomalyOverlay: true, panelView: 'anomaly' })
      } else if (intent === 'hidden_links') {
        set({ suggestedLinks: result, aiOverlay: true, panelView: 'ai' })
      } else if (intent === 'entity_focus') {
        const nodeId = result?.node?.id
        if (nodeId) get().selectNode(nodeId)
      } else {
        set({ panelView: 'unknown' })
      }
    } catch (err) {
      console.error('Query failed:', err)
    }
  },

  setRole: (role) => {
    set({ role })
    get().addAudit(`role → ${role}`)
  },

  addAudit: (action) => {
    const { auditEntries, lastHash } = get()
    const t = new Date().toLocaleTimeString('en-IN', { hour12: false })
    const newHash = djb2(lastHash + action + t)
    const entry: AuditEntry = { timestamp: t, action, hash: newHash, user: get().role }
    set({ auditEntries: [...auditEntries, entry], lastHash: newHash })
  },

  setPanelView: (view) => set({ panelView: view }),

  fetchExplain: async (nodeId) => {
    try {
      const res = await axios.get(`${API}/explain`, { params: { node_id: nodeId } })
      set({ explainData: res.data })
    } catch {
      set({ explainData: null })
    }
  },
}))

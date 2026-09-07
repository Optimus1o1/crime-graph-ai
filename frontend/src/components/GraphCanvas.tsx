'use client'

import React, { useEffect, useRef, useState } from 'react'
import cytoscape from 'cytoscape'
import { useStore } from '../store'
import { 
  Layers, 
  ChevronDown, 
  ChevronUp, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Eye, 
  EyeOff
} from 'lucide-react'

export default function GraphCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  const cyRef = useRef<cytoscape.Core | null>(null)
  const [legendOpen, setLegendOpen] = useState(false)
  const [showAllLabels, setShowAllLabels] = useState(false)
  const [activeLayout, setActiveLayout] = useState<'cose' | 'concentric' | 'circle' | 'breadthfirst'>('cose')

  const {
    nodes, edges, selectedNodeId, selectNode, loaded,
    aiOverlay, anomalyOverlay, mastermindMode, suggestedLinks,
    anomalyFlags, centralityData, pathResult
  } = useStore()

  // Apply layout preset
  const applyLayout = (layoutName: 'cose' | 'concentric' | 'circle' | 'breadthfirst') => {
    const cy = cyRef.current
    if (!cy) return
    setActiveLayout(layoutName)

    let layoutOpts: any = { name: layoutName, animate: true, animationDuration: 600, padding: 60 }
    
    if (layoutName === 'cose') {
      layoutOpts = {
        name: 'cose',
        animate: true,
        animationDuration: 800,
        padding: 60,
        componentSpacing: 140,
        nodeRepulsion: 1500000,
        nodeOverlap: 45,
        idealEdgeLength: 130,
        edgeElasticity: 100,
        nestingFactor: 5,
        gravity: 25,
        numIter: 1000,
      }
    } else if (layoutName === 'concentric') {
      layoutOpts = {
        name: 'concentric',
        animate: true,
        animationDuration: 600,
        padding: 60,
        concentric: (node: any) => {
          if (node.data('type') === 'case') return 10
          if (node.data('id') === 'P001' || node.data('id') === 'P002') return 9
          return node.data('degree') || 1
        },
        levelWidth: () => 2,
      }
    }

    const layout = cy.layout(layoutOpts)
    layout.run()
  }

  // Zoom helpers
  const handleZoomIn = () => {
    const cy = cyRef.current
    if (!cy) return
    cy.zoom({ level: cy.zoom() * 1.3, position: { x: cy.width() / 2, y: cy.height() / 2 } })
  }

  const handleZoomOut = () => {
    const cy = cyRef.current
    if (!cy) return
    cy.zoom({ level: cy.zoom() / 1.3, position: { x: cy.width() / 2, y: cy.height() / 2 } })
  }

  const handleFit = () => {
    const cy = cyRef.current
    if (!cy) return
    cy.animate({ fit: { eles: cy.elements(), padding: 50 } }, { duration: 400 })
  }

  // Toggle label visibility
  const toggleLabelMode = () => {
    const next = !showAllLabels
    setShowAllLabels(next)
    const cy = cyRef.current
    if (!cy) return
    if (next) {
      cy.nodes().addClass('show-all-labels')
    } else {
      cy.nodes().removeClass('show-all-labels')
    }
  }

  // Initialize Cytoscape
  useEffect(() => {
    if (!containerRef.current) return

    const cy = cytoscape({
      container: containerRef.current,
      elements: {
        nodes: nodes.map(n => ({
          data: {
            id: n.id,
            label: n.label,
            type: n.type,
            comm: String(n.comm),
            risk: n.risk || 'low',
            degree: n.degree || 1,
            betweenness: n.betweenness || 0,
          },
        })),
        edges: edges.map(e => ({
          data: {
            id: e.id,
            source: e.source,
            target: e.target,
            kind: e.kind,
            label: e.label,
            rec: e.rec,
          },
        })),
      },
      style: [
        // ---- Default node: Clean Minimal High-End Intelligence ----
        {
          selector: 'node',
          style: {
            'color': '#F1F5F9',
            'font-family': 'Inter, system-ui, sans-serif',
            'font-size': '10px',
            'font-weight': 600,
            'text-valign': 'bottom',
            'text-margin-y': 4,
            'text-background-color': '#07080d',
            'text-background-opacity': 0.85,
            'text-background-padding': '2px',
            'text-background-shape': 'roundrectangle',
            'background-color': '#1E293B',
            'border-width': 1.5,
            'border-color': 'rgba(168, 85, 247, 0.4)',
            'width': 22,
            'height': 22,
            'transition-property': 'background-color, border-color, border-width, width, height, opacity',
            'transition-duration': '0.2s',
          } as any,
        },
        // Smart Labels: Only display text on Persons, Cases, and high-importance nodes by default
        {
          selector: 'node[type="person"], node[type="case"], node.hl, node:selected, node.mastermind, node.show-all-labels',
          style: {
            'label': 'data(label)',
          } as any,
        },
        // On Hover, show label and bring to front
        {
          selector: 'node:hover',
          style: {
            'label': 'data(label)',
            'z-index': 999,
            'border-width': 2.5,
            'border-color': '#00E5FF',
            'underlay-color': '#00E5FF',
            'underlay-padding': '6px',
            'underlay-opacity': 0.3,
          } as any,
        },
        // ---- Person communities ----
        {
          selector: 'node[type="person"][comm="north"], node[type="person"][comm="0"]',
          style: {
            'background-color': '#EAB308',
            'border-color': '#CA8A04',
          } as any,
        },
        {
          selector: 'node[type="person"][comm="south"], node[type="person"][comm="1"]',
          style: {
            'background-color': '#F97316',
            'border-color': '#EA580C',
          } as any,
        },
        {
          selector: 'node[type="person"][comm="finance"], node[type="person"][comm="fin"], node[type="person"][comm="2"]',
          style: {
            'background-color': '#EF4444',
            'border-color': '#DC2626',
          } as any,
        },
        {
          selector: 'node[type="person"][comm="bridge"], node[type="person"][comm="3"]',
          style: {
            'background-color': '#00E5FF',
            'border-color': '#0284C7',
          } as any,
        },
        {
          selector: 'node[type="person"][comm="4"], node[type="person"][comm="5"]',
          style: {
            'background-color': '#A855F7',
            'border-color': '#9333EA',
          } as any,
        },
        // ---- Non-person nodes (Distinctive Tactical Shapes) ----
        {
          selector: 'node[type="phone"]',
          style: {
            'shape': 'round-rectangle',
            'width': 22,
            'height': 16,
            'background-color': '#0284C7',
            'border-color': '#0369A1',
            'border-radius': 4,
          } as any,
        },
        {
          selector: 'node[type="account"]',
          style: {
            'shape': 'diamond',
            'width': 22,
            'height': 22,
            'background-color': '#F59E0B',
            'border-color': '#D97706',
          } as any,
        },
        {
          selector: 'node[type="vehicle"]',
          style: {
            'shape': 'hexagon',
            'width': 24,
            'height': 20,
            'background-color': '#EF4444',
            'border-color': '#B91C1C',
          } as any,
        },
        {
          selector: 'node[type="case"]',
          style: {
            'shape': 'round-rectangle',
            'width': 68,
            'height': 24,
            'background-color': '#0B1320',
            'border-color': '#00E5FF',
            'border-width': 2,
            'border-radius': 6,
            'font-size': '9.5px',
            'font-weight': 700,
            'color': '#00E5FF',
            'text-valign': 'center',
            'text-margin-y': 0,
            'z-index': 10,
          } as any,
        },
        // ---- Edges ----
        {
          selector: 'edge',
          style: {
            'width': 1.2,
            'line-color': 'rgba(100, 116, 139, 0.45)',
            'curve-style': 'bezier',
            'arrow-scale': 0.8,
            'transition-property': 'line-color, width, opacity',
            'transition-duration': '0.2s',
          } as any,
        },
        {
          selector: 'edge[kind="call"]',
          style: {
            'line-color': 'rgba(100, 116, 139, 0.4)',
            'width': 1.2,
          } as any,
        },
        {
          selector: 'edge[kind="transfer"]',
          style: {
            'line-color': '#F59E0B',
            'width': 1.8,
            'target-arrow-shape': 'triangle',
            'target-arrow-color': '#F59E0B',
          } as any,
        },
        {
          selector: 'edge[kind="owns"]',
          style: {
            'line-color': 'rgba(0, 229, 255, 0.4)',
            'width': 1.2,
            'line-style': 'dotted',
          } as any,
        },
        {
          selector: 'edge[kind="cited_in"]',
          style: {
            'line-color': 'rgba(0, 229, 255, 0.6)',
            'width': 1.5,
            'line-style': 'dashed',
            'target-arrow-shape': 'triangle',
            'target-arrow-color': '#00E5FF',
          } as any,
        },
        // ---- Interactive Dynamic States ----
        {
          selector: '.faded',
          style: { 'opacity': 0.12 } as any,
        },
        {
          selector: 'node.hl',
          style: {
            'border-color': '#00E5FF',
            'border-width': 3,
            'color': '#00E5FF',
            'underlay-color': '#00E5FF',
            'underlay-padding': '8px',
            'underlay-opacity': 0.35,
            'z-index': 15,
          } as any,
        },
        {
          selector: 'node.anomOn, edge.anomOn',
          style: {
            'border-color': '#FF3D3D',
            'border-width': 3.5,
            'line-color': '#FF3D3D',
            'width': 3,
            'underlay-color': '#FF3D3D',
            'underlay-padding': '8px',
            'underlay-opacity': 0.35,
            'z-index': 14,
          } as any,
        },
        {
          selector: 'node.mastermind',
          style: {
            'border-color': '#FFB020',
            'border-width': 4,
            'width': 36,
            'height': 36,
            'color': '#FFB020',
            'underlay-color': '#FFB020',
            'underlay-padding': '14px',
            'underlay-opacity': 0.45,
            'z-index': 16,
          } as any,
        },
      ],
      layout: {
        name: 'cose',
        animate: false,
        padding: 60,
        componentSpacing: 140,
        nodeRepulsion: 1500000,
        nodeOverlap: 45,
        idealEdgeLength: 130,
        edgeElasticity: 100,
        nestingFactor: 5,
        gravity: 25,
        numIter: 1000,
      },
      wheelSensitivity: 0.25,
    })

    // Click handlers
    cy.on('tap', 'node', (ev) => {
      const id = ev.target.id()
      selectNode(id)
    })
    cy.on('tap', (ev) => {
      if (ev.target === cy) {
        selectNode(null)
      }
    })

    cyRef.current = cy
    return () => { cy.destroy() }
  }, [loaded, nodes.length, edges.length])

  // Handle selection highlight
  useEffect(() => {
    const cy = cyRef.current
    if (!cy) return
    cy.elements().removeClass('faded hl mastermind anomOn showrisk')

    if (selectedNodeId) {
      const el = cy.getElementById(selectedNodeId)
      if (el.length) {
        cy.elements().addClass('faded')
        el.closedNeighborhood().removeClass('faded')
        el.addClass('hl')
        cy.animate({ center: { eles: el }, zoom: 1.4 } as any, { duration: 350 })
      }
    }
  }, [selectedNodeId])

  // Handle AI overlay
  useEffect(() => {
    const cy = cyRef.current
    if (!cy) return

    cy.edges('.suggested-runtime').remove()

    if (aiOverlay && suggestedLinks.length > 0) {
      suggestedLinks.forEach((link: any, idx: number) => {
        const src = link.a || link.source_id || link.source
        const tgt = link.b || link.target_id || link.target
        if (src && tgt && cy.getElementById(src).length > 0 && cy.getElementById(tgt).length > 0) {
          try {
            cy.add({
              group: 'edges',
              classes: 'suggested-runtime',
              data: {
                id: `suggested-${idx}`,
                source: src,
                target: tgt,
                kind: 'predicted',
                label: `AI (${Math.round((link.score || link.confidence || 0.85) * 100)}%)`,
                rec: 'GraphSAGE Inductive Prediction',
              },
            })
          } catch (e) {
            console.warn('Skipping predicted edge:', e)
          }
        }
      })

      cy.style()
        .selector('edge.suggested-runtime')
        .style({
          'line-color': '#00E5FF',
          'line-style': 'dashed',
          'line-dash-pattern': [6, 4],
          'width': 2.5,
          'target-arrow-shape': 'triangle',
          'target-arrow-color': '#00E5FF',
          'arrow-scale': 0.9,
          'opacity': 0.95,
          'z-index': 12,
        })
        .update()
    }
  }, [aiOverlay, suggestedLinks])

  // Handle Anomaly overlay
  useEffect(() => {
    const cy = cyRef.current
    if (!cy) return
    cy.elements().removeClass('anomOn')

    if (anomalyOverlay && anomalyFlags.length > 0) {
      anomalyFlags.forEach((a: any) => {
        const targetId = a.node || a.node_id
        if (targetId) {
          const el = cy.getElementById(targetId)
          if (el.length) el.addClass('anomOn')
        }
        if (a.edge_id) {
          const edgeEl = cy.getElementById(a.edge_id)
          if (edgeEl.length) edgeEl.addClass('anomOn')
        }
      })
    }
  }, [anomalyOverlay, anomalyFlags])

  // Handle Mastermind overlay
  useEffect(() => {
    const cy = cyRef.current
    if (!cy) return
    cy.nodes().removeClass('mastermind')

    if (mastermindMode) {
      const topNode = centralityData && centralityData.length > 0 ? (centralityData[0]?.id || centralityData[0]?.node) : 'P001'
      const node = cy.getElementById(topNode || 'P001')
      if (node.length) {
        node.addClass('mastermind')
        cy.animate({ center: { eles: node }, zoom: 1.35 } as any, { duration: 400 })
      }
    }
  }, [mastermindMode, centralityData])

  // Handle Path Trace
  useEffect(() => {
    const cy = cyRef.current
    if (!cy) return

    cy.elements().removeClass('faded hl')

    const pathData = pathResult as any
    const hops = pathData?.shortest || pathData?.hops
    if (hops && Array.isArray(hops) && hops.length > 0) {
      const pathNodeIds = new Set<string>()
      const pathEdgeIds = new Set<string>()

      hops.forEach((hop: any) => {
        if (hop.from_node) pathNodeIds.add(hop.from_node)
        if (hop.to_node) pathNodeIds.add(hop.to_node)
        if (hop.edge_id) pathEdgeIds.add(hop.edge_id)
      })

      cy.elements().addClass('faded')
      pathNodeIds.forEach(id => cy.getElementById(id).removeClass('faded').addClass('hl'))
      pathEdgeIds.forEach(id => cy.getElementById(id).removeClass('faded'))

      const pathElements = cy.collection()
      pathNodeIds.forEach(id => pathElements.merge(cy.getElementById(id)))
      cy.animate({ fit: { eles: pathElements, padding: 60 } }, { duration: 500 })
    }
  }, [pathResult])

  return (
    <div className="cy-container-wrap relative flex-1 min-h-0 bg-[#06070c]">
      <div ref={containerRef} className="cy-container w-full h-full" />

      {/* Floating Canvas Intelligence Dock (Top-Right) */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-[#0d0e1a]/85 border border-purple-800/40 p-1.5 rounded-xl backdrop-blur-md shadow-2xl font-mono text-xs">
        
        {/* Layout Presets */}
        <div className="flex items-center gap-1 pr-1.5 border-r border-slate-800">
          <button
            onClick={() => applyLayout('cose')}
            className={`px-2 py-1 rounded-lg transition font-semibold cursor-pointer ${
              activeLayout === 'cose' ? 'bg-purple-900/80 text-purple-200 border border-purple-500/50' : 'text-slate-400 hover:text-white'
            }`}
            title="Spacious Force-Directed (CoSE)"
          >
            Force
          </button>
          <button
            onClick={() => applyLayout('concentric')}
            className={`px-2 py-1 rounded-lg transition font-semibold cursor-pointer ${
              activeLayout === 'concentric' ? 'bg-purple-900/80 text-purple-200 border border-purple-500/50' : 'text-slate-400 hover:text-white'
            }`}
            title="Concentric Circles by Centrality"
          >
            Rings
          </button>
          <button
            onClick={() => applyLayout('circle')}
            className={`px-2 py-1 rounded-lg transition font-semibold cursor-pointer ${
              activeLayout === 'circle' ? 'bg-purple-900/80 text-purple-200 border border-purple-500/50' : 'text-slate-400 hover:text-white'
            }`}
            title="Community Circle"
          >
            Circle
          </button>
        </div>

        {/* Smart Label Toggle */}
        <button
          onClick={toggleLabelMode}
          className={`px-2 py-1 rounded-lg border transition flex items-center gap-1.5 cursor-pointer ${
            showAllLabels
              ? 'bg-purple-900/70 text-purple-200 border-purple-500/60'
              : 'bg-[#121422] text-slate-400 border-slate-800 hover:text-white'
          }`}
          title={showAllLabels ? 'Switch to Smart Minimal Labels' : 'Show All 367 Labels'}
        >
          {showAllLabels ? <Eye className="w-3.5 h-3.5 text-purple-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
          <span className="text-[10px] font-bold">{showAllLabels ? 'ALL LABELS' : 'CLEAN LOD'}</span>
        </button>

        {/* Zoom Controls */}
        <div className="flex items-center gap-0.5 pl-1.5 border-l border-slate-800">
          <button
            onClick={handleZoomIn}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleFit}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="Fit Graph to View"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Floating Canvas Legend (Bottom-Left) */}
      <div className="canvas-legend">
        <div className="legend-header" onClick={() => setLegendOpen(!legendOpen)}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Layers size={13} color="var(--color-cyan)" />
            <span>Graph Legend</span>
          </span>
          {legendOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </div>

        {legendOpen && (
          <div className="legend-body">
            <div>
              <div className="legend-group-title">Node Entities</div>
              <div className="legend-row">
                <span className="legend-icon-shape">
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#EAB308', display: 'inline-block' }} />
                </span>
                <span>Person Node</span>
              </div>
              <div className="legend-row">
                <span className="legend-icon-shape">
                  <span style={{ width: 12, height: 8, borderRadius: 2, background: '#0284C7', display: 'inline-block' }} />
                </span>
                <span>Phone / SIM</span>
              </div>
              <div className="legend-row">
                <span className="legend-icon-shape">
                  <span style={{ width: 9, height: 9, transform: 'rotate(45deg)', background: '#F59E0B', display: 'inline-block' }} />
                </span>
                <span>Bank Account</span>
              </div>
              <div className="legend-row">
                <span className="legend-icon-shape">
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: '#EF4444', display: 'inline-block' }} />
                </span>
                <span>Vehicle (ANPR)</span>
              </div>
            </div>

            <div>
              <div className="legend-group-title">Edge Associations</div>
              <div className="legend-row">
                <span style={{ width: 14, height: 2, background: '#F59E0B', display: 'inline-block' }} />
                <span>Financial Transfer</span>
              </div>
              <div className="legend-row">
                <span style={{ width: 14, height: 2, background: 'rgba(100, 116, 139, 0.7)', display: 'inline-block' }} />
                <span>Call Record (CDR)</span>
              </div>
              <div className="legend-row">
                <span style={{ width: 14, height: 2, borderTop: '2px dashed #00E5FF', display: 'inline-block' }} />
                <span style={{ color: 'var(--color-cyan)' }}>AI Link Prediction</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

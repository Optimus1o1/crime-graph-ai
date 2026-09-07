'use client'

import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Maximize2, RotateCw, Sparkles, Box } from 'lucide-react'

interface MiniGraph3DCanvasProps {
  onExpand?: () => void
  onSelectNode?: (nodeId: string) => void
}

interface Node3DData {
  id: string
  label: string
  role: string
  color: number
  hex: string
  pos: [number, number, number]
  size: number
  risk: string
}

const NODES_DATA: Node3DData[] = [
  { id: 'S-201', label: 'SAYED KHAN (S-201)', role: 'SYNDICATE KINGPIN', color: 0xef4444, hex: '#ef4444', pos: [0, 1.2, 0], size: 0.65, risk: '94 / CRITICAL' },
  { id: 'S-089', label: 'AMIT VERMA (S-089)', role: 'HAWALA BROKER', color: 0x00f0ff, hex: '#00f0ff', pos: [-2.4, -0.4, 0.8], size: 0.48, risk: '82 / HIGH' },
  { id: 'CORP_X', label: 'ORION GLOBAL CORP', role: 'SHELL BENEFICIARY', color: 0xf59e0b, hex: '#f59e0b', pos: [2.3, 0.2, -0.6], size: 0.52, risk: '88 / CRITICAL' },
  { id: 'CELL-827', label: 'BURNER CELL-827', role: 'ENCRYPTED BRIDGE', color: 0xa855f7, hex: '#a855f7', pos: [0.6, -1.5, 1.4], size: 0.42, risk: '76 / HIGH' },
  { id: 'LOC-01', label: 'SAFEHOUSE CP-4', role: 'CO-LOCATION HUB', color: 0x10b981, hex: '#10b981', pos: [-1.4, -1.2, -1.5], size: 0.45, risk: '65 / MODERATE' },
]

const EDGES_DATA: [string, string, number][] = [
  ['S-201', 'S-089', 0x00f0ff],
  ['S-201', 'CORP_X', 0xef4444],
  ['S-201', 'CELL-827', 0xa855f7],
  ['S-201', 'LOC-01', 0x10b981],
  ['S-089', 'CELL-827', 0x00f0ff],
  ['CORP_X', 'LOC-01', 0xf59e0b],
]

export default function MiniGraph3DCanvas({ onExpand, onSelectNode }: MiniGraph3DCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoveredNode, setHoveredNode] = useState<Node3DData | null>(null)
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null)
  const [isRotating, setIsRotating] = useState(true)
  const isRotatingRef = useRef(isRotating)
  isRotatingRef.current = isRotating

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth || 400
    const height = container.clientHeight || 220

    // 1. Scene & Camera
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x020509)
    scene.fog = new THREE.FogExp2(0x020509, 0.08)

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.set(0, 1.8, 6.5)
    camera.lookAt(0, 0, 0)

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(1)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    container.appendChild(renderer.domElement)

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0x0a192f, 2.5)
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight(0x00f0ff, 3, 20)
    pointLight.position.set(2, 4, 4)
    scene.add(pointLight)

    const redLight = new THREE.PointLight(0xef4444, 2, 15)
    redLight.position.set(-3, -2, 2)
    scene.add(redLight)

    // 4. Background Hologram Grid Plane
    const gridHelper = new THREE.GridHelper(10, 16, 0x00f0ff, 0x0a223a)
    gridHelper.position.y = -2.2
    scene.add(gridHelper)

    // 5. Graph Root Group (for rotational physics)
    const graphGroup = new THREE.Group()
    scene.add(graphGroup)

    // 6. Spawn Nodes
    const nodeMeshes: { mesh: THREE.Mesh; data: Node3DData; halo: THREE.LineLoop }[] = []
    const nodePositionsMap = new Map<string, THREE.Vector3>()

    NODES_DATA.forEach(node => {
      const pos = new THREE.Vector3(...node.pos)
      nodePositionsMap.set(node.id, pos)

      // Core Sphere
      const sphereGeom = new THREE.SphereGeometry(node.size, 24, 24)
      const sphereMat = new THREE.MeshStandardMaterial({
        color: node.color,
        roughness: 0.2,
        metalness: 0.8,
        emissive: node.color,
        emissiveIntensity: 0.35,
      })
      const sphereMesh = new THREE.Mesh(sphereGeom, sphereMat)
      sphereMesh.position.copy(pos)
      sphereMesh.userData = { id: node.id, nodeData: node }
      graphGroup.add(sphereMesh)

      // Outer Wireframe Halo
      const ringGeom = new THREE.RingGeometry(node.size * 1.3, node.size * 1.38, 32)
      const ringMat = new THREE.MeshBasicMaterial({
        color: node.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
      })
      const halo = new THREE.LineLoop(ringGeom, ringMat)
      halo.position.copy(pos)
      halo.lookAt(camera.position)
      graphGroup.add(halo)

      nodeMeshes.push({ mesh: sphereMesh, data: node, halo })
    })

    // 7. Spawn Laser Edges
    const edgeLines: THREE.Line[] = []
    EDGES_DATA.forEach(([srcId, tgtId, color]) => {
      const srcPos = nodePositionsMap.get(srcId)
      const tgtPos = nodePositionsMap.get(tgtId)
      if (!srcPos || !tgtPos) return

      const points = [srcPos, tgtPos]
      const edgeGeom = new THREE.BufferGeometry().setFromPoints(points)
      const edgeMat = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.65,
        linewidth: 2,
      })
      const line = new THREE.Line(edgeGeom, edgeMat)
      graphGroup.add(line)
      edgeLines.push(line)
    })

    // 8. Interactive Raycaster & Mouse Drag Orbit
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2(-100, -100)
    let isDragging = false
    let prevMousePos = { x: 0, y: 0 }

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

      if (isDragging) {
        const deltaX = e.clientX - prevMousePos.x
        const deltaY = e.clientY - prevMousePos.y
        graphGroup.rotation.y += deltaX * 0.008
        graphGroup.rotation.x += deltaY * 0.008
        prevMousePos = { x: e.clientX, y: e.clientY }
      } else {
        // Raycast
        raycaster.setFromCamera(mouse, camera)
        const intersects = raycaster.intersectObjects(nodeMeshes.map(n => n.mesh))
        if (intersects.length > 0) {
          const hit = intersects[0].object as THREE.Mesh
          const found = hit.userData.nodeData as Node3DData
          setHoveredNode(found)
          setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
          container.style.cursor = 'pointer'
        } else {
          setHoveredNode(null)
          setTooltipPos(null)
          container.style.cursor = 'grab'
        }
      }
    }

    const onPointerDown = (e: MouseEvent) => {
      isDragging = true
      prevMousePos = { x: e.clientX, y: e.clientY }
      container.style.cursor = 'grabbing'
    }

    const onPointerUp = (e: MouseEvent) => {
      isDragging = false
      container.style.cursor = 'grab'

      // Check click on node
      const rect = container.getBoundingClientRect()
      const clickMouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      )
      raycaster.setFromCamera(clickMouse, camera)
      const intersects = raycaster.intersectObjects(nodeMeshes.map(n => n.mesh))
      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh
        const nodeData = hit.userData.nodeData as Node3DData
        if (onSelectNode) onSelectNode(nodeData.id)
      }
    }

    container.addEventListener('mousemove', onPointerMove)
    container.addEventListener('mousedown', onPointerDown)
    window.addEventListener('mouseup', onPointerUp)

    // 9. Resize Observer
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const w = entry.contentRect.width
        const h = entry.contentRect.height
        if (w > 0 && h > 0) {
          camera.aspect = w / h
          camera.updateProjectionMatrix()
          renderer.setSize(w, h)
        }
      }
    })
    resizeObserver.observe(container)

    // 10. Animation Loop
    let animId = 0
    let clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const elapsedTime = clock.getElapsedTime()

      // Auto-rotation
      if (isRotatingRef.current && !isDragging) {
        graphGroup.rotation.y += 0.005
      }

      // Halos face camera & pulse
      nodeMeshes.forEach((n, idx) => {
        n.halo.lookAt(camera.position)
        const scale = 1 + Math.sin(elapsedTime * 2.5 + idx) * 0.08
        n.halo.scale.set(scale, scale, 1)
      })

      renderer.render(scene, camera)
    }
    animate()

    // 11. Cleanup
    return () => {
      cancelAnimationFrame(animId)
      resizeObserver.disconnect()
      container.removeEventListener('mousemove', onPointerMove)
      container.removeEventListener('mousedown', onPointerDown)
      window.removeEventListener('mouseup', onPointerUp)

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
      scene.clear()
    }
  }, [])

  return (
    <div className="w-full h-full relative overflow-hidden select-none group min-h-[190px]">
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="w-full h-full absolute inset-0 cursor-grab" />

      {/* Cyber Scanline effect */}
      <div className="scanline pointer-events-none opacity-40" />

      {/* HUD Overlay Top Badges */}
      <div className="absolute top-2 left-2 flex items-center gap-1.5 pointer-events-none font-mono text-[9px] z-10">
        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-bold shadow-[0_0_8px_rgba(0,229,255,0.3)]">
          <Box className="w-2.5 h-2.5 text-cyan-400 animate-spin-slow" />
          <span>3D HOLOGRAPHIC TOPOLOGY</span>
        </span>
        <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-black/60 border border-slate-700/60 text-slate-400">
          5 NODES · 6 EDGES · LIVE
        </span>
      </div>

      {/* Control Buttons (Rotate / Expand) */}
      <div className="absolute top-2 right-2 flex items-center gap-1 z-20">
        <button
          onClick={(e) => {
            e.stopPropagation()
            setIsRotating(!isRotating)
          }}
          className={`p-1 rounded border transition text-[10px] font-mono flex items-center gap-1 ${
            isRotating
              ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300 hover:bg-cyan-900 shadow-[0_0_6px_rgba(0,229,255,0.4)]'
              : 'bg-black/70 border-slate-700 text-slate-400 hover:text-white'
          }`}
          title={isRotating ? 'Pause 3D Rotation' : 'Enable 3D Rotation'}
        >
          <RotateCw className={`w-3 h-3 ${isRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
        </button>

        {onExpand && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onExpand()
            }}
            className="p-1 rounded bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 transition text-[10px] font-mono flex items-center gap-1 shadow-[0_0_6px_rgba(0,229,255,0.4)]"
            title="Expand into Full Tactical 3D Workbench"
          >
            <Maximize2 className="w-3 h-3 text-cyan-300" />
          </button>
        )}
      </div>

      {/* Floating Raycast Cyber Tooltip */}
      {hoveredNode && tooltipPos && (
        <div
          className="absolute pointer-events-none z-30 transform -translate-x-1/2 -translate-y-full mb-2.5 transition-opacity duration-150"
          style={{ left: tooltipPos.x, top: tooltipPos.y }}
        >
          <div className="bg-[#050B14]/95 border border-cyan-400/70 rounded px-2.5 py-1.5 shadow-[0_0_15px_rgba(0,240,255,0.4)] font-mono text-left whitespace-nowrap min-w-[140px]">
            <div className="flex items-center justify-between gap-2 border-b border-cyan-500/30 pb-1 mb-1">
              <span className="text-[11px] font-bold text-white tracking-wider">
                {hoveredNode.label}
              </span>
              <span 
                className="text-[9px] px-1 py-0.2 rounded font-black uppercase"
                style={{ backgroundColor: `${hoveredNode.hex}22`, color: hoveredNode.hex, border: `1px solid ${hoveredNode.hex}66` }}
              >
                {hoveredNode.id}
              </span>
            </div>
            <div className="text-[9px] text-slate-300">
              Role: <span className="text-white font-bold">{hoveredNode.role}</span>
            </div>
            <div className="text-[9px] text-cyan-300 flex items-center justify-between mt-0.5">
              <span>Threat Level:</span>
              <span className="font-bold" style={{ color: hoveredNode.hex }}>{hoveredNode.risk}</span>
            </div>
            <div className="text-[8px] text-slate-500 mt-1 pt-0.5 border-t border-slate-800">
              CLICK TO INSPECT DOSSIER
            </div>
          </div>
        </div>
      )}

      {/* Bottom Hint */}
      <div className="absolute bottom-1.5 left-2 text-[8px] font-mono text-slate-500 pointer-events-none z-10 flex items-center gap-2">
        <span>DRAG TO ORBIT · HOVER TO INSPECT · CLICK TO EXPAND</span>
      </div>
    </div>
  )
}

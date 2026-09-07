'use client'

import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { RotateCw, Activity, AlertTriangle, ShieldCheck, Box } from 'lucide-react'

interface RoadData {
  id: string
  name: string
  congestion: number
  speed: number
  incidents: number
  status: 'NORMAL' | 'MODERATE' | 'CONGESTED'
}

const JUNCTIONS = [
  { id: 'JCT_INDIRA_N', label: 'Indiranagar N', pos: [-3, 0.4, -2.5] },
  { id: 'JCT_INDIRA_S', label: 'Indiranagar S', pos: [-2, 0.4, 0] },
  { id: 'JCT_DOMLUR', label: 'Domlur Flyover', pos: [0, 1.2, 0.5] }, // Elevated flyover
  { id: 'JCT_AIRPORT', label: 'Airport Hub', pos: [3.5, 0.4, -2] },
  { id: 'JCT_MG_ROAD', label: 'MG Road Trinity', pos: [-4.2, 0.4, 1.5] },
  { id: 'JCT_KORAMANGALA', label: 'Koramangala 80ft', pos: [-0.5, 0.4, 3] },
  { id: 'JCT_BELLANDUR', label: 'Bellandur EcoSpace', pos: [3, 0.4, 2.5] },
]

const ROADS_3D = [
  { from: 'JCT_INDIRA_N', to: 'JCT_INDIRA_S', congestion: 85, color: 0xef4444, name: '100ft Rd Corridor', speed: 18 },
  { from: 'JCT_INDIRA_S', to: 'JCT_DOMLUR', congestion: 65, color: 0xf59e0b, name: 'Intermediate Ring Rd', speed: 32 },
  { from: 'JCT_DOMLUR', to: 'JCT_AIRPORT', congestion: 40, color: 0x00f0ff, name: 'Airport Expressway', speed: 65 },
  { from: 'JCT_MG_ROAD', to: 'JCT_INDIRA_S', congestion: 78, color: 0xef4444, name: 'Old Airport Rd', speed: 22 },
  { from: 'JCT_DOMLUR', to: 'JCT_KORAMANGALA', congestion: 50, color: 0xf59e0b, name: 'Inner Ring Flyover', speed: 45 },
  { from: 'JCT_KORAMANGALA', to: 'JCT_BELLANDUR', congestion: 92, color: 0xef4444, name: 'Outer Ring Road S', speed: 12 },
  { from: 'JCT_AIRPORT', to: 'JCT_BELLANDUR', congestion: 35, color: 0x10b981, name: 'Sarjapur Link', speed: 58 },
]

interface RoadNetwork3DCanvasProps {
  onSelectRoad?: (road: RoadData) => void
}

export default function RoadNetwork3DCanvas({ onSelectRoad }: RoadNetwork3DCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isRotating, setIsRotating] = useState(true)
  const isRotatingRef = useRef(isRotating)
  isRotatingRef.current = isRotating
  const [hoveredEntity, setHoveredEntity] = useState<any>(null)
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth || 600
    const height = container.clientHeight || 340

    // 1. Scene & Camera
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x020509)

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.set(0, 7.5, 9.5)
    camera.lookAt(0, 0.5, 0)

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(1)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.3
    container.appendChild(renderer.domElement)

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0x0a192f, 2.5)
    scene.add(ambientLight)

    const topCyanLight = new THREE.PointLight(0x00f0ff, 2.5, 20)
    topCyanLight.position.set(0, 8, 4)
    scene.add(topCyanLight)

    const groundGrid = new THREE.GridHelper(14, 20, 0x00f0ff, 0x071e33)
    groundGrid.position.y = 0
    scene.add(groundGrid)

    const networkGroup = new THREE.Group()
    scene.add(networkGroup)

    // 4. Spawn Intersections & Vertical Congestion Towers
    const jctMap = new Map<string, THREE.Vector3>()
    const hitObjects: { mesh: THREE.Mesh; data: any }[] = []

    JUNCTIONS.forEach(j => {
      const pos = new THREE.Vector3(j.pos[0], j.pos[1], j.pos[2])
      jctMap.set(j.id, pos)

      // Intersection Beacon Cylinder
      const cylGeom = new THREE.CylinderGeometry(0.35, 0.45, 0.3, 16)
      const cylMat = new THREE.MeshStandardMaterial({
        color: 0x1e1b4b,
        emissive: 0x8b5cf6,
        emissiveIntensity: 0.6,
        metalness: 0.8,
      })
      const jctMesh = new THREE.Mesh(cylGeom, cylMat)
      jctMesh.position.copy(pos)
      networkGroup.add(jctMesh)

      // Glowing Halo Ring
      const ringGeom = new THREE.RingGeometry(0.55, 0.65, 24)
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x8b5cf6, side: THREE.DoubleSide, transparent: true, opacity: 0.7 })
      const halo = new THREE.Mesh(ringGeom, ringMat)
      halo.rotation.x = -Math.PI / 2
      halo.position.set(pos.x, pos.y + 0.05, pos.z)
      networkGroup.add(halo)

      hitObjects.push({
        mesh: jctMesh,
        data: { type: 'intersection', id: j.id, label: j.label }
      })
    })

    // 5. Spawn 3D Road Arcs & Congestion Columns
    const roadSplines: { curve: THREE.QuadraticBezierCurve3; color: number; speed: number }[] = []

    ROADS_3D.forEach((r, idx) => {
      const p1 = jctMap.get(r.from)
      const p2 = jctMap.get(r.to)
      if (!p1 || !p2) return

      // Curved mid point (elevate flyovers)
      const mid = p1.clone().add(p2).multiplyScalar(0.5)
      mid.y += (r.from.includes('DOMLUR') || r.to.includes('DOMLUR')) ? 1.0 : 0.4

      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2)
      roadSplines.push({ curve, color: r.color, speed: r.speed })

      // 3D Tube for the road
      const tubeGeom = new THREE.TubeGeometry(curve, 32, 0.08, 8, false)
      const tubeMat = new THREE.MeshStandardMaterial({
        color: r.color,
        emissive: r.color,
        emissiveIntensity: 0.6,
        roughness: 0.3,
        metalness: 0.7,
      })
      const roadMesh = new THREE.Mesh(tubeGeom, tubeMat)
      networkGroup.add(roadMesh)

      // Vertical Congestion Tower at midpoint
      const towerHeight = (r.congestion / 100) * 1.8
      const towerGeom = new THREE.CylinderGeometry(0.12, 0.12, towerHeight, 12)
      const towerMat = new THREE.MeshStandardMaterial({
        color: r.color,
        emissive: r.color,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.85,
      })
      const tower = new THREE.Mesh(towerGeom, towerMat)
      tower.position.set(mid.x, towerHeight / 2, mid.z)
      networkGroup.add(tower)

      hitObjects.push({
        mesh: roadMesh,
        data: {
          type: 'road',
          id: `ROAD-${idx + 1}`,
          name: r.name,
          congestion: r.congestion,
          speed: r.speed,
          incidents: r.congestion > 75 ? 2 : 0,
          status: r.congestion > 75 ? 'CONGESTED' : r.congestion > 50 ? 'MODERATE' : 'NORMAL',
        }
      })
    })

    // 6. Traffic Particle Pulses (Moving Cars in 3D)
    const trafficCount = 18
    const trafficParticles: { mesh: THREE.Mesh; splineIdx: number; t: number; speedRate: number }[] = []

    for (let i = 0; i < trafficCount; i++) {
      const sIdx = i % roadSplines.length
      const pGeom = new THREE.SphereGeometry(0.09, 8, 8)
      const pMat = new THREE.MeshBasicMaterial({ color: 0xffffff })
      const pMesh = new THREE.Mesh(pGeom, pMat)
      networkGroup.add(pMesh)

      trafficParticles.push({
        mesh: pMesh,
        splineIdx: sIdx,
        t: Math.random(),
        speedRate: 0.005 + (roadSplines[sIdx].speed / 65) * 0.015
      })
    }

    // 7. Mouse Orbit Controls
    let isDragging = false
    let prevMouse = { x: 0, y: 0 }
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2(-100, -100)

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

      if (isDragging) {
        const dx = e.clientX - prevMouse.x
        const dy = e.clientY - prevMouse.y
        networkGroup.rotation.y += dx * 0.007
        networkGroup.rotation.x = Math.max(-0.3, Math.min(0.7, networkGroup.rotation.x + dy * 0.005))
        prevMouse = { x: e.clientX, y: e.clientY }
      } else {
        raycaster.setFromCamera(mouse, camera)
        const intersects = raycaster.intersectObjects(hitObjects.map(h => h.mesh))
        if (intersects.length > 0) {
          const hit = intersects[0].object
          const found = hitObjects.find(h => h.mesh === hit)
          if (found) {
            setHoveredEntity(found.data)
            setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
          }
          container.style.cursor = 'pointer'
        } else {
          setHoveredEntity(null)
          setTooltipPos(null)
          container.style.cursor = 'grab'
        }
      }
    }

    const onPointerDown = (e: MouseEvent) => {
      isDragging = true
      prevMouse = { x: e.clientX, y: e.clientY }
      container.style.cursor = 'grabbing'
    }

    const onPointerUp = (e: MouseEvent) => {
      isDragging = false
      container.style.cursor = 'grab'

      // Check click
      const rect = container.getBoundingClientRect()
      const clickMouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      )
      raycaster.setFromCamera(clickMouse, camera)
      const intersects = raycaster.intersectObjects(hitObjects.map(h => h.mesh))
      if (intersects.length > 0) {
        const hit = intersects[0].object
        const found = hitObjects.find(h => h.mesh === hit)
        if (found && found.data.type === 'road' && onSelectRoad) {
          onSelectRoad(found.data)
        }
      }
    }

    container.addEventListener('mousemove', onPointerMove)
    container.addEventListener('mousedown', onPointerDown)
    window.addEventListener('mouseup', onPointerUp)

    // 8. Resize Observer
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

    // 9. Animation Loop
    let animId = 0
    let clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const delta = clock.getDelta()

      if (isRotatingRef.current && !isDragging) {
        networkGroup.rotation.y += 0.003
      }

      // Move traffic particles
      trafficParticles.forEach(p => {
        p.t = (p.t + delta * p.speedRate) % 1.0
        const spline = roadSplines[p.splineIdx]
        const pos = spline.curve.getPointAt(p.t)
        p.mesh.position.copy(pos)
      })

      renderer.render(scene, camera)
    }
    animate()

    // 10. Cleanup
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
    <div className="w-full h-full relative overflow-hidden select-none bg-[#020509] rounded min-h-[300px]">
      <div ref={containerRef} className="w-full h-full absolute inset-0 cursor-grab" />
      <div className="scanline pointer-events-none opacity-25" />

      {/* Top Left Tag */}
      <div className="absolute top-2 left-2 flex items-center gap-1.5 pointer-events-none z-10 font-mono text-[9px]">
        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-bold">
          <Box className="w-2.5 h-2.5 text-cyan-400" />
          <span>3D ARTERIAL ROAD NETWORK & CONGESTION TOWERS</span>
        </span>
      </div>

      {/* Rotation Control */}
      <div className="absolute top-2 right-2 z-20">
        <button
          onClick={() => setIsRotating(!isRotating)}
          className={`p-1 rounded border text-[10px] font-mono transition flex items-center gap-1 ${
            isRotating
              ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-[0_0_6px_rgba(0,229,255,0.4)]'
              : 'bg-black/60 border-slate-700 text-slate-400'
          }`}
          title="Toggle 3D Orbit"
        >
          <RotateCw className={`w-3 h-3 ${isRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
        </button>
      </div>

      {/* Hover Tooltip */}
      {hoveredEntity && tooltipPos && (
        <div
          className="absolute pointer-events-none z-30 transform -translate-x-1/2 -translate-y-full mb-2"
          style={{ left: tooltipPos.x, top: tooltipPos.y }}
        >
          <div className="bg-[#050B14]/95 border border-cyan-400/80 rounded px-2.5 py-1.5 shadow-[0_0_12px_rgba(0,240,255,0.4)] font-mono text-left whitespace-nowrap">
            {hoveredEntity.type === 'intersection' ? (
              <div>
                <div className="text-[10px] font-bold text-white">{hoveredEntity.label}</div>
                <div className="text-[8px] text-purple-300">METROPOLITAN JUNCTION NODE</div>
              </div>
            ) : (
              <div>
                <div className="text-[10px] font-bold text-white">{hoveredEntity.name}</div>
                <div className="text-[8px] text-slate-300 mt-0.5 flex items-center gap-2">
                  <span>Congestion: <b className={hoveredEntity.congestion > 75 ? 'text-red-400' : 'text-amber-400'}>{hoveredEntity.congestion}%</b></span>
                  <span>Avg Speed: <b className="text-cyan-300">{hoveredEntity.speed} km/h</b></span>
                </div>
                <div className="text-[7px] text-slate-500 mt-0.5">CLICK TO VIEW LIVE ANPR DETAIL</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom Legend */}
      <div className="absolute bottom-2 left-2 flex items-center gap-3 text-[8px] font-mono text-slate-400 pointer-events-none z-10 bg-black/60 px-2 py-0.5 rounded border border-slate-800">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> High Congestion
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> Moderate
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" /> Normal Flow
        </span>
      </div>
    </div>
  )
}

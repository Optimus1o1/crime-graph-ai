'use client'

import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { RotateCw, AlertTriangle, Box, Eye } from 'lucide-react'

interface TelemetryPoint {
  week: string
  cyberFraud: number
  financialVolume: number
  hawalaComms: number
}

const TELEMETRY_DATA: TelemetryPoint[] = [
  { week: 'W1 (Day 1-7)', cyberFraud: 12, financialVolume: 25, hawalaComms: 18 },
  { week: 'W2 (Day 8-14)', cyberFraud: 18, financialVolume: 42, hawalaComms: 28 },
  { week: 'W3 (PEAK SPIKE)', cyberFraud: 85, financialVolume: 78, hawalaComms: 54 },
  { week: 'W4 (Day 22-28)', cyberFraud: 24, financialVolume: 35, hawalaComms: 32 },
]

export default function Telemetry3DRibbonCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isRotating, setIsRotating] = useState<boolean>(true)
  const isRotatingRef = useRef(isRotating)
  isRotatingRef.current = isRotating
  const [hoveredPoint, setHoveredPoint] = useState<{ series: string; week: string; value: string; color: string } | null>(null)
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth || 500
    const height = container.clientHeight || 180

    // 1. Scene & Camera
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x020509)

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100)
    camera.position.set(0, 5.5, 9.5)
    camera.lookAt(0, 1.2, 0)

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(1)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.3
    container.appendChild(renderer.domElement)

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0x091b30, 3.0)
    scene.add(ambientLight)

    const topLight = new THREE.DirectionalLight(0x00f0ff, 1.5)
    topLight.position.set(0, 8, 4)
    scene.add(topLight)

    const redSpot = new THREE.PointLight(0xef4444, 3.5, 15)
    redSpot.position.set(0.5, 3.5, 1.5)
    scene.add(redSpot)

    // 4. Ground Grid
    const grid = new THREE.GridHelper(10, 10, 0x00f0ff, 0x071e33)
    grid.position.y = 0
    scene.add(grid)

    // 5. Chart 3D Group
    const chartGroup = new THREE.Group()
    scene.add(chartGroup)

    // Interactive hit meshes
    const hitMeshes: { mesh: THREE.Mesh; info: { series: string; week: string; value: string; color: string } }[] = []

    // Helper to generate 3D extruded ribbon for a series
    const createRibbon = (
      seriesName: string,
      values: number[],
      zPos: number,
      colorHex: number,
      colorCss: string,
      unitStr: (v: number) => string
    ) => {
      const xPositions = [-3.6, -1.2, 1.2, 3.6]
      const points: THREE.Vector3[] = []
      const ribbonWidth = 0.35

      for (let i = 0; i < values.length; i++) {
        const yVal = (values[i] / 100) * 3.2
        points.push(new THREE.Vector3(xPositions[i], yVal, zPos))
      }

      // Smooth Curve
      const curve = new THREE.CatmullRomCurve3(points)
      const sampledPoints = curve.getPoints(60)

      // Create ribbon geometry using quad strips
      const geom = new THREE.BufferGeometry()
      const vertices: number[] = []
      const indices: number[] = []

      sampledPoints.forEach((p, idx) => {
        vertices.push(p.x, p.y, p.z - ribbonWidth / 2)
        vertices.push(p.x, p.y, p.z + ribbonWidth / 2)

        if (idx < sampledPoints.length - 1) {
          const base = idx * 2
          indices.push(base, base + 1, base + 2)
          indices.push(base + 1, base + 3, base + 2)
        }
      })

      geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
      geom.setIndex(indices)
      geom.computeVertexNormals()

      const ribbonMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        emissive: colorHex,
        emissiveIntensity: 0.45,
        roughness: 0.2,
        metalness: 0.8,
        side: THREE.DoubleSide,
      })
      const ribbonMesh = new THREE.Mesh(geom, ribbonMat)
      chartGroup.add(ribbonMesh)

      // Glowing spine line along top
      const lineGeom = new THREE.BufferGeometry().setFromPoints(sampledPoints)
      const lineMat = new THREE.LineBasicMaterial({ color: colorHex, linewidth: 2 })
      const spineLine = new THREE.Line(lineGeom, lineMat)
      chartGroup.add(spineLine)

      // Vertices Spheres for each week
      points.forEach((p, idx) => {
        const sphereGeom = new THREE.SphereGeometry(0.14, 16, 16)
        const sphereMat = new THREE.MeshStandardMaterial({
          color: colorHex,
          emissive: colorHex,
          emissiveIntensity: 0.8,
        })
        const sphere = new THREE.Mesh(sphereGeom, sphereMat)
        sphere.position.copy(p)
        chartGroup.add(sphere)

        hitMeshes.push({
          mesh: sphere,
          info: {
            series: seriesName,
            week: TELEMETRY_DATA[idx].week,
            value: unitStr(values[idx]),
            color: colorCss,
          }
        })
      })
    }

    // Spawn 3 series with 3D depth
    createRibbon('Cyber Fraud Anomaly', [12, 18, 85, 24], 1.2, 0xef4444, '#ef4444', v => `+${v}% SPIKE`)
    createRibbon('Financial Volume', [25, 42, 78, 35], 0.0, 0xf59e0b, '#f59e0b', v => `$${(v * 15.4 / 100).toFixed(1)}M`)
    createRibbon('Hawala Comms Correlation', [18, 28, 54, 32], -1.2, 0x00f0ff, '#00f0ff', v => `${v}% Traffic`)

    // Anomaly Vertical Laser Pillar at Week 3
    const laserGeom = new THREE.CylinderGeometry(0.03, 0.03, 3.8, 8)
    const laserMat = new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.7 })
    const laser = new THREE.Mesh(laserGeom, laserMat)
    laser.position.set(1.2, 1.9, 1.2)
    chartGroup.add(laser)

    // Pulsing Beacon Ring at Peak
    const beaconRingGeom = new THREE.RingGeometry(0.28, 0.36, 24)
    const beaconRingMat = new THREE.MeshBasicMaterial({ color: 0xef4444, side: THREE.DoubleSide })
    const beaconRing = new THREE.Mesh(beaconRingGeom, beaconRingMat)
    beaconRing.position.set(1.2, 2.8, 1.2)
    beaconRing.rotation.x = -Math.PI / 2
    chartGroup.add(beaconRing)

    // 6. Raycasting & Mouse Drag
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2(-100, -100)
    let isDragging = false
    let prevMousePos = { x: 0, y: 0 }

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

      if (isDragging) {
        const dx = e.clientX - prevMousePos.x
        const dy = e.clientY - prevMousePos.y
        chartGroup.rotation.y += dx * 0.008
        chartGroup.rotation.x = Math.max(-0.2, Math.min(0.6, chartGroup.rotation.x + dy * 0.005))
        prevMousePos = { x: e.clientX, y: e.clientY }
      } else {
        raycaster.setFromCamera(mouse, camera)
        const intersects = raycaster.intersectObjects(hitMeshes.map(h => h.mesh))
        if (intersects.length > 0) {
          const hit = intersects[0].object as THREE.Mesh
          const found = hitMeshes.find(h => h.mesh === hit)
          if (found) {
            setHoveredPoint(found.info)
            setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
          }
          container.style.cursor = 'pointer'
        } else {
          setHoveredPoint(null)
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

    const onPointerUp = () => {
      isDragging = false
      container.style.cursor = 'grab'
    }

    container.addEventListener('mousemove', onPointerMove)
    container.addEventListener('mousedown', onPointerDown)
    window.addEventListener('mouseup', onPointerUp)

    // 7. Resize Observer
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

    // 8. Animation Loop
    let animId = 0
    let clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const elapsed = clock.getElapsedTime()

      if (isRotatingRef.current && !isDragging) {
        chartGroup.rotation.y = Math.sin(elapsed * 0.5) * 0.35
      }

      const ringScale = 1.0 + Math.sin(elapsed * 4) * 0.25
      beaconRing.scale.set(ringScale, ringScale, 1)

      renderer.render(scene, camera)
    }
    animate()

    // 9. Cleanup
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
    <div className="w-full h-full relative overflow-hidden select-none bg-[#020509] rounded min-h-[160px]">
      {/* Three.js 3D Canvas */}
      <div ref={containerRef} className="w-full h-full absolute inset-0 cursor-grab" />

      {/* Cyber Scanline */}
      <div className="scanline pointer-events-none opacity-30" />

      {/* Top HUD Strip */}
      <div className="absolute top-2 left-2 flex items-center gap-1.5 pointer-events-none z-10 font-mono text-[9px]">
        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-bold shadow-[0_0_8px_rgba(0,229,255,0.3)]">
          <Box className="w-2.5 h-2.5 text-cyan-400" />
          <span>3D VOLUMETRIC TELEMETRY MESH</span>
        </span>
        <span className="px-1.5 py-0.5 rounded bg-red-950/90 border border-red-500/50 text-red-300 font-bold flex items-center gap-1">
          <AlertTriangle className="w-2.5 h-2.5 text-red-400" />
          <span>PEAK ANOMALY: W3</span>
        </span>
      </div>

      {/* Rotate Pause/Play Control */}
      <div className="absolute top-2 right-2 z-20">
        <button
          onClick={() => setIsRotating(!isRotating)}
          className={`p-1 rounded border text-[10px] font-mono transition flex items-center gap-1 ${
            isRotating
              ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-[0_0_6px_rgba(0,229,255,0.4)]'
              : 'bg-black/60 border-slate-700 text-slate-400'
          }`}
          title={isRotating ? 'Pause 3D Tilt' : 'Enable 3D Tilt'}
        >
          <RotateCw className={`w-3 h-3 ${isRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
        </button>
      </div>

      {/* Floating Raycast Tooltip */}
      {hoveredPoint && tooltipPos && (
        <div
          className="absolute pointer-events-none z-30 transform -translate-x-1/2 -translate-y-full mb-2"
          style={{ left: tooltipPos.x, top: tooltipPos.y }}
        >
          <div className="bg-[#050B14]/95 border border-cyan-400/80 rounded px-2 py-1 shadow-[0_0_12px_rgba(0,240,255,0.4)] font-mono text-left whitespace-nowrap">
            <div className="text-[10px] font-bold text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: hoveredPoint.color }} />
              <span>{hoveredPoint.series}</span>
            </div>
            <div className="text-[9px] text-slate-300 mt-0.5">
              Timeline: <span className="text-cyan-300">{hoveredPoint.week}</span>
            </div>
            <div className="text-[10px] font-bold mt-0.5" style={{ color: hoveredPoint.color }}>
              Telemetry: {hoveredPoint.value}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Axis Labels in 3D Space */}
      <div className="absolute bottom-1.5 left-3 right-3 flex items-center justify-between text-[9px] font-mono text-slate-400 pointer-events-none z-10">
        <span>W1 (BASE)</span>
        <span>W2 (INCLINE)</span>
        <span className="text-red-400 font-bold animate-pulse">W3 (MAX PEAK SPIKE)</span>
        <span>W4 (RESOLVE)</span>
      </div>
    </div>
  )
}

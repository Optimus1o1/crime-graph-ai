'use client'

import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Eye, 
  Layers, 
  Compass, 
  Box, 
  Car,
  Maximize2
} from 'lucide-react'

interface Metropolitan3DCanvasProps {
  activeTrack?: string
  isPlaying?: boolean
  playbackSpeed?: number
  timeOffset?: number
  onSelectTrack?: (trackId: string) => void
}

export default function Metropolitan3DCanvas({
  activeTrack = 'DL-4C-AB-1234',
  isPlaying = true,
  playbackSpeed = 1,
  timeOffset = 65,
  onSelectTrack
}: Metropolitan3DCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [cameraView, setCameraView] = useState<'iso' | 'top' | 'drone'>('iso')
  const [showLidar, setShowLidar] = useState<boolean>(true)
  const [hoveredEntity, setHoveredEntity] = useState<string | null>(null)

  const internalStateRef = useRef({
    cameraView: 'iso',
    showLidar: true,
    activeTrack,
    isPlaying,
    playbackSpeed,
    timeOffset
  })

  useEffect(() => {
    internalStateRef.current = {
      cameraView,
      showLidar,
      activeTrack,
      isPlaying,
      playbackSpeed,
      timeOffset
    }
  }, [cameraView, showLidar, activeTrack, isPlaying, playbackSpeed, timeOffset])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth || 700
    const height = container.clientHeight || 420

    // 1. Scene & Camera
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x020509)
    scene.fog = new THREE.FogExp2(0x020509, 0.028)

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 300)
    camera.position.set(24, 28, 36)
    camera.lookAt(0, 2, 0)

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(1)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.3
    container.appendChild(renderer.domElement)

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0x081525, 2.8)
    scene.add(ambientLight)

    const cyanDirLight = new THREE.DirectionalLight(0x00f0ff, 1.8)
    cyanDirLight.position.set(15, 30, 10)
    scene.add(cyanDirLight)

    const redRimLight = new THREE.PointLight(0xef4444, 2.5, 45)
    redRimLight.position.set(-15, 8, -15)
    scene.add(redRimLight)

    // 4. Metropolitan Ground Grid
    const groundGrid = new THREE.GridHelper(70, 35, 0x00f0ff, 0x071e33)
    groundGrid.position.y = 0
    scene.add(groundGrid)

    // 5. Generate 3D Skyscraper City Blocks
    const cityGroup = new THREE.Group()
    scene.add(cityGroup)

    const buildingBoxGeom = new THREE.BoxGeometry(1, 1, 1)
    const buildingBaseMat = new THREE.MeshStandardMaterial({
      color: 0x050c18,
      metalness: 0.85,
      roughness: 0.25,
      emissive: 0x020812,
      emissiveIntensity: 0.5,
    })

    const edgeLineMatCyan = new THREE.LineBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.55 })
    const edgeLineMatBlue = new THREE.LineBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.35 })

    // Fixed seed city procedural layout
    const buildingPositions = [
      // Core District A
      { x: -12, z: -8, w: 4, d: 4, h: 12 },
      { x: -6, z: -8, w: 3, d: 3.5, h: 8 },
      { x: 0, z: -8, w: 4, d: 3, h: 14 },
      { x: 7, z: -8, w: 3.5, d: 3.5, h: 9 },
      { x: 13, z: -8, w: 4, d: 4, h: 11 },

      // District B
      { x: -13, z: -1, w: 3.5, d: 4, h: 7 },
      { x: -7, z: -1, w: 3, d: 3, h: 16 }, // Tower 1
      { x: 1, z: -1, w: 4.5, d: 4, h: 6 },
      { x: 8, z: -1, w: 3, d: 3.5, h: 18 }, // Tower 2
      { x: 14, z: -1, w: 3.5, d: 3, h: 8 },

      // District C
      { x: -12, z: 6, w: 4, d: 3.5, h: 10 },
      { x: -6, z: 6, w: 3, d: 4, h: 13 },
      { x: 0, z: 6, w: 4, d: 3, h: 7 },
      { x: 7, z: 6, w: 3.5, d: 3.5, h: 15 },
      { x: 13, z: 6, w: 4, d: 4, h: 9 },

      // District D (South)
      { x: -11, z: 13, w: 3.5, d: 3.5, h: 6 },
      { x: -5, z: 13, w: 3, d: 3, h: 8 },
      { x: 2, z: 13, w: 4, d: 4, h: 11 },
      { x: 9, z: 13, w: 3.5, d: 3, h: 5 },
    ]

    buildingPositions.forEach((b, idx) => {
      const mesh = new THREE.Mesh(buildingBoxGeom, buildingBaseMat)
      mesh.scale.set(b.w, b.h, b.d)
      mesh.position.set(b.x, b.h / 2, b.z)
      cityGroup.add(mesh)

      // Glowing Edges
      const edges = new THREE.EdgesGeometry(buildingBoxGeom)
      const edgeLine = new THREE.LineSegments(edges, idx % 3 === 0 ? edgeLineMatCyan : edgeLineMatBlue)
      edgeLine.scale.set(b.w, b.h, b.d)
      edgeLine.position.set(b.x, b.h / 2, b.z)
      cityGroup.add(edgeLine)
    })

    // 6. Glowing 3D Arterial Road Splines
    const roadSplineA = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-22, 0.15, -16),
      new THREE.Vector3(-14, 0.15, -4),
      new THREE.Vector3(-4, 0.15, 2),
      new THREE.Vector3(5, 0.15, 10),
      new THREE.Vector3(18, 0.15, 18),
      new THREE.Vector3(25, 0.15, 24),
    ])

    const roadSplineB = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-20, 0.15, 18),
      new THREE.Vector3(-10, 0.15, 11),
      new THREE.Vector3(2, 0.15, 3),
      new THREE.Vector3(12, 0.15, -6),
      new THREE.Vector3(22, 0.15, -16),
    ])

    const roadMatCyan = new THREE.LineBasicMaterial({ color: 0x00f0ff, linewidth: 3, transparent: true, opacity: 0.85 })
    const roadMatAmber = new THREE.LineBasicMaterial({ color: 0xf59e0b, linewidth: 2, transparent: true, opacity: 0.75 })

    const roadPointsA = roadSplineA.getPoints(80)
    const roadGeomA = new THREE.BufferGeometry().setFromPoints(roadPointsA)
    const roadLineA = new THREE.Line(roadGeomA, roadMatCyan)
    scene.add(roadLineA)

    const roadPointsB = roadSplineB.getPoints(80)
    const roadGeomB = new THREE.BufferGeometry().setFromPoints(roadPointsB)
    const roadLineB = new THREE.Line(roadGeomB, roadMatAmber)
    scene.add(roadLineB)

    // 7. Dynamic Moving Vehicles
    // Vehicle 1: DL-4C-AB-1234 (Priority Target Fortuner - Red Glow)
    const veh1Group = new THREE.Group()
    const veh1Body = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.6, 2.0),
      new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xef4444, emissiveIntensity: 0.8 })
    )
    veh1Body.position.y = 0.4
    veh1Group.add(veh1Body)

    // Vehicle 1 Beacon Light
    const veh1Light = new THREE.PointLight(0xef4444, 4, 12)
    veh1Light.position.set(0, 1.2, 0)
    veh1Group.add(veh1Light)

    // Vehicle 1 Pulsing Marker Ring
    const veh1Ring = new THREE.Mesh(
      new THREE.RingGeometry(1.4, 1.6, 24),
      new THREE.MeshBasicMaterial({ color: 0xef4444, side: THREE.DoubleSide, transparent: true, opacity: 0.8 })
    )
    veh1Ring.rotation.x = -Math.PI / 2
    veh1Ring.position.y = 0.1
    veh1Group.add(veh1Ring)
    scene.add(veh1Group)

    // Vehicle 2: HR-26-XX-8812 (Amber Glow)
    const veh2Group = new THREE.Group()
    const veh2Body = new THREE.Mesh(
      new THREE.BoxGeometry(1.0, 0.5, 1.8),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xf59e0b, emissiveIntensity: 0.7 })
    )
    veh2Body.position.y = 0.35
    veh2Group.add(veh2Body)

    const veh2Light = new THREE.PointLight(0xf59e0b, 3, 10)
    veh2Light.position.set(0, 1.0, 0)
    veh2Group.add(veh2Light)
    scene.add(veh2Group)

    // 8. LiDAR Point Cloud Particle Field
    const particleCount = 4200
    const particleGeom = new THREE.BufferGeometry()
    const particlePositions = new Float32Array(particleCount * 3)
    const particleColors = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      const px = (Math.random() - 0.5) * 55
      const pz = (Math.random() - 0.5) * 55
      const py = Math.random() * 16 + 0.2

      particlePositions[i * 3] = px
      particlePositions[i * 3 + 1] = py
      particlePositions[i * 3 + 2] = pz

      // Color gradation (cyan to purple)
      const mix = py / 16
      particleColors[i * 3] = 0.0 + mix * 0.5
      particleColors[i * 3 + 1] = 0.8 - mix * 0.4
      particleColors[i * 3 + 2] = 1.0
    }

    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
    particleGeom.setAttribute('color', new THREE.BufferAttribute(particleColors, 3))

    const particleMat = new THREE.PointsMaterial({
      size: 0.28,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    })
    const lidarPoints = new THREE.Points(particleGeom, particleMat)
    scene.add(lidarPoints)

    // 9. Camera Controls (Pointer Drag, Zoom, Pan)
    let isDragging = false
    let isPanning = false
    let prevMouse = { x: 0, y: 0 }
    let spherical = { radius: 48, theta: 0.8, phi: 1.0 }

    const updateCameraFromSpherical = () => {
      camera.position.x = spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta)
      camera.position.y = spherical.radius * Math.cos(spherical.phi)
      camera.position.z = spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta)
      camera.lookAt(0, 2, 0)
    }
    updateCameraFromSpherical()

    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 2 || e.shiftKey) {
        isPanning = true
      } else {
        isDragging = true
      }
      prevMouse = { x: e.clientX, y: e.clientY }
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging && !isPanning) return
      const dx = e.clientX - prevMouse.x
      const dy = e.clientY - prevMouse.y

      if (isDragging) {
        spherical.theta -= dx * 0.007
        spherical.phi = Math.max(0.2, Math.min(Math.PI / 2.1, spherical.phi - dy * 0.007))
        updateCameraFromSpherical()
      }
      prevMouse = { x: e.clientX, y: e.clientY }
    }

    const onMouseUp = () => {
      isDragging = false
      isPanning = false
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      spherical.radius = Math.max(12, Math.min(95, spherical.radius + e.deltaY * 0.04))
      updateCameraFromSpherical()
    }

    container.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    container.addEventListener('wheel', onWheel, { passive: false })
    container.addEventListener('contextmenu', e => e.preventDefault())

    // 10. Resize Observer
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

    // 11. Animation Loop
    let animId = 0
    let progressA = (timeOffset % 100) / 100
    let progressB = ((timeOffset + 35) % 100) / 100
    let clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const delta = clock.getDelta()
      const state = internalStateRef.current

      // Vehicle Progression
      if (state.isPlaying) {
        progressA = (progressA + delta * 0.06 * state.playbackSpeed) % 1.0
        progressB = (progressB + delta * 0.045 * state.playbackSpeed) % 1.0
      }

      // Position Vehicle 1 on Road A
      const posA = roadSplineA.getPointAt(progressA)
      const tangentA = roadSplineA.getTangentAt(progressA)
      veh1Group.position.copy(posA)
      veh1Group.lookAt(posA.clone().add(tangentA))

      // Pulse Vehicle 1 Ring
      const ringScale = 1.0 + Math.sin(clock.getElapsedTime() * 4) * 0.15
      veh1Ring.scale.set(ringScale, ringScale, 1)

      // Position Vehicle 2 on Road B
      const posB = roadSplineB.getPointAt(progressB)
      const tangentB = roadSplineB.getTangentAt(progressB)
      veh2Group.position.copy(posB)
      veh2Group.lookAt(posB.clone().add(tangentB))

      // Gentle LiDAR rotation
      if (state.showLidar) {
        lidarPoints.visible = true
        lidarPoints.rotation.y += 0.001
      } else {
        lidarPoints.visible = false
      }

      renderer.render(scene, camera)
    }
    animate()

    // 12. Cleanup
    return () => {
      cancelAnimationFrame(animId)
      resizeObserver.disconnect()
      container.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      container.removeEventListener('wheel', onWheel)

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
      scene.clear()
    }
  }, [])

  return (
    <div className="w-full h-full relative overflow-hidden select-none bg-[#020509]">
      {/* 3D WebGL Canvas */}
      <div ref={containerRef} className="w-full h-full absolute inset-0 cursor-grab" />

      {/* Cyber Scanline */}
      <div className="scanline pointer-events-none opacity-30" />

      {/* Camera Preset & Visual Layer Controls */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20 font-mono text-xs">
        <button
          onClick={() => setShowLidar(!showLidar)}
          className={`px-2 py-1 rounded border text-[10px] font-bold flex items-center gap-1 transition ${
            showLidar
              ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-[0_0_8px_rgba(0,229,255,0.4)]'
              : 'bg-black/60 border-slate-700 text-slate-400'
          }`}
          title="Toggle 3D LiDAR Point Cloud"
        >
          <Layers className="w-3 h-3 text-cyan-400" />
          <span>LiDAR 48K</span>
        </button>

        <div className="flex items-center bg-[#070d1a]/90 p-0.5 rounded border border-cyan-500/40">
          <button
            onClick={() => setCameraView('iso')}
            className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
              cameraView === 'iso' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            ISO 3D
          </button>
          <button
            onClick={() => setCameraView('top')}
            className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
              cameraView === 'top' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            SATELLITE
          </button>
        </div>
      </div>

      {/* Active Vehicle Live Status Indicator HUD */}
      <div className="absolute bottom-3 left-3 bg-[#050b14]/90 border border-cyan-500/40 rounded-lg p-2 font-mono text-[10px] z-10 max-w-[280px] shadow-[0_0_15px_rgba(0,0,0,0.8)]">
        <div className="flex items-center justify-between border-b border-cyan-500/30 pb-1 mb-1.5">
          <span className="text-white font-bold flex items-center gap-1.5">
            <Car className="w-3 h-3 text-red-400 animate-pulse" />
            <span>DL-4C-AB-1234 (TARGET)</span>
          </span>
          <span className="px-1 py-0.2 rounded bg-red-950 text-red-300 border border-red-500/50 text-[9px] font-black">
            TRACKING
          </span>
        </div>
        <div className="grid grid-cols-2 gap-1 text-slate-300">
          <div>Speed: <span className="text-cyan-300 font-bold">42 km/h</span></div>
          <div>Altitude: <span className="text-white font-bold">Y: +0.4m</span></div>
          <div>Sector: <span className="text-white font-bold">Chandni Chowk</span></div>
          <div>Telemetry: <span className="text-emerald-400 font-bold">LOCKED</span></div>
        </div>
      </div>

      {/* Controls Hint */}
      <div className="absolute bottom-3 right-3 text-[9px] font-mono text-slate-500 pointer-events-none z-10 flex items-center gap-2 bg-black/60 px-2 py-0.5 rounded border border-slate-800">
        <span>LEFT-DRAG: ORBIT 360° · SCROLL: ZOOM IN/OUT · SHIFT-DRAG: PAN</span>
      </div>
    </div>
  )
}

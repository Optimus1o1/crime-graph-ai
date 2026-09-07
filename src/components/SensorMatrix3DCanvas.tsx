'use client'

import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Video, RotateCw, Box } from 'lucide-react'

interface SensorMatrix3DCanvasProps {
  onSelectCamera?: (camId: string) => void
  onExploreTwin?: () => void
}

interface CameraSensor {
  id: string
  label: string
  pos: [number, number, number]
  status: 'ACTIVE' | 'ALERT' | 'STANDBY'
  color: number
  hex: string
}

const CAMERAS: CameraSensor[] = [
  { id: 'CAM NE-001', label: 'CAM NE-001 [CP GATE 4]', pos: [-2.2, 0, -1.2], status: 'ACTIVE', color: 0x00f0ff, hex: '#00f0ff' },
  { id: 'CAM CP-004', label: 'CAM CP-004 [CHANDNI CHOWK]', pos: [1.8, 0, 0.8], status: 'ALERT', color: 0xef4444, hex: '#ef4444' },
  { id: 'CAM SW-014', label: 'CAM SW-014 [SOUTH EXTN]', pos: [-1.4, 0, 1.8], status: 'ACTIVE', color: 0xf59e0b, hex: '#f59e0b' },
  { id: 'CAM AP-009', label: 'CAM AP-009 [AIRPORT T3]', pos: [2.4, 0, -1.8], status: 'STANDBY', color: 0x10b981, hex: '#10b981' },
]

export default function SensorMatrix3DCanvas({ onSelectCamera, onExploreTwin }: SensorMatrix3DCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isRotating, setIsRotating] = useState(true)
  const isRotatingRef = useRef(isRotating)
  isRotatingRef.current = isRotating
  const [hoveredCam, setHoveredCam] = useState<CameraSensor | null>(null)
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth || 300
    const height = container.clientHeight || 140

    // 1. Scene & Camera
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x020509)

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100)
    camera.position.set(0, 4.8, 6.8)
    camera.lookAt(0, 0.4, 0)

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

    const cyanLight = new THREE.PointLight(0x00f0ff, 2.5, 12)
    cyanLight.position.set(0, 4, 3)
    scene.add(cyanLight)

    const redLight = new THREE.PointLight(0xef4444, 2, 8)
    redLight.position.set(2, 2, 1)
    scene.add(redLight)

    // 4. Matrix Group
    const matrixGroup = new THREE.Group()
    scene.add(matrixGroup)

    // 5. Ground Grid
    const grid = new THREE.GridHelper(8, 12, 0x00f0ff, 0x071e33)
    grid.position.y = 0
    matrixGroup.add(grid)

    // 6. Camera Towers & Sight Cones
    const camMeshes: { mesh: THREE.Mesh; cam: CameraSensor; halo: THREE.Mesh }[] = []

    CAMERAS.forEach(c => {
      const pos = new THREE.Vector3(...c.pos)
      const towerHeight = 1.4

      // Vertical Pylon Column
      const pylonGeom = new THREE.CylinderGeometry(0.04, 0.06, towerHeight, 8)
      const pylonMat = new THREE.MeshBasicMaterial({ color: c.color, transparent: true, opacity: 0.6 })
      const pylon = new THREE.Mesh(pylonGeom, pylonMat)
      pylon.position.set(pos.x, towerHeight / 2, pos.z)
      matrixGroup.add(pylon)

      // Sensor Head Sphere
      const headGeom = new THREE.SphereGeometry(0.18, 16, 16)
      const headMat = new THREE.MeshStandardMaterial({
        color: c.color,
        emissive: c.color,
        emissiveIntensity: 0.8,
        roughness: 0.2,
      })
      const head = new THREE.Mesh(headGeom, headMat)
      head.position.set(pos.x, towerHeight, pos.z)
      matrixGroup.add(head)

      // Pulsing Ground Ring
      const ringGeom = new THREE.RingGeometry(0.3, 0.38, 24)
      const ringMat = new THREE.MeshBasicMaterial({ color: c.color, side: THREE.DoubleSide, transparent: true, opacity: 0.7 })
      const groundRing = new THREE.Mesh(ringGeom, ringMat)
      groundRing.rotation.x = -Math.PI / 2
      groundRing.position.set(pos.x, 0.02, pos.z)
      matrixGroup.add(groundRing)

      // Sight Cone Projection
      const coneGeom = new THREE.ConeGeometry(0.7, 1.2, 16, 1, true)
      const coneMat = new THREE.MeshBasicMaterial({
        color: c.color,
        wireframe: true,
        transparent: true,
        opacity: 0.25,
      })
      const cone = new THREE.Mesh(coneGeom, coneMat)
      cone.position.set(pos.x, towerHeight / 2, pos.z)
      cone.rotation.x = Math.PI
      matrixGroup.add(cone)

      camMeshes.push({ mesh: head, cam: c, halo: groundRing })
    })

    // 7. 3D Parabolic Trajectory Arc (CAM NE-001 -> CAM CP-004)
    const arcCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-2.2, 1.4, -1.2),
      new THREE.Vector3(-0.2, 2.6, -0.2),
      new THREE.Vector3(1.8, 1.4, 0.8)
    )
    const arcPoints = arcCurve.getPoints(50)
    const arcGeom = new THREE.BufferGeometry().setFromPoints(arcPoints)
    const arcMat = new THREE.LineDashedMaterial({
      color: 0xef4444,
      dashSize: 0.2,
      gapSize: 0.1,
      linewidth: 2,
    })
    const arcLine = new THREE.Line(arcGeom, arcMat)
    arcLine.computeLineDistances()
    matrixGroup.add(arcLine)

    // Animated Photon Tracer on Arc
    const photonGeom = new THREE.SphereGeometry(0.1, 12, 12)
    const photonMat = new THREE.MeshBasicMaterial({ color: 0xffffff })
    const photon = new THREE.Mesh(photonGeom, photonMat)
    matrixGroup.add(photon)

    // 8. Raycasting & Mouse Interaction
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
        matrixGroup.rotation.y += dx * 0.008
        matrixGroup.rotation.x = Math.max(-0.4, Math.min(0.7, matrixGroup.rotation.x + dy * 0.006))
        prevMousePos = { x: e.clientX, y: e.clientY }
      } else {
        raycaster.setFromCamera(mouse, camera)
        const intersects = raycaster.intersectObjects(camMeshes.map(c => c.mesh))
        if (intersects.length > 0) {
          const hit = intersects[0].object
          const found = camMeshes.find(c => c.mesh === hit)
          if (found) {
            setHoveredCam(found.cam)
            setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
          }
          container.style.cursor = 'pointer'
        } else {
          setHoveredCam(null)
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

      // Check click on camera head
      const rect = container.getBoundingClientRect()
      const clickMouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      )
      raycaster.setFromCamera(clickMouse, camera)
      const intersects = raycaster.intersectObjects(camMeshes.map(c => c.mesh))
      if (intersects.length > 0) {
        const hit = intersects[0].object
        const found = camMeshes.find(c => c.mesh === hit)
        if (found && onSelectCamera) {
          onSelectCamera(found.cam.id)
        }
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
      const elapsed = clock.getElapsedTime()

      if (isRotatingRef.current && !isDragging) {
        matrixGroup.rotation.y += 0.004
      }

      // Halos pulse
      camMeshes.forEach((c, idx) => {
        const scale = 1.0 + Math.sin(elapsed * 3 + idx) * 0.15
        c.halo.scale.set(scale, scale, 1)
      })

      // Photon on Trajectory Arc
      const t = (elapsed * 0.45) % 1.0
      const pos = arcCurve.getPointAt(t)
      photon.position.copy(pos)

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
    <div className="w-full h-full relative overflow-hidden select-none bg-[#020509] rounded min-h-[140px]">
      <div ref={containerRef} className="w-full h-full absolute inset-0 cursor-grab" />
      <div className="scanline pointer-events-none opacity-30" />

      {/* Top HUD Tag */}
      <div className="absolute top-1.5 left-2 flex items-center gap-1.5 pointer-events-none z-10 font-mono text-[9px]">
        <span className="flex items-center gap-1 px-1 py-0.2 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-bold">
          <Box className="w-2.5 h-2.5 text-cyan-400" />
          <span>3D ANPR CAMERA MATRIX GRID</span>
        </span>
      </div>

      {/* Rotation Control */}
      <div className="absolute top-1.5 right-1.5 z-20">
        <button
          onClick={() => setIsRotating(!isRotating)}
          className={`p-1 rounded border text-[9px] font-mono transition ${
            isRotating
              ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-[0_0_6px_rgba(0,229,255,0.4)]'
              : 'bg-black/60 border-slate-700 text-slate-400'
          }`}
          title="Toggle 3D Rotation"
        >
          <RotateCw className={`w-3 h-3 ${isRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
        </button>
      </div>

      {/* Tooltip */}
      {hoveredCam && tooltipPos && (
        <div
          className="absolute pointer-events-none z-30 transform -translate-x-1/2 -translate-y-full mb-2"
          style={{ left: tooltipPos.x, top: tooltipPos.y }}
        >
          <div className="bg-[#050B14]/95 border border-cyan-400/80 rounded px-2 py-1 shadow-[0_0_12px_rgba(0,240,255,0.4)] font-mono text-left whitespace-nowrap">
            <div className="text-[10px] font-bold text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: hoveredCam.hex }} />
              <span>{hoveredCam.label}</span>
            </div>
            <div className="text-[8px] text-cyan-300 mt-0.5">
              Status: <span className="font-bold">{hoveredCam.status}</span> · CLICK TO SELECT FEED
            </div>
          </div>
        </div>
      )}

      {/* Bottom Hint */}
      <div className="absolute bottom-1 left-2 text-[8px] font-mono text-slate-500 pointer-events-none z-10">
        DRAG TO ROTATE · 3D ARC TRAJECTORY CORRELATION
      </div>
    </div>
  )
}

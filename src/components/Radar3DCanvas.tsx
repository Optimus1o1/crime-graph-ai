'use client'

import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Compass, RotateCw } from 'lucide-react'

interface Radar3DCanvasProps {
  targetName?: string
  coordinates?: string
  geoAccuracy?: string
  onExplore?: () => void
}

export default function Radar3DCanvas({
  targetName = 'SAYED KHAN LOC-01',
  coordinates = '28.6562° N, 77.2410° E',
  geoAccuracy = '98.4%',
  onExplore
}: Radar3DCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isSweeping, setIsSweeping] = useState<boolean>(true)
  const isSweepingRef = useRef(isSweeping)
  isSweepingRef.current = isSweeping

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth || 240
    const height = container.clientHeight || 150

    // 1. Scene & Camera
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x020509)

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100)
    camera.position.set(0, 4.2, 5.5)
    camera.lookAt(0, 0, 0)

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(1)
    container.appendChild(renderer.domElement)

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0x061528, 3)
    scene.add(ambientLight)

    const cyanLight = new THREE.PointLight(0x00f0ff, 2, 10)
    cyanLight.position.set(0, 3, 2)
    scene.add(cyanLight)

    const radarGroup = new THREE.Group()
    scene.add(radarGroup)

    // 4. Concentric Range Rings (3D Discs)
    const ringRadii = [0.8, 1.6, 2.4]
    ringRadii.forEach((r, idx) => {
      const ringGeom = new THREE.RingGeometry(r - 0.015, r + 0.015, 64)
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: idx === 2 ? 0.35 : 0.2,
      })
      const ring = new THREE.Mesh(ringGeom, ringMat)
      ring.rotation.x = -Math.PI / 2
      radarGroup.add(ring)
    })

    // Crosshairs
    const lineMat = new THREE.LineBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.25 })
    const hLineGeom = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-2.6, 0, 0), new THREE.Vector3(2.6, 0, 0)])
    const vLineGeom = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, -2.6), new THREE.Vector3(0, 0, 2.6)])
    radarGroup.add(new THREE.Line(hLineGeom, lineMat))
    radarGroup.add(new THREE.Line(vLineGeom, lineMat))

    // 5. 3D Volumetric Sweep Fan
    const sweepGeom = new THREE.CircleGeometry(2.4, 32, 0, Math.PI / 3)
    const sweepMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.15,
    })
    const sweepMesh = new THREE.Mesh(sweepGeom, sweepMat)
    sweepMesh.rotation.x = -Math.PI / 2
    radarGroup.add(sweepMesh)

    // 6. Target Beacon (Red Point with vertical altitude beam)
    const targetPos = new THREE.Vector3(0.9, 0.4, -0.7)
    
    // Vertical beam
    const beamGeom = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(targetPos.x, 0, targetPos.z), targetPos])
    const beamMat = new THREE.LineBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.8 })
    radarGroup.add(new THREE.Line(beamGeom, beamMat))

    // Target Sphere
    const targetGeom = new THREE.SphereGeometry(0.12, 16, 16)
    const targetMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xef4444,
      emissiveIntensity: 0.9,
    })
    const targetSphere = new THREE.Mesh(targetGeom, targetMat)
    targetSphere.position.copy(targetPos)
    radarGroup.add(targetSphere)

    // Pulsing target ground ring
    const groundRingGeom = new THREE.RingGeometry(0.2, 0.26, 24)
    const groundRingMat = new THREE.MeshBasicMaterial({ color: 0xef4444, side: THREE.DoubleSide, transparent: true, opacity: 0.8 })
    const groundRing = new THREE.Mesh(groundRingGeom, groundRingMat)
    groundRing.rotation.x = -Math.PI / 2
    groundRing.position.set(targetPos.x, 0.01, targetPos.z)
    radarGroup.add(groundRing)

    // 7. Mouse drag tilt
    let isDragging = false
    let prevMouse = { x: 0, y: 0 }

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true
      prevMouse = { x: e.clientX, y: e.clientY }
    }
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      const dx = e.clientX - prevMouse.x
      const dy = e.clientY - prevMouse.y
      radarGroup.rotation.y += dx * 0.008
      camera.position.y = Math.max(2.5, Math.min(6.5, camera.position.y + dy * 0.01))
      camera.lookAt(0, 0, 0)
      prevMouse = { x: e.clientX, y: e.clientY }
    }
    const onMouseUp = () => { isDragging = false }

    container.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

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
      const elapsed = clock.getElapsedTime()

      if (isSweepingRef.current) {
        sweepMesh.rotation.z = -elapsed * 1.8
      }

      const ringScale = 1.0 + Math.sin(elapsed * 4) * 0.25
      groundRing.scale.set(ringScale, ringScale, 1)

      renderer.render(scene, camera)
    }
    animate()

    // 10. Cleanup
    return () => {
      cancelAnimationFrame(animId)
      resizeObserver.disconnect()
      container.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
      scene.clear()
    }
  }, [])

  return (
    <div 
      onClick={onExplore}
      className="w-full h-full relative overflow-hidden select-none bg-[#020509] rounded cursor-pointer min-h-[150px]"
    >
      <div ref={containerRef} className="w-full h-full absolute inset-0 cursor-grab" />
      <div className="scanline pointer-events-none opacity-25" />

      {/* Top Left Tag */}
      <div className="absolute top-1.5 left-2 flex items-center gap-1 pointer-events-none z-10 font-mono text-[9px]">
        <Compass className="w-2.5 h-2.5 text-cyan-400 animate-spin-slow" />
        <span className="text-cyan-300 font-bold">3D VOLUMETRIC RADAR HUD</span>
      </div>

      {/* Sweep Pause Toggle */}
      <div className="absolute top-1.5 right-1.5 z-20">
        <button
          onClick={(e) => {
            e.stopPropagation()
            setIsSweeping(!isSweeping)
          }}
          className={`p-0.5 rounded border text-[8px] font-mono ${
            isSweeping ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300' : 'bg-black/60 border-slate-700 text-slate-400'
          }`}
          title="Toggle Radar Sweep"
        >
          <RotateCw className={`w-2.5 h-2.5 ${isSweeping ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
        </button>
      </div>

      {/* Target Pin Callout */}
      <div className="absolute top-8 right-2 bg-red-950/80 border border-red-500/50 rounded px-1.5 py-0.5 pointer-events-none font-mono text-[8px] text-red-200 z-10 shadow-[0_0_8px_rgba(239,68,68,0.4)]">
        <div className="font-bold text-red-300">TARGET PIN: BEACON 1</div>
        <div className="text-[7px] text-slate-400">{coordinates}</div>
      </div>

      {/* Bottom Accuracy Badge */}
      <div className="absolute bottom-1 right-2 text-[8px] font-mono text-cyan-400 bg-black/70 px-1 rounded border border-cyan-900/40 pointer-events-none z-10">
        GEO-ACCURACY: {geoAccuracy}
      </div>
    </div>
  )
}

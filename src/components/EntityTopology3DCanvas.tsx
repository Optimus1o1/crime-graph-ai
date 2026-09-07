'use client'

import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { RotateCw, Box, Radio } from 'lucide-react'

interface EntityTopology3DCanvasProps {
  targetLabel?: string
  targetId?: string
  onSelectNode?: (nodeId: string) => void
}

interface SatelliteNode {
  id: string
  label: string
  relation: string
  color: number
  hex: string
  orbitRadius: number
  orbitSpeed: number
  inclination: number
  phase: number
  size: number
}

const SATELLITE_NODES: SatelliteNode[] = [
  { id: 'S-089', label: 'Amit Verma (S-089)', relation: 'Hawala Mule Bridge', color: 0x00f0ff, hex: '#00f0ff', orbitRadius: 2.6, orbitSpeed: 0.8, inclination: 0.35, phase: 0, size: 0.32 },
  { id: 'CORP-X', label: 'Orion Global Ltd', relation: 'Shell Beneficiary', color: 0xf59e0b, hex: '#f59e0b', orbitRadius: 3.4, orbitSpeed: -0.6, inclination: -0.45, phase: 1.8, size: 0.36 },
  { id: 'CELL-827', label: 'Burner Handset', relation: 'Encrypted CDR Burst', color: 0xa855f7, hex: '#a855f7', orbitRadius: 2.2, orbitSpeed: 1.1, inclination: 0.8, phase: 3.2, size: 0.28 },
  { id: 'LOC-01', label: 'Safehouse CP-4', relation: 'Frequent Co-Location', color: 0x10b981, hex: '#10b981', orbitRadius: 3.8, orbitSpeed: 0.45, inclination: -0.2, phase: 4.5, size: 0.34 },
  { id: 'DEV-092', label: 'Mule Account 501', relation: '₹45L Transit Layer', color: 0xec4899, hex: '#ec4899', orbitRadius: 2.9, orbitSpeed: -0.9, inclination: 0.6, phase: 2.1, size: 0.30 },
]

export default function EntityTopology3DCanvas({
  targetLabel = 'SAYED KHAN (S-201)',
  targetId = 'S-201',
  onSelectNode
}: EntityTopology3DCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isRotating, setIsRotating] = useState(true)
  const isRotatingRef = useRef(isRotating)
  isRotatingRef.current = isRotating
  const [hoveredNode, setHoveredNode] = useState<{ id: string; label: string; relation: string; hex: string } | null>(null)
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth || 300
    const height = container.clientHeight || 150

    // 1. Scene & Camera
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x020509)

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.set(0, 3.8, 6.2)
    camera.lookAt(0, 0, 0)

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    container.appendChild(renderer.domElement)

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0x0a192f, 2.5)
    scene.add(ambientLight)

    const centerPointLight = new THREE.PointLight(0xef4444, 3.5, 12)
    centerPointLight.position.set(0, 0, 0)
    scene.add(centerPointLight)

    const dirLight = new THREE.DirectionalLight(0x00f0ff, 1.2)
    dirLight.position.set(4, 6, 4)
    scene.add(dirLight)

    // 4. Cluster Group
    const clusterGroup = new THREE.Group()
    scene.add(clusterGroup)

    // 5. Central Target Suspect (S-201)
    const centralGeom = new THREE.SphereGeometry(0.55, 24, 24)
    const centralMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xef4444,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.8,
    })
    const centralSphere = new THREE.Mesh(centralGeom, centralMat)
    clusterGroup.add(centralSphere)

    // Central Halo Ring
    const haloGeom = new THREE.RingGeometry(0.75, 0.82, 32)
    const haloMat = new THREE.MeshBasicMaterial({ color: 0xef4444, side: THREE.DoubleSide, transparent: true, opacity: 0.7 })
    const centralHalo = new THREE.Mesh(haloGeom, haloMat)
    centralHalo.rotation.x = -Math.PI / 2
    clusterGroup.add(centralHalo)

    // 6. Spawn Orbiting Satellites and Orbital Track Lines
    const satellites: { mesh: THREE.Mesh; line: THREE.Line; data: SatelliteNode }[] = []

    SATELLITE_NODES.forEach(sat => {
      // Orbital Ring Track
      const trackGeom = new THREE.RingGeometry(sat.orbitRadius - 0.02, sat.orbitRadius + 0.02, 48)
      const trackMat = new THREE.MeshBasicMaterial({
        color: sat.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.18,
      })
      const trackMesh = new THREE.Mesh(trackGeom, trackMat)
      trackMesh.rotation.x = -Math.PI / 2 + sat.inclination
      clusterGroup.add(trackMesh)

      // Satellite Sphere
      const satGeom = new THREE.SphereGeometry(sat.size, 16, 16)
      const satMat = new THREE.MeshStandardMaterial({
        color: sat.color,
        emissive: sat.color,
        emissiveIntensity: 0.5,
      })
      const satMesh = new THREE.Mesh(satGeom, satMat)
      clusterGroup.add(satMesh)

      // Laser Link line to center
      const lineGeom = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0)])
      const lineMat = new THREE.LineBasicMaterial({ color: sat.color, transparent: true, opacity: 0.6 })
      const line = new THREE.Line(lineGeom, lineMat)
      clusterGroup.add(line)

      satellites.push({ mesh: satMesh, line, data: sat })
    })

    // 7. Raycasting & Mouse Interaction
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
        clusterGroup.rotation.y += dx * 0.008
        clusterGroup.rotation.x = Math.max(-0.6, Math.min(0.8, clusterGroup.rotation.x + dy * 0.006))
        prevMousePos = { x: e.clientX, y: e.clientY }
      } else {
        raycaster.setFromCamera(mouse, camera)
        const intersects = raycaster.intersectObjects([centralSphere, ...satellites.map(s => s.mesh)])
        if (intersects.length > 0) {
          const hit = intersects[0].object
          if (hit === centralSphere) {
            setHoveredNode({ id: targetId, label: targetLabel, relation: 'TARGET SYNDICATE CORE', hex: '#ef4444' })
          } else {
            const found = satellites.find(s => s.mesh === hit)
            if (found) {
              setHoveredNode({ id: found.data.id, label: found.data.label, relation: found.data.relation, hex: found.data.hex })
            }
          }
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

    const onPointerUp = () => {
      isDragging = false
      container.style.cursor = 'grab'
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
      const elapsed = clock.getElapsedTime()

      if (isRotatingRef.current && !isDragging) {
        clusterGroup.rotation.y += 0.005
      }

      // Central Pulse
      const haloScale = 1.0 + Math.sin(elapsed * 3) * 0.12
      centralHalo.scale.set(haloScale, haloScale, 1)

      // Move each satellite along its orbit
      satellites.forEach(sat => {
        const angle = sat.data.phase + elapsed * sat.data.orbitSpeed * 0.7
        const r = sat.data.orbitRadius
        const incl = sat.data.inclination

        const x = Math.cos(angle) * r
        const z = Math.sin(angle) * r * Math.cos(incl)
        const y = Math.sin(angle) * r * Math.sin(incl)

        sat.mesh.position.set(x, y, z)

        // Update Laser Link
        const positions = sat.line.geometry.attributes.position as THREE.BufferAttribute
        positions.setXYZ(0, 0, 0, 0)
        positions.setXYZ(1, x, y, z)
        positions.needsUpdate = true
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
  }, [targetId, targetLabel])

  return (
    <div className="w-full h-full relative overflow-hidden select-none bg-[#020509] rounded min-h-[140px]">
      <div ref={containerRef} className="w-full h-full absolute inset-0 cursor-grab" />
      <div className="scanline pointer-events-none opacity-30" />

      {/* Top HUD */}
      <div className="absolute top-1.5 left-2 flex items-center gap-1.5 pointer-events-none z-10 font-mono text-[9px]">
        <span className="flex items-center gap-1 px-1 py-0.2 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-bold">
          <Box className="w-2.5 h-2.5 text-cyan-400" />
          <span>3D ORBITING CDR SATELLITE CLUSTER</span>
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
          title="Toggle 3D Orbit"
        >
          <RotateCw className={`w-3 h-3 ${isRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
        </button>
      </div>

      {/* Hover Tooltip */}
      {hoveredNode && tooltipPos && (
        <div
          className="absolute pointer-events-none z-30 transform -translate-x-1/2 -translate-y-full mb-2"
          style={{ left: tooltipPos.x, top: tooltipPos.y }}
        >
          <div className="bg-[#050B14]/95 border border-cyan-400/80 rounded px-2 py-1 shadow-[0_0_12px_rgba(0,240,255,0.4)] font-mono text-left whitespace-nowrap">
            <div className="text-[10px] font-bold text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: hoveredNode.hex }} />
              <span>{hoveredNode.label}</span>
            </div>
            <div className="text-[8px] text-slate-300 mt-0.5">
              Association: <span style={{ color: hoveredNode.hex }}>{hoveredNode.relation}</span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Hint */}
      <div className="absolute bottom-1 left-2 text-[8px] font-mono text-slate-500 pointer-events-none z-10">
        DRAG TO ROTATE 360° · PULSING LASER LINKS
      </div>
    </div>
  )
}

'use client'

import React, { useEffect, useRef, useState, useMemo } from 'react'
import * as THREE from 'three'
import { useStore } from '../store'
import { 
  Maximize2, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Eye, 
  Compass, 
  Sparkles, 
  ShieldAlert, 
  Layers, 
  Check, 
  Info,
  ChevronRight,
  RefreshCw,
  Box
} from 'lucide-react'

// Default fallback 3D syndicate topology if store nodes are still loading
const FALLBACK_3D_NODES = [
  { id: 'P-101', label: 'Rahul Kumar', type: 'Person', risk: 'CRITICAL', comm: '1', degree: 14, betweenness: 0.42 },
  { id: 'P-102', label: 'Ravi Shankar', type: 'Person', risk: 'HIGH', comm: '1', degree: 8, betweenness: 0.18 },
  { id: 'P-103', label: 'Vikram Malhotra', type: 'Person', risk: 'CRITICAL', comm: '2', degree: 12, betweenness: 0.88 },
  { id: 'P-104', label: 'Viktor Rao', type: 'Person', risk: 'CRITICAL', comm: '2', degree: 16, betweenness: 0.71 },
  { id: 'P-105', label: 'R. Kumar (Alias)', type: 'Person', risk: 'HIGH', comm: '1', degree: 5, betweenness: 0.22 },
  { id: 'P-106', label: 'Ananya Verma', type: 'Person', risk: 'HIGH', comm: '3', degree: 7, betweenness: 0.35 },
  { id: 'P-107', label: 'Tariq Sheikh', type: 'Person', risk: 'CRITICAL', comm: '3', degree: 9, betweenness: 0.45 },
  { id: 'PH-01', label: '+91 98450 11223', type: 'Phone', risk: 'HIGH', comm: '1', degree: 6, betweenness: 0.20 },
  { id: 'PH-03', label: '+91 99001 12233 (Burner)', type: 'Phone', risk: 'CRITICAL', comm: '1', degree: 9, betweenness: 0.65 },
  { id: 'PH-04', label: '+91 88776 65544', type: 'Phone', risk: 'CRITICAL', comm: '2', degree: 8, betweenness: 0.58 },
  { id: 'BA-01', label: 'HDFC Mule 50100', type: 'Account', risk: 'CRITICAL', comm: '1', degree: 10, betweenness: 0.55 },
  { id: 'BA-02', label: 'ICICI Layering 00210', type: 'Account', risk: 'HIGH', comm: '1', degree: 7, betweenness: 0.48 },
  { id: 'BA-03', label: 'Axis Transit 91201', type: 'Account', risk: 'CRITICAL', comm: '2', degree: 9, betweenness: 0.62 },
  { id: 'BA-05', label: 'Offshore Emirates A/C', type: 'Account', risk: 'CRITICAL', comm: '2', degree: 11, betweenness: 0.75 },
  { id: 'ORG-01', label: 'Orion Global Export Ltd', type: 'Company', risk: 'CRITICAL', comm: '2', degree: 12, betweenness: 0.69 },
  { id: 'ORG-02', label: 'Apex Logistics Pvt Ltd', type: 'Company', risk: 'HIGH', comm: '3', degree: 8, betweenness: 0.38 },
  { id: 'LOC-01', label: 'Indiranagar Safehouse', type: 'Location', risk: 'CRITICAL', comm: '1', degree: 8, betweenness: 0.40 },
  { id: 'LOC-03', label: 'BKC Corporate Suite', type: 'Location', risk: 'CRITICAL', comm: '2', degree: 9, betweenness: 0.58 },
  { id: 'VH-01', label: 'KA-03-HA-8821 (Fortuner)', type: 'Vehicle', risk: 'HIGH', comm: '1', degree: 5, betweenness: 0.28 },
  { id: 'VH-02', label: 'MH-02-CD-9901 (Innova)', type: 'Vehicle', risk: 'HIGH', comm: '3', degree: 4, betweenness: 0.22 },
]

const FALLBACK_3D_EDGES = [
  { source: 'P-101', target: 'P-102', kind: 'CALL', label: 'Coordination' },
  { source: 'P-101', target: 'PH-01', kind: 'CALL', label: 'Device Link' },
  { source: 'P-101', target: 'PH-03', kind: 'CALL', label: 'Burner Handset' },
  { source: 'P-101', target: 'BA-01', kind: 'TRANSFER', label: '₹45L Mule Deposit' },
  { source: 'P-101', target: 'LOC-01', kind: 'LOCATION', label: 'Safehouse Hub' },
  { source: 'P-101', target: 'VH-01', kind: 'VEHICLE', label: 'Registered Vehicle' },
  { source: 'P-102', target: 'LOC-01', kind: 'LOCATION', label: 'Enforcer Post' },
  { source: 'P-103', target: 'PH-04', kind: 'CALL', label: 'Direct Comm' },
  { source: 'P-103', target: 'BA-03', kind: 'TRANSFER', label: 'Hawala Bridge' },
  { source: 'P-103', target: 'ORG-01', kind: 'COMPANY', label: 'Director Stake' },
  { source: 'P-103', target: 'LOC-03', kind: 'LOCATION', label: 'Mumbai Office' },
  { source: 'P-104', target: 'BA-05', kind: 'TRANSFER', label: 'Offshore Beneficial' },
  { source: 'P-104', target: 'ORG-01', kind: 'COMPANY', label: 'Secret Owner' },
  { source: 'P-104', target: 'LOC-03', kind: 'LOCATION', label: 'Command Suite' },
  { source: 'PH-03', target: 'PH-04', kind: 'CALL', label: 'Midnight CDR Burst' },
  { source: 'BA-01', target: 'BA-02', kind: 'TRANSFER', label: 'Layering 1' },
  { source: 'BA-02', target: 'BA-03', kind: 'TRANSFER', label: 'Layering 2' },
  { source: 'BA-03', target: 'BA-05', kind: 'TRANSFER', label: 'Offshore Wire' },
  { source: 'BA-03', target: 'ORG-01', kind: 'TRANSFER', label: 'Trade Invoicing' },
  { source: 'P-106', target: 'P-107', kind: 'CALL', label: 'Narcotics Transit' },
  { source: 'P-106', target: 'ORG-02', kind: 'COMPANY', label: 'Cold Storage' },
  { source: 'P-107', target: 'ORG-02', kind: 'COMPANY', label: 'Logistics Fleet' },
  { source: 'ORG-01', target: 'ORG-02', kind: 'TRANSFER', label: 'Inter-Firm Hawala' },
  { source: 'VH-01', target: 'LOC-01', kind: 'LOCATION', label: 'Parked At' },
]

export default function Graph3DCanvas() {
  const mountRef = useRef<HTMLDivElement>(null)
  const [hoveredNode, setHoveredNode] = useState<any>(null)
  const [autoRotate, setAutoRotate] = useState<boolean>(true)
  const [showLabels, setShowLabels] = useState<boolean>(true)
  const [cameraPreset, setCameraPreset] = useState<'iso' | 'top' | 'front'>('iso')

  const {
    nodes: storeNodes,
    edges: storeEdges,
    selectedNodeId,
    selectNode,
    aiOverlay,
    anomalyOverlay
  } = useStore()

  const autoRotateRef = useRef(autoRotate)
  autoRotateRef.current = autoRotate

  const selectedNodeIdRef = useRef(selectedNodeId)
  selectedNodeIdRef.current = selectedNodeId

  // Use store data or fallback rich syndicate topology
  const activeNodes = useMemo(() => {
    if (storeNodes && storeNodes.length >= 5) {
      return storeNodes.map(n => ({
        id: n.id,
        label: n.label || n.id,
        type: n.type || 'Person',
        risk: n.risk || 'HIGH',
        comm: n.comm || '1',
        degree: n.degree || 5,
        betweenness: n.betweenness || 0.3
      }))
    }
    return FALLBACK_3D_NODES
  }, [storeNodes])

  const activeEdges = useMemo(() => {
    if (storeEdges && storeEdges.length >= 5) {
      return storeEdges.map(e => ({
        source: e.source,
        target: e.target,
        kind: e.kind || 'ASSOCIATED_WITH',
        label: e.label || 'Connection'
      }))
    }
    return FALLBACK_3D_EDGES
  }, [storeEdges])

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    let width = container.clientWidth || 800
    let height = container.clientHeight || 550

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x020409)
    scene.fog = new THREE.FogExp2(0x020409, 0.0018)

    const camera = new THREE.PerspectiveCamera(50, width / height, 1, 3000)
    camera.position.set(0, 180, 420)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    container.innerHTML = ''
    container.appendChild(renderer.domElement)

    // 2. Tactical Lighting
    const ambientLight = new THREE.AmbientLight(0x1a2b4c, 1.8)
    scene.add(ambientLight)

    const cyanLight = new THREE.DirectionalLight(0x00e5ff, 2.5)
    cyanLight.position.set(150, 300, 200)
    scene.add(cyanLight)

    const purpleLight = new THREE.DirectionalLight(0xa855f7, 1.5)
    purpleLight.position.set(-200, -100, -150)
    scene.add(purpleLight)

    const blueLight = new THREE.PointLight(0x0284c7, 3, 600)
    blueLight.position.set(0, 50, 0)
    scene.add(blueLight)

    // 3. Cyber Matrix Grid Plane (Ground)
    const gridHelper = new THREE.GridHelper(700, 35, 0x00e5ff, 0x091c34)
    gridHelper.position.y = -120
    ;(gridHelper.material as THREE.Material).opacity = 0.25
    ;(gridHelper.material as THREE.Material).transparent = true
    scene.add(gridHelper)

    // 4. Compute 3D Positions using Spring/Spherical Cluster Coordinates
    const nodePositions = new Map<string, THREE.Vector3>()
    const total = activeNodes.length
    activeNodes.forEach((node, i) => {
      // Cluster by entity type or community
      let comm = parseInt(node.comm || '1') || 1
      let phi = Math.acos(-1 + (2 * i) / total)
      let theta = Math.sqrt(total * Math.PI) * phi

      let radius = 130 + (comm * 25)
      if (node.id === 'P-101' || node.id === 'P001') {
        // Center Coordinator
        nodePositions.set(node.id, new THREE.Vector3(-40, 25, 30))
      } else if (node.id === 'P-104' || node.id === 'P003') {
        // Kingpin in Upper Tier
        nodePositions.set(node.id, new THREE.Vector3(70, 75, -50))
      } else if (node.id === 'P-103' || node.id === 'P002') {
        // Bridge Broker
        nodePositions.set(node.id, new THREE.Vector3(15, -15, 60))
      } else {
        let x = radius * Math.cos(theta) * Math.sin(phi)
        let y = (radius * Math.sin(theta) * Math.sin(phi) * 0.6) + (comm === 2 ? 40 : -20)
        let z = radius * Math.cos(phi)
        nodePositions.set(node.id, new THREE.Vector3(x, y, z))
      }
    })

    // 5. Build 3D Models / Procedural Meshes for Each Entity Type
    const nodeMeshes: THREE.Group[] = []
    const interactiveObjects: THREE.Object3D[] = []

    activeNodes.forEach((node) => {
      const pos = nodePositions.get(node.id) || new THREE.Vector3(0, 0, 0)
      const group = new THREE.Group()
      group.position.copy(pos)
      group.userData = { ...node, isNode: true }

      const type = (node.type || '').toLowerCase()
      const isCritical = node.risk === 'CRITICAL'

      // --- MODEL A: PERSON / TARGET (Holographic Bust + Orbital Biometric Ring) ---
      if (type.includes('person') || type.includes('suspect') || type.includes('target')) {
        // 1. Faceted Icosahedron Head
        const headGeo = new THREE.IcosahedronGeometry(isCritical ? 10 : 8, 1)
        const headMat = new THREE.MeshStandardMaterial({
          color: isCritical ? 0xef4444 : 0x00e5ff,
          emissive: isCritical ? 0x7f1d1d : 0x064e3b,
          emissiveIntensity: 0.6,
          metalness: 0.8,
          roughness: 0.2,
          wireframe: false
        })
        const head = new THREE.Mesh(headGeo, headMat)
        head.position.y = 7
        group.add(head)

        // Torso Pedestal
        const torsoGeo = new THREE.CylinderGeometry(2, 6, 8, 6)
        const torsoMat = new THREE.MeshStandardMaterial({
          color: isCritical ? 0x991b1b : 0x0e7490,
          metalness: 0.9,
          roughness: 0.4
        })
        const torso = new THREE.Mesh(torsoGeo, torsoMat)
        torso.position.y = -2
        group.add(torso)

        // Orbital Biometric Scan Ring
        const ringGeo = new THREE.TorusGeometry(isCritical ? 14 : 11, 0.4, 8, 32)
        const ringMat = new THREE.MeshBasicMaterial({
          color: isCritical ? 0xff4d4d : 0x38bdf8,
          transparent: true,
          opacity: 0.85
        })
        const ring = new THREE.Mesh(ringGeo, ringMat)
        ring.rotation.x = Math.PI / 2.5
        ring.name = 'rotatingRing'
        group.add(ring)
      } 
      // --- MODEL B: PHONE / BURNER SIM (3D Handset + Antenna Rings) ---
      else if (type.includes('phone') || type.includes('call') || type.includes('cdr')) {
        // Smartphone Body
        const phoneGeo = new THREE.BoxGeometry(6, 12, 2)
        const phoneMat = new THREE.MeshStandardMaterial({
          color: 0x0f172a,
          metalness: 0.95,
          roughness: 0.1
        })
        const phone = new THREE.Mesh(phoneGeo, phoneMat)
        group.add(phone)

        // Glowing Screen Face
        const screenGeo = new THREE.PlaneGeometry(4.8, 9.8)
        const screenMat = new THREE.MeshBasicMaterial({
          color: 0x00e5ff,
          transparent: true,
          opacity: 0.9
        })
        const screen = new THREE.Mesh(screenGeo, screenMat)
        screen.position.z = 1.05
        group.add(screen)

        // Antenna Pulsing Wave Rings
        const waveGeo = new THREE.TorusGeometry(8, 0.35, 8, 24)
        const waveMat = new THREE.MeshBasicMaterial({
          color: 0x06b6d4,
          transparent: true,
          opacity: 0.7
        })
        const wave = new THREE.Mesh(waveGeo, waveMat)
        wave.position.y = 8
        wave.name = 'antennaWave'
        group.add(wave)
      } 
      // --- MODEL C: BANK ACCOUNT / MULE (Gold/Metallic Vault Box + Hawala Coin Rings) ---
      else if (type.includes('account') || type.includes('bank') || type.includes('mule')) {
        // Vault Safe Box
        const vaultGeo = new THREE.BoxGeometry(10, 10, 10)
        const vaultMat = new THREE.MeshStandardMaterial({
          color: 0xf59e0b,
          emissive: 0x78350f,
          emissiveIntensity: 0.4,
          metalness: 0.9,
          roughness: 0.3
        })
        const vault = new THREE.Mesh(vaultGeo, vaultMat)
        group.add(vault)

        // Safe Wheel Lock
        const wheelGeo = new THREE.CylinderGeometry(3, 3, 1, 16)
        const wheelMat = new THREE.MeshStandardMaterial({
          color: 0xd97706,
          metalness: 1.0,
          roughness: 0.1
        })
        const wheel = new THREE.Mesh(wheelGeo, wheelMat)
        wheel.rotation.x = Math.PI / 2
        wheel.position.z = 5.2
        wheel.name = 'safeWheel'
        group.add(wheel)

        // Orbiting Transaction Particles
        const coinRingGeo = new THREE.TorusGeometry(13, 0.4, 8, 32)
        const coinRingMat = new THREE.MeshBasicMaterial({
          color: 0xfbbf24,
          transparent: true,
          opacity: 0.75
        })
        const coinRing = new THREE.Mesh(coinRingGeo, coinRingMat)
        coinRing.rotation.x = Math.PI / 4
        coinRing.name = 'rotatingRing'
        group.add(coinRing)
      } 
      // --- MODEL D: COMPANY / SHELL CORP (Monolith Skyscraper Tower) ---
      else if (type.includes('company') || type.includes('org') || type.includes('corp')) {
        // Skyscraper Tower
        const towerGeo = new THREE.BoxGeometry(9, 20, 9)
        const towerMat = new THREE.MeshStandardMaterial({
          color: 0x581c87,
          emissive: 0x3b0764,
          emissiveIntensity: 0.5,
          metalness: 0.85,
          roughness: 0.2
        })
        const tower = new THREE.Mesh(towerGeo, towerMat)
        group.add(tower)

        // Rooftop Antenna Spindle
        const antennaGeo = new THREE.CylinderGeometry(0.5, 1.2, 8, 8)
        const antennaMat = new THREE.MeshStandardMaterial({ color: 0xc084fc, metalness: 0.9 })
        const antenna = new THREE.Mesh(antennaGeo, antennaMat)
        antenna.position.y = 14
        group.add(antenna)

        // Beacon Light Sphere
        const beaconGeo = new THREE.SphereGeometry(1.5, 8, 8)
        const beaconMat = new THREE.MeshBasicMaterial({ color: 0xa855f7 })
        const beacon = new THREE.Mesh(beaconGeo, beaconMat)
        beacon.position.y = 18
        beacon.name = 'beacon'
        group.add(beacon)
      } 
      // --- MODEL E: LOCATION / SAFEHOUSE (Radar Dome Outpost) ---
      else if (type.includes('location') || type.includes('safehouse')) {
        // Octagonal Base
        const baseGeo = new THREE.CylinderGeometry(10, 12, 4, 8)
        const baseMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.7 })
        const base = new THREE.Mesh(baseGeo, baseMat)
        base.position.y = -2
        group.add(base)

        // Geodesic Radar Dome
        const domeGeo = new THREE.SphereGeometry(7, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2)
        const domeMat = new THREE.MeshStandardMaterial({
          color: 0x059669,
          emissive: 0x064e3b,
          transparent: true,
          opacity: 0.85,
          wireframe: true
        })
        const dome = new THREE.Mesh(domeGeo, domeMat)
        group.add(dome)
      } 
      // --- MODEL F: VEHICLE (Chassis + Glowing Headlight Cones) ---
      else {
        // Vehicle Chassis
        const carGeo = new THREE.BoxGeometry(8, 5, 14)
        const carMat = new THREE.MeshStandardMaterial({
          color: 0x0369a1,
          metalness: 0.85,
          roughness: 0.2
        })
        const car = new THREE.Mesh(carGeo, carMat)
        group.add(car)

        // Headlight Beams (2 glowing forward cones)
        const coneGeo = new THREE.ConeGeometry(3, 10, 16)
        const coneMat = new THREE.MeshBasicMaterial({
          color: 0x38bdf8,
          transparent: true,
          opacity: 0.35
        })
        const beamL = new THREE.Mesh(coneGeo, coneMat)
        beamL.position.set(-2.5, -1, 10)
        beamL.rotation.x = -Math.PI / 2
        group.add(beamL)

        const beamR = beamL.clone()
        beamR.position.x = 2.5
        group.add(beamR)
      }

      // Floating 3D Text Canvas Sprite Label
      const canvas = document.createElement('canvas')
      canvas.width = 256
      canvas.height = 64
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.fillStyle = 'rgba(2, 6, 15, 0.8)'
        ctx.strokeStyle = isCritical ? 'rgba(239, 68, 68, 0.8)' : 'rgba(0, 229, 255, 0.8)'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.roundRect(4, 4, 248, 56, 10)
        ctx.fill()
        ctx.stroke()

        ctx.font = 'bold 22px monospace'
        ctx.fillStyle = '#ffffff'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        const labelText = node.label.length > 16 ? node.label.substring(0, 15) + '..' : node.label
        ctx.fillText(labelText, 128, 32)
      }
      const labelTexture = new THREE.CanvasTexture(canvas)
      const spriteMat = new THREE.SpriteMaterial({ map: labelTexture, transparent: true })
      const labelSprite = new THREE.Sprite(spriteMat)
      labelSprite.scale.set(24, 6, 1)
      labelSprite.position.y = 18
      group.add(labelSprite)

      // Add selection targeting reticle (hidden by default)
      const reticleGeo = new THREE.BoxGeometry(22, 22, 22)
      const reticleMat = new THREE.MeshBasicMaterial({
        color: 0x00e5ff,
        wireframe: true,
        transparent: true,
        opacity: 0
      })
      const reticle = new THREE.Mesh(reticleGeo, reticleMat)
      reticle.name = 'selectionReticle'
      group.add(reticle)

      scene.add(group)
      nodeMeshes.push(group)
      interactiveObjects.push(group)
    })

    // 6. Build 3D Connecting Edges with Animated Flow Particles
    const edgeLines: THREE.LineSegments[] = []
    const particlePoints: THREE.Vector3[] = []

    const edgeMatMap: Record<string, THREE.LineBasicMaterial> = {
      CALL: new THREE.LineBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.65 }),
      TRANSFER: new THREE.LineBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.85 }),
      COMPANY: new THREE.LineBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.65 }),
      LOCATION: new THREE.LineBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.6 }),
      DEFAULT: new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.5 })
    }

    const linePositions: number[] = []
    const edgeDataPairs: { u: THREE.Vector3; v: THREE.Vector3; type: string }[] = []

    activeEdges.forEach(edge => {
      const u = nodePositions.get(edge.source)
      const v = nodePositions.get(edge.target)
      if (u && v) {
        linePositions.push(u.x, u.y, u.z, v.x, v.y, v.z)
        edgeDataPairs.push({ u, v, type: (edge.kind || 'CALL').toUpperCase() })
      }
    })

    const edgeGeo = new THREE.BufferGeometry()
    edgeGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3))
    const linesMesh = new THREE.LineSegments(edgeGeo, edgeMatMap.DEFAULT)
    scene.add(linesMesh)

    // Data Flow Particles (Photons traversing 3D edges)
    const particleCount = edgeDataPairs.length * 3
    const particleGeo = new THREE.BufferGeometry()
    const pPositions = new Float32Array(particleCount * 3)
    const pT = new Float32Array(particleCount) // Normalized position 0..1 along each edge

    for (let i = 0; i < particleCount; i++) {
      pT[i] = Math.random()
      const pair = edgeDataPairs[i % edgeDataPairs.length]
      const p = new THREE.Vector3().lerpVectors(pair.u, pair.v, pT[i])
      pPositions[i * 3] = p.x
      pPositions[i * 3 + 1] = p.y
      pPositions[i * 3 + 2] = p.z
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3))

    const particleMat = new THREE.PointsMaterial({
      color: 0x00e5ff,
      size: 3.5,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    })
    const particleSystem = new THREE.Points(particleGeo, particleMat)
    scene.add(particleSystem)

    // 7. Interactive Controls (Mouse drag orbit, zoom, pan)
    let isDragging = false
    let prevMouse = { x: 0, y: 0 }
    let spherical = { radius: 460, theta: 0.4, phi: 1.2 }

    const updateCameraFromSpherical = () => {
      spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi))
      camera.position.x = spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta)
      camera.position.y = spherical.radius * Math.cos(spherical.phi)
      camera.position.z = spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta)
      camera.lookAt(0, 10, 0)
    }
    updateCameraFromSpherical()

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true
      prevMouse = { x: e.clientX, y: e.clientY }
    }

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const mouseX = ((e.clientX - rect.left) / width) * 2 - 1
      const mouseY = -((e.clientY - rect.top) / height) * 2 + 1

      if (isDragging) {
        const dx = e.clientX - prevMouse.x
        const dy = e.clientY - prevMouse.y
        spherical.theta -= dx * 0.006
        spherical.phi -= dy * 0.006
        updateCameraFromSpherical()
        prevMouse = { x: e.clientX, y: e.clientY }
      } else {
        // Raycast for hover
        const raycaster = new THREE.Raycaster()
        raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera)
        const intersects = raycaster.intersectObjects(scene.children, true)
        
        let foundNode: any = null
        for (let hit of intersects) {
          let cur: THREE.Object3D | null = hit.object
          while (cur && cur !== scene) {
            if (cur.userData && cur.userData.isNode) {
              foundNode = cur.userData
              break
            }
            cur = cur.parent
          }
          if (foundNode) break
        }
        setHoveredNode(foundNode)
      }
    }

    const onMouseUp = () => {
      isDragging = false
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      spherical.radius = Math.max(120, Math.min(850, spherical.radius + e.deltaY * 0.4))
      updateCameraFromSpherical()
    }

    const onClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const mouseX = ((e.clientX - rect.left) / width) * 2 - 1
      const mouseY = -((e.clientY - rect.top) / height) * 2 + 1

      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera)
      const intersects = raycaster.intersectObjects(scene.children, true)

      for (let hit of intersects) {
        let cur: THREE.Object3D | null = hit.object
        while (cur && cur !== scene) {
          if (cur.userData && cur.userData.isNode) {
            selectNode(cur.userData.id)
            return
          }
          cur = cur.parent
        }
      }
    }

    container.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    container.addEventListener('wheel', onWheel, { passive: false })
    container.addEventListener('click', onClick)

    // Resize handler
    const onResize = () => {
      if (!container) return
      width = container.clientWidth
      height = container.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    window.addEventListener('resize', onResize)

    // 8. Animation Loop
    let clock = new THREE.Clock()
    let reqId: number

    const animate = () => {
      reqId = requestAnimationFrame(animate)
      const delta = clock.getDelta()
      const elapsed = clock.getElapsedTime()

      // Auto rotation
      if (autoRotateRef.current && !isDragging) {
        spherical.theta += 0.0018
        updateCameraFromSpherical()
      }

      // Animate node meshes (rings, beacons, selection reticles)
      nodeMeshes.forEach(group => {
        const ring = group.getObjectByName('rotatingRing')
        if (ring) {
          ring.rotation.z += 0.02
        }
        const antenna = group.getObjectByName('antennaWave')
        if (antenna) {
          antenna.rotation.z -= 0.03
          antenna.scale.setScalar(1 + 0.15 * Math.sin(elapsed * 4))
        }
        const safeWheel = group.getObjectByName('safeWheel')
        if (safeWheel) {
          safeWheel.rotation.z += 0.01
        }
        const reticle = group.getObjectByName('selectionReticle') as THREE.Mesh
        if (reticle) {
          const isSelected = selectedNodeIdRef.current === group.userData.id
          if (isSelected) {
            reticle.visible = true
            ;(reticle.material as THREE.Material).opacity = 0.8
            reticle.rotation.y += 0.03
            reticle.rotation.x += 0.015
          } else {
            reticle.visible = false
          }
        }
      })

      // Animate Data Flow Particles along 3D edges
      const posAttr = particleGeo.attributes.position as THREE.BufferAttribute
      const pArr = posAttr.array as Float32Array

      for (let i = 0; i < particleCount; i++) {
        pT[i] += 0.007 // Speed of photon flow
        if (pT[i] > 1) pT[i] = 0
        const pair = edgeDataPairs[i % edgeDataPairs.length]
        const p = new THREE.Vector3().lerpVectors(pair.u, pair.v, pT[i])
        pArr[i * 3] = p.x
        pArr[i * 3 + 1] = p.y
        pArr[i * 3 + 2] = p.z
      }
      posAttr.needsUpdate = true

      renderer.render(scene, camera)
    }

    animate()

    // Cleanup
    return () => {
      cancelAnimationFrame(reqId)
      container.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      container.removeEventListener('wheel', onWheel)
      container.removeEventListener('click', onClick)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [activeNodes, activeEdges])

  return (
    <div className="relative w-full h-full flex flex-col bg-[#020409] overflow-hidden select-none">
      
      {/* 3D WebGL Canvas Mounting Point */}
      <div ref={mountRef} className="w-full h-full flex-1 cursor-grab active:cursor-grabbing" />

      {/* Top Left HUD: 3D Hologram Telemetry & Status */}
      <div className="absolute top-3 left-3 bg-[#060a14]/90 border border-cyan-500/40 rounded-lg p-3 backdrop-blur-md font-mono text-xs shadow-[0_0_20px_rgba(0,229,255,0.25)] space-y-1.5 z-20 pointer-events-auto">
        <div className="flex items-center gap-2 pb-1 border-b border-cyan-900/50">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-white font-bold text-[11px] tracking-wider uppercase flex items-center gap-1.5">
            <Box className="w-3.5 h-3.5 text-cyan-400" />
            <span>3D TACTICAL HOLOGRAPHIC GRAPH</span>
          </span>
        </div>

        <div className="flex items-center justify-between gap-4 text-[10px] text-slate-300">
          <span>ACTIVE 3D ENTITY MESHES:</span>
          <b className="text-cyan-300">{activeNodes.length} MODELS</b>
        </div>
        <div className="flex items-center justify-between gap-4 text-[10px] text-slate-300">
          <span>PHOTON LASER CHANNELS:</span>
          <b className="text-emerald-400">{activeEdges.length} EDGES</b>
        </div>
        <div className="flex items-center justify-between gap-4 text-[10px] text-slate-300">
          <span>RENDERER ENGINE:</span>
          <b className="text-purple-400">WEBGL2 HARDWARE ACCEL</b>
        </div>

        <div className="pt-1 border-t border-slate-800 flex items-center gap-2">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-2 py-0.5 rounded text-[10px] font-bold border transition cursor-pointer ${
              autoRotate
                ? 'bg-cyan-950 text-cyan-300 border-cyan-500/50'
                : 'bg-slate-900 text-slate-400 border-slate-700'
            }`}
          >
            {autoRotate ? '360° ORBIT: ACTIVE' : '360° ORBIT: PAUSED'}
          </button>
        </div>
      </div>

      {/* Top Right HUD: 3D Model Legend */}
      <div className="absolute top-3 right-3 bg-[#060a14]/90 border border-cyan-500/30 rounded-lg p-2.5 backdrop-blur-md font-mono text-[10px] shadow-lg z-20 space-y-1.5 hidden sm:block pointer-events-auto">
        <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider pb-1 border-b border-slate-800">
          3D PROCEDURAL ENTITY MESHES
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_6px_#ef4444]" />
          <span className="text-slate-300">Target Bust (Icosahedron Head)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400 shadow-[0_0_6px_#00e5ff]" />
          <span className="text-slate-300">Burner Phone (OLED Screen Box)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-sm bg-amber-400 shadow-[0_0_6px_#f59e0b]" />
          <span className="text-slate-300">Mule Safe (Gold Vault Box)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-sm bg-purple-400 shadow-[0_0_6px_#c084fc]" />
          <span className="text-slate-300">Shell Corp (Tower Monolith)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
          <span className="text-slate-300">Radar Outpost (Geodesic Dome)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-sm bg-sky-400 shadow-[0_0_6px_#38bdf8]" />
          <span className="text-slate-300">SUV Logistics (Headlight Chassis)</span>
        </div>
      </div>

      {/* Bottom Center Hover Tooltip */}
      {hoveredNode && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-[#091222]/95 border border-cyan-400 rounded-lg px-4 py-2 text-center font-mono text-xs shadow-[0_0_25px_rgba(0,229,255,0.4)] pointer-events-none z-30 animate-in fade-in zoom-in duration-150">
          <div className="flex items-center justify-center gap-2">
            <span className="text-white font-bold text-sm">{hoveredNode.label}</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/50 font-bold">
              {hoveredNode.type}
            </span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-red-950 text-red-300 border border-red-500/50 font-bold">
              {hoveredNode.risk}
            </span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            UID: {hoveredNode.id} • DEGREE: {hoveredNode.degree} • BETWEENNESS: {hoveredNode.betweenness}
          </div>
          <div className="text-[9px] text-cyan-300 font-bold mt-1">
            [CLICK 3D MODEL TO LOCK INSPECTOR]
          </div>
        </div>
      )}

      {/* Interactive Controls Overlay Hint */}
      <div className="absolute bottom-3 right-3 bg-black/60 px-2.5 py-1 rounded border border-slate-800 text-[10px] font-mono text-slate-400 pointer-events-none">
        DRAG: 3D ORBIT • RIGHT-CLICK: PAN • SCROLL: ZOOM
      </div>

    </div>
  )
}

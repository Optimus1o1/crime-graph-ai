'use client'

import React, { useState, useRef, useCallback } from 'react'

export interface CrimeGraphLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero'
  variant?: 'hero' | 'badge' | 'emblem' | 'compact'
  interactive?: boolean
  showGlow?: boolean
  showRings?: boolean
  showLaser?: boolean
  showNodes?: boolean
  showTelemetry?: boolean
  badgeType?: 'badge' | 'emblem'
  className?: string
  onClick?: () => void
  title?: string
}

export default function CrimeGraphLogo({
  size = 'md',
  variant = 'badge',
  interactive = true,
  showGlow = true,
  showRings = true,
  showLaser = true,
  showNodes,
  showTelemetry,
  badgeType,
  className = '',
  onClick,
  title = 'CrimeGraph AI — National Defense & Law Enforcement Intelligence System'
}: CrimeGraphLogoProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState<{ x: number; y: number; flareX: number; flareY: number }>({
    x: 0,
    y: 0,
    flareX: 50,
    flareY: 50
  })
  const [isHovered, setIsHovered] = useState(false)

  // Determine actual image source (Official Emblem Logo)
  const imageSrc = '/images/crimegraph_logo_emblem.jpg'

  // Dimensions configuration based on size
  const sizeConfig = {
    sm: {
      box: 38,
      ringSize: 48,
      radius: 20,
      orbitDistance: 24,
      strokeWidth: 1,
      badgeRadius: 'rounded-lg',
      borderWidth: 1.5,
      laserHeight: 2
    },
    md: {
      box: 52,
      ringSize: 66,
      radius: 28,
      orbitDistance: 33,
      strokeWidth: 1.2,
      badgeRadius: 'rounded-xl',
      borderWidth: 2,
      laserHeight: 2.5
    },
    lg: {
      box: 86,
      ringSize: 114,
      radius: 48,
      orbitDistance: 56,
      strokeWidth: 1.4,
      badgeRadius: 'rounded-2xl',
      borderWidth: 2,
      laserHeight: 3
    },
    xl: {
      box: 128,
      ringSize: 168,
      radius: 72,
      orbitDistance: 82,
      strokeWidth: 1.5,
      badgeRadius: 'rounded-2xl',
      borderWidth: 2.5,
      laserHeight: 3.5
    },
    hero: {
      box: 190,
      ringSize: 260,
      radius: 115,
      orbitDistance: 128,
      strokeWidth: 1.6,
      badgeRadius: 'rounded-3xl',
      borderWidth: 3,
      laserHeight: 4
    }
  }[size]

  // Defaults for boolean flags based on variant
  const actualShowNodes = showNodes !== undefined ? showNodes : (variant === 'hero' || size === 'xl')
  const actualShowTelemetry = showTelemetry !== undefined ? showTelemetry : variant === 'hero'

  // 3D Parallax Mouse Move Handler
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    
    // Normalizing tilt angle (max 15 degrees)
    const rotateX = -((y / (rect.height / 2)) * 14)
    const rotateY = (x / (rect.width / 2)) * 14
    
    // Flare position percentage
    const flareX = ((e.clientX - rect.left) / rect.width) * 100
    const flareY = ((e.clientY - rect.top) / rect.height) * 100

    setTilt({ x: rotateX, y: rotateY, flareX, flareY })
  }, [interactive])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    setTilt({ x: 0, y: 0, flareX: 50, flareY: 50 })
  }, [])

  const handleMouseEnter = useCallback(() => {
    if (interactive) setIsHovered(true)
  }, [interactive])

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      title={title}
      style={{
        width: sizeConfig.ringSize,
        height: sizeConfig.ringSize
      }}
      className={`relative flex items-center justify-center select-none group ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {/* 1. Ambient Background Glow Aura */}
      {showGlow && (
        <div
          className={`absolute inset-0 pointer-events-none rounded-full blur-[24px] transition-opacity duration-700 ${
            size === 'hero' ? 'blur-[45px]' : size === 'lg' ? 'blur-[30px]' : 'blur-[18px]'
          } ${isHovered ? 'opacity-100' : 'opacity-70'}`}
          style={{
            background: 'radial-gradient(circle, rgba(0,229,255,0.45) 0%, rgba(147,51,234,0.3) 50%, transparent 75%)'
          }}
        />
      )}

      {/* 2. Sonar Pulse Radar Expanding Rings */}
      {showRings && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="absolute rounded-full border border-cyan-400/30 cg-logo-pulse-wave"
            style={{
              width: sizeConfig.ringSize * 0.92,
              height: sizeConfig.ringSize * 0.92
            }}
          />
          {size === 'hero' && (
            <div
              className="absolute rounded-full border border-purple-500/25 cg-logo-pulse-wave"
              style={{
                width: sizeConfig.ringSize * 1.05,
                height: sizeConfig.ringSize * 1.05,
                animationDelay: '1.6s'
              }}
            />
          )}
        </div>
      )}

      {/* 3. Outer Concentric Tactical HUD Reticle (SVG) */}
      {showRings && size !== 'sm' && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none cg-logo-reticle-cw"
          viewBox={`0 0 ${sizeConfig.ringSize} ${sizeConfig.ringSize}`}
          fill="none"
        >
          {/* Outer Thin Circle with Dashes */}
          <circle
            cx={sizeConfig.ringSize / 2}
            cy={sizeConfig.ringSize / 2}
            r={sizeConfig.radius + (size === 'hero' ? 12 : 6)}
            stroke="#00e5ff"
            strokeWidth={sizeConfig.strokeWidth * 0.8}
            strokeDasharray="4 8"
            strokeOpacity={isHovered ? 0.85 : 0.45}
          />

          {/* Major Quadrant Markers */}
          {size === 'hero' && (
            <>
              {/* Top Bracket */}
              <path
                d={`M ${sizeConfig.ringSize / 2 - 14} 12 L ${sizeConfig.ringSize / 2 + 14} 12`}
                stroke="#22d3ee"
                strokeWidth="2"
                strokeOpacity="0.8"
              />
              {/* Bottom Bracket */}
              <path
                d={`M ${sizeConfig.ringSize / 2 - 14} ${sizeConfig.ringSize - 12} L ${sizeConfig.ringSize / 2 + 14} ${sizeConfig.ringSize - 12}`}
                stroke="#22d3ee"
                strokeWidth="2"
                strokeOpacity="0.8"
              />
              {/* Left Bracket */}
              <path
                d={`M 12 ${sizeConfig.ringSize / 2 - 14} L 12 ${sizeConfig.ringSize / 2 + 14}`}
                stroke="#22d3ee"
                strokeWidth="2"
                strokeOpacity="0.8"
              />
              {/* Right Bracket */}
              <path
                d={`M ${sizeConfig.ringSize - 12} ${sizeConfig.ringSize / 2 - 14} L ${sizeConfig.ringSize - 12} ${sizeConfig.ringSize / 2 + 14}`}
                stroke="#22d3ee"
                strokeWidth="2"
                strokeOpacity="0.8"
              />
            </>
          )}
        </svg>
      )}

      {/* 4. Inner Counter-Rotating Reticle Ring (SVG) */}
      {showRings && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none cg-logo-reticle-ccw"
          viewBox={`0 0 ${sizeConfig.ringSize} ${sizeConfig.ringSize}`}
          fill="none"
        >
          <circle
            cx={sizeConfig.ringSize / 2}
            cy={sizeConfig.ringSize / 2}
            r={sizeConfig.radius + (size === 'hero' ? 2 : 1)}
            stroke="#a855f7"
            strokeWidth={sizeConfig.strokeWidth}
            strokeDasharray="12 18"
            strokeOpacity={isHovered ? 0.75 : 0.35}
          />
        </svg>
      )}

      {/* 5. Orbiting GNN Entity Nodes (Person, Vehicle, Location, Phone) */}
      {actualShowNodes && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {/* Node 1: Person (Cyan) */}
          <div
            className="absolute w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00e5ff]"
            style={{
              // @ts-ignore
              '--orbit-distance': `${sizeConfig.orbitDistance}px`,
              animation: 'cg-orbit-node 10s linear infinite'
            }}
          />
          {/* Node 2: Vehicle (Purple) */}
          <div
            className="absolute w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_#a855f7]"
            style={{
              // @ts-ignore
              '--orbit-distance': `${sizeConfig.orbitDistance}px`,
              animation: 'cg-orbit-node 10s linear infinite',
              animationDelay: '-2.5s'
            }}
          />
          {/* Node 3: Location (Emerald) */}
          <div
            className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]"
            style={{
              // @ts-ignore
              '--orbit-distance': `${sizeConfig.orbitDistance}px`,
              animation: 'cg-orbit-node 10s linear infinite',
              animationDelay: '-5s'
            }}
          />
          {/* Node 4: Phone/Comm (Amber) */}
          <div
            className="absolute w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]"
            style={{
              // @ts-ignore
              '--orbit-distance': `${sizeConfig.orbitDistance}px`,
              animation: 'cg-orbit-node 10s linear infinite',
              animationDelay: '-7.5s'
            }}
          />
        </div>
      )}

      {/* 6. Central Insignia / Falcon Shield Core (with 3D perspective tilt) */}
      <div
        className={`relative z-10 overflow-hidden ${sizeConfig.badgeRadius} bg-[#040813] border-cyan-400 shadow-[0_0_30px_rgba(0,229,255,0.45)] transition-all duration-300 cg-logo-perspective-card ${
          isHovered ? 'shadow-[0_0_45px_rgba(0,229,255,0.75)] scale-105' : ''
        }`}
        style={{
          width: sizeConfig.box,
          height: sizeConfig.box,
          borderWidth: `${sizeConfig.borderWidth}px`,
          transform: interactive
            ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovered ? 1.04 : 1})`
            : undefined
        }}
      >
        {/* Core Image Asset */}
        <img
          src={imageSrc}
          alt="CrimeGraph AI Insignia"
          className="w-full h-full object-cover select-none pointer-events-none transform transition-transform duration-500 group-hover:scale-105"
        />

        {/* Dynamic Holographic Surface Glare Follower */}
        {interactive && (
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{
              opacity: isHovered ? 0.6 : 0.2,
              background: `radial-gradient(circle at ${tilt.flareX}% ${tilt.flareY}%, rgba(255,255,255,0.5) 0%, rgba(34,211,238,0.2) 30%, transparent 65%)`
            }}
          />
        )}

        {/* Sweeping Laser Scanner Bar */}
        {showLaser && (
          <div
            className="absolute left-0 right-0 pointer-events-none cg-logo-laser-beam z-20"
            style={{
              height: `${sizeConfig.laserHeight}px`,
              background: 'linear-gradient(90deg, transparent 0%, rgba(0,229,255,0.85) 50%, transparent 100%)',
              boxShadow: '0 0 10px #00e5ff, 0 0 20px rgba(168,85,247,0.8)'
            }}
          />
        )}

        {/* Shimmer Sheen Passing Through */}
        <div className="absolute inset-0 pointer-events-none cg-logo-holo-shine opacity-60 z-10" />

        {/* Subtle Scanline Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px] opacity-25 z-10" />

        {/* Corner Reticle Accents for the core frame */}
        <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-cyan-300 pointer-events-none" />
        <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-cyan-300 pointer-events-none" />
        <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-cyan-300 pointer-events-none" />
        <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-cyan-300 pointer-events-none" />
      </div>

      {/* 7. Live Telemetry HUD Bar (for hero mode) */}
      {actualShowTelemetry && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[#050B19]/90 border border-cyan-500/40 px-3 py-1 rounded-full shadow-[0_0_15px_rgba(0,229,255,0.25)] text-[9px] font-mono text-cyan-300 whitespace-nowrap z-20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#10b981]" />
          <span className="font-bold tracking-wider">NEURAL LINK ACTIVE</span>
          <span className="text-slate-500">|</span>
          <span className="text-purple-300">GNN v2.1 (96.8% ROC)</span>
        </div>
      )}
    </div>
  )
}

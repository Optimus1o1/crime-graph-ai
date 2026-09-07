import React, { useEffect, useRef } from 'react'
import { useStore } from '../store'

/**
 * Timeline — the bottom activity strip.
 * Renders SVG dots for each edge's date, colored by relationship type.
 * Matches the demo HTML's timeline exactly.
 */
export default function Timeline() {
  const svgRef = useRef<SVGSVGElement>(null)
  const { edges, selectedNodeId } = useStore()

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const W = svg.clientWidth || 800
    const H = 44
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`)

    const t0 = +new Date('2026-01-05')
    const t1 = +new Date('2026-03-05')
    const X = (d: string) => 14 + ((+new Date(d)) - t0) / (t1 - t0) * (W - 28)

    const colors: Record<string, string> = {
      CALLED: '#4A6B8A',
      TRANSFER: '#8C7FE0',
      LINKED: '#C08A2E',
      NAMED_IN: '#C08A2E',
      SEEN_NEAR: '#E86257',
      OWNS: '#3C4E5E',
    }

    const months = [
      ['2026-01-05', 'Jan'],
      ['2026-02-01', 'Feb'],
      ['2026-03-01', 'Mar'],
    ]

    let out = `<line x1="14" y1="22" x2="${W - 14}" y2="22" stroke="#243240" stroke-width="1.5"/>`

    months.forEach(([d, l]) => {
      out += `<text x="${X(d)}" y="40" fill="#4A5F72" font-size="9" font-family="var(--font-mono)">${l}</text>`
    })

    edges.forEach(e => {
      if (!e.date) return
      const rel = !selectedNodeId || e.source === selectedNodeId || e.target === selectedNodeId
      const r = rel && selectedNodeId ? 5 : 4
      const opacity = rel ? 1 : 0.18
      const color = colors[e.kind] || '#456'
      out += `<circle cx="${X(e.date)}" cy="22" r="${r}" fill="${color}" opacity="${opacity}">
        <title>${e.date.slice(5)} · ${e.rec} · ${e.label}</title>
      </circle>`
    })

    svg.innerHTML = out
  }, [edges, selectedNodeId])

  return (
    <div className="timeline-bar">
      <div className="timeline-caption">
        <span>Activity timeline</span>
        <span>Jan — Mar 2026</span>
      </div>
      <svg ref={svgRef} className="tl-svg" />
    </div>
  )
}

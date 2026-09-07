'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Car, X, ShieldCheck, ArrowRight, Clock, Gauge, Camera, CheckCircle2 } from 'lucide-react'

interface VehicleJourneyModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function VehicleJourneyModal({ isOpen, onClose }: VehicleJourneyModalProps) {
  const [vehicleId, setVehicleId] = useState('V1023')
  const [trajectory, setTrajectory] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setLoading(true)
      axios.get(`/api/vehicles/${vehicleId}/trajectory`)
        .then(res => setTrajectory(res.data))
        .catch(() => {})
        .finally(() => setLoading(false))
    }
  }, [isOpen, vehicleId])

  if (!isOpen) return null

  const sampleVehicles = [
    { id: 'V1023', label: 'White Fortuner (KA-01-MJ-4040)', type: 'car' },
    { id: 'V1044', label: 'Tata LPK Hauler (KA-51-B-9912)', type: 'truck' },
    { id: 'V1089', label: 'BMTC Electric Bus (KA-57-F-2210)', type: 'bus' },
  ]

  const matching = trajectory?.multi_signal_matching || {
    plate_similarity: 0.95,
    vehicle_type_match: 0.90,
    appearance_features: 0.81,
    travel_time_plausibility: 0.87,
    route_consistency: 0.92,
    final_confidence_score: 0.91
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 select-none">
      <div className="w-full max-w-3xl bg-[#0d0e17] border border-purple-500/70 rounded-xl shadow-[0_0_35px_rgba(124,58,237,0.35)] flex flex-col max-h-[90vh] overflow-hidden font-sans">
        
        {/* Header */}
        <div className="h-14 border-b border-purple-900/40 px-5 flex items-center justify-between bg-[#111320] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-950/80 border border-purple-500/60 flex items-center justify-center text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.4)]">
              <Car className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-100">Cross-Camera Vehicle Re-Identification & Journey Reconstructor</h3>
              <p className="text-[11px] text-slate-400 font-mono">Probabilistic Multi-Signal Spatio-Temporal Association</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Vehicle Selection Chips */}
        <div className="px-5 py-3 border-b border-purple-900/30 bg-[#090a12] flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Tracked Vehicles:</span>
          {sampleVehicles.map(v => (
            <button
              key={v.id}
              onClick={() => setVehicleId(v.id)}
              className={`px-3 py-1 rounded text-xs font-mono transition ${
                vehicleId === v.id
                  ? 'bg-purple-900/80 text-purple-200 border border-purple-500/60 font-bold shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                  : 'bg-[#141624] text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {trajectory && (
            <>
              {/* Meta Summary Card */}
              <div className="bg-[#121422] border border-purple-900/50 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-purple-400 font-mono font-bold uppercase">
                    GLOBAL VEHICLE ID: {trajectory.global_vehicle_id}
                  </div>
                  <div className="text-base font-bold text-slate-100 mt-0.5">
                    {trajectory.model || 'Toyota Fortuner'} ({trajectory.plate_number})
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-1">
                    First Detected: {trajectory.first_seen} · Duration: {trajectory.total_travel_time_min} min
                  </div>
                </div>

                <div className="text-right font-mono">
                  <div className="text-[10px] text-slate-400">FINAL MATCH SCORE</div>
                  <div className="text-2xl font-bold text-emerald-400">
                    {Math.round(matching.final_confidence_score * 100)}%
                  </div>
                  <div className="text-[9px] text-emerald-300">HIGH FIDELITY MATCH</div>
                </div>
              </div>

              {/* Multi-Signal Breakdown Card (From Page 3 of PDF) */}
              <div className="bg-[#121422] border border-purple-900/50 rounded-lg p-4 font-mono text-xs">
                <div className="text-[10px] text-purple-400 font-bold uppercase mb-2.5">
                  Multi-Signal Probabilistic Weighting (PDF Specification)
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <div className="bg-[#0a0b12] p-2 rounded border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-400 text-[11px]">Plate similarity:</span>
                    <span className="text-emerald-400 font-bold">{matching.plate_similarity}</span>
                  </div>
                  <div className="bg-[#0a0b12] p-2 rounded border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-400 text-[11px]">Vehicle type:</span>
                    <span className="text-emerald-400 font-bold">{matching.vehicle_type_match}</span>
                  </div>
                  <div className="bg-[#0a0b12] p-2 rounded border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-400 text-[11px]">Appearance/features:</span>
                    <span className="text-emerald-400 font-bold">{matching.appearance_features}</span>
                  </div>
                  <div className="bg-[#0a0b12] p-2 rounded border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-400 text-[11px]">Travel time plausibility:</span>
                    <span className="text-emerald-400 font-bold">{matching.travel_time_plausibility}</span>
                  </div>
                  <div className="bg-[#0a0b12] p-2 rounded border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-400 text-[11px]">Route consistency:</span>
                    <span className="text-emerald-400 font-bold">{matching.route_consistency}</span>
                  </div>
                  <div className="bg-purple-950/60 p-2 rounded border border-purple-600/50 flex justify-between items-center">
                    <span className="text-purple-300 text-[11px] font-bold">Final score:</span>
                    <span className="text-purple-200 font-bold text-sm">{matching.final_confidence_score}</span>
                  </div>
                </div>
              </div>

              {/* Camera Sequence Timeline (CAM01 -> CAM03 -> CAM06 -> CAM07) */}
              <div className="bg-[#121422] border border-purple-900/50 rounded-lg p-4 font-mono text-xs">
                <div className="text-[10px] text-purple-400 font-bold uppercase mb-3">
                  Reconstructed Camera Sighting Sequence
                </div>

                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-purple-800/60">
                  {trajectory.camera_sequence?.map((hop: any, idx: number) => (
                    <div key={idx} className="relative group">
                      {/* Node Bullet */}
                      <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-purple-600 border-2 border-[#121422] shadow-[0_0_8px_#a855f7]" />
                      
                      {/* Sighting Details */}
                      <div className="bg-[#0a0b12] p-3 rounded-lg border border-purple-950 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-purple-300 font-bold">{hop.camera_id}</span>
                            <span className="text-slate-300">{hop.camera_name}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-3">
                            <span>Time: <strong className="text-slate-300">{hop.timestamp}</strong></span>
                            <span>Speed: <strong className="text-emerald-400">{hop.speed_kmh} km/h</strong></span>
                            <span>Lane: {hop.lane}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded">
                            {Math.round(hop.confidence * 100)}% DET
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

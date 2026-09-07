'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { TrendingUp, X, Cpu, Clock, BarChart3, ShieldCheck } from 'lucide-react'

interface PredictionAnalyticsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PredictionAnalyticsModal({ isOpen, onClose }: PredictionAnalyticsModalProps) {
  const [predictions, setPredictions] = useState<any[]>([])

  useEffect(() => {
    if (isOpen) {
      axios.get('/api/predictions')
        .then(res => setPredictions(res.data))
        .catch(() => {})
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 select-none">
      <div className="w-full max-w-3xl bg-[#0d0e17] border border-purple-500/70 rounded-xl shadow-[0_0_35px_rgba(124,58,237,0.35)] flex flex-col max-h-[90vh] overflow-hidden font-sans">
        
        {/* Header */}
        <div className="h-14 border-b border-purple-900/40 px-5 flex items-center justify-between bg-[#111320] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-950/80 border border-purple-500/60 flex items-center justify-center text-purple-300">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-100">Supervised Time-Series Traffic Prediction & Forecasting</h3>
              <p className="text-[11px] text-slate-400 font-mono">5, 15, and 30-Minute Horizons · XGBoost vs. LSTM vs. Temporal Transformer</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {/* Horizon Forecast Cards */}
          <div className="space-y-3">
            <div className="text-xs font-mono text-purple-400 font-bold uppercase tracking-wider">
              Road-Level Congestion Horizon Forecasts
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
              {predictions.map((p) => (
                <div key={p.road_id} className="bg-[#121422] border border-purple-900/40 rounded-xl p-3.5 space-y-2.5">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] text-slate-500">{p.road_id}</span>
                      <h4 className="text-slate-200 font-bold text-xs">{p.road_name}</h4>
                    </div>
                    <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-600/40 px-1.5 py-0.5 rounded">
                      Now: {p.current_congestion}% ({p.current_speed_kmh} km/h)
                    </span>
                  </div>

                  {/* 3 Horizon Pills */}
                  <div className="grid grid-cols-3 gap-1.5 text-center">
                    <div className="bg-[#0a0b12] p-1.5 rounded border border-slate-800">
                      <div className="text-[8px] text-slate-400 uppercase">5 MIN</div>
                      <div className="text-slate-100 font-bold text-sm">{p.predictions['5_min'].congestion}%</div>
                      <div className="text-[9px] text-amber-400">{p.predictions['5_min'].delta}</div>
                    </div>

                    <div className="bg-[#0a0b12] p-1.5 rounded border border-slate-800">
                      <div className="text-[8px] text-slate-400 uppercase">15 MIN</div>
                      <div className="text-slate-100 font-bold text-sm">{p.predictions['15_min'].congestion}%</div>
                      <div className="text-[9px] text-red-400">{p.predictions['15_min'].delta}</div>
                    </div>

                    <div className="bg-[#0a0b12] p-1.5 rounded border border-slate-800">
                      <div className="text-[8px] text-slate-400 uppercase">30 MIN</div>
                      <div className="text-slate-100 font-bold text-sm">{p.predictions['30_min'].congestion}%</div>
                      <div className="text-[9px] text-purple-400">{p.predictions['30_min'].delta}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Model Benchmark Table (PDF Page 8 Specification) */}
          <div className="bg-[#121422] border border-purple-900/40 rounded-xl p-4 font-mono text-xs">
            <div className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" />
              <span>Model Architecture Benchmarking (MAE, RMSE, MAPE)</span>
            </div>

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-purple-900/40 text-[10px] text-slate-500 uppercase">
                  <th className="py-1.5">Model Pipeline</th>
                  <th>Horizon</th>
                  <th>MAE</th>
                  <th>RMSE</th>
                  <th>MAPE</th>
                  <th>Inference Latency</th>
                </tr>
              </thead>
              <tbody className="text-slate-300 text-xs">
                <tr className="border-b border-slate-800/60">
                  <td className="py-2 text-slate-400">Baseline (Historical Average)</td>
                  <td>15 min</td>
                  <td>6.4</td>
                  <td>8.9</td>
                  <td>11.2%</td>
                  <td>&lt;1 ms</td>
                </tr>
                <tr className="border-b border-slate-800/60">
                  <td className="py-2 text-slate-300">XGBoost Regressor</td>
                  <td>15 min</td>
                  <td>3.1</td>
                  <td>4.5</td>
                  <td>5.8%</td>
                  <td>4.2 ms</td>
                </tr>
                <tr className="border-b border-slate-800/60">
                  <td className="py-2 text-slate-300">LSTM Recurrent Network</td>
                  <td>15 min</td>
                  <td>2.6</td>
                  <td>3.9</td>
                  <td>4.6%</td>
                  <td>12.5 ms</td>
                </tr>
                <tr className="bg-purple-950/40">
                  <td className="py-2 text-purple-300 font-bold">Temporal Transformer Ensemble</td>
                  <td>15 min</td>
                  <td className="text-emerald-400 font-bold">2.1</td>
                  <td className="text-emerald-400 font-bold">3.4</td>
                  <td className="text-emerald-400 font-bold">3.8%</td>
                  <td>18.4 ms</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  )
}

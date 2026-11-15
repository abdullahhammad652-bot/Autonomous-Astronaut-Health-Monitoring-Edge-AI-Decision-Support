import React, { useState } from 'react';
import { Bone, Dumbbell, ShieldCheck, TrendingDown, Calendar, Plus } from 'lucide-react';

export default function MusculoTracker({ astronaut, onLogExercise }) {
  const [exerciseLogged, setExerciseLogged] = useState(false);

  const handleQuickLog = () => {
    setExerciseLogged(true);
    setTimeout(() => setExerciseLogged(false), 3000);
  };

  return (
    <div className="section-container">
      <div className="section-header">
        <div>
          <h2>MUSCULOSKELETAL & MICROGRAVITY DEGRADATION</h2>
          <p className="subtext">Bone Mineral Density (BMD) Loss, DEXA Analysis & Resistive Countermeasures (ARED/T2)</p>
        </div>
        <button className="btn-primary flex-center" onClick={handleQuickLog}>
          <Plus size={16} /> LOG COMPLETED ARED / T2 SESSION
        </button>
      </div>

      {exerciseLogged && (
        <div className="banner-success">
          <ShieldCheck size={18} /> Daily 2.5-hour countermeasure recorded! Bone mineral turnover marker stabilized.
        </div>
      )}

      <div className="musculo-grid">
        {/* Bone Mineral Density Loss Card */}
        <div className="hud-panel">
          <div className="panel-header">
            <span className="panel-title"><Bone size={18} className="text-cyan" /> BONE MINERAL DENSITY (BMD) SCAN</span>
            <span className="badge-meta">DEXA SCAN PROJECTION</span>
          </div>

          <div className="bone-stats-row">
            <div className="bone-stat-item">
              <span className="b-label">Femoral Neck Loss</span>
              <span className="b-val text-amber">-{astronaut.boneMineralLoss}%</span>
              <span className="b-sub">Target: &lt; 1.0%/month</span>
            </div>
            <div className="bone-stat-item">
              <span className="b-label">Lumbar Spine (L1-L4)</span>
              <span className="b-val text-amber">-{(astronaut.boneMineralLoss * 0.85).toFixed(1)}%</span>
              <span className="b-sub">T-Score: -1.2 (Osteopenia)</span>
            </div>
            <div className="bone-stat-item">
              <span className="b-label">Soleus Muscle Mass</span>
              <span className="b-val text-red">-{astronaut.muscleMassLoss}%</span>
              <span className="b-sub">Slow-twitch postural fibers</span>
            </div>
          </div>

          <div className="bone-chart-simulation">
            <div className="chart-header-row">
              <span>Mission Timeline Bone Loss Projection</span>
              <span className="text-cyan">With ARED Countermeasure vs Unmitigated Zero-G</span>
            </div>
            <div className="bars-comparison">
              <div className="comp-row">
                <span className="comp-name">Unmitigated Microgravity (6 Mo):</span>
                <div className="bar-track">
                  <div className="bar-fill fill-red" style={{ width: '70%' }}></div>
                </div>
                <span className="text-red font-mono">-10.5% BMD</span>
              </div>
              <div className="comp-row">
                <span className="comp-name">AstroPulse Active Protocol:</span>
                <div className="bar-track">
                  <div className="bar-fill fill-cyan" style={{ width: `${astronaut.boneMineralLoss * 6}%` }}></div>
                </div>
                <span className="text-cyan font-mono">-{astronaut.boneMineralLoss}% BMD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Countermeasures Protocol */}
        <div className="hud-panel">
          <div className="panel-header">
            <span className="panel-title"><Dumbbell size={18} className="text-emerald" /> PRESCRIBED COUNTERMEASURE SCHEDULE</span>
            <span className="badge-meta">NASA EXPLORATION PROTOCOL</span>
          </div>

          <div className="exercise-checklist">
            <div className="ex-item completed">
              <span className="ex-icon">✓</span>
              <div className="ex-info">
                <div className="ex-title">ARED Advanced Resistive Exercise Device</div>
                <div className="ex-desc">Squats (3x10 at 160kg equiv), Deadlifts (3x10), Heel raises.</div>
              </div>
              <span className="badge-done">COMPLETED</span>
            </div>

            <div className="ex-item completed">
              <span className="ex-icon">✓</span>
              <div className="ex-info">
                <div className="ex-title">T2 Bungee-Harnessed Treadmill</div>
                <div className="ex-desc">30 min interval running at 75% VO2 max with harness load.</div>
              </div>
              <span className="badge-done">COMPLETED</span>
            </div>

            <div className="ex-item">
              <span className="ex-icon pending">○</span>
              <div className="ex-info">
                <div className="ex-title">CEVIS Cycle Ergometer & LBNP</div>
                <div className="ex-desc">30 min cycling combined with Lower Body Negative Pressure suit.</div>
              </div>
              <span className="badge-pending">SCHEDULED 16:00</span>
            </div>

            <div className="ex-item">
              <span className="ex-icon pending">○</span>
              <div className="ex-info">
                <div className="ex-title">Biomedical Supplement Dosing</div>
                <div className="ex-desc">Alendronate (oral bisphosphonate) + 800 IU Vitamin D3 + 1200mg Calcium.</div>
              </div>
              <span className="badge-pending">EVENING DOSE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

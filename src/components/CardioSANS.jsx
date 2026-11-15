import React from 'react';
import { Eye, Heart, Activity, Droplets, AlertCircle, ShieldAlert } from 'lucide-react';
import TelemetryCanvas from './TelemetryCanvas';

export default function CardioSANS({ astronaut }) {
  // Orthostatic intolerance risk score
  const orthostaticRisk = Math.min(100, Math.round((astronaut.vo2MaxDrop * 2.2) + (100 - astronaut.hrvRMSSD) * 0.4));

  return (
    <div className="section-container">
      <div className="section-header">
        <div>
          <h2>CARDIOVASCULAR & SANS (NEURO-OCULAR) MONITOR</h2>
          <p className="subtext">Cephalad Fluid Redistribution, Orthostatic Landing Risk, and Intracranial Pressure Telemetry</p>
        </div>
      </div>

      <div className="cardio-sans-grid">
        {/* Cardiovascular Hemodynamics */}
        <div className="hud-panel">
          <div className="panel-header">
            <span className="panel-title"><Heart size={18} className="text-red" /> CARDIAC OUTPUT & HEMODYNAMIC SHIFTS</span>
            <span className="badge-meta">CONTINUOUS BIOMONITORING</span>
          </div>

          <div className="vital-stats-grid">
            <div className="v-card">
              <span className="v-lbl">Resting Heart Rate</span>
              <span className="v-val text-cyan">{astronaut.restingHeartRate} <span className="unit">BPM</span></span>
              <span className="v-sub">Autonomic Target: 60-80</span>
            </div>
            <div className="v-card">
              <span className="v-lbl">HRV (RMSSD)</span>
              <span className={`v-val ${astronaut.hrvRMSSD < 35 ? 'text-amber' : 'text-emerald'}`}>
                {astronaut.hrvRMSSD} <span className="unit">ms</span>
              </span>
              <span className="v-sub">Parasympathetic Tone</span>
            </div>
            <div className="v-card">
              <span className="v-lbl">Blood Pressure</span>
              <span className="v-val text-cyan">{astronaut.bloodPressureSys}/{astronaut.bloodPressureDia} <span className="unit">mmHg</span></span>
              <span className="v-sub">Mean Arterial: 95 mmHg</span>
            </div>
            <div className="v-card">
              <span className="v-lbl">Aerobic VO2 Max</span>
              <span className="v-val text-amber">-{astronaut.vo2MaxDrop}%</span>
              <span className="v-sub">Deconditioning vs Pre-Flight</span>
            </div>
          </div>

          <TelemetryCanvas heartRate={astronaut.restingHeartRate} hrv={astronaut.hrvRMSSD} />

          {/* Orthostatic Intolerance landing predictor */}
          <div className="orthostatic-panel">
            <div className="ortho-header">
              <span className="ortho-title">Mars/Earth Landing Orthostatic Intolerance Risk</span>
              <span className={`ortho-badge ${orthostaticRisk > 50 ? 'badge-alert' : 'badge-ok'}`}>
                {orthostaticRisk > 50 ? 'ELEVATED SYNCOPE RISK' : 'LOW RISK'}
              </span>
            </div>
            <div className="progress-bar-bg">
              <div
                className={`progress-bar-fill ${orthostaticRisk > 50 ? 'fill-red' : 'fill-cyan'}`}
                style={{ width: `${orthostaticRisk}%` }}
              ></div>
            </div>
            <p className="ortho-desc">
              Pre-reentry countermeasure required: 1.0L isotonic saline solution fluid loading + anti-g compression garment deployment prior to gravity transition.
            </p>
          </div>
        </div>

        {/* SANS: Spaceflight-Associated Neuro-ocular Syndrome */}
        <div className="hud-panel">
          <div className="panel-header">
            <span className="panel-title"><Eye size={18} className="text-cyan" /> SANS (SPACEFLIGHT NEURO-OCULAR SYNDROME)</span>
            <span className="badge-meta">OPTICAL COHERENCE TOMOGRAPHY (OCT)</span>
          </div>

          <div className="sans-overview">
            <div className="sans-scale-box">
              <span className="s-label">Cephalad Fluid Shift Index</span>
              <div className="s-val text-amber">{astronaut.cephaladFluidShift} / 10</div>
              <p className="s-sub">Venous engorgement and facial edema resulting from absence of hydrostatic pressure gradient.</p>
            </div>

            <div className="sans-findings-list">
              <div className="finding-row">
                <span className="f-title">Optic Nerve Sheath Diameter (ONSD)</span>
                <span className="f-val text-amber">5.9 mm (Upper Normal &lt; 5.8mm)</span>
              </div>
              <div className="finding-row">
                <span className="f-title">Choroidal Folds & Papilledema</span>
                <span className="f-val text-emerald">Frisén Grade 0 (No optic disc edema)</span>
              </div>
              <div className="finding-row">
                <span className="f-title">Globe Flattening & Hyperopic Shift</span>
                <span className="f-val text-cyan">+0.75 Diopters (Mild)</span>
              </div>
              <div className="finding-row">
                <span className="f-title">Intracranial Pressure (ICP) Surrogate</span>
                <span className="f-val text-amber">18.5 cm H2O (Elevated)</span>
              </div>
            </div>

            <div className="sans-action-box">
              <h4>Prescribed Neuro-Ocular Countermeasure:</h4>
              <p>
                <strong>Lower Body Negative Pressure (LBNP):</strong> Prescribe 120 minutes at -25 mmHg cabin cycle to draw 800ml cephalad blood volume down into venous capacitance vessels of the lower extremities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

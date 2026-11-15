import React, { useState } from 'react';
import { Zap, ShieldAlert, ShieldCheck, AlertTriangle, Info, Radio, RefreshCw } from 'lucide-react';

export default function RadiationTracker({ astronaut, speActive, onToggleSPE }) {
  const [shelterActive, setShelterActive] = useState(false);
  const careerLimit = 600; // mSv
  const percentUsed = ((astronaut.cumulativeRadiation / careerLimit) * 100).toFixed(1);
  
  // Real-time dose rate
  const currentRate = speActive ? 3.85 : astronaut.dailyRadiationRate / 24;

  return (
    <div className="section-container">
      <div className="section-header">
        <div>
          <h2>DEEP-SPACE IONIZING RADIATION TELEMETRY</h2>
          <p className="subtext">Galactic Cosmic Radiation (GCR) & Solar Particle Event (SPE) Monitoring Module</p>
        </div>
        <div className="btn-group">
          <button
            className={`btn-drill ${speActive ? 'btn-red-pulse' : 'btn-outline-amber'}`}
            onClick={onToggleSPE}
          >
            <AlertTriangle size={16} />
            {speActive ? 'DEACTIVATE SPE DRILL' : 'SIMULATE SOLAR PARTICLE EVENT (SPE)'}
          </button>
        </div>
      </div>

      {speActive && (
        <div className="spe-alert-panel">
          <ShieldAlert size={28} className="blink text-red" />
          <div className="spe-text">
            <h3>CORONAL MASS EJECTION / SOLAR FLUX DETECTED</h3>
            <p>Active sensor flux: High-energy protons exceeding 100 MeV. Unshielded cabin rate at 3.85 mSv/hr. Immediate storm shelter entry mandatory.</p>
          </div>
          <button
            className={`btn-shelter-toggle ${shelterActive ? 'shelter-on' : 'shelter-off'}`}
            onClick={() => setShelterActive(!shelterActive)}
          >
            {shelterActive ? 'SHELTER ACTIVE (ATTENUATION: 92%)' : 'DEPLOY STORM SHELTER WATER WALLS'}
          </button>
        </div>
      )}

      <div className="radiation-grid">
        {/* Career Exposure Bar */}
        <div className="hud-panel">
          <div className="panel-header">
            <span className="panel-title"><Zap size={18} className="text-amber" /> NASA LIFETIME CAREER RADIATION LIMIT</span>
            <span className="badge-meta">MAX ALLOWABLE: 600 mSv</span>
          </div>

          <div className="radiation-bar-wrapper">
            <div className="progress-bar-bg huge">
              <div
                className="progress-bar-fill fill-amber"
                style={{ width: `${Math.min(100, percentUsed)}%` }}
              ></div>
            </div>
            <div className="radiation-ticks">
              <span>0 mSv</span>
              <span>150 mSv (ISS Norm)</span>
              <span>300 mSv (Moon)</span>
              <span>450 mSv</span>
              <span className="text-red">600 mSv (Career Cap)</span>
            </div>
          </div>

          <div className="rad-metrics-summary">
            <div className="rad-box">
              <span className="r-label">Cumulative Mission Dose</span>
              <span className="r-val text-amber">{astronaut.cumulativeRadiation.toFixed(2)} mSv</span>
            </div>
            <div className="rad-box">
              <span className="r-label">Current Ambient Flux Rate</span>
              <span className={`r-val ${speActive ? 'text-red' : 'text-cyan'}`}>
                {shelterActive ? (currentRate * 0.08).toFixed(3) : currentRate.toFixed(3)} mSv/hr
              </span>
            </div>
            <div className="rad-box">
              <span className="r-label">Estimated Days to Career Limit</span>
              <span className="r-val text-emerald">{Math.round((careerLimit - astronaut.cumulativeRadiation) / (astronaut.dailyRadiationRate || 0.85))} Days</span>
            </div>
          </div>
        </div>

        {/* Biological Hazard Projection */}
        <div className="hud-panel">
          <div className="panel-header">
            <span className="panel-title"><Info size={18} className="text-cyan" /> RADIOBIOLOGICAL CELLULAR RISK PROJECTION</span>
            <span className="badge-meta">HZE HEAVY ION DAMAGE</span>
          </div>

          <div className="bio-hazard-list">
            <div className="hazard-row">
              <span className="hazard-title">Radiation-Induced Carcinogenesis REID</span>
              <span className="hazard-val text-amber">+3.4% Lifetime Excess</span>
            </div>
            <div className="hazard-row">
              <span className="hazard-title">DNA Double-Strand Breaks (DSBs / Cell)</span>
              <span className="hazard-val text-cyan">2.14 DSB / Lymphocyte</span>
            </div>
            <div className="hazard-row">
              <span className="hazard-title">Microvascular Endothelial Degradation</span>
              <span className="hazard-val text-cyan">Low - Compensated</span>
            </div>
            <div className="hazard-row">
              <span className="hazard-title">Acute Radiation Syndrome (ARS) Probability</span>
              <span className={`hazard-val ${speActive && !shelterActive ? 'text-red font-bold' : 'text-emerald'}`}>
                {speActive && !shelterActive ? 'ELEVATED RISK (18%)' : '0.00% (NOMINAL)'}
              </span>
            </div>
          </div>

          <div className="prophylaxis-box">
            <h4>Prescribed Radioprotectant Prophylaxis:</h4>
            <ul>
              <li>Amifostine analog free-radical scavenger: 200mg daily.</li>
              <li>Lipophilic antioxidant regimen (Curcumin, CoQ10, N-Acetylcysteine).</li>
              <li>Polyethylene hydrogen-rich composite sleep-quarters lining verified.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

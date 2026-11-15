import React, { useState } from 'react';
import { Shield, Zap, Heart, Moon, Brain, Bone, AlertOctagon, CheckCircle2, ChevronRight, Activity, ArrowUpRight, Download, FileText, Share2, FileBadge } from 'lucide-react';
import TelemetryCanvas from './TelemetryCanvas';
import HealthSuggestions from './HealthSuggestions';
import { generateHealthPDF } from '../utils/generateHealthPDF';

export default function CommandDashboard({ astronaut, prediction, onTriggerSPE, speActive, onSelectTab }) {
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);

  // Build vitals object for PDF + HealthSuggestions
  const vitals = {
    heartRate: astronaut.restingHeartRate,
    hrv: astronaut.hrvRMSSD,
    bpSystolic: astronaut.bloodPressureSys,
    bpDiastolic: astronaut.bloodPressureDia,
    radiation: astronaut.dailyRadiationRate,
    sleepDebt: astronaut.sleepDebt,
    boneLoss: astronaut.boneMineralLoss,
    pvtScore: astronaut.pvtReactionTime,
    sansScore: astronaut.cephaladFluidShift,
    spo2: astronaut.spo2 ?? 98,
  };

  // Generate & Download Health Report PDF
  const handleExportPDF = async () => {
    setPdfGenerating(true);
    try {
      await generateHealthPDF({
        vitals,
        prediction,
        astronaut,
        missionDay: astronaut.missionDay,
        contributions: prediction.contributions,
      });
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 4000);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('PDF generation error: ' + err.message);
    }
    setPdfGenerating(false);
  };

  // Generate & Download Official NASA Telemetry Packet (JSON)
  const handleExportTelemetry = () => {
    const flightTelemetryPacket = {
      mission: astronaut.habitat || "Artemis VII Deep Space Transit",
      crewMember: astronaut.name,
      crewId: astronaut.crewId,
      timestampUTC: new Date().toISOString(),
      missionDaySOL: astronaut.missionDay,
      healthReadinessScore: 100 - prediction.score,
      triageClassification: prediction.category,
      biometrics: {
        restingHeartRateBPM: astronaut.restingHeartRate,
        heartRateVariabilityRMSSD: astronaut.hrvRMSSD,
        bloodPressure: `${astronaut.bloodPressureSys}/${astronaut.bloodPressureDia} mmHg`,
        vo2MaxDropPct: astronaut.vo2MaxDrop,
        cephaladFluidShiftScale: astronaut.cephaladFluidShift,
        boneMineralDensityLossPct: astronaut.boneMineralLoss,
        muscleMassLossPct: astronaut.muscleMassLoss,
        wbcLeukocyteCount: astronaut.wbcCount,
        pvtReactionTimeMS: astronaut.pvtReactionTime,
        sleepDebtHours: astronaut.sleepDebt
      },
      radiationDosimetry: {
        cumulativeRadiationDoseMSv: astronaut.cumulativeRadiation,
        ambientCabinFluxMSvPerDay: astronaut.dailyRadiationRate,
        careerLimitPercentage: ((astronaut.cumulativeRadiation / 600) * 100).toFixed(2),
        speActiveAlert: speActive
      },
      explainableAIContributions: prediction.contributions,
      prescribedAutonomousCountermeasures: prediction.recommendedCountermeasures,
      complianceStandard: "NASA-STD-3001 Space Flight Human-System Standard"
    };

    const blob = new Blob([JSON.stringify(flightTelemetryPacket, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `NASA_TELEMETRY_${astronaut.crewId}_SOL${astronaut.missionDay}.json`;
    link.click();
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="dashboard-grid">
      {/* Top Banner: Emergency Solar Particle Event or Success Notification */}
      {speActive && (
        <div className="spe-emergency-banner">
          <AlertOctagon size={24} className="banner-icon blink" />
          <div className="banner-content">
            <h4>CRITICAL ALERT: SOLAR PARTICLE EVENT (SPE) IN PROGRESS</h4>
            <p>Radiation dosimeter reading <strong>+3.8 mSv/hr</strong>. Autonomous protocol recommends immediate crew relocation to radiation storm shelter module.</p>
          </div>
          <button className="btn-shelter" onClick={onTriggerSPE}>STAND DOWN DRILL</button>
        </div>
      )}

      {downloadSuccess && (
        <div className="banner-success">
          <CheckCircle2 size={18} /> Official NASA Telemetry Packet (JSON) generated and downloaded for Earth Mission Control queue!
        </div>
      )}

      {/* Hero Section: ML Health Readiness Dial + Telemetry Summary */}
      <div className="hud-panel main-score-panel">
        <div className="panel-header">
          <span className="panel-title">
            <Activity size={18} className="text-cyan" /> AUTONOMOUS MULTI-SYSTEM HEALTH READINESS (AHRS)
          </span>
          <div className="flex-center" style={{ gap: '8px' }}>
            <button className="btn-export-pdf" onClick={handleExportPDF} disabled={pdfGenerating} title="Export Health Report (PDF)">
              <FileBadge size={13} /> {pdfGenerating ? 'GENERATING PDF…' : 'EXPORT HEALTH REPORT (PDF)'}
            </button>
            <button className="btn-export-telemetry" onClick={handleExportTelemetry} title="Export NASA Flight Health Packet">
              <Download size={13} /> EXPORT FLIGHT TELEMETRY (JSON)
            </button>
            <span className="badge-model">EDGE ML: MS-DPT v2.4 (ACCURACY: 94.2%)</span>
          </div>
        </div>

        <div className="score-layout">
          <div className="score-dial-wrapper">
            <div className="circular-progress" style={{
              background: `conic-gradient(${prediction.statusColor} ${prediction.score * 3.6}deg, rgba(255,255,255,0.06) 0deg)`
            }}>
              <div className="inner-circle">
                <span className="score-number" style={{ color: prediction.statusColor }}>{100 - prediction.score}</span>
                <span className="score-unit">/ 100</span>
                <span className="score-subtext">READINESS</span>
              </div>
            </div>
            <div className="score-status-badge" style={{ borderColor: prediction.statusColor, color: prediction.statusColor }}>
              {prediction.category}
            </div>
          </div>

          <div className="score-details">
            <h3 className="crew-name">{astronaut.name} <span className="crew-id">[{astronaut.crewId}]</span></h3>
            <p className="summary-text">{prediction.summary}</p>

            <div className="quick-stats-row">
              <div className="stat-pill">
                <span className="lbl">Cumulative Dose</span>
                <span className={`val ${astronaut.cumulativeRadiation > 250 ? 'text-amber' : 'text-cyan'}`}>{astronaut.cumulativeRadiation.toFixed(1)} mSv</span>
              </div>
              <div className="stat-pill">
                <span className="lbl">Resting HRV</span>
                <span className={`val ${astronaut.hrvRMSSD < 40 ? 'text-amber' : 'text-emerald'}`}>{astronaut.hrvRMSSD} ms</span>
              </div>
              <div className="stat-pill">
                <span className="lbl">Sleep Deficit</span>
                <span className={`val ${astronaut.sleepDebt > 6 ? 'text-amber' : 'text-cyan'}`}>{astronaut.sleepDebt} hrs</span>
              </div>
              <div className="stat-pill">
                <span className="lbl">Bone Loss Rate</span>
                <span className="val text-amber">-{astronaut.boneMineralLoss}%</span>
              </div>
            </div>

            {/* Live Telemetry Waveform */}
            <TelemetryCanvas heartRate={astronaut.restingHeartRate} hrv={astronaut.hrvRMSSD} />
          </div>
        </div>
      </div>

      {/* Row of Spaceflight Health Domain Cards */}
      <div className="domain-cards-grid">
        {/* 1. Radiation */}
        <div className="domain-card" onClick={() => onSelectTab('radiation')}>
          <div className="domain-card-header">
            <span className="domain-title"><Zap size={16} className="text-amber" /> Space Radiation</span>
            <span className={`status-tag ${astronaut.cumulativeRadiation > 300 ? 'status-alert' : 'status-ok'}`}>
              {astronaut.cumulativeRadiation > 300 ? 'HIGH ACCUMULATION' : 'MONITORED'}
            </span>
          </div>
          <div className="domain-value">{astronaut.cumulativeRadiation.toFixed(1)} <span className="unit">mSv</span></div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill fill-amber" style={{ width: `${(astronaut.cumulativeRadiation / 600) * 100}%` }}></div>
          </div>
          <p className="domain-subtext">{((astronaut.cumulativeRadiation / 600) * 100).toFixed(1)}% of NASA Career Limit (600 mSv)</p>
          <div className="card-footer-link">Detailed Dosimeter Analysis <ChevronRight size={14} /></div>
        </div>

        {/* 2. Cardiovascular & Fluid Shift */}
        <div className="domain-card" onClick={() => onSelectTab('cardio')}>
          <div className="domain-card-header">
            <span className="domain-title"><Heart size={16} className="text-red" /> Cardiovascular & Fluid</span>
            <span className="status-tag status-ok">HEMODYNAMICS OK</span>
          </div>
          <div className="domain-value">{astronaut.restingHeartRate} <span className="unit">BPM</span></div>
          <div className="domain-subtext">BP: {astronaut.bloodPressureSys}/{astronaut.bloodPressureDia} mmHg | Cephalad Shift: {astronaut.cephaladFluidShift}/10</div>
          <p className="domain-subtext text-cyan">Microgravity cephalad redistribution monitored for SANS risk</p>
          <div className="card-footer-link">Cardiovascular & SANS Profiler <ChevronRight size={14} /></div>
        </div>

        {/* 3. Musculoskeletal */}
        <div className="domain-card" onClick={() => onSelectTab('musculo')}>
          <div className="domain-card-header">
            <span className="domain-title"><Bone size={16} className="text-cyan" /> Musculoskeletal Loss</span>
            <span className="status-tag status-warn">BONE DECAY ACTIVE</span>
          </div>
          <div className="domain-value">-{astronaut.boneMineralLoss}% <span className="unit">BMD</span></div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill fill-cyan" style={{ width: `${astronaut.exerciseCompliance}%` }}></div>
          </div>
          <p className="domain-subtext">ARED & T2 Exercise Compliance: {astronaut.exerciseCompliance}%</p>
          <div className="card-footer-link">View Bone & Countermeasure Log <ChevronRight size={14} /></div>
        </div>

        {/* 4. Neuro-Cognitive & Sleep */}
        <div className="domain-card" onClick={() => onSelectTab('cognitive')}>
          <div className="domain-card-header">
            <span className="domain-title"><Brain size={16} className="text-emerald" /> Neuro-Cognitive / PVT</span>
            <span className={`status-tag ${astronaut.pvtReactionTime > 300 ? 'status-alert' : 'status-ok'}`}>
              {astronaut.pvtReactionTime > 300 ? 'FATIGUE DETECTED' : 'ALERT'}
            </span>
          </div>
          <div className="domain-value">{astronaut.pvtReactionTime} <span className="unit">ms</span></div>
          <p className="domain-subtext">PVT Reaction Speed | Sleep Debt: {astronaut.sleepDebt} hrs</p>
          <p className="domain-subtext text-emerald">Circadian alignment in progress</p>
          <div className="card-footer-link">Launch Interactive PVT Test <ChevronRight size={14} /></div>
        </div>
      </div>

      {/* Split Bottom: Explainable AI Driver Breakdown + Prescribed Countermeasures */}
      <div className="bottom-split-grid">
        {/* Explainable AI */}
        <div className="hud-panel">
          <div className="panel-header">
            <span className="panel-title"><Brain size={17} className="text-cyan" /> EXPLAINABLE AI (XAI) RISK FACTOR ATTRIBUTION</span>
            <span className="badge-meta">SHAP-WEIGHTED INFERENCE</span>
          </div>
          <div className="xai-list">
            {prediction.contributions.map((item, idx) => (
              <div key={idx} className="xai-item">
                <div className="xai-info">
                  <span className="xai-name">{item.name}</span>
                  <span className="xai-val">{item.value} ({item.contribution}% impact)</span>
                </div>
                <div className="progress-bar-bg">
                  <div
                    className={`progress-bar-fill ${item.riskLevel === 'high' ? 'fill-red' : 'fill-cyan'}`}
                    style={{ width: `${Math.min(100, item.contribution * 2.5)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actionable Countermeasures */}
        <div className="hud-panel">
          <div className="panel-header">
            <span className="panel-title"><Shield size={17} className="text-emerald" /> AUTONOMOUS CLINICAL COUNTERMEASURE PROTOCOLS</span>
            <span className="badge-meta">NASA-STD-3001 COMPLIANT</span>
          </div>
          <div className="countermeasure-list">
            {prediction.recommendedCountermeasures.map((cm, idx) => (
              <div key={idx} className={`countermeasure-card urgency-${cm.urgency.toLowerCase()}`}>
                <div className="cm-header">
                  <span className="cm-system">{cm.system}</span>
                  <span className={`cm-urgency-badge badge-${cm.urgency.toLowerCase()}`}>{cm.urgency} PRIORITY</span>
                </div>
                <p className="cm-action">{cm.action}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Health Recommendations & Actionable Countermeasures */}
      <HealthSuggestions vitals={vitals} prediction={prediction} astronaut={astronaut} />
    </div>
  );
}

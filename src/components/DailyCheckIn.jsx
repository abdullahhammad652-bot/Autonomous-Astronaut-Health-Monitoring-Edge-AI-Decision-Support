import React, { useState } from 'react';
import { ClipboardList, CheckCircle2, User, Heart, Zap, Moon, Bone, Droplets, AlertTriangle } from 'lucide-react';

export default function DailyCheckIn({ astronaut, setAstronaut, onComplete }) {
  const [formData, setFormData] = useState({
    name: astronaut.name,
    restingHeartRate: astronaut.restingHeartRate,
    bloodPressureSys: astronaut.bloodPressureSys,
    bloodPressureDia: astronaut.bloodPressureDia,
    hrvRMSSD: astronaut.hrvRMSSD,
    cumulativeRadiation: astronaut.cumulativeRadiation,
    dailyRadiationRate: astronaut.dailyRadiationRate,
    sleepDuration: 6.5,
    sleepDebt: astronaut.sleepDebt,
    boneMineralLoss: astronaut.boneMineralLoss,
    cephaladFluidShift: astronaut.cephaladFluidShift,
    notes: '',
    symptoms: {
      headFullness: false,
      blurredVision: false,
      dizzinessStanding: false,
      muscleSoreness: false,
      nausea: false
    }
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSymptomToggle = (symptomKey) => {
    setFormData(prev => ({
      ...prev,
      symptoms: {
        ...prev.symptoms,
        [symptomKey]: !prev.symptoms[symptomKey]
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Calculate fluid shift based on checked symptoms
    let fluidShift = parseFloat(formData.cephaladFluidShift);
    if (formData.symptoms.headFullness) fluidShift = Math.max(fluidShift, 6);
    if (formData.symptoms.blurredVision) fluidShift = Math.max(fluidShift, 7);

    // Update global astronaut state used by ML model
    setAstronaut(prev => ({
      ...prev,
      name: formData.name,
      restingHeartRate: parseFloat(formData.restingHeartRate) || prev.restingHeartRate,
      bloodPressureSys: parseFloat(formData.bloodPressureSys) || prev.bloodPressureSys,
      bloodPressureDia: parseFloat(formData.bloodPressureDia) || prev.bloodPressureDia,
      hrvRMSSD: parseFloat(formData.hrvRMSSD) || prev.hrvRMSSD,
      cumulativeRadiation: parseFloat(formData.cumulativeRadiation) || prev.cumulativeRadiation,
      sleepDebt: parseFloat(formData.sleepDebt) || prev.sleepDebt,
      boneMineralLoss: parseFloat(formData.boneMineralLoss) || prev.boneMineralLoss,
      cephaladFluidShift: fluidShift,
    }));

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      if (onComplete) onComplete();
    }, 1800);
  };

  return (
    <div className="section-container">
      <div className="section-header">
        <div>
          <h2>ASTRONAUT DAILY MEDICAL CHECK-IN & TELEMETRY LOG</h2>
          <p className="subtext">Manual Data Entry & Subjective Clinical Assessment for Deep-Space Crew</p>
        </div>
      </div>

      {submitted && (
        <div className="banner-success">
          <CheckCircle2 size={20} /> Vitals logged successfully! ML Edge Model recalculated Health Readiness Score.
        </div>
      )}

      <form className="hud-panel daily-checkin-form" onSubmit={handleSubmit}>
        <div className="panel-header">
          <span className="panel-title">
            <ClipboardList size={18} className="text-cyan" /> CREW BIOMETRIC LOGGING FORM
          </span>
          <span className="badge-meta">CREW DATA INPUT PROTOCOL</span>
        </div>

        <div className="form-sections-grid">
          {/* Section 1: Crew & Cardiorespiratory */}
          <div className="form-group-card">
            <h4><Heart size={16} className="text-red" /> Cardiovascular Telemetry</h4>
            
            <div className="input-field">
              <label>Crew Member Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>

            <div className="input-row-2">
              <div className="input-field">
                <label>Resting HR (BPM)</label>
                <input
                  type="number"
                  min="40"
                  max="160"
                  value={formData.restingHeartRate}
                  onChange={(e) => handleChange('restingHeartRate', e.target.value)}
                  required
                />
              </div>
              <div className="input-field">
                <label>Resting HRV (ms)</label>
                <input
                  type="number"
                  min="10"
                  max="120"
                  value={formData.hrvRMSSD}
                  onChange={(e) => handleChange('hrvRMSSD', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-row-2">
              <div className="input-field">
                <label>BP Systolic (mmHg)</label>
                <input
                  type="number"
                  min="80"
                  max="200"
                  value={formData.bloodPressureSys}
                  onChange={(e) => handleChange('bloodPressureSys', e.target.value)}
                  required
                />
              </div>
              <div className="input-field">
                <label>BP Diastolic (mmHg)</label>
                <input
                  type="number"
                  min="50"
                  max="130"
                  value={formData.bloodPressureDia}
                  onChange={(e) => handleChange('bloodPressureDia', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Radiation & Environment */}
          <div className="form-group-card">
            <h4><Zap size={16} className="text-amber" /> Radiation & Sleep Deficit</h4>

            <div className="input-field">
              <label>Cumulative Dosimeter Reading (mSv)</label>
              <input
                type="number"
                step="0.1"
                value={formData.cumulativeRadiation}
                onChange={(e) => handleChange('cumulativeRadiation', e.target.value)}
                required
              />
              <span className="field-hint">Read from personal crew badge dosimeter</span>
            </div>

            <div className="input-row-2">
              <div className="input-field">
                <label>Last Night Sleep (hrs)</label>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  max="12"
                  value={formData.sleepDuration}
                  onChange={(e) => handleChange('sleepDuration', e.target.value)}
                />
              </div>
              <div className="input-field">
                <label>Cumulative Sleep Debt (hrs)</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="30"
                  value={formData.sleepDebt}
                  onChange={(e) => handleChange('sleepDebt', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-field">
              <label>Bone Mineral Density Loss (% estimated)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="20"
                value={formData.boneMineralLoss}
                onChange={(e) => handleChange('boneMineralLoss', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Subjective Symptoms Checklist */}
        <div className="form-symptoms-section">
          <h4><AlertTriangle size={16} className="text-cyan" /> Daily Spaceflight Symptom Self-Reporting</h4>
          <p className="subtext">Select any symptoms experienced in the past 24 hours:</p>

          <div className="symptoms-checklist-grid">
            <label className={`symptom-check-box ${formData.symptoms.headFullness ? 'checked' : ''}`}>
              <input
                type="checkbox"
                checked={formData.symptoms.headFullness}
                onChange={() => handleSymptomToggle('headFullness')}
              />
              <span>Head Fullness / Sinus Congestion (Cephalad Fluid Shift)</span>
            </label>

            <label className={`symptom-check-box ${formData.symptoms.blurredVision ? 'checked' : ''}`}>
              <input
                type="checkbox"
                checked={formData.symptoms.blurredVision}
                onChange={() => handleSymptomToggle('blurredVision')}
              />
              <span>Blurred Vision or Eye Strain (SANS indicator)</span>
            </label>

            <label className={`symptom-check-box ${formData.symptoms.dizzinessStanding ? 'checked' : ''}`}>
              <input
                type="checkbox"
                checked={formData.symptoms.dizzinessStanding}
                onChange={() => handleSymptomToggle('dizzinessStanding')}
              />
              <span>Lightheadedness / Orthostatic Pre-Syncope</span>
            </label>

            <label className={`symptom-check-box ${formData.symptoms.muscleSoreness ? 'checked' : ''}`}>
              <input
                type="checkbox"
                checked={formData.symptoms.muscleSoreness}
                onChange={() => handleSymptomToggle('muscleSoreness')}
              />
              <span>Postural Muscle Atrophy / Spinal Elongation Ache</span>
            </label>

            <label className={`symptom-check-box ${formData.symptoms.nausea ? 'checked' : ''}`}>
              <input
                type="checkbox"
                checked={formData.symptoms.nausea}
                onChange={() => handleSymptomToggle('nausea')}
              />
              <span>Nausea / Space Adaptation Syndrome (SMS)</span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          <button type="submit" className="btn-submit-vitals">
            <CheckCircle2 size={18} /> SUBMIT TO AUTONOMOUS AI HEALTH EVALUATION
          </button>
        </div>
      </form>
    </div>
  );
}

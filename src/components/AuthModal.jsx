import React, { useState } from 'react';
import { 
  Shield, Rocket, UserCheck, Heart, Zap, Bone, Eye, EyeOff, Key, 
  ArrowRight, CheckCircle2, Sparkles, Lock, Mail, User, Activity, 
  Satellite, Fingerprint, ShieldCheck, HelpCircle, ChevronRight
} from 'lucide-react';
import ThemeSwitcher from './ThemeSwitcher';
import BiometricModal from './BiometricModal';

export default function AuthModal({ onLoginSuccess, currentTheme, onThemeChange }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [signupStep, setSignupStep] = useState(1); // 1: credentials, 2: mission, 3: baseline vitals
  const [showPassword, setShowPassword] = useState(false);
  const [showBiometricModal, setShowBiometricModal] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Login form state
  const [loginId, setLoginId] = useState('ARTEMIS-04');
  const [loginPass, setLoginPass] = useState('ApolloMars2026!');

  // Sign up form state
  const [formData, setFormData] = useState({
    name: '',
    crewId: '',
    email: '',
    password: '',
    role: 'Flight Surgeon / Medical Officer',
    mission: 'Artemis VII / Mars Transit Vehicle',
    missionDay: 42,
    age: 36,
    gender: 'female',
    weightKg: 68,
    heightCm: 172,
    // Baseline vitals
    baselineHR: 68,
    baselineHRV: 62,
    priorRadiation: 45.0,
    baselineBoneDensity: 0.0,
    visualAcuity: '20/20 (Uncorrected)'
  });

  const handleInputChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleLoginSubmit = (e) => {
    if (e) e.preventDefault();
    const activeCrew = {
      name: loginId.includes('VANCE') || loginId === 'ARTEMIS-04' ? "Cmdr. Elena Vance" : `Officer ${loginId}`,
      crewId: loginId || "ARTEMIS-04",
      missionDay: 184,
      habitat: "Mars Transit Vehicle / Gateway",
      earthCommsLatency: 14.5,
      cumulativeRadiation: 168.4,
      dailyRadiationRate: 0.85,
      hrvRMSSD: 42,
      restingHeartRate: 74,
      bloodPressureSys: 122,
      bloodPressureDia: 82,
      sleepDebt: 6.5,
      pvtReactionTime: 295,
      vo2MaxDrop: 11.2,
      boneMineralLoss: 4.8,
      muscleMassLoss: 5.2,
      wbcCount: 4.2,
      cephaladFluidShift: 6,
      exerciseCompliance: 88,
    };
    onLoginSuccess(activeCrew);
  };

  const handleBiometricScan = () => {
    setShowBiometricModal(true);
  };

  const handleBiometricSuccess = (scannedCrew) => {
    setShowBiometricModal(false);
    handleLoginSubmit();
  };

  const handleSignupComplete = (e) => {
    e.preventDefault();
    const newProfile = {
      name: formData.name || "Astronaut " + (formData.crewId || "Candidate"),
      crewId: formData.crewId || `CREW-${Math.floor(Math.random() * 900 + 100)}`,
      missionDay: parseInt(formData.missionDay) || 1,
      habitat: formData.mission || "Mars Transit Vehicle",
      earthCommsLatency: formData.mission.includes('Mars') ? 14.5 : 2.5,
      cumulativeRadiation: parseFloat(formData.priorRadiation) || 12.0,
      dailyRadiationRate: 0.85,
      hrvRMSSD: parseInt(formData.baselineHRV) || 60,
      restingHeartRate: parseInt(formData.baselineHR) || 70,
      bloodPressureSys: 120,
      bloodPressureDia: 80,
      sleepDebt: 2.0,
      pvtReactionTime: 235,
      vo2MaxDrop: 3.5,
      boneMineralLoss: 1.2,
      muscleMassLoss: 1.5,
      wbcCount: 6.2,
      cephaladFluidShift: 3,
      exerciseCompliance: 95,
      age: formData.age,
      gender: formData.gender,
      weightKg: formData.weightKg,
      role: formData.role
    };
    onLoginSuccess(newProfile);
  };

  return (
    <div className="pro-auth-viewport">
      <div className="pro-auth-container">
        
        {/* LEFT COLUMN: AEROSPACE MISSION SHOWCASE PANEL */}
        <div className="pro-showcase-panel">
          <div className="showcase-glow-orb"></div>
          
          <div className="showcase-header">
            <div className="nasa-badge-row">
              <span className="nasa-meatball-tag">NASA</span>
              <span className="agency-subtag">DEEP SPACE TELEMETRY NETWORK</span>
            </div>
            <h1 className="showcase-title">ASTROPULSE</h1>
            <p className="showcase-subtitle">Autonomous Astronaut Health Monitoring & Edge AI Decision Support</p>
          </div>

          <div className="showcase-highlights">
            <div className="highlight-feature-card">
              <div className="feat-icon-box bg-cyan"><Activity size={18} /></div>
              <div>
                <h4>Zero-Latency Edge Intelligence</h4>
                <p>On-device neural inference eliminates the 4 to 22-minute communication delay to Earth.</p>
              </div>
            </div>

            <div className="highlight-feature-card">
              <div className="feat-icon-box bg-amber"><Zap size={18} /></div>
              <div>
                <h4>Space Radiation Dosimetry</h4>
                <p>Monitors Galactic Cosmic Radiation & autonomous Solar Particle Event storm shelter drills.</p>
              </div>
            </div>

            <div className="highlight-feature-card">
              <div className="feat-icon-box bg-emerald"><ShieldCheck size={18} /></div>
              <div>
                <h4>NASA-STD-3001 Compliance</h4>
                <p>Enforces Gold-Standard spaceflight medical rules for bone, cardio, SANS, and cognitive health.</p>
              </div>
            </div>
          </div>

          {/* Live Mission Telemetry Status Pill */}
          <div className="showcase-status-dock">
            <div className="status-live-dot"></div>
            <div>
              <span className="dock-title">DEEP SPACE NETWORK (DSN) STATUS: ONLINE</span>
              <span className="dock-sub">ENCRYPTED AES-256 QUANTUM-RESISTANT HANDSHAKE</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: AUTHENTICATION CONSOLE */}
        <div className="pro-form-panel">
          
          {/* Top Switcher & Theme Selector */}
          <div className="pro-auth-header-bar">
            <div className="auth-tab-pills">
              <button 
                type="button"
                className={`tab-pill ${mode === 'login' ? 'active' : ''}`}
                onClick={() => setMode('login')}
              >
                CREW LOGIN
              </button>
              <button 
                type="button"
                className={`tab-pill ${mode === 'signup' ? 'active' : ''}`}
                onClick={() => { setMode('signup'); setSignupStep(1); }}
              >
                ASTRONAUT ENROLLMENT
              </button>
            </div>
            <ThemeSwitcher currentTheme={currentTheme} onThemeChange={onThemeChange} compact={true} />
          </div>

          {/* 1-CLICK HACKATHON QUICK LOGIN BAR */}
          <div className="pro-judge-banner" onClick={() => handleLoginSubmit()}>
            <Sparkles size={16} className="text-cyan animate-pulse" />
            <div className="judge-text">
              <strong>1-CLICK DEMO ACCESS (FOR HACKATHON JUDGES)</strong>
              <span>Bypasses typing; immediately launches flight deck as Cmdr. Elena Vance</span>
            </div>
            <ArrowRight size={16} className="arrow-judge" />
          </div>

          {/* ======================= MODE 1: LOGIN ======================= */}
          {mode === 'login' && (
            <form className="pro-actual-form" onSubmit={handleLoginSubmit}>
              <div className="form-legend">
                <h3>Welcome Back, Astronaut</h3>
                <p>Enter your NASA identification credentials or scan your biometric security key.</p>
              </div>

              <div className="pro-field-group">
                <label><User size={14} className="field-icon text-cyan" /> Crew Callsign / NASA ID</label>
                <div className="pro-input-wrap">
                  <input
                    type="text"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    placeholder="e.g. ARTEMIS-04 or CDR-VANCE"
                    required
                  />
                  <span className="input-affix">ID</span>
                </div>
              </div>

              <div className="pro-field-group">
                <div className="flex-between">
                  <label><Lock size={14} className="field-icon text-cyan" /> Biometric Passkey</label>
                  <span className="forgot-pass" onClick={() => alert("NASA Flight Surgeon Passkey Reset Protocol initiated via Earth DSN queue.")}>
                    Forgot Passkey?
                  </span>
                </div>
                <div className="pro-input-wrap">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    placeholder="Enter security passkey"
                    required
                  />
                  <button 
                    type="button" 
                    className="btn-toggle-eye" 
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="pro-form-row flex-between">
                <label className="checkbox-wrap">
                  <input 
                    type="checkbox" 
                    checked={rememberMe} 
                    onChange={(e) => setRememberMe(e.target.checked)} 
                  />
                  <span>Keep session cached in local spacecraft memory</span>
                </label>
              </div>

              <div className="pro-actions-stack">
                <button type="submit" className="btn-pro-primary">
                  AUTHENTICATE & ENTER COCKPIT <ArrowRight size={17} />
                </button>

                <div className="divider-or"><span>OR SCAN HARDWARE KEY</span></div>

                <button 
                  type="button" 
                  className="btn-biometric-scan"
                  onClick={handleBiometricScan}
                >
                  <Fingerprint size={18} className="text-cyan" />
                  AUTHENTICATE VIA BIOMETRIC SENSOR (TOUCH / RETINA)
                </button>
              </div>
            </form>
          )}

          {/* ======================= MODE 2: SIGNUP ======================= */}
          {mode === 'signup' && (
            <form 
              className="pro-actual-form" 
              onSubmit={signupStep === 3 ? handleSignupComplete : (e) => { e.preventDefault(); setSignupStep(prev => prev + 1); }}
            >
              <div className="form-legend">
                <h3>New Astronaut Medical Enrollment</h3>
                <p>Register crew member and configure baseline parameters for individualized ML health tracking.</p>
              </div>

              {/* Step Navigation Pill Tracker */}
              <div className="pro-stepper-bar">
                <div className={`step-node ${signupStep >= 1 ? 'active' : ''}`}>
                  <span className="node-num">1</span>
                  <span className="node-label">Credentials</span>
                </div>
                <div className="step-connector"></div>
                <div className={`step-node ${signupStep >= 2 ? 'active' : ''}`}>
                  <span className="node-num">2</span>
                  <span className="node-label">Mission</span>
                </div>
                <div className="step-connector"></div>
                <div className={`step-node ${signupStep >= 3 ? 'active' : ''}`}>
                  <span className="node-num">3</span>
                  <span className="node-label">Medical Baseline</span>
                </div>
              </div>

              {/* STEP 1: IDENTITY & ROLE */}
              {signupStep === 1 && (
                <div className="step-view-content">
                  <div className="pro-field-group">
                    <label>Full Name / Military Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Dr. Alex Mercer"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>

                  <div className="input-grid-2">
                    <div className="pro-field-group">
                      <label>Crew Identification Code</label>
                      <input
                        type="text"
                        placeholder="e.g. ART-IX-08"
                        value={formData.crewId}
                        onChange={(e) => handleInputChange('crewId', e.target.value)}
                        required
                      />
                    </div>
                    <div className="pro-field-group">
                      <label>Mission Role</label>
                      <select
                        value={formData.role}
                        onChange={(e) => handleInputChange('role', e.target.value)}
                      >
                        <option>Flight Surgeon / Medical Officer</option>
                        <option>Mission Commander</option>
                        <option>Pilot / Systems Navigator</option>
                        <option>Science & Payload Specialist</option>
                        <option>Flight Engineer</option>
                      </select>
                    </div>
                  </div>

                  <div className="pro-field-group">
                    <label>NASA Space Agency Email</label>
                    <input
                      type="email"
                      placeholder="alex.mercer@nasa.gov"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>

                  <div className="step-btn-row right-align">
                    <button type="submit" className="btn-pro-primary">
                      NEXT: MISSION PROFILE <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: MISSION PROFILE */}
              {signupStep === 2 && (
                <div className="step-view-content">
                  <div className="pro-field-group">
                    <label>Assigned Habitat / Mission Profile</label>
                    <select
                      value={formData.mission}
                      onChange={(e) => handleInputChange('mission', e.target.value)}
                    >
                      <option>Artemis VII / Mars Transit Vehicle (Deep Space)</option>
                      <option>Lunar Gateway Orbital Station</option>
                      <option>Artemis Base Camp (Lunar South Pole)</option>
                      <option>International Space Station (LEO Expedition)</option>
                    </select>
                  </div>

                  <div className="input-grid-3">
                    <div className="pro-field-group">
                      <label>Mission Day (SOL)</label>
                      <input
                        type="number"
                        min="1"
                        max="1000"
                        value={formData.missionDay}
                        onChange={(e) => handleInputChange('missionDay', e.target.value)}
                      />
                    </div>
                    <div className="pro-field-group">
                      <label>Age (Years)</label>
                      <input
                        type="number"
                        min="25"
                        max="65"
                        value={formData.age}
                        onChange={(e) => handleInputChange('age', e.target.value)}
                      />
                    </div>
                    <div className="pro-field-group">
                      <label>Body Mass (kg)</label>
                      <input
                        type="number"
                        min="45"
                        max="120"
                        value={formData.weightKg}
                        onChange={(e) => handleInputChange('weightKg', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="step-btn-row flex-between">
                    <button type="button" className="btn-pro-secondary" onClick={() => setSignupStep(1)}>
                      BACK
                    </button>
                    <button type="submit" className="btn-pro-primary">
                      NEXT: PHYSIOLOGICAL BASELINE <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: MEDICAL BASELINE QUESTIONNAIRE */}
              {signupStep === 3 && (
                <div className="step-view-content">
                  <p className="baseline-banner-note">
                    <Activity size={14} className="text-cyan inline-icon" /> Pre-flight 1-G ground benchmarks calibrate the individual Edge ML deconditioning model:
                  </p>

                  <div className="input-grid-2">
                    <div className="pro-field-group">
                      <label><Heart size={14} className="text-red inline-icon" /> Baseline Resting HR (BPM)</label>
                      <input
                        type="number"
                        min="45"
                        max="110"
                        value={formData.baselineHR}
                        onChange={(e) => handleInputChange('baselineHR', e.target.value)}
                        required
                      />
                      <span className="field-hint">Pre-flight 1-G norm: 60 - 75 BPM</span>
                    </div>

                    <div className="pro-field-group">
                      <label><Heart size={14} className="text-emerald inline-icon" /> Baseline HRV RMSSD (ms)</label>
                      <input
                        type="number"
                        min="20"
                        max="130"
                        value={formData.baselineHRV}
                        onChange={(e) => handleInputChange('baselineHRV', e.target.value)}
                        required
                      />
                      <span className="field-hint">Normal: 50 - 90 ms</span>
                    </div>
                  </div>

                  <div className="input-grid-2">
                    <div className="pro-field-group">
                      <label><Zap size={14} className="text-amber inline-icon" /> Prior Career Radiation (mSv)</label>
                      <input
                        type="number"
                        min="0"
                        max="400"
                        value={formData.priorRadiation}
                        onChange={(e) => handleInputChange('priorRadiation', e.target.value)}
                      />
                      <span className="field-hint">From earlier ISS / Artemis flights</span>
                    </div>

                    <div className="pro-field-group">
                      <label><Eye size={14} className="text-cyan inline-icon" /> Pre-Flight Visual Acuity</label>
                      <select
                        value={formData.visualAcuity}
                        onChange={(e) => handleInputChange('visualAcuity', e.target.value)}
                      >
                        <option>20/20 (Uncorrected)</option>
                        <option>20/25 (Mild Refractive)</option>
                        <option>Hyperopic (Far-sighted +1.0)</option>
                        <option>Myopic (Near-sighted -1.5)</option>
                      </select>
                      <span className="field-hint">SANS baseline comparison</span>
                    </div>
                  </div>

                  <div className="step-btn-row flex-between">
                    <button type="button" className="btn-pro-secondary" onClick={() => setSignupStep(2)}>
                      BACK
                    </button>
                    <button type="submit" className="btn-pro-complete">
                      <CheckCircle2 size={16} /> INITIALIZE CREW TELEMETRY & LAUNCH
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}

        </div>
      </div>

      {/* Interactive Biometric Verification Console */}
      <BiometricModal 
        isOpen={showBiometricModal}
        onClose={() => setShowBiometricModal(false)}
        onConfirmLogin={handleBiometricSuccess}
        crewProfile={{
          name: loginId.includes('VANCE') || loginId === 'ARTEMIS-04' ? "Cmdr. Elena Vance" : `Officer ${loginId}`,
          crewId: loginId || "ARTEMIS-04",
          role: "Flight Commander / Medical Officer",
          clearance: "DEFCON-1 / LEVEL 5 FLIGHT DECK CLEARANCE"
        }}
      />
    </div>
  );
}

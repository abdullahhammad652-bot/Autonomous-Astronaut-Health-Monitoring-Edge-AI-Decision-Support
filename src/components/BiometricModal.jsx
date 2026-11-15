import React, { useState, useEffect, useRef } from 'react';
import { Fingerprint, ShieldCheck, CheckCircle2, X, RefreshCw, ArrowRight, UserCheck, Lock } from 'lucide-react';

export default function BiometricModal({ isOpen, onClose, onConfirmLogin, crewProfile }) {
  const [stage, setStage] = useState('scanning'); // 'scanning' | 'verified' | 'failed'
  const [progress, setProgress] = useState(0);
  const [telemetryLogs, setTelemetryLogs] = useState([
    'Initializing AES-256 quantum-resistant link...',
    'Activating hardware capacitive dermal sensor...',
  ]);
  const audioCtxRef = useRef(null);

  // Play subtle sci-fi scanner audio tone using Web Audio API
  const playTone = (freq, duration, type = 'sine') => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio not permitted or unsupported, fails gracefully
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setStage('scanning');
      setProgress(0);
      return;
    }

    setStage('scanning');
    setProgress(0);
    setTelemetryLogs([
      'Initializing AES-256 quantum-resistant handshake...',
      'Activating hardware capacitive dermal sensor...',
    ]);

    playTone(520, 0.2);

    const logSteps = [
      { pct: 28, log: 'Capturing ridge minutiae vector (512 points)...', tone: 640 },
      { pct: 58, log: 'Querying NASA Johnson Space Center Master Crew Registry...', tone: 780 },
      { pct: 85, log: 'Biometric cryptographic match confirmed: Level 5...', tone: 920 },
      { pct: 100, log: 'IDENTITY VERIFIED: Flight Commander Elena Vance', tone: 1040 },
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < logSteps.length) {
        const step = logSteps[currentStep];
        setProgress(step.pct);
        setTelemetryLogs(prev => [...prev.slice(-3), step.log]);
        playTone(step.tone, 0.15);
        currentStep++;
      } else {
        clearInterval(interval);
        setStage('verified');
        playTone(1200, 0.4, 'triangle');
      }
    }, 450);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const profile = crewProfile || {
    name: 'Cmdr. Elena Vance',
    crewId: 'ARTEMIS-04',
    role: 'Flight Commander / Mission Specialist',
    clearance: 'LEVEL 5 (FULL TELEMETRY & COMMAND)',
  };

  return (
    <div className="biometric-modal-overlay">
      <div className="biometric-modal-box">
        {/* Header Bar */}
        <div className="bio-modal-header">
          <div className="bio-header-badge">
            <Lock size={13} className="text-cyan" />
            <span>NASA BIOMETRIC SECURITY SUBSYSTEM</span>
          </div>
          <button className="bio-close-btn" onClick={onClose} title="Cancel Scan">
            <X size={16} />
          </button>
        </div>

        {/* Central Scanner Body */}
        <div className="bio-scanner-body">
          <div className={`bio-fingerprint-reticle ${stage}`}>
            <Fingerprint size={80} className="bio-fingerprint-icon" />
            <div className="bio-laser-scan-line"></div>
            <div className="bio-radar-circle circle-1"></div>
            <div className="bio-radar-circle circle-2"></div>
          </div>

          {/* Progress Bar & Percentage */}
          <div className="bio-progress-wrapper">
            <div className="bio-progress-info">
              <span className="bio-status-label">
                {stage === 'scanning' ? 'DERMAL MINUTIAE SCAN IN PROGRESS...' : 'VERIFICATION COMPLETE'}
              </span>
              <span className="bio-status-pct font-mono">{progress}%</span>
            </div>
            <div className="bio-progress-track">
              <div 
                className={`bio-progress-fill ${stage}`} 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Live Terminal Logs */}
          <div className="bio-terminal-logs font-mono">
            {telemetryLogs.map((line, idx) => (
              <div key={idx} className="bio-log-line">
                <span className="bio-log-arrow">›</span> {line}
              </div>
            ))}
          </div>

          {/* Verification Result Card */}
          {stage === 'verified' && (
            <div className="bio-verified-card">
              <div className="bio-verified-badge">
                <CheckCircle2 size={16} className="text-emerald" />
                <span>BIOMETRIC IDENTITY CONFIRMED</span>
              </div>
              <div className="bio-crew-details">
                <div className="bio-crew-avatar">
                  <UserCheck size={28} className="text-cyan" />
                </div>
                <div className="bio-crew-meta">
                  <h4 className="bio-crew-name">{profile.name}</h4>
                  <p className="bio-crew-id">CREW ID: <strong>{profile.crewId}</strong> · {profile.role}</p>
                  <p className="bio-crew-clearance text-emerald">{profile.clearance}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="bio-modal-footer">
          <button 
            type="button" 
            className="btn-bio-cancel" 
            onClick={onClose}
          >
            CANCEL / CLOSE
          </button>

          {stage === 'scanning' ? (
            <button type="button" className="btn-bio-scanning" disabled>
              <RefreshCw size={14} className="spin-slow" /> SCANNING SENSOR...
            </button>
          ) : (
            <button 
              type="button" 
              className="btn-bio-enter" 
              onClick={() => onConfirmLogin(profile)}
            >
              AUTHENTICATE & ENTER COCKPIT <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

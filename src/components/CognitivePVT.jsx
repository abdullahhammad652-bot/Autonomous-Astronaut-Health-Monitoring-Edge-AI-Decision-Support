import React, { useState, useEffect, useRef } from 'react';
import { Brain, Play, CheckCircle, AlertTriangle, Moon, RefreshCw, Zap } from 'lucide-react';

export default function CognitivePVT({ astronaut, onUpdateReactionTime }) {
  const [testState, setTestState] = useState('idle'); // 'idle' | 'waiting' | 'ready' | 'finished'
  const [reactionTime, setReactionTime] = useState(null);
  const [history, setHistory] = useState([225, 240, 265, 290]);
  const [falseStart, setFalseStart] = useState(false);
  const startTimeRef = useRef(0);
  const timerRef = useRef(null);

  const startTest = () => {
    setFalseStart(false);
    setReactionTime(null);
    setTestState('waiting');

    // Random stimulus delay between 2000ms and 5000ms (NASA PVT standard)
    const delay = Math.floor(Math.random() * 3000) + 2000;
    timerRef.current = setTimeout(() => {
      startTimeRef.current = performance.now();
      setTestState('ready');
    }, delay);
  };

  const handleUserClick = () => {
    if (testState === 'waiting') {
      // Clicked too early!
      clearTimeout(timerRef.current);
      setFalseStart(true);
      setTestState('idle');
    } else if (testState === 'ready') {
      const elapsed = Math.round(performance.now() - startTimeRef.current);
      setReactionTime(elapsed);
      setTestState('finished');
      setHistory(prev => [...prev.slice(-5), elapsed]);
      if (onUpdateReactionTime) {
        onUpdateReactionTime(elapsed);
      }
    }
  };

  const avgRT = Math.round(history.reduce((a, b) => a + b, 0) / history.length);

  return (
    <div className="section-container">
      <div className="section-header">
        <div>
          <h2>BEHAVIORAL HEALTH & PSYCHOMOTOR VIGILANCE TASK (PVT)</h2>
          <p className="subtext">NASA ISS Standard 10-Minute Reaction Time Test for Cognitive Fatigue & Sleep Debt Detection</p>
        </div>
      </div>

      <div className="pvt-grid">
        {/* Interactive PVT Test Box */}
        <div className="hud-panel pvt-interactive-panel">
          <div className="panel-header">
            <span className="panel-title"><Brain size={18} className="text-cyan" /> INTERACTIVE ASTRONAUT PVT CONSOLE</span>
            <span className="badge-meta">NASA STANDARD COGNITIVE BIO-ASSESSMENT</span>
          </div>

          <div
            className={`pvt-click-zone state-${testState} ${falseStart ? 'zone-false-start' : ''}`}
            onClick={handleUserClick}
          >
            {testState === 'idle' && (
              <div className="pvt-prompt">
                <Brain size={48} className="text-cyan mb-2" />
                <h3>PSYCHOMOTOR VIGILANCE TEST</h3>
                <p>Click "START TEST" below, then click this box IMMEDIATELY when the visual stimulus triggers!</p>
                <button className="btn-start-pvt" onClick={(e) => { e.stopPropagation(); startTest(); }}>
                  <Play size={16} /> START TEST SEQUENCE
                </button>
              </div>
            )}

            {testState === 'waiting' && (
              <div className="pvt-waiting">
                <span className="pulse-dot-large"></span>
                <h3>STAND BY... FOCUS ON SCREEN</h3>
                <p>DO NOT CLICK UNTIL SIGNAL APPEARS</p>
              </div>
            )}

            {testState === 'ready' && (
              <div className="pvt-stimulus">
                <Zap size={64} className="stimulus-icon" />
                <h1 className="stimulus-text">CLICK NOW!</h1>
              </div>
            )}

            {testState === 'finished' && (
              <div className="pvt-result-box">
                <CheckCircle size={44} className="text-emerald mb-2" />
                <h2>{reactionTime} ms</h2>
                <p className={reactionTime < 270 ? 'text-emerald' : reactionTime < 340 ? 'text-amber' : 'text-red'}>
                  {reactionTime < 270 ? 'OPTIMAL REACTION SPEED (NOMINAL ALERTNESS)' : reactionTime < 340 ? 'MILD FATIGUE SLOWDOWN DETECTED' : 'CRITICAL PSYCHOMOTOR IMPAIRMENT / SLEEP DEBT'}
                </p>
                <button className="btn-start-pvt" onClick={(e) => { e.stopPropagation(); startTest(); }}>
                  <RefreshCw size={14} /> RETEST REACTION
                </button>
              </div>
            )}

            {falseStart && (
              <div className="pvt-false-start-msg">
                <AlertTriangle size={32} className="text-red" />
                <h3>FALSE START / ANTICIPATION ERROR</h3>
                <p>You clicked before the stimulus appeared. Restarting...</p>
                <button className="btn-start-pvt" onClick={(e) => { e.stopPropagation(); startTest(); }}>
                  TRY AGAIN
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Actigraphy & Sleep Debt Analytics */}
        <div className="hud-panel">
          <div className="panel-header">
            <span className="panel-title"><Moon size={18} className="text-purple" /> CIRCADIAN RHYTHM & SLEEP ACTIGRAPHY</span>
            <span className="badge-meta">CREW SLEEP QUARTERS TELEMETRY</span>
          </div>

          <div className="sleep-analytics-grid">
            <div className="sleep-card">
              <span className="s-lbl">Last Night Sleep Duration</span>
              <span className="s-val text-cyan">5h 42m</span>
              <span className="s-sub">Target: 8.0 hrs</span>
            </div>
            <div className="sleep-card">
              <span className="s-lbl">Cumulative Sleep Debt</span>
              <span className="s-val text-amber">{astronaut.sleepDebt} hrs</span>
              <span className="s-sub">Past 7 days accumulated</span>
            </div>
            <div className="sleep-card">
              <span className="s-lbl">Average PVT Reaction Speed</span>
              <span className="s-val text-cyan">{avgRT} ms</span>
              <span className="s-sub">Norm: 220 - 250 ms</span>
            </div>
            <div className="sleep-card">
              <span className="s-lbl">Circadian Alignment Phase</span>
              <span className="s-val text-emerald">Phase Aligned (0.89)</span>
              <span className="s-sub">Melatonin onset: 21:30 UTC</span>
            </div>
          </div>

          <div className="countermeasure-box mt-3">
            <h4>Autonomous Neuro-Behavioral Countermeasures:</h4>
            <ul>
              <li><strong>Dynamic Lighting Schedule:</strong> Cabin Solid-State Lighting Modules (SSLM) set to 480nm blue-enriched (high melanopic lux) from 07:00 to 13:00 to boost alertness; shifted to warm red spectrum (2700K) at 19:30.</li>
              <li><strong>Tactical Sleep Banking:</strong> Schedule 45-minute post-meridian nap prior to EVA orbital operations.</li>
              <li><strong>Cognitive Behavioral Therapy (CBT-I) Module:</strong> Autonomous audio-guided relaxation protocol loaded for crew insomnia management.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

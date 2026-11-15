import React from 'react';
import { Sliders, RotateCcw, Zap, Heart, Moon, Bone, Droplets } from 'lucide-react';
import { DEFAULT_ASTRONAUT_PROFILE } from '../ml/modelWeights';

export default function VitalsSimulator({ astronaut, setAstronaut }) {
  const updateField = (field, val) => {
    setAstronaut(prev => ({
      ...prev,
      [field]: parseFloat(val)
    }));
  };

  const handleReset = () => {
    setAstronaut(DEFAULT_ASTRONAUT_PROFILE);
  };

  return (
    <div className="hud-panel simulator-panel">
      <div className="panel-header">
        <span className="panel-title"><Sliders size={18} className="text-cyan" /> HACKATHON LIVE TELEMETRY & ML STRESS SIMULATOR</span>
        <button className="btn-reset flex-center" onClick={handleReset}>
          <RotateCcw size={14} /> RESET TO BASELINE
        </button>
      </div>

      <p className="sim-intro">
        Adjust flight parameters below to simulate different deep-space scenarios (e.g. Solar storm, prolonged zero-G, sleep deprivation) and observe the Edge ML Model recalculate health risks and countermeasures in real-time:
      </p>

      <div className="sliders-grid">
        {/* Cumulative Radiation */}
        <div className="slider-control">
          <div className="slider-header">
            <span className="s-label"><Zap size={14} className="text-amber" /> Cumulative Radiation (mSv)</span>
            <span className="s-val text-amber">{astronaut.cumulativeRadiation.toFixed(1)} mSv</span>
          </div>
          <input
            type="range"
            min="10"
            max="650"
            step="5"
            value={astronaut.cumulativeRadiation}
            onChange={(e) => updateField('cumulativeRadiation', e.target.value)}
          />
          <div className="slider-hints">
            <span>10 (Nominal)</span>
            <span>300 (Moon)</span>
            <span>600 (NASA Limit)</span>
          </div>
        </div>

        {/* Resting HRV */}
        <div className="slider-control">
          <div className="slider-header">
            <span className="s-label"><Heart size={14} className="text-red" /> Resting HRV RMSSD (ms)</span>
            <span className="s-val text-cyan">{astronaut.hrvRMSSD} ms</span>
          </div>
          <input
            type="range"
            min="15"
            max="95"
            step="1"
            value={astronaut.hrvRMSSD}
            onChange={(e) => updateField('hrvRMSSD', e.target.value)}
          />
          <div className="slider-hints">
            <span className="text-red">15 (Critical Strain)</span>
            <span>50 (Moderate)</span>
            <span className="text-emerald">95 (Restful)</span>
          </div>
        </div>

        {/* Sleep Debt */}
        <div className="slider-control">
          <div className="slider-header">
            <span className="s-label"><Moon size={14} className="text-purple" /> Weekly Sleep Debt (Hours)</span>
            <span className="s-val text-cyan">{astronaut.sleepDebt} hrs</span>
          </div>
          <input
            type="range"
            min="0"
            max="20"
            step="0.5"
            value={astronaut.sleepDebt}
            onChange={(e) => updateField('sleepDebt', e.target.value)}
          />
          <div className="slider-hints">
            <span className="text-emerald">0 hrs</span>
            <span>8 hrs (Fatigued)</span>
            <span className="text-red">20 hrs (Severe)</span>
          </div>
        </div>

        {/* Bone Mineral Loss */}
        <div className="slider-control">
          <div className="slider-header">
            <span className="s-label"><Bone size={14} className="text-cyan" /> Bone Mineral Density Loss (%)</span>
            <span className="s-val text-amber">-{astronaut.boneMineralLoss}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="15"
            step="0.2"
            value={astronaut.boneMineralLoss}
            onChange={(e) => updateField('boneMineralLoss', e.target.value)}
          />
          <div className="slider-hints">
            <span className="text-emerald">0%</span>
            <span>5% (Osteopenia)</span>
            <span className="text-red">15% (Severe)</span>
          </div>
        </div>

        {/* Cephalad Fluid Shift */}
        <div className="slider-control">
          <div className="slider-header">
            <span className="s-label"><Droplets size={14} className="text-cyan" /> Cephalad Fluid Shift / SANS Index</span>
            <span className="s-val text-cyan">{astronaut.cephaladFluidShift} / 10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={astronaut.cephaladFluidShift}
            onChange={(e) => updateField('cephaladFluidShift', e.target.value)}
          />
          <div className="slider-hints">
            <span>1 (1-G Norm)</span>
            <span>5 (Moderate)</span>
            <span className="text-red">10 (Extreme ICP)</span>
          </div>
        </div>

        {/* Reaction Time */}
        <div className="slider-control">
          <div className="slider-header">
            <span className="s-label"><Sliders size={14} className="text-emerald" /> PVT Reaction Time (ms)</span>
            <span className="s-val text-emerald">{astronaut.pvtReactionTime} ms</span>
          </div>
          <input
            type="range"
            min="190"
            max="500"
            step="5"
            value={astronaut.pvtReactionTime}
            onChange={(e) => updateField('pvtReactionTime', e.target.value)}
          />
          <div className="slider-hints">
            <span className="text-emerald">190ms (Sharp)</span>
            <span>280ms (Average)</span>
            <span className="text-red">500ms (Micro-sleep)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

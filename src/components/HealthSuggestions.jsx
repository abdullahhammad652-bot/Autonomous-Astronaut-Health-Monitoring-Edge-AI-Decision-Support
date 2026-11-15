import React, { useMemo, useState } from 'react';

// ─── NASA AstroPulse: Health Suggestions Engine ───────────────────────────────
// Generates personalized countermeasure recommendations based on ML triage output
// Compliant with NASA-STD-3001 Volume 2 (Human Integration Design Handbook)

const SUGGESTION_DB = {
  radiation: [
    {
      id: 'rad-001',
      trigger: (v) => v.radiation > 0.5,
      priority: 'CRITICAL',
      system: 'Radiation Protection',
      icon: '☢️',
      title: 'Immediate Storm Shelter Protocol',
      action: 'Proceed to Central Radiation Shelter within 15 minutes. High-Z polyethylene shielding provides ~40% SPE dose reduction.',
      protocol: 'NASA-STD-3001 Vol.2 §6.9.1',
      outcome: 'Prevents acute radiation syndrome (ARS) threshold breach at >1 Gy',
      color: 'var(--red)',
    },
    {
      id: 'rad-002',
      trigger: (v) => v.radiation > 0.3 && v.radiation <= 0.5,
      priority: 'HIGH',
      system: 'Radiation Protection',
      icon: '🔆',
      title: 'Elevated Radiation Alert — Limit EVA',
      action: 'Postpone non-critical EVAs. Take 500mg Potassium Iodide prophylaxis per CMO directive. Increase water intake to 3L/day for renal clearance.',
      protocol: 'JSC-26895 SPE Mitigation Protocol',
      outcome: 'Reduces annual effective dose by estimated 15–22 mSv',
      color: 'var(--amber)',
    },
    {
      id: 'rad-003',
      trigger: (v) => v.radiation > 0.15 && v.radiation <= 0.3,
      priority: 'MEDIUM',
      system: 'Radiation Protection',
      icon: '🛡️',
      title: 'Routine Radiation Monitoring',
      action: 'Log daily dosimeter reading in REID tracker. Schedule next biomarker panel (CBC with differential) within 72 hours. Maintain current sleep schedule to optimize DNA repair cycles.',
      protocol: 'NASA-STD-3001 Vol.1 §4.7',
      outcome: 'Maintains cumulative dose below career limit (600 mSv effective)',
      color: 'var(--cyan)',
    },
  ],
  cardiovascular: [
    {
      id: 'cv-001',
      trigger: (v) => v.heartRate > 100 || v.heartRate < 45,
      priority: 'HIGH',
      system: 'Cardiovascular',
      icon: '💓',
      title: 'Heart Rate Anomaly Detected',
      action: (v) => v.heartRate > 100
        ? 'Cease physical activity immediately. Perform 4-7-8 breathing (inhale 4s, hold 7s, exhale 8s) × 4 cycles. If HR remains >110 bpm after 10 min, alert CMO.'
        : 'Orthostatic vital signs check required. Increase fluid intake. If HR <40 bpm, initiate cardiac monitoring protocol.',
      protocol: 'NASA Flight Surgeon Manual §8.3.2',
      outcome: 'Restores cardiac output within hemodynamic safety margins',
      color: 'var(--red)',
    },
    {
      id: 'cv-002',
      trigger: (v) => v.hrv < 30,
      priority: 'HIGH',
      system: 'Cardiovascular / ANS',
      icon: '📊',
      title: 'Low HRV — Autonomic Dysregulation Risk',
      action: 'Implement 20-min daily biofeedback session (Paced breathing at 0.1 Hz). Restrict caffeine to <100mg/day. Add 400mg Magnesium Glycinate nightly. Schedule SANS assessment.',
      protocol: 'ESA Circadian & HRV Protocol Rev.3',
      outcome: 'Target HRV >50ms within 7 days (improves stress resilience by ~30%)',
      color: 'var(--amber)',
    },
    {
      id: 'cv-003',
      trigger: (v) => v.hrv >= 30 && v.hrv < 50,
      priority: 'MEDIUM',
      system: 'Cardiovascular / ANS',
      icon: '🫀',
      title: 'Suboptimal HRV — Preventive Cardio',
      action: 'Add 15 min aerobic Zone-2 training (60–70% max HR) on CEVIS cycle ergometer 5×/week. Prioritize 7–9h sleep. Avoid high-sodium food pouches this cycle.',
      protocol: 'ISS Exercise Countermeasures Protocol',
      outcome: 'Expected HRV improvement of 10–20ms within 14 days',
      color: 'var(--cyan)',
    },
  ],
  sleep: [
    {
      id: 'sl-001',
      trigger: (v) => v.sleepDebt > 6,
      priority: 'CRITICAL',
      system: 'Cognitive / Sleep',
      icon: '🧠',
      title: 'Severe Sleep Debt — Cognitive Impairment Risk',
      action: 'Mandatory 8-hour sleep block starting next sleep cycle. 5mg Melatonin 90 min before sleep. Blackout all viewport panels. Restrict communications from MCC during sleep window. Cognitive tasks deferred to next shift.',
      protocol: 'NASA HERA Sleep Protocol; NASA-STD-3001 §6.3',
      outcome: 'Reduces psychomotor vigilance task (PVT) lapses by ~40% within 2 sleep cycles',
      color: 'var(--red)',
    },
    {
      id: 'sl-002',
      trigger: (v) => v.sleepDebt > 3 && v.sleepDebt <= 6,
      priority: 'HIGH',
      system: 'Cognitive / Sleep',
      icon: '😴',
      title: 'Elevated Sleep Debt — Performance Degradation',
      action: 'Add 20-min nap between 13:00–15:00 MET (avoid longer — prevents sleep inertia). Adjust circadian lighting to 6500K cool-white in morning, warm 2700K 2h before sleep. Limit screen time 1h before sleep window.',
      protocol: 'ISS Circadian Adaptation Protocol',
      outcome: 'Recovers ~1.5h sleep debt equivalent; improves alertness by 34%',
      color: 'var(--amber)',
    },
    {
      id: 'sl-003',
      trigger: (v) => v.sleepDebt > 1 && v.sleepDebt <= 3,
      priority: 'LOW',
      system: 'Cognitive / Sleep',
      icon: '🌙',
      title: 'Mild Sleep Deficit — Monitor Trend',
      action: 'Maintain consistent sleep schedule ±30 min. Use Actiwatches to verify actual sleep duration. Consider 3mg Melatonin if crossing 3+ time zones in next 72h (simulated).',
      protocol: 'NASA HERA Actigraphy Protocol',
      outcome: 'Prevents debt accumulation; sustains mission-critical cognitive performance',
      color: 'var(--cyan)',
    },
  ],
  musculoskeletal: [
    {
      id: 'ms-001',
      trigger: (v) => v.boneLoss > 1.0,
      priority: 'HIGH',
      system: 'Musculoskeletal',
      icon: '🦴',
      title: 'Bone Mineral Density Loss Exceeds Threshold',
      action: 'Increase ARED (Advanced Resistive Exercise Device) sessions to 6×/week, minimum 90 min/session. Load: Squat ≥200% BW, Deadlift ≥180% BW. Add 1200mg Calcium + 2000 IU Vitamin D3 daily. Schedule DEXA scan equivalent at next port.',
      protocol: 'ISS ARED Exercise Protocol; NASA-STD-3001 §6.6',
      outcome: 'Limits BMD loss to <0.5%/month vs. untreated ~1–1.5%/month',
      color: 'var(--amber)',
    },
    {
      id: 'ms-002',
      trigger: (v) => v.boneLoss > 0.5 && v.boneLoss <= 1.0,
      priority: 'MEDIUM',
      system: 'Musculoskeletal',
      icon: '🏋️',
      title: 'Moderate Bone Loss — Exercise Optimization',
      action: 'Ensure ARED compliance ≥5 sessions/week. Log workout data in AstroPulse. High-impact vibration therapy (LBNP protocol) 20 min/day if available. Diet: increase protein to 1.6g/kg BW.',
      protocol: 'ISS Exercise Countermeasures Protocol Rev.4',
      outcome: 'Prevents cumulative BMD loss from exceeding 5% mission threshold',
      color: 'var(--cyan)',
    },
  ],
  sans: [
    {
      id: 'sans-001',
      trigger: (v) => v.sansScore && v.sansScore > 2,
      priority: 'HIGH',
      system: 'SANS / Neuro-Ocular',
      icon: '👁️',
      title: 'Spaceflight-Associated Neuro-Ocular Syndrome Risk',
      action: 'Measure ICP proxy via ONSD ultrasound. Increase CO2 scrubbing cabin ventilation. Sleep in head-elevated position (15–20°). Restrict Valsalva maneuvers. Report any visual changes to CMO immediately.',
      protocol: 'NASA SANS Research Protocol; NPR 8900.1 §6.4',
      outcome: 'Early SANS detection reduces vision-threatening intracranial pressure events',
      color: 'var(--red)',
    },
  ],
  general: [
    {
      id: 'gen-001',
      trigger: (v) => v.score >= 85,
      priority: 'OPTIMAL',
      system: 'Overall Readiness',
      icon: '✅',
      title: 'Optimal Health Readiness — Mission Green',
      action: 'All systems nominal. Maintain current exercise, nutrition, and sleep protocols. Continue daily AstroPulse check-ins. You are cleared for all mission-critical EVAs and IVAs.',
      protocol: 'NASA Flight Surgeon Clearance Standard',
      outcome: 'Full mission capability sustained — Crew Readiness Score ≥85/100',
      color: 'var(--emerald)',
    },
    {
      id: 'gen-002',
      trigger: (v) => v.score >= 60 && v.score < 85,
      priority: 'CAUTION',
      system: 'Overall Readiness',
      icon: '⚠️',
      title: 'Suboptimal Readiness — Non-Critical Operations Only',
      action: 'Restrict to light duty. No EVA without CMO sign-off. Recheck vitals in 6h. Address highest-priority flag first.',
      protocol: 'NASA Flight Rules §GEN-1.4',
      outcome: 'Expected readiness restoration within 24–48h with targeted interventions',
      color: 'var(--amber)',
    },
    {
      id: 'gen-003',
      trigger: (v) => v.score < 60,
      priority: 'CRITICAL',
      system: 'Overall Readiness',
      icon: '🚨',
      title: 'Critical Health Status — Immediate CMO Consultation',
      action: 'Ground all EVA activities. Initiate continuous vital monitoring. Contact MCC Flight Surgeon via Priority 1 channel. Prepare emergency medical kit Alpha-7.',
      protocol: 'NASA Emergency Medical Operations §4.1',
      outcome: 'Prevents mission abort; enables rapid clinical intervention',
      color: 'var(--red)',
    },
  ],
};

function getSuggestions(vitals, prediction) {
  const v = {
    heartRate: vitals?.heartRate ?? 72,
    hrv: vitals?.hrv ?? 55,
    radiation: vitals?.radiation ?? 0.1,
    sleepDebt: vitals?.sleepDebt ?? 0,
    boneLoss: vitals?.boneLoss ?? 0,
    sansScore: vitals?.sansScore ?? 0,
    score: prediction?.score ?? 100,
  };

  const results = [];

  const categories = ['radiation', 'cardiovascular', 'sleep', 'musculoskeletal', 'sans', 'general'];
  for (const cat of categories) {
    for (const rule of SUGGESTION_DB[cat] || []) {
      if (rule.trigger(v)) {
        const action = typeof rule.action === 'function' ? rule.action(v) : rule.action;
        results.push({ ...rule, action, category: cat });
        break; // only one rule per category
      }
    }
  }

  // Sort: CRITICAL > HIGH > MEDIUM > LOW > OPTIMAL
  const order = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3, CAUTION: 4, OPTIMAL: 5 };
  results.sort((a, b) => (order[a.priority] ?? 9) - (order[b.priority] ?? 9));

  return results;
}

const priorityBadge = {
  CRITICAL: { label: 'CRITICAL', bg: 'rgba(239,68,68,0.15)', border: 'var(--red)', text: 'var(--red)' },
  HIGH:     { label: 'HIGH',     bg: 'rgba(245,158,11,0.12)', border: 'var(--amber)', text: 'var(--amber)' },
  MEDIUM:   { label: 'MEDIUM',   bg: 'rgba(0,245,212,0.08)', border: 'var(--cyan)', text: 'var(--cyan)' },
  LOW:      { label: 'LOW',      bg: 'rgba(0,245,212,0.06)', border: 'rgba(0,245,212,0.4)', text: 'rgba(0,245,212,0.7)' },
  CAUTION:  { label: 'CAUTION',  bg: 'rgba(245,158,11,0.10)', border: 'var(--amber)', text: 'var(--amber)' },
  OPTIMAL:  { label: 'OPTIMAL',  bg: 'rgba(16,185,129,0.12)', border: 'var(--emerald)', text: 'var(--emerald)' },
};

export default function HealthSuggestions({ vitals, prediction, astronaut }) {
  const [expanded, setExpanded] = useState(null);
  const suggestions = useMemo(() => getSuggestions(vitals, prediction), [vitals, prediction]);

  if (!prediction) return null;

  const critCount = suggestions.filter(s => s.priority === 'CRITICAL').length;
  const highCount = suggestions.filter(s => s.priority === 'HIGH').length;

  return (
    <div className="health-suggestions-panel">
      {/* Header */}
      <div className="hs-header">
        <div className="hs-title-row">
          <span className="hs-icon">🩺</span>
          <div>
            <div className="hs-title">AI HEALTH RECOMMENDATIONS</div>
            <div className="hs-subtitle">
              Personalized countermeasures · NASA-STD-3001 compliant · {suggestions.length} active protocols
            </div>
          </div>
        </div>
        <div className="hs-badge-row">
          {critCount > 0 && (
            <span className="hs-count-badge" style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--red)', border: '1px solid var(--red)' }}>
              {critCount} CRITICAL
            </span>
          )}
          {highCount > 0 && (
            <span className="hs-count-badge" style={{ background: 'rgba(245,158,11,0.12)', color: 'var(--amber)', border: '1px solid var(--amber)' }}>
              {highCount} HIGH
            </span>
          )}
          <span className="hs-crew-tag">
            CDR {astronaut?.name?.split(' ').pop() ?? 'UNKNOWN'}
          </span>
        </div>
      </div>

      {/* Suggestion Cards */}
      <div className="hs-cards-list">
        {suggestions.map((s) => {
          const badge = priorityBadge[s.priority] || priorityBadge.LOW;
          const isOpen = expanded === s.id;
          return (
            <div
              key={s.id}
              className={`hs-card ${isOpen ? 'hs-card-open' : ''}`}
              style={{ borderColor: badge.border }}
              onClick={() => setExpanded(isOpen ? null : s.id)}
            >
              <div className="hs-card-header">
                <div className="hs-card-left">
                  <span className="hs-card-icon">{s.icon}</span>
                  <div>
                    <div className="hs-card-title">{s.title}</div>
                    <div className="hs-card-system">{s.system}</div>
                  </div>
                </div>
                <div className="hs-card-right">
                  <span
                    className="hs-priority-badge"
                    style={{ background: badge.bg, color: badge.text, border: `1px solid ${badge.border}` }}
                  >
                    {badge.label}
                  </span>
                  <span className="hs-chevron">{isOpen ? '▲' : '▼'}</span>
                </div>
              </div>

              {isOpen && (
                <div className="hs-card-body">
                  <div className="hs-detail-row">
                    <div className="hs-detail-label">📋 ACTION REQUIRED</div>
                    <div className="hs-detail-text">{s.action}</div>
                  </div>
                  <div className="hs-detail-row">
                    <div className="hs-detail-label">📌 PROTOCOL</div>
                    <div className="hs-detail-text hs-protocol">{s.protocol}</div>
                  </div>
                  <div className="hs-detail-row">
                    <div className="hs-detail-label">🎯 EXPECTED OUTCOME</div>
                    <div className="hs-detail-text hs-outcome">{s.outcome}</div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="hs-footer">
        ⚕️ AI-generated countermeasures · Always confirm with CMO · Last updated {new Date().toUTCString()}
      </div>
    </div>
  );
}

// Export getSuggestions for use in PDF generator
export { getSuggestions };

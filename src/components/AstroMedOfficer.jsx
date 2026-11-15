import React, { useState } from 'react';
import { Bot, Send, ShieldAlert, Sparkles, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

export default function AstroMedOfficer({ astronaut, commsLatency }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Hello ${astronaut.name}. I am the BioCosmos Autonomous Medical AI Officer. Because communication latency to Earth Mission Control is currently ${commsLatency.toFixed(1)} minutes one-way, I am operating autonomously on the spacecraft local neural compute core. What symptoms or physiological observations would you like to evaluate?`
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);

  // Pre-configured deep-space clinical case knowledge base for real-time triage
  const clinicalProtocols = [
    {
      keywords: ['eye', 'vision', 'blur', 'headache', 'sans', 'farsighted'],
      title: 'Spaceflight-Associated Neuro-ocular Syndrome (SANS) Protocol',
      severity: 'MODERATE - ELEVATED',
      diagnosis: 'Cephalad venous congestion causing elevated optic nerve sheath pressure and posterior globe flattening.',
      actions: [
        'Perform auto-fundoscopy and ultrasound measurement of Optic Nerve Sheath Diameter (ONSD).',
        'Initiate 2 hours daily Lower Body Negative Pressure (LBNP) suit at -25 mmHg.',
        'Adjust adjustable focus space spectacles by +0.75 diopters for near-work tasks.',
        'Reduce dietary sodium intake to < 2.0g/day to prevent fluid retention.'
      ]
    },
    {
      keywords: ['dizzy', 'faint', 'standing', 'orthostatic', 'landing', 'blood pressure'],
      title: 'Cardiovascular Deconditioning & Orthostatic Intolerance Protocol',
      severity: 'ELEVATED FOR GRAVITY TRANSITION',
      diagnosis: 'Downregulated baroreceptor sensitivity and lower-extremity vascular tone due to prolonged absence of hydrostatic columns.',
      actions: [
        'Fluid Loading: Consume 1.0 Liter of isotonic electrolyte solution + 8 salt tablets (1g NaCl each) 2 hours prior to atmospheric entry.',
        'Don continuous lower-body anti-G counter-pressure compression garments.',
        'Perform isometric calf and abdominal muscle tensing maneuvers prior to egress.'
      ]
    },
    {
      keywords: ['radiation', 'nausea', 'vomit', 'spe', 'solar', 'dizziness'],
      title: 'Acute Radiation Sickness (ARS) / Solar Particle Event Triage',
      severity: 'CRITICAL MEDICAL PROTOCOL',
      diagnosis: 'Suspected ionizing particle exposure exceeding acute prodromal threshold (>250 mGy).',
      actions: [
        'Immediate evacuation to central storm shelter module with polyethylene and water-tank shielding.',
        'Administer Ondansetron 8mg orally for antiemetic control.',
        'Initiate prophylactic broad-spectrum antibiotic and Granulocyte Colony-Stimulating Factor (G-CSF) if lymphocyte count drops < 1.0 x10^3/uL.',
        'Perform daily capillary blood smear for lymphocyte depletion kinetics.'
      ]
    },
    {
      keywords: ['sleep', 'insomnia', 'tired', 'fatigue', 'circadian', 'wake'],
      title: 'Deep-Space Circadian Desynchronosis & Sleep Debt Protocol',
      severity: 'MILD TO MODERATE',
      diagnosis: 'Lack of natural 24h solar diurnal cues combined with ambient ventilation noise and microgravity sleep disruption.',
      actions: [
        'Enforce 45-minute sleep anchor block with eye mask and active noise-cancelling headset.',
        'Administer 0.5mg exogenous Melatonin 90 minutes before scheduled sleep period.',
        'Confirm cabin SSLM fixtures transition to 2700K low-intensity red spectrum 1 hour prior to sleep.',
        'Restrict caffeine intake 6 hours prior to rest period.'
      ]
    },
    {
      keywords: ['bone', 'muscle', 'weak', 'exercise', 'knee', 'ache', 'back'],
      title: 'Microgravity Musculoskeletal Atrophy & Space Adaptation Back Pain',
      severity: 'EXPECTED ADAPTIVE STRAIN',
      diagnosis: 'Spinal lengthening due to intervertebral disc expansion in zero-G, combined with bone mineral loss.',
      actions: [
        'Perform fetal-tuck spinal flexion stretches for 15 minutes before sleep.',
        'Ensure 100% daily adherence to ARED axial loading exercises (deadlifts and squats).',
        'Verify oral bisphosphonate (Alendronate 70mg weekly) and Vitamin D3 800 IU compliance.'
      ]
    }
  ];

  const handleSend = (textToSend) => {
    const query = textToSend || inputVal;
    if (!query.trim()) return;

    const newMessages = [...messages, { sender: 'user', text: query }];
    setMessages(newMessages);
    setInputVal('');
    setLoading(true);

    setTimeout(() => {
      const lower = query.toLowerCase();
      const match = clinicalProtocols.find(proto =>
        proto.keywords.some(kw => lower.includes(kw))
      );

      if (match) {
        setMessages(prev => [
          ...prev,
          {
            sender: 'ai',
            protocol: match,
            text: `Based on your symptoms and continuous biometric telemetry, the autonomous diagnostic engine has identified **${match.title}**.`
          }
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          {
            sender: 'ai',
            text: `Symptom recorded in crew clinical health log. Current vital signs are within acceptable parameters (HR: ${astronaut.restingHeartRate} BPM, SpO2: 98%, Core Temp: 36.8°C). Continue monitoring. If symptoms persist or worsen, initiate the interactive PVT test or consult the specific domain telemetry modules.`
          }
        ]);
      }
      setLoading(false);
    }, 700);
  };

  return (
    <div className="section-container">
      <div className="section-header">
        <div>
          <h2>ASTROMED AUTONOMOUS MEDICAL AI OFFICER</h2>
          <p className="subtext">Offline Edge Intelligence for Spacecraft Clinical Triage (Bypasses {commsLatency.toFixed(1)} Min Earth Lag)</p>
        </div>
      </div>

      <div className="ai-officer-grid">
        <div className="hud-panel chat-container">
          <div className="panel-header">
            <span className="panel-title"><Bot size={18} className="text-cyan" /> DEEP-SPACE AUTONOMOUS CLINICAL INTERFACE</span>
            <span className="badge-ai"><Sparkles size={13} /> LOCAL NEURAL ENGINE</span>
          </div>

          <div className="chat-messages-scroll">
            {messages.map((m, idx) => (
              <div key={idx} className={`chat-bubble ${m.sender === 'user' ? 'user-msg' : 'ai-msg'}`}>
                <div className="bubble-content">
                  <p>{m.text}</p>
                  {m.protocol && (
                    <div className="protocol-card-inline">
                      <div className="proto-head">
                        <span className="proto-name">{m.protocol.title}</span>
                        <span className="proto-sev">{m.protocol.severity}</span>
                      </div>
                      <p className="proto-diag"><strong>Clinical Assessment:</strong> {m.protocol.diagnosis}</p>
                      <div className="proto-actions">
                        <strong>Prescribed Autonomous Protocol:</strong>
                        <ul>
                          {m.protocol.actions.map((act, i) => (
                            <li key={i}>{act}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="chat-bubble ai-msg">
                <span className="pulse-dot"></span> Analyzing flight telemetry against NASA-STD-3001 clinical knowledge base...
              </div>
            )}
          </div>

          <div className="chat-input-bar">
            <input
              type="text"
              placeholder="Report symptoms (e.g., 'blurred vision', 'dizzy when standing', 'radiation nausea')..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button className="btn-send" onClick={() => handleSend()}>
              <Send size={16} />
            </button>
          </div>

          <div className="quick-symptoms-chips">
            <span className="chips-lbl">Quick Clinical Evaluations:</span>
            <button onClick={() => handleSend("I have blurred vision and a headache")} className="chip">Blurred Vision / SANS</button>
            <button onClick={() => handleSend("Feeling dizzy and faint after orthostatic standing test")} className="chip">Orthostatic Dizziness</button>
            <button onClick={() => handleSend("Severe fatigue and chronic sleep debt")} className="chip">Sleep Fatigue</button>
            <button onClick={() => handleSend("Nausea and suspected solar radiation flare exposure")} className="chip">Solar Flare Radiation</button>
          </div>
        </div>
      </div>
    </div>
  );
}

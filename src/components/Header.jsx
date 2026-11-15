import React, { useState, useEffect } from 'react';
import { Radio, AlertTriangle, ShieldCheck, Clock, Satellite, LogOut, User } from 'lucide-react';
import ThemeSwitcher from './ThemeSwitcher';

export default function Header({ astronaut, missionDay, commsLatency, alertActive, onLogout, currentTheme, onThemeChange }) {
  const [currentTime, setCurrentTime] = useState(new Date().toUTCString().slice(17, 25));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toUTCString().slice(17, 25));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="nasa-header">
      <div className="header-left">
        <div className="nasa-insignia">
          <span className="nasa-meatball">NASA</span>
          <span className="mission-tag">ARTEMIS HEALTH</span>
        </div>
        <div className="system-identity">
          <h1>ASTROPULSE <span className="badge-ai">AUTONOMOUS MEDICAL OFFICER</span></h1>
          <p className="subtext">{astronaut?.habitat || "Deep-Space Habitat"} | Flight Rules NASA-STD-3001</p>
        </div>
      </div>

      <div className="header-telemetry-strip">
        <div className="hud-metric">
          <div className="hud-label"><Clock size={13} /> MISSION TIME (MET)</div>
          <div className="hud-val text-cyan">SOL {missionDay} : {currentTime}</div>
        </div>

        <div className="hud-metric">
          <div className="hud-label"><Radio size={13} /> EARTH COMMS DELAY</div>
          <div className="hud-val text-amber flex-center">
            <span className="pulse-dot"></span>
            {commsLatency?.toFixed(1) || "14.5"} MIN (ONE-WAY)
          </div>
        </div>

        <div className="hud-metric">
          <div className="hud-label"><Satellite size={13} /> FLIGHT STATUS</div>
          <div className="hud-val text-emerald">
            <ShieldCheck size={14} className="inline-icon" /> ACTIVE MONITORING
          </div>
        </div>

        {alertActive && (
          <div className="hud-metric alert-box">
            <AlertTriangle size={15} className="blink text-red" />
            <span className="text-red font-bold">SOLAR EVENT ALERT</span>
          </div>
        )}

        {/* Top-Side HUD Theme Switcher */}
        <ThemeSwitcher currentTheme={currentTheme} onThemeChange={onThemeChange} />

        {/* Crew Profile & Logout */}
        <div className="user-profile-hud">
          <div className="user-avatar-badge">
            <User size={14} className="text-cyan" />
          </div>
          <div className="user-info-text">
            <span className="user-name">{astronaut?.name || "Cmdr. Elena Vance"}</span>
            <span className="user-role">{astronaut?.crewId || "CREW-01"}</span>
          </div>
          <button className="btn-logout" onClick={onLogout} title="Switch Astronaut / Log Out">
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </header>
  );
}

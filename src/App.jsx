import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import CommandDashboard from './components/CommandDashboard';
import RadiationTracker from './components/RadiationTracker';
import CardioSANS from './components/CardioSANS';
import MusculoTracker from './components/MusculoTracker';
import CognitivePVT from './components/CognitivePVT';
import AstroMedOfficer from './components/AstroMedOfficer';
import VitalsSimulator from './components/VitalsSimulator';
import DailyCheckIn from './components/DailyCheckIn';
import AuthModal from './components/AuthModal';
import VoiceAIAssistant from './components/VoiceAIAssistant';
import { DEFAULT_ASTRONAUT_PROFILE, predictAstronautHealthRisk } from './ml/modelWeights';
import { LayoutDashboard, Zap, Heart, Bone, Brain, Bot, Sliders, ClipboardList } from 'lucide-react';
import './App.css';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null); // null shows Login & Signup
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('astropulse_theme') || 'artemis';
  });
  const [astronaut, setAstronaut] = useState(DEFAULT_ASTRONAUT_PROFILE);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [speActive, setSpeActive] = useState(false);
  const [showSimulator, setShowSimulator] = useState(true);

  // Apply theme to html document root for global CSS variables
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('astropulse_theme', currentTheme);
  }, [currentTheme]);

  // Compute live prediction whenever astronaut state changes
  const prediction = useMemo(() => {
    return predictAstronautHealthRisk(astronaut);
  }, [astronaut]);

  const handleToggleSPE = () => {
    if (!speActive) {
      setSpeActive(true);
      setAstronaut(prev => ({
        ...prev,
        cumulativeRadiation: prev.cumulativeRadiation + 42.5,
        dailyRadiationRate: 3.8
      }));
    } else {
      setSpeActive(false);
      setAstronaut(prev => ({
        ...prev,
        dailyRadiationRate: 0.85
      }));
    }
  };

  const handleUpdateReactionTime = (newRT) => {
    setAstronaut(prev => ({
      ...prev,
      pvtReactionTime: newRT
    }));
  };

  const handleLoginSuccess = (userProfile) => {
    setCurrentUser(userProfile);
    setAstronaut(userProfile);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // If not logged in, show NASA Login & Enrollment Portal
  if (!currentUser) {
    return (
      <AuthModal 
        onLoginSuccess={handleLoginSuccess}
        currentTheme={currentTheme}
        onThemeChange={setCurrentTheme}
      />
    );
  }

  return (
    <div className="app-layout" data-theme={currentTheme}>
      {/* Flight Control Header with Logged-in User Profile */}
      <Header
        astronaut={astronaut}
        missionDay={astronaut.missionDay}
        commsLatency={astronaut.earthCommsLatency}
        alertActive={speActive}
        onLogout={handleLogout}
        currentTheme={currentTheme}
        onThemeChange={setCurrentTheme}
      />

      {/* Primary Navigation Tabs */}
      <nav className="nav-tabs-bar">
        <button
          className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard size={16} /> COMMAND CENTER
        </button>

        <button
          className={`nav-tab tab-checkin ${activeTab === 'checkin' ? 'active' : ''}`}
          onClick={() => setActiveTab('checkin')}
        >
          <ClipboardList size={16} /> DAILY HEALTH CHECK-IN
        </button>

        <button
          className={`nav-tab ${activeTab === 'radiation' ? 'active' : ''} ${speActive ? 'tab-alert' : ''}`}
          onClick={() => setActiveTab('radiation')}
        >
          <Zap size={16} /> RADIATION & DOSIMETRY
        </button>

        <button
          className={`nav-tab ${activeTab === 'cardio' ? 'active' : ''}`}
          onClick={() => setActiveTab('cardio')}
        >
          <Heart size={16} /> CARDIO & SANS
        </button>

        <button
          className={`nav-tab ${activeTab === 'musculo' ? 'active' : ''}`}
          onClick={() => setActiveTab('musculo')}
        >
          <Bone size={16} /> MUSCULOSKELETAL
        </button>

        <button
          className={`nav-tab ${activeTab === 'cognitive' ? 'active' : ''}`}
          onClick={() => setActiveTab('cognitive')}
        >
          <Brain size={16} /> COGNITIVE PVT
        </button>

        <button
          className={`nav-tab ${activeTab === 'ai-officer' ? 'active' : ''}`}
          onClick={() => setActiveTab('ai-officer')}
        >
          <Bot size={16} /> ASTROMED AI OFFICER
        </button>

        <button
          className={`nav-tab toggle-sim ${showSimulator ? 'sim-active' : ''}`}
          onClick={() => setShowSimulator(!showSimulator)}
        >
          <Sliders size={16} /> {showSimulator ? 'HIDE SIMULATOR' : 'SHOW ML SIMULATOR'}
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Hands-Free Voice AI Cockpit Bar */}
        <VoiceAIAssistant
          astronaut={astronaut}
          prediction={prediction}
          onTriggerSPE={handleToggleSPE}
          onNavigateTab={setActiveTab}
        />

        {activeTab === 'dashboard' && (
          <CommandDashboard
            astronaut={astronaut}
            prediction={prediction}
            speActive={speActive}
            onTriggerSPE={handleToggleSPE}
            onSelectTab={setActiveTab}
          />
        )}

        {activeTab === 'checkin' && (
          <DailyCheckIn
            astronaut={astronaut}
            setAstronaut={setAstronaut}
            onComplete={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'radiation' && (
          <RadiationTracker
            astronaut={astronaut}
            speActive={speActive}
            onToggleSPE={handleToggleSPE}
          />
        )}

        {activeTab === 'cardio' && (
          <CardioSANS astronaut={astronaut} />
        )}

        {activeTab === 'musculo' && (
          <MusculoTracker
            astronaut={astronaut}
            onLogExercise={() => {}}
          />
        )}

        {activeTab === 'cognitive' && (
          <CognitivePVT
            astronaut={astronaut}
            onUpdateReactionTime={handleUpdateReactionTime}
          />
        )}

        {activeTab === 'ai-officer' && (
          <AstroMedOfficer
            astronaut={astronaut}
            commsLatency={astronaut.earthCommsLatency}
          />
        )}

        {/* Live Interactive ML Stress Simulator */}
        {showSimulator && (
          <VitalsSimulator
            astronaut={astronaut}
            setAstronaut={setAstronaut}
          />
        )}
      </main>

      {/* Aerospace Footer */}
      <footer className="nasa-footer">
        <div>ASTROPULSE v2.4 | NASA SPACE APPS HACKATHON SOLUTION | DEEP SPACE MEDICAL AUTONOMY</div>
        <div>STANDARDS COMPLIANCE: NASA-STD-3001 | BIO-RADAR MULTI-SYSTEM TRIAGE ML CORE</div>
      </footer>
    </div>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check, Sparkles } from 'lucide-react';

export const THEMES = [
  {
    id: 'artemis',
    name: 'Artemis Deep Space',
    label: 'Artemis Cyan',
    primaryColor: '#00f5d4',
    bgPreview: '#060911',
    accentText: 'Deep-Space Telemetry Standard',
  },
  {
    id: 'mars',
    name: 'Mars Transit Sol',
    label: 'Martian Sol',
    primaryColor: '#ff4d6d',
    bgPreview: '#0e0507',
    accentText: 'High-Z Radiation Spectrum',
  },
  {
    id: 'apollo',
    name: 'Apollo Lunar Regolith',
    label: 'Apollo Gold',
    primaryColor: '#fbbf24',
    bgPreview: '#0c0b08',
    accentText: 'Lunar Gateway Orbit',
  },
  {
    id: 'aurora',
    name: 'Orbital Aurora Bio',
    label: 'Aurora Emerald',
    primaryColor: '#10b981',
    bgPreview: '#040e09',
    accentText: 'Life Support & Ecology HUD',
  },
  {
    id: 'nebula',
    name: 'Deep Nebula Void',
    label: 'Nebula Violet',
    primaryColor: '#c084fc',
    bgPreview: '#090514',
    accentText: 'Stealth Night Ops Mode',
  },
];

export default function ThemeSwitcher({ currentTheme = 'artemis', onThemeChange, compact = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const activeThemeObj = THEMES.find(t => t.id === currentTheme) || THEMES[0];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (themeId) => {
    onThemeChange?.(themeId);
    setIsOpen(false);
  };

  return (
    <div className={`theme-switcher-container ${compact ? 'compact' : ''}`} ref={dropdownRef}>
      <button 
        type="button"
        className="btn-theme-trigger"
        onClick={() => setIsOpen(!isOpen)}
        title="Switch Space HUD Theme"
      >
        <span className="theme-color-dot" style={{ background: activeThemeObj.primaryColor, boxShadow: `0 0 8px ${activeThemeObj.primaryColor}` }}></span>
        <Palette size={14} className="theme-icon" />
        <span className="theme-current-name">{activeThemeObj.label}</span>
      </button>

      {isOpen && (
        <div className="theme-dropdown-menu">
          <div className="theme-menu-header">
            <Sparkles size={13} className="text-cyan" />
            <span>NASA FLIGHT HUD THEMES</span>
          </div>

          <div className="theme-options-list">
            {THEMES.map((t) => {
              const isActive = t.id === currentTheme;
              return (
                <button
                  key={t.id}
                  type="button"
                  className={`theme-option-item ${isActive ? 'active' : ''}`}
                  onClick={() => handleSelect(t.id)}
                >
                  <div className="theme-item-left">
                    <span
                      className="theme-swatch"
                      style={{ background: t.primaryColor, boxShadow: isActive ? `0 0 10px ${t.primaryColor}` : 'none' }}
                    />
                    <div className="theme-text-group">
                      <span className="theme-name">{t.name}</span>
                      <span className="theme-desc">{t.accentText}</span>
                    </div>
                  </div>
                  {isActive && <Check size={14} className="theme-check text-cyan" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ showToast }) => {
  const { theme, setTheme } = useTheme();
  const { setLanguage } = useLanguage();
  const { user } = useAuth();
  const [langActive, setLangActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim() !== '') {
      showToast(`Searching for "${searchQuery}"...`, 'info');
    }
  };

  const handleLanguageChange = (lang: 'en' | 'te' | 'hi') => {
    setLanguage(lang);
    setLangActive(false);
  };

  const cycleTheme = () => {
    // Cycle between themes for fun or just toggle dark/light
    const themes: ('light' | 'dark' | 'traditional' | 'retro' | 'royal' | 'handloom' | 'festival')[] = 
      ['light', 'dark', 'traditional', 'retro', 'royal', 'handloom', 'festival'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
    showToast(`Theme switched to ${themes[nextIndex].toUpperCase()}`, 'info');
  };

  return (
    <div className="navbar-container">
      <style>{`
        .navbar-container {
          height: var(--navbar-height);
          background: var(--glass-bg);
          backdrop-filter: var(--glass-blur);
          -webkit-backdrop-filter: var(--glass-blur);
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 30px;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
        }
        
        .brand-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-heading);
          font-size: 24px;
          font-weight: 700;
          color: var(--text-primary);
        }
        
        .logo-gold {
          color: var(--accent-gold);
        }
        
        .search-wrapper {
          position: relative;
          width: 100%;
          max-width: 400px;
        }
        
        .search-bar-input {
          width: 100%;
          padding: 10px 16px 10px 40px;
          border-radius: var(--border-radius-lg);
          background-color: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          transition: border-color var(--transition-fast), background-color var(--transition-fast);
        }
        
        .search-bar-input:focus {
          border-color: var(--accent-gold);
          background-color: var(--bg-secondary);
        }
        
        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
        }

        .actions-wrapper {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        
        .nav-icon-btn {
          width: 40px;
          height: 40px;
          border-radius: var(--border-radius-round);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          transition: background-color var(--transition-fast), color var(--transition-fast);
          border: none;
          background: transparent;
        }
        
        .nav-icon-btn:hover {
          background-color: var(--bg-tertiary);
          color: var(--text-primary);
        }
        
        .profile-img-preview {
          width: 36px;
          height: 36px;
          border-radius: var(--border-radius-round);
          object-fit: cover;
          border: 2px solid var(--accent-gold);
          cursor: pointer;
        }
        
        .lang-dropdown-wrapper {
          position: relative;
        }
        
        .lang-menu {
          position: absolute;
          top: 48px;
          right: 0;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-sm);
          box-shadow: var(--shadow-lg);
          display: none;
          flex-direction: column;
          min-width: 120px;
        }
        
        .lang-menu.active {
          display: flex;
        }
        
        .lang-menu-item {
          padding: 10px 16px;
          font-size: 14px;
          font-weight: 500;
          text-align: left;
          cursor: pointer;
          transition: background-color var(--transition-fast);
          border: none;
          background: transparent;
          width: 100%;
        }
        
        .lang-menu-item:hover {
          background-color: var(--bg-tertiary);
          color: var(--accent-gold);
        }
      `}</style>
      
      <Link to="/" className="brand-logo">
        <span>Aura<span className="logo-gold">Stitch</span></span>
      </Link>
      
      <div className="search-wrapper">
        <span className="search-icon">🔍</span>
        <input 
          type="text" 
          className="search-bar-input" 
          placeholder="Search tailors, fabrics, designs..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleSearchKeyPress}
        />
      </div>
      
      <div className="actions-wrapper">
        {/* Theme Switcher */}
        <button className="nav-icon-btn" onClick={cycleTheme} title="Toggle HSL Theme Modes">
          🌓
        </button>
        
        {/* Language Selector */}
        <div className="lang-dropdown-wrapper">
          <button className="nav-icon-btn" onClick={() => setLangActive(!langActive)} title="Switch Language">
            🌐
          </button>
          <div className={`lang-menu ${langActive ? 'active' : ''}`}>
            <button className="lang-menu-item" onClick={() => handleLanguageChange('en')}>English</button>
            <button className="lang-menu-item" onClick={() => handleLanguageChange('te')}>తెలుగు</button>
            <button className="lang-menu-item" onClick={() => handleLanguageChange('hi')}>हिंदी</button>
          </div>
        </div>
        
        {/* Notifications Center Bell */}
        <button className="nav-icon-btn" onClick={() => showToast("No new notifications.", "info")} title="Notifications">
          🔔
        </button>
        
        {/* User Profile Icon router */}
        <Link to={user ? `/${user.role}` : '/login'}>
          <img 
            className="profile-img-preview" 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" 
            alt="Profile"
          />
        </Link>
      </div>
    </div>
  );
};
export default Navbar;

import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface OutletContextType {
  showToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export const OnboardingPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>([]);
  const { setLanguage } = useLanguage();
  const { completeOnboarding } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useOutletContext<OutletContextType>();

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const toggleFabric = (fabric: string) => {
    setSelectedFabrics((prev) =>
      prev.includes(fabric) ? prev.filter((f) => f !== fabric) : [...prev, fabric]
    );
  };

  const handleLanguageSelect = (lang: 'en' | 'te' | 'hi') => {
    setLanguage(lang);
    setStep(2);
  };

  const handleFinish = async () => {
    showToast("Preferences saved!", "success");
    localStorage.setItem('onboarding-completed', 'true');
    
    try {
      await completeOnboarding();
    } catch (e) {
      console.warn("Could not save preferences to database, proceeding offline.");
    }

    setTimeout(() => {
      // Force reload to sync auth context
      navigate('/customer');
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="onboard-container">
      <style>{`
        .onboard-container {
          width: 100vw;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, var(--bg-primary), var(--bg-tertiary));
          overflow: hidden;
        }
        
        .onboard-card {
          width: 90%;
          max-width: 680px;
          height: 560px;
          padding: 40px;
          border-radius: var(--border-radius-lg);
          display: grid;
          grid-template-rows: auto 1fr auto;
        }
        
        .step-indicator {
          display: flex;
          gap: 8px;
          justify-content: center;
          margin-bottom: 24px;
        }
        
        .indicator-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--border-color);
          transition: background-color var(--transition-fast);
        }
        
        .indicator-dot.active {
          background-color: var(--accent-gold);
        }
        
        .step-panel {
          display: none;
          flex-direction: column;
          height: 100%;
          overflow-y: auto;
          padding: 10px 0;
        }
        
        .step-panel.active {
          display: flex;
        }
        
        .tag-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 20px;
        }
        
        .interest-tag {
          padding: 10px 20px;
          border-radius: 9999px;
          border: 1px solid var(--border-color);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          background-color: var(--bg-secondary);
          transition: all var(--transition-fast);
        }
        
        .interest-tag:hover, .interest-tag.active {
          border-color: var(--accent-gold);
          background-color: rgba(var(--accent-gold-rgb), 0.1);
          color: var(--accent-gold-dark);
        }
        
        .color-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-top: 20px;
        }
        
        .color-swatch-card {
          padding: 14px;
          border-radius: var(--border-radius-md);
          text-align: center;
          cursor: pointer;
          border: 1px solid var(--border-color);
          background-color: var(--bg-secondary);
          transition: border-color var(--transition-fast);
        }
        
        .color-swatch-card:hover, .color-swatch-card.active {
          border-color: var(--accent-gold);
        }
        
        .color-circle {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          margin: 0 auto 10px;
          box-shadow: var(--shadow-sm);
        }
        
        .fabric-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-top: 20px;
        }
        
        .fabric-card {
          padding: 20px;
          border-radius: var(--border-radius-md);
          text-align: center;
          cursor: pointer;
          border: 1px solid var(--border-color);
          background-color: var(--bg-secondary);
          transition: all var(--transition-fast);
        }
        
        .fabric-card:hover, .fabric-card.active {
          border-color: var(--accent-gold);
          background-color: rgba(var(--accent-gold-rgb), 0.05);
        }
        
        .fabric-emoji {
          font-size: 32px;
          margin-bottom: 8px;
        }
      `}</style>

      <div className="onboard-card glass-panel fade-in slide-up">
        {/* Step dots */}
        <div className="step-indicator">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className={`indicator-dot ${step === s ? 'active' : ''}`} />
          ))}
        </div>
        
        {/* Content panel */}
        <div id="panels-wrapper" style={{ overflow: 'hidden' }}>
          {/* Step 1: Language selection */}
          <div className={`step-panel ${step === 1 ? 'active' : ''}`}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', marginBottom: '8px', textAlign: 'center' }}>Choose Language</h2>
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: '15px', marginBottom: '30px' }}>Select your preferred language. You can change this later in Settings.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '280px', margin: '40px auto 0' }}>
              <button className="btn-secondary" style={{ padding: '16px' }} onClick={() => handleLanguageSelect('en')}>English</button>
              <button className="btn-secondary" style={{ padding: '16px' }} onClick={() => handleLanguageSelect('te')}>తెలుగు</button>
              <button className="btn-secondary" style={{ padding: '16px' }} onClick={() => handleLanguageSelect('hi')}>हिंदी</button>
            </div>
          </div>
          
          {/* Step 2: Interest tags */}
          <div className={`step-panel ${step === 2 ? 'active' : ''}`}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', marginBottom: '8px' }}>Choose Interests</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Pick styles and garments you want to customize</p>
            
            <div className="tag-grid">
              {['Wedding', 'Traditional', 'Retro', 'Royal', 'Minimalist', 'Modern', 'Bridal Saree', 'Designer Blouse', 'Kurti', 'Lehenga', 'Festival Wear', 'Men Wear', 'Kids Wear', 'Office Look'].map((tag) => (
                <span 
                  key={tag} 
                  className={`interest-tag ${selectedInterests.includes(tag) ? 'active' : ''}`}
                  onClick={() => toggleInterest(tag)}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          {/* Step 3: Color Palette */}
          <div className={`step-panel ${step === 3 ? 'active' : ''}`}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', marginBottom: '8px' }}>Favorite Colors</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Select colors you wear most often</p>
            
            <div className="color-grid">
              {[
                { name: 'Gold', hex: '#C5A059' },
                { name: 'Terracotta', hex: '#B85A38' },
                { name: 'Navy', hex: '#19233C' },
                { name: 'Sage Green', hex: '#386A63' },
                { name: 'Blush', hex: '#D66885' },
                { name: 'Saffron', hex: '#E65C00' },
                { name: 'Ivory', hex: '#FAF9F6' },
                { name: 'Onyx', hex: '#1A1A1A' }
              ].map((color) => (
                <div 
                  key={color.hex} 
                  className={`color-swatch-card ${selectedColors.includes(color.hex) ? 'active' : ''}`}
                  onClick={() => toggleColor(color.hex)}
                >
                  <div className="color-circle" style={{ backgroundColor: color.hex, border: color.hex === '#FAF9F6' ? '1px solid var(--border-color)' : 'none' }}></div>
                  <h4 style={{ fontSize: '13px', fontWeight: 600 }}>{color.name}</h4>
                </div>
              ))}
            </div>
          </div>
          
          {/* Step 4: Fabrics Selector */}
          <div className={`step-panel ${step === 4 ? 'active' : ''}`}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', marginBottom: '8px' }}>Choose Fabrics</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Pick fabrics you prefer for customized design mapping</p>
            
            <div className="fabric-grid">
              {[
                { name: 'Cotton', icon: '🌿' },
                { name: 'Silk', icon: '🧶' },
                { name: 'Linen', icon: '🌾' },
                { name: 'Banarasi', icon: '✨' },
                { name: 'Khadi', icon: '🧵' },
                { name: 'Handloom', icon: '🚜' }
              ].map((fabric) => (
                <div 
                  key={fabric.name} 
                  className={`fabric-card ${selectedFabrics.includes(fabric.name.toLowerCase()) ? 'active' : ''}`}
                  onClick={() => toggleFabric(fabric.name.toLowerCase())}
                >
                  <div className="fabric-emoji">{fabric.icon}</div>
                  <h4 style={{ fontSize: '14px', fontWeight: 600 }}>{fabric.name}</h4>
                </div>
              ))}
            </div>
          </div>
          
          {/* Step 5: Finish screen */}
          <div className={`step-panel ${step === 5 ? 'active' : ''}`} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '64px', margin: '30px 0 20px', animation: 'bounce 2s infinite ease-in-out' }}>🎉</div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '32px', marginBottom: '12px' }}>You're Ready!</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', maxWidth: '400px', margin: '0 auto 30px', lineHeight: 1.6 }}>
              We have customized your feed and design options based on your selection. Let's open your personalized Dashboard.
            </p>
            <div>
              <button className="btn-primary glow-btn" onClick={handleFinish} style={{ padding: '14px 40px' }}>Open Dashboard</button>
            </div>
          </div>
        </div>
        
        {/* Footer navigations */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
          <button 
            className="btn-secondary" 
            style={{ border: 'none', visibility: step === 1 ? 'hidden' : 'visible' }} 
            onClick={() => setStep((s) => s - 1)}
          >
            Back
          </button>
          
          {step > 1 && step < 5 && (
            <button className="btn-primary" onClick={() => setStep((s) => s + 1)}>
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default OnboardingPage;

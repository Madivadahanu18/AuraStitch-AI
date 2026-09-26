import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';

interface OutletContextType {
  showToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export interface GeneratedDressConcept {
  id: string;
  imageUrl: string;
  isLiveGemini: boolean;
  errorNotice?: string | null;
  prompt: string;
  specs: {
    dressType: string;
    occasion: string;
    style: string;
    fabric: string;
    colors: string;
    pattern: string;
    additionalRequirements?: string;
    title?: string;
    conceptSummary?: string;
    craftsmanshipNotes?: string;
    stylingTips?: string;
    estimatedArtisanHours?: string;
    recommendedTrims?: string;
  };
  createdAt: string;
}

const PRESET_CONCEPTS = [
  {
    name: '👑 Royal Bridal Lehenga',
    dressType: 'Bridal Lehenga Choli',
    occasion: 'Wedding Ceremony',
    style: 'Royal Heritage & Traditional',
    fabric: 'Pure Banarasi Katan Silk & Velvet',
    colors: 'Crimson Red & Antique Gold',
    pattern: 'Intricate Zardozi & Dabka Needlework',
    additionalRequirements: 'Deep sweetheart neckline, elbow-length sleeves with floral zari borders, 16-kali heavy flared skirt with handcrafted latkan tassels.'
  },
  {
    name: '🪷 Kanchipuram Brocade Saree',
    dressType: 'Traditional Kanchipuram Saree',
    occasion: 'Festive & Auspicious Rituals',
    style: 'Regal Temple Classic',
    fabric: 'Heavy Kanchipuram Mulberry Silk',
    colors: 'Peacock Blue & Pure Gold Zari',
    pattern: 'Traditional Mayil (Peacock) & Temple Border',
    additionalRequirements: 'Contrasting magenta pallu with intricate gold jaal, heavy woven border of 6 inches width, matching silk blouse piece with sleeve motifs.'
  },
  {
    name: '✨ Imperial Flared Anarkali',
    dressType: 'Floor-Length Anarkali Gown',
    occasion: 'Sangeet & Reception',
    style: 'Contemporary Haute Couture',
    fabric: 'Silk Georgette & Organza',
    colors: 'Teal Green & Champagne Gold',
    pattern: 'Resham Threadwork & Micro Sequins',
    additionalRequirements: 'Boat neckline, sheer organza cape sleeves with scalloped borders, 48-inch full floor sweep with horsehair braided hem.'
  },
  {
    name: '🌸 Pastel Fusion Gown',
    dressType: 'Indo-Western Fusion Drape Dress',
    occasion: 'Cocktail Party & Gala',
    style: 'Modern Minimalist Elegance',
    fabric: 'Tissue Organza & Raw Silk',
    colors: 'Blush Pink & Rose Gold',
    pattern: 'Gotta Patti Geometric Accents',
    additionalRequirements: 'One-shoulder asymmetric pleated bodice, pre-draped pallu sash with delicate crystal tassels and structured side slit.'
  }
];

const DRESS_TYPES = [
  'Bridal Lehenga Choli',
  'Traditional Saree',
  'Floor-Length Anarkali Suit',
  'Indo-Western Fusion Dress',
  'Sharara / Gharara Set',
  'Designer Kurti & Palazzo',
  'Couture Evening Cape Gown',
  'Cocktail Blouse & Skirt'
];

const OCCASIONS = [
  'Wedding Ceremony (Bridal)',
  'Sangeet & Mehendi Night',
  'Reception & Cocktail Gala',
  'Festive (Diwali, Eid, Navratri)',
  'Formal Red Carpet / Event',
  'Casual Boutique / Daily Chic'
];

const STYLES = [
  'Royal Heritage & Traditional',
  'Contemporary Haute Couture',
  'Modern Minimalist Silk',
  'Regal Mughal / Nawabi',
  'Boho-Chic Luxury',
  'Romantic Vintage Floral'
];

const FABRICS = [
  'Pure Banarasi Katan Silk',
  'Kanchipuram Silk & Zari',
  'Chanderi Handloom Cotton-Silk',
  'Mulberry Silk Velvet',
  'Organza & Tissue Silk',
  'Fluid Georgette & Resham',
  'Raw Silk & Brocade'
];

const COLOR_PALETTES = [
  { name: 'Crimson Red & Antique Gold', primary: '#8B0000', secondary: '#D4AF37' },
  { name: 'Emerald Green & Champagne Gold', primary: '#1B4D3E', secondary: '#E6C687' },
  { name: 'Peacock Royal Blue & Silver', primary: '#192A56', secondary: '#DCDDE1' },
  { name: 'Pastel Blush Pink & Rose Gold', primary: '#E8A598', secondary: '#B87333' },
  { name: 'Deep Wine Maroon & Bronze', primary: '#4A1525', secondary: '#CD7F32' },
  { name: 'Ivory Cream & Sage Green', primary: '#F7F1E5', secondary: '#8FA89B' }
];

const PATTERNS = [
  'Intricate Zardozi & Dabka Needlework',
  'Pochampally Geometric Ikat Weave',
  'Gotta Patti Floral Border Work',
  'Resham Threadwork & Sequins Motif',
  'Traditional Banarasi Floral Jaal',
  'Chikankari Handwork & Mukaish'
];

const LOADING_STEPS = [
  'Interpreting garment silhouette & cut requirements...',
  'Blending handloom fabric textures and dye pigmentation...',
  'Composing high-fashion studio lighting & drape in Gemini...',
  'Rendering standalone couture dress concept (avatar-free)...'
];

export const AIDressDesigner: React.FC = () => {
  const context = useOutletContext<OutletContextType>();
  const navigate = useNavigate();

  const showToast = (msg: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    if (context?.showToast) {
      context.showToast(msg, type);
    }
  };

  // Form State
  const [dressType, setDressType] = useState<string>(DRESS_TYPES[0]);
  const [customDressType, setCustomDressType] = useState<string>('');
  const [occasion, setOccasion] = useState<string>(OCCASIONS[0]);
  const [style, setStyle] = useState<string>(STYLES[0]);
  const [fabric, setFabric] = useState<string>(FABRICS[0]);
  const [selectedColor, setSelectedColor] = useState<string>(COLOR_PALETTES[0].name);
  const [customColor, setCustomColor] = useState<string>('');
  const [pattern, setPattern] = useState<string>(PATTERNS[0]);
  const [additionalRequirements, setAdditionalRequirements] = useState<string>('');
  const [clientApiKey, setClientApiKey] = useState<string>(() => localStorage.getItem('aurastitch_gemini_key') || '');
  const [showApiKeyInput, setShowApiKeyInput] = useState<boolean>(false);

  // Generation & Output State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStepIdx, setLoadingStepIdx] = useState<number>(0);
  const [currentConcept, setCurrentConcept] = useState<GeneratedDressConcept | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Saved Collection Drawer State
  const [savedCollection, setSavedCollection] = useState<GeneratedDressConcept[]>(() => {
    try {
      const stored = localStorage.getItem('aurastitch_saved_ai_designs');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [isCollectionOpen, setIsCollectionOpen] = useState<boolean>(false);

  // Cycle loading step messages during generation
  useEffect(() => {
    let interval: any;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStepIdx((prev) => (prev + 1) % LOADING_STEPS.length);
      }, 1600);
    } else {
      setLoadingStepIdx(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // Handle Preset Quick Selection
  const applyPreset = (preset: typeof PRESET_CONCEPTS[0]) => {
    setDressType(preset.dressType);
    setOccasion(preset.occasion);
    setStyle(preset.style);
    setFabric(preset.fabric);
    setSelectedColor(preset.colors);
    setCustomColor('');
    setPattern(preset.pattern);
    setAdditionalRequirements(preset.additionalRequirements);
    showToast(`Loaded "${preset.name}" preset!`, 'info');
  };

  // Generate Dress Design Action
  const handleGenerate = async () => {
    const finalDressType = customDressType.trim() ? customDressType.trim() : dressType;
    const finalColors = customColor.trim() ? customColor.trim() : selectedColor;

    setIsLoading(true);
    setErrorMessage(null);
    setIsSaved(false);

    try {
      const response = await fetch('http://localhost:5000/api/ai/customer/generate-dress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dressType: finalDressType,
          occasion,
          style,
          fabric,
          colors: finalColors,
          pattern,
          additionalRequirements,
          apiKey: clientApiKey.trim() || undefined
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error (${response.status})`);
      }

      const data: GeneratedDressConcept = await response.json();
      setCurrentConcept(data);

      if (data.isLiveGemini) {
        showToast('✨ Bespoke couture concept generated with Gemini AI!', 'success');
      } else {
        showToast('✨ Concept created with curated couture styling studio!', 'info');
      }
    } catch (err: any) {
      console.error('Dress generation failed:', err);
      setErrorMessage(
        err.message || 'Unable to connect to the AI design server. Please check your connection and try again.'
      );
      showToast('Design generation encountered an issue. See details below.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Save to Collection
  const handleSaveDesign = () => {
    if (!currentConcept) return;

    const alreadySaved = savedCollection.some((item) => item.id === currentConcept.id);
    if (alreadySaved) {
      showToast('This concept is already in your saved collection.', 'info');
      setIsSaved(true);
      return;
    }

    const updated = [currentConcept, ...savedCollection];
    setSavedCollection(updated);
    try {
      localStorage.setItem('aurastitch_saved_ai_designs', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to persist design to localStorage:', e);
    }
    setIsSaved(true);
    showToast('Saved to your Couture Collection! 💾', 'success');
  };

  // Download Concept Image
  const handleDownload = () => {
    if (!currentConcept?.imageUrl) return;

    try {
      const link = document.createElement('a');
      link.href = currentConcept.imageUrl;
      link.download = `AuraStitch-${(currentConcept.specs.dressType || 'Design')
        .replace(/\s+/g, '-')}-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('High-resolution concept downloaded! ⬇', 'success');
    } catch (err) {
      window.open(currentConcept.imageUrl, '_blank');
      showToast('Opening high-res image in new tab...', 'info');
    }
  };

  // Save API Key locally
  const handleSaveApiKey = (key: string) => {
    setClientApiKey(key);
    localStorage.setItem('aurastitch_gemini_key', key);
    showToast('Gemini API Key updated for this session!', 'success');
    setShowApiKeyInput(false);
  };

  return (
    <div className="ai-dress-designer-container fade-in" style={{ paddingBottom: '80px' }}>
      {/* Header Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '28px 32px',
          marginBottom: '28px',
          borderRadius: 'var(--border-radius-lg)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          background: 'linear-gradient(135deg, rgba(255, 249, 245, 0.95), rgba(248, 236, 227, 0.85))',
          borderLeft: '5px solid var(--accent-gold)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontSize: '24px' }}>✨</span>
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '28px',
                fontWeight: 700,
                color: 'var(--text-primary)',
                margin: 0
              }}
            >
              AI Dress Designer
            </h1>
            <span
              className="badge"
              style={{
                backgroundColor: 'rgba(212, 163, 115, 0.2)',
                color: 'var(--accent-gold-dark)',
                fontSize: '11px',
                fontWeight: 600,
                padding: '4px 10px',
                borderRadius: '12px'
              }}
            >
              Gemini Couture Visualizer
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '14px', maxWidth: '680px' }}>
            Describe your dream bespoke garment. Gemini generates a photorealistic visual concept focusing exclusively
            on luxury dress craftsmanship, silhouette drape, and intricate embroidery.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            className="btn-outline"
            style={{ fontSize: '13px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}
            onClick={() => setIsCollectionOpen(true)}
          >
            📂 Saved Concepts ({savedCollection.length})
          </button>
          <button
            className="btn-outline"
            style={{ fontSize: '13px', padding: '8px 14px' }}
            onClick={() => setShowApiKeyInput(!showApiKeyInput)}
            title="Configure Gemini API Key"
          >
            ⚙ Gemini Key
          </button>
        </div>
      </div>

      {/* Optional Gemini API Key Drawer */}
      {showApiKeyInput && (
        <div
          className="glass-panel fade-in"
          style={{
            padding: '20px 24px',
            marginBottom: '24px',
            borderRadius: 'var(--border-radius-md)',
            border: '1px solid var(--accent-gold)'
          }}
        >
          <h4 style={{ margin: '0 0 8px 0', fontSize: '15px' }}>Custom Gemini API Key</h4>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
            Provide your personal Google Gemini API key to run live image generation directly via your own quota. If
            left blank, the backend environment key or curated haute couture styling concepts will be used.
          </p>
          <div style={{ display: 'flex', gap: '10px', maxWidth: '600px' }}>
            <input
              type="password"
              className="form-input"
              placeholder="AIzaSy..."
              value={clientApiKey}
              onChange={(e) => setClientApiKey(e.target.value)}
              style={{ flexGrow: 1 }}
            />
            <button className="btn-primary" onClick={() => handleSaveApiKey(clientApiKey)}>
              Save Key
            </button>
          </div>
        </div>
      )}

      {/* Quick Inspiration Presets */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Quick Inspiration Presets:
          </span>
        </div>
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '6px' }}>
          {PRESET_CONCEPTS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => applyPreset(preset)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: 500,
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all var(--transition-fast)',
                boxShadow: 'var(--shadow-sm)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-gold)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column Main Workspace */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '28px',
          alignItems: 'start'
        }}
      >
        {/* Left Column: Form Controls */}
        <div
          className="glass-panel"
          style={{
            padding: '28px',
            borderRadius: 'var(--border-radius-lg)',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '20px',
              margin: '0 0 20px 0',
              paddingBottom: '12px',
              borderBottom: '1px solid var(--border-color)'
            }}
          >
            Couture Design Specifications
          </h3>

          {/* 1. Dress Type */}
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label" style={{ fontWeight: 600, fontSize: '14px', marginBottom: '8px' }}>
              1. Dress Type & Silhouette
            </label>
            <select
              className="form-input"
              value={dressType}
              onChange={(e) => {
                setDressType(e.target.value);
                setCustomDressType('');
              }}
              style={{ appearance: 'auto', marginBottom: '8px' }}
            >
              {DRESS_TYPES.map((dt) => (
                <option key={dt} value={dt}>
                  {dt}
                </option>
              ))}
            </select>
            <input
              type="text"
              className="form-input"
              placeholder="Or specify custom dress cut (e.g. Asymmetric Corset Lehenga)..."
              value={customDressType}
              onChange={(e) => setCustomDressType(e.target.value)}
              style={{ fontSize: '13px' }}
            />
          </div>

          {/* 2. Occasion */}
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label" style={{ fontWeight: 600, fontSize: '14px', marginBottom: '8px' }}>
              2. Occasion
            </label>
            <select
              className="form-input"
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              style={{ appearance: 'auto' }}
            >
              {OCCASIONS.map((occ) => (
                <option key={occ} value={occ}>
                  {occ}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Style */}
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label" style={{ fontWeight: 600, fontSize: '14px', marginBottom: '8px' }}>
              3. Style & Aesthetic
            </label>
            <select
              className="form-input"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              style={{ appearance: 'auto' }}
            >
              {STYLES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Fabric */}
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label" style={{ fontWeight: 600, fontSize: '14px', marginBottom: '8px' }}>
              4. Fabric & Textile Base
            </label>
            <select
              className="form-input"
              value={fabric}
              onChange={(e) => setFabric(e.target.value)}
              style={{ appearance: 'auto' }}
            >
              {FABRICS.map((fb) => (
                <option key={fb} value={fb}>
                  {fb}
                </option>
              ))}
            </select>
          </div>

          {/* 5. Colors */}
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label" style={{ fontWeight: 600, fontSize: '14px', marginBottom: '8px' }}>
              5. Colors & Hues
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '10px' }}>
              {COLOR_PALETTES.map((cp) => {
                const isSelected = selectedColor === cp.name && !customColor;
                return (
                  <div
                    key={cp.name}
                    onClick={() => {
                      setSelectedColor(cp.name);
                      setCustomColor('');
                    }}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 'var(--border-radius-sm)',
                      border: isSelected ? '2px solid var(--accent-gold)' : '1px solid var(--border-color)',
                      backgroundColor: isSelected ? 'rgba(212, 163, 115, 0.12)' : 'var(--bg-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '3px' }}>
                      <span
                        style={{
                          width: '14px',
                          height: '14px',
                          borderRadius: '50%',
                          backgroundColor: cp.primary,
                          boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                        }}
                      />
                      <span
                        style={{
                          width: '14px',
                          height: '14px',
                          borderRadius: '50%',
                          backgroundColor: cp.secondary,
                          boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: isSelected ? 600 : 400 }}>{cp.name}</span>
                  </div>
                );
              })}
            </div>
            <input
              type="text"
              className="form-input"
              placeholder="Or type custom color scheme (e.g. Lavender & Champagne Gold)..."
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              style={{ fontSize: '13px' }}
            />
          </div>

          {/* 6. Pattern */}
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label" style={{ fontWeight: 600, fontSize: '14px', marginBottom: '8px' }}>
              6. Pattern & Embellishment
            </label>
            <select
              className="form-input"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              style={{ appearance: 'auto' }}
            >
              {PATTERNS.map((pt) => (
                <option key={pt} value={pt}>
                  {pt}
                </option>
              ))}
            </select>
          </div>

          {/* 7. Additional Requirements */}
          <div className="form-group" style={{ marginBottom: '28px' }}>
            <label className="form-label" style={{ fontWeight: 600, fontSize: '14px', marginBottom: '8px' }}>
              7. Additional Requirements & Custom Accents
            </label>
            <textarea
              className="form-input"
              rows={4}
              placeholder="Describe neckline depth, sleeve length, flare fullness, sheer accents, custom latkans, border width, or trailing back pallu..."
              value={additionalRequirements}
              onChange={(e) => setAdditionalRequirements(e.target.value)}
              style={{ resize: 'vertical', fontSize: '13px', lineHeight: '1.5' }}
            />
          </div>

          {/* Generate Button */}
          <button
            type="button"
            className="btn-primary"
            disabled={isLoading}
            onClick={handleGenerate}
            style={{
              width: '100%',
              padding: '16px',
              fontSize: '16px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-gold-dark))',
              color: '#FFFFFF',
              boxShadow: 'var(--shadow-md)',
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? (
              <>
                <span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} />
                <span>Designing Visual Concept...</span>
              </>
            ) : (
              <>
                <span>✨ Generate Dress Design</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Visual Concept Stage & Specs */}
        <div>
          {/* Loading State Display */}
          {isLoading && (
            <div
              className="glass-panel fade-in"
              style={{
                padding: '48px 32px',
                borderRadius: 'var(--border-radius-lg)',
                minHeight: '520px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(250, 247, 242, 0.95))',
                border: '2px dashed var(--accent-gold)'
              }}
            >
              <div
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  background: 'rgba(212, 163, 115, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '42px',
                  marginBottom: '24px',
                  animation: 'pulse 2s infinite ease-in-out'
                }}
              >
                👗
              </div>

              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', margin: '0 0 12px 0' }}>
                Gemini AI Is Tailoring Your Design
              </h3>

              <div
                style={{
                  maxWidth: '380px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '28px'
                }}
              >
                <p
                  key={loadingStepIdx}
                  className="fade-in"
                  style={{
                    color: 'var(--accent-gold-dark)',
                    fontWeight: 500,
                    fontSize: '14px',
                    margin: 0
                  }}
                >
                  {LOADING_STEPS[loadingStepIdx]}
                </p>
              </div>

              {/* Shimmer Placeholder Box */}
              <div
                style={{
                  width: '260px',
                  height: '320px',
                  borderRadius: 'var(--border-radius-md)',
                  background: 'linear-gradient(90deg, #f0e6dd 25%, #f9f5f0 50%, #f0e6dd 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.8s infinite',
                  boxShadow: 'var(--shadow-sm)'
                }}
              />
            </div>
          )}

          {/* Error State Display */}
          {!isLoading && errorMessage && (
            <div
              className="glass-panel fade-in"
              style={{
                padding: '36px 32px',
                borderRadius: 'var(--border-radius-lg)',
                borderLeft: '5px solid var(--accent-copper)',
                backgroundColor: 'rgba(255, 245, 245, 0.9)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <span style={{ fontSize: '28px', color: 'var(--accent-copper)' }}>⚠</span>
                <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--accent-copper)' }}>
                  Design Generation Notice
                </h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
                {errorMessage}
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button className="btn-primary" onClick={handleGenerate}>
                  🔄 Try Again
                </button>
                <button className="btn-outline" onClick={() => setShowApiKeyInput(true)}>
                  ⚙ Configure Gemini API Key
                </button>
              </div>
            </div>
          )}

          {/* Success / Concept Result Display */}
          {!isLoading && !errorMessage && currentConcept && (
            <div className="fade-in">
              {/* Image Preview Card */}
              <div
                className="glass-panel"
                style={{
                  padding: '20px',
                  borderRadius: 'var(--border-radius-lg)',
                  boxShadow: 'var(--shadow-lg)',
                  marginBottom: '24px',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    maxHeight: '520px',
                    borderRadius: 'var(--border-radius-md)',
                    overflow: 'hidden',
                    backgroundColor: '#1A1816',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <img
                    src={currentConcept.imageUrl}
                    alt={currentConcept.specs.title || 'Generated Dress Design Concept'}
                    style={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: '520px',
                      objectFit: 'contain',
                      display: 'block'
                    }}
                  />

                  {/* Overlaid Badges */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '16px',
                      left: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}
                  >
                    <span
                      style={{
                        padding: '6px 12px',
                        backgroundColor: 'rgba(0, 0, 0, 0.75)',
                        backdropFilter: 'blur(8px)',
                        color: '#FFF',
                        fontSize: '11px',
                        fontWeight: 600,
                        borderRadius: '14px',
                        letterSpacing: '0.5px'
                      }}
                    >
                      ✨ Standalone Garment Concept
                    </span>
                    <span
                      style={{
                        padding: '4px 10px',
                        backgroundColor: currentConcept.isLiveGemini
                          ? 'rgba(46, 111, 87, 0.85)'
                          : 'rgba(212, 163, 115, 0.85)',
                        color: '#FFF',
                        fontSize: '11px',
                        fontWeight: 600,
                        borderRadius: '14px'
                      }}
                    >
                      {currentConcept.isLiveGemini ? '🤖 Live Gemini 2.5 Image' : '🏛 Studio Concept Render'}
                    </span>
                  </div>
                </div>

                {/* Concept Action Controls */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px',
                    marginTop: '18px',
                    paddingTop: '16px',
                    borderTop: '1px solid var(--border-color)'
                  }}
                >
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      className="btn-primary"
                      onClick={handleDownload}
                      style={{
                        padding: '10px 18px',
                        fontSize: '13px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      ⬇ Download Concept
                    </button>
                    <button
                      className="btn-outline"
                      onClick={handleSaveDesign}
                      style={{
                        padding: '10px 18px',
                        fontSize: '13px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        borderColor: isSaved ? 'var(--accent-teal)' : undefined,
                        color: isSaved ? 'var(--accent-teal)' : undefined
                      }}
                    >
                      {isSaved ? '✓ Saved to Collection' : '💾 Save Concept'}
                    </button>
                  </div>

                  <button
                    className="btn-outline"
                    onClick={handleGenerate}
                    style={{
                      padding: '10px 16px',
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    🔄 Regenerate Variation
                  </button>
                </div>
              </div>

              {/* Technical Couture Specification Card */}
              <div
                className="glass-panel"
                style={{
                  padding: '24px 28px',
                  borderRadius: 'var(--border-radius-lg)',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                <div style={{ marginBottom: '16px' }}>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent-gold)' }}>
                    Couture Specification Sheet
                  </span>
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '22px',
                      color: 'var(--text-primary)',
                      margin: '4px 0 10px 0'
                    }}
                  >
                    {currentConcept.specs.title || `${currentConcept.specs.colors} ${currentConcept.specs.dressType}`}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                    {currentConcept.specs.conceptSummary}
                  </p>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '14px',
                    margin: '20px 0',
                    padding: '16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.6)',
                    borderRadius: 'var(--border-radius-md)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Fabric & Sheen</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, marginTop: '2px' }}>{currentConcept.specs.fabric}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Silhouette & Occasion</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, marginTop: '2px' }}>
                      {currentConcept.specs.style} • {currentConcept.specs.occasion}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Embroidery / Motif</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, marginTop: '2px' }}>{currentConcept.specs.pattern}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Artisan Handcraft Time</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, marginTop: '2px', color: 'var(--accent-gold-dark)' }}>
                      {currentConcept.specs.estimatedArtisanHours || '36–48 Hours'}
                    </div>
                  </div>
                </div>

                {/* Craftsmanship Notes */}
                {currentConcept.specs.craftsmanshipNotes && (
                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                      🧵 Tailoring & Weaving Notes:
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                      {currentConcept.specs.craftsmanshipNotes}
                    </div>
                  </div>
                )}

                {/* Recommended Trims */}
                {currentConcept.specs.recommendedTrims && (
                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                      💎 Recommended Trims & Laces:
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                      {currentConcept.specs.recommendedTrims}
                    </div>
                  </div>
                )}

                {/* Styling & Jewelry Advice */}
                {currentConcept.specs.stylingTips && (
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                      ✨ Pairing & Jewelry Styling Tips:
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                      {currentConcept.specs.stylingTips}
                    </div>
                  </div>
                )}

                {/* Action Link to Tailor / Order Timeline */}
                <div
                  style={{
                    paddingTop: '16px',
                    borderTop: '1px solid var(--border-color)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                >
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    Ready to bring this concept to life with our master tailors?
                  </span>
                  <button
                    className="btn-primary"
                    style={{ fontSize: '13px', padding: '10px 18px' }}
                    onClick={() => {
                      showToast('Sending design concept to Tailor Stitching Request...', 'info');
                      navigate('/customer');
                    }}
                  >
                    Request Custom Tailoring →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Empty / Initial State Guide */}
          {!isLoading && !errorMessage && !currentConcept && (
            <div
              className="glass-panel"
              style={{
                padding: '48px 32px',
                borderRadius: 'var(--border-radius-lg)',
                minHeight: '520px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(250, 247, 242, 0.85))'
              }}
            >
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'rgba(212, 163, 115, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '36px',
                  marginBottom: '20px'
                }}
              >
                🎨
              </div>

              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', margin: '0 0 10px 0' }}>
                Your Bespoke Design Canvas Awaits
              </h3>
              <p
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '14px',
                  maxWidth: '420px',
                  lineHeight: '1.6',
                  marginBottom: '28px'
                }}
              >
                Configure your dress silhouette, fabric type, natural dyes, and tailoring embellishments on the left, then
                tap <strong>"Generate Dress Design"</strong> to generate a haute couture concept visual.
              </p>

              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  flexWrap: 'wrap',
                  justifyContent: 'center'
                }}
              >
                {PRESET_CONCEPTS.slice(0, 2).map((p) => (
                  <button
                    key={p.name}
                    className="btn-outline"
                    style={{ fontSize: '12px', padding: '8px 14px' }}
                    onClick={() => applyPreset(p)}
                  >
                    Try {p.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Saved Concepts Drawer / Modal */}
      {isCollectionOpen && (
        <div
          className="modal-overlay fade-in"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setIsCollectionOpen(false)}
        >
          <div
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '800px',
              maxHeight: '85vh',
              overflowY: 'auto',
              borderRadius: 'var(--border-radius-lg)',
              padding: '30px',
              backgroundColor: 'var(--bg-primary)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', margin: 0 }}>
                Saved Couture Concepts ({savedCollection.length})
              </h3>
              <button
                className="btn-outline"
                style={{ padding: '6px 12px', fontSize: '13px' }}
                onClick={() => setIsCollectionOpen(false)}
              >
                ✕ Close
              </button>
            </div>

            {savedCollection.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
                No saved designs yet. Generate a dress design and click "Save Concept" to keep it here!
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
                {savedCollection.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      borderRadius: 'var(--border-radius-md)',
                      overflow: 'hidden',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-secondary)',
                      boxShadow: 'var(--shadow-sm)',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.specs.title || 'Saved Concept'}
                      style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                    />
                    <div style={{ padding: '12px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                          {item.specs.title || item.specs.dressType}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {item.specs.fabric} • {item.specs.colors}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                        <button
                          className="btn-outline"
                          style={{ padding: '6px', fontSize: '11px', flex: 1 }}
                          onClick={() => {
                            setCurrentConcept(item);
                            setIsSaved(true);
                            setIsCollectionOpen(false);
                            showToast('Loaded saved concept to main view.', 'info');
                          }}
                        >
                          View
                        </button>
                        <button
                          className="btn-primary"
                          style={{ padding: '6px', fontSize: '11px', flex: 1 }}
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = item.imageUrl;
                            link.download = `AuraStitch-${item.id}.jpg`;
                            link.click();
                          }}
                        >
                          ⬇ Download
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIDressDesigner;

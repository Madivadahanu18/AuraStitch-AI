import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';

interface OutletContextType {
  showToast?: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export interface TailorGeneratedConcept {
  id: string;
  imageUrl: string;
  isLiveGemini: boolean;
  errorNotice?: string | null;
  prompt: string;
  inputs: {
    garmentType: string;
    fabric: string;
    color: string;
    style: string;
    occasion: string;
    embroidery: string;
    additionalDescription: string;
  };
  blueprint: {
    jobTitle: string;
    garmentArchitecture: string;
    yardageMatrix: {
      mainFabric: string;
      liningFabric: string;
      interfacingCanvas: string;
    };
    stitchAndNeedleSpecs: {
      needleType: string;
      stitchDensity: string;
      seamAllowance: string;
    };
    embroideryExecutionGuide: string;
    assemblySequence: string[];
    labourBreakdown: {
      cuttingHours: string;
      embroideryHours: string;
      stitchingHours: string;
      finishingHours: string;
    };
    qualityChecklist: string[];
  };
  createdAt: string;
}

const ATELIER_PRESETS = [
  {
    name: '✂ Princess-Cut Bridal Blouse',
    garmentType: 'Bridal Blouse with Padded Cups',
    fabric: 'Heavy Banarasi Katan Silk with Gold Zari',
    color: 'Crimson Red & Antique Gold',
    style: 'Deep Sweetheart Neck with 4-Dart Princess Cut',
    occasion: 'Bridal Ceremony',
    embroidery: 'Heavy Zardozi Needlework along Neckline & 10.5" Sleeves',
    additionalDescription: 'Include 2-inch side seam alteration margins, concealed side zipper, hand-tied gold dori latkan tassels, and soft cotton-silk inner lining.'
  },
  {
    name: '🧥 Structured Royal Bandhgala',
    garmentType: 'Bespoke Royal Bandhgala Sherwani',
    fabric: 'Matte Italian Raw Silk with Brocade Lining',
    color: 'Midnight Navy & Burnished Gold',
    style: 'Structured Mandarin Collar with Chest Welt Pocket',
    occasion: 'Groom / Formal Gala',
    embroidery: 'Intricate Resham Threadwork & Metallic Piping',
    additionalDescription: 'Chest canvas interlining for structured drape, double vents on back, fabric-covered shank buttons, and reinforced armhole pitch.'
  },
  {
    name: '✨ Flared Anarkali with Can-Can',
    garmentType: 'Floor-Length Anarkali Coat & Dress',
    fabric: 'Silk Georgette with Pure Shantoon Lining',
    color: 'Emerald Green & Champagne Gold',
    style: '16-Kali Kalidar Flare with Piped Princess Seams',
    occasion: 'Sangeet & Reception',
    embroidery: 'Gotta Patti Borders & Mirror Accents',
    additionalDescription: 'Horsehair braid hem finish for dramatic 4-meter flare, detachable can-can mesh underskirt, and sheer organza cuff extensions.'
  },
  {
    name: '👔 Indo-Western Velvet Tuxedo',
    garmentType: 'Indo-Western Tuxedo Jacket',
    fabric: 'Micro-Velvet with Pure Silk Satin Facings',
    color: 'Wine Maroon & Black Satin',
    style: 'Shawl Lapel Single-Button Cut with Asymmetric Slit',
    occasion: 'Cocktail & Red Carpet',
    embroidery: 'Subtle Tone-on-Tone Bugle Bead Lapel Accents',
    additionalDescription: 'Hand-basted chest canvas, satin piped pockets, double jetted besom pockets, and cupro breathable lining.'
  }
];

const GARMENT_TYPES = [
  'Bridal Blouse with Padded Cups',
  'Bespoke Royal Bandhgala Sherwani',
  'Floor-Length Anarkali Coat & Dress',
  'Indo-Western Tuxedo Jacket',
  'Designer Kurti with Cigarette Pants',
  'Sharara / Gharara Suit with Peplum',
  'Waistcoat / Nehru Jacket',
  'Contemporary Draped Gown'
];

const FABRICS = [
  'Heavy Banarasi Katan Silk',
  'Pure Mulberry Raw Silk',
  'Chanderi Handloom Cotton-Silk',
  'Micro-Velvet with Satin Facings',
  'Silk Georgette & Shantoon Lining',
  'Italian Wool & Cashmere Blend',
  'Pure Brocade Tissue Silk',
  'Organic Tussar Handwoven Silk'
];

const TAILOR_COLORS = [
  'Crimson Red & Antique Gold',
  'Midnight Navy & Burnished Gold',
  'Emerald Green & Champagne',
  'Wine Maroon & Bronze',
  'Peacock Blue & Pure Silver',
  'Ivory White & Rose Gold',
  'Charcoal Slate & Sterling Silver',
  'Warm Copper Terracotta & Gold'
];

const STYLES = [
  'Princess Cut with Deep Sweetheart Neck',
  'Structured Mandarin Collar (Nehru Cut)',
  '16-Kali Kalidar Flared Flare',
  'Shawl Lapel Single-Button Asymmetric',
  'Double-Breasted Royal Silhouette',
  'Angrakha Overlapping Wrap Style',
  'Corset-Back Contoured Bodice',
  'Contemporary Straight Cut with High Slits'
];

const OCCASIONS = [
  'Bridal / Wedding Ceremony',
  'Groom & Groomsmen Attire',
  'Sangeet & Mehendi Celebration',
  'Reception & Cocktail Gala',
  'Festive Haute Couture',
  'Formal Diplomatic / Black Tie'
];

const EMBROIDERY_OPTIONS = [
  'Heavy Zardozi Needlework & Dabka Wire',
  'Hand-Piped Borders with French Knots',
  'Intricate Resham Thread & Micro Sequins',
  'Gotta Patti Borders & Floral Applique',
  'Tone-on-Tone Aari Needlework',
  'Chikankari Hand Stitches with Mukaish'
];

const TAILOR_LOADING_STEPS = [
  'Drafting anatomical pattern geometry and seam allowances...',
  'Calculating fabric yardage, lining matrix, and interlining canvas...',
  'Engineering needle gauges, thread tension, and SPI standards...',
  'Composing bespoke atelier garment concept in Gemini AI...'
];

export const TailorAIDesigner: React.FC = () => {
  const context = useOutletContext<OutletContextType>();
  const navigate = useNavigate();

  const showToast = (msg: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    if (context?.showToast) {
      context.showToast(msg, type);
    }
  };

  // Inputs
  const [garmentType, setGarmentType] = useState<string>(GARMENT_TYPES[0]);
  const [customGarmentType, setCustomGarmentType] = useState<string>('');
  const [fabric, setFabric] = useState<string>(FABRICS[0]);
  const [customFabric, setCustomFabric] = useState<string>('');
  const [color, setColor] = useState<string>(TAILOR_COLORS[0]);
  const [customColor, setCustomColor] = useState<string>('');
  const [style, setStyle] = useState<string>(STYLES[0]);
  const [customStyle, setCustomStyle] = useState<string>('');
  const [occasion, setOccasion] = useState<string>(OCCASIONS[0]);
  const [embroidery, setEmbroidery] = useState<string>(EMBROIDERY_OPTIONS[0]);
  const [customEmbroidery, setCustomEmbroidery] = useState<string>('');
  const [additionalDescription, setAdditionalDescription] = useState<string>('');

  // States
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStepIdx, setLoadingStepIdx] = useState<number>(0);
  const [currentConcept, setCurrentConcept] = useState<TailorGeneratedConcept | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Saved Workshop Collection
  const [savedCollection, setSavedCollection] = useState<TailorGeneratedConcept[]>(() => {
    try {
      const stored = localStorage.getItem('aurastitch_saved_tailor_concepts');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [isCollectionOpen, setIsCollectionOpen] = useState<boolean>(false);

  // Loading Steps Cycling
  useEffect(() => {
    let interval: any;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStepIdx((prev) => (prev + 1) % TAILOR_LOADING_STEPS.length);
      }, 1600);
    } else {
      setLoadingStepIdx(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // Apply Atelier Preset
  const applyPreset = (preset: typeof ATELIER_PRESETS[0]) => {
    setGarmentType(preset.garmentType);
    setCustomGarmentType('');
    setFabric(preset.fabric);
    setCustomFabric('');
    setColor(preset.color);
    setCustomColor('');
    setStyle(preset.style);
    setCustomStyle('');
    setOccasion(preset.occasion);
    setEmbroidery(preset.embroidery);
    setCustomEmbroidery('');
    setAdditionalDescription(preset.additionalDescription);
    showToast(`Loaded atelier preset: ${preset.name}`, 'info');
  };

  // Generate Design Action
  const handleGenerate = async () => {
    const finalGarment = customGarmentType.trim() ? customGarmentType.trim() : garmentType;
    const finalFabric = customFabric.trim() ? customFabric.trim() : fabric;
    const finalColor = customColor.trim() ? customColor.trim() : color;
    const finalStyle = customStyle.trim() ? customStyle.trim() : style;
    const finalEmbroidery = customEmbroidery.trim() ? customEmbroidery.trim() : embroidery;

    setIsLoading(true);
    setErrorMessage(null);
    setIsSaved(false);

    try {
      const response = await fetch('http://localhost:5000/api/ai/tailor/generate-design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          garmentType: finalGarment,
          fabric: finalFabric,
          color: finalColor,
          style: finalStyle,
          occasion,
          embroidery: finalEmbroidery,
          additionalDescription
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error (${response.status})`);
      }

      const data: TailorGeneratedConcept = await response.json();
      setCurrentConcept(data);

      if (data.isLiveGemini) {
        showToast('✨ Bespoke tailoring concept generated with Gemini AI!', 'success');
      } else {
        showToast('✨ Atelier blueprint generated with master tailoring specifications!', 'info');
      }
    } catch (err: any) {
      console.error('Tailor design generation failed:', err);
      setErrorMessage(
        err.message || 'Unable to connect to the Tailor AI server. Please verify backend service.'
      );
      showToast('Tailoring assistant encountered an issue.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Save to Workshop Portfolio
  const handleSave = () => {
    if (!currentConcept) return;

    const alreadySaved = savedCollection.some((item) => item.id === currentConcept.id);
    if (alreadySaved) {
      showToast('This tailoring project is already in your workshop collection.', 'info');
      setIsSaved(true);
      return;
    }

    const updated = [currentConcept, ...savedCollection];
    setSavedCollection(updated);
    try {
      localStorage.setItem('aurastitch_saved_tailor_concepts', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
    setIsSaved(true);
    showToast('Saved to Atelier Workshop Portfolio! 💾', 'success');
  };

  // Download Visual Concept
  const handleDownload = () => {
    if (!currentConcept?.imageUrl) return;

    try {
      const link = document.createElement('a');
      link.href = currentConcept.imageUrl;
      link.download = `TailorJob-${(currentConcept.inputs.garmentType || 'Garment')
        .replace(/\s+/g, '-')}-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Atelier visual concept downloaded! ⬇', 'success');
    } catch {
      window.open(currentConcept.imageUrl, '_blank');
    }
  };

  // Print Tailor Job Card
  const handlePrintJobCard = () => {
    window.print();
  };

  return (
    <div className="tailor-ai-designer fade-in" style={{ paddingBottom: '90px' }}>
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
          background: 'linear-gradient(135deg, rgba(250, 247, 242, 0.95), rgba(245, 239, 230, 0.9))',
          borderLeft: '5px solid var(--accent-gold)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontSize: '26px' }}>✂</span>
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '28px',
                fontWeight: 800,
                color: 'var(--text-primary)',
                margin: 0
              }}
            >
              Tailor AI Garment & Material Assistant
            </h1>
            <span
              className="badge"
              style={{
                backgroundColor: 'rgba(200, 155, 60, 0.18)',
                color: 'var(--accent-gold-dark)',
                fontSize: '11px',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: '12px'
              }}
            >
              Master Pattern Cutter & Stitching Lab
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '14px', maxWidth: '720px' }}>
            Generate innovative garment construction concepts, fabric pairings, pattern cutting architectures, and yardage estimations specifically engineered for master tailors and bespoke boutiques.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            className="btn-outline"
            style={{ fontSize: '13px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}
            onClick={() => setIsCollectionOpen(true)}
          >
            📂 Workshop Projects ({savedCollection.length})
          </button>
          <button
            className="btn-outline"
            style={{ fontSize: '13px', padding: '8px 14px' }}
            onClick={() => navigate('/tailor')}
          >
            ← Back to Orders
          </button>
        </div>
      </div>

      {/* Quick Atelier Presets */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            ⚡ Atelier Starting Presets:
          </span>
        </div>
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '6px' }}>
          {ATELIER_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => applyPreset(preset)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: 600,
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
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '28px',
          alignItems: 'start'
        }}
      >
        {/* Left Column: Tailor Inputs */}
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
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>📐</span> Garment & Pattern Blueprint Inputs
          </h3>

          {/* 1. Garment Type */}
          <div className="form-group" style={{ marginBottom: '18px' }}>
            <label className="form-label" style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px' }}>
              1. Garment Type
            </label>
            <select
              className="form-input"
              value={garmentType}
              onChange={(e) => {
                setGarmentType(e.target.value);
                setCustomGarmentType('');
              }}
              style={{ appearance: 'auto', marginBottom: '8px' }}
            >
              {GARMENT_TYPES.map((gt) => (
                <option key={gt} value={gt}>
                  {gt}
                </option>
              ))}
            </select>
            <input
              type="text"
              className="form-input"
              placeholder="Or custom garment (e.g. Asymmetrical Tuxedo Kurta)..."
              value={customGarmentType}
              onChange={(e) => setCustomGarmentType(e.target.value)}
              style={{ fontSize: '13px' }}
            />
          </div>

          {/* 2. Fabric / Material */}
          <div className="form-group" style={{ marginBottom: '18px' }}>
            <label className="form-label" style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px' }}>
              2. Fabric / Material
            </label>
            <select
              className="form-input"
              value={fabric}
              onChange={(e) => {
                setFabric(e.target.value);
                setCustomFabric('');
              }}
              style={{ appearance: 'auto', marginBottom: '8px' }}
            >
              {FABRICS.map((fb) => (
                <option key={fb} value={fb}>
                  {fb}
                </option>
              ))}
            </select>
            <input
              type="text"
              className="form-input"
              placeholder="Or specific weave / blend (e.g. 80-Count Chanderi Silk Cotton)..."
              value={customFabric}
              onChange={(e) => setCustomFabric(e.target.value)}
              style={{ fontSize: '13px' }}
            />
          </div>

          {/* 3. Color */}
          <div className="form-group" style={{ marginBottom: '18px' }}>
            <label className="form-label" style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px' }}>
              3. Color & Dye Combination
            </label>
            <select
              className="form-input"
              value={color}
              onChange={(e) => {
                setColor(e.target.value);
                setCustomColor('');
              }}
              style={{ appearance: 'auto', marginBottom: '8px' }}
            >
              {TAILOR_COLORS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input
              type="text"
              className="form-input"
              placeholder="Or exact shade (e.g. Royal Oxford Navy with Antique Brass Zari)..."
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              style={{ fontSize: '13px' }}
            />
          </div>

          {/* 4. Style */}
          <div className="form-group" style={{ marginBottom: '18px' }}>
            <label className="form-label" style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px' }}>
              4. Tailoring Style & Silhouette Architecture
            </label>
            <select
              className="form-input"
              value={style}
              onChange={(e) => {
                setStyle(e.target.value);
                setCustomStyle('');
              }}
              style={{ appearance: 'auto', marginBottom: '8px' }}
            >
              {STYLES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
            <input
              type="text"
              className="form-input"
              placeholder="Or custom seam structure (e.g. Armhole Princess Cut with High Back Collar)..."
              value={customStyle}
              onChange={(e) => setCustomStyle(e.target.value)}
              style={{ fontSize: '13px' }}
            />
          </div>

          {/* 5. Occasion */}
          <div className="form-group" style={{ marginBottom: '18px' }}>
            <label className="form-label" style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px' }}>
              5. Occasion & Client Usage
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

          {/* 6. Embroidery / Stitching Requirements */}
          <div className="form-group" style={{ marginBottom: '18px' }}>
            <label className="form-label" style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px' }}>
              6. Embroidery / Stitching Requirements
            </label>
            <select
              className="form-input"
              value={embroidery}
              onChange={(e) => {
                setEmbroidery(e.target.value);
                setCustomEmbroidery('');
              }}
              style={{ appearance: 'auto', marginBottom: '8px' }}
            >
              {EMBROIDERY_OPTIONS.map((emb) => (
                <option key={emb} value={emb}>
                  {emb}
                </option>
              ))}
            </select>
            <input
              type="text"
              className="form-input"
              placeholder="Or detailed needlework requirement (e.g. 2.5-inch collar Zari with pearl piping)..."
              value={customEmbroidery}
              onChange={(e) => setCustomEmbroidery(e.target.value)}
              style={{ fontSize: '13px' }}
            />
          </div>

          {/* 7. Additional Description */}
          <div className="form-group" style={{ marginBottom: '26px' }}>
            <label className="form-label" style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px' }}>
              7. Additional Description & Atelier Notes
            </label>
            <textarea
              className="form-input"
              rows={4}
              placeholder="e.g. 2-inch side seam margins for alterations, padded bust cups, double vent back for sherwani, concealed side zipper, hook & eye placket with interlining..."
              value={additionalDescription}
              onChange={(e) => setAdditionalDescription(e.target.value)}
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
              fontWeight: 700,
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
                <span>Generating Tailor Blueprint...</span>
              </>
            ) : (
              <>
                <span>✂ Generate Design</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Visual Concept & Technical Job Sheet */}
        <div>
          {/* Loading State */}
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
                  background: 'rgba(200, 155, 60, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '40px',
                  marginBottom: '24px',
                  animation: 'pulse 2s infinite ease-in-out'
                }}
              >
                📐
              </div>

              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', margin: '0 0 12px 0' }}>
                Master Atelier Pattern Calculation
              </h3>

              <div
                style={{
                  maxWidth: '420px',
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
                    fontWeight: 600,
                    fontSize: '14px',
                    margin: 0
                  }}
                >
                  {TAILOR_LOADING_STEPS[loadingStepIdx]}
                </p>
              </div>

              <div
                style={{
                  width: '260px',
                  height: '300px',
                  borderRadius: 'var(--border-radius-md)',
                  background: 'linear-gradient(90deg, #ede7de 25%, #f7f3ee 50%, #ede7de 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.8s infinite',
                  boxShadow: 'var(--shadow-sm)'
                }}
              />
            </div>
          )}

          {/* Error State */}
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
                  Tailor Design Notice
                </h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
                {errorMessage}
              </p>
              <button className="btn-primary" onClick={handleGenerate}>
                🔄 Retry Generation
              </button>
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
                    maxHeight: '480px',
                    borderRadius: 'var(--border-radius-md)',
                    overflow: 'hidden',
                    backgroundColor: '#11100F',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <img
                    src={currentConcept.imageUrl}
                    alt={currentConcept.blueprint.jobTitle || 'Tailor Garment Concept'}
                    style={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: '480px',
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
                        backgroundColor: 'rgba(10, 15, 30, 0.85)',
                        backdropFilter: 'blur(8px)',
                        color: 'var(--accent-gold)',
                        border: '1px solid var(--accent-gold)',
                        fontSize: '11px',
                        fontWeight: 700,
                        borderRadius: '14px',
                        letterSpacing: '0.5px'
                      }}
                    >
                      ✂ Master Tailor Atelier Concept
                    </span>
                    <span
                      style={{
                        padding: '4px 10px',
                        backgroundColor: currentConcept.isLiveGemini
                          ? 'rgba(46, 111, 87, 0.9)'
                          : 'rgba(200, 155, 60, 0.9)',
                        color: '#FFF',
                        fontSize: '11px',
                        fontWeight: 600,
                        borderRadius: '14px'
                      }}
                    >
                      {currentConcept.isLiveGemini ? '🤖 Live Gemini 2.5 Render' : '🏛 Atelier Concept Visual'}
                    </span>
                  </div>
                </div>

                {/* Actions Bar */}
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
                      style={{ padding: '9px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      ⬇ Download Visual
                    </button>
                    <button
                      className="btn-outline"
                      onClick={handleSave}
                      style={{
                        padding: '9px 16px',
                        fontSize: '13px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        borderColor: isSaved ? 'var(--accent-teal)' : undefined,
                        color: isSaved ? 'var(--accent-teal)' : undefined
                      }}
                    >
                      {isSaved ? '✓ Saved in Workshop' : '💾 Save to Portfolio'}
                    </button>
                    <button
                      className="btn-outline"
                      onClick={handlePrintJobCard}
                      style={{ padding: '9px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      🖨 Print Job Sheet
                    </button>
                  </div>

                  <button
                    className="btn-outline"
                    onClick={handleGenerate}
                    style={{ padding: '9px 16px', fontSize: '13px' }}
                  >
                    🔄 Regenerate Variation
                  </button>
                </div>
              </div>

              {/* Technical Tailor Blueprint & Job Card */}
              <div
                className="glass-panel"
                style={{
                  padding: '26px 30px',
                  borderRadius: 'var(--border-radius-lg)',
                  boxShadow: 'var(--shadow-md)',
                  borderTop: '4px solid var(--accent-gold)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
                  <div>
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent-gold)', fontWeight: 700 }}>
                      Master Tailor Job Card & Cut Sheet
                    </span>
                    <h3
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '22px',
                        color: 'var(--text-primary)',
                        margin: '4px 0 8px 0'
                      }}
                    >
                      {currentConcept.blueprint.jobTitle || `${currentConcept.inputs.color} ${currentConcept.inputs.garmentType}`}
                    </h3>
                  </div>
                  <span
                    style={{
                      fontSize: '12px',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-color)',
                      fontWeight: 600
                    }}
                  >
                    Job ID: #{currentConcept.id.slice(-6)}
                  </span>
                </div>

                {/* 1. Garment Architecture & Cut */}
                <div style={{ marginBottom: '20px', padding: '14px 18px', backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-gold-dark)', textTransform: 'uppercase', marginBottom: '4px' }}>
                    ✂ Garment Architecture & Seam Construction:
                  </div>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    {currentConcept.blueprint.garmentArchitecture}
                  </p>
                </div>

                {/* 2. Fabric & Yardage Matrix */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', marginBottom: '8px' }}>
                    📦 Fabric Yardage & Materials Requirement:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                    <div style={{ padding: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Main Outer Fabric</div>
                      <div style={{ fontSize: '13px', fontWeight: 700, marginTop: '2px', color: 'var(--accent-gold-dark)' }}>
                        {currentConcept.blueprint.yardageMatrix.mainFabric}
                      </div>
                    </div>
                    <div style={{ padding: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Inner Lining Fabric</div>
                      <div style={{ fontSize: '13px', fontWeight: 700, marginTop: '2px' }}>
                        {currentConcept.blueprint.yardageMatrix.liningFabric}
                      </div>
                    </div>
                    <div style={{ padding: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Interfacing / Canvas</div>
                      <div style={{ fontSize: '13px', fontWeight: 700, marginTop: '2px' }}>
                        {currentConcept.blueprint.yardageMatrix.interfacingCanvas}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Stitch & Needle Specifications */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', marginBottom: '8px' }}>
                    🪡 Needle & Stitching Parameters:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                    <div style={{ padding: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Machine Needle Gauge</div>
                      <div style={{ fontSize: '13px', fontWeight: 600, marginTop: '2px' }}>
                        {currentConcept.blueprint.stitchAndNeedleSpecs.needleType}
                      </div>
                    </div>
                    <div style={{ padding: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Stitch Density (SPI)</div>
                      <div style={{ fontSize: '13px', fontWeight: 600, marginTop: '2px' }}>
                        {currentConcept.blueprint.stitchAndNeedleSpecs.stitchDensity}
                      </div>
                    </div>
                    <div style={{ padding: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Seam Margins & Inlays</div>
                      <div style={{ fontSize: '13px', fontWeight: 600, marginTop: '2px' }}>
                        {currentConcept.blueprint.stitchAndNeedleSpecs.seamAllowance}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Assembly Sequence */}
                {currentConcept.blueprint.assemblySequence?.length > 0 && (
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', marginBottom: '8px' }}>
                      🧵 Master Sewing Sequence (Order of Assembly):
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {currentConcept.blueprint.assemblySequence.map((step, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            gap: '10px',
                            alignItems: 'baseline',
                            fontSize: '13px',
                            color: 'var(--text-secondary)',
                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: '1px solid var(--border-color)'
                          }}
                        >
                          <span style={{ fontWeight: 700, color: 'var(--accent-gold)' }}>#{idx + 1}</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. Labour Breakdown */}
                {currentConcept.blueprint.labourBreakdown && (
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', marginBottom: '8px' }}>
                      ⏱ Labour & Production Hours Breakdown:
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                      <div style={{ padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Cutting</div>
                        <div style={{ fontSize: '13px', fontWeight: 700 }}>{currentConcept.blueprint.labourBreakdown.cuttingHours}</div>
                      </div>
                      <div style={{ padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Embroidery</div>
                        <div style={{ fontSize: '13px', fontWeight: 700 }}>{currentConcept.blueprint.labourBreakdown.embroideryHours}</div>
                      </div>
                      <div style={{ padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Stitching</div>
                        <div style={{ fontSize: '13px', fontWeight: 700 }}>{currentConcept.blueprint.labourBreakdown.stitchingHours}</div>
                      </div>
                      <div style={{ padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Finishing</div>
                        <div style={{ fontSize: '13px', fontWeight: 700 }}>{currentConcept.blueprint.labourBreakdown.finishingHours}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. Quality Checklist */}
                {currentConcept.blueprint.qualityChecklist?.length > 0 && (
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', marginBottom: '8px' }}>
                      ✓ Pre-Delivery Quality Checklist:
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                      {currentConcept.blueprint.qualityChecklist.map((check, idx) => (
                        <li key={idx}>{check}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Initial / Empty State */}
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
                  background: 'rgba(200, 155, 60, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '36px',
                  marginBottom: '20px'
                }}
              >
                ✂
              </div>

              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', margin: '0 0 10px 0' }}>
                Master Atelier Drafting Station
              </h3>
              <p
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '14px',
                  maxWidth: '440px',
                  lineHeight: '1.6',
                  marginBottom: '28px'
                }}
              >
                Configure the garment type, fabric, stitch requirements, and tailoring notes on the left, then click <strong>"Generate Design"</strong> to generate a complete visual concept and pattern cutter's technical blueprint.
              </p>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {ATELIER_PRESETS.slice(0, 2).map((p) => (
                  <button
                    key={p.name}
                    className="btn-outline"
                    style={{ fontSize: '12px', padding: '8px 14px' }}
                    onClick={() => applyPreset(p)}
                  >
                    Draft {p.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Saved Workshop Projects Modal */}
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
              maxWidth: '820px',
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
                Workshop Saved Blueprints ({savedCollection.length})
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
                No saved tailor projects yet. Generate a design and tap "Save to Portfolio" to archive it here.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '20px' }}>
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
                      alt={item.blueprint.jobTitle || 'Tailor Concept'}
                      style={{ width: '100%', height: '170px', objectFit: 'cover' }}
                    />
                    <div style={{ padding: '12px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                          {item.blueprint.jobTitle || item.inputs.garmentType}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {item.inputs.fabric} • {item.inputs.color}
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
                            showToast('Loaded blueprint to active atelier workbench.', 'info');
                          }}
                        >
                          Open Job Sheet
                        </button>
                        <button
                          className="btn-primary"
                          style={{ padding: '6px', fontSize: '11px', flex: 1 }}
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = item.imageUrl;
                            link.download = `TailorJob-${item.id}.jpg`;
                            link.click();
                          }}
                        >
                          ⬇ Visual
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

export default TailorAIDesigner;

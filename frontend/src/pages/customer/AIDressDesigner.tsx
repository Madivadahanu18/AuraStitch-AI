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
    neckStyle?: string;
    sleeveStyle?: string;
    embellishment?: string;
    customRequirements?: string;
    neckline?: string;
    sleeve?: string;
    additionalRequirements?: string;
    title?: string;
    conceptSummary?: string;
    craftsmanshipNotes?: string;
    stylingTips?: string;
    estimatedArtisanHours?: string;
    recommendedTrims?: string;
    fabricMeterage?: string;
    tailorSpecialist?: string;
  };
  createdAt: string;
}

// Preset shortcuts for fast design input configuration (No hardcoded result images)
const STUDIO_PRESET_CONCEPTS = [
  {
    name: '👑 Imperial Gulbagh Bridal Lehenga',
    dressType: 'Bridal Lehenga Choli',
    occasion: 'Wedding Ceremony (Bridal)',
    fabric: 'Pure Banarasi Katan Silk (Varanasi GI)',
    colors: 'Crimson Red & Antique Gold',
    neckline: 'Sweetheart Royal',
    sleeve: 'Elbow Length Zari Border',
    pattern: 'Intricate Zardozi & Dabka Needlework',
    requirements: '16-kali heavy flared skirt, sweetheart corset blouse with dabka work, handcrafted latkan tassels on waist tie, and organza dupatta with scalloped borders.'
  },
  {
    name: '🪷 Temple Mayil Kanchipuram Saree',
    dressType: 'Traditional Kanchipuram Saree',
    occasion: 'Auspicious Temple Ritual / Pooja',
    fabric: 'Heavy Kanchipuram Mulberry Silk (Silk Mark)',
    colors: 'Peacock Royal Blue & Silver Zari',
    neckline: 'Queen Anne Corset',
    sleeve: 'Elbow Length Zari Border',
    pattern: 'Temple Korvai Zari Border',
    requirements: 'Solid contrast magenta pallu with intricate gold jaal, 6-inch korvai interlocked temple border, and structured padded blouse with sleeve butis.'
  },
  {
    name: '✨ Noorani Rose Flared Anarkali',
    dressType: 'Floor-Length Anarkali Gown',
    occasion: 'Sangeet & Mehendi Night',
    fabric: 'Chanderi Sheer Tissue Silk',
    colors: 'Pastel Blush Pink & Rose Gold',
    neckline: 'Boat Neck Elegance',
    sleeve: 'Full Illusion Net with Motifs',
    pattern: 'Resham Threadwork & Micro Sequins',
    requirements: 'Floor-sweeping umbrella silhouette with resham flora embroidery, sheer illusion sleeves with floral cuffs, and matching lightweight tissue dupatta.'
  },
  {
    name: '💎 Royal Azure Kurti & Cigarette Pants',
    dressType: 'Handloom Kurti & Trousers',
    occasion: 'Boutique Pret / Casual Chic',
    fabric: 'Handwoven Pochampally Double-Ikat Silk-Cotton',
    colors: 'Royal Blue & Champagne Gold',
    neckline: 'Mandarin High Collar',
    sleeve: 'Sleeveless with Hand Piping',
    pattern: 'Pochampally Geometric Ikat Weave',
    requirements: 'Straight structured tunic with keyhole back, contrast antique gold gota piping along side slits, and ankle-length tapered cigarette pants with functional pockets.'
  }
];

// Step 1: Dress Types
const DRESS_TYPES = [
  { id: 'lehenga', label: '👑 Bridal Lehenga Choli', desc: '16-Kali skirt + fitted choli + veil' },
  { id: 'saree', label: '🪷 Traditional Kanchipuram Saree', desc: '6.2m handloom drape + tailored blouse' },
  { id: 'anarkali', label: '✨ Floor-Length Anarkali Gown', desc: 'Flared umbrella sweep + sheer dupatta' },
  { id: 'fusion', label: '🌸 Indo-Western Fusion Drape', desc: 'Asymmetric pre-draped skirt + structured corset' },
  { id: 'sharara', label: '💎 Sharara & Peplum Kurti Set', desc: 'Tiered fluted sharara + fitted peplum' },
  { id: 'kurti', label: '🌿 Handloom Kurti & Trousers', desc: 'Straight slit tunic + cigarette pants' },
  { id: 'cape', label: '🌙 Couture Cape Evening Gown', desc: 'Floor-length sheath + sheer trailing cape' },
  { id: 'blouse-skirt', label: '🍸 Cocktail Blouse & Flared Skirt', desc: 'Contemporary high-waist silk ensemble' }
];

// Step 2: Occasions
const OCCASIONS = [
  'Wedding Ceremony (Bridal)',
  'Sangeet & Mehendi Night',
  'Reception & Cocktail Gala',
  'Auspicious Temple Ritual / Pooja',
  'Festive Soirée (Diwali / Eid)',
  'Boutique Pret / Casual Chic'
];

// Step 3: AuraStitch Handloom & Couture Fabrics
const FABRIC_OPTIONS = [
  { name: 'Pure Banarasi Katan Silk (Varanasi GI)', desc: 'Heavy royal silk with rich zari brocade body' },
  { name: 'Heavy Kanchipuram Mulberry Silk (Silk Mark)', desc: '4-ply authentic South Indian pure silk' },
  { name: 'Handwoven Pochampally Double-Ikat Silk-Cotton', desc: 'Telangana geometric resist-dyed weave' },
  { name: 'Mangalagiri 80s Count Pure Nizam Cotton', desc: 'Crisp handloom with gold zari borders' },
  { name: 'Chanderi Sheer Tissue Silk', desc: 'Featherlight sheer silk with glossy metallic sheen' },
  { name: 'Velvet with Zardozi Foundation', desc: 'Deep plush micro-velvet for winter couture' },
  { name: 'Pure Organza & Resham Georgette', desc: 'Airy translucent luxury drape with delicate flora' }
];

// Step 4: Color Palettes
const COLOR_PALETTES = [
  { name: 'Crimson Red & Antique Gold', primary: '#8B0000', secondary: '#D4AF37' },
  { name: 'Emerald Green & Champagne Gold', primary: '#1B4D3E', secondary: '#E6C687' },
  { name: 'Peacock Royal Blue & Silver Zari', primary: '#192A56', secondary: '#DCDDE1' },
  { name: 'Pastel Blush Pink & Rose Gold', primary: '#E8A598', secondary: '#B87333' },
  { name: 'Deep Wine Maroon & Bronze Copper', primary: '#4A1525', secondary: '#CD7F32' },
  { name: 'Ivory Silk & Pure Temple Gold', primary: '#FDFBF7', secondary: '#CFB53B' }
];

// Step 5: Necklines, Sleeves, Embellishments
const NECKLINE_OPTIONS = [
  'Sweetheart Royal',
  'Mandarin High Collar',
  'Deep-V Sloper',
  'Boat Neck Elegance',
  'Queen Anne Corset',
  'Keyhole Halter',
  'Scalloped Scoop'
];

const SLEEVE_OPTIONS = [
  'Elbow Length Zari Border',
  'Sleeveless with Hand Piping',
  'Cap Sleeve Scalloped',
  'Full Illusion Net with Motifs',
  'Dramatic Cape Drape',
  'Bell Sleeves Fluted'
];

const EMBELLISHMENT_OPTIONS = [
  'Intricate Zardozi & Dabka Needlework',
  'Pochampally Geometric Ikat Weave',
  'Gota Patti Floral Borders',
  'Resham Threadwork & Micro Sequins',
  'Temple Korvai Zari Border',
  'Chikankari Handwork with Mukaish'
];

// Progressive loading steps for fashion design studio
const STUDIO_LOADING_STEPS = [
  'Drafting bespoke garment silhouette on atelier mannequin...',
  'Infusing handloom weave textures and natural dye pigmentation...',
  'Simulating intricate needlework, borders, and bodice cut in Gemini...',
  'Composing studio spotlighting and fabric drape (Avatar-free)...',
  'Generating technical couture specification and tailor cutting sloper...'
];

export const AIDressDesigner: React.FC = () => {
  const context = useOutletContext<OutletContextType>();
  const navigate = useNavigate();

  const showToast = (msg: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    if (context?.showToast) {
      context.showToast(msg, type);
    }
  };

  // 7-Step Dedicated Design Workflow Form State
  const [dressType, setDressType] = useState<string>(DRESS_TYPES[0].label);
  const [customDressType, setCustomDressType] = useState<string>('');
  const [occasion, setOccasion] = useState<string>(OCCASIONS[0]);
  const [fabric, setFabric] = useState<string>(FABRIC_OPTIONS[0].name);
  const [selectedColor, setSelectedColor] = useState<string>(COLOR_PALETTES[0].name);
  const [customColor, setCustomColor] = useState<string>('');
  const [neckline, setNeckline] = useState<string>(NECKLINE_OPTIONS[0]);
  const [sleeve, setSleeve] = useState<string>(SLEEVE_OPTIONS[0]);
  const [embellishment, setEmbellishment] = useState<string>(EMBELLISHMENT_OPTIONS[0]);
  const [additionalRequirements, setAdditionalRequirements] = useState<string>(
    'Deep sweetheart neckline, 16-kali flared skirt with antique zardozi borders, and lightweight sheer dupatta with handcrafted latkans.'
  );

  // Result Area State: Initially null (no hardcoded demo image)
  const [currentConcept, setCurrentConcept] = useState<GeneratedDressConcept | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStepIdx, setLoadingStepIdx] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  // Saved Atelier Concepts in LocalStorage
  const [savedCollection, setSavedCollection] = useState<GeneratedDressConcept[]>(() => {
    try {
      const stored = localStorage.getItem('aurastitch_saved_ai_designs');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [isCollectionOpen, setIsCollectionOpen] = useState<boolean>(false);

  // Loading message cycler
  useEffect(() => {
    let interval: any;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStepIdx((prev) => (prev + 1) % STUDIO_LOADING_STEPS.length);
      }, 1500);
    } else {
      setLoadingStepIdx(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // Apply Studio Inspiration Preset (Only updates form inputs, does NOT inject fake static image)
  const applyPreset = (preset: typeof STUDIO_PRESET_CONCEPTS[0]) => {
    setDressType(preset.dressType);
    setCustomDressType('');
    setOccasion(preset.occasion);
    setFabric(preset.fabric);
    setSelectedColor(preset.colors);
    setCustomColor('');
    setNeckline(preset.neckline);
    setSleeve(preset.sleeve);
    setEmbellishment(preset.pattern);
    setAdditionalRequirements(preset.requirements);

    showToast(`Loaded "${preset.name}" into design inputs. Click "✨ Generate Dress Design" to create your design!`, 'info');
  };

  // Step 7: The Grand Generation Action
  const handleGenerate = async () => {
    // 1. Read every current value from the form
    const finalDressType = customDressType.trim() ? customDressType.trim() : dressType;
    const finalOccasion = occasion;
    const finalFabric = fabric;
    const finalColors = customColor.trim() ? customColor.trim() : selectedColor;
    const finalNeckStyle = neckline;
    const finalSleeveStyle = sleeve;
    const finalEmbellishment = embellishment;

    // 2. Read the Custom Requirements text
    const finalCustomRequirements = additionalRequirements;

    // 3. Build a NEW detailed prompt from those values
    const cleanDress = finalDressType.replace(/^[^\w\s]+\s*/, '').trim();
    const cleanOccasion = finalOccasion.replace(/^[^\w\s]+\s*/, '').trim();
    const detailedPrompt = `Haute couture fashion studio photograph of a standalone bespoke dress.

Dress:
${cleanDress}

Occasion:
${cleanOccasion}

Fabric:
${finalFabric}

Colors:
${finalColors}

Neck:
${finalNeckStyle}

Sleeves:
${finalSleeveStyle}

Artisan embellishment:
${finalEmbellishment}

Custom requirement:
${finalCustomRequirements || 'Bespoke precision couture finishing conforming to selected silhouette'}

Styling & Staging Instructions:
- Display: Standalone luxury outfit draped on an elegant ivory linen dressmaker mannequin bust form against a minimalist fashion studio backdrop.
- Textile & Drape: Authentic handloom texture capturing the exact light luster, weave threads, fabric weight, and natural draping folds of ${finalFabric}.
- Color Palette: Rich, saturated hues of ${finalColors} with tone-on-tone depth.
- Silhouette & Tailoring: Impeccably cut ${finalNeckStyle} neckline and structured ${finalSleeveStyle} sleeves.
- Craftsmanship: Intricate ${finalEmbellishment} detailing, precision artisan stitching, and customized finishes conforming to: ${finalCustomRequirements || 'Bespoke precision finishing'}.
- Studio Photography: Soft directional spotlighting, macro focus on fabric weave, rich shadows, 8K ultra-sharp fashion editorial resolution.
- Strictly NO human face, NO human head, NO human body or avatar, NO limbs. Pure standalone garment construction.`;

    setIsLoading(true);
    setErrorMessage(null);
    setIsSaved(false);
    setCurrentConcept(null);

    try {
      // 4. Send that prompt and form values to the backend
      const response = await fetch('http://localhost:5000/api/ai/customer/generate-dress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: detailedPrompt,
          dressType: finalDressType,
          occasion: finalOccasion,
          fabric: finalFabric,
          colors: finalColors,
          neckStyle: finalNeckStyle,
          sleeveStyle: finalSleeveStyle,
          embellishment: finalEmbellishment,
          customRequirements: finalCustomRequirements,
          // Backwards compatibility aliases
          neckline: finalNeckStyle,
          sleeve: finalSleeveStyle,
          pattern: finalEmbellishment,
          additionalRequirements: finalCustomRequirements,
          style: `Haute Couture (${finalNeckStyle} with ${finalSleeveStyle})`
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error (${response.status})`);
      }

      const data: GeneratedDressConcept = await response.json();
      
      const enhancedConcept: GeneratedDressConcept = {
        ...data,
        specs: {
          ...data.specs,
          dressType: finalDressType,
          occasion: finalOccasion,
          fabric: finalFabric,
          colors: finalColors,
          neckStyle: finalNeckStyle,
          sleeveStyle: finalSleeveStyle,
          embellishment: finalEmbellishment,
          customRequirements: finalCustomRequirements,
          pattern: finalEmbellishment,
          fabricMeterage: data.specs.fabricMeterage || (finalDressType.toLowerCase().includes('saree') ? '6.2m Pure Silk Saree + Blouse' : finalDressType.toLowerCase().includes('lehenga') ? '4.5m Silk + 2.5m Dupatta' : '3.8m Handloom Material'),
          tailorSpecialist: data.specs.tailorSpecialist || (finalDressType.toLowerCase().includes('lehenga') ? 'Ustad Rizwan Khan (Bridal Atelier)' : 'Priya Sen Atelier (Drape Specialist)')
        }
      };

      // The generated image immediately replaces the previous result
      setCurrentConcept(enhancedConcept);

      if (data.isLiveGemini) {
        showToast('✨ Gemini AI generated your bespoke dress image!', 'success');
      } else {
        showToast('✨ Bespoke design generated to your exact specifications!', 'info');
      }

      // Smooth scroll to the generated dress image on mobile screens
      if (window.innerWidth < 1080) {
        const stage = document.getElementById('dress-studio-canvas');
        if (stage) stage.scrollIntoView({ behavior: 'smooth' });
      }

    } catch (err: any) {
      console.error('Dress generation failed:', err);
      setCurrentConcept(null);
      setErrorMessage(
        err.message || 'Unable to connect to the AI design studio. Please verify backend connection and try again.'
      );
      showToast(err.message || 'Design generation notice. See details on canvas.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Save concept to local portfolio
  const handleSaveDesign = () => {
    if (!currentConcept) return;

    const alreadySaved = savedCollection.some((item) => item.id === currentConcept.id);
    if (alreadySaved) {
      showToast('This concept is already in your saved atelier portfolio.', 'info');
      setIsSaved(true);
      return;
    }

    const updated = [currentConcept, ...savedCollection];
    setSavedCollection(updated);
    try {
      localStorage.setItem('aurastitch_saved_ai_designs', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
    setIsSaved(true);
    showToast('Saved to your Atelier Portfolio! 💾', 'success');
  };

  // Download high-resolution concept image
  const handleDownload = () => {
    if (!currentConcept?.imageUrl) return;

    try {
      const link = document.createElement('a');
      link.href = currentConcept.imageUrl;
      link.download = `AuraStitch-${(currentConcept.specs.title || currentConcept.specs.dressType || 'Design')
        .replace(/\s+/g, '-')}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('High-resolution concept downloaded! ⬇', 'success');
    } catch {
      window.open(currentConcept.imageUrl, '_blank');
      showToast('Opening image in new tab...', 'info');
    }
  };

  const addRequirementSnippet = (snippet: string) => {
    setAdditionalRequirements((prev) => {
      if (!prev) return snippet;
      if (prev.includes(snippet)) return prev;
      return `${prev}, ${snippet}`;
    });
    showToast(`Added "${snippet}" to artisan requirements!`, 'info');
  };

  return (
    <div className="fashion-design-studio">
      <style>{`
        .fashion-design-studio {
          max-width: 1400px;
          margin: 0 auto;
          padding: 8px 12px 60px;
          font-family: var(--font-body);
          color: var(--text-primary);
        }

        /* Atelier Top Banner */
        .studio-header-card {
          background: linear-gradient(135deg, rgba(200, 155, 60, 0.12), rgba(122, 46, 46, 0.08), rgba(255, 255, 255, 0.95));
          border: 1px solid var(--accent-gold);
          border-radius: var(--border-radius-lg);
          padding: 24px 30px;
          margin-bottom: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
          box-shadow: var(--shadow-sm);
        }

        .studio-tag-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(200, 155, 60, 0.15);
          color: var(--accent-gold-dark);
          border: 1px solid var(--accent-gold);
          padding: 3px 10px;
          border-radius: 14px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 8px;
        }

        /* 2-Column Studio Layout */
        .studio-workspace-grid {
          display: grid;
          grid-template-columns: 460px 1fr;
          gap: 28px;
          align-items: start;
        }

        @media (max-width: 1080px) {
          .studio-workspace-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Left Column: 7-Step Workbench */
        .studio-controls-panel {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          padding: 24px;
          box-shadow: var(--shadow-md);
        }

        .step-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px dashed var(--border-color);
        }

        .step-num-badge {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--accent-gold);
          color: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 800;
          flex-shrink: 0;
        }

        .step-title {
          font-family: var(--font-heading);
          font-size: 15px;
          font-weight: 700;
          margin: 0;
          color: var(--text-primary);
        }

        .form-select-custom {
          width: 100%;
          padding: 10px 12px;
          border-radius: var(--border-radius-sm);
          border: 1px solid var(--border-color);
          background: var(--bg-primary);
          color: var(--text-primary);
          font-size: 13px;
          font-family: var(--font-body);
          outline: none;
          transition: border-color 0.2s ease;
        }

        .form-select-custom:focus {
          border-color: var(--accent-gold);
        }

        /* Right Column: THE GRAND GENERATED DRESS IMAGE CANVAS */
        .dress-canvas-stage {
          background: var(--bg-secondary);
          border: 1px solid var(--accent-gold);
          border-radius: var(--border-radius-lg);
          padding: 24px;
          box-shadow: var(--shadow-lg);
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 84px;
        }

        .mannequin-frame {
          position: relative;
          width: 100%;
          height: 540px;
          background: radial-gradient(circle at center, #23201d 0%, #11100e 100%);
          border-radius: var(--border-radius-md);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: inset 0 0 40px rgba(0,0,0,0.8);
          border: 1px solid rgba(200, 155, 60, 0.3);
          cursor: zoom-in;
        }

        .mannequin-dress-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          transition: transform 0.4s ease;
        }

        .mannequin-frame:hover .mannequin-dress-image {
          transform: scale(1.03);
        }

        /* Empty State Canvas Box */
        .empty-canvas-box {
          height: 540px;
          border-radius: var(--border-radius-md);
          background: radial-gradient(circle at center, #24201c 0%, #12100e 100%);
          border: 2px dashed var(--accent-gold);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 40px 30px;
          box-shadow: inset 0 0 40px rgba(0,0,0,0.8);
          position: relative;
        }

        /* Overlay Watermarks & Badges */
        .atelier-badge-overlay {
          position: absolute;
          top: 16px;
          left: 16px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          z-index: 10;
        }

        .atelier-pill {
          padding: 4px 10px;
          background: rgba(18, 16, 14, 0.85);
          color: #FFF;
          font-size: 11px;
          font-weight: 600;
          border-radius: 12px;
          backdrop-filter: blur(8px);
          border: 1px solid rgba(200, 155, 60, 0.3);
        }

        .canvas-toolbar {
          position: absolute;
          bottom: 16px;
          right: 16px;
          display: flex;
          gap: 8px;
          z-index: 10;
        }

        .tool-icon-btn {
          background: rgba(18, 16, 14, 0.85);
          border: 1px solid var(--accent-gold);
          color: #FFF;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          backdrop-filter: blur(8px);
          transition: all 0.2s ease;
        }

        .tool-icon-btn:hover {
          background: var(--accent-gold);
          color: #000;
        }

        /* Technical Specification Card */
        .couture-spec-board {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid var(--border-color);
        }

        .spec-metric-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
          gap: 12px;
          margin: 16px 0;
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-sm);
          padding: 14px;
        }

        /* Lightbox modal */
        .lightbox-backdrop {
          position: fixed;
          top: 0; left: 0; width: 100vw; height: 100vh;
          background: rgba(0, 0, 0, 0.92);
          backdrop-filter: blur(10px);
          z-index: 10000;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }

        .lightbox-content {
          max-width: 90vw;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .lightbox-img {
          max-width: 100%;
          max-height: 82vh;
          object-fit: contain;
          border-radius: 8px;
          box-shadow: 0 0 50px rgba(0,0,0,0.8);
        }
      `}</style>

      {/* ATELIER TOP HEADER */}
      <div className="studio-header-card">
        <div>
          <div className="studio-tag-badge">
            ✨ AuraStitch Haute Couture Atelier
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', margin: '0 0 6px', color: 'var(--text-primary)' }}>
            AI Dress Designer Studio
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '680px', lineHeight: '1.5' }}>
            Direct your bespoke garment concept. Tell AuraStitch your silhouette, authentic handloom weave, and tailored embellishments. 
            AI renders a visual concept draped on a dressmaker mannequin — ready for master tailor pattern cutting.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            className="btn-secondary"
            style={{ fontSize: '13px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
            onClick={() => setIsCollectionOpen(true)}
          >
            📂 Saved Concepts ({savedCollection.length})
          </button>
          <button
            className="btn-secondary"
            style={{ fontSize: '13px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
            onClick={() => navigate('/customer/measurements')}
          >
            📐 Measurement Passport
          </button>
        </div>
      </div>

      {/* QUICK STUDIO INSPIRATION PRESETS */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
            Atelier Curated Inspirations:
          </span>
        </div>
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '6px' }}>
          {STUDIO_PRESET_CONCEPTS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => applyPreset(preset)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 600,
                border: '1px solid var(--border-color)',
                backgroundColor: dressType === preset.dressType ? 'var(--accent-gold)' : 'var(--bg-secondary)',
                color: dressType === preset.dressType ? '#000' : 'var(--text-primary)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* 2-COLUMN MAIN WORKSPACE */}
      <div className="studio-workspace-grid">
        {/* =========================================================================
            LEFT COLUMN: THE 7-STEP DEDICATED DESIGN WORKFLOW
           ========================================================================= */}
        <div className="studio-controls-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
            <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📐</span> Custom Design Specifications
            </h3>
            <span style={{ fontSize: '11px', color: 'var(--accent-gold-dark)', fontWeight: 700, textTransform: 'uppercase' }}>
              7 Steps to Design
            </span>
          </div>

          {/* STEP 1: SELECT DRESS TYPE */}
          <div style={{ marginBottom: '22px' }}>
            <div className="step-header">
              <span className="step-num-badge">1</span>
              <h4 className="step-title">Select Dress Type & Silhouette</h4>
            </div>
            <select
              className="form-select-custom"
              value={dressType}
              onChange={(e) => {
                setDressType(e.target.value);
                setCustomDressType('');
              }}
              style={{ marginBottom: '8px' }}
            >
              {DRESS_TYPES.map((dt) => (
                <option key={dt.id} value={dt.label}>
                  {dt.label} — ({dt.desc})
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Or specify custom cut (e.g. Asymmetric Corset Drape Gown)..."
              value={customDressType}
              onChange={(e) => setCustomDressType(e.target.value)}
              className="form-select-custom"
              style={{ fontSize: '12px' }}
            />
          </div>

          {/* STEP 2: SELECT OCCASION */}
          <div style={{ marginBottom: '22px' }}>
            <div className="step-header">
              <span className="step-num-badge">2</span>
              <h4 className="step-title">Select Occasion</h4>
            </div>
            <select
              className="form-select-custom"
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
            >
              {OCCASIONS.map((occ) => (
                <option key={occ} value={occ}>
                  {occ}
                </option>
              ))}
            </select>
          </div>

          {/* STEP 3: SELECT FABRIC */}
          <div style={{ marginBottom: '22px' }}>
            <div className="step-header">
              <span className="step-num-badge">3</span>
              <h4 className="step-title">Select Handloom Fabric & Weave</h4>
            </div>
            <select
              className="form-select-custom"
              value={fabric}
              onChange={(e) => setFabric(e.target.value)}
            >
              {FABRIC_OPTIONS.map((fb) => (
                <option key={fb.name} value={fb.name}>
                  {fb.name} — ({fb.desc})
                </option>
              ))}
            </select>
          </div>

          {/* STEP 4: SELECT COLORS */}
          <div style={{ marginBottom: '22px' }}>
            <div className="step-header">
              <span className="step-num-badge">4</span>
              <h4 className="step-title">Select Colors & Dyes</h4>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '8px' }}>
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
                      padding: '8px 10px',
                      borderRadius: 'var(--border-radius-sm)',
                      border: isSelected ? '2px solid var(--accent-gold)' : '1px solid var(--border-color)',
                      backgroundColor: isSelected ? 'rgba(200, 155, 60, 0.15)' : 'var(--bg-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>
                      <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: cp.primary }} />
                      <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: cp.secondary }} />
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: isSelected ? 700 : 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {cp.name}
                    </span>
                  </div>
                );
              })}
            </div>
            <input
              type="text"
              placeholder="Or enter custom palette (e.g. Lavender & Champagne Gold)..."
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              className="form-select-custom"
              style={{ fontSize: '12px' }}
            />
          </div>

          {/* STEP 5: SELECT NECK / SLEEVE / DESIGN PREFERENCES */}
          <div style={{ marginBottom: '22px' }}>
            <div className="step-header">
              <span className="step-num-badge">5</span>
              <h4 className="step-title">Select Neck, Sleeve & Design Preferences</h4>
            </div>

            {/* Neckline */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
                Neckline Cut
              </label>
              <select
                className="form-select-custom"
                value={neckline}
                onChange={(e) => setNeckline(e.target.value)}
              >
                {NECKLINE_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            {/* Sleeve Style */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
                Sleeve Styling
              </label>
              <select
                className="form-select-custom"
                value={sleeve}
                onChange={(e) => setSleeve(e.target.value)}
              >
                {SLEEVE_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Embellishment / Border */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
                Artisan Embellishment & Border
              </label>
              <select
                className="form-select-custom"
                value={embellishment}
                onChange={(e) => setEmbellishment(e.target.value)}
              >
                {EMBELLISHMENT_OPTIONS.map((emb) => (
                  <option key={emb} value={emb}>
                    {emb}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* STEP 6: ENTER CUSTOM REQUIREMENTS */}
          <div style={{ marginBottom: '24px' }}>
            <div className="step-header">
              <span className="step-num-badge">6</span>
              <h4 className="step-title">Enter Custom Requirements & Artisan Notes</h4>
            </div>
            <textarea
              className="form-select-custom"
              rows={4}
              placeholder="Describe back cut depth, latkan tassels, flare sweep, sheer dupatta borders, lining preference..."
              value={additionalRequirements}
              onChange={(e) => setAdditionalRequirements(e.target.value)}
              style={{ resize: 'vertical', fontSize: '12px', lineHeight: '1.5', marginBottom: '8px' }}
            />
            {/* Quick snippet chips */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {[
                '+ Deep back with latkans',
                '+ 16-Kali wide sweep',
                '+ Scalloped border',
                '+ Padded corset boning',
                '+ Concealed pockets'
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => addRequirementSnippet(chip.replace('+ ', ''))}
                  style={{
                    background: 'var(--bg-tertiary)',
                    border: '1px dashed var(--border-color)',
                    padding: '3px 8px',
                    borderRadius: '10px',
                    fontSize: '10px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    color: 'var(--text-secondary)'
                  }}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* STEP 7: GENERATE DRESS DESIGN CTA BUTTON */}
          <div style={{ paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <span className="step-num-badge">7</span>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-gold-dark)', textTransform: 'uppercase' }}>
                Atelier Visual Conception
              </span>
            </div>

            <button
              type="button"
              className="btn-primary"
              disabled={isLoading}
              onClick={handleGenerate}
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '15px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-gold-dark))',
                color: '#FFFFFF',
                boxShadow: '0 6px 20px rgba(200, 155, 60, 0.35)',
                opacity: isLoading ? 0.75 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? (
                <>
                  <span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} />
                  <span>Drafting Visual Concept in Studio...</span>
                </>
              ) : (
                <>
                  <span>✨ Generate Dress Design</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN: THE GRAND GENERATED DRESS IMAGE CANVAS (MAIN FOCUS)
           ========================================================================= */}
        <div id="dress-studio-canvas" className="dress-canvas-stage">
          {/* Header of the Display Stage */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                Center Stage • Haute Couture Mannequin
              </span>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', margin: '2px 0 0', color: 'var(--text-primary)' }}>
                {currentConcept ? (currentConcept.specs.title || 'Generated Bespoke Dress Concept') : 'Your Bespoke Concept Canvas'}
              </h2>
            </div>

            {currentConcept && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  disabled={isLoading}
                  onClick={handleGenerate}
                  title="Regenerate with current inputs"
                >
                  🔄 Regenerate
                </button>
                <button
                  className="btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '12px' }}
                  onClick={() => setIsLightboxOpen(true)}
                >
                  🔍 Expand Zoom View
                </button>
              </div>
            )}
          </div>

          {/* 1. LOADING STATE DISPLAY OVER CANVAS */}
          {isLoading && (
            <div
              style={{
                height: '540px',
                borderRadius: 'var(--border-radius-md)',
                background: 'radial-gradient(circle at center, #23201d 0%, #11100e 100%)',
                border: '2px dashed var(--accent-gold)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '30px'
              }}
            >
              <div
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  background: 'rgba(200, 155, 60, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '44px',
                  marginBottom: '20px',
                  boxShadow: '0 0 30px rgba(200, 155, 60, 0.4)'
                }}
              >
                👗
              </div>

              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', color: '#FFF', margin: '0 0 10px' }}>
                Master Atelier In Progress
              </h3>

              <p
                key={loadingStepIdx}
                className="fade-in"
                style={{
                  color: 'var(--accent-gold)',
                  fontSize: '14px',
                  fontWeight: 600,
                  maxWidth: '420px',
                  minHeight: '44px',
                  margin: 0
                }}
              >
                {STUDIO_LOADING_STEPS[loadingStepIdx]}
              </p>
            </div>
          )}

          {/* 1.5. ERROR STATE ALERT (SHOWN WHEN ERROR OCCURS) */}
          {!isLoading && errorMessage && (
            <div
              style={{
                marginBottom: '16px',
                padding: '16px 20px',
                borderRadius: 'var(--border-radius-md)',
                background: 'rgba(230, 57, 70, 0.12)',
                border: '1px solid rgba(230, 57, 70, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '24px' }}>⚠️</span>
                <div>
                  <h4 style={{ margin: 0, color: '#e63946', fontSize: '14px', fontWeight: 700 }}>
                    Design Studio Notice
                  </h4>
                  <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '13px' }}>
                    {errorMessage}
                  </p>
                </div>
              </div>
              <button
                className="btn-secondary"
                style={{ fontSize: '12px', padding: '6px 14px' }}
                onClick={handleGenerate}
              >
                🔄 Try Again
              </button>
            </div>
          )}

          {/* 2. INITIAL EMPTY STATE: SHOWN BEFORE ANY GENERATION TAKES PLACE */}
          {!isLoading && !currentConcept && (
            <div className="empty-canvas-box">
              <div
                style={{
                  width: '96px',
                  height: '96px',
                  borderRadius: '50%',
                  background: 'rgba(200, 155, 60, 0.12)',
                  border: '1px solid rgba(200, 155, 60, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '46px',
                  marginBottom: '20px'
                }}
              >
                👗
              </div>

              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', color: '#FFF', margin: '0 0 10px 0' }}>
                Your AI-generated design will appear here.
              </h3>

              <p style={{ color: '#C8C3BA', fontSize: '14px', maxWidth: '440px', lineHeight: '1.6', margin: '0 0 24px 0' }}>
                Select your dress type, occasion, handloom fabric, colors, and styling preferences on the left, then click <strong>"✨ Generate Dress Design"</strong> to create your bespoke visual concept.
              </p>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <span style={{ fontSize: '11px', background: 'rgba(200, 155, 60, 0.15)', color: 'var(--accent-gold)', padding: '4px 12px', borderRadius: '12px', border: '1px solid rgba(200, 155, 60, 0.3)' }}>
                  ✨ 100% Unique to Your Inputs
                </span>
                <span style={{ fontSize: '11px', background: 'rgba(42, 157, 143, 0.15)', color: '#2a9d8f', padding: '4px 12px', borderRadius: '12px', border: '1px solid rgba(42, 157, 143, 0.3)' }}>
                  👗 Standalone Garment Visuals
                </span>
                <span style={{ fontSize: '11px', background: 'rgba(255, 255, 255, 0.1)', color: '#CCC', padding: '4px 12px', borderRadius: '12px' }}>
                  📐 Master Tailor Sloper Ready
                </span>
              </div>
            </div>
          )}

          {/* 3. THE GENERATED DRESS IMAGE FRAME (SHOWN ONLY WHEN A DESIGN HAS BEEN GENERATED) */}
          {!isLoading && currentConcept && (
            <div className="mannequin-frame" onClick={() => setIsLightboxOpen(true)}>
              <img
                src={currentConcept.imageUrl}
                alt={currentConcept.specs.title || 'Generated Dress Concept'}
                className="mannequin-dress-image"
              />

              {/* Atelier Overlay Badges */}
              <div className="atelier-badge-overlay">
                <span className="atelier-pill" style={{ color: 'var(--accent-gold)' }}>
                  ✨ Standalone Haute Couture
                </span>
                <span className="atelier-pill">
                  {currentConcept.isLiveGemini ? '🤖 Gemini Visualizer' : '🏛 Bespoke AI Synthesis'}
                </span>
                <span className="atelier-pill" style={{ fontSize: '10px', color: '#2a9d8f' }}>
                  👗 Pure Garment Construction (No Avatars)
                </span>
              </div>

              {/* Action Toolbar on Image */}
              <div className="canvas-toolbar" onClick={(e) => e.stopPropagation()}>
                <button
                  className="tool-icon-btn"
                  title="Regenerate with current inputs"
                  disabled={isLoading}
                  onClick={handleGenerate}
                >
                  🔄 Regenerate
                </button>
                <button
                  className="tool-icon-btn"
                  title="Zoom & Inspect Details"
                  onClick={() => setIsLightboxOpen(true)}
                >
                  🔍 Zoom
                </button>
                <button
                  className="tool-icon-btn"
                  title="Download High-Res Render"
                  onClick={handleDownload}
                >
                  ⬇ Download
                </button>
                <button
                  className="tool-icon-btn"
                  title="Save to Portfolio"
                  onClick={handleSaveDesign}
                  style={{
                    borderColor: isSaved ? '#2a9d8f' : undefined,
                    color: isSaved ? '#2a9d8f' : undefined
                  }}
                >
                  {isSaved ? '✓ Saved' : '💾 Save'}
                </button>
              </div>
            </div>
          )}

          {/* TECHNICAL COUTURE SPECIFICATION & ATELIER INTEGRATION */}
          {!isLoading && currentConcept && (
            <div className="couture-spec-board">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--accent-gold)', fontWeight: 700 }}>
                    Atelier Technical Specification Sheet
                  </span>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', margin: '4px 0 6px', color: 'var(--text-primary)' }}>
                    {currentConcept.specs.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
                    {currentConcept.specs.conceptSummary}
                  </p>
                </div>
              </div>

              {/* Metrics Breakdown */}
              <div className="spec-metric-grid">
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>🧵 Handloom Textile Base</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, marginTop: '2px' }}>{currentConcept.specs.fabric}</div>
                  <div style={{ fontSize: '11px', color: 'var(--accent-gold-dark)', marginTop: '2px' }}>
                    Req: {currentConcept.specs.fabricMeterage || '4.5m Handloom Material'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>🪡 Neck & Sleeve Styling</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, marginTop: '2px' }}>
                    {currentConcept.specs.neckStyle || neckline} • {currentConcept.specs.sleeveStyle || sleeve}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {currentConcept.specs.dressType}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>💎 Embellishment & Borders</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, marginTop: '2px' }}>
                    {currentConcept.specs.embellishment || currentConcept.specs.pattern}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Palette: {currentConcept.specs.colors}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>⏱️ Estimated Handcraft Time</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--accent-gold-dark)', marginTop: '2px' }}>
                    {currentConcept.specs.estimatedArtisanHours || '40–48 Artisan Hours'}
                  </div>
                  <div style={{ fontSize: '11px', color: '#2a9d8f', marginTop: '2px', fontWeight: 600 }}>
                    Escrow Protected
                  </div>
                </div>
              </div>

              {/* Detailed Tailoring & Weaving Notes */}
              {currentConcept.specs.craftsmanshipNotes && (
                <div style={{ marginBottom: '12px', fontSize: '12px', lineHeight: '1.5' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>🧵 Master Tailoring Notes: </strong>
                  <span style={{ color: 'var(--text-secondary)' }}>{currentConcept.specs.craftsmanshipNotes}</span>
                </div>
              )}

              {currentConcept.specs.recommendedTrims && (
                <div style={{ marginBottom: '12px', fontSize: '12px', lineHeight: '1.5' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>💎 Recommended Trims & Latkans: </strong>
                  <span style={{ color: 'var(--text-secondary)' }}>{currentConcept.specs.recommendedTrims}</span>
                </div>
              )}

              {currentConcept.specs.stylingTips && (
                <div style={{ marginBottom: '18px', fontSize: '12px', lineHeight: '1.5' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>✨ Styling & Jewelry Pairing: </strong>
                  <span style={{ color: 'var(--text-secondary)' }}>{currentConcept.specs.stylingTips}</span>
                </div>
              )}

              {/* Gemini Image Generation Prompt Inspection */}
              {currentConcept.prompt && (
                <details style={{ marginBottom: '20px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px 14px' }}>
                  <summary style={{ cursor: 'pointer', fontSize: '12px', fontWeight: 700, color: 'var(--accent-gold)' }}>
                    ✨ View Detailed Gemini Image-Generation Prompt
                  </summary>
                  <pre style={{ margin: '10px 0 0', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.5', fontFamily: 'monospace' }}>
                    {currentConcept.prompt}
                  </pre>
                </details>
              )}

              {/* Seamless Action Hand-off to Real Business Platform */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-primary)', padding: '14px 18px', borderRadius: '10px', border: '1px solid var(--border-color)', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Ready to commission this design?
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Connect directly with verified master tailors and certified handloom weavers with 100% Fit Guarantee.
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    className="btn-secondary"
                    style={{ fontSize: '12px', padding: '8px 14px' }}
                    onClick={() => {
                      showToast('Navigating to Handloom Pavilion to select fabric yardage...', 'info');
                      navigate('/customer');
                    }}
                  >
                    🧵 Source Fabric
                  </button>
                  <button
                    className="btn-primary"
                    style={{ fontSize: '12px', padding: '8px 16px', fontWeight: 700 }}
                    onClick={() => {
                      showToast(`Bespoke commission request for "${currentConcept.specs.title}" created! Opening Tailor Matching...`, 'success');
                      navigate('/customer');
                    }}
                  >
                    🪡 Book with Master Tailor →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {isLightboxOpen && currentConcept && (
        <div className="lightbox-backdrop" onClick={() => setIsLightboxOpen(false)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '12px', color: '#FFF' }}>
              <div>
                <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '20px' }}>
                  {currentConcept.specs.title}
                </h3>
                <div style={{ fontSize: '12px', color: 'var(--accent-gold)' }}>
                  Haute Couture Mannequin View • {currentConcept.specs.fabric}
                </div>
              </div>
              <button
                className="tool-icon-btn"
                onClick={() => setIsLightboxOpen(false)}
                style={{ padding: '6px 14px', fontSize: '14px' }}
              >
                ✕ Close
              </button>
            </div>

            <img
              src={currentConcept.imageUrl}
              alt={currentConcept.specs.title}
              className="lightbox-img"
            />

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button className="btn-primary" onClick={handleDownload} style={{ padding: '8px 18px', fontSize: '13px' }}>
                ⬇ Download High-Res Image
              </button>
              <button className="btn-secondary" onClick={handleSaveDesign} style={{ padding: '8px 18px', fontSize: '13px' }}>
                💾 Save Concept
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SAVED ATELIER CONCEPTS MODAL */}
      {isCollectionOpen && (
        <div className="lightbox-backdrop" onClick={() => setIsCollectionOpen(false)}>
          <div
            style={{
              width: '90%',
              maxWidth: '850px',
              maxHeight: '85vh',
              overflowY: 'auto',
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--border-radius-lg)',
              padding: '28px',
              border: '1px solid var(--accent-gold)',
              boxShadow: 'var(--shadow-lg)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', margin: 0 }}>
                  Saved Atelier Concepts ({savedCollection.length})
                </h3>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Your bespoke dress concepts conceptualized in the AI studio
                </div>
              </div>
              <button
                className="btn-secondary"
                style={{ padding: '6px 14px', fontSize: '13px' }}
                onClick={() => setIsCollectionOpen(false)}
              >
                ✕ Close
              </button>
            </div>

            {savedCollection.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                No saved designs in this session yet. Generate a dress and click "Save" to keep it in your studio portfolio!
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '18px' }}>
                {savedCollection.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      borderRadius: 'var(--border-radius-md)',
                      overflow: 'hidden',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-primary)',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <div style={{ height: '220px', background: '#111', overflow: 'hidden' }}>
                      <img
                        src={item.imageUrl}
                        alt={item.specs.title || 'Saved Concept'}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    </div>
                    <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <h4 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 700 }}>
                        {item.specs.title || item.specs.dressType}
                      </h4>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                        {item.specs.fabric} • {item.specs.colors}
                      </div>

                      <div style={{ display: 'flex', gap: '6px', marginTop: 'auto' }}>
                        <button
                          className="btn-secondary"
                          style={{ flex: 1, padding: '6px', fontSize: '11px' }}
                          onClick={() => {
                            setCurrentConcept(item);
                            setIsSaved(true);
                            setIsCollectionOpen(false);
                            showToast(`Loaded "${item.specs.title || 'Concept'}" onto the main mannequin canvas.`, 'info');
                          }}
                        >
                          View on Canvas
                        </button>
                        <button
                          className="btn-primary"
                          style={{ flex: 1, padding: '6px', fontSize: '11px' }}
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = item.imageUrl;
                            link.download = `AuraStitch-${item.id}.png`;
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

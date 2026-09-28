import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import OrderAgreementModal from '../../components/OrderAgreementModal';

// High-resolution outfit assets from assets/outfits
import floralPinkLehengaImg from '../../assets/outfits/floral_pink_lehenga.png';
import luxuryWeddingLehengaImg from '../../assets/outfits/luxury_wedding_lehenga.png';
import royalBlueKurtiImg from '../../assets/outfits/royal_blue_kurti.png';

// Handloom and textile images from ./images/
import dothiImg from './images/dothi.jpg';
import dupattaImg from './images/duppatta.jpg';
import kanchipuramSareeImg from './images/kanchipuramsaree.jpg';
import mangalagiriDressImg from './images/Mangalagiridress.jpg';
import pochampallyDressImg from './images/pochampallydress.jpg';
import sareesImg from './images/Sarees.jpg';

const getImageSrc = (img: any): string => {
  if (!img) return '';
  if (typeof img === 'string') return img;
  if (typeof img === 'object' && 'default' in img) return (img as any).default;
  return String(img);
};

interface OutletContextType {
  showToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

// 1. Bespoke Designs & Dresses
interface CoutureDesign {
  id: string;
  title: string;
  category: 'Bridal Couture' | 'Festive & Sangeet' | 'Contemporary Formal' | 'Heritage Weaves';
  image: string;
  fabricName: string;
  fabricOrigin: string;
  fabricCost: number;
  tailorName: string;
  tailorSpecialty: string;
  stitchingFee: number;
  totalPrice: number;
  handcraftDays: string;
  rating: number;
  reviewsCount: number;
  description: string;
  silhouette: string;
  tag: string;
}

const COUTURE_DESIGNS: CoutureDesign[] = [
  {
    id: 'cd-1',
    title: 'The Imperial Gulbagh Bridal Lehenga',
    category: 'Bridal Couture',
    image: getImageSrc(luxuryWeddingLehengaImg),
    fabricName: 'Pure Banarasi Katan Silk & Velvet',
    fabricOrigin: 'Varanasi, UP (GI Certified)',
    fabricCost: 14500,
    tailorName: 'Ustad Rizwan Khan',
    tailorSpecialty: 'Master Zardozi & Bridal Cut',
    stitchingFee: 7500,
    totalPrice: 22000,
    handcraftDays: '12–15 Days',
    rating: 4.9,
    reviewsCount: 184,
    description: '16-kali flared silhouette with antique dabka needlework, velvet blouse with sweetheart neckline, and handcrafted latkan tassels.',
    silhouette: '16-Kali Flared Skirt + Corset Blouse',
    tag: '👑 Royal Signature'
  },
  {
    id: 'cd-2',
    title: 'The Noorani Rose Silk Anarkali Set',
    category: 'Festive & Sangeet',
    image: getImageSrc(floralPinkLehengaImg),
    fabricName: 'Chanderi Mulberry Silk & Organza',
    fabricOrigin: 'Chanderi, MP',
    fabricCost: 6200,
    tailorName: 'Priya Sen Atelier',
    tailorSpecialty: 'Anarkali & Gown Specialist',
    stitchingFee: 3600,
    totalPrice: 9800,
    handcraftDays: '7–10 Days',
    rating: 4.8,
    reviewsCount: 142,
    description: 'Floor-sweeping flared silhouette with resham flora motifs, scallop-cut embroidered hem, and matching sheer organza dupatta.',
    silhouette: 'Floor-Length Umbrella Anarkali',
    tag: '✨ Bestseller'
  },
  {
    id: 'cd-3',
    title: 'Royal Azure Chanderi Kurti & Cigarette Pants',
    category: 'Contemporary Formal',
    image: getImageSrc(royalBlueKurtiImg),
    fabricName: 'Fine Handwoven Chanderi Silk',
    fabricOrigin: 'Madhya Pradesh',
    fabricCost: 3800,
    tailorName: 'Master Rameshwar Reddy',
    tailorSpecialty: 'Precision Fit & Drapes',
    stitchingFee: 2100,
    totalPrice: 5900,
    handcraftDays: '5–7 Days',
    rating: 4.8,
    reviewsCount: 96,
    description: 'Deep royal blue straight-cut tunic with delicate gota patti borders, custom keyhole neckline, and tapered cigarette trousers.',
    silhouette: 'Straight Cut Kurti + Tapered Pants',
    tag: '💎 Contemporary Chic'
  },
  {
    id: 'cd-4',
    title: 'Heritage Kanchipuram Brocade Saree Ensemble',
    category: 'Heritage Weaves',
    image: getImageSrc(kanchipuramSareeImg),
    fabricName: 'Heavy Kanchipuram Mulberry Silk',
    fabricOrigin: 'Kanchipuram, TN (Silk Mark)',
    fabricCost: 16500,
    tailorName: 'Priya Sen Atelier',
    tailorSpecialty: 'Pre-pleating & Blouse Tailoring',
    stitchingFee: 2400,
    totalPrice: 18900,
    handcraftDays: '6–8 Days',
    rating: 4.9,
    reviewsCount: 310,
    description: 'Pure zari woven body with mayil peacock motifs. Includes custom tailored padded corset blouse with elbow-length borders.',
    silhouette: 'Traditional Saree + Tailored Blouse',
    tag: '🏛️ GI Authentic'
  },
  {
    id: 'cd-5',
    title: 'Pochampally Geometric Ikat Maxi Dress',
    category: 'Contemporary Formal',
    image: getImageSrc(pochampallyDressImg),
    fabricName: 'Telangana Double-Ikat Cotton',
    fabricOrigin: 'Pochampally, TS (GI Tagged)',
    fabricCost: 2450,
    tailorName: 'Deccan Tailoring Guild',
    tailorSpecialty: 'Modern Fusion & Pret',
    stitchingFee: 1550,
    totalPrice: 4000,
    handcraftDays: '5–6 Days',
    rating: 4.7,
    reviewsCount: 168,
    description: 'Modern Bohemian tiered A-line dress with mandarin collar, functional concealed side pockets, and waist tie sash.',
    silhouette: 'Tiered A-Line Maxi Dress',
    tag: '🌿 Sustainable Handloom'
  },
  {
    id: 'cd-6',
    title: 'Nizam Border Mangalagiri Flared Kurta',
    category: 'Heritage Weaves',
    image: getImageSrc(mangalagiriDressImg),
    fabricName: 'Mangalagiri 80s Count Pure Cotton',
    fabricOrigin: 'Guntur, AP',
    fabricCost: 1850,
    tailorName: 'Deccan Tailoring Guild',
    tailorSpecialty: 'Handloom Tailoring',
    stitchingFee: 1200,
    totalPrice: 3050,
    handcraftDays: '4–6 Days',
    rating: 4.8,
    reviewsCount: 124,
    description: 'Crisp handwoven cotton with signature gold nizam borders, flared princess-cut panels, and hand-rolled piping.',
    silhouette: 'Princess-Cut Flared Kurta',
    tag: '🌾 Artisan Woven'
  }
];

// 2. Verified Master Tailors
interface MasterTailor {
  id: string;
  name: string;
  atelier: string;
  location: string;
  avatarText: string;
  experienceYears: number;
  rating: number;
  completedFits: number;
  firstFitSuccess: string;
  specializations: string[];
  startingPrice: number;
  turnaroundDays: string;
  badges: string[];
  bio: string;
}

const MASTER_TAILORS: MasterTailor[] = [
  {
    id: 't-1',
    name: 'Ustad Rizwan Khan',
    atelier: 'Atelier Rizwan Heritage',
    location: 'Chandni Chowk, Old Delhi',
    avatarText: 'RK',
    experienceYears: 24,
    rating: 4.95,
    completedFits: 540,
    firstFitSuccess: '99.4%',
    specializations: ['Bridal Lehengas', 'Zardozi Embroidery', 'Sherwanis', 'Corset Blouses'],
    startingPrice: 2400,
    turnaroundDays: '8–12 Days',
    badges: ['👑 Master Craftsman', '🛡️ Fit Guarantee'],
    bio: 'Third-generation royal tailor specializing in heavy bridal couture, custom boning, and intricate antique zari slopers.'
  },
  {
    id: 't-2',
    name: 'Priya Sen',
    atelier: 'Priya Sen Haute Studio',
    location: 'Ballygunge, Kolkata',
    avatarText: 'PS',
    experienceYears: 15,
    rating: 4.9,
    completedFits: 420,
    firstFitSuccess: '98.8%',
    specializations: ['Flared Anarkalis', 'Saree Pre-Pleating', 'Padded Blouses', 'Gowns'],
    startingPrice: 1200,
    turnaroundDays: '5–7 Days',
    badges: ['✨ Bridal Specialist', '📍 Home Trial'],
    bio: 'NIFT alumna and bespoke patternmaker blending royal Bengal drapes with contemporary European bodice tailoring.'
  },
  {
    id: 't-3',
    name: 'Master Rameshwar Reddy',
    atelier: 'Deccan Master Tailoring Guild',
    location: 'Banjara Hills, Hyderabad',
    avatarText: 'RR',
    experienceYears: 20,
    rating: 4.88,
    completedFits: 680,
    firstFitSuccess: '99.1%',
    specializations: ['Handloom Silk Suits', 'Kurta-Dhoti Sets', 'Pochampally Cuts', 'Nehru Jackets'],
    startingPrice: 850,
    turnaroundDays: '4–6 Days',
    badges: ['🧵 Silk Mark Handler', '⚡ Express 72h'],
    bio: 'Master of handloom drape structure; ensures fabric grain alignment and shrinkage-proof basting before stitching.'
  },
  {
    id: 't-4',
    name: 'Ananya Rao',
    atelier: 'Studio Drape & Structure',
    location: 'Indiranagar, Bengaluru',
    avatarText: 'AR',
    experienceYears: 11,
    rating: 4.82,
    completedFits: 290,
    firstFitSuccess: '98.5%',
    specializations: ['Indo-Western Gowns', 'Structured Drapes', 'Asymmetric Kurtis', 'Jumpsuits'],
    startingPrice: 1800,
    turnaroundDays: '6–8 Days',
    badges: ['📐 3D Digital Sloper', '🌿 Eco Finishes'],
    bio: 'Pioneer of digital body measurement alignment; translates AI concept renders directly into precision paper patterns.'
  }
];

// 3. Direct Handloom Weaves & Fabrics
interface HandloomFabric {
  id: string;
  name: string;
  weaveCluster: string;
  state: string;
  cooperativeName: string;
  giTagStatus: string;
  fabricPurity: string;
  pricePerMeter: number;
  unstitchedSetPrice: number;
  availableMeters: number;
  rating: number;
  image: string;
  craftNotes: string;
}

const HANDLOOM_FABRICS: HandloomFabric[] = [
  {
    id: 'hf-1',
    name: 'Pochampally Double-Ikat Silk Cotton',
    weaveCluster: 'Bhoodan Pochampally',
    state: 'Telangana',
    cooperativeName: 'Kiran Handloom Looms Co-Op',
    giTagStatus: 'GI Certified (GI-23)',
    fabricPurity: '60% Silk / 40% Mercerized Cotton',
    pricePerMeter: 680,
    unstitchedSetPrice: 2450,
    availableMeters: 42,
    rating: 4.9,
    image: getImageSrc(pochampallyDressImg),
    craftNotes: 'Warp and weft resist-dyed by master artisans before loom setup. Sourced directly from Bhoodan weavers.'
  },
  {
    id: 'hf-2',
    name: 'Kanchipuram Heavy Mulberry Silk with Gold Zari',
    weaveCluster: 'Kanchipuram Silk Cluster',
    state: 'Tamil Nadu',
    cooperativeName: 'Kanchi Silk Artisans Guild',
    giTagStatus: 'GI Certified (GI-01) • Silk Mark',
    fabricPurity: '100% Pure Mulberry Silk (4-ply)',
    pricePerMeter: 2200,
    unstitchedSetPrice: 12000,
    availableMeters: 28,
    rating: 4.95,
    image: getImageSrc(kanchipuramSareeImg),
    craftNotes: 'Korvai interlocked border technique woven on traditional pit looms with certified pure zari content.'
  },
  {
    id: 'hf-3',
    name: 'Mangalagiri Nizam Border Pure Cotton',
    weaveCluster: 'Mangalagiri',
    state: 'Andhra Pradesh',
    cooperativeName: 'Mangalagiri Weavers Union',
    giTagStatus: 'GI Certified (GI-24)',
    fabricPurity: '80s Combed Handloom Cotton',
    pricePerMeter: 420,
    unstitchedSetPrice: 1850,
    availableMeters: 65,
    rating: 4.8,
    image: getImageSrc(mangalagiriDressImg),
    craftNotes: 'Crisp breathable cotton with signature metallic Nizam border. Perfect for structured summer kurtas.'
  },
  {
    id: 'hf-4',
    name: 'Traditional Kerala Kasavu Handwoven Fabric',
    weaveCluster: 'Balaramapuram',
    state: 'Kerala',
    cooperativeName: 'Kerala Weaver Collective',
    giTagStatus: 'India Handloom Brand Certified',
    fabricPurity: '100% Unbleached Organic Cotton',
    pricePerMeter: 380,
    unstitchedSetPrice: 1450,
    availableMeters: 55,
    rating: 4.75,
    image: getImageSrc(dothiImg),
    craftNotes: 'Natural unbleached ecru cotton woven with pure metallic borders, soft on skin with natural hand-feel.'
  },
  {
    id: 'hf-5',
    name: 'Pure Fine Bengal Muslin Dupatta Textile',
    weaveCluster: 'Shantipur & Phulia',
    state: 'West Bengal',
    cooperativeName: 'Bengal Artisan Forum',
    giTagStatus: 'Heritage Artisan Guild',
    fabricPurity: '100s Count Fine Handspun Muslin',
    pricePerMeter: 490,
    unstitchedSetPrice: 1250,
    availableMeters: 30,
    rating: 4.85,
    image: getImageSrc(dupattaImg),
    craftNotes: 'Gossamer light hand-spun muslin drape with delicate woven jamdani floral butis.'
  },
  {
    id: 'hf-6',
    name: 'Chirala Kupadam Handloom Cotton Fabric',
    weaveCluster: 'Chirala Coastal Looms',
    state: 'Andhra Pradesh',
    cooperativeName: 'Heritage Weaver Society',
    giTagStatus: 'GI Protected Cluster',
    fabricPurity: 'Pure Cotton Handloom Dye',
    pricePerMeter: 540,
    unstitchedSetPrice: 2800,
    availableMeters: 38,
    rating: 4.9,
    image: getImageSrc(sareesImg),
    craftNotes: 'Kupadam interlocking border weave with solid temple borders and natural vegetable vat dyes.'
  }
];

// Occasion presets for AI Co-Creation accelerator
const AI_OCCASIONS = [
  {
    id: 'occ-1',
    label: '👑 Royal Wedding Reception',
    palette: 'Crimson Red & Antique Gold',
    fabric: 'Pure Banarasi Katan Silk',
    silhouette: 'Flared 16-Kali Lehenga',
    tailor: 'Ustad Rizwan Khan',
    prompt: 'Crimson Katan Silk bridal lehenga with antique zardozi peacock border for December royal wedding reception'
  },
  {
    id: 'occ-2',
    label: '✨ Sangeet Night Gala',
    palette: 'Teal Green & Rose Gold',
    fabric: 'Silk Georgette & Organza',
    silhouette: 'Floor-Length Anarkali Gown',
    tailor: 'Priya Sen Atelier',
    prompt: 'Teal Green flared Anarkali gown with asymmetrical organza cape and delicate resham work for sangeet evening'
  },
  {
    id: 'occ-3',
    label: '🪷 Auspicious Temple Ritual',
    palette: 'Peacock Blue & Pure Gold Zari',
    fabric: 'Kanchipuram Heavy Mulberry Silk',
    silhouette: 'Temple Saree & Corset Blouse',
    tailor: 'Master Rameshwar Reddy',
    prompt: 'Peacock blue Kanchipuram silk saree with traditional mayil temple border and custom structured blouse'
  },
  {
    id: 'occ-4',
    label: '🌿 Modern Pret Fusion',
    palette: 'Ivory & Mustard Geometric Ikat',
    fabric: 'Pochampally Double-Ikat Cotton',
    silhouette: 'Mandarin Collar Tiered Maxi Dress',
    tailor: 'Ananya Rao Modern Couture',
    prompt: 'Contemporary ivory and ochre Pochampally ikat maxi dress with mandarin collar and functional pockets'
  }
];

export const CustomerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useOutletContext<OutletContextType>();
  const { theme, setTheme } = useTheme();

  // Tab & Filter states
  const [activeHubTab, setActiveHubTab] = useState<'all' | 'designs' | 'tailors' | 'fabrics' | 'custom' | 'ai' | 'orders'>('all');
  const [selectedDesignCategory, setSelectedDesignCategory] = useState<string>('All');
  const [selectedAiOccasion, setSelectedAiOccasion] = useState(AI_OCCASIONS[0]);

  // Interactive Customizer preview state
  const [customSilhouette, setCustomSilhouette] = useState('Flared Kali Lehenga');
  const [customNeckline, setCustomNeckline] = useState('Sweetheart Royal');
  const [customSleeve, setCustomSleeve] = useState('Elbow Length with Zari Border');
  const [customFabric, setCustomFabric] = useState('Pochampally Double-Ikat Silk Cotton');

  // Modal states for Order Agreement / Booking
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [activeModalItem, setActiveModalItem] = useState<{
    name: string;
    price: number;
    weaver?: string;
    tailor?: string;
  } | null>(null);

  // Cart item management
  const [cartCount, setCartCount] = useState(1);

  // Filtered designs
  const filteredDesigns = selectedDesignCategory === 'All'
    ? COUTURE_DESIGNS
    : COUTURE_DESIGNS.filter(d => d.category === selectedDesignCategory);

  const handleAddToCart = (name: string, price: number) => {
    setCartCount(prev => prev + 1);
    showToast(`Added "${name}" (₹${price.toLocaleString()}) to your Cart!`, 'success');
  };

  const handleBookNow = (item: { name: string; price: number; weaver?: string; tailor?: string }) => {
    setActiveModalItem(item);
    setShowAgreementModal(true);
  };

  const handleAgreementNext = () => {
    setShowAgreementModal(false);
    setShowConfirm(true);
  };

  const confirmBooking = () => {
    setShowConfirm(false);
    showToast(`Bespoke commission confirmed for "${activeModalItem?.name || 'Outfit'}"! Milestone tracker updated.`, 'success');
  };

  const scrollToSection = (sectionId: string, tabKey: any) => {
    setActiveHubTab(tabKey);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="customer-marketplace">
      <style>{`
        .customer-marketplace {
          max-width: 1360px;
          margin: 0 auto;
          padding: 8px 12px 60px;
          font-family: var(--font-body);
          color: var(--text-primary);
        }

        /* Hero Marketplace Header */
        .marketplace-hero {
          position: relative;
          background: linear-gradient(135deg, rgba(200, 155, 60, 0.12), rgba(122, 46, 46, 0.08), rgba(255, 255, 255, 0.95));
          border: 1px solid var(--accent-gold);
          border-radius: var(--border-radius-lg);
          padding: 32px 36px;
          margin-bottom: 28px;
          box-shadow: var(--shadow-md);
          overflow: hidden;
        }

        .marketplace-hero::before {
          content: "";
          position: absolute;
          top: -60px;
          right: -60px;
          width: 240px;
          height: 240px;
          background: radial-gradient(circle, rgba(200, 155, 60, 0.25) 0%, rgba(200, 155, 60, 0) 70%);
          pointer-events: none;
        }

        .hero-top-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 24px;
        }

        .hero-badge-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          background: rgba(200, 155, 60, 0.15);
          border: 1px solid var(--accent-gold);
          color: var(--accent-gold-dark);
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 12px;
        }

        .hero-title {
          font-family: var(--font-heading);
          font-size: 34px;
          font-weight: 700;
          margin: 0 0 10px;
          color: var(--text-primary);
          line-height: 1.2;
        }

        .hero-subtitle {
          font-size: 15px;
          color: var(--text-secondary);
          max-width: 680px;
          line-height: 1.6;
          margin: 0;
        }

        .hero-pillars-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 14px;
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px dashed var(--border-color);
        }

        .pillar-stat-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-md);
          padding: 14px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: transform 0.2s ease, border-color 0.2s ease;
        }

        .pillar-stat-card:hover {
          transform: translateY(-2px);
          border-color: var(--accent-gold);
        }

        .pillar-icon-box {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: rgba(200, 155, 60, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
        }

        /* Hub Navigation Pill Bar */
        .hub-nav-bar {
          position: sticky;
          top: 76px;
          z-index: 100;
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding: 12px 6px;
          margin-bottom: 30px;
          background: rgba(250, 247, 242, 0.95);
          backdrop-filter: blur(12px);
          border-radius: var(--border-radius-md);
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-sm);
        }

        .hub-nav-btn {
          padding: 10px 18px;
          border-radius: 30px;
          border: 1px solid var(--border-color);
          background: var(--bg-secondary);
          color: var(--text-secondary);
          font-size: 13px;
          font-weight: 600;
          white-space: nowrap;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .hub-nav-btn.active, .hub-nav-btn:hover {
          background: var(--accent-gold);
          color: #000;
          border-color: var(--accent-gold);
          font-weight: 700;
          box-shadow: 0 4px 14px rgba(200, 155, 60, 0.25);
        }

        /* Active Bespoke Order Tracker */
        .bespoke-order-panel {
          background: var(--bg-secondary);
          border: 1px solid var(--accent-gold);
          border-radius: var(--border-radius-lg);
          padding: 24px;
          margin-bottom: 36px;
          box-shadow: var(--shadow-sm);
          position: relative;
        }

        .order-stepper {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
          margin: 24px 0 16px;
        }

        .stepper-step {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 14px;
          background: var(--bg-primary);
          border-radius: var(--border-radius-sm);
          border: 1px solid var(--border-color);
          transition: all 0.2s ease;
        }

        .stepper-step.completed {
          border-color: #2a9d8f;
          background: rgba(42, 157, 143, 0.05);
        }

        .stepper-step.active {
          border-color: var(--accent-gold);
          background: rgba(200, 155, 60, 0.08);
          box-shadow: 0 0 12px rgba(200, 155, 60, 0.15);
        }

        /* Section Containers */
        .marketplace-section {
          margin-bottom: 48px;
          scroll-margin-top: 150px;
        }

        .section-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border-color);
        }

        .section-title {
          font-family: var(--font-heading);
          font-size: 24px;
          margin: 0 0 6px;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .section-subtitle {
          font-size: 13px;
          color: var(--text-muted);
          margin: 0;
        }

        /* Couture Grid */
        .couture-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }

        .couture-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-sm);
          transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
        }

        .couture-card:hover {
          transform: translateY(-5px);
          border-color: var(--accent-gold);
          box-shadow: var(--shadow-md);
        }

        .couture-image-wrap {
          position: relative;
          width: 100%;
          height: 290px;
          overflow: hidden;
          background: #151515;
          cursor: pointer;
        }

        .couture-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .couture-card:hover .couture-image {
          transform: scale(1.05);
        }

        .couture-tag-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(20, 20, 20, 0.85);
          color: #fff;
          border: 1px solid var(--accent-gold);
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          backdrop-filter: blur(4px);
        }

        .couture-rating-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(255, 255, 255, 0.92);
          color: #000;
          padding: 3px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 800;
        }

        .couture-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .price-breakdown-box {
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-sm);
          padding: 10px 12px;
          margin: 12px 0 16px;
          font-size: 12px;
        }

        /* Tailor Directory Grid */
        .tailor-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
          gap: 22px;
        }

        .tailor-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          padding: 22px;
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          transition: all 0.25s ease;
        }

        .tailor-card:hover {
          border-color: var(--accent-gold);
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
        }

        .tailor-avatar {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--accent-gold), var(--accent-copper));
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: 800;
          font-family: var(--font-heading);
          flex-shrink: 0;
          border: 2px solid var(--bg-secondary);
          box-shadow: 0 4px 12px rgba(200, 155, 60, 0.3);
        }

        /* Handloom Fabric Pavilion Grid */
        .fabric-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }

        .fabric-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          transition: transform 0.2s ease, border-color 0.2s ease;
        }

        .fabric-card:hover {
          transform: translateY(-4px);
          border-color: var(--accent-gold);
        }

        .fabric-thumb-wrap {
          position: relative;
          height: 200px;
          width: 100%;
          overflow: hidden;
          background: #222;
        }

        .fabric-thumb {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .fabric-card:hover .fabric-thumb {
          transform: scale(1.05);
        }

        /* AI Co-Creation Section */
        .ai-cocreation-box {
          background: linear-gradient(135deg, rgba(200, 155, 60, 0.15), rgba(192, 108, 132, 0.1), rgba(255, 255, 255, 0.95));
          border: 1px solid var(--accent-gold);
          border-radius: var(--border-radius-lg);
          padding: 30px;
          box-shadow: var(--shadow-md);
        }

        /* Customization Interactive Studio */
        .customizer-preview-container {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          padding: 28px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 28px;
        }

        @media (max-width: 900px) {
          .customizer-preview-container {
            grid-template-columns: 1fr;
          }
        }

        /* Category Filter Buttons */
        .filter-btn-group {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 4px;
        }

        .filter-btn {
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          border: 1px solid var(--border-color);
          background: var(--bg-secondary);
          color: var(--text-secondary);
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s ease;
        }

        .filter-btn.active, .filter-btn:hover {
          background: var(--bg-tertiary);
          border-color: var(--accent-gold);
          color: var(--accent-gold-dark);
        }

        .modal-backdrop {
          position: fixed;
          top: 0; left: 0; width: 100vw; height: 100vh;
          background-color: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(5px);
          z-index: 9999;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}</style>

      {/* 1. HERO MARKETPLACE HUB */}
      <div className="marketplace-hero">
        <div className="hero-top-row">
          <div>
            <div className="hero-badge-tag">
              🏛️ AuraStitch Bespoke Fashion Marketplace
            </div>
            <h1 className="hero-title">
              Couture Crafted for You • Woven by Artisans
            </h1>
            <p className="hero-subtitle">
              Connect directly with verified <strong>Master Tailors</strong> and authentic <strong>GI Handloom Weavers</strong>. 
              Discover haute couture dresses, explore certified pure silks, customize garments to your exact measurements, or co-design with Gemini AI.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '220px' }}>
            <button
              className="btn-primary"
              style={{ padding: '12px 20px', fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              onClick={() => navigate('/customer/ai-designer')}
            >
              ✨ Open AI Dress Designer
            </button>
            <button
              className="btn-secondary"
              style={{ padding: '10px 18px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              onClick={() => navigate('/customer/design-lab')}
            >
              ✂️ 3D Outfit Customizer Lab
            </button>
          </div>
        </div>

        {/* 6 Core Value Pillars Quick Cards */}
        <div className="hero-pillars-grid">
          <div className="pillar-stat-card" style={{ cursor: 'pointer' }} onClick={() => scrollToSection('sec-designs', 'designs')}>
            <div className="pillar-icon-box">👗</div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Discover</div>
              <div style={{ fontSize: '14px', fontWeight: 700 }}>Bespoke Dresses</div>
            </div>
          </div>

          <div className="pillar-stat-card" style={{ cursor: 'pointer' }} onClick={() => scrollToSection('sec-tailors', 'tailors')}>
            <div className="pillar-icon-box">🪡</div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Verified</div>
              <div style={{ fontSize: '14px', fontWeight: 700 }}>1,200+ Master Tailors</div>
            </div>
          </div>

          <div className="pillar-stat-card" style={{ cursor: 'pointer' }} onClick={() => scrollToSection('sec-fabrics', 'fabrics')}>
            <div className="pillar-icon-box">🧵</div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Direct Weavers</div>
              <div style={{ fontSize: '14px', fontWeight: 700 }}>GI Handloom Weaves</div>
            </div>
          </div>

          <div className="pillar-stat-card" style={{ cursor: 'pointer' }} onClick={() => scrollToSection('sec-custom', 'custom')}>
            <div className="pillar-icon-box">✂️</div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Made to Measure</div>
              <div style={{ fontSize: '14px', fontWeight: 700 }}>Customized Fit</div>
            </div>
          </div>

          <div className="pillar-stat-card" style={{ cursor: 'pointer' }} onClick={() => scrollToSection('sec-ai', 'ai')}>
            <div className="pillar-icon-box">✨</div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Gemini Powered</div>
              <div style={{ fontSize: '14px', fontWeight: 700 }}>AI Design Engine</div>
            </div>
          </div>

          <div className="pillar-stat-card" style={{ cursor: 'pointer' }} onClick={() => scrollToSection('sec-orders', 'orders')}>
            <div className="pillar-icon-box">📦</div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Live Timeline</div>
              <div style={{ fontSize: '14px', fontWeight: 700 }}>Track Commission</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. STICKY HUB NAVIGATION PILLS */}
      <div className="hub-nav-bar">
        <button
          className={`hub-nav-btn ${activeHubTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveHubTab('all')}
        >
          🌟 All Marketplace Hubs
        </button>
        <button
          className={`hub-nav-btn ${activeHubTab === 'designs' ? 'active' : ''}`}
          onClick={() => scrollToSection('sec-designs', 'designs')}
        >
          👗 Discover Dresses & Designs
        </button>
        <button
          className={`hub-nav-btn ${activeHubTab === 'tailors' ? 'active' : ''}`}
          onClick={() => scrollToSection('sec-tailors', 'tailors')}
        >
          🪡 Find Suitable Tailors
        </button>
        <button
          className={`hub-nav-btn ${activeHubTab === 'fabrics' ? 'active' : ''}`}
          onClick={() => scrollToSection('sec-fabrics', 'fabrics')}
        >
          🧵 Explore Handloom Fabrics
        </button>
        <button
          className={`hub-nav-btn ${activeHubTab === 'custom' ? 'active' : ''}`}
          onClick={() => scrollToSection('sec-custom', 'custom')}
        >
          ✂️ Customize Outfits
        </button>
        <button
          className={`hub-nav-btn ${activeHubTab === 'ai' ? 'active' : ''}`}
          onClick={() => scrollToSection('sec-ai', 'ai')}
        >
          ✨ AI Design Suggestions
        </button>
        <button
          className={`hub-nav-btn ${activeHubTab === 'orders' ? 'active' : ''}`}
          onClick={() => scrollToSection('sec-orders', 'orders')}
        >
          📦 Track Orders (1 Active)
        </button>
      </div>

      {/* 3. ACTIVE BESPOKE ORDER TRACKER (LIVE BUSINESS PIPELINE) */}
      {(activeHubTab === 'all' || activeHubTab === 'orders') && (
        <section id="sec-orders" className="marketplace-section">
          <div className="bespoke-order-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <span style={{ background: '#2a9d8f', color: '#fff', fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '10px' }}>
                    IN PRODUCTION
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Commission ID: #AS-8942</span>
                </div>
                <h3 style={{ margin: '0 0 6px', fontSize: '20px', fontFamily: 'var(--font-heading)' }}>
                  Royal Crimson Banarasi Silk Bridal Lehenga
                </h3>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Weaver: <strong>Varanasi Katan Looms Co-Op</strong> • Master Tailor: <strong>Ustad Rizwan Khan</strong> (Old Delhi)
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Target Handover Date</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--accent-gold)' }}>October 4, 2026 (In 6 Days)</div>
                <button
                  className="btn-secondary"
                  style={{ marginTop: '8px', padding: '6px 14px', fontSize: '12px', fontWeight: 600 }}
                  onClick={() => navigate('/order-timeline')}
                >
                  View Full Timeline & Escrow ➔
                </button>
              </div>
            </div>

            {/* Visual Stepper */}
            <div className="order-stepper">
              <div className="stepper-step completed">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span>✅</span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#2a9d8f' }}>Stage 1: Fabric Cut</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Katan silk authenticated by weaver</div>
                <div style={{ fontSize: '10px', color: '#2a9d8f', marginTop: '6px', fontWeight: 600 }}>Completed Mar 24</div>
              </div>

              <div className="stepper-step completed">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span>✅</span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#2a9d8f' }}>Stage 2: Pattern Drafting</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Sloper cut to 36"-28"-38" passport</div>
                <div style={{ fontSize: '10px', color: '#2a9d8f', marginTop: '6px', fontWeight: 600 }}>Completed Mar 26</div>
              </div>

              <div className="stepper-step active">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span>🟡</span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-gold-dark)' }}>Stage 3: Zardozi & Stitching</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Hand embroidery 75% complete on 16 kalis</div>
                <div style={{ fontSize: '10px', color: 'var(--accent-gold-dark)', marginTop: '6px', fontWeight: 700 }}>In Progress Today</div>
              </div>

              <div className="stepper-step">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span>⚪</span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>Stage 4: Fitting Trial</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Video basting trial with Ustad Rizwan</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '6px' }}>Scheduled: Oct 1</div>
              </div>

              <div className="stepper-step">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span>⚪</span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>Stage 5: Delivery</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Insured luxury box & escrow release</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '6px' }}>Est. Oct 4</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-primary)', padding: '10px 16px', borderRadius: '8px', fontSize: '12px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                🔒 <strong>AuraStitch Escrow Protection:</strong> ₹22,000 held safely. Payment released to weaver & tailor only after your trial sign-off.
              </div>
              <button
                className="btn-secondary"
                style={{ padding: '4px 12px', fontSize: '11px', fontWeight: 600 }}
                onClick={() => showToast('Direct secure chat with Ustad Rizwan Khan opened.', 'info')}
              >
                💬 Chat with Master Tailor
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 4. DISCOVER DRESSES AND DESIGNS */}
      {(activeHubTab === 'all' || activeHubTab === 'designs') && (
        <section id="sec-designs" className="marketplace-section">
          <div className="section-header-row">
            <div>
              <h2 className="section-title">
                <span>👗</span> Discover Dresses & Couture Designs
              </h2>
              <p className="section-subtitle">
                Explore signature designer creations. Each outfit transparently shows fabric provenance + tailor crafting fee.
              </p>
            </div>

            <div className="filter-btn-group">
              {['All', 'Bridal Couture', 'Festive & Sangeet', 'Contemporary Formal', 'Heritage Weaves'].map(cat => (
                <button
                  key={cat}
                  className={`filter-btn ${selectedDesignCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedDesignCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="couture-grid">
            {filteredDesigns.map(outfit => (
              <div key={outfit.id} className="couture-card">
                <div
                  className="couture-image-wrap"
                  onClick={() => navigate('/product-details', { state: { product: outfit } })}
                >
                  <img src={outfit.image} alt={outfit.title} className="couture-image" />
                  <span className="couture-tag-badge">{outfit.tag}</span>
                  <span className="couture-rating-badge">⭐ {outfit.rating} ({outfit.reviewsCount})</span>
                </div>

                <div className="couture-body">
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                    {outfit.category} • {outfit.silhouette}
                  </div>
                  <h3
                    style={{ fontSize: '17px', fontWeight: 700, margin: '4px 0 8px', color: 'var(--text-primary)', cursor: 'pointer', fontFamily: 'var(--font-heading)' }}
                    onClick={() => navigate('/product-details', { state: { product: outfit } })}
                  >
                    {outfit.title}
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5', margin: '0 0 10px' }}>
                    {outfit.description}
                  </p>

                  {/* AuraStitch Business Model Transparency */}
                  <div className="price-breakdown-box">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>🧵 Fabric: {outfit.fabricName}</span>
                      <strong>₹{outfit.fabricCost.toLocaleString()}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>🪡 Tailoring: {outfit.tailorName}</span>
                      <strong>₹{outfit.stitchingFee.toLocaleString()}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px dashed var(--border-color)', fontWeight: 800 }}>
                      <span style={{ color: 'var(--accent-gold-dark)' }}>Total Bespoke Commission</span>
                      <span style={{ fontSize: '15px', color: 'var(--text-primary)' }}>₹{outfit.totalPrice.toLocaleString()}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', fontSize: '11px' }}>
                    <span style={{ color: '#2a9d8f', fontWeight: 600 }}>⏱️ Handcrafted in {outfit.handcraftDays}</span>
                    <span style={{ color: 'var(--text-muted)' }}>📍 Origin: {outfit.fabricOrigin}</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: 'auto' }}>
                    <button
                      className="btn-secondary"
                      style={{ padding: '8px 10px', fontSize: '12px', fontWeight: 600 }}
                      onClick={() => navigate('/customer/design-lab', { state: { selectedOutfit: outfit } })}
                    >
                      ✂️ Customize
                    </button>
                    <button
                      className="btn-primary"
                      style={{ padding: '8px 10px', fontSize: '12px', fontWeight: 700 }}
                      onClick={() => handleBookNow({ name: outfit.title, price: outfit.totalPrice, weaver: outfit.fabricOrigin, tailor: outfit.tailorName })}
                    >
                      Book with Tailor
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. FIND SUITABLE TAILORS (ARTISAN ATELIER DIRECTORY) */}
      {(activeHubTab === 'all' || activeHubTab === 'tailors') && (
        <section id="sec-tailors" className="marketplace-section">
          <div className="section-header-row">
            <div>
              <h2 className="section-title">
                <span>🪡</span> Find Verified Master Tailors & Ateliers
              </h2>
              <p className="section-subtitle">
                Pair your fabric or design with vetted master craftsmen. AuraStitch guarantees a 100% fit with free doorstep alterations.
              </p>
            </div>

            <button
              className="btn-secondary"
              style={{ padding: '8px 16px', fontSize: '12px', fontWeight: 600 }}
              onClick={() => showToast('Filtered for tailors available for immediate booking this week.', 'info')}
            >
              ⚡ Instant Available Tailors
            </button>
          </div>

          <div className="tailor-grid">
            {MASTER_TAILORS.map(tailor => (
              <div key={tailor.id} className="tailor-card">
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '14px' }}>
                  <div className="tailor-avatar">{tailor.avatarText}</div>
                  <div>
                    <h3 style={{ margin: '0 0 2px', fontSize: '17px', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
                      {tailor.name}
                    </h3>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{tailor.atelier}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>📍 {tailor.location}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                  {tailor.badges.map(b => (
                    <span key={b} style={{ fontSize: '10px', fontWeight: 700, background: 'rgba(200, 155, 60, 0.15)', color: 'var(--accent-gold-dark)', padding: '2px 8px', borderRadius: '10px' }}>
                      {b}
                    </span>
                  ))}
                </div>

                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5', margin: '0 0 14px' }}>
                  {tailor.bio}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', background: 'var(--bg-primary)', padding: '10px', borderRadius: '8px', textAlign: 'center', marginBottom: '14px' }}>
                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Experience</div>
                    <div style={{ fontSize: '13px', fontWeight: 800 }}>{tailor.experienceYears} Yrs</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Rating</div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#ffb703' }}>⭐ {tailor.rating}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>1st Fit Success</div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#2a9d8f' }}>{tailor.firstFitSuccess}</div>
                  </div>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>Specialities:</div>
                  <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                    {tailor.specializations.map(spec => (
                      <span key={spec} style={{ fontSize: '11px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', padding: '2px 8px', borderRadius: '4px' }}>
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', fontSize: '12px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Starting Stitching Fee:</span>
                  <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>From ₹{tailor.startingPrice.toLocaleString()}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: 'auto' }}>
                  <button
                    className="btn-secondary"
                    style={{ padding: '8px', fontSize: '12px', fontWeight: 600 }}
                    onClick={() => showToast(`Consultation request sent to ${tailor.name}! They will review your measurements.`, 'success')}
                  >
                    💬 Book Consult
                  </button>
                  <button
                    className="btn-primary"
                    style={{ padding: '8px', fontSize: '12px', fontWeight: 700 }}
                    onClick={() => handleBookNow({ name: `Tailoring Commission with ${tailor.name}`, price: tailor.startingPrice, tailor: tailor.name })}
                  >
                    Assign to Fabric
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. EXPLORE HANDLOOM FABRICS (DIRECT FROM WEAVERS) */}
      {(activeHubTab === 'all' || activeHubTab === 'fabrics') && (
        <section id="sec-fabrics" className="marketplace-section">
          <div className="section-header-row">
            <div>
              <h2 className="section-title">
                <span>🧵</span> Explore Handloom Fabrics (Direct from Artisan Looms)
              </h2>
              <p className="section-subtitle">
                Eliminating middlemen. Buy GI-tagged textiles directly from certified weaver cooperatives with Silk Mark provenance.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Verified Provenance:</span>
              <span style={{ fontSize: '11px', background: '#2a9d8f', color: '#fff', padding: '3px 8px', borderRadius: '10px', fontWeight: 700 }}>
                100% GI Authentic
              </span>
            </div>
          </div>

          <div className="fabric-grid">
            {HANDLOOM_FABRICS.map(fabric => (
              <div key={fabric.id} className="fabric-card">
                <div className="fabric-thumb-wrap">
                  <img src={fabric.image} alt={fabric.name} className="fabric-thumb" />
                  <span style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.85)', color: 'var(--accent-gold)', border: '1px solid var(--accent-gold)', padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 700 }}>
                    {fabric.giTagStatus}
                  </span>
                  <span style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(255,255,255,0.92)', color: '#000', padding: '2px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: 800 }}>
                    {fabric.availableMeters}m in stock
                  </span>
                </div>

                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--accent-gold)', textTransform: 'uppercase' }}>
                    {fabric.weaveCluster}, {fabric.state}
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '4px 0 6px', color: 'var(--text-primary)' }}>
                    {fabric.name}
                  </h3>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    🧑‍🌾 Weaver: <strong>{fabric.cooperativeName}</strong>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px', lineHeight: '1.4' }}>
                    {fabric.craftNotes}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '8px 10px', background: 'var(--bg-primary)', borderRadius: '6px', marginBottom: '14px' }}>
                    <div>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Per Meter: </span>
                      <strong style={{ fontSize: '14px' }}>₹{fabric.pricePerMeter}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Unstitched Set: </span>
                      <strong style={{ fontSize: '16px', color: 'var(--accent-gold-dark)' }}>₹{fabric.unstitchedSetPrice.toLocaleString()}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: 'auto' }}>
                    <button
                      className="btn-secondary"
                      style={{ padding: '8px', fontSize: '12px', fontWeight: 600 }}
                      onClick={() => handleAddToCart(fabric.name, fabric.unstitchedSetPrice)}
                    >
                      Buy Fabric
                    </button>
                    <button
                      className="btn-primary"
                      style={{ padding: '8px', fontSize: '12px', fontWeight: 700 }}
                      onClick={() => {
                        showToast(`Fabric "${fabric.name}" assigned! Select your preferred Master Tailor.`, 'info');
                        scrollToSection('sec-tailors', 'tailors');
                      }}
                    >
                      Send to Tailor
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. CUSTOMIZE OUTFITS (INTERACTIVE BESPOKE CUSTOMIZER HUB) */}
      {(activeHubTab === 'all' || activeHubTab === 'custom') && (
        <section id="sec-custom" className="marketplace-section">
          <div className="section-header-row">
            <div>
              <h2 className="section-title">
                <span>✂️</span> Customize Outfits to Your Exact Silhouette
              </h2>
              <p className="section-subtitle">
                Configure your cut, neckline, sleeves, and borders. Connect with your saved body measurements for flawless fit.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="btn-secondary"
                style={{ padding: '8px 14px', fontSize: '12px', fontWeight: 600 }}
                onClick={() => navigate('/customer/measurements')}
              >
                📐 My Measurement Passport (36"-28"-38")
              </button>
              <button
                className="btn-primary"
                style={{ padding: '8px 16px', fontSize: '12px', fontWeight: 700 }}
                onClick={() => navigate('/customer/design-lab')}
              >
                Launch 3D Design Lab ➔
              </button>
            </div>
          </div>

          <div className="customizer-preview-container">
            {/* Customization Options */}
            <div>
              <h3 style={{ fontSize: '18px', fontFamily: 'var(--font-heading)', margin: '0 0 16px' }}>
                Bespoke Configuration Controls
              </h3>

              {/* Garment Silhouette */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
                  1. Garment Silhouette
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['Flared Kali Lehenga', 'Floor-Length Anarkali', 'Straight Tunic Kurti', 'Saree & Padded Corset', 'Indo-Western Drape Gown'].map(sil => (
                    <button
                      key={sil}
                      className={`filter-btn ${customSilhouette === sil ? 'active' : ''}`}
                      onClick={() => setCustomSilhouette(sil)}
                    >
                      {sil}
                    </button>
                  ))}
                </div>
              </div>

              {/* Neckline */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
                  2. Bodice Neckline Cut
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['Sweetheart Royal', 'Mandarin Collar', 'Deep-V Sloper', 'Boat Neck Elegance', 'Keyhole Halter'].map(neck => (
                    <button
                      key={neck}
                      className={`filter-btn ${customNeckline === neck ? 'active' : ''}`}
                      onClick={() => setCustomNeckline(neck)}
                    >
                      {neck}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sleeve Style */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
                  3. Sleeve Style & Border
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['Elbow Length with Zari Border', 'Sleeveless with Piping', 'Cap Sleeve Delicate', 'Full Illusion Net with Motifs'].map(sleeve => (
                    <button
                      key={sleeve}
                      className={`filter-btn ${customSleeve === sleeve ? 'active' : ''}`}
                      onClick={() => setCustomSleeve(sleeve)}
                    >
                      {sleeve}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fabric Choice */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
                  4. Handloom Fabric Choice
                </label>
                <select
                  value={customFabric}
                  onChange={(e) => setCustomFabric(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '13px' }}
                >
                  {HANDLOOM_FABRICS.map(f => (
                    <option key={f.id} value={f.name}>
                      {f.name} ({f.giTagStatus}) — ₹{f.unstitchedSetPrice}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Customizer Specification Summary */}
            <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <span style={{ fontSize: '20px' }}>📋</span>
                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
                  Bespoke Work Order Summary
                </h4>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px solid var(--border-color)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Chosen Silhouette:</span>
                  <strong>{customSilhouette}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px solid var(--border-color)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Neckline Cut:</span>
                  <strong>{customNeckline}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px solid var(--border-color)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Sleeve Craft:</span>
                  <strong>{customSleeve}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px solid var(--border-color)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Textile Provenance:</span>
                  <strong style={{ maxWidth: '200px', textAlign: 'right' }}>{customFabric}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px solid var(--border-color)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Measurement Profile:</span>
                  <span style={{ color: '#2a9d8f', fontWeight: 700 }}>✅ Passport Synced</span>
                </div>
              </div>

              <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--accent-gold)', borderRadius: '10px', padding: '14px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span>Estimated Master Tailoring Fee:</span>
                  <span>₹2,400</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                  <span>Handloom Fabric Set:</span>
                  <span>₹2,450</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: 800, borderTop: '1px dashed var(--border-color)', paddingTop: '6px' }}>
                  <span style={{ color: 'var(--accent-gold-dark)' }}>Total Commission:</span>
                  <span>₹4,850</span>
                </div>
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
                <button
                  className="btn-secondary"
                  style={{ flex: 1, padding: '10px', fontSize: '12px', fontWeight: 600 }}
                  onClick={() => navigate('/customer/design-lab')}
                >
                  Inspect in 3D
                </button>
                <button
                  className="btn-primary"
                  style={{ flex: 1, padding: '10px', fontSize: '12px', fontWeight: 700 }}
                  onClick={() => handleBookNow({ name: `Custom ${customSilhouette}`, price: 4850, weaver: customFabric, tailor: 'Assigned Master Tailor' })}
                >
                  Commission Outfit
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 8. GET AI DESIGN SUGGESTIONS (GEMINI COUTURE ENGINE ACCELERATOR) */}
      {(activeHubTab === 'all' || activeHubTab === 'ai') && (
        <section id="sec-ai" className="marketplace-section">
          <div className="section-header-row">
            <div>
              <h2 className="section-title">
                <span>✨</span> Get AI Design Suggestions (Powered by Gemini)
              </h2>
              <p className="section-subtitle">
                Receive instant haute couture styling consultations. Our AI recommends harmonious silhouette cuts, GI handloom weaves, and verified tailors.
              </p>
            </div>

            <button
              className="btn-primary"
              style={{ padding: '8px 16px', fontSize: '13px', fontWeight: 700 }}
              onClick={() => navigate('/customer/ai-designer')}
            >
              Open Full AI Dress Designer Studio ➔
            </button>
          </div>

          <div className="ai-cocreation-box">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <span style={{ fontSize: '24px' }}>🔮</span>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontFamily: 'var(--font-heading)' }}>
                  Occasion-Based Bespoke Style Consultant
                </h3>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Select your upcoming event to see AI curated fabric harmony, tailor match, and prompt accelerators:
                </div>
              </div>
            </div>

            {/* Occasion Selector Pills */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '22px' }}>
              {AI_OCCASIONS.map(occ => (
                <button
                  key={occ.id}
                  className={`hub-nav-btn ${selectedAiOccasion.id === occ.id ? 'active' : ''}`}
                  onClick={() => setSelectedAiOccasion(occ)}
                  style={{ fontSize: '12px' }}
                >
                  {occ.label}
                </button>
              ))}
            </div>

            {/* Generated Suggestion Card */}
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--accent-gold)', borderRadius: '12px', padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Recommended Silhouette
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, marginTop: '2px' }}>{selectedAiOccasion.silhouette}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>Structured sloper with custom lining</div>
              </div>

              <div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Recommended Handloom
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, marginTop: '2px', color: 'var(--accent-gold-dark)' }}>{selectedAiOccasion.fabric}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>Silk Mark certified woven yardage</div>
              </div>

              <div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Recommended Master Tailor
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, marginTop: '2px' }}>{selectedAiOccasion.tailor}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>Specialist in this exact silhouette</div>
              </div>

              <div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Harmonious Palette
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, marginTop: '2px' }}>{selectedAiOccasion.palette}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>Natural dye contrast pairing</div>
              </div>
            </div>

            {/* Prompt Accelerator Banner */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-primary)', padding: '14px 18px', borderRadius: '10px', border: '1px dashed var(--border-color)', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ flex: 1, minWidth: '240px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                  AI Prompt Blueprint
                </div>
                <div style={{ fontSize: '13px', fontStyle: 'italic', color: 'var(--text-primary)', marginTop: '2px' }}>
                  "{selectedAiOccasion.prompt}"
                </div>
              </div>

              <button
                className="btn-primary"
                style={{ padding: '8px 16px', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}
                onClick={() => navigate('/customer/ai-designer')}
              >
                ✨ Generate in AI Studio
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 9. ACTIVE CART PRELOADED SECTION */}
      <div className="glass-panel" style={{ padding: '20px', marginBottom: '32px', borderLeft: '4px solid var(--accent-gold)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🛒 My Active Shopping Cart <span style={{ fontSize: '12px', background: 'var(--accent-gold)', color: '#000', padding: '2px 8px', borderRadius: '12px', fontWeight: 800 }}>{cartCount} Item</span>
          </h3>
          <button
            className="btn-secondary"
            style={{ padding: '4px 12px', fontSize: '12px' }}
            onClick={() => navigate('/cart')}
          >
            Go to Cart Checkout ➔
          </button>
        </div>

        <div style={{ display: 'flex', gap: '16px', background: 'var(--bg-primary)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)', alignItems: 'center', flexWrap: 'wrap' }}>
          <img src={getImageSrc(dothiImg)} alt="Traditional Handwoven Cotton Dhoti" style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover' }} />
          <div style={{ flex: 1, minWidth: '200px' }}>
            <span style={{ fontSize: '11px', color: 'var(--accent-gold)', fontWeight: 700 }}>Kerala Handloom GI Weave</span>
            <h4 style={{ margin: '2px 0 4px', fontSize: '15px', fontWeight: 700 }}>Traditional Handwoven Cotton Dhoti</h4>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Seller: <strong>Kerala Weaver Collective</strong> • Qty: <strong>1</strong> • Escrow Protected
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Price: ₹1,450</div>
            <div style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)' }}>Total: ₹1,450</div>
          </div>
        </div>
      </div>

      {/* 10. LUXURY THEME ATMOSPHERE SELECTOR */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Atmosphere Mood: <strong>{theme.toUpperCase()}</strong>
        </div>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
          {[
            { key: 'light', label: 'Ivory Modern' },
            { key: 'traditional', label: 'Traditional Clay' },
            { key: 'retro', label: 'Vintage Gold' },
            { key: 'royal', label: 'Royal Wedding' },
            { key: 'handloom', label: 'Artisan Loom' },
            { key: 'festival', label: 'Festive Saffron' }
          ].map(tab => (
            <button
              key={tab.key}
              className={`filter-btn ${theme === tab.key ? 'active' : ''}`}
              style={{ fontSize: '11px', padding: '4px 10px' }}
              onClick={() => {
                setTheme(tab.key as any);
                showToast(`Theme updated to: ${tab.label}`, 'info');
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && activeModalItem && (
        <div className="modal-backdrop fade-in">
          <div className="glass-panel" style={{ width: '90%', maxWidth: '440px', padding: '30px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>👑</div>
            <h3 style={{ marginBottom: '8px', fontSize: '22px', fontFamily: 'var(--font-heading)' }}>
              Confirm Bespoke Commission
            </h3>
            <p style={{ marginBottom: '16px', color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.5' }}>
              You are commissioning <strong>{activeModalItem.name}</strong>.
              Funds are held securely in AuraStitch Escrow until your fitting trial is complete.
            </p>
            <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--accent-gold)', marginBottom: '22px' }}>
              Total: ₹{activeModalItem.price.toLocaleString()}
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button className="btn-secondary" onClick={() => setShowConfirm(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={confirmBooking}>
                Confirm Commission
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Agreement Modal */}
      {activeModalItem && (
        <OrderAgreementModal
          isOpen={showAgreementModal}
          onClose={() => setShowAgreementModal(false)}
          onNext={handleAgreementNext}
          orderTitle={activeModalItem.name}
          orderPrice={activeModalItem.price}
          roleType="customer"
        />
      )}
    </div>
  );
};

export default CustomerDashboard;

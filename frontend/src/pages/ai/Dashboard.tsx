import React, { useState, useMemo } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';

// High-resolution outfit assets
import floralPinkLehengaImg from '../../assets/outfits/floral_pink_lehenga.png';
import luxuryWeddingLehengaImg from '../../assets/outfits/luxury_wedding_lehenga.png';
import royalBlueKurtiImg from '../../assets/outfits/royal_blue_kurti.png';

// Handloom & garment images
import kanchipuramSareeImg from '../customer/images/kanchipuramsaree.jpg';
import pochampallyDressImg from '../customer/images/pochampallydress.jpg';
import mangalagiriDressImg from '../customer/images/Mangalagiridress.jpg';
import sareesImg from '../customer/images/Sarees.jpg';

// Material & trim images from supplier
import laysImg from '../supplier/images/Lays1.jpg';
import threadsImg from '../supplier/images/Threads1.jpg';
import beadsImg from '../supplier/images/Beads1.jpg';

const getImageSrc = (img: any): string => {
  if (!img) return '';
  if (typeof img === 'string') return img;
  if (typeof img === 'object' && 'default' in img) return (img as any).default;
  return String(img);
};

interface OutletContextType {
  showToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

// Recommendation item types across the 6 AuraStitch business categories
export interface RecommendedItem {
  id: string;
  category: 'dress' | 'tailor' | 'fabric' | 'design' | 'material' | 'style';
  title: string;
  subtitle: string;
  image: string;
  price: number;
  matchScore: number; // e.g. 98 -> 98%
  whyRecommended: string;
  tags: string[];
  occasion: string[];
  styleVibe: string;
  fabricType?: string;
  rating: number;
  reviewsCount: number;
  artisanName?: string;
  location?: string;
  badges?: string[];
  specs?: Record<string, string>;
}

// Curated pool of existing AuraStitch products, tailors, fabrics, designs, materials, and styles
const RECOMMENDATION_CATALOG: RecommendedItem[] = [
  // 1. DRESSES
  {
    id: 'rec-d1',
    category: 'dress',
    title: 'The Imperial Gulbagh Wedding Lehenga',
    subtitle: 'Pure Banarasi Katan Silk with Hand-Embroidered Zardozi',
    image: getImageSrc(luxuryWeddingLehengaImg),
    price: 22000,
    matchScore: 99,
    whyRecommended: 'Perfect match for your Wedding occasion interest and pure silk preference with handcrafted zardozi.',
    tags: ['Bridal', 'Banarasi Silk', 'Zardozi', '16-Kali Flare'],
    occasion: ['Wedding Ceremony (Bridal)', 'Reception & Cocktail Gala'],
    styleVibe: 'Royal Heritage',
    fabricType: 'Banarasi Silk',
    rating: 4.95,
    reviewsCount: 184,
    artisanName: 'Varanasi Looms × Ustad Rizwan',
    badges: ['👑 Top Bridal Match', '100% Fit Guarantee'],
    specs: {
      'Fabric Cost': '₹14,500',
      'Tailoring Fee': '₹7,500',
      'Turnaround': '12–15 Days'
    }
  },
  {
    id: 'rec-d2',
    category: 'dress',
    title: 'Noorani Rose Silk Flared Anarkali',
    subtitle: 'Chanderi Mulberry Silk with Resham Floral Threadwork',
    image: getImageSrc(floralPinkLehengaImg),
    price: 9800,
    matchScore: 95,
    whyRecommended: 'Recommended based on your interest in pastel tones and lightweight festive silhouetted drapes.',
    tags: ['Festive', 'Chanderi Silk', 'Anarkali', 'Resham Work'],
    occasion: ['Sangeet & Mehendi Night', 'Festive Soirée (Diwali/Eid)'],
    styleVibe: 'Contemporary Fusion',
    fabricType: 'Chanderi Silk',
    rating: 4.88,
    reviewsCount: 142,
    artisanName: 'Chanderi Guild × Priya Sen',
    badges: ['✨ Festive Trending', 'Bestseller'],
    specs: {
      'Fabric Cost': '₹6,200',
      'Tailoring Fee': '₹3,600',
      'Turnaround': '7–10 Days'
    }
  },
  {
    id: 'rec-d3',
    category: 'dress',
    title: 'Royal Azure Chanderi Kurti & Trousers',
    subtitle: 'Straight Tunic with Gota Patti & Cigarette Pants',
    image: getImageSrc(royalBlueKurtiImg),
    price: 5900,
    matchScore: 92,
    whyRecommended: 'Matches your budget under ₹10,000 for boutique daytime formal wear with authentic gota accents.',
    tags: ['Contemporary Formal', 'Gota Patti', 'Office Chic'],
    occasion: ['Boutique Pret / Casual Chic', 'Festive Soirée (Diwali/Eid)'],
    styleVibe: 'Modern Minimalist',
    fabricType: 'Chanderi Silk',
    rating: 4.82,
    reviewsCount: 96,
    artisanName: 'Master Rameshwar Reddy',
    badges: ['⚡ Fast 5-Day Delivery', 'Comfort Fit'],
    specs: {
      'Fabric Cost': '₹3,800',
      'Tailoring Fee': '₹2,100',
      'Turnaround': '5–7 Days'
    }
  },

  // 2. TAILORS
  {
    id: 'rec-t1',
    category: 'tailor',
    title: 'Ustad Rizwan Khan',
    subtitle: 'Master Bridal Atelier (Chandni Chowk, Old Delhi)',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80',
    price: 2400,
    matchScore: 98,
    whyRecommended: '99.4% first-fit accuracy on bridal lehenga kalis and padded corset bodices matching your measurements.',
    tags: ['24 Yrs Exp', 'Bridal Couture', 'Zardozi Slopers', 'At-Home Trial'],
    occasion: ['Wedding Ceremony (Bridal)', 'Reception & Cocktail Gala'],
    styleVibe: 'Royal Heritage',
    rating: 4.95,
    reviewsCount: 482,
    artisanName: 'Atelier Rizwan Heritage',
    location: 'Old Delhi',
    badges: ['🛡️ AuraStitch Master Certified', '99.4% Fit Accuracy'],
    specs: {
      'Starting Fee': 'From ₹2,400',
      'Standard Turnaround': '8–12 Days',
      'Fit Guarantee': 'Free Alterations'
    }
  },
  {
    id: 'rec-t2',
    category: 'tailor',
    title: 'Priya Sen Atelier',
    subtitle: 'Bespoke Blouse & Drape Specialist (Ballygunge, Kolkata)',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    price: 1200,
    matchScore: 94,
    whyRecommended: 'Specialist in handloom saree pre-pleating and contemporary European bodices for silk sarees.',
    tags: ['14 Yrs Exp', 'Pre-Pleating', 'Anarkali Drapes', 'Corset Blouses'],
    occasion: ['Sangeet & Mehendi Night', 'Auspicious Temple Ritual / Pooja'],
    styleVibe: 'Contemporary Fusion',
    rating: 4.9,
    reviewsCount: 312,
    artisanName: 'Priya Sen Haute Studio',
    location: 'Kolkata',
    badges: ['✨ Drape Innovator', 'Doorstep Fitting'],
    specs: {
      'Starting Fee': 'From ₹1,200',
      'Standard Turnaround': '5–7 Days',
      'Fit Guarantee': '100% Fit Guarantee'
    }
  },
  {
    id: 'rec-t3',
    category: 'tailor',
    title: 'Master Rameshwar Reddy',
    subtitle: 'Deccan Master Tailoring Guild (Banjara Hills, Hyderabad)',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    price: 850,
    matchScore: 93,
    whyRecommended: 'Expert in handloom grain alignment and shrinkage-proof basting for cottons and raw silks.',
    tags: ['20 Yrs Exp', 'Handloom Specialist', 'Kurta Sets', 'Express Stitch'],
    occasion: ['Auspicious Temple Ritual / Pooja', 'Boutique Pret / Casual Chic'],
    styleVibe: 'Artisan Handloom',
    rating: 4.88,
    reviewsCount: 610,
    artisanName: 'Deccan Master Guild',
    location: 'Hyderabad',
    badges: ['🧵 Silk Mark Handler', '⚡ Express 72h'],
    specs: {
      'Starting Fee': 'From ₹850',
      'Standard Turnaround': '4–6 Days',
      'Fit Guarantee': 'Grain Aligned'
    }
  },

  // 3. HANDLOOM FABRICS
  {
    id: 'rec-f1',
    category: 'fabric',
    title: 'Pochampally Double-Ikat Cotton-Silk',
    subtitle: 'Direct from Bhoodan Pochampally Loom Collective (Telangana)',
    image: getImageSrc(pochampallyDressImg),
    price: 2450,
    matchScore: 97,
    whyRecommended: 'Authentic GI-certified natural vat dyed yardage with high breathability matching your style preference.',
    tags: ['GI Tagged (GI-23)', 'Geometric Resist', 'Artisan Direct'],
    occasion: ['Boutique Pret / Casual Chic', 'Festive Soirée (Diwali/Eid)'],
    styleVibe: 'Artisan Handloom',
    fabricType: 'Pochampally Ikat',
    rating: 4.9,
    reviewsCount: 324,
    artisanName: 'Kiran Handloom Looms',
    location: 'Pochampally, TS',
    badges: ['🏛️ GI Protected', 'Direct Weaver Price'],
    specs: {
      'Per Meter': '₹680 / m',
      'Unstitched Set': '₹2,450 (3.5m)',
      'In Stock': '42 meters'
    }
  },
  {
    id: 'rec-f2',
    category: 'fabric',
    title: 'Heavy Kanchipuram Mulberry Silk with Pure Zari',
    subtitle: 'Kanchipuram Silk Artisans Guild (Tamil Nadu)',
    image: getImageSrc(kanchipuramSareeImg),
    price: 12000,
    matchScore: 96,
    whyRecommended: 'Certified 4-ply mulberry silk with genuine silver-gold zari, highly rated for temple ceremonies and weddings.',
    tags: ['Silk Mark Certified', 'Korvai Weave', '4-Ply Pure Silk'],
    occasion: ['Wedding Ceremony (Bridal)', 'Auspicious Temple Ritual / Pooja'],
    styleVibe: 'Royal Heritage',
    fabricType: 'Kanchipuram Silk',
    rating: 4.95,
    reviewsCount: 640,
    artisanName: 'Kanchi Silk Artisans',
    location: 'Kanchipuram, TN',
    badges: ['🏛️ Silk Mark Verified', 'Lifetime Heirloom'],
    specs: {
      'Per Meter': '₹2,200 / m',
      'Full Saree': '₹12,000 (6.2m)',
      'In Stock': '28 meters'
    }
  },
  {
    id: 'rec-f3',
    category: 'fabric',
    title: 'Mangalagiri Nizam Border Pure Cotton',
    subtitle: 'Mangalagiri Weavers Union (Andhra Pradesh)',
    image: getImageSrc(mangalagiriDressImg),
    price: 1850,
    matchScore: 91,
    whyRecommended: 'Crisp 80s combed cotton with signature gold metallic Nizam border, ideal for tailored daily luxury.',
    tags: ['GI Certified', '80s Count Cotton', 'Nizam Border'],
    occasion: ['Boutique Pret / Casual Chic', 'Auspicious Temple Ritual / Pooja'],
    styleVibe: 'Artisan Handloom',
    fabricType: 'Mangalagiri Cotton',
    rating: 4.8,
    reviewsCount: 210,
    artisanName: 'Mangalagiri Union Co-Op',
    location: 'Guntur, AP',
    badges: ['🌿 100% Breathable', 'Vegetable Dyes'],
    specs: {
      'Per Meter': '₹420 / m',
      'Full Suit Set': '₹1,850',
      'In Stock': '65 meters'
    }
  },

  // 4. DESIGNS & SILHOUETTES
  {
    id: 'rec-des1',
    category: 'design',
    title: '16-Kali Bias Flare with Sweetheart Bodice',
    subtitle: 'Couture Silhouette Pattern Sloper for Bridal Lehengas',
    image: getImageSrc(luxuryWeddingLehengaImg),
    price: 3200,
    matchScore: 96,
    whyRecommended: 'Engineered for optimal swirl dynamics and heavy zari borders without pooling at the base.',
    tags: ['Silhouette Sloper', '16-Kali', 'Horsehair Braid Hem'],
    occasion: ['Wedding Ceremony (Bridal)', 'Reception & Cocktail Gala'],
    styleVibe: 'Royal Heritage',
    rating: 4.92,
    reviewsCount: 118,
    artisanName: 'AuraStitch Atelier Lab',
    badges: ['📐 Precision Sloper', 'Custom Graded'],
    specs: {
      'Flare Sweep': '4.8 Meters',
      'Waist Types': 'Adjustable Drawstring + Boning',
      'Stitching Compatibility': 'Universal Tailor Standard'
    }
  },
  {
    id: 'rec-des2',
    category: 'design',
    title: 'Asymmetrical Pleated Drape & Capelet Cut',
    subtitle: 'Pre-pleated Modern Saree Gown Pattern',
    image: getImageSrc(sareesImg),
    price: 2400,
    matchScore: 90,
    whyRecommended: 'Trending fusion cut suited for modern cocktail events; requires zero manual pleating.',
    tags: ['Pre-Pleated', 'Cocktail Drape', 'Modern Silhouette'],
    occasion: ['Reception & Cocktail Gala', 'Sangeet & Mehendi Night'],
    styleVibe: 'Contemporary Fusion',
    rating: 4.85,
    reviewsCount: 84,
    artisanName: 'AuraStitch Atelier Lab',
    badges: ['✨ 2-Minute Drape', 'No Pins Needed'],
    specs: {
      'Fabric Requirement': '5.0 Meters',
      'Bodice Lining': 'Built-in Micro Cups',
      'Closure': 'Concealed Side Zipper'
    }
  },

  // 5. MATERIALS & ARTISAN TRIMS
  {
    id: 'rec-m1',
    category: 'material',
    title: 'Antique Gold Zari & Dabka Embroidery Thread',
    subtitle: 'Tested Metallic Embroidery Wire for Royal Needlework',
    image: getImageSrc(threadsImg),
    price: 850,
    matchScore: 95,
    whyRecommended: 'Matches your Banarasi and silk lehenga interests; tarnish-resistant real metallic alloy.',
    tags: ['Tarnish Proof', 'Dabka Wire', 'Pure Zari Core'],
    occasion: ['Wedding Ceremony (Bridal)', 'Reception & Cocktail Gala'],
    styleVibe: 'Royal Heritage',
    rating: 4.9,
    reviewsCount: 230,
    artisanName: 'Surat Zari Guild',
    location: 'Surat, GJ',
    badges: ['⭐ Tarnish Resistant', 'Artisan Grade'],
    specs: {
      'Spool Length': '250 Meters',
      'Alloy': 'Silver-Copper Electroplated',
      'Recommended Needle': 'No. 12 Ari'
    }
  },
  {
    id: 'rec-m2',
    category: 'material',
    title: 'Handcrafted Heritage Gota Patti & Zari Border Lace',
    subtitle: '3.5-inch Scalloped Temple Motif Lace (10m Roll)',
    image: getImageSrc(laysImg),
    price: 1450,
    matchScore: 93,
    whyRecommended: 'AI pairs this with Mangalagiri and Chanderi suits for authentic Rajasthan-inspired borders.',
    tags: ['Gota Border', '3.5-Inch Width', 'Scalloped Edge'],
    occasion: ['Sangeet & Mehendi Night', 'Festive Soirée (Diwali/Eid)'],
    styleVibe: 'Contemporary Fusion',
    rating: 4.86,
    reviewsCount: 165,
    artisanName: 'Jaipur Craft Emporium',
    location: 'Jaipur, RJ',
    badges: ['✨ Hand-Applied Foil', 'Flexible Curve'],
    specs: {
      'Roll Length': '9 Meters (Full Saree/Lehenga)',
      'Border Width': '3.5 Inches',
      'Care': 'Dry Clean Recommended'
    }
  },
  {
    id: 'rec-m3',
    category: 'material',
    title: 'Handmade Moti & Kundan Stone Latkan Tassels',
    subtitle: 'Pair of Heavy Bridal Waist & Blouse Tassels',
    image: getImageSrc(beadsImg),
    price: 680,
    matchScore: 92,
    whyRecommended: 'Essential finishing accent for custom lehenga drawstring ties and back blouse tie-ups.',
    tags: ['Kundan Beads', 'Handmade Tassels', 'Bridal Latkan'],
    occasion: ['Wedding Ceremony (Bridal)', 'Sangeet & Mehendi Night'],
    styleVibe: 'Royal Heritage',
    rating: 4.88,
    reviewsCount: 310,
    artisanName: 'Delhi Moti Works',
    badges: ['💎 Hand-Strung', 'Velvet Encased'],
    specs: {
      'Quantity': 'Pair (2 pieces)',
      'Length': '8 Inches',
      'Weight': '110g per pair'
    }
  },

  // 6. STYLES & LOOKBOOK
  {
    id: 'rec-s1',
    category: 'style',
    title: 'The Nawabi Royal Court Aesthetic',
    subtitle: 'Deep Jewel Tones, High Mandarin Collars & Heavy Velvets',
    image: getImageSrc(luxuryWeddingLehengaImg),
    price: 24500,
    matchScore: 97,
    whyRecommended: 'Calculated 97% affinity with your preference for regal winter events and deep jewel palettes.',
    tags: ['Style Aesthetic', 'Nawabi Heritage', 'Jewel Tones'],
    occasion: ['Wedding Ceremony (Bridal)', 'Reception & Cocktail Gala'],
    styleVibe: 'Royal Heritage',
    rating: 4.96,
    reviewsCount: 195,
    artisanName: 'AuraStitch Style Curators',
    badges: ['👑 Editorial Choice', 'Heirloom Vibe'],
    specs: {
      'Recommended Silhouette': 'Panelled Anarkali or 16-Kali Lehenga',
      'Primary Colors': 'Crimson, Wine, Antique Gold',
      'Jewelry Match': 'Polki Choker & Passa'
    }
  },
  {
    id: 'rec-s2',
    category: 'style',
    title: 'Handloom Minimalist Artisan Chic',
    subtitle: 'Breathable Geometry, Organic Dyes & Architectural Lines',
    image: getImageSrc(pochampallyDressImg),
    price: 4200,
    matchScore: 94,
    whyRecommended: 'Curated for customers who value sustainable textile provenance with sleek modern cuts.',
    tags: ['Sustainable', 'Handloom Chic', 'Zero Waste Cut'],
    occasion: ['Boutique Pret / Casual Chic', 'Festive Soirée (Diwali/Eid)'],
    styleVibe: 'Artisan Handloom',
    rating: 4.84,
    reviewsCount: 140,
    artisanName: 'AuraStitch Eco Atelier',
    badges: ['🌿 Eco Certified', 'Breathable Pure Weave'],
    specs: {
      'Recommended Silhouette': 'Mandarin Collar Shift or Boxy Kurta',
      'Primary Colors': 'Indigo, Ecru, Madder Red',
      'Jewelry Match': 'Matte Silver Geometric Cuffs'
    }
  }
];

// Curated 3-Way Tri-Match Bundles (Weaver Fabric + Master Tailor + Trim)
const TRI_MATCH_BUNDLES = [
  {
    id: 'bundle-1',
    title: '👑 Royal Heritage Bridal Lehenga Bundle',
    matchScore: 99,
    occasion: 'Wedding Ceremony (Bridal)',
    description: 'AI harmonized pure Banarasi Katan silk directly from Varanasi looms, paired with Master Rizwan’s 16-kali tailoring and antique zardozi trims.',
    items: [
      { name: 'Pure Banarasi Katan Silk Yardage (4.5m)', role: 'Weaver: Varanasi Looms', price: 14500 },
      { name: '16-Kali Bespoke Tailoring & Padded Blouse', role: 'Tailor: Ustad Rizwan Khan', price: 7500 },
      { name: 'Antique Gold Zari Dabka Thread & Latkans', role: 'Trim: Surat & Delhi Moti Works', price: 1530 }
    ],
    individualTotal: 23530,
    bundlePrice: 21500,
    savings: 2030,
    image: getImageSrc(luxuryWeddingLehengaImg),
    badges: ['⭐ 99% AI Match', 'AuraStitch Escrow Protected']
  },
  {
    id: 'bundle-2',
    title: '🪷 Temple Korvai Silk Ensemble Bundle',
    matchScore: 96,
    occasion: 'Auspicious Temple Ritual / Pooja',
    description: 'Direct Kanchipuram mulberry silk with gold zari border, paired with Priya Sen’s precision pre-pleating and custom corset blouse.',
    items: [
      { name: 'Pure Kanchipuram Mulberry Silk Saree (6.2m)', role: 'Weaver: Kanchi Silk Artisans', price: 12000 },
      { name: 'Pre-Pleated Structuring & Blouse Tailoring', role: 'Tailor: Priya Sen Atelier', price: 2400 },
      { name: 'Scalloped Gota Trim & Coin Latkans', role: 'Trim: Jaipur Craft Emporium', price: 1150 }
    ],
    individualTotal: 15550,
    bundlePrice: 14200,
    savings: 1350,
    image: getImageSrc(kanchipuramSareeImg),
    badges: ['🏛️ Silk Mark Authenticated', 'Free Doorstep Trial']
  }
];

export const AIDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useOutletContext<OutletContextType>();

  // Interactive Customer Preference Filters
  const [activeCategoryTab, setActiveCategoryTab] = useState<'all' | 'dress' | 'tailor' | 'fabric' | 'design' | 'material' | 'style' | 'bundles'>('all');
  const [selectedOccasion, setSelectedOccasion] = useState<string>('All Occasions');
  const [selectedStyleVibe, setSelectedStyleVibe] = useState<string>('All Aesthetics');
  const [maxBudget, setMaxBudget] = useState<number>(30000);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Wishlist/Saved state
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('aurastitch_ai_recommendations_saved');
      return stored ? JSON.parse(stored) : ['rec-d1', 'rec-f1'];
    } catch {
      return ['rec-d1', 'rec-f1'];
    }
  });

  const toggleSave = (id: string, title: string) => {
    setSavedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      try {
        localStorage.setItem('aurastitch_ai_recommendations_saved', JSON.stringify(next));
      } catch (e) {
        console.warn('Failed to save to localStorage:', e);
      }
      showToast(prev.includes(id) ? `Removed "${title}" from saved.` : `Saved "${title}" to your favorites! ⭐`, 'info');
      return next;
    });
  };

  // Filter recommendations based on active preferences
  const filteredItems = useMemo(() => {
    return RECOMMENDATION_CATALOG.filter((item) => {
      // 1. Category Tab Filter
      if (activeCategoryTab !== 'all' && activeCategoryTab !== 'bundles' && item.category !== activeCategoryTab) {
        return false;
      }

      // 2. Budget Filter
      if (item.price > maxBudget) {
        return false;
      }

      // 3. Occasion Filter
      if (selectedOccasion !== 'All Occasions' && !item.occasion.includes(selectedOccasion)) {
        return false;
      }

      // 4. Style Vibe Filter
      if (selectedStyleVibe !== 'All Aesthetics' && item.styleVibe !== selectedStyleVibe) {
        return false;
      }

      // 5. Search Query Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesSubtitle = item.subtitle.toLowerCase().includes(query);
        const matchesTags = item.tags.some((t) => t.toLowerCase().includes(query));
        const matchesWhy = item.whyRecommended.toLowerCase().includes(query);
        if (!matchesTitle && !matchesSubtitle && !matchesTags && !matchesWhy) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => b.matchScore - a.matchScore);
  }, [activeCategoryTab, selectedOccasion, selectedStyleVibe, maxBudget, searchQuery]);

  return (
    <div className="ai-recommendations-page">
      <style>{`
        .ai-recommendations-page {
          max-width: 1400px;
          margin: 0 auto;
          padding: 8px 12px 60px;
          font-family: var(--font-body);
          color: var(--text-primary);
        }

        /* Hero Banner */
        .recs-hero-panel {
          background: linear-gradient(135deg, rgba(200, 155, 60, 0.12), rgba(46, 111, 87, 0.08), rgba(255, 255, 255, 0.95));
          border: 1px solid var(--accent-gold);
          border-radius: var(--border-radius-lg);
          padding: 28px 32px;
          margin-bottom: 24px;
          box-shadow: var(--shadow-sm);
          position: relative;
        }

        .recs-badge-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(200, 155, 60, 0.16);
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

        /* Preference Controls Box */
        .preference-matrix-panel {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          padding: 20px 24px;
          margin-bottom: 28px;
          box-shadow: var(--shadow-sm);
        }

        .pref-controls-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
          align-items: flex-end;
        }

        .pref-label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.6px;
          margin-bottom: 6px;
        }

        .pref-select {
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

        .pref-select:focus {
          border-color: var(--accent-gold);
        }

        /* Category Filter Tabs */
        .category-tab-strip {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding-bottom: 12px;
          margin-bottom: 24px;
          border-bottom: 1px solid var(--border-color);
        }

        .cat-tab-btn {
          padding: 9px 18px;
          border-radius: 20px;
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
          gap: 6px;
        }

        .cat-tab-btn.active, .cat-tab-btn:hover {
          background: var(--accent-gold);
          color: #000;
          border-color: var(--accent-gold);
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(200, 155, 60, 0.25);
        }

        /* Grid Layout */
        .recs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }

        .rec-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
          position: relative;
        }

        .rec-card:hover {
          transform: translateY(-4px);
          border-color: var(--accent-gold);
          box-shadow: var(--shadow-md);
        }

        .rec-thumb-wrap {
          position: relative;
          height: 230px;
          width: 100%;
          background: #181614;
          overflow: hidden;
        }

        .rec-thumb {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .rec-card:hover .rec-thumb {
          transform: scale(1.04);
        }

        /* Match Score Badge */
        .match-score-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(18, 16, 14, 0.9);
          border: 1px solid var(--accent-gold);
          color: var(--accent-gold);
          padding: 4px 10px;
          border-radius: 14px;
          font-size: 11px;
          font-weight: 800;
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .category-tag-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(255, 255, 255, 0.92);
          color: #000;
          padding: 3px 8px;
          border-radius: 10px;
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
        }

        .rec-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .why-recommended-box {
          background: rgba(200, 155, 60, 0.08);
          border-left: 3px solid var(--accent-gold);
          padding: 8px 12px;
          border-radius: 0 6px 6px 0;
          font-size: 12px;
          color: var(--text-secondary);
          line-height: 1.45;
          margin-bottom: 14px;
        }

        /* 3-Way Tri-Match Bundle Cards */
        .bundle-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(460px, 1fr));
          gap: 24px;
        }

        @media (max-width: 600px) {
          .bundle-grid {
            grid-template-columns: 1fr;
          }
        }

        .bundle-card {
          background: var(--bg-secondary);
          border: 1px solid var(--accent-gold);
          border-radius: var(--border-radius-lg);
          padding: 24px;
          box-shadow: var(--shadow-md);
          display: flex;
          flex-direction: column;
        }
      `}</style>

      {/* HERO BANNER: INTELLIGENT DISCOVERY ENGINE */}
      <div className="recs-hero-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div className="recs-badge-tag">
              🤖 AuraStitch Personal AI Stylist & Discovery
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', margin: '0 0 6px', color: 'var(--text-primary)' }}>
              Tailored Recommendations for You
            </h1>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '720px', lineHeight: '1.5' }}>
              Unlike generating a new design from scratch, our AI stylist discovers <strong>existing suitable dresses, vetted master tailors, certified handloom fabrics, precision silhouettes, and supplier materials</strong> that seamlessly match your taste, occasion, and budget.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="btn-secondary"
              style={{ fontSize: '13px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
              onClick={() => {
                setSelectedOccasion('All Occasions');
                setSelectedStyleVibe('All Aesthetics');
                setMaxBudget(30000);
                setSearchQuery('');
                showToast('Reset to default recommendation filters.', 'info');
              }}
            >
              🔄 Reset Filters
            </button>
            <button
              className="btn-primary"
              style={{ fontSize: '13px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
              onClick={() => navigate('/customer/ai-designer')}
            >
              ✨ Design Custom Instead →
            </button>
          </div>
        </div>
      </div>

      {/* INTERACTIVE CUSTOMER PREFERENCES MATRIX */}
      <div className="preference-matrix-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>🎯</span> Personalize Your Recommendations
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Showing <strong>{filteredItems.length}</strong> matching results under ₹{maxBudget.toLocaleString()}
          </div>
        </div>

        <div className="pref-controls-row">
          {/* Occasion Filter */}
          <div>
            <label className="pref-label">Occasion Context</label>
            <select
              className="pref-select"
              value={selectedOccasion}
              onChange={(e) => setSelectedOccasion(e.target.value)}
            >
              <option value="All Occasions">All Occasions</option>
              <option value="Wedding Ceremony (Bridal)">Wedding Ceremony (Bridal)</option>
              <option value="Sangeet & Mehendi Night">Sangeet & Mehendi Night</option>
              <option value="Reception & Cocktail Gala">Reception & Cocktail Gala</option>
              <option value="Auspicious Temple Ritual / Pooja">Auspicious Temple Ritual / Pooja</option>
              <option value="Festive Soirée (Diwali/Eid)">Festive Soirée (Diwali/Eid)</option>
              <option value="Boutique Pret / Casual Chic">Boutique Pret / Casual Chic</option>
            </select>
          </div>

          {/* Style Aesthetic Filter */}
          <div>
            <label className="pref-label">Desired Style Vibe</label>
            <select
              className="pref-select"
              value={selectedStyleVibe}
              onChange={(e) => setSelectedStyleVibe(e.target.value)}
            >
              <option value="All Aesthetics">All Aesthetics</option>
              <option value="Royal Heritage">Royal Heritage (Zardozi, Pure Silk)</option>
              <option value="Contemporary Fusion">Contemporary Fusion (Pret, Scalloped)</option>
              <option value="Artisan Handloom">Artisan Handloom (Ikat, Mangalagiri)</option>
              <option value="Modern Minimalist">Modern Minimalist (Clean Drapes)</option>
            </select>
          </div>

          {/* Budget Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span className="pref-label" style={{ margin: 0 }}>Budget Cap</span>
              <strong style={{ fontSize: '13px', color: 'var(--accent-gold-dark)' }}>
                Up to ₹{maxBudget.toLocaleString()}
              </strong>
            </div>
            <input
              type="range"
              min="1000"
              max="35000"
              step="500"
              value={maxBudget}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-gold)', cursor: 'pointer' }}
            />
          </div>

          {/* Search/Interest Query Bar */}
          <div>
            <label className="pref-label">Search Keywords / Notes</label>
            <input
              type="text"
              className="pref-select"
              placeholder="e.g. Banarasi, Zardozi, Pochampally, Blouse..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* CATEGORY EXPLORATION TABS */}
      <div className="category-tab-strip">
        {[
          { key: 'all', label: '🌟 All Recommendations', count: filteredItems.length },
          { key: 'bundles', label: '🎁 Tri-Match Bundles', count: TRI_MATCH_BUNDLES.length },
          { key: 'dress', label: '👗 Dresses & Outfits', count: filteredItems.filter(i => i.category === 'dress').length },
          { key: 'tailor', label: '🪡 Master Tailors', count: filteredItems.filter(i => i.category === 'tailor').length },
          { key: 'fabric', label: '🧵 Handloom Fabrics', count: filteredItems.filter(i => i.category === 'fabric').length },
          { key: 'material', label: '💎 Materials & Trims', count: filteredItems.filter(i => i.category === 'material').length },
          { key: 'design', label: '📐 Silhouette Designs', count: filteredItems.filter(i => i.category === 'design').length },
          { key: 'style', label: '✨ Curated Styles', count: filteredItems.filter(i => i.category === 'style').length }
        ].map((tab) => (
          <button
            key={tab.key}
            className={`cat-tab-btn ${activeCategoryTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveCategoryTab(tab.key as any)}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* 3-WAY TRI-MATCH BUNDLES SECTION (SHOWN ON ALL OR BUNDLES TAB) */}
      {(activeCategoryTab === 'all' || activeCategoryTab === 'bundles') && (
        <div style={{ marginBottom: '36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{ fontSize: '20px' }}>🎁</span>
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', margin: 0 }}>
                AI Tri-Match Bundles (Weaver + Tailor + Trim)
              </h2>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Intelligently bundled for harmonious drape, matching threadwork, and packaged savings
              </div>
            </div>
          </div>

          <div className="bundle-grid">
            {TRI_MATCH_BUNDLES.map((bundle) => (
              <div key={bundle.id} className="bundle-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {bundle.badges.map((b) => (
                      <span key={b} style={{ fontSize: '10px', fontWeight: 700, background: 'rgba(200, 155, 60, 0.15)', color: 'var(--accent-gold-dark)', padding: '2px 8px', borderRadius: '10px' }}>
                        {b}
                      </span>
                    ))}
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                    Occasion: {bundle.occasion}
                  </span>
                </div>

                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', margin: '0 0 6px', color: 'var(--text-primary)' }}>
                  {bundle.title}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.45', margin: '0 0 16px' }}>
                  {bundle.description}
                </p>

                {/* 3 bundled components list */}
                <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '12px', marginBottom: '16px' }}>
                  {bundle.items.map((it, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: idx < bundle.items.length - 1 ? '1px dashed var(--border-color)' : 'none', fontSize: '12px' }}>
                      <div>
                        <strong>{it.name}</strong>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{it.role}</div>
                      </div>
                      <span style={{ fontWeight: 600 }}>₹{it.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                {/* Bundle Pricing */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Separate Total: <span style={{ textDecoration: 'line-through' }}>₹{bundle.individualTotal.toLocaleString()}</span>
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
                      Bundle Price: ₹{bundle.bundlePrice.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '11px', color: '#2a9d8f', fontWeight: 700 }}>
                      🎉 Save ₹{bundle.savings.toLocaleString()} with AI Bundle
                    </div>
                  </div>

                  <button
                    className="btn-primary"
                    style={{ padding: '10px 18px', fontSize: '13px', fontWeight: 700 }}
                    onClick={() => {
                      showToast(`AI Bundle "${bundle.title}" commissioned! Directing to tailoring checkout...`, 'success');
                      navigate('/customer');
                    }}
                  >
                    Commission Bundle ➔
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RECOMMENDED ITEMS GRID (DRESSES, TAILORS, FABRICS, MATERIALS, DESIGNS, STYLES) */}
      {activeCategoryTab !== 'bundles' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700 }}>
              Curated Matches ({filteredItems.length})
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Sorted by highest AI match compatibility
            </div>
          </div>

          {filteredItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--bg-secondary)', borderRadius: 'var(--border-radius-lg)', border: '1px dashed var(--border-color)' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', margin: '0 0 8px' }}>
                No recommendations matching this filter
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '420px', margin: '0 auto 20px' }}>
                Try relaxing your budget cap, selecting "All Occasions", or clearing your search term to see more recommendations.
              </p>
              <button
                className="btn-primary"
                onClick={() => {
                  setSelectedOccasion('All Occasions');
                  setSelectedStyleVibe('All Aesthetics');
                  setMaxBudget(30000);
                  setSearchQuery('');
                }}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="recs-grid">
              {filteredItems.map((item) => {
                const isFavorite = savedIds.includes(item.id);
                return (
                  <div key={item.id} className="rec-card">
                    {/* Thumbnail Stage */}
                    <div className="rec-thumb-wrap">
                      <img src={item.image} alt={item.title} className="rec-thumb" />
                      <span className="match-score-badge">
                        ⭐ {item.matchScore}% Match
                      </span>
                      <span className="category-tag-badge">
                        {item.category}
                      </span>
                    </div>

                    {/* Card Content Body */}
                    <div className="rec-body">
                      {/* Why AI Recommended This */}
                      <div className="why-recommended-box">
                        💡 <strong>Why Recommended:</strong> {item.whyRecommended}
                      </div>

                      <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-gold-dark)', textTransform: 'uppercase', marginBottom: '4px' }}>
                        {item.styleVibe} • {item.artisanName}
                      </div>

                      <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 6px', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                        {item.title}
                      </h3>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                        {item.subtitle}
                      </div>

                      {/* Tag badges */}
                      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '12px' }}>
                        {item.tags.map((t) => (
                          <span key={t} style={{ fontSize: '10px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', padding: '2px 7px', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                            {t}
                          </span>
                        ))}
                      </div>

                      {/* Specs block if available */}
                      {item.specs && (
                        <div style={{ background: 'var(--bg-primary)', borderRadius: '6px', padding: '8px 10px', fontSize: '11px', marginBottom: '14px', border: '1px solid var(--border-color)' }}>
                          {Object.entries(item.specs).map(([k, v]) => (
                            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                              <span style={{ color: 'var(--text-muted)' }}>{k}:</span>
                              <strong>{v}</strong>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Pricing and Actions */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '10px', borderTop: '1px dashed var(--border-color)' }}>
                        <div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Starting From</div>
                          <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
                            ₹{item.price.toLocaleString()}
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            className="btn-secondary"
                            style={{ padding: '6px 10px', fontSize: '12px' }}
                            title="Save to favorites"
                            onClick={() => toggleSave(item.id, item.title)}
                          >
                            {isFavorite ? '❤️' : '🤍'}
                          </button>
                          
                          {item.category === 'tailor' ? (
                            <button
                              className="btn-primary"
                              style={{ padding: '6px 12px', fontSize: '12px', fontWeight: 700 }}
                              onClick={() => {
                                showToast(`Booking consultation request sent to ${item.title}!`, 'success');
                                navigate('/customer');
                              }}
                            >
                              Book Tailor
                            </button>
                          ) : item.category === 'fabric' ? (
                            <button
                              className="btn-primary"
                              style={{ padding: '6px 12px', fontSize: '12px', fontWeight: 700 }}
                              onClick={() => {
                                showToast(`Selected "${item.title}". Directing to tailoring match...`, 'success');
                                navigate('/customer');
                              }}
                            >
                              Pair with Tailor
                            </button>
                          ) : (
                            <button
                              className="btn-primary"
                              style={{ padding: '6px 12px', fontSize: '12px', fontWeight: 700 }}
                              onClick={() => {
                                showToast(`Selected "${item.title}" for your bespoke wardrobe!`, 'success');
                                navigate('/customer');
                              }}
                            >
                              Select & Order
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIDashboard;

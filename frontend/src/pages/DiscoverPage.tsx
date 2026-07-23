import React, { useState, useMemo } from 'react';
import { Link, useOutletContext } from 'react-router-dom';

// Relative imports for handloom images
import cottonSareesImg from './handloom/handloomimages/cottonsarees.jpg';
import dhotiImg from './handloom/handloomimages/dhoti.jpg';
import mangalagiriDressImg from './handloom/handloomimages/Mangalagiridress.jpg';
import pattuSareeImg from './handloom/handloomimages/pattusaree.jpg';
import pochampallyImg from './handloom/handloomimages/pochampally.jpg';

interface OutletContextType {
  showToast?: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

interface ProductItem {
  id: string;
  name: string;
  clothType: string;
  price: number;
  rating: number;
  image: string;
}

interface WeaverItem {
  id: string;
  name: string;
  state: string;
  specialization: string;
  rating: number;
  avatar: string;
}

interface TailorItem {
  id: string;
  name: string;
  experience: string;
  rating: number;
  city: string;
}

interface CollectionItem {
  id: string;
  title: string;
  description: string;
  image: string;
}

// Helper to ensure Vite resolves imported local image assets into URL strings
const getImageSrc = (img: any): string => {
  if (!img) return '';
  if (typeof img === 'string') return img;
  if (typeof img === 'object' && 'default' in img) return (img as any).default;
  return String(img);
};

const mockTrendingProducts: ProductItem[] = [
  {
    id: 'tp-1',
    name: 'Pochampally Ikat Silk Saree',
    clothType: 'Silk Saree',
    price: 4850,
    rating: 4.8,
    image: getImageSrc(pochampallyImg)
  },
  {
    id: 'tp-2',
    name: 'Kanchipuram Pattu Bridal Saree',
    clothType: 'Silk Saree',
    price: 12450,
    rating: 4.9,
    image: getImageSrc(pattuSareeImg)
  },
  {
    id: 'tp-3',
    name: 'Mangalagiri Nizam Border Cotton Saree',
    clothType: 'Cotton Saree',
    price: 2450,
    rating: 4.7,
    image: getImageSrc(cottonSareesImg)
  },
  {
    id: 'tp-4',
    name: 'Traditional Handwoven Cotton Dhoti',
    clothType: 'Dhoti',
    price: 1450,
    rating: 4.6,
    image: getImageSrc(dhotiImg)
  },
  {
    id: 'tp-5',
    name: 'Handloom Linen Dress Material',
    clothType: 'Dress Material',
    price: 1850,
    rating: 4.8,
    image: getImageSrc(mangalagiriDressImg)
  }
];

const mockFeaturedCollections: CollectionItem[] = [
  {
    id: 'fc-1',
    title: 'Wedding Collection',
    description: 'Grand Kanchipuram and Banarasi bridal zari silk sarees.',
    image: getImageSrc(pattuSareeImg)
  },
  {
    id: 'fc-2',
    title: 'Festival Collection',
    description: 'Vibrant double ikat Pochampally and Venkatagiri weaves.',
    image: getImageSrc(pochampallyImg)
  },
  {
    id: 'fc-3',
    title: 'Cotton Collection',
    description: 'Breathable 80s count Mangalagiri and Bengal cottons.',
    image: getImageSrc(cottonSareesImg)
  },
  {
    id: 'fc-4',
    title: 'Silk Collection',
    description: 'Pure Mulberry raw silk and handwoven Tussar silk reels.',
    image: getImageSrc(pattuSareeImg)
  }
];

const mockWeavers: WeaverItem[] = [
  {
    id: 'w-1',
    name: 'Master Weaver Ramu',
    state: 'Telangana',
    specialization: 'Double Ikat Pochampally Sarees',
    rating: 4.9,
    avatar: '👨‍🌾'
  },
  {
    id: 'w-2',
    name: 'Kanchipuram Artisan Guild',
    state: 'Tamil Nadu',
    specialization: 'Pure Gold Zari Silk Pattu',
    rating: 4.9,
    avatar: '✨'
  },
  {
    id: 'w-3',
    name: 'Narayana Murthy Weaves',
    state: 'Andhra Pradesh',
    specialization: 'Mangalagiri Nizam Border Cottons',
    rating: 4.8,
    avatar: '🌾'
  },
  {
    id: 'w-4',
    name: 'Santipur Handloom Society',
    state: 'West Bengal',
    specialization: 'Fine Bengal Jamdani & Linen',
    rating: 4.7,
    avatar: '🧵'
  }
];

const mockTailors: TailorItem[] = [
  {
    id: 't-1',
    name: 'Priya Custom Designer Boutique',
    experience: '12+ Years Exp.',
    rating: 4.9,
    city: 'Hyderabad'
  },
  {
    id: 't-2',
    name: 'Royal Cut Master Tailors',
    experience: '15+ Years Exp.',
    rating: 4.8,
    city: 'Chennai'
  },
  {
    id: 't-3',
    name: 'Heritage Zardozi Embroidery Studio',
    experience: '8+ Years Exp.',
    rating: 4.7,
    city: 'Bengaluru'
  },
  {
    id: 't-4',
    name: 'Vogue Bespoke Stitching Hub',
    experience: '10+ Years Exp.',
    rating: 4.8,
    city: 'Mumbai'
  }
];

const mockSeasonal: CollectionItem[] = [
  {
    id: 'sec-1',
    title: 'Summer Collection',
    description: 'Lightweight breathable organic cottons for hot weather.',
    image: getImageSrc(cottonSareesImg)
  },
  {
    id: 'sec-2',
    title: 'Wedding Collection',
    description: 'Heavy gold zari woven bridal heirlooms for grand ceremonies.',
    image: getImageSrc(pattuSareeImg)
  },
  {
    id: 'sec-3',
    title: 'Festival Specials',
    description: 'Color-rich double ikat patterns for auspicious occasions.',
    image: getImageSrc(pochampallyImg)
  },
  {
    id: 'sec-4',
    title: 'Trending This Week',
    description: 'Most popular customer favorites across all artisan workshops.',
    image: getImageSrc(mangalagiriDressImg)
  }
];

export const DiscoverPage: React.FC = () => {
  const context = useOutletContext<OutletContextType | null>();
  const showToast = (msg: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    if (context?.showToast) context.showToast(msg, type);
    else alert(msg);
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModalProduct, setSelectedModalProduct] = useState<ProductItem | null>(null);
  const [selectedModalWeaver, setSelectedModalWeaver] = useState<WeaverItem | null>(null);
  const [selectedModalTailor, setSelectedModalTailor] = useState<TailorItem | null>(null);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    if (!searchQuery) return mockTrendingProducts;
    return mockTrendingProducts.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.clothType.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="customer-discover-container fade-in" style={{ padding: '24px', paddingBottom: '90px', maxWidth: '1240px', margin: '0 auto', color: 'var(--text-primary)' }}>
      <style>{`
        /* Top Header & Search Section */
        .discover-top-header {
          margin-bottom: 32px;
        }

        .discover-main-heading {
          font-family: var(--font-heading);
          font-size: 32px;
          font-weight: 800;
          margin: 0 0 16px;
          color: var(--text-primary);
        }

        .discover-search-box {
          position: relative;
          max-width: 720px;
          width: 100%;
        }

        .discover-search-input {
          width: 100%;
          padding: 14px 22px;
          border-radius: 30px;
          border: 1px solid var(--border-color);
          background: var(--bg-secondary);
          color: var(--text-primary);
          font-size: 15px;
          outline: none;
          box-shadow: var(--shadow-sm);
          transition: border-color 0.2s ease;
        }

        .discover-search-input:focus {
          border-color: var(--accent-gold);
        }

        /* Section Block Styling */
        .discover-section-block {
          margin-bottom: 42px;
        }

        .section-header-title {
          font-family: var(--font-heading);
          font-size: 22px;
          font-weight: 800;
          margin: 0 0 20px;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        /* Product Cards Grid */
        .cards-scroll-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 20px;
        }

        .disc-prod-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease, border-color 0.3s ease;
        }

        .disc-prod-card:hover {
          transform: translateY(-4px);
          border-color: var(--accent-gold);
        }

        .disc-img-box {
          width: 100%;
          height: 190px;
          overflow: hidden;
          background: #111;
          position: relative;
        }

        .disc-prod-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .disc-prod-card:hover .disc-prod-img {
          transform: scale(1.05);
        }

        .disc-prod-body {
          padding: 16px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .disc-cloth-type {
          font-size: 11px;
          font-weight: 700;
          color: var(--accent-gold);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }

        .disc-prod-title {
          font-size: 15px;
          font-weight: 700;
          margin: 0 0 8px;
          color: var(--text-primary);
          line-height: 1.3;
        }

        .disc-price-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
        }

        .disc-price-text {
          font-size: 17px;
          font-weight: 800;
          color: var(--text-primary);
        }

        .disc-rating-text {
          font-size: 12px;
          font-weight: 700;
          color: #ffb703;
        }

        .btn-disc-action {
          padding: 9px;
          font-size: 12px;
          font-weight: 700;
          border-radius: 8px;
          cursor: pointer;
          border: 1px solid var(--border-color);
          background: var(--bg-tertiary);
          color: var(--text-primary);
          transition: all 0.2s ease;
          text-align: center;
          margin-top: auto;
        }

        .btn-disc-action:hover {
          border-color: var(--accent-gold);
          color: var(--accent-gold);
        }

        /* Collections Grid */
        .collections-disc-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 20px;
        }

        .disc-col-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          transition: transform 0.3s ease, border-color 0.3s ease;
        }

        .disc-col-card:hover {
          transform: translateY(-4px);
          border-color: var(--accent-gold);
        }

        /* AI Design Inspiration Card */
        .ai-inspiration-hero-card {
          background: linear-gradient(135deg, rgba(197, 160, 89, 0.2) 0%, rgba(20, 25, 38, 0.95) 100%);
          border: 1px solid var(--accent-gold);
          border-radius: var(--border-radius-lg);
          padding: 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          box-shadow: var(--shadow-md);
        }

        .ai-hero-content {
          max-width: 650px;
        }

        .ai-hero-badge {
          display: inline-block;
          background: rgba(197, 160, 89, 0.25);
          color: var(--accent-gold);
          border: 1px solid var(--accent-gold);
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 800;
          margin-bottom: 12px;
        }

        .ai-hero-title {
          font-family: var(--font-heading);
          font-size: 26px;
          font-weight: 800;
          margin: 0 0 10px;
          color: var(--text-primary);
        }

        .ai-hero-desc {
          font-size: 14px;
          color: var(--text-secondary);
          margin: 0 0 20px;
          line-height: 1.6;
        }

        .btn-explore-ai {
          display: inline-block;
          padding: 12px 26px;
          border-radius: 30px;
          background: linear-gradient(135deg, var(--accent-gold) 0%, #b38627 100%);
          color: #000;
          font-weight: 800;
          font-size: 14px;
          text-decoration: none;
          box-shadow: var(--shadow-sm);
          transition: transform 0.2s ease;
        }

        .btn-explore-ai:hover {
          transform: translateY(-2px);
        }

        /* Weavers & Tailors Cards Grid */
        .people-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
        }

        .person-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          box-shadow: var(--shadow-sm);
          transition: transform 0.3s ease, border-color 0.3s ease;
        }

        .person-card:hover {
          transform: translateY(-4px);
          border-color: var(--accent-gold);
        }

        .person-avatar {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: rgba(197, 160, 89, 0.15);
          border: 2px solid var(--accent-gold);
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 28px;
          margin-bottom: 12px;
        }

        .person-name {
          font-family: var(--font-heading);
          font-size: 17px;
          font-weight: 700;
          margin: 0 0 4px;
          color: var(--text-primary);
        }

        .person-sub {
          font-size: 12px;
          color: var(--text-secondary);
          margin-bottom: 12px;
        }

        /* Modal Backdrop */
        .disc-actions-column {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-top: auto;
        }

        .btn-disc-cart {
          padding: 8px;
          font-size: 12px;
          font-weight: 700;
          border-radius: 8px;
          cursor: pointer;
          border: 1px solid var(--accent-gold);
          background: rgba(197, 160, 89, 0.15);
          color: var(--accent-gold);
          text-align: center;
          transition: all 0.2s ease;
          width: 100%;
        }

        .btn-disc-cart:hover {
          background: var(--accent-gold);
          color: #000;
        }

        .btn-disc-msg {
          padding: 8px;
          font-size: 12px;
          font-weight: 700;
          border-radius: 8px;
          cursor: pointer;
          border: 1px solid var(--border-color);
          background: var(--bg-tertiary);
          color: var(--text-primary);
          text-align: center;
          text-decoration: none;
          transition: all 0.2s ease;
          display: block;
          width: 100%;
        }

        .btn-disc-msg:hover {
          border-color: var(--accent-gold);
          color: var(--accent-gold);
        }

        .btn-disc-wishlist {
          padding: 8px;
          font-size: 12px;
          font-weight: 700;
          border-radius: 8px;
          cursor: pointer;
          border: 1px solid #e63946;
          background: rgba(230, 57, 70, 0.1);
          color: #e63946;
          text-align: center;
          transition: all 0.2s ease;
          width: 100%;
        }

        .btn-disc-wishlist:hover {
          background: #e63946;
          color: #fff;
        }

        .disc-modal-backdrop {
          position: fixed;
          top: 0; left: 0; width: 100vw; height: 100vh;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(5px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          padding: 20px;
        }

        .disc-modal-dialog {
          background: var(--bg-secondary);
          border: 1px solid var(--accent-gold);
          border-radius: var(--border-radius-lg);
          width: 100%;
          max-width: 480px;
          padding: 24px;
          box-shadow: var(--shadow-lg);
        }

        @media (max-width: 768px) {
          .ai-inspiration-hero-card { flex-direction: column; align-items: flex-start; }
          .cards-scroll-grid, .collections-disc-grid, .people-cards-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* TOP SECTION: Heading & Search Bar */}
      <div className="discover-top-header">
        <h1 className="discover-main-heading">Discover</h1>
        <div className="discover-search-box">
          <input 
            type="text" 
            className="discover-search-input" 
            placeholder="Search handloom products, weavers, tailors..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* SECTION 1: Trending Handloom Products */}
      <div className="discover-section-block">
        <h2 className="section-header-title">
          <span>🔥 Trending Handloom Products</span>
        </h2>

        <div className="cards-scroll-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="disc-prod-card">
              <div className="disc-img-box">
                <img src={product.image} alt={product.name} className="disc-prod-img" />
              </div>
              <div className="disc-prod-body">
                <span className="disc-cloth-type">{product.clothType}</span>
                <h3 className="disc-prod-title">{product.name}</h3>
                <div className="disc-price-row">
                  <span className="disc-price-text">₹{product.price.toLocaleString()}</span>
                  <span className="disc-rating-text">⭐ {product.rating}</span>
                </div>
                
                {/* 3 Action Buttons in exact order */}
                <div className="disc-actions-column">
                  <button className="btn-disc-cart" onClick={() => showToast(`Added "${product.name}" to Cart!`, 'success')}>
                    🛒 Add to Cart
                  </button>
                  <Link to="/messages" className="btn-disc-msg">
                    💬 Message Seller
                  </Link>
                  <button className="btn-disc-wishlist" onClick={() => showToast(`Saved "${product.name}" to Wishlist!`, 'success')}>
                    ❤️ Add to Wishlist
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: Featured Collections */}
      <div className="discover-section-block">
        <h2 className="section-header-title">
          <span>📂 Featured Collections</span>
        </h2>

        <div className="collections-disc-grid">
          {mockFeaturedCollections.map(col => (
            <div key={col.id} className="disc-col-card">
              <div style={{ height: '160px', overflow: 'hidden', background: '#111' }}>
                <img src={col.image} alt={col.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '18px' }}>
                <h3 style={{ margin: '0 0 6px', fontSize: '18px', fontFamily: 'var(--font-heading)' }}>{col.title}</h3>
                <p style={{ margin: '0 0 14px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{col.description}</p>
                <button className="btn-disc-action" style={{ width: '100%' }} onClick={() => showToast(`Exploring ${col.title}`, 'info')}>
                  Explore Collection
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: AI Design Inspiration */}
      <div className="discover-section-block">
        <div className="ai-inspiration-hero-card">
          <div className="ai-hero-content">
            <span className="ai-hero-badge">🧠 AI DESIGN LAB</span>
            <h2 className="ai-hero-title">AI Design Inspiration & Generative Weaves</h2>
            <p className="ai-hero-desc">
              Transform your creative sketches into realistic 3D draped sarees, test custom gold zari motifs, and generate automated warp-weft patterns for master artisans.
            </p>
            <Link to="/customer/design-lab" className="btn-explore-ai">
              Explore AI Designs →
            </Link>
          </div>
          <div style={{ fontSize: '70px', opacity: 0.85 }}>✨</div>
        </div>
      </div>

      {/* SECTION 4: Recommended Weavers */}
      <div className="discover-section-block">
        <h2 className="section-header-title">
          <span>👨‍🌾 Recommended Weavers</span>
        </h2>

        <div className="people-cards-grid">
          {mockWeavers.map(weaver => (
            <div key={weaver.id} className="person-card">
              <div className="person-avatar">{weaver.avatar}</div>
              <h3 className="person-name">{weaver.name}</h3>
              <div className="person-sub">
                📍 {weaver.state} • <strong style={{ color: 'var(--accent-gold)' }}>{weaver.specialization}</strong>
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffb703', marginBottom: '14px' }}>
                ⭐ {weaver.rating} Verified Weaver
              </div>
              <button className="btn-disc-action" style={{ width: '100%' }} onClick={() => setSelectedModalWeaver(weaver)}>
                View Profile
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 5: Recommended Tailors */}
      <div className="discover-section-block">
        <h2 className="section-header-title">
          <span>✂️ Recommended Tailors</span>
        </h2>

        <div className="people-cards-grid">
          {mockTailors.map(tailor => (
            <div key={tailor.id} className="person-card">
              <div className="person-avatar" style={{ borderColor: '#2a9d8f' }}>✂️</div>
              <h3 className="person-name">{tailor.name}</h3>
              <div className="person-sub">
                📍 {tailor.city} • <strong>{tailor.experience}</strong>
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffb703', marginBottom: '14px' }}>
                ⭐ {tailor.rating} Master Tailor
              </div>
              <button className="btn-disc-action" style={{ width: '100%' }} onClick={() => setSelectedModalTailor(tailor)}>
                Book Tailor
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 6: Seasonal Recommendations */}
      <div className="discover-section-block">
        <h2 className="section-header-title">
          <span>🌟 Seasonal Recommendations</span>
        </h2>

        <div className="collections-disc-grid">
          {mockSeasonal.map(sec => (
            <div key={sec.id} className="disc-col-card">
              <div style={{ height: '150px', overflow: 'hidden', background: '#111' }}>
                <img src={sec.image} alt={sec.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '16px' }}>
                <h3 style={{ margin: '0 0 4px', fontSize: '17px', fontFamily: 'var(--font-heading)' }}>{sec.title}</h3>
                <p style={{ margin: '0 0 12px', fontSize: '12px', color: 'var(--text-secondary)' }}>{sec.description}</p>
                <button className="btn-disc-action" style={{ width: '100%' }} onClick={() => showToast(`Opening ${sec.title}`, 'info')}>
                  View Specials
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PRODUCT DETAILS MODAL */}
      {selectedModalProduct && (
        <div className="disc-modal-backdrop" onClick={() => setSelectedModalProduct(null)}>
          <div className="disc-modal-dialog" onClick={e => e.stopPropagation()}>
            <div style={{ width: '100%', height: '200px', borderRadius: '10px', overflow: 'hidden', marginBottom: '16px' }}>
              <img src={selectedModalProduct.image} alt={selectedModalProduct.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <span style={{ fontSize: '11px', color: 'var(--accent-gold)', fontWeight: 700 }}>{selectedModalProduct.clothType}</span>
            <h2 style={{ margin: '4px 0 12px', fontSize: '22px', fontFamily: 'var(--font-heading)' }}>{selectedModalProduct.name}</h2>
            <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px' }}>
              ₹{selectedModalProduct.price.toLocaleString()} <span style={{ fontSize: '13px', color: '#ffb703' }}>⭐ {selectedModalProduct.rating}</span>
            </div>

            <button className="btn-explore-ai" style={{ width: '100%', textAlign: 'center' }} onClick={() => { showToast(`Added ${selectedModalProduct.name} to wishlist!`, 'success'); setSelectedModalProduct(null); }}>
              Add to Wishlist
            </button>
          </div>
        </div>
      )}

      {/* WEAVER PROFILE MODAL */}
      {selectedModalWeaver && (
        <div className="disc-modal-backdrop" onClick={() => setSelectedModalWeaver(null)}>
          <div className="disc-modal-dialog" onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: '40px', textAlign: 'center', marginBottom: '10px' }}>{selectedModalWeaver.avatar}</div>
            <h2 style={{ margin: '0 0 6px', fontSize: '22px', fontFamily: 'var(--font-heading)', textAlign: 'center' }}>{selectedModalWeaver.name}</h2>
            <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              📍 {selectedModalWeaver.state} • Specialization: <strong>{selectedModalWeaver.specialization}</strong>
            </p>
            <div style={{ textAlign: 'center', fontSize: '14px', fontWeight: 700, color: '#ffb703', marginBottom: '20px' }}>
              ⭐ {selectedModalWeaver.rating} Verified Master Artisan
            </div>

            <button className="btn-explore-ai" style={{ width: '100%', textAlign: 'center' }} onClick={() => { showToast(`Connecting to ${selectedModalWeaver.name}...`, 'success'); setSelectedModalWeaver(null); }}>
              Contact Weaver
            </button>
          </div>
        </div>
      )}

      {/* TAILOR BOOKING MODAL */}
      {selectedModalTailor && (
        <div className="disc-modal-backdrop" onClick={() => setSelectedModalTailor(null)}>
          <div className="disc-modal-dialog" onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: '40px', textAlign: 'center', marginBottom: '10px' }}>✂️</div>
            <h2 style={{ margin: '0 0 6px', fontSize: '22px', fontFamily: 'var(--font-heading)', textAlign: 'center' }}>{selectedModalTailor.name}</h2>
            <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              📍 {selectedModalTailor.city} • Experience: <strong>{selectedModalTailor.experience}</strong>
            </p>
            <div style={{ textAlign: 'center', fontSize: '14px', fontWeight: 700, color: '#ffb703', marginBottom: '20px' }}>
              ⭐ {selectedModalTailor.rating} Master Custom Tailor
            </div>

            <button className="btn-explore-ai" style={{ width: '100%', textAlign: 'center' }} onClick={() => { showToast(`Booking request sent to ${selectedModalTailor.name}!`, 'success'); setSelectedModalTailor(null); }}>
              Confirm Tailor Booking
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscoverPage;

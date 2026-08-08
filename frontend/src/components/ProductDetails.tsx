import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

// Import local fallback image assets
import kanchipuramSareeImg from '../pages/customer/images/kanchipuramsaree.jpg';
import pochampallyDressImg from '../pages/customer/images/pochampallydress.jpg';
import mangalagiriDressImg from '../pages/customer/images/Mangalagiridress.jpg';
import dhotiImg from '../pages/customer/images/dothi.jpg';

import beads1Img from '../pages/supplier/images/Beads1.jpg';
import beads2Img from '../pages/supplier/images/Beads2.jpg';
import lays1Img from '../pages/supplier/images/Lays1.jpg';
import machinary1Img from '../pages/supplier/images/Machinary1.jpg';
import machinary2Img from '../pages/supplier/images/Machinary2.jpg';
import threads1Img from '../pages/supplier/images/Threads1.jpg';

interface OutletContextType {
  showToast?: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export interface ProductReview {
  id: string;
  userName: string;
  userPhoto?: string;
  rating: number;
  review: string;
  date: string;
}

export interface ProductSpecification {
  key: string;
  value: string;
}

export interface SimilarProductItem {
  id: string;
  name: string;
  price: string | number;
  image: string;
  rating?: number;
  category?: string;
}

export interface ProductDetailsData {
  id: string;
  name: string;
  category: string;
  brandOrArtisan: string;
  rating: number;
  totalReviews: number;
  price: string | number;
  originalPrice?: string | number;
  discountPercentage?: string | number;
  availability: 'In Stock' | 'Low Stock' | 'Out of Stock';
  deliveryEstimate: string;
  description: string;
  images: string[];
  specifications: ProductSpecification[];
  reviews: ProductReview[];
  similarProducts?: SimilarProductItem[];
}

interface ProductDetailsProps {
  product?: ProductDetailsData;
}

const getImageSrc = (img: any): string => {
  if (!img) return '';
  if (typeof img === 'string') return img;
  if (typeof img === 'object' && 'default' in img) return (img as any).default;
  return String(img);
};

export const sampleDefaultProduct: ProductDetailsData = {
  id: 'prod-kanchi-01',
  name: 'Kanchipuram Pure Mulberry Brocade Silk Saree',
  category: 'Silk Sarees',
  brandOrArtisan: 'Kanchi Handloom Weaver Collective',
  rating: 4.9,
  totalReviews: 128,
  price: '₹14,500',
  originalPrice: '₹18,000',
  discountPercentage: '20% OFF',
  availability: 'In Stock',
  deliveryEstimate: 'Delivered in 3-5 Business Days',
  description: 'Authentic pure Kanchipuram silk saree handwoven with heavy gold zari threads by master artisans. Features traditional temple borders and intricate peacocks motif across the pallu, certified with Silk Mark purity assurance.',
  images: [
    getImageSrc(kanchipuramSareeImg),
    getImageSrc(pochampallyDressImg),
    getImageSrc(mangalagiriDressImg),
    getImageSrc(dhotiImg)
  ],
  specifications: [
    { key: 'Material', value: '100% Pure Mulberry Silk' },
    { key: 'Zari Type', value: 'Tested Gold Zari' },
    { key: 'Weave Type', value: 'Pure Kanchipuram Handloom' },
    { key: 'Length', value: '6.3 Meters (With Blouse Piece)' },
    { key: 'Care Instructions', value: 'Dry Clean Only' },
    { key: 'Certification', value: 'Silk Mark Certified' }
  ],
  reviews: [
    {
      id: 'rev-1',
      userName: 'Priya Sharma',
      userPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      rating: 5,
      review: 'Exquisite silk quality and stunning zari work! Received so many compliments at the wedding.',
      date: '02 Aug 2026'
    },
    {
      id: 'rev-2',
      userName: 'Ananya Reddy',
      userPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      rating: 5,
      review: 'Authentic handloom craftsmanship. Delivery was very fast and packaging was elegant.',
      date: '28 Jul 2026'
    },
    {
      id: 'rev-3',
      userName: 'Vikram Mehta',
      userPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      rating: 4,
      review: 'Bought this for my wife. Great fabric texture and rich color tone.',
      date: '20 Jul 2026'
    }
  ],
  similarProducts: [
    {
      id: 'sim-1',
      name: 'Pochampally Double Ikat Silk Suit',
      price: '₹3,850',
      image: getImageSrc(pochampallyDressImg),
      rating: 4.8,
      category: 'Dress Materials'
    },
    {
      id: 'sim-2',
      name: 'Mangalagiri Gold Nizam Border Dress',
      price: '₹2,200',
      image: getImageSrc(mangalagiriDressImg),
      rating: 4.7,
      category: 'Handloom Dresses'
    },
    {
      id: 'sim-3',
      name: 'Designer Silk Threads Cone Bundle',
      price: '₹1,850 / kg',
      image: getImageSrc(threads1Img),
      rating: 4.9,
      category: 'Handloom Materials'
    },
    {
      id: 'sim-4',
      name: 'Heavy Embroidered Bridal Lace Roll',
      price: '₹680 / roll',
      image: getImageSrc(lays1Img),
      rating: 4.8,
      category: 'Textile Materials'
    }
  ]
};

export const ProductDetails: React.FC<ProductDetailsProps> = ({ product = sampleDefaultProduct }) => {
  const navigate = useNavigate();
  const context = useOutletContext<OutletContextType | null>();

  const showToast = (msg: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    if (context?.showToast) context.showToast(msg, type);
    else alert(msg);
  };

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews' | 'similar'>('description');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [zoomStyle, setZoomStyle] = useState<{ display: string; transformOrigin: string }>({
    display: 'none',
    transformOrigin: '50% 50%'
  });
  const [historyItems, setHistoryItems] = useState<any[]>([]);

  // Update Recent View History in localStorage
  useEffect(() => {
    try {
      const historyRaw = localStorage.getItem('aurastitch_view_history');
      let historyArr: any[] = historyRaw ? JSON.parse(historyRaw) : [];

      // Filter out current product if already exists
      historyArr = historyArr.filter(item => item.id !== product.id);
      // Prepend current product
      historyArr.unshift({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0] || '',
        category: product.category,
        rating: product.rating
      });
      // Limit to last 8 items
      historyArr = historyArr.slice(0, 8);
      localStorage.setItem('aurastitch_view_history', JSON.stringify(historyArr));
      setHistoryItems(historyArr);
    } catch (err) {
      console.error('Failed to update view history:', err);
    }
  }, [product]);

  // Gallery Navigation
  const handlePrevImage = () => {
    setActiveImageIndex(prev => (prev === 0 ? product.images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex(prev => (prev === product.images.length - 1 ? 0 : prev + 1));
  };

  // Image Hover Zoom
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      display: 'block',
      transformOrigin: `${x}% ${y}%`
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      display: 'none',
      transformOrigin: '50% 50%'
    });
  };

  // Actions
  const handleAddToCart = () => {
    try {
      const cartRaw = localStorage.getItem('aurastitch_cart');
      let cart: any[] = cartRaw ? JSON.parse(cartRaw) : [];
      const existingIdx = cart.findIndex(item => item.id === product.id || item.name === product.name);
      
      if (existingIdx > -1) {
        cart[existingIdx].quantity = (cart[existingIdx].quantity || 1) + 1;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          clothType: product.category,
          sellerName: product.brandOrArtisan,
          price: typeof product.price === 'number' ? product.price : parseInt(String(product.price).replace(/[^0-9]/g, '')) || 1000,
          quantity: 1,
          image: product.images[0]
        });
      }
      localStorage.setItem('aurastitch_cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdated'));
      showToast(`Added "${product.name}" to Cart!`, 'success');
    } catch (e) {
      showToast(`Added "${product.name}" to Cart!`, 'success');
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    showToast(
      !isWishlisted ? `Saved "${product.name}" to Wishlist!` : `Removed "${product.name}" from Wishlist`,
      !isWishlisted ? 'success' : 'info'
    );
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard!', 'success');
    } else {
      showToast('Sharing product: ' + window.location.href, 'info');
    }
  };

  return (
    <div className="product-details-container fade-in" style={{ padding: '24px', paddingBottom: '90px', maxWidth: '1240px', margin: '0 auto', color: 'var(--text-primary)' }}>
      {/* BREADCRUMB */}
      <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate('/')}>Home</span>
        <span>›</span>
        <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate('/discover')}>{product.category || 'Collection'}</span>
        <span>›</span>
        <span style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>{product.name}</span>
      </div>

      <style>{`
        .product-details-container {
          color: var(--text-primary);
        }

        /* Top Grid Layout */
        .pd-top-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 36px;
          margin-bottom: 48px;
        }

        @media (max-width: 900px) {
          .pd-top-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }

        /* LEFT SIDE: Image Gallery */
        .pd-gallery-box {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .pd-main-img-wrap {
          position: relative;
          width: 100%;
          height: 460px;
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          background: #111115;
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-md);
          cursor: zoom-in;
        }

        @media (max-width: 600px) {
          .pd-main-img-wrap {
            height: 340px;
          }
        }

        .pd-main-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .pd-zoom-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          background-repeat: no-repeat;
          background-size: 200%;
          transition: opacity 0.2s ease;
        }

        .pd-nav-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(10, 15, 25, 0.75);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          transition: all 0.2s ease;
          z-index: 2;
        }

        .pd-nav-arrow:hover {
          background: var(--accent-gold);
          color: #000;
        }

        .pd-nav-arrow.prev { left: 12px; }
        .pd-nav-arrow.next { right: 12px; }

        .pd-thumbnails-row {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          padding-bottom: 6px;
        }

        .pd-thumb-btn {
          width: 76px;
          height: 76px;
          border-radius: var(--border-radius-md);
          overflow: hidden;
          border: 2px solid transparent;
          background: #111;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
          padding: 0;
        }

        .pd-thumb-btn.active {
          border-color: var(--accent-gold);
          box-shadow: 0 0 10px var(--accent-gold-glow);
        }

        .pd-thumb-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* RIGHT SIDE: Product Details */
        .pd-info-box {
          display: flex;
          flex-direction: column;
        }

        .pd-category-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 700;
          color: var(--accent-gold);
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 8px;
        }

        .pd-title {
          font-family: var(--font-heading);
          font-size: 28px;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0 0 8px 0;
          line-height: 1.3;
        }

        .pd-brand-row {
          font-size: 14px;
          color: var(--text-secondary);
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .pd-verified-icon {
          color: var(--accent-gold);
          font-weight: 700;
        }

        .pd-rating-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .pd-rating-chip {
          background: rgba(255, 183, 3, 0.15);
          color: #ffb703;
          border: 1px solid #ffb703;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 800;
        }

        .pd-reviews-count {
          font-size: 13px;
          color: var(--text-secondary);
        }

        .pd-price-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-md);
          padding: 16px 20px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        .pd-price-flex {
          display: flex;
          align-items: baseline;
          gap: 12px;
        }

        .pd-main-price {
          font-size: 26px;
          font-weight: 800;
          color: var(--text-primary);
        }

        .pd-orig-price {
          font-size: 16px;
          color: var(--text-muted);
          text-decoration: line-through;
        }

        .pd-discount-badge {
          background: rgba(230, 57, 70, 0.15);
          color: #e63946;
          border: 1px solid #e63946;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 800;
        }

        .pd-stock-badge {
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 800;
        }

        .pd-stock-badge.In-Stock {
          background: rgba(42, 157, 143, 0.2);
          border: 1px solid #2a9d8f;
          color: #2a9d8f;
        }

        .pd-stock-badge.Low-Stock {
          background: rgba(244, 162, 97, 0.2);
          border: 1px solid #f4a261;
          color: #f4a261;
        }

        .pd-stock-badge.Out-of-Stock {
          background: rgba(230, 57, 70, 0.2);
          border: 1px solid #e63946;
          color: #e63946;
        }

        .pd-delivery-line {
          font-size: 13px;
          color: var(--text-secondary);
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .pd-policy-line {
          font-size: 13px;
          color: var(--text-secondary);
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .pd-desc-short {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 24px;
        }

        .pd-actions-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-bottom: 20px;
        }

        @media (max-width: 500px) {
          .pd-actions-grid {
            grid-template-columns: 1fr;
          }
        }

        .pd-btn-cart {
          padding: 14px 20px;
          border-radius: 30px;
          border: 1px solid var(--accent-gold);
          background: transparent;
          color: var(--accent-gold);
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.25s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .pd-btn-cart:hover {
          background: var(--accent-gold);
          color: #000000;
          transform: translateY(-2px);
        }

        .pd-btn-buy {
          padding: 14px 20px;
          border-radius: 30px;
          border: none;
          background: linear-gradient(135deg, var(--accent-gold), var(--accent-gold-dark));
          color: #FFFFFF;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 6px 18px var(--accent-gold-glow);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .pd-btn-buy:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(var(--accent-gold-rgb), 0.35);
        }

        .pd-secondary-actions-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .pd-btn-icon-sub {
          flex: 1;
          min-width: 130px;
          padding: 10px 16px;
          border-radius: 20px;
          border: 1px solid var(--border-color);
          background: var(--bg-secondary);
          color: var(--text-primary);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .pd-btn-icon-sub:hover {
          border-color: var(--accent-gold);
          color: var(--accent-gold);
          transform: translateY(-2px);
        }

        .pd-btn-icon-sub.active-wish {
          color: #e63946;
          border-color: #e63946;
          background: rgba(230, 57, 70, 0.1);
        }

        /* TABS SECTION */
        .pd-tabs-section {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          padding: 28px;
          margin-bottom: 48px;
          box-shadow: var(--shadow-sm);
        }

        .pd-tabs-header {
          display: flex;
          gap: 12px;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 12px;
          margin-bottom: 24px;
          overflow-x: auto;
        }

        .pd-tab-btn {
          padding: 10px 20px;
          border-radius: 20px;
          border: 1px solid transparent;
          background: transparent;
          color: var(--text-secondary);
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.25s ease;
          white-space: nowrap;
        }

        .pd-tab-btn:hover {
          color: var(--accent-gold);
        }

        .pd-tab-btn.active {
          background: var(--accent-gold);
          color: #000000;
          border-color: var(--accent-gold);
          box-shadow: 0 4px 14px var(--accent-gold-glow);
        }

        .pd-tab-content-pane {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        /* Specs Table */
        .pd-specs-table {
          width: 100%;
          border-collapse: collapse;
        }

        .pd-specs-table td {
          padding: 12px 16px;
          border-bottom: 1px solid var(--border-color);
        }

        .pd-specs-table tr:last-child td {
          border-bottom: none;
        }

        .pd-specs-table td.key {
          font-weight: 700;
          color: var(--text-primary);
          width: 35%;
        }

        /* Reviews List */
        .pd-reviews-list {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .pd-review-card {
          display: flex;
          gap: 14px;
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-md);
          padding: 16px;
        }

        .pd-rev-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
        }

        .pd-rev-body {
          flex: 1;
        }

        .pd-rev-top-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }

        .pd-rev-name {
          font-weight: 700;
          color: var(--text-primary);
        }

        .pd-rev-date {
          font-size: 12px;
          color: var(--text-muted);
        }

        .pd-rev-rating {
          color: #ffb703;
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .pd-rev-text {
          color: var(--text-secondary);
          font-size: 13px;
          line-height: 1.5;
        }

        /* Similar Products Grid */
        .pd-similar-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 20px;
        }

        .pd-similar-card {
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-md);
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.25s ease, border-color 0.25s ease;
        }

        .pd-similar-card:hover {
          transform: translateY(-4px);
          border-color: var(--accent-gold);
        }

        .pd-similar-img-box {
          height: 160px;
          overflow: hidden;
          background: #111;
        }

        .pd-similar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .pd-similar-card:hover .pd-similar-img {
          transform: scale(1.05);
        }

        .pd-similar-body {
          padding: 14px;
        }

        .pd-similar-name {
          font-weight: 700;
          font-size: 14px;
          color: var(--text-primary);
          margin-bottom: 6px;
        }

        .pd-similar-price {
          font-weight: 800;
          font-size: 15px;
          color: var(--text-primary);
        }

        /* Recently Viewed History Section */
        .pd-history-section {
          margin-top: 40px;
        }

        .pd-section-heading {
          font-family: var(--font-heading);
          font-size: 22px;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .pd-section-heading::before {
          content: '';
          display: inline-block;
          width: 4px;
          height: 20px;
          background: var(--accent-gold);
          border-radius: 4px;
        }
      `}</style>

      {/* TOP SECTION: Left Gallery & Right Details */}
      <div className="pd-top-grid">
        {/* LEFT SIDE: Image Gallery */}
        <div className="pd-gallery-box">
          <div
            className="pd-main-img-wrap"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              className="pd-main-img"
            />
            <div
              className="pd-zoom-overlay"
              style={{
                ...zoomStyle,
                backgroundImage: `url(${product.images[activeImageIndex] || product.images[0]})`
              }}
            />

            {product.images.length > 1 && (
              <>
                <button className="pd-nav-arrow prev" onClick={handlePrevImage}>❮</button>
                <button className="pd-nav-arrow next" onClick={handleNextImage}>❯</button>
              </>
            )}
          </div>

          {/* Thumbnails Row */}
          {product.images.length > 1 && (
            <div className="pd-thumbnails-row">
              {product.images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  className={`pd-thumb-btn ${activeImageIndex === idx ? 'active' : ''}`}
                  onClick={() => setActiveImageIndex(idx)}
                >
                  <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="pd-thumb-img" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT SIDE: Product Specifications & Details */}
        <div className="pd-info-box">
          <span className="pd-category-badge">🏷️ {product.category}</span>
          <h1 className="pd-title">{product.name}</h1>
          <div className="pd-brand-row">
            <span>By <strong>{product.brandOrArtisan}</strong></span>
            <span className="pd-verified-icon">✓ Verified Supplier / Artisan</span>
          </div>

          <div className="pd-rating-row">
            <span className="pd-rating-chip">⭐ {product.rating}</span>
            <span className="pd-reviews-count">({product.totalReviews} Verified Customer Reviews)</span>
          </div>

          <div className="pd-price-card">
            <div className="pd-price-flex">
              <span className="pd-main-price">{typeof product.price === 'number' ? `₹${product.price.toLocaleString()}` : product.price}</span>
              {product.originalPrice && (
                <span className="pd-orig-price">{typeof product.originalPrice === 'number' ? `₹${product.originalPrice.toLocaleString()}` : product.originalPrice}</span>
              )}
              {product.discountPercentage && (
                <span className="pd-discount-badge">{product.discountPercentage}</span>
              )}
            </div>

            <span className={`pd-stock-badge ${product.availability.replace(/\s+/g, '-')}`}>
              {product.availability}
            </span>
          </div>

          <div className="pd-delivery-line">
            <span>🚚</span>
            <span><strong>Delivery Estimate:</strong> {product.deliveryEstimate}</span>
          </div>

          <div className="pd-policy-line">
            <span>🔄</span>
            <span><strong>Return Policy:</strong> Easy 7-Day Replacement & Return Policy</span>
          </div>

          <p className="pd-desc-short">{product.description}</p>

          {/* Action Buttons */}
          <div className="pd-actions-grid">
            <button className="pd-btn-cart" onClick={handleAddToCart}>
              🛒 Add to Cart
            </button>
            <button className="pd-btn-buy" onClick={handleBuyNow}>
              ⚡ Buy Now
            </button>
          </div>

          <div className="pd-secondary-actions-row">
            <button
              className={`pd-btn-icon-sub ${isWishlisted ? 'active-wish' : ''}`}
              onClick={handleToggleWishlist}
            >
              {isWishlisted ? '❤️ Wishlisted' : '🤍 Wishlist'}
            </button>
            <button className="pd-btn-icon-sub" onClick={() => navigate('/messages')}>
              💬 Message Seller
            </button>
            <button className="pd-btn-icon-sub" onClick={handleShare}>
              🔗 Share
            </button>
          </div>
        </div>
      </div>

      {/* TABS SECTION: Description, Specifications, Reviews, Similar Products */}
      <div className="pd-tabs-section">
        <div className="pd-tabs-header">
          <button
            className={`pd-tab-btn ${activeTab === 'description' ? 'active' : ''}`}
            onClick={() => setActiveTab('description')}
          >
            Description
          </button>
          <button
            className={`pd-tab-btn ${activeTab === 'specifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('specifications')}
          >
            Specifications
          </button>
          <button
            className={`pd-tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews ({product.reviews.length})
          </button>
          {product.similarProducts && product.similarProducts.length > 0 && (
            <button
              className={`pd-tab-btn ${activeTab === 'similar' ? 'active' : ''}`}
              onClick={() => setActiveTab('similar')}
            >
              Similar Products
            </button>
          )}
        </div>

        <div className="pd-tab-content-pane">
          {activeTab === 'description' && (
            <div>
              <p style={{ marginBottom: '16px' }}>{product.description}</p>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Craftsmanship & Quality Highlights:</h4>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li>Handcrafted by skilled weavers and certified artisans preserving traditional loom heritage.</li>
                <li>Made with non-toxic, eco-friendly dye and warp processing.</li>
                <li>Rigorous quality inspection before dispatch to ensure defect-free finish.</li>
              </ul>
            </div>
          )}

          {activeTab === 'specifications' && (
            <table className="pd-specs-table">
              <tbody>
                {product.specifications.map((spec, idx) => (
                  <tr key={idx}>
                    <td className="key">{spec.key}</td>
                    <td>{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'reviews' && (
            <div className="pd-reviews-list">
              {product.reviews.map((rev) => (
                <div key={rev.id} className="pd-review-card">
                  {rev.userPhoto ? (
                    <img src={rev.userPhoto} alt={rev.userName} className="pd-rev-avatar" />
                  ) : (
                    <div className="pd-rev-avatar" style={{ background: 'var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 800 }}>
                      {rev.userName.charAt(0)}
                    </div>
                  )}
                  <div className="pd-rev-body">
                    <div className="pd-rev-top-row">
                      <span className="pd-rev-name">{rev.userName}</span>
                      <span className="pd-rev-date">{rev.date}</span>
                    </div>
                    <div className="pd-rev-rating">⭐ {'★'.repeat(rev.rating)} ({rev.rating}/5)</div>
                    <p className="pd-rev-text">{rev.review}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'similar' && product.similarProducts && (
            <div className="pd-similar-grid">
              {product.similarProducts.map((item) => (
                <div key={item.id} className="pd-similar-card" onClick={() => navigate('/product-details', { state: { product: item } })}>
                  <div className="pd-similar-img-box">
                    <img src={item.image} alt={item.name} className="pd-similar-img" />
                  </div>
                  <div className="pd-similar-body">
                    <h4 className="pd-similar-name">{item.name}</h4>
                    <div className="pd-similar-price">{typeof item.price === 'number' ? `₹${item.price.toLocaleString()}` : item.price}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* VIEW HISTORY / RECENTLY VIEWED PRODUCTS */}
      {historyItems.length > 0 && (
        <div className="pd-history-section">
          <h2 className="pd-section-heading">Recently Viewed Products</h2>
          <div className="pd-similar-grid">
            {historyItems.map((item) => (
              <div key={item.id} className="pd-similar-card" onClick={() => navigate('/product-details', { state: { product: item } })}>
                <div className="pd-similar-img-box">
                  <img src={item.image} alt={item.name} className="pd-similar-img" />
                </div>
                <div className="pd-similar-body">
                  <h4 className="pd-similar-name">{item.name}</h4>
                  <div className="pd-similar-price">{typeof item.price === 'number' ? `₹${item.price.toLocaleString()}` : item.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;

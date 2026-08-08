import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Relative image imports from customer & supplier images folders
import kanchipuramSareeImg from '../customer/images/kanchipuramsaree.jpg';
import pochampallyDressImg from '../customer/images/pochampallydress.jpg';
import mangalagiriDressImg from '../customer/images/Mangalagiridress.jpg';
import dhotiImg from '../customer/images/dothi.jpg';
import dupattaImg from '../customer/images/duppatta.jpg';
import sareesImg from '../customer/images/Sarees.jpg';

import beads1Img from '../supplier/images/Beads1.jpg';
import lays1Img from '../supplier/images/Lays1.jpg';
import threads1Img from '../supplier/images/Threads1.jpg';

interface OutletContextType {
  showToast?: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

const getImageSrc = (img: any): string => {
  if (!img) return '';
  if (typeof img === 'string') return img;
  if (typeof img === 'object' && 'default' in img) return (img as any).default;
  return String(img);
};

interface CustomStitchingOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  garmentName: string;
  fabric: string;
  category: string;
  measurements: Record<string, string>;
  customerNotes: string;
  deliveryDate: string;
  status: 'In Stitching' | 'Cutting Phase' | 'Pattern Ready' | 'Fitting Scheduled' | 'Ready for Delivery';
  price: number;
  image: string;
  rating: number;
  reviewsCount: number;
}

interface TailorGarmentDesign {
  id: string;
  name: string;
  category: string;
  fabric: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  image: string;
  description: string;
  customerNotes: string;
  measurements: Record<string, string>;
}

const mockTailorOrders: CustomStitchingOrder[] = [
  {
    id: 't-ord-101',
    orderNumber: 'ALT-8091',
    customerName: 'Ananya Roy',
    garmentName: 'Bridal Kanchipuram Silk Lehenga & Blouse',
    fabric: 'Heavy Pure Kanchipuram Brocade Silk',
    category: 'Bridal Couture',
    measurements: {
      'Bust / Chest': '36 inches',
      'Waist': '29 inches',
      'Blouse Length': '14.5 inches',
      'Lehenga Length': '42 inches',
      'Shoulder Width': '14 inches',
      'Sleeve Length': '10.5 inches'
    },
    customerNotes: 'Heavy golden zari latkan tassels on dori. Padded cups with deep neck line on back. Extra 2-inch side seam margins required.',
    deliveryDate: '12 Aug 2026',
    status: 'In Stitching',
    price: 4800,
    image: getImageSrc(kanchipuramSareeImg),
    rating: 4.9,
    reviewsCount: 38
  },
  {
    id: 't-ord-102',
    orderNumber: 'ALT-8092',
    customerName: 'Meera Deshmukh',
    garmentName: 'Designer Pochampally Ikat Anarkali Suit',
    fabric: 'Double Ikat Handloom Mulberry Silk',
    category: 'Anarkali Suits',
    measurements: {
      'Chest': '38 inches',
      'Waist': '32 inches',
      'Anarkali Length': '52 inches',
      'Sleeve Length': '18 inches',
      'Pant Waist': '30 inches',
      'Inseam Length': '38 inches'
    },
    customerNotes: 'Include boat neck design with royal gold lace borders on full flare. Cigarette pants with elastic waist band and pockets.',
    deliveryDate: '15 Aug 2026',
    status: 'Cutting Phase',
    price: 3200,
    image: getImageSrc(pochampallyDressImg),
    rating: 4.8,
    reviewsCount: 26
  },
  {
    id: 't-ord-103',
    orderNumber: 'ALT-8093',
    customerName: 'Sunita Reddy',
    garmentName: 'Traditional Mangalagiri Cotton Kurti Set',
    fabric: '80s Count Combed Mangalagiri Nizam Cotton',
    category: 'Ethnic Wear',
    measurements: {
      'Bust': '40 inches',
      'Waist': '34 inches',
      'Hips': '42 inches',
      'Kurti Length': '44 inches',
      'Shoulder': '15 inches'
    },
    customerNotes: 'Nizam zari border piping around V-neck line and sleeve ends. Soft cotton lining fabric inside.',
    deliveryDate: '10 Aug 2026',
    status: 'Ready for Delivery',
    price: 1850,
    image: getImageSrc(mangalagiriDressImg),
    rating: 4.7,
    reviewsCount: 19
  }
];

const mockTailorDesigns: TailorGarmentDesign[] = [
  {
    id: 't-dsg-201',
    name: 'Custom Zari Embroidered Silk Blouse',
    category: 'Boutique Stitching',
    fabric: 'Raw Silk with Tested Zari Embroidery Threads',
    price: 2450,
    originalPrice: 3200,
    rating: 4.9,
    reviewsCount: 52,
    image: getImageSrc(kanchipuramSareeImg),
    description: 'Precision handcrafted designer silk blouse featuring traditional maggam work, zari thread piping, and custom padding options.',
    customerNotes: 'Custom neck cutout choices available (Deep U, V-neck, Sweetheart neck) along with elbow-length maggam embroidered sleeves.',
    measurements: {
      'Bust Range': '32 to 44 inches',
      'Standard Length': '14 to 16 inches',
      'Sleeve Options': 'Cap, Short, Elbow, Full Length'
    }
  },
  {
    id: 't-dsg-202',
    name: 'Floor-Length Pochampally Silk Gown',
    category: 'Designer Gowns',
    fabric: 'Authentic Pochampally Double Ikat Handloom Silk',
    price: 6500,
    originalPrice: 8000,
    rating: 4.9,
    reviewsCount: 41,
    image: getImageSrc(pochampallyDressImg),
    description: 'Elegant western-fusion Indo-ethnic gown crafted from handwoven geometric ikat silk, complete with soft lining and back zipper.',
    customerNotes: 'Includes matching handwoven belt accent and custom flare pleating.',
    measurements: {
      'Chest Range': '34 to 46 inches',
      'Gown Length': '52 to 58 inches',
      'Waist Flare': 'Full 360-degree flare'
    }
  },
  {
    id: 't-dsg-203',
    name: 'Handloom Cotton Designer Kurta & Dupatta Set',
    category: 'Casual & Festive Sets',
    fabric: 'Organic Mangalagiri Cotton & Zari Border Dupatta',
    price: 2950,
    originalPrice: 3600,
    rating: 4.8,
    reviewsCount: 33,
    image: getImageSrc(mangalagiriDressImg),
    description: 'Breathable handloom cotton tunic set paired with a contrasting zari-bordered woven dupatta for effortless elegance.',
    customerNotes: 'Pockets on both sides of kurti and custom side slit heights available.',
    measurements: {
      'Bust Size': '36 to 48 inches',
      'Kurta Length': '46 inches',
      'Dupatta Length': '2.4 Meters'
    }
  },
  {
    id: 't-dsg-204',
    name: 'Artisan Hand-Stitched Royal Dhoti & Kurta Set',
    category: 'Men Ethnic Wear',
    fabric: 'Fine Pure Cotton & Silk Border',
    price: 3400,
    originalPrice: 4200,
    rating: 4.9,
    reviewsCount: 28,
    image: getImageSrc(dhotiImg),
    description: 'Traditional tailored men’s kurti with ready-to-wear stitched dhoti trousers, featuring gold thread embroidery along collar.',
    customerNotes: 'Elastic waistband option for dhoti pant with adjustable drawstring closure.',
    measurements: {
      'Chest Size': '38 to 48 inches',
      'Waist Range': '30 to 42 inches',
      'Dhoti Length': '40 inches'
    }
  }
];

export const TailorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const outletContext = useOutletContext<OutletContextType | null>();

  const [activeTab, setActiveTab] = useState<'orders' | 'designs'>('orders');
  const [searchQuery, setSearchQuery] = useState('');

  const showToast = (msg: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    if (outletContext?.showToast) outletContext.showToast(msg, type);
    else alert(msg);
  };

  const handleOpenProductDetails = (product: any) => {
    navigate('/product-details', { state: { product } });
  };

  const filteredOrders = mockTailorOrders.filter(ord =>
    !searchQuery ||
    ord.garmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ord.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ord.fabric.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDesigns = mockTailorDesigns.filter(dsg =>
    !searchQuery ||
    dsg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dsg.fabric.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dsg.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="tailor-dashboard-container fade-in" style={{ padding: '10px 0 40px' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(30, 25, 20, 0.95), rgba(15, 12, 10, 0.98))',
        border: '1px solid var(--accent-gold)',
        borderRadius: 'var(--border-radius-lg)',
        padding: '28px',
        marginBottom: '32px',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '12px', color: 'var(--accent-gold)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
              ✂️ Boutique Master Tailor Portal
            </span>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: 800, margin: '6px 0', color: 'var(--text-primary)' }}>
              Welcome back, {user?.name || 'Master Tailor'}
            </h1>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '14px' }}>
              Manage custom stitching orders, customer body measurements, fabric specifications, and boutique portfolio designs.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              className="btn-primary" 
              style={{ padding: '10px 20px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}
              onClick={() => showToast('Syncing customer body measurements with CAD patterns...', 'info')}
            >
              📐 Sync Measurements
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '36px' }}>
        <div className="glass-panel" style={{ padding: '22px', borderLeft: '4px solid var(--accent-gold)' }}>
          <h4 style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 8px' }}>Pending Stitching Orders</h4>
          <p style={{ fontSize: '32px', fontWeight: 800, color: 'var(--accent-gold)', margin: 0 }}>5 Orders</p>
        </div>
        <div className="glass-panel" style={{ padding: '22px', borderLeft: '4px solid #2a9d8f' }}>
          <h4 style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 8px' }}>Active Pattern Cutting</h4>
          <p style={{ fontSize: '32px', fontWeight: 800, color: '#2a9d8f', margin: 0 }}>3 Garments</p>
        </div>
        <div className="glass-panel" style={{ padding: '22px', borderLeft: '4px solid #f4a261' }}>
          <h4 style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 8px' }}>Stitched & Ready</h4>
          <p style={{ fontSize: '32px', fontWeight: 800, color: '#f4a261', margin: 0 }}>12 Completed</p>
        </div>
        <div className="glass-panel" style={{ padding: '22px', borderLeft: '4px solid #e76f51' }}>
          <h4 style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 8px' }}>Monthly Boutique Earnings</h4>
          <p style={{ fontSize: '32px', fontWeight: 800, color: '#e76f51', margin: 0 }}>₹42,500</p>
        </div>
      </div>

      {/* Tab Navigation & Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            style={{
              padding: '10px 22px',
              borderRadius: '24px',
              border: '1px solid ' + (activeTab === 'orders' ? 'var(--accent-gold)' : 'var(--border-color)'),
              background: activeTab === 'orders' ? 'var(--accent-gold)' : 'var(--bg-secondary)',
              color: activeTab === 'orders' ? '#000' : 'var(--text-primary)',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onClick={() => setActiveTab('orders')}
          >
            🧵 Custom Orders & Measurements ({mockTailorOrders.length})
          </button>
          <button
            style={{
              padding: '10px 22px',
              borderRadius: '24px',
              border: '1px solid ' + (activeTab === 'designs' ? 'var(--accent-gold)' : 'var(--border-color)'),
              background: activeTab === 'designs' ? 'var(--accent-gold)' : 'var(--bg-secondary)',
              color: activeTab === 'designs' ? '#000' : 'var(--text-primary)',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onClick={() => setActiveTab('designs')}
          >
            👗 Garment Design Portfolio ({mockTailorDesigns.length})
          </button>
        </div>

        <input
          type="text"
          placeholder="Search garments, fabrics, or customer names..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: '10px 18px',
            borderRadius: '20px',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            fontSize: '13px',
            minWidth: '260px',
            outline: 'none'
          }}
        />
      </div>

      {/* SECTION 1: Custom Stitching Orders & Measurements */}
      {activeTab === 'orders' && (
        <div>
          {filteredOrders.length === 0 ? (
            <div style={{ background: 'var(--bg-secondary)', padding: '40px', borderRadius: '12px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No custom stitching orders match your search query.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
              {filteredOrders.map(order => (
                <div 
                  key={order.id} 
                  className="glass-panel" 
                  style={{
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease, border-color 0.3s ease',
                    border: '1px solid var(--border-color)'
                  }}
                  onClick={() => handleOpenProductDetails(order)}
                >
                  <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                    <img 
                      src={order.image} 
                      alt={order.garmentName} 
                      style={{ width: '90px', height: '110px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-color)' }} 
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '11px', color: 'var(--accent-gold)', fontWeight: 800 }}>{order.orderNumber}</span>
                        <span style={{
                          fontSize: '11px',
                          padding: '3px 8px',
                          borderRadius: '12px',
                          fontWeight: 700,
                          background: order.status === 'Ready for Delivery' ? 'rgba(42, 157, 143, 0.2)' : 'rgba(244, 162, 97, 0.2)',
                          color: order.status === 'Ready for Delivery' ? '#2a9d8f' : '#f4a261',
                          border: '1px solid ' + (order.status === 'Ready for Delivery' ? '#2a9d8f' : '#f4a261')
                        }}>
                          {order.status}
                        </span>
                      </div>
                      <h4 style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {order.garmentName}
                      </h4>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                        👤 <strong>Customer:</strong> {order.customerName}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        🧵 <strong>Fabric:</strong> {order.fabric}
                      </div>
                    </div>
                  </div>

                  {/* Body Measurements Box */}
                  <div style={{
                    background: 'var(--bg-primary)',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '14px',
                    border: '1px dashed var(--border-color)',
                    fontSize: '12px'
                  }}>
                    <strong style={{ color: 'var(--accent-gold)', display: 'block', marginBottom: '6px' }}>
                      📐 Customer Body Measurements:
                    </strong>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', color: 'var(--text-secondary)' }}>
                      {Object.entries(order.measurements).map(([k, v]) => (
                        <div key={k}>
                          <strong>{k}:</strong> {v}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Customer Notes */}
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px', background: 'rgba(200, 155, 60, 0.08)', padding: '10px', borderRadius: '6px', borderLeft: '3px solid var(--accent-gold)' }}>
                    📝 <strong>Customer Notes:</strong> "{order.customerNotes}"
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                    <div>
                      <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>₹{order.price.toLocaleString()}</span>
                      <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)' }}>Delivery by {order.deliveryDate}</span>
                    </div>
                    <button 
                      className="btn-secondary" 
                      style={{ padding: '8px 16px', fontSize: '12px' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenProductDetails(order);
                      }}
                    >
                      👁️ View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: Garment Design Portfolio */}
      {activeTab === 'designs' && (
        <div>
          {filteredDesigns.length === 0 ? (
            <div style={{ background: 'var(--bg-secondary)', padding: '40px', borderRadius: '12px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No portfolio garment designs match your search parameters.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
              {filteredDesigns.map(design => (
                <div 
                  key={design.id} 
                  className="glass-panel" 
                  style={{
                    padding: '0',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease, border-color 0.3s ease',
                    border: '1px solid var(--border-color)'
                  }}
                  onClick={() => handleOpenProductDetails(design)}
                >
                  <div style={{ position: 'relative', width: '100%', height: '220px', overflow: 'hidden' }}>
                    <img 
                      src={design.image} 
                      alt={design.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                    <span style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: 'rgba(10, 15, 25, 0.85)',
                      border: '1px solid var(--accent-gold)',
                      color: 'var(--accent-gold)',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 700
                    }}>
                      ✦ {design.category}
                    </span>
                  </div>

                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h4 style={{ margin: '0 0 6px', fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                      {design.name}
                    </h4>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                      🧵 <strong>Fabric:</strong> {design.fabric}
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 14px', lineHeight: 1.4, flex: 1 }}>
                      {design.description}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div>
                        <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>₹{design.price.toLocaleString()}</span>
                        <span style={{ fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'line-through', marginLeft: '6px' }}>₹{design.originalPrice.toLocaleString()}</span>
                      </div>
                      <span style={{ color: '#ffb703', fontWeight: 700, fontSize: '13px' }}>⭐ {design.rating} ({design.reviewsCount})</span>
                    </div>

                    <button 
                      className="btn-primary" 
                      style={{ width: '100%', padding: '10px', fontSize: '13px' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenProductDetails(design);
                      }}
                    >
                      👁️ View Garment Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TailorDashboard;

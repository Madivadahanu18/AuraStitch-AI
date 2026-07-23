import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';

// Relative image imports from handloomimages folder
import cottonSareesImg from './handloomimages/cottonsarees.jpg';
import dhotiImg from './handloomimages/dhoti.jpg';
import mangalagiriDressImg from './handloomimages/Mangalagiridress.jpg';
import pattuSareeImg from './handloomimages/pattusaree.jpg';
import pochampallyImg from './handloomimages/pochampally.jpg';

interface OutletContextType {
  showToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

interface MaterialProduct {
  id: string;
  name: string;
  category: string;
  supplierName: string;
  supplierLocation: string;
  price: number;
  unit: 'kg' | 'cone' | 'meter' | 'piece' | 'set' | 'roll';
  availableQuantity: number;
  supplierRating: number;
  deliveryTime: string;
  moq: string;
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

const initialMaterials: MaterialProduct[] = [
  {
    id: 'mat-1',
    name: '80s Count Combed Organic Cotton Yarn',
    category: 'Cotton Yarn',
    supplierName: 'Coimbatore Cotton Mills Co.',
    supplierLocation: 'Coimbatore, Tamil Nadu',
    price: 420,
    unit: 'kg',
    availableQuantity: 850,
    supplierRating: 4.9,
    deliveryTime: '2 - 3 Days',
    moq: '10 kg',
    description: 'High tensile strength 80s count organic combed cotton yarn for pit looms and frame looms.',
    image: getImageSrc(cottonSareesImg)
  },
  {
    id: 'mat-2',
    name: 'Pure Mulberry Raw Silk Yarn Cones',
    category: 'Silk Yarn',
    supplierName: 'Kanchipuram Silk Traders',
    supplierLocation: 'Kanchipuram, Tamil Nadu',
    price: 3400,
    unit: 'cone',
    availableQuantity: 140,
    supplierRating: 4.9,
    deliveryTime: '3 - 4 Days',
    moq: '2 cones',
    description: 'Grade-A 20/22 denier raw mulberry silk yarn reels pre-tested for zari warp sheets.',
    image: getImageSrc(pattuSareeImg)
  },
  {
    id: 'mat-3',
    name: 'Eco-Friendly Natural Indigo Dye Powder',
    category: 'Natural Dyes',
    supplierName: 'Deccan Organic Dyes & Extracts',
    supplierLocation: 'Hyderabad, Telangana',
    price: 850,
    unit: 'kg',
    availableQuantity: 320,
    supplierRating: 4.8,
    deliveryTime: '2 - 4 Days',
    moq: '5 kg',
    description: 'Pure plant-extracted organic Indigo dye for traditional tie-dye and double ikat yarn processing.',
    image: getImageSrc(pochampallyImg)
  },
  {
    id: 'mat-4',
    name: '600-Hook Hardened Punch Jacquard Cards',
    category: 'Jacquard Cards',
    supplierName: 'Salem Loom Accessories Ltd.',
    supplierLocation: 'Salem, Tamil Nadu',
    price: 1850,
    unit: 'set',
    availableQuantity: 65,
    supplierRating: 4.7,
    deliveryTime: '4 - 5 Days',
    moq: '1 set',
    description: 'Precision punched heavy-duty 600-hook jacquard pattern cards for complex motif borders.',
    image: getImageSrc(mangalagiriDressImg)
  },
  {
    id: 'mat-5',
    name: 'Seasoned Teak Wood Flying Shuttle',
    category: 'Shuttle',
    supplierName: 'Karnataka Loom Works',
    supplierLocation: 'Ilkal, Karnataka',
    price: 1250,
    unit: 'piece',
    availableQuantity: 90,
    supplierRating: 4.9,
    deliveryTime: '2 - 3 Days',
    moq: '1 piece',
    description: 'Perfectly balanced hand-polished teak wood flying shuttle with brass tips for weavers.',
    image: getImageSrc(dhotiImg)
  },
  {
    id: 'mat-6',
    name: '120-Dent Stainless Steel Reed',
    category: 'Reed',
    supplierName: 'Apex Textile Accessories',
    supplierLocation: 'Surat, Gujarat',
    price: 950,
    unit: 'piece',
    availableQuantity: 110,
    supplierRating: 4.8,
    deliveryTime: '3 - 5 Days',
    moq: '2 pieces',
    description: 'Rust-resistant 120-dent stainless steel weaving reed for fine saree density control.',
    image: getImageSrc(cottonSareesImg)
  },
  {
    id: 'mat-7',
    name: 'Heavy Duty Wooden Bobbins (Pack of 50)',
    category: 'Bobbins',
    supplierName: 'Salem Loom Accessories Ltd.',
    supplierLocation: 'Salem, Tamil Nadu',
    price: 650,
    unit: 'set',
    availableQuantity: 200,
    supplierRating: 4.6,
    deliveryTime: '2 - 3 Days',
    moq: '1 set',
    description: 'Smooth-finish wooden pirn bobbins engineered for high-speed pirn winding machines.',
    image: getImageSrc(dhotiImg)
  },
  {
    id: 'mat-8',
    name: 'Synthetic Reactive Fast Dyes (Multicolor)',
    category: 'Chemical Dyes',
    supplierName: 'Deccan Organic Dyes & Extracts',
    supplierLocation: 'Hyderabad, Telangana',
    price: 550,
    unit: 'kg',
    availableQuantity: 450,
    supplierRating: 4.7,
    deliveryTime: '2 - 4 Days',
    moq: '5 kg',
    description: 'Color-fast reactive chemical dye powders for cotton and silk yarn dyeing vats.',
    image: getImageSrc(pochampallyImg)
  },
  {
    id: 'mat-9',
    name: 'Steel Eye Heald Wire Frames (Set of 400)',
    category: 'Heald Frames',
    supplierName: 'Apex Textile Accessories',
    supplierLocation: 'Surat, Gujarat',
    price: 2100,
    unit: 'set',
    availableQuantity: 40,
    supplierRating: 4.8,
    deliveryTime: '3 - 5 Days',
    moq: '1 set',
    description: 'High-grade nickel-plated steel wire healds for effortless warp thread lifting.',
    image: getImageSrc(mangalagiriDressImg)
  },
  {
    id: 'mat-10',
    name: '100% Australian Merino Wool Yarn',
    category: 'Wool Yarn',
    supplierName: 'Ludhiana Woollen Yarns',
    supplierLocation: 'Ludhiana, Punjab',
    price: 1150,
    unit: 'kg',
    availableQuantity: 280,
    supplierRating: 4.9,
    deliveryTime: '4 - 6 Days',
    moq: '5 kg',
    description: 'Soft 2/28s count merino wool yarn for handwoven shawls, stoles, and winter blankets.',
    image: getImageSrc(pattuSareeImg)
  }
];

export const RawMaterialsMarketplace: React.FC = () => {
  const context = useOutletContext<OutletContextType | null>();
  const showToast = (msg: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    if (context?.showToast) context.showToast(msg, type);
    else alert(msg);
  };

  const [materials] = useState<MaterialProduct[]>(initialMaterials);

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSupplier, setSelectedSupplier] = useState('All');
  const [selectedPriceFilter, setSelectedPriceFilter] = useState('All');
  const [selectedRatingFilter, setSelectedRatingFilter] = useState('All');

  // Modals State
  const [viewingMaterial, setViewingMaterial] = useState<MaterialProduct | null>(null);
  const [contactingSupplier, setContactingSupplier] = useState<MaterialProduct | null>(null);
  const [buyingMaterial, setBuyingMaterial] = useState<MaterialProduct | null>(null);

  // Inquiry Form State
  const [inquiryMsg, setInquiryMsg] = useState('');
  const [inquiryQty, setInquiryQty] = useState<number>(10);

  // Category Pills List
  const categoryPills = [
    'All', 'Cotton Yarn', 'Silk Yarn', 'Wool Yarn', 'Natural Dyes', 'Chemical Dyes', 
    'Jacquard Cards', 'Shuttle', 'Reed', 'Bobbins', 'Heald Frames'
  ];

  // Filtered Materials
  const filteredMaterials = useMemo(() => {
    return materials.filter(mat => {
      // Search
      const matchesSearch = !searchQuery ||
        mat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mat.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mat.supplierName.toLowerCase().includes(searchQuery.toLowerCase());

      // Category Filter
      const matchesCat = selectedCategory === 'All' || mat.category === selectedCategory;

      // Supplier Filter
      const matchesSupplier = selectedSupplier === 'All' || mat.supplierName === selectedSupplier;

      // Price Filter
      const matchesPrice = selectedPriceFilter === 'All' ||
        (selectedPriceFilter === 'Under ₹500' && mat.price < 500) ||
        (selectedPriceFilter === '₹500 - ₹2000' && mat.price >= 500 && mat.price <= 2000) ||
        (selectedPriceFilter === '₹2000+' && mat.price > 2000);

      // Rating Filter
      const matchesRating = selectedRatingFilter === 'All' ||
        (selectedRatingFilter === '⭐ 4.8+' && mat.supplierRating >= 4.8);

      return matchesSearch && matchesCat && matchesSupplier && matchesPrice && matchesRating;
    });
  }, [materials, searchQuery, selectedCategory, selectedSupplier, selectedPriceFilter, selectedRatingFilter]);

  // Unique Suppliers list for dropdown
  const supplierList = useMemo(() => {
    return Array.from(new Set(materials.map(m => m.supplierName)));
  }, [materials]);

  // Actions Handlers
  const handleAddToCart = (material: MaterialProduct) => {
    showToast(`Added ${material.name} (${material.moq} MOQ) to your weaver cart!`, 'success');
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactingSupplier) return;

    showToast(`Inquiry sent to ${contactingSupplier.supplierName} for ${inquiryQty} ${contactingSupplier.unit}!`, 'success');
    setContactingSupplier(null);
    setInquiryMsg('');
  };

  const handleConfirmPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyingMaterial) return;

    showToast(`Purchase order placed with ${buyingMaterial.supplierName}! Delivery expected in ${buyingMaterial.deliveryTime}.`, 'success');
    setBuyingMaterial(null);
  };

  return (
    <div className="raw-materials-container fade-in" style={{ padding: '24px', paddingBottom: '90px', maxWidth: '1240px', margin: '0 auto', color: 'var(--text-primary)' }}>
      <style>{`
        .mat-top-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .mat-header-left {
          display: flex;
          align-items: baseline;
          gap: 14px;
        }

        .mat-page-title {
          font-family: var(--font-heading);
          font-size: 28px;
          font-weight: 800;
          margin: 0;
          color: var(--text-primary);
        }

        .mat-count-badge {
          background: rgba(197, 160, 89, 0.15);
          color: var(--accent-gold);
          border: 1px solid var(--accent-gold);
          padding: 4px 14px;
          border-radius: 16px;
          font-size: 13px;
          font-weight: 700;
        }

        /* Controls Panel */
        .mat-controls-panel {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          padding: 22px;
          margin-bottom: 28px;
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .mat-search-row {
          width: 100%;
        }

        .mat-search-input {
          width: 100%;
          padding: 12px 20px;
          border-radius: 30px;
          border: 1px solid var(--border-color);
          background: var(--bg-primary);
          color: var(--text-primary);
          font-size: 14px;
          outline: none;
        }

        .mat-search-input:focus {
          border-color: var(--accent-gold);
        }

        /* Category Scroll Pills */
        .mat-category-pills-track {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding-bottom: 6px;
          scrollbar-width: thin;
        }

        .mat-category-pill {
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
          cursor: pointer;
          border: 1px solid var(--border-color);
          background: var(--bg-tertiary);
          color: var(--text-secondary);
          transition: all 0.2s ease;
        }

        .mat-category-pill.active {
          background: rgba(197, 160, 89, 0.2);
          border-color: var(--accent-gold);
          color: var(--accent-gold);
        }

        .mat-filters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
          gap: 14px;
        }

        .mat-filter-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .mat-filter-label {
          font-size: 11px;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .mat-select-control {
          padding: 9px 12px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          background: var(--bg-primary);
          color: var(--text-primary);
          font-size: 13px;
          outline: none;
          cursor: pointer;
        }

        .mat-select-control:focus {
          border-color: var(--accent-gold);
        }

        /* Material Cards Grid */
        .materials-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
          gap: 24px;
        }

        .mat-item-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease, border-color 0.3s ease;
        }

        .mat-item-card:hover {
          transform: translateY(-4px);
          border-color: var(--accent-gold);
          box-shadow: var(--shadow-md);
        }

        .mat-img-box {
          position: relative;
          width: 100%;
          height: 200px;
          overflow: hidden;
          background: #111;
        }

        .mat-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .mat-item-card:hover .mat-card-img {
          transform: scale(1.05);
        }

        .mat-category-tag {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(10, 15, 25, 0.85);
          border: 1px solid var(--accent-gold);
          color: var(--accent-gold);
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 700;
          backdrop-filter: blur(4px);
        }

        .mat-rating-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(10, 15, 25, 0.85);
          border: 1px solid #ffb703;
          color: #ffb703;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 800;
          backdrop-filter: blur(4px);
        }

        .mat-card-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .mat-supplier-line {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-secondary);
          margin-bottom: 4px;
        }

        .mat-card-title {
          font-family: var(--font-heading);
          font-size: 18px;
          font-weight: 700;
          margin: 0 0 10px;
          color: var(--text-primary);
          line-height: 1.3;
        }

        .mat-specs-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          background: var(--bg-primary);
          padding: 10px 12px;
          border-radius: 8px;
          font-size: 12px;
          margin-bottom: 14px;
          border: 1px solid var(--border-color);
        }

        .mat-price-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 16px;
        }

        .mat-price-tag {
          font-size: 22px;
          font-weight: 800;
          color: var(--accent-gold);
        }

        .mat-unit-span {
          font-size: 13px;
          color: var(--text-muted);
          font-weight: 600;
        }

        .mat-actions-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-top: auto;
        }

        .btn-mat-action {
          padding: 8px;
          font-size: 12px;
          font-weight: 700;
          border-radius: 8px;
          cursor: pointer;
          border: 1px solid var(--border-color);
          background: var(--bg-tertiary);
          color: var(--text-primary);
          transition: all 0.2s ease;
          text-align: center;
        }

        .btn-mat-action:hover {
          border-color: var(--accent-gold);
          color: var(--accent-gold);
        }

        .btn-mat-cart {
          padding: 8px;
          font-size: 12px;
          font-weight: 700;
          border-radius: 8px;
          cursor: pointer;
          border: 1px solid var(--accent-gold);
          background: rgba(197, 160, 89, 0.15);
          color: var(--accent-gold);
          transition: all 0.2s ease;
          text-align: center;
        }

        .btn-mat-cart:hover {
          background: var(--accent-gold);
          color: #000;
        }

        .btn-mat-buy {
          grid-column: span 2;
          padding: 10px;
          font-size: 13px;
          font-weight: 800;
          border-radius: 8px;
          cursor: pointer;
          border: none;
          background: linear-gradient(135deg, var(--accent-gold) 0%, #b38627 100%);
          color: #000;
          transition: transform 0.2s ease;
          text-align: center;
        }

        .btn-mat-buy:hover {
          transform: translateY(-2px);
        }

        /* Modal Backdrop */
        .mat-modal-backdrop {
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

        .mat-modal-dialog {
          background: var(--bg-secondary);
          border: 1px solid var(--accent-gold);
          border-radius: var(--border-radius-lg);
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 26px;
          box-shadow: var(--shadow-lg);
        }

        @media (max-width: 768px) {
          .mat-top-header { flex-direction: column; align-items: flex-start; }
          .mat-actions-grid { grid-template-columns: 1fr; }
          .btn-mat-buy { grid-column: auto; }
        }
      `}</style>

      {/* Top Section */}
      <div className="mat-top-header">
        <div className="mat-header-left">
          <h1 className="mat-page-title">Raw Materials Marketplace</h1>
          <span className="mat-count-badge">{filteredMaterials.length} Materials Available</span>
        </div>
      </div>

      {/* Controls Panel (Search, Categories & Filters) */}
      <div className="mat-controls-panel">
        {/* Search Input */}
        <div className="mat-search-row">
          <input 
            type="text" 
            className="mat-search-input" 
            placeholder="Search cotton yarn, silk yarn, natural dyes, jacquard cards, shuttles, reeds..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Scroll Pills */}
        <div className="mat-category-pills-track">
          {categoryPills.map(cat => (
            <button 
              key={cat} 
              className={`mat-category-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="mat-filters-grid">
          {/* Supplier Filter */}
          <div className="mat-filter-group">
            <span className="mat-filter-label">Textile Supplier</span>
            <select className="mat-select-control" value={selectedSupplier} onChange={e => setSelectedSupplier(e.target.value)}>
              <option value="All">All Suppliers</option>
              {supplierList.map(sup => (
                <option key={sup} value={sup}>{sup}</option>
              ))}
            </select>
          </div>

          {/* Price Filter */}
          <div className="mat-filter-group">
            <span className="mat-filter-label">Price Range</span>
            <select className="mat-select-control" value={selectedPriceFilter} onChange={e => setSelectedPriceFilter(e.target.value)}>
              <option value="All">All Prices</option>
              <option value="Under ₹500">Under ₹500</option>
              <option value="₹500 - ₹2000">₹500 - ₹2,000</option>
              <option value="₹2000+">₹2,000+</option>
            </select>
          </div>

          {/* Rating Filter */}
          <div className="mat-filter-group">
            <span className="mat-filter-label">Supplier Rating</span>
            <select className="mat-select-control" value={selectedRatingFilter} onChange={e => setSelectedRatingFilter(e.target.value)}>
              <option value="All">All Ratings</option>
              <option value="⭐ 4.8+">⭐ 4.8 & Above</option>
            </select>
          </div>
        </div>
      </div>

      {/* Material Cards Grid */}
      {filteredMaterials.length === 0 ? (
        <div style={{ background: 'var(--bg-secondary)', padding: '50px', borderRadius: '12px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No textile materials match your search and filter settings.
        </div>
      ) : (
        <div className="materials-cards-grid">
          {filteredMaterials.map(material => (
            <div key={material.id} className="mat-item-card">
              <div className="mat-img-box">
                <img src={material.image} alt={material.name} className="mat-card-img" />
                <span className="mat-category-tag">🧶 {material.category}</span>
                <span className="mat-rating-badge">⭐ {material.supplierRating}</span>
              </div>

              <div className="mat-card-body">
                <div className="mat-supplier-line">🏭 {material.supplierName}</div>
                <h3 className="mat-card-title">{material.name}</h3>

                <div className="mat-specs-grid">
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Stock Avail:</span><br />
                    <strong>{material.availableQuantity} {material.unit}s</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Min Order (MOQ):</span><br />
                    <strong>{material.moq}</strong>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Est. Delivery:</span> <strong>🚚 {material.deliveryTime}</strong> ({material.supplierLocation})
                  </div>
                </div>

                <div className="mat-price-row">
                  <div>
                    <span className="mat-price-tag">₹{material.price.toLocaleString()}</span>
                    <span className="mat-unit-span"> / {material.unit}</span>
                  </div>
                </div>

                <div className="mat-actions-grid">
                  <button className="btn-mat-action" onClick={() => setViewingMaterial(material)}>
                    👁️ Details
                  </button>
                  <button className="btn-mat-action" onClick={() => setContactingSupplier(material)}>
                    💬 Contact
                  </button>
                  <button className="btn-mat-cart" onClick={() => handleAddToCart(material)}>
                    🛒 Add Cart
                  </button>
                  <button className="btn-mat-buy" onClick={() => setBuyingMaterial(material)}>
                    ⚡ Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW DETAILS MODAL */}
      {viewingMaterial && (
        <div className="mat-modal-backdrop" onClick={() => setViewingMaterial(null)}>
          <div className="mat-modal-dialog" onClick={e => e.stopPropagation()}>
            <div style={{ width: '100%', height: '200px', borderRadius: '10px', overflow: 'hidden', marginBottom: '18px' }}>
              <img src={viewingMaterial.image} alt={viewingMaterial.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <span style={{ fontSize: '11px', color: 'var(--accent-gold)', fontWeight: 700, textTransform: 'uppercase' }}>{viewingMaterial.category}</span>
            <h2 style={{ margin: '4px 0 12px', fontSize: '22px', fontFamily: 'var(--font-heading)' }}>{viewingMaterial.name}</h2>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '18px', lineHeight: 1.5 }}>
              {viewingMaterial.description}
            </p>

            <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: '8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
              <div>Unit Price: <strong>₹{viewingMaterial.price.toLocaleString()} / {viewingMaterial.unit}</strong></div>
              <div>Available Stock: <strong>{viewingMaterial.availableQuantity} {viewingMaterial.unit}s</strong></div>
              <div>Minimum Order: <strong>{viewingMaterial.moq}</strong></div>
              <div>Delivery Time: <strong>{viewingMaterial.deliveryTime}</strong></div>
              <div style={{ gridColumn: 'span 2' }}>Supplier: <strong>{viewingMaterial.supplierName} (⭐ {viewingMaterial.supplierRating})</strong></div>
              <div style={{ gridColumn: 'span 2' }}>Location: <strong>📍 {viewingMaterial.supplierLocation}</strong></div>
            </div>

            <button className="btn-mat-buy" style={{ width: '100%' }} onClick={() => setViewingMaterial(null)}>
              Close Specifications
            </button>
          </div>
        </div>
      )}

      {/* CONTACT SUPPLIER MODAL */}
      {contactingSupplier && (
        <div className="mat-modal-backdrop" onClick={() => setContactingSupplier(null)}>
          <div className="mat-modal-dialog" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontFamily: 'var(--font-heading)' }}>Contact Supplier</h3>
              <button onClick={() => setContactingSupplier(null)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Sending direct inquiry to <strong>{contactingSupplier.supplierName}</strong> regarding <strong>{contactingSupplier.name}</strong>.
            </p>

            <form onSubmit={handleSendInquiry} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Estimated Quantity Required ({contactingSupplier.unit}s)</label>
                <input 
                  type="number" 
                  className="mat-select-control" 
                  value={inquiryQty}
                  onChange={e => setInquiryQty(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Inquiry Message</label>
                <textarea 
                  className="mat-select-control" 
                  rows={4} 
                  placeholder="Ask supplier about custom dye batches, bulk pricing discounts, delivery schedules..."
                  value={inquiryMsg}
                  onChange={e => setInquiryMsg(e.target.value)}
                  style={{ width: '100%', resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button type="button" className="btn-mat-action" style={{ flex: 1, padding: '10px' }} onClick={() => setContactingSupplier(null)}>Cancel</button>
                <button type="submit" className="btn-mat-buy" style={{ flex: 1, padding: '10px' }}>Send Inquiry</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BUY NOW MODAL */}
      {buyingMaterial && (
        <div className="mat-modal-backdrop" onClick={() => setBuyingMaterial(null)}>
          <div className="mat-modal-dialog" style={{ maxWidth: '420px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontFamily: 'var(--font-heading)' }}>Quick Material Order</h3>
              <button onClick={() => setBuyingMaterial(null)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ display: 'flex', gap: '12px', background: 'var(--bg-primary)', padding: '12px', borderRadius: '8px', marginBottom: '18px', border: '1px solid var(--border-color)', alignItems: 'center' }}>
              <img src={buyingMaterial.image} alt={buyingMaterial.name} style={{ width: '50px', height: '50px', borderRadius: '6px', objectFit: 'cover' }} />
              <div>
                <h4 style={{ margin: '0 0 2px', fontSize: '14px', fontWeight: 700 }}>{buyingMaterial.name}</h4>
                <span style={{ fontSize: '12px', color: 'var(--accent-gold)', fontWeight: 700 }}>₹{buyingMaterial.price.toLocaleString()} / {buyingMaterial.unit}</span>
              </div>
            </div>

            <form onSubmit={handleConfirmPurchase} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ background: 'var(--bg-primary)', padding: '12px', borderRadius: '8px', fontSize: '13px', border: '1px solid var(--border-color)' }}>
                <div>Minimum Order: <strong>{buyingMaterial.moq}</strong></div>
                <div>Supplier: <strong>{buyingMaterial.supplierName}</strong></div>
                <div>Expected Delivery: <strong>{buyingMaterial.deliveryTime}</strong></div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button type="button" className="btn-mat-action" style={{ flex: 1, padding: '10px' }} onClick={() => setBuyingMaterial(null)}>Cancel</button>
                <button type="submit" className="btn-mat-buy" style={{ flex: 1, padding: '10px' }}>Confirm Order</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RawMaterialsMarketplace;

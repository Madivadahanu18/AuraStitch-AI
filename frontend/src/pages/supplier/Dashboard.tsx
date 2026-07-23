import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';

interface OutletContextType {
  showToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

interface Supplier {
  id: string;
  name: string;
  location: string;
  state: string;
  products: string[];
  experienceYears: number;
  rating: number;
  ordersDelivered: string;
  verified: boolean;
  logo: string;
  banner: string;
  about: string;
  businessSince: string;
  gstin: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  certifications: string[];
  deliveryLocations: string[];
  reviews: { author: string; rating: number; comment: string; date: string }[];
}

interface SupplierProduct {
  id: string;
  name: string;
  supplierId: string;
  supplierName: string;
  category: string;
  price: string;
  numericPrice: number;
  rating: number;
  availability: string;
  image: string;
  description: string;
}

const mockSuppliers: Supplier[] = [
  {
    id: 'sup-1',
    name: 'Andhra Cotton Mills',
    location: 'Guntur, Andhra Pradesh',
    state: 'Andhra Pradesh',
    products: ['Premium Cotton Yarn', 'Organic Cotton', 'Cotton Thread', 'Handloom Accessories'],
    experienceYears: 22,
    rating: 4.9,
    ordersDelivered: '12,500+',
    verified: true,
    logo: '🧵',
    banner: 'https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&w=1200&q=80',
    about: 'Leading manufacturer and bulk supplier of high-count combed cotton yarn, organic cotton cones, and certified eco-friendly dyes to weavers across South India.',
    businessSince: '2004',
    gstin: '37AACCA1234F1Z9',
    contactEmail: 'orders@andhracottonmills.in',
    contactPhone: '+91 98480 12345',
    address: 'Plot 45, Industrial Estate, Guntur, AP - 522001',
    certifications: ['ISO 9001:2015', 'GOTS Organic Certified', 'Handloom Mark Authorized'],
    deliveryLocations: ['Andhra Pradesh', 'Telangana', 'Tamil Nadu', 'Karnataka', 'Maharashtra', 'Odisha'],
    reviews: [
      { author: 'Mangalagiri Weavers Co-op', rating: 5, comment: 'Highest yarn strength and zero breakage during warp preparation.', date: '12 May 2026' },
      { author: 'Pochampally Loom Guild', rating: 5, comment: 'Consistent yarn count and prompt B2B delivery every month.', date: '04 Apr 2026' }
    ]
  },
  {
    id: 'sup-2',
    name: 'Golden Silk Traders',
    location: 'Kanchipuram, Tamil Nadu',
    state: 'Tamil Nadu',
    products: ['Silk Yarn', 'Mulberry Silk', 'Premium Zari', 'Natural Dye Packs'],
    experienceYears: 18,
    rating: 4.8,
    ordersDelivered: '8,200+',
    verified: true,
    logo: '✨',
    banner: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    about: 'Specialized importers and refiners of 100% pure Mulberry Raw Silk yarn and real gold/silver Tested Zari spools for Kanchipuram and Banarasi handloom sarees.',
    businessSince: '2008',
    gstin: '33AABBG5678K1ZP',
    contactEmail: 'sales@goldensilktraders.in',
    contactPhone: '+91 94440 87654',
    address: '112 Silk Weavers Street, Kanchipuram, TN - 631501',
    certifications: ['Silk Mark India Certified', 'Tested Gold Zari Compliance', 'Bureau of Indian Standards'],
    deliveryLocations: ['Tamil Nadu', 'Karnataka', 'Telangana', 'Uttar Pradesh', 'West Bengal'],
    reviews: [
      { author: 'Kanchi Heritage Silk', rating: 5, comment: 'Genuine Silk Mark certified silk yarn. Outstanding shine and tensile strength.', date: '20 Jun 2026' },
      { author: 'Yeola Paithani Artisans', rating: 4, comment: 'Excellent Zari luster, perfect for intricate peacock borders.', date: '18 Mar 2026' }
    ]
  },
  {
    id: 'sup-3',
    name: 'Eco Threads India',
    location: 'Hyderabad, Telangana',
    state: 'Telangana',
    products: ['Natural Dyes', 'Organic Fibres', 'Linen Yarn', 'Sustainable Cotton'],
    experienceYears: 15,
    rating: 4.7,
    ordersDelivered: '6,500+',
    verified: true,
    logo: '🌿',
    banner: 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&w=1200&q=80',
    about: 'Pioneering organic plant dyes, indigo vats, madder root extracts, and GOTS-certified unbleached linen yarn for sustainable eco-friendly handloom weaving.',
    businessSince: '2011',
    gstin: '36AAACE9012J1ZX',
    contactEmail: 'support@ecothreads.in',
    contactPhone: '+91 99890 34567',
    address: 'Bio-Park Lane, Jubilee Hills, Hyderabad, TS - 500033',
    certifications: ['Global Organic Textile Standard (GOTS)', 'Zero Chemical Discharge', 'OEKO-TEX Standard 100'],
    deliveryLocations: ['Telangana', 'Andhra Pradesh', 'Kerala', 'Gujarat', 'Rajasthan', 'Delhi NCR'],
    reviews: [
      { author: 'Jaipur Block Prints', rating: 5, comment: 'Natural Indigo dyes produce rich, fast blues that do not bleed.', date: '01 Jul 2026' }
    ]
  },
  {
    id: 'sup-4',
    name: 'Resham Silk Mills',
    location: 'Bhagalpur, Bihar',
    state: 'Bihar',
    products: ['Tussar Silk Yarn', 'Eri Silk', 'Linen Blend Yarn', 'Natural Silk Waste'],
    experienceYears: 25,
    rating: 4.9,
    ordersDelivered: '14,100+',
    verified: true,
    logo: '🧶',
    banner: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
    about: 'Renowned producers of authentic Bhagalpuri Tussar and wild Eri silk yarns supplying master weaver co-operatives across Northern and Eastern India.',
    businessSince: '1999',
    gstin: '10AAACR3456N1ZB',
    contactEmail: 'contact@reshamsilkmills.com',
    contactPhone: '+91 93040 11223',
    address: 'Silk City Road, Bhagalpur, Bihar - 812001',
    certifications: ['Silk Mark Certified', 'Handloom Export Promotion Council', 'ISO 9001'],
    deliveryLocations: ['Bihar', 'West Bengal', 'Assam', 'Odisha', 'Jharkhand', 'Uttar Pradesh'],
    reviews: [
      { author: 'Chanderi Weavers Guild', rating: 5, comment: 'Premium raw Tussar silk slub textures.', date: '15 May 2026' }
    ]
  }
];

const mockSupplierProducts: SupplierProduct[] = [
  {
    id: 'sp-1',
    name: 'Premium 80s Count Combed Cotton Yarn',
    supplierId: 'sup-1',
    supplierName: 'Andhra Cotton Mills',
    category: 'Cotton Yarn',
    price: '₹450 / kg',
    numericPrice: 450,
    rating: 4.9,
    availability: 'In Stock',
    image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=500&q=80',
    description: '80s high-count combed cotton yarn for fine Mangalagiri and Jamdani weaving.'
  },
  {
    id: 'sp-2',
    name: 'Mulberry Raw Silk Yarn (Grade AAAA)',
    supplierId: 'sup-2',
    supplierName: 'Golden Silk Traders',
    category: 'Silk Yarn',
    price: '₹3,200 / kg',
    numericPrice: 3200,
    rating: 4.8,
    availability: 'In Stock',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=500&q=80',
    description: '100% pure Mulberry silk yarn for heavy Kanchipuram and Pochampally silk sarees.'
  },
  {
    id: 'sp-3',
    name: 'Organic Plant Dye Powder Starter Pack',
    supplierId: 'sup-3',
    supplierName: 'Eco Threads India',
    category: 'Natural Dyes',
    price: '₹850 / set',
    numericPrice: 850,
    rating: 4.7,
    availability: 'In Stock',
    image: 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&w=500&q=80',
    description: 'Indigo, Madder Root, Turmeric and Pomegranate peel natural dye extracts.'
  },
  {
    id: 'sp-4',
    name: 'Tested Golden Zari Thread Spool (250g)',
    supplierId: 'sup-2',
    supplierName: 'Golden Silk Traders',
    category: 'Premium Zari',
    price: '₹1,400 / spool',
    numericPrice: 1400,
    rating: 4.9,
    availability: 'In Stock',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=500&q=80',
    description: 'Fine metallic zari wire wrapped over silk core for rich traditional borders.'
  },
  {
    id: 'sp-5',
    name: 'Unbleached Organic Linen Fabric Roll',
    supplierId: 'sup-3',
    supplierName: 'Eco Threads India',
    category: 'Linen Roll',
    price: '₹650 / meter',
    numericPrice: 650,
    rating: 4.8,
    availability: 'In Stock',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=500&q=80',
    description: 'Pure European flax linen yarn rolls ready for handloom warping.'
  },
  {
    id: 'sp-6',
    name: 'High Strength Cotton Yarn Cones (Pack of 6)',
    supplierId: 'sup-1',
    supplierName: 'Andhra Cotton Mills',
    category: 'Cotton Yarn',
    price: '₹1,920 / pack',
    numericPrice: 1920,
    rating: 4.9,
    availability: 'In Stock',
    image: 'https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&w=500&q=80',
    description: 'Precision-wound yarn cones compatible with automatic pirn winders and pit looms.'
  },
  {
    id: 'sp-7',
    name: 'Handloom Weaving Shuttles & Reed Set',
    supplierId: 'sup-1',
    supplierName: 'Andhra Cotton Mills',
    category: 'Handloom Accessories',
    price: '₹1,250 / set',
    numericPrice: 1250,
    rating: 4.8,
    availability: 'In Stock',
    image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=500&q=80',
    description: 'Polished teakwood flying shuttles and stainless steel reed combs for weavers.'
  },
  {
    id: 'sp-8',
    name: 'Pure Tussar Raw Silk Skeins',
    supplierId: 'sup-4',
    supplierName: 'Resham Silk Mills',
    category: 'Silk Yarn',
    price: '₹2,800 / kg',
    numericPrice: 2800,
    rating: 4.9,
    availability: 'In Stock',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=500&q=80',
    description: 'Hand-reeled natural golden Tussar silk skeins from Bhagalpur.'
  }
];

export const SupplierDashboard: React.FC = () => {
  const context = useOutletContext<OutletContextType | null>();
  const showToast = (msg: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    if (context?.showToast) context.showToast(msg, type);
    else alert(msg);
  };

  // State Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedMaterialType, setSelectedMaterialType] = useState('All');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [selectedPriceRange, setSelectedPriceRange] = useState('All');
  const [selectedRating, setSelectedRating] = useState('All');
  const [selectedExperience, setSelectedExperience] = useState('All');

  // Supplier Detail Drawer State
  const [activeSupplierProfile, setActiveSupplierProfile] = useState<Supplier | null>(null);

  // Filtered Suppliers
  const filteredSuppliers = useMemo(() => {
    return mockSuppliers.filter(sup => {
      // Search
      const matchesSearch = !searchQuery || 
        sup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sup.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sup.products.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()));

      // Location
      const matchesLocation = selectedLocation === 'All' || sup.state === selectedLocation;

      // Material Type
      const matchesMaterial = selectedMaterialType === 'All' || 
        sup.products.some(p => p.toLowerCase().includes(selectedMaterialType.toLowerCase()));

      // Verified
      const matchesVerified = !verifiedOnly || sup.verified;

      // Rating
      const matchesRating = selectedRating === 'All' || 
        (selectedRating === '4.5+' && sup.rating >= 4.5) ||
        (selectedRating === '4.8+' && sup.rating >= 4.8);

      // Experience
      const matchesExperience = selectedExperience === 'All' || 
        (selectedExperience === '10+' && sup.experienceYears >= 10) ||
        (selectedExperience === '20+' && sup.experienceYears >= 20);

      return matchesSearch && matchesLocation && matchesMaterial && matchesVerified && matchesRating && matchesExperience;
    });
  }, [searchQuery, selectedLocation, selectedMaterialType, verifiedOnly, selectedRating, selectedExperience]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return mockSupplierProducts.filter(prod => {
      const matchesSearch = !searchQuery || 
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'All' || prod.category === selectedCategory;

      const matchesPrice = selectedPriceRange === 'All' ||
        (selectedPriceRange === 'Under ₹1000' && prod.numericPrice < 1000) ||
        (selectedPriceRange === '₹1000 - ₹5000' && prod.numericPrice >= 1000 && prod.numericPrice <= 5000) ||
        (selectedPriceRange === '₹5000+' && prod.numericPrice > 5000);

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [searchQuery, selectedCategory, selectedPriceRange]);

  const handleContactSupplier = (supplierName: string) => {
    showToast(`Inquiry sent to ${supplierName}! Their B2B manager will contact you directly.`, "success");
  };

  const handleAddToWishlist = (productName: string) => {
    showToast(`Added "${productName}" to Raw Material Wishlist!`, "info");
  };

  return (
    <div className="supplier-marketplace-container fade-in" style={{ padding: '24px', paddingBottom: '90px', maxWidth: '1240px', margin: '0 auto' }}>
      <style>{`
        .supplier-marketplace-container {
          color: var(--text-primary);
        }

        .supplier-hero-header {
          background: linear-gradient(135deg, rgba(26, 35, 60, 0.9) 0%, rgba(10, 15, 25, 0.95) 100%),
                      url('https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=1400&q=80') center/cover no-repeat;
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          padding: 40px;
          color: #FFFFFF;
          margin-bottom: 30px;
          box-shadow: var(--shadow-md);
        }

        .supplier-hero-title {
          font-family: var(--font-heading);
          font-size: 34px;
          font-weight: 800;
          margin-bottom: 10px;
          color: #FFFFFF;
        }

        .supplier-hero-subtitle {
          font-size: 15px;
          color: rgba(255, 255, 255, 0.85);
          max-width: 680px;
          line-height: 1.5;
        }

        /* Search & Filter Bar */
        .marketplace-control-panel {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          padding: 24px;
          margin-bottom: 36px;
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .search-input-wrapper {
          display: flex;
          gap: 12px;
          width: 100%;
        }

        .supplier-search-input {
          flex: 1;
          padding: 14px 20px;
          border-radius: 30px;
          border: 1px solid var(--border-color);
          background: var(--bg-primary);
          color: var(--text-primary);
          font-size: 15px;
          outline: none;
        }

        .supplier-search-input:focus {
          border-color: var(--accent-gold);
        }

        .filter-row-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 14px;
          align-items: center;
        }

        .filter-select-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .filter-label {
          font-size: 11px;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .filter-dropdown {
          padding: 9px 12px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          background: var(--bg-primary);
          color: var(--text-primary);
          font-size: 13px;
          outline: none;
          cursor: pointer;
        }

        .filter-dropdown:focus {
          border-color: var(--accent-gold);
        }

        .categories-chips-scroll {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding-bottom: 8px;
        }

        .category-chip {
          padding: 8px 16px;
          border-radius: 20px;
          border: 1px solid var(--border-color);
          background: var(--bg-primary);
          color: var(--text-secondary);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s ease;
        }

        .category-chip.active, .category-chip:hover {
          border-color: var(--accent-gold);
          color: var(--accent-gold);
          background: var(--bg-tertiary);
        }

        /* Supplier Cards Grid */
        .suppliers-marketplace-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 24px;
          margin-bottom: 50px;
        }

        .supplier-marketplace-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          box-shadow: var(--shadow-sm);
          transition: transform 0.2s ease, border-color 0.2s ease;
        }

        .supplier-marketplace-card:hover {
          transform: translateY(-4px);
          border-color: var(--accent-gold);
          box-shadow: var(--shadow-md);
        }

        .sup-logo-badge {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: var(--bg-primary);
          border: 2px solid var(--accent-gold);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
        }

        .sup-header-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sup-name-title {
          font-size: 18px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 2px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .sup-location-text {
          font-size: 12px;
          color: var(--text-secondary);
        }

        .sup-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          background: var(--bg-primary);
          padding: 12px;
          border-radius: 8px;
          text-align: center;
          font-size: 12px;
          border: 1px solid var(--border-color);
        }

        .sup-stats-grid strong {
          display: block;
          font-size: 14px;
          color: var(--text-primary);
          font-weight: 700;
          margin-top: 2px;
        }

        .sup-products-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .sup-tag {
          font-size: 11px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          padding: 3px 10px;
          border-radius: 12px;
          color: var(--text-secondary);
        }

        /* Products Grid */
        .supplier-products-grid-full {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }

        .supplier-product-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-sm);
          transition: transform 0.2s ease, border-color 0.2s ease;
        }

        .supplier-product-card:hover {
          transform: translateY(-4px);
          border-color: var(--accent-gold);
          box-shadow: var(--shadow-md);
        }

        .prod-img-box {
          position: relative;
          width: 100%;
          height: 200px;
          overflow: hidden;
          background: #111;
        }

        .prod-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .prod-body-box {
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          flex: 1;
        }

        /* Supplier Modal Profile */
        .profile-modal-backdrop {
          position: fixed;
          top: 0; left: 0; width: 100vw; height: 100vh;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(6px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          padding: 20px;
        }

        .profile-modal-container {
          background: var(--bg-secondary);
          border: 1px solid var(--accent-gold);
          border-radius: var(--border-radius-lg);
          width: 100%;
          max-width: 780px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: var(--shadow-lg);
          position: relative;
        }

        .profile-banner-header {
          position: relative;
          width: 100%;
          height: 220px;
          overflow: hidden;
        }

        .profile-banner-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .profile-banner-overlay {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background: linear-gradient(to top, rgba(15, 20, 30, 0.9) 0%, transparent 60%);
        }

        .profile-body-padding {
          padding: 28px;
        }

        @media (max-width: 768px) {
          .supplier-hero-header { padding: 24px; }
          .supplier-hero-title { font-size: 26px; }
          .suppliers-marketplace-grid { grid-template-columns: 1fr; }
          .filter-row-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      {/* Hero Header */}
      <div className="supplier-hero-header">
        <h1 className="supplier-hero-title">Handloom Raw Material Marketplace</h1>
        <p className="supplier-hero-subtitle">
          Connect directly with verified raw material suppliers for high-count cotton yarn, Mulberry silk, pure metallic zari, organic natural dyes, and weaving equipment.
        </p>
      </div>

      {/* Control Panel / Search & Filters */}
      <div className="marketplace-control-panel">
        {/* Search */}
        <div className="search-input-wrapper">
          <input 
            type="text" 
            className="supplier-search-input" 
            placeholder="Search by supplier name, yarn material, location or product..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Chips */}
        <div className="categories-chips-scroll">
          {['All', 'Cotton Yarn', 'Silk Yarn', 'Premium Zari', 'Natural Dyes', 'Linen Roll', 'Handloom Accessories'].map(cat => (
            <button 
              key={cat} 
              className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filter Dropdowns */}
        <div className="filter-row-grid">
          <div className="filter-select-group">
            <span className="filter-label">📍 State / Location</span>
            <select className="filter-dropdown" value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
              <option value="All">All Locations</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Telangana">Telangana</option>
              <option value="Bihar">Bihar</option>
            </select>
          </div>

          <div className="filter-select-group">
            <span className="filter-label">🧶 Material Type</span>
            <select className="filter-dropdown" value={selectedMaterialType} onChange={(e) => setSelectedMaterialType(e.target.value)}>
              <option value="All">All Materials</option>
              <option value="Cotton">Cotton</option>
              <option value="Silk">Silk</option>
              <option value="Zari">Zari</option>
              <option value="Dyes">Natural Dyes</option>
              <option value="Linen">Linen</option>
            </select>
          </div>

          <div className="filter-select-group">
            <span className="filter-label">💵 Price Range</span>
            <select className="filter-dropdown" value={selectedPriceRange} onChange={(e) => setSelectedPriceRange(e.target.value)}>
              <option value="All">All Prices</option>
              <option value="Under ₹1000">Under ₹1,000</option>
              <option value="₹1000 - ₹5000">₹1,000 - ₹5,000</option>
              <option value="₹5000+">₹5,000+</option>
            </select>
          </div>

          <div className="filter-select-group">
            <span className="filter-label">⭐ Min Rating</span>
            <select className="filter-dropdown" value={selectedRating} onChange={(e) => setSelectedRating(e.target.value)}>
              <option value="All">All Ratings</option>
              <option value="4.5+">4.5+ Rating</option>
              <option value="4.8+">4.8+ Rating</option>
            </select>
          </div>

          <div className="filter-select-group">
            <span className="filter-label">🏛️ Experience</span>
            <select className="filter-dropdown" value={selectedExperience} onChange={(e) => setSelectedExperience(e.target.value)}>
              <option value="All">All Experience</option>
              <option value="10+">10+ Years</option>
              <option value="20+">20+ Years</option>
            </select>
          </div>

          <div className="filter-select-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '8px', paddingTop: '16px' }}>
            <input 
              type="checkbox" 
              id="verified-checkbox" 
              checked={verifiedOnly} 
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              style={{ cursor: 'pointer', width: '16px', height: '16px' }}
            />
            <label htmlFor="verified-checkbox" style={{ fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
              Verified Only ✓
            </label>
          </div>
        </div>
      </div>

      {/* Featured Suppliers Section */}
      <div style={{ marginBottom: '50px' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          🏛️ Verified Raw Material Suppliers ({filteredSuppliers.length})
        </h2>

        {filteredSuppliers.length === 0 ? (
          <div style={{ background: 'var(--bg-secondary)', padding: '40px', borderRadius: '12px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No suppliers match your current filter parameters.
          </div>
        ) : (
          <div className="suppliers-marketplace-grid">
            {filteredSuppliers.map(supplier => (
              <div key={supplier.id} className="supplier-marketplace-card">
                <div className="sup-header-info">
                  <div className="sup-logo-badge">{supplier.logo}</div>
                  <div>
                    <div className="sup-name-title">
                      {supplier.name}
                      {supplier.verified && <span style={{ fontSize: '11px', color: '#2a9d8f', background: 'rgba(42, 157, 143, 0.15)', padding: '2px 6px', borderRadius: '10px' }}>✓ Verified</span>}
                    </div>
                    <div className="sup-location-text">📍 {supplier.location}</div>
                  </div>
                </div>

                <div className="sup-stats-grid">
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Experience</span>
                    <strong>{supplier.experienceYears} Yrs</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Rating</span>
                    <strong>★ {supplier.rating}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Orders</span>
                    <strong>{supplier.ordersDelivered}</strong>
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', fontWeight: 700 }}>
                    SUPPLIED MATERIALS:
                  </span>
                  <div className="sup-products-tags">
                    {supplier.products.map(p => (
                      <span key={p} className="sup-tag">{p}</span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: 'auto' }}>
                  <button className="btn-secondary" style={{ padding: '9px', fontSize: '13px' }} onClick={() => setActiveSupplierProfile(supplier)}>
                    View Products
                  </button>
                  <button className="btn-primary" style={{ padding: '9px', fontSize: '13px' }} onClick={() => handleContactSupplier(supplier.name)}>
                    Contact Supplier
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Supplier Products Grid Section */}
      <div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          🧶 Raw Material Products Marketplace ({filteredProducts.length})
        </h2>

        <div className="supplier-products-grid-full">
          {filteredProducts.map(prod => (
            <div key={prod.id} className="supplier-product-card">
              <div className="prod-img-box">
                <img src={prod.image} alt={prod.name} className="prod-img" />
              </div>

              <div className="prod-body-box">
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-gold)' }}>{prod.supplierName}</div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, lineHeight: 1.3 }}>{prod.name}</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>{prod.description}</p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '8px' }}>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>{prod.price}</span>
                  <span style={{ fontSize: '12px', color: '#ffb703', fontWeight: 700 }}>⭐ {prod.rating}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px' }}>
                  <button className="btn-secondary" style={{ padding: '7px', fontSize: '11px' }} onClick={() => handleAddToWishlist(prod.name)}>
                    ♥ Wishlist
                  </button>
                  <button className="btn-primary" style={{ padding: '7px', fontSize: '11px' }} onClick={() => handleContactSupplier(prod.supplierName)}>
                    Contact
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Supplier Profile Modal */}
      {activeSupplierProfile && (
        <div className="profile-modal-backdrop" onClick={() => setActiveSupplierProfile(null)}>
          <div className="profile-modal-container" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setActiveSupplierProfile(null)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.6)', border: '1px solid #fff', borderRadius: '50%', width: '32px', height: '32px', color: '#fff', fontSize: '18px', cursor: 'pointer', zIndex: 20 }}
            >
              ✕
            </button>

            <div className="profile-banner-header">
              <img src={activeSupplierProfile.banner} alt={activeSupplierProfile.name} className="profile-banner-img" />
              <div className="profile-banner-overlay" />
              <div style={{ position: 'absolute', bottom: '20px', left: '24px', display: 'flex', alignItems: 'center', gap: '14px', zIndex: 10 }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--bg-primary)', border: '2px solid var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>
                  {activeSupplierProfile.logo}
                </div>
                <div style={{ color: '#fff' }}>
                  <h2 style={{ margin: 0, fontSize: '24px', fontFamily: 'var(--font-heading)' }}>
                    {activeSupplierProfile.name} {activeSupplierProfile.verified && <span style={{ fontSize: '12px', color: '#2a9d8f', background: 'rgba(42, 157, 143, 0.25)', padding: '2px 8px', borderRadius: '10px' }}>✓ Verified Supplier</span>}
                  </h2>
                  <span style={{ fontSize: '13px', opacity: 0.9 }}>📍 {activeSupplierProfile.location} • Business Since {activeSupplierProfile.businessSince}</span>
                </div>
              </div>
            </div>

            <div className="profile-body-padding">
              {/* About Supplier */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px', color: 'var(--accent-gold)' }}>About Supplier</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  {activeSupplierProfile.about}
                </p>
              </div>

              {/* Stats & GSTIN */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', background: 'var(--bg-primary)', padding: '16px', borderRadius: '8px', marginBottom: '24px', border: '1px solid var(--border-color)' }}>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>GSTIN Registration</span>
                  <strong style={{ display: 'block', fontSize: '13px' }}>{activeSupplierProfile.gstin}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Years of Experience</span>
                  <strong style={{ display: 'block', fontSize: '13px' }}>{activeSupplierProfile.experienceYears} Years</strong>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Orders Completed</span>
                  <strong style={{ display: 'block', fontSize: '13px' }}>{activeSupplierProfile.ordersDelivered}</strong>
                </div>
              </div>

              {/* Products Offered */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '10px', color: 'var(--text-primary)' }}>Products Offered</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {activeSupplierProfile.products.map(p => (
                    <span key={p} style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', padding: '6px 14px', borderRadius: '16px', fontSize: '13px', fontWeight: 600 }}>
                      🧶 {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '10px', color: 'var(--text-primary)' }}>Certifications & Compliance</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {activeSupplierProfile.certifications.map(c => (
                    <span key={c} style={{ background: 'rgba(42, 157, 143, 0.1)', border: '1px solid #2a9d8f', color: '#2a9d8f', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700 }}>
                      🛡️ {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Delivery Locations */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>Pan-India Delivery States</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                  🚚 {activeSupplierProfile.deliveryLocations.join(', ')}
                </p>
              </div>

              {/* Contact Information */}
              <div style={{ background: 'var(--bg-primary)', padding: '18px', borderRadius: '10px', border: '1px solid var(--border-color)', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '10px', color: 'var(--accent-gold)' }}>B2B Contact Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                  <div><strong>Email:</strong> {activeSupplierProfile.contactEmail}</div>
                  <div><strong>Phone:</strong> {activeSupplierProfile.contactPhone}</div>
                  <div style={{ gridColumn: 'span 2' }}><strong>Warehouse:</strong> {activeSupplierProfile.address}</div>
                </div>
              </div>

              {/* Customer Reviews */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>Weaver Reviews & Ratings</h3>
                {activeSupplierProfile.reviews.map((r, i) => (
                  <div key={i} style={{ background: 'var(--bg-primary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '8px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <strong>{r.author}</strong>
                      <span style={{ color: '#ffb703' }}>{'★'.repeat(r.rating)}</span>
                    </div>
                    <p style={{ margin: 0, color: 'var(--text-secondary)' }}>"{r.comment}"</p>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn-secondary" style={{ flex: 1, padding: '12px' }} onClick={() => setActiveSupplierProfile(null)}>
                  Close Profile
                </button>
                <button className="btn-primary" style={{ flex: 1, padding: '12px' }} onClick={() => { setActiveSupplierProfile(null); handleContactSupplier(activeSupplierProfile.name); }}>
                  Contact Supplier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierDashboard;

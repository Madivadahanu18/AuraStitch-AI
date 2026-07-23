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

interface Product {
  id: string;
  name: string;
  clothType: string;
  fabricMaterial: string;
  weavingTechnique: string;
  category: string;
  stateOfOrigin: string;
  price: number;
  originalPrice?: number;
  discount: number;
  availableStock: number;
  availabilityStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
  unitsSold: number;
  rating: number;
  totalReviews: number;
  lastUpdated: string;
  image: string;
}

// Helper to ensure Vite resolves imported local image assets into URL strings
const getImageSrc = (img: any): string => {
  if (!img) return '';
  if (typeof img === 'string') return img;
  if (typeof img === 'object' && 'default' in img) return (img as any).default;
  return String(img);
};

const initialProducts: Product[] = [
  {
    id: 'p-1',
    name: 'Pochampally Ikat Saree',
    clothType: 'Saree',
    fabricMaterial: 'Pure Mulberry Silk',
    weavingTechnique: 'Double Ikat Handloom',
    category: 'Wedding',
    stateOfOrigin: 'Telangana',
    price: 4850,
    originalPrice: 5600,
    discount: 13,
    availableStock: 45,
    availabilityStatus: 'In Stock',
    unitsSold: 1250,
    rating: 4.8,
    totalReviews: 324,
    lastUpdated: '23 Jul 2026',
    image: getImageSrc(pochampallyImg)
  },
  {
    id: 'p-2',
    name: 'Mangalagiri Cotton Saree',
    clothType: 'Saree',
    fabricMaterial: '80s Count Combed Cotton',
    weavingTechnique: 'Nizam Zari Border',
    category: 'Traditional',
    stateOfOrigin: 'Andhra Pradesh',
    price: 2450,
    originalPrice: 2950,
    discount: 17,
    availableStock: 28,
    availabilityStatus: 'In Stock',
    unitsSold: 980,
    rating: 4.7,
    totalReviews: 210,
    lastUpdated: '21 Jul 2026',
    image: getImageSrc(cottonSareesImg)
  },
  {
    id: 'p-3',
    name: 'Venkatagiri Zari Saree',
    clothType: 'Saree',
    fabricMaterial: 'Fine Cotton Silk',
    weavingTechnique: 'Jamdani Motif Weave',
    category: 'Festival',
    stateOfOrigin: 'Andhra Pradesh',
    price: 3600,
    originalPrice: 4400,
    discount: 18,
    availableStock: 6,
    availabilityStatus: 'Low Stock',
    unitsSold: 830,
    rating: 4.8,
    totalReviews: 198,
    lastUpdated: '22 Jul 2026',
    image: getImageSrc(mangalagiriDressImg)
  },
  {
    id: 'p-4',
    name: 'Gadwal Silk Saree',
    clothType: 'Saree',
    fabricMaterial: 'Cotton Body with Silk Border',
    weavingTechnique: 'Kutni Interlocked Weave',
    category: 'Traditional',
    stateOfOrigin: 'Telangana',
    price: 4200,
    originalPrice: 5000,
    discount: 16,
    availableStock: 15,
    availabilityStatus: 'In Stock',
    unitsSold: 740,
    rating: 4.8,
    totalReviews: 185,
    lastUpdated: '19 Jul 2026',
    image: getImageSrc(pattuSareeImg)
  },
  {
    id: 'p-5',
    name: 'Uppada Pure Silk Saree',
    clothType: 'Saree',
    fabricMaterial: 'Pure Jamdani Silk',
    weavingTechnique: 'Handwoven Jamdani Zari',
    category: 'Wedding',
    stateOfOrigin: 'Andhra Pradesh',
    price: 12450,
    originalPrice: 14800,
    discount: 16,
    availableStock: 12,
    availabilityStatus: 'In Stock',
    unitsSold: 1890,
    rating: 4.9,
    totalReviews: 640,
    lastUpdated: '23 Jul 2026',
    image: getImageSrc(pattuSareeImg)
  },
  {
    id: 'p-6',
    name: 'Traditional Handwoven Dhoti',
    clothType: 'Dhoti',
    fabricMaterial: '100% Organic Cotton',
    weavingTechnique: 'Fine Gold Zari Border',
    category: 'Casual',
    stateOfOrigin: 'Kerala',
    price: 1450,
    originalPrice: 1800,
    discount: 19,
    availableStock: 50,
    availabilityStatus: 'In Stock',
    unitsSold: 680,
    rating: 4.6,
    totalReviews: 145,
    lastUpdated: '20 Jul 2026',
    image: getImageSrc(dhotiImg)
  },
  {
    id: 'p-7',
    name: 'Handloom Dress Material',
    clothType: 'Handloom Dress Material',
    fabricMaterial: 'Khadi Linen Cotton',
    weavingTechnique: 'Hand-Dyed Weave',
    category: 'Casual',
    stateOfOrigin: 'West Bengal',
    price: 1850,
    originalPrice: 2300,
    discount: 19,
    availableStock: 0,
    availabilityStatus: 'Out of Stock',
    unitsSold: 820,
    rating: 4.7,
    totalReviews: 176,
    lastUpdated: '18 Jul 2026',
    image: getImageSrc(mangalagiriDressImg)
  }
];

export const Products: React.FC = () => {
  const context = useOutletContext<OutletContextType | null>();
  const showToast = (msg: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    if (context?.showToast) context.showToast(msg, type);
    else alert(msg);
  };

  const [products, setProducts] = useState<Product[]>(initialProducts);

  // Filters & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClothType, setSelectedClothType] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedAvailability, setSelectedAvailability] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState('All');
  const [sortBy, setSortBy] = useState('recently_added');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  // New Product Form State
  const [newProdName, setNewProdName] = useState('');
  const [newClothType, setNewClothType] = useState('Saree');
  const [newFabric, setNewFabric] = useState('Pure Cotton');
  const [newTechnique, setNewTechnique] = useState('Handloom Weave');
  const [newCategory, setNewCategory] = useState('Traditional');
  const [newState, setNewState] = useState('Telangana');
  const [newPrice, setNewPrice] = useState<number>(2500);
  const [newOrigPrice, setNewOrigPrice] = useState<number>(3000);
  const [newStock, setNewStock] = useState<number>(20);

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    let result = products.filter(p => {
      // Search
      const matchesSearch = !searchQuery || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.clothType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.stateOfOrigin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.weavingTechnique.toLowerCase().includes(searchQuery.toLowerCase());

      // Cloth Type
      const matchesCloth = selectedClothType === 'All' || p.clothType === selectedClothType;

      // Category
      const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;

      // State
      const matchesSt = selectedState === 'All' || p.stateOfOrigin === selectedState;

      // Availability
      const matchesAvail = selectedAvailability === 'All' || p.availabilityStatus === selectedAvailability;

      // Price Range
      const matchesPrice = selectedPriceRange === 'All' ||
        (selectedPriceRange === 'Under ₹2000' && p.price < 2000) ||
        (selectedPriceRange === '₹2000 - ₹5000' && p.price >= 2000 && p.price <= 5000) ||
        (selectedPriceRange === '₹5000+' && p.price > 5000);

      return matchesSearch && matchesCloth && matchesCat && matchesSt && matchesAvail && matchesPrice;
    });

    // Sort
    return result.sort((a, b) => {
      if (sortBy === 'price_low_high') return a.price - b.price;
      if (sortBy === 'price_high_low') return b.price - a.price;
      if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
      if (sortBy === 'rating_high') return b.rating - a.rating;
      if (sortBy === 'best_selling') return b.unitsSold - a.unitsSold;
      return b.id.localeCompare(a.id); // recently added / default
    });
  }, [products, searchQuery, selectedClothType, selectedCategory, selectedState, selectedAvailability, selectedPriceRange, sortBy]);

  // Add Product Handler
  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    const discountCalc = newOrigPrice > newPrice ? Math.round(((newOrigPrice - newPrice) / newOrigPrice) * 100) : 0;
    const statusCalc = newStock === 0 ? 'Out of Stock' : newStock <= 10 ? 'Low Stock' : 'In Stock';

    const newProductItem: Product = {
      id: `p-${Date.now()}`,
      name: newProdName.trim(),
      clothType: newClothType,
      fabricMaterial: newFabric,
      weavingTechnique: newTechnique,
      category: newCategory,
      stateOfOrigin: newState,
      price: newPrice,
      originalPrice: newOrigPrice > 0 ? newOrigPrice : undefined,
      discount: discountCalc,
      availableStock: newStock,
      availabilityStatus: statusCalc,
      unitsSold: 0,
      rating: 5.0,
      totalReviews: 0,
      lastUpdated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      image: getImageSrc(pochampallyImg)
    };

    setProducts([newProductItem, ...products]);
    showToast(`Added new product "${newProductItem.name}" to inventory!`, "success");
    setShowAddModal(false);

    // Reset Form
    setNewProdName('');
    setNewPrice(2500);
    setNewOrigPrice(3000);
    setNewStock(20);
  };

  // Save Edit Handler
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const updated = products.map(p => {
      if (p.id === editingProduct.id) {
        const statusCalc = editingProduct.availableStock === 0 ? 'Out of Stock' : editingProduct.availableStock <= 10 ? 'Low Stock' : 'In Stock';
        return {
          ...editingProduct,
          availabilityStatus: statusCalc,
          lastUpdated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        };
      }
      return p;
    });

    setProducts(updated);
    showToast(`Successfully updated "${editingProduct.name}"!`, "success");
    setEditingProduct(null);
  };

  // Confirm Delete Handler
  const handleConfirmDelete = () => {
    if (!deletingProduct) return;

    setProducts(products.filter(p => p.id !== deletingProduct.id));
    showToast(`Deleted "${deletingProduct.name}" from catalog.`, "info");
    setDeletingProduct(null);
  };

  return (
    <div className="handloom-products-container fade-in" style={{ padding: '24px', paddingBottom: '90px', maxWidth: '1240px', margin: '0 auto', color: 'var(--text-primary)' }}>
      <style>{`
        .top-header-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .header-title-box {
          display: flex;
          align-items: baseline;
          gap: 14px;
        }

        .page-main-title {
          font-family: var(--font-heading);
          font-size: 28px;
          font-weight: 800;
          margin: 0;
          color: var(--text-primary);
        }

        .count-pill {
          background: rgba(197, 160, 89, 0.15);
          color: var(--accent-gold);
          border: 1px solid var(--accent-gold);
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 13px;
          font-weight: 700;
        }

        /* Controls Panel */
        .controls-panel-box {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          padding: 22px;
          margin-bottom: 32px;
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .search-add-row {
          display: flex;
          gap: 14px;
          align-items: center;
          width: 100%;
        }

        .search-bar-input {
          flex: 1;
          padding: 12px 20px;
          border-radius: 30px;
          border: 1px solid var(--border-color);
          background: var(--bg-primary);
          color: var(--text-primary);
          font-size: 14px;
          outline: none;
        }

        .search-bar-input:focus {
          border-color: var(--accent-gold);
        }

        .btn-add-product {
          padding: 12px 24px;
          border-radius: 30px;
          background: linear-gradient(135deg, var(--accent-gold) 0%, #b38627 100%);
          color: #000;
          font-weight: 700;
          font-size: 14px;
          border: none;
          cursor: pointer;
          white-space: nowrap;
          box-shadow: var(--shadow-sm);
          transition: transform 0.2s ease;
        }

        .btn-add-product:hover {
          transform: translateY(-2px);
        }

        .filters-sort-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
          gap: 12px;
        }

        .filter-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .filter-item-label {
          font-size: 11px;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .select-input-control {
          padding: 9px 12px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          background: var(--bg-primary);
          color: var(--text-primary);
          font-size: 13px;
          outline: none;
          cursor: pointer;
        }

        .select-input-control:focus {
          border-color: var(--accent-gold);
        }

        /* Products Card Grid */
        .products-card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
          gap: 24px;
        }

        .product-item-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease, border-color 0.3s ease;
        }

        .product-item-card:hover {
          transform: translateY(-4px);
          border-color: var(--accent-gold);
          box-shadow: var(--shadow-md);
        }

        .card-img-box {
          position: relative;
          width: 100%;
          height: 240px;
          background: #111;
          overflow: hidden;
        }

        .card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .product-item-card:hover .card-img {
          transform: scale(1.04);
        }

        .badge-origin {
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

        .badge-status {
          position: absolute;
          top: 12px;
          right: 12px;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 800;
          backdrop-filter: blur(4px);
        }

        .badge-status.In-Stock {
          background: rgba(42, 157, 143, 0.2);
          border: 1px solid #2a9d8f;
          color: #2a9d8f;
        }

        .badge-status.Low-Stock {
          background: rgba(244, 162, 97, 0.2);
          border: 1px solid #f4a261;
          color: #f4a261;
        }

        .badge-status.Out-of-Stock {
          background: rgba(230, 57, 70, 0.2);
          border: 1px solid #e63946;
          color: #e63946;
        }

        .card-content-box {
          padding: 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .card-type-tag {
          font-size: 11px;
          font-weight: 700;
          color: var(--accent-gold);
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 4px;
        }

        .card-title {
          font-family: var(--font-heading);
          font-size: 18px;
          font-weight: 700;
          margin: 0 0 6px;
          color: var(--text-primary);
          line-height: 1.3;
        }

        .card-spec-line {
          font-size: 12px;
          color: var(--text-secondary);
          margin-bottom: 12px;
          line-height: 1.4;
        }

        .card-metrics-grid {
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

        .price-discount-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 16px;
        }

        .price-main {
          font-size: 22px;
          font-weight: 800;
          color: var(--text-primary);
        }

        .price-old {
          font-size: 13px;
          color: var(--text-muted);
          text-decoration: line-through;
          margin-left: 6px;
        }

        .disc-tag {
          background: rgba(230, 57, 70, 0.15);
          color: #e63946;
          font-size: 11px;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 6px;
        }

        .card-actions-row {
          display: grid;
          grid-template-columns: 1fr 1fr auto;
          gap: 8px;
          margin-top: auto;
        }

        .btn-card-action {
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

        .btn-card-action:hover {
          border-color: var(--accent-gold);
          color: var(--accent-gold);
        }

        .btn-card-delete {
          padding: 8px 12px;
          font-size: 12px;
          font-weight: 700;
          border-radius: 8px;
          cursor: pointer;
          border: 1px solid #e63946;
          background: rgba(230, 57, 70, 0.1);
          color: #e63946;
          transition: all 0.2s ease;
        }

        .btn-card-delete:hover {
          background: #e63946;
          color: #fff;
        }

        /* Modal Overlays */
        .modal-overlay-backdrop {
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

        .modal-dialog-box {
          background: var(--bg-secondary);
          border: 1px solid var(--accent-gold);
          border-radius: var(--border-radius-lg);
          width: 100%;
          max-width: 520px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 28px;
          box-shadow: var(--shadow-lg);
        }

        @media (max-width: 768px) {
          .top-header-bar { flex-direction: column; align-items: flex-start; }
          .search-add-row { flex-direction: column; }
          .btn-add-product { width: 100%; }
          .card-actions-row { grid-template-columns: 1fr 1fr; }
          .btn-card-delete { grid-column: span 2; }
        }
      `}</style>

      {/* Top Section */}
      <div className="top-header-bar">
        <div className="header-title-box">
          <h1 className="page-main-title">Handloom Products Manager</h1>
          <span className="count-pill">{filteredProducts.length} Products</span>
        </div>
      </div>

      {/* Search & Filter Controls Panel */}
      <div className="controls-panel-box">
        {/* Search Bar & Add Button */}
        <div className="search-add-row">
          <input 
            type="text" 
            className="search-bar-input" 
            placeholder="Search by product name, cloth type, weaving technique, state of origin..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn-add-product" onClick={() => setShowAddModal(true)}>
            + Add New Product
          </button>
        </div>

        {/* Filter Dropdowns & Sort Options */}
        <div className="filters-sort-grid">
          {/* Cloth Type Filter */}
          <div className="filter-item">
            <span className="filter-item-label">Cloth Type</span>
            <select className="select-input-control" value={selectedClothType} onChange={(e) => setSelectedClothType(e.target.value)}>
              <option value="All">All Cloth Types</option>
              <option value="Saree">Saree</option>
              <option value="Dhoti">Dhoti</option>
              <option value="Handloom Dress Material">Dress Material</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="filter-item">
            <span className="filter-item-label">Category</span>
            <select className="select-input-control" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="All">All Categories</option>
              <option value="Traditional">Traditional</option>
              <option value="Wedding">Wedding</option>
              <option value="Festival">Festival</option>
              <option value="Casual">Casual</option>
            </select>
          </div>

          {/* State Filter */}
          <div className="filter-item">
            <span className="filter-item-label">State of Origin</span>
            <select className="select-input-control" value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
              <option value="All">All States</option>
              <option value="Telangana">Telangana</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="West Bengal">West Bengal</option>
              <option value="Kerala">Kerala</option>
            </select>
          </div>

          {/* Availability Filter */}
          <div className="filter-item">
            <span className="filter-item-label">Availability</span>
            <select className="select-input-control" value={selectedAvailability} onChange={(e) => setSelectedAvailability(e.target.value)}>
              <option value="All">All Availability</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="filter-item">
            <span className="filter-item-label">Price Range</span>
            <select className="select-input-control" value={selectedPriceRange} onChange={(e) => setSelectedPriceRange(e.target.value)}>
              <option value="All">All Prices</option>
              <option value="Under ₹2000">Under ₹2,000</option>
              <option value="₹2000 - ₹5000">₹2,000 - ₹5,000</option>
              <option value="₹5000+">₹5,000+</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="filter-item">
            <span className="filter-item-label">Sort By</span>
            <select className="select-input-control" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="recently_added">Recently Added</option>
              <option value="price_low_high">Price: Low to High</option>
              <option value="price_high_low">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
              <option value="rating_high">Rating: Highest</option>
              <option value="best_selling">Best Selling</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Cards Grid */}
      {filteredProducts.length === 0 ? (
        <div style={{ background: 'var(--bg-secondary)', padding: '50px', borderRadius: '12px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No handloom products match your active search and filter settings.
        </div>
      ) : (
        <div className="products-card-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-item-card">
              <div className="card-img-box">
                <img src={product.image} alt={product.name} className="card-img" />
                <span className="badge-origin">📍 {product.stateOfOrigin}</span>
                <span className={`badge-status ${product.availabilityStatus.replace(/\s+/g, '-')}`}>
                  {product.availabilityStatus}
                </span>
              </div>

              <div className="card-content-box">
                <div className="card-type-tag">{product.clothType} • {product.category}</div>
                <h3 className="card-title">{product.name}</h3>

                <div className="card-spec-line">
                  🧵 <strong>Fabric:</strong> {product.fabricMaterial}<br />
                  ⚙️ <strong>Technique:</strong> {product.weavingTechnique}
                </div>

                <div className="card-metrics-grid">
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Available Stock:</span><br />
                    <strong style={{ color: product.availableStock <= 10 ? '#e63946' : 'var(--text-primary)' }}>
                      {product.availableStock} Units
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Units Sold:</span><br />
                    <strong>{product.unitsSold.toLocaleString()} Sold</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Rating:</span><br />
                    <strong style={{ color: '#ffb703' }}>⭐ {product.rating} ({product.totalReviews})</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Last Updated:</span><br />
                    <strong>{product.lastUpdated}</strong>
                  </div>
                </div>

                <div className="price-discount-row">
                  <div>
                    <span className="price-main">₹{product.price.toLocaleString()}</span>
                    {product.originalPrice && (
                      <span className="price-old">₹{product.originalPrice.toLocaleString()}</span>
                    )}
                  </div>
                  {product.discount > 0 && (
                    <span className="disc-tag">{product.discount}% OFF</span>
                  )}
                </div>

                <div className="card-actions-row">
                  <button className="btn-card-action" onClick={() => setViewingProduct(product)}>
                    👁️ Details
                  </button>
                  <button className="btn-card-action" onClick={() => setEditingProduct({ ...product })}>
                    ✏️ Edit
                  </button>
                  <button className="btn-card-delete" onClick={() => setDeletingProduct(product)} title="Delete Product">
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD PRODUCT MODAL */}
      {showAddModal && (
        <div className="modal-overlay-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-dialog-box" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '22px', fontFamily: 'var(--font-heading)' }}>Add New Handloom Product</h2>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleAddProductSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Product Name *</label>
                <input 
                  type="text" 
                  className="select-input-control" 
                  placeholder="e.g. Uppada Jamdani Silk Saree" 
                  required 
                  value={newProdName}
                  onChange={e => setNewProdName(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Cloth Type</label>
                  <select className="select-input-control" value={newClothType} onChange={e => setNewClothType(e.target.value)} style={{ width: '100%' }}>
                    <option value="Saree">Saree</option>
                    <option value="Dhoti">Dhoti</option>
                    <option value="Handloom Dress Material">Dress Material</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Category</label>
                  <select className="select-input-control" value={newCategory} onChange={e => setNewCategory(e.target.value)} style={{ width: '100%' }}>
                    <option value="Traditional">Traditional</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Festival">Festival</option>
                    <option value="Casual">Casual</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Fabric Material</label>
                  <input 
                    type="text" 
                    className="select-input-control" 
                    placeholder="e.g. Pure Mulberry Silk" 
                    value={newFabric}
                    onChange={e => setNewFabric(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Weaving Technique</label>
                  <input 
                    type="text" 
                    className="select-input-control" 
                    placeholder="e.g. Double Ikat Handloom" 
                    value={newTechnique}
                    onChange={e => setNewTechnique(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Price (₹) *</label>
                  <input 
                    type="number" 
                    className="select-input-control" 
                    required 
                    value={newPrice}
                    onChange={e => setNewPrice(Number(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Original Price</label>
                  <input 
                    type="number" 
                    className="select-input-control" 
                    value={newOrigPrice}
                    onChange={e => setNewOrigPrice(Number(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Stock Units</label>
                  <input 
                    type="number" 
                    className="select-input-control" 
                    value={newStock}
                    onChange={e => setNewStock(Number(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>State of Origin</label>
                <select className="select-input-control" value={newState} onChange={e => setNewState(e.target.value)} style={{ width: '100%' }}>
                  <option value="Telangana">Telangana</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="West Bengal">West Bengal</option>
                  <option value="Kerala">Kerala</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" className="btn-card-action" style={{ flex: 1 }} onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn-add-product" style={{ flex: 1 }}>Add Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PRODUCT MODAL */}
      {editingProduct && (
        <div className="modal-overlay-backdrop" onClick={() => setEditingProduct(null)}>
          <div className="modal-dialog-box" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '22px', fontFamily: 'var(--font-heading)' }}>Edit Handloom Product</h2>
              <button onClick={() => setEditingProduct(null)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Product Name</label>
                <input 
                  type="text" 
                  className="select-input-control" 
                  value={editingProduct.name}
                  onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Price (₹)</label>
                  <input 
                    type="number" 
                    className="select-input-control" 
                    value={editingProduct.price}
                    onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Original Price (₹)</label>
                  <input 
                    type="number" 
                    className="select-input-control" 
                    value={editingProduct.originalPrice || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Available Stock Units</label>
                  <input 
                    type="number" 
                    className="select-input-control" 
                    value={editingProduct.availableStock}
                    onChange={e => setEditingProduct({ ...editingProduct, availableStock: Number(e.target.value) })}
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Category</label>
                  <select className="select-input-control" value={editingProduct.category} onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })} style={{ width: '100%' }}>
                    <option value="Traditional">Traditional</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Festival">Festival</option>
                    <option value="Casual">Casual</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" className="btn-card-action" style={{ flex: 1 }} onClick={() => setEditingProduct(null)}>Cancel</button>
                <button type="submit" className="btn-add-product" style={{ flex: 1 }}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW DETAILS MODAL */}
      {viewingProduct && (
        <div className="modal-overlay-backdrop" onClick={() => setViewingProduct(null)}>
          <div className="modal-dialog-box" onClick={e => e.stopPropagation()}>
            <div style={{ width: '100%', height: '220px', borderRadius: '12px', overflow: 'hidden', marginBottom: '20px' }}>
              <img src={viewingProduct.image} alt={viewingProduct.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-gold)' }}>
              {viewingProduct.clothType} • {viewingProduct.category} • 📍 {viewingProduct.stateOfOrigin}
            </div>
            <h2 style={{ margin: '4px 0 16px', fontSize: '22px', fontFamily: 'var(--font-heading)' }}>
              {viewingProduct.name}
            </h2>

            <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
              <div>Selling Price: <strong>₹{viewingProduct.price.toLocaleString()}</strong></div>
              <div>Original Price: <strong>{viewingProduct.originalPrice ? `₹${viewingProduct.originalPrice.toLocaleString()}` : 'N/A'}</strong></div>
              <div>Discount: <strong>{viewingProduct.discount}% OFF</strong></div>
              <div>Availability: <strong>{viewingProduct.availabilityStatus}</strong></div>
              <div>Stock Units: <strong>{viewingProduct.availableStock} Units</strong></div>
              <div>Units Sold: <strong>{viewingProduct.unitsSold.toLocaleString()}</strong></div>
              <div>Rating: <strong>⭐ {viewingProduct.rating} ({viewingProduct.totalReviews})</strong></div>
              <div>Last Updated: <strong>{viewingProduct.lastUpdated}</strong></div>
              <div style={{ gridColumn: 'span 2' }}>Fabric Material: <strong>{viewingProduct.fabricMaterial}</strong></div>
              <div style={{ gridColumn: 'span 2' }}>Weaving Technique: <strong>{viewingProduct.weavingTechnique}</strong></div>
            </div>

            <button className="btn-add-product" style={{ width: '100%' }} onClick={() => setViewingProduct(null)}>
              Close Details
            </button>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deletingProduct && (
        <div className="modal-overlay-backdrop" onClick={() => setDeletingProduct(null)}>
          <div className="modal-dialog-box" style={{ maxWidth: '400px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>⚠️</div>
            <h3 style={{ margin: '0 0 8px', fontSize: '20px', fontFamily: 'var(--font-heading)' }}>Delete Handloom Product?</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Are you sure you want to remove <strong>{deletingProduct.name}</strong> from your product catalog?
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn-card-action" style={{ flex: 1 }} onClick={() => setDeletingProduct(null)}>Cancel</button>
              <button className="btn-card-delete" style={{ flex: 1 }} onClick={handleConfirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;

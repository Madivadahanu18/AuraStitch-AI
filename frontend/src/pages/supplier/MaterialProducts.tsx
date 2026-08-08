import React, { useState, useMemo } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Import local supplier images
import beads1Img from './images/Beads1.jpg';
import beads2Img from './images/Beads2.jpg';
import lays1Img from './images/Lays1.jpg';
import machinary1Img from './images/Machinary1.jpg';
import machinary2Img from './images/Machinary2.jpg';
import threads1Img from './images/Threads1.jpg';

const getImageSrc = (img: any): string => {
  if (!img) return '';
  if (typeof img === 'string') return img;
  if (typeof img === 'object' && 'default' in img) return (img as any).default;
  return String(img);
};

interface OutletContextType {
  showToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export interface MaterialProduct {
  id: string;
  name: string;
  materialType: string;
  category: 'Textile Materials' | 'Handloom Materials';
  price: number;
  availableStock: number;
  unit: 'kg' | 'meter' | 'piece' | 'roll' | 'packet';
  supplierStatus: 'Active' | 'Low Stock' | 'Out of Stock';
  rating: number;
  image: string;
  description: string;
}

const initialProducts: MaterialProduct[] = [
  {
    id: 'mp-1',
    name: 'Designer Glass & Pearl Beads Pack',
    materialType: 'Glass & Pearl Beads',
    category: 'Textile Materials',
    price: 450,
    availableStock: 120,
    unit: 'packet',
    supplierStatus: 'Active',
    rating: 4.9,
    image: getImageSrc(beads1Img),
    description: 'High-grade decorative glass and pearl beads for boutique dresses, blouses, and heavy embroidery work.'
  },
  {
    id: 'mp-2',
    name: 'Royal Embroidered Border Laces & Trims',
    materialType: 'Embroidered Lace',
    category: 'Textile Materials',
    price: 680,
    availableStock: 85,
    unit: 'roll',
    supplierStatus: 'Active',
    rating: 4.8,
    image: getImageSrc(lays1Img),
    description: 'Intricate embroidered lace borders suitable for dress materials, sarees, and designer garment borders.'
  },
  {
    id: 'mp-3',
    name: 'Multicolor Craft Beads & Embellishments',
    materialType: 'Crafting Embellishments',
    category: 'Textile Materials',
    price: 520,
    availableStock: 5,
    unit: 'packet',
    supplierStatus: 'Low Stock',
    rating: 4.7,
    image: getImageSrc(beads2Img),
    description: 'Assorted vibrant crafting beads and embellishments for fashion designers and custom dressmakers.'
  },
  {
    id: 'mp-4',
    name: 'Premium High-Count 80s Cotton Yarn',
    materialType: 'Combed Cotton Yarn',
    category: 'Handloom Materials',
    price: 1250,
    availableStock: 200,
    unit: 'kg',
    supplierStatus: 'Active',
    rating: 4.9,
    image: getImageSrc(threads1Img),
    description: 'Combed cotton and silk weaving yarn spools engineered for traditional handloom pit looms.'
  },
  {
    id: 'mp-5',
    name: 'Heavy-Duty Handloom Shuttle Assembly',
    materialType: 'Loom Accessories',
    category: 'Handloom Materials',
    price: 1850,
    availableStock: 42,
    unit: 'piece',
    supplierStatus: 'Active',
    rating: 4.8,
    image: getImageSrc(machinary1Img),
    description: 'Precision-crafted wooden shuttles, reeds, and mechanical components for artisan looms.'
  },
  {
    id: 'mp-6',
    name: 'Industrial Loom Machinery Spare Parts',
    materialType: 'Loom Spare Parts',
    category: 'Handloom Materials',
    price: 2400,
    availableStock: 0,
    unit: 'piece',
    supplierStatus: 'Out of Stock',
    rating: 4.9,
    image: getImageSrc(machinary2Img),
    description: 'Essential replacement gears, shafts, and weaving accessories for handloom & powerloom maintenance.'
  }
];

export const SupplierMaterialProducts: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const outletContext = useOutletContext<OutletContextType | null>();

  const showToast = (msg: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    if (outletContext?.showToast) {
      outletContext.showToast(msg, type);
    } else {
      alert(msg);
    }
  };

  const [products, setProducts] = useState<MaterialProduct[]>(initialProducts);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [priceFilter, setPriceFilter] = useState<string>('All');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('All');

  // Modals state
  const [viewingProduct, setViewingProduct] = useState<MaterialProduct | null>(null);
  const [editingProduct, setEditingProduct] = useState<MaterialProduct | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states for Add / Edit
  const [formData, setFormData] = useState<{
    name: string;
    materialType: string;
    category: 'Textile Materials' | 'Handloom Materials';
    price: number;
    availableStock: number;
    unit: 'kg' | 'meter' | 'piece' | 'roll' | 'packet';
    supplierStatus: 'Active' | 'Low Stock' | 'Out of Stock';
    image: string;
    description: string;
  }>({
    name: '',
    materialType: '',
    category: 'Textile Materials',
    price: 0,
    availableStock: 0,
    unit: 'kg',
    supplierStatus: 'Active',
    image: getImageSrc(beads1Img),
    description: ''
  });

  const availableImages = [
    { label: 'Beads Pack 1', value: getImageSrc(beads1Img) },
    { label: 'Beads Pack 2', value: getImageSrc(beads2Img) },
    { label: 'Laces & Trims', value: getImageSrc(lays1Img) },
    { label: 'Cotton & Silk Threads', value: getImageSrc(threads1Img) },
    { label: 'Shuttle Machinery 1', value: getImageSrc(machinary1Img) },
    { label: 'Loom Spare Parts 2', value: getImageSrc(machinary2Img) }
  ];

  // Filtered Products Calculation
  const filteredProducts = useMemo(() => {
    return products.filter(prod => {
      // Search
      const matchesSearch = !searchQuery ||
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.materialType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Category
      const matchesCategory = categoryFilter === 'All' || prod.category === categoryFilter;

      // Price
      const matchesPrice = priceFilter === 'All' ||
        (priceFilter === 'Under ₹500' && prod.price < 500) ||
        (priceFilter === '₹500 - ₹1500' && prod.price >= 500 && prod.price <= 1500) ||
        (priceFilter === '₹1500+' && prod.price > 1500);

      // Availability
      const matchesAvailability = availabilityFilter === 'All' || prod.supplierStatus === availabilityFilter;

      return matchesSearch && matchesCategory && matchesPrice && matchesAvailability;
    });
  }, [products, searchQuery, categoryFilter, priceFilter, availabilityFilter]);

  // Actions
  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      materialType: '',
      category: 'Textile Materials',
      price: 500,
      availableStock: 50,
      unit: 'kg',
      supplierStatus: 'Active',
      image: getImageSrc(beads1Img),
      description: ''
    });
    setIsAddModalOpen(true);
  };

  const handleSaveNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Please enter product name', 'error');
      return;
    }

    const newProd: MaterialProduct = {
      id: `mp-${Date.now()}`,
      name: formData.name,
      materialType: formData.materialType || 'General Material',
      category: formData.category,
      price: Number(formData.price),
      availableStock: Number(formData.availableStock),
      unit: formData.unit,
      supplierStatus: formData.availableStock === 0 ? 'Out of Stock' : (formData.availableStock < 10 ? 'Low Stock' : formData.supplierStatus),
      rating: 5.0,
      image: formData.image,
      description: formData.description || 'High quality supplier material product.'
    };

    setProducts(prev => [newProd, ...prev]);
    showToast(`Added "${newProd.name}" to Material Products!`, 'success');
    setIsAddModalOpen(false);
  };

  const handleOpenEditModal = (product: MaterialProduct) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      materialType: product.materialType,
      category: product.category,
      price: product.price,
      availableStock: product.availableStock,
      unit: product.unit,
      supplierStatus: product.supplierStatus,
      image: product.image,
      description: product.description
    });
  };

  const handleSaveEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setProducts(prev => prev.map(p => {
      if (p.id === editingProduct.id) {
        return {
          ...p,
          name: formData.name,
          materialType: formData.materialType,
          category: formData.category,
          price: Number(formData.price),
          availableStock: Number(formData.availableStock),
          unit: formData.unit,
          supplierStatus: formData.availableStock === 0 ? 'Out of Stock' : (formData.availableStock < 10 ? 'Low Stock' : formData.supplierStatus),
          image: formData.image,
          description: formData.description
        };
      }
      return p;
    }));

    showToast(`Updated details for "${formData.name}"!`, 'success');
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId: string, productName: string) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      setProducts(prev => prev.filter(p => p.id !== productId));
      showToast(`Deleted "${productName}" from inventory`, 'warning');
    }
  };

  return (
    <div className="material-products-container fade-in" style={{ padding: '24px', paddingBottom: '90px', maxWidth: '1240px', margin: '0 auto', color: 'var(--text-primary)' }}>
      <style>{`
        .material-products-container {
          color: var(--text-primary);
        }

        .header-top-banner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 28px;
        }

        .header-title-block {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .header-main-title {
          font-family: var(--font-heading);
          font-size: 28px;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0;
        }

        .header-sub-desc {
          color: var(--text-secondary);
          font-size: 14px;
          margin: 0;
        }

        .top-stats-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          padding: 20px;
          box-shadow: var(--shadow-sm);
        }

        .stat-label {
          font-size: 12px;
          color: var(--text-secondary);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 32px;
          font-weight: 800;
          color: var(--accent-gold);
          line-height: 1;
        }

        /* Controls & Filter Panel */
        .controls-filter-panel {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          padding: 20px;
          margin-bottom: 36px;
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .search-add-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .search-input-field {
          flex: 1;
          min-width: 260px;
          padding: 12px 18px;
          border-radius: 25px;
          border: 1px solid var(--border-color);
          background: var(--bg-primary);
          color: var(--text-primary);
          font-size: 14px;
          outline: none;
        }

        .search-input-field:focus {
          border-color: var(--accent-gold);
        }

        .filters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .filter-select-box {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .filter-title-tag {
          font-size: 11px;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .filter-select-dropdown {
          padding: 10px 14px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          background: var(--bg-primary);
          color: var(--text-primary);
          font-size: 13px;
          outline: none;
          cursor: pointer;
        }

        .filter-select-dropdown:focus {
          border-color: var(--accent-gold);
        }

        /* Products Grid */
        .material-products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }

        .material-product-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .material-product-card:hover {
          transform: translateY(-4px);
          border-color: var(--accent-gold);
          box-shadow: var(--shadow-md);
        }

        .card-img-box {
          position: relative;
          width: 100%;
          height: 200px;
          background-color: #111115;
          overflow: hidden;
        }

        .card-img-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .material-product-card:hover .card-img-box img {
          transform: scale(1.05);
        }

        .card-category-badge {
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
        }

        .card-status-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 700;
        }

        .card-status-badge.Active {
          background: rgba(42, 157, 143, 0.2);
          border: 1px solid #2a9d8f;
          color: #2a9d8f;
        }

        .card-status-badge.Low-Stock {
          background: rgba(244, 162, 97, 0.2);
          border: 1px solid #f4a261;
          color: #f4a261;
        }

        .card-status-badge.Out-of-Stock {
          background: rgba(230, 57, 70, 0.2);
          border: 1px solid #e63946;
          color: #e63946;
        }

        .card-body-content {
          padding: 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .card-material-type {
          font-size: 11px;
          font-weight: 700;
          color: var(--accent-gold);
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 4px;
        }

        .card-prod-title {
          font-family: var(--font-heading);
          font-size: 18px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 8px;
          line-height: 1.3;
        }

        .card-prod-desc {
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.4;
          margin-bottom: 14px;
        }

        .card-meta-details {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          background: var(--bg-primary);
          padding: 12px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          font-size: 12px;
          margin-bottom: 16px;
        }

        .card-actions-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 8px;
          margin-top: auto;
        }

        /* Modal Overlay */
        .modal-overlay-backdrop {
          position: fixed;
          top: 0; left: 0; width: 100vw; height: 100vh;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(4px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          padding: 20px;
        }

        .modal-card-box {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          max-width: 540px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: var(--shadow-md);
        }

        .form-grid-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .form-group-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 14px;
        }

        .form-group-field label {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .form-input-control {
          padding: 10px 14px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          background: var(--bg-primary);
          color: var(--text-primary);
          font-size: 13px;
          outline: none;
        }

        .form-input-control:focus {
          border-color: var(--accent-gold);
        }
      `}</style>

      {/* Header Top */}
      <div className="header-top-banner">
        <div className="header-title-block">
          <h1 className="header-main-title">Supplier Material Products</h1>
          <p className="header-sub-desc">
            Manage your raw material product catalog, update stock quantities, pricing, and supplier statuses.
          </p>
        </div>

        <button className="btn-primary" onClick={handleOpenAddModal} style={{ padding: '12px 24px', fontSize: '14px' }}>
          + Add Product
        </button>
      </div>

      {/* Top Statistics Section */}
      <div className="top-stats-row">
        <div className="stat-card">
          <div className="stat-label">Total Products</div>
          <div className="stat-value">{products.length}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Textile Materials</div>
          <div className="stat-value" style={{ color: 'var(--accent-teal)' }}>
            {products.filter(p => p.category === 'Textile Materials').length}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Handloom Materials</div>
          <div className="stat-value" style={{ color: '#E65C00' }}>
            {products.filter(p => p.category === 'Handloom Materials').length}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Low Stock Alerts</div>
          <div className="stat-value" style={{ color: '#e63946' }}>
            {products.filter(p => p.supplierStatus !== 'Active').length}
          </div>
        </div>
      </div>

      {/* Controls & Filter Panel */}
      <div className="controls-filter-panel">
        <div className="search-add-bar">
          <input
            type="text"
            className="search-input-field"
            placeholder="Search by product name, material type, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filters-grid">
          <div className="filter-select-box">
            <span className="filter-title-tag">Category</span>
            <select
              className="filter-select-dropdown"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Textile Materials">Textile Materials</option>
              <option value="Handloom Materials">Handloom Materials</option>
            </select>
          </div>

          <div className="filter-select-box">
            <span className="filter-title-tag">Price Filter</span>
            <select
              className="filter-select-dropdown"
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
            >
              <option value="All">All Prices</option>
              <option value="Under ₹500">Under ₹500</option>
              <option value="₹500 - ₹1500">₹500 - ₹1,500</option>
              <option value="₹1500+">₹1,500+</option>
            </select>
          </div>

          <div className="filter-select-box">
            <span className="filter-title-tag">Availability</span>
            <select
              className="filter-select-dropdown"
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Active">In Stock (Active)</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div style={{ background: 'var(--bg-secondary)', padding: '50px', borderRadius: '12px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No material products found matching your search or filter parameters.
        </div>
      ) : (
        <div className="material-products-grid">
          {filteredProducts.map(prod => (
            <div key={prod.id} className="material-product-card">
              <div className="card-img-box" style={{ cursor: 'pointer' }} onClick={() => navigate('/product-details', { state: { product: prod } })}>
                <img src={prod.image} alt={prod.name} />
                <span className="card-category-badge">{prod.category}</span>
                <span className={`card-status-badge ${prod.supplierStatus.replace(/\s+/g, '-')}`}>
                  {prod.supplierStatus}
                </span>
              </div>

              <div className="card-body-content">
                <div className="card-material-type">{prod.materialType}</div>
                <h3 className="card-prod-title" style={{ cursor: 'pointer' }} onClick={() => navigate('/product-details', { state: { product: prod } })}>{prod.name}</h3>
                <p className="card-prod-desc">{prod.description}</p>

                <div className="card-meta-details">
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Price:</span>
                    <strong style={{ display: 'block', color: 'var(--text-primary)' }}>₹{prod.price} / {prod.unit}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Available Stock:</span>
                    <strong style={{ display: 'block', color: prod.availableStock < 10 ? '#e63946' : 'var(--text-primary)' }}>
                      {prod.availableStock} {prod.unit}s
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Unit:</span>
                    <strong style={{ display: 'block' }}>{prod.unit}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Rating:</span>
                    <strong style={{ display: 'block', color: '#ffb703' }}>★ {prod.rating}</strong>
                  </div>
                </div>

                <div className="card-actions-row">
                  <button className="btn-secondary" style={{ padding: '8px', fontSize: '12px' }} onClick={() => navigate('/product-details', { state: { product: prod } })}>
                    View
                  </button>
                  <button className="btn-secondary" style={{ padding: '8px', fontSize: '12px' }} onClick={() => handleOpenEditModal(prod)}>
                    Edit
                  </button>
                  <button className="btn-secondary" style={{ padding: '8px', fontSize: '12px', color: '#e63946', borderColor: '#e63946' }} onClick={() => handleDeleteProduct(prod.id, prod.name)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Modal */}
      {viewingProduct && (
        <div className="modal-overlay-backdrop" onClick={() => setViewingProduct(null)}>
          <div className="modal-card-box" onClick={(e) => e.stopPropagation()}>
            <div style={{ position: 'relative', height: '220px' }}>
              <img src={viewingProduct.image} alt={viewingProduct.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button
                onClick={() => setViewingProduct(null)}
                style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.6)', border: '1px solid #fff', borderRadius: '50%', width: '32px', height: '32px', color: '#fff', fontSize: '16px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-gold)', marginBottom: '4px' }}>
                {viewingProduct.category} • {viewingProduct.materialType}
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '10px' }}>{viewingProduct.name}</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '20px' }}>
                {viewingProduct.description}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', background: 'var(--bg-primary)', padding: '16px', borderRadius: '8px', marginBottom: '20px', border: '1px solid var(--border-color)' }}>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Price per Unit</span>
                  <strong style={{ display: 'block', fontSize: '16px' }}>₹{viewingProduct.price} / {viewingProduct.unit}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Available Stock</span>
                  <strong style={{ display: 'block', fontSize: '16px' }}>{viewingProduct.availableStock} {viewingProduct.unit}s</strong>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Unit Type</span>
                  <strong style={{ display: 'block', fontSize: '15px' }}>{viewingProduct.unit}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Supplier Status</span>
                  <strong style={{ display: 'block', fontSize: '15px', color: viewingProduct.supplierStatus === 'Active' ? '#2a9d8f' : '#e63946' }}>
                    {viewingProduct.supplierStatus}
                  </strong>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn-secondary" style={{ flex: 1, padding: '10px' }} onClick={() => setViewingProduct(null)}>
                  Close
                </button>
                <button className="btn-primary" style={{ flex: 1, padding: '10px' }} onClick={() => { setViewingProduct(null); handleOpenEditModal(viewingProduct); }}>
                  Edit Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {(isAddModalOpen || editingProduct) && (
        <div className="modal-overlay-backdrop" onClick={() => { setIsAddModalOpen(false); setEditingProduct(null); }}>
          <div className="modal-card-box" onClick={(e) => e.stopPropagation()} style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '20px' }}>
                {editingProduct ? `Edit "${editingProduct.name}"` : 'Add New Material Product'}
              </h3>
              <button
                onClick={() => { setIsAddModalOpen(false); setEditingProduct(null); }}
                style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '20px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={editingProduct ? handleSaveEditProduct : handleSaveNewProduct}>
              <div className="form-group-field">
                <label>Product Name</label>
                <input
                  type="text"
                  className="form-input-control"
                  required
                  placeholder="e.g. Premium Mulberry Raw Silk Yarn"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="form-grid-row">
                <div className="form-group-field">
                  <label>Category</label>
                  <select
                    className="form-input-control"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                  >
                    <option value="Textile Materials">Textile Materials</option>
                    <option value="Handloom Materials">Handloom Materials</option>
                  </select>
                </div>

                <div className="form-group-field">
                  <label>Material Type</label>
                  <input
                    type="text"
                    className="form-input-control"
                    placeholder="e.g. Silk Yarn, Lace, Shuttle"
                    value={formData.materialType}
                    onChange={(e) => setFormData(prev => ({ ...prev, materialType: e.target.value }))}
                  />
                </div>
              </div>

              <div className="form-grid-row">
                <div className="form-group-field">
                  <label>Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    className="form-input-control"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                  />
                </div>

                <div className="form-group-field">
                  <label>Available Stock</label>
                  <input
                    type="number"
                    min="0"
                    className="form-input-control"
                    required
                    value={formData.availableStock}
                    onChange={(e) => setFormData(prev => ({ ...prev, availableStock: Number(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="form-grid-row">
                <div className="form-group-field">
                  <label>Unit</label>
                  <select
                    className="form-input-control"
                    value={formData.unit}
                    onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value as any }))}
                  >
                    <option value="kg">kg</option>
                    <option value="meter">meter</option>
                    <option value="piece">piece</option>
                    <option value="roll">roll</option>
                    <option value="packet">packet</option>
                  </select>
                </div>

                <div className="form-group-field">
                  <label>Supplier Status</label>
                  <select
                    className="form-input-control"
                    value={formData.supplierStatus}
                    onChange={(e) => setFormData(prev => ({ ...prev, supplierStatus: e.target.value as any }))}
                  >
                    <option value="Active">Active</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div className="form-group-field">
                <label>Select Product Image (Local Supplier Images)</label>
                <select
                  className="form-input-control"
                  value={formData.image}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                >
                  {availableImages.map(imgOpt => (
                    <option key={imgOpt.value} value={imgOpt.value}>
                      {imgOpt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group-field">
                <label>Description</label>
                <textarea
                  className="form-input-control"
                  rows={3}
                  placeholder="Provide details about material specifications, counts, origin..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn-secondary" style={{ flex: 1, padding: '10px' }} onClick={() => { setIsAddModalOpen(false); setEditingProduct(null); }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '10px' }}>
                  {editingProduct ? 'Save Changes' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierMaterialProducts;

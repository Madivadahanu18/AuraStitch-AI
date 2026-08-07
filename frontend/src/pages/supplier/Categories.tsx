import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Import existing local supplier images
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

export interface SupplierCategory {
  id: string;
  name: string;
  group: 'Textile Materials' | 'Handloom Materials';
  productCount: number;
  image: string;
  description?: string;
}

const initialCategories: SupplierCategory[] = [
  // Textile Materials
  {
    id: 'cat-1',
    name: 'Fabrics',
    group: 'Textile Materials',
    productCount: 24,
    image: getImageSrc(lays1Img),
    description: 'Cotton, linen, silk blends, and lining fabrics.'
  },
  {
    id: 'cat-2',
    name: 'Dress Materials',
    group: 'Textile Materials',
    productCount: 18,
    image: getImageSrc(beads2Img),
    description: 'Unstitched suit sets and boutique dress material rolls.'
  },
  {
    id: 'cat-3',
    name: 'Laces',
    group: 'Textile Materials',
    productCount: 15,
    image: getImageSrc(lays1Img),
    description: 'Designer embroidered lace borders and trims.'
  },
  {
    id: 'cat-4',
    name: 'Beads',
    group: 'Textile Materials',
    productCount: 32,
    image: getImageSrc(beads1Img),
    description: 'Glass, crystal, and pearl embroidery beads.'
  },
  {
    id: 'cat-5',
    name: 'Linings',
    group: 'Textile Materials',
    productCount: 10,
    image: getImageSrc(lays1Img),
    description: 'Cotton and satin garment inner linings.'
  },
  {
    id: 'cat-6',
    name: 'Buttons',
    group: 'Textile Materials',
    productCount: 28,
    image: getImageSrc(beads1Img),
    description: 'Decorative, wooden, and metal designer buttons.'
  },
  {
    id: 'cat-7',
    name: 'Zippers',
    group: 'Textile Materials',
    productCount: 14,
    image: getImageSrc(beads2Img),
    description: 'Concealed and metal zippers for dresses and suits.'
  },
  {
    id: 'cat-8',
    name: 'Borders',
    group: 'Textile Materials',
    productCount: 22,
    image: getImageSrc(lays1Img),
    description: 'Zari and embroidered saree/garment borders.'
  },

  // Handloom Materials
  {
    id: 'cat-9',
    name: 'Cotton Yarn',
    group: 'Handloom Materials',
    productCount: 45,
    image: getImageSrc(threads1Img),
    description: 'High-count combed cotton weaving yarn spools.'
  },
  {
    id: 'cat-10',
    name: 'Silk Yarn',
    group: 'Handloom Materials',
    productCount: 30,
    image: getImageSrc(threads1Img),
    description: 'Pure Mulberry and Tussar raw silk yarns.'
  },
  {
    id: 'cat-11',
    name: 'Wool Yarn',
    group: 'Handloom Materials',
    productCount: 12,
    image: getImageSrc(threads1Img),
    description: 'Warm hand-spun wool yarns for handlooms.'
  },
  {
    id: 'cat-12',
    name: 'Natural Dyes',
    group: 'Handloom Materials',
    productCount: 16,
    image: getImageSrc(machinary2Img),
    description: 'Organic Indigo, Madder root, and plant dyes.'
  },
  {
    id: 'cat-13',
    name: 'Loom Accessories',
    group: 'Handloom Materials',
    productCount: 20,
    image: getImageSrc(machinary1Img),
    description: 'Flying shuttles, pirns, and warping bobbins.'
  },
  {
    id: 'cat-14',
    name: 'Machine Spare Parts',
    group: 'Handloom Materials',
    productCount: 38,
    image: getImageSrc(machinary1Img),
    description: 'Gears, stainless steel reeds, and loom parts.'
  },
  {
    id: 'cat-15',
    name: 'Weaving Tools',
    group: 'Handloom Materials',
    productCount: 25,
    image: getImageSrc(machinary2Img),
    description: 'Comb reeds, stretchers, and artisan weaving tools.'
  }
];

export const SupplierCategories: React.FC = () => {
  const { user } = useAuth();
  const outletContext = useOutletContext<OutletContextType | null>();

  const showToast = (msg: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    if (outletContext?.showToast) {
      outletContext.showToast(msg, type);
    } else {
      alert(msg);
    }
  };

  const [categories, setCategories] = useState<SupplierCategory[]>(initialCategories);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGroupFilter, setActiveGroupFilter] = useState<'All' | 'Textile Materials' | 'Handloom Materials'>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [formData, setFormData] = useState<{
    name: string;
    group: 'Textile Materials' | 'Handloom Materials';
    productCount: number;
    image: string;
    description: string;
  }>({
    name: '',
    group: 'Textile Materials',
    productCount: 0,
    image: getImageSrc(beads1Img),
    description: ''
  });

  const availableImages = [
    { label: 'Beads 1', value: getImageSrc(beads1Img) },
    { label: 'Beads 2', value: getImageSrc(beads2Img) },
    { label: 'Laces & Trims', value: getImageSrc(lays1Img) },
    { label: 'Yarns & Threads', value: getImageSrc(threads1Img) },
    { label: 'Loom Parts 1', value: getImageSrc(machinary1Img) },
    { label: 'Loom Parts 2', value: getImageSrc(machinary2Img) }
  ];

  const filteredCategories = useMemo(() => {
    return categories.filter(cat => {
      const matchesSearch = !searchQuery ||
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.group.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cat.description && cat.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesGroup = activeGroupFilter === 'All' || cat.group === activeGroupFilter;

      return matchesSearch && matchesGroup;
    });
  }, [categories, searchQuery, activeGroupFilter]);

  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      group: 'Textile Materials',
      productCount: 0,
      image: getImageSrc(beads1Img),
      description: ''
    });
    setIsAddModalOpen(true);
  };

  const handleSaveNewCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Please enter category name', 'error');
      return;
    }

    const newCat: SupplierCategory = {
      id: `cat-${Date.now()}`,
      name: formData.name.trim(),
      group: formData.group,
      productCount: Number(formData.productCount) || 0,
      image: formData.image,
      description: formData.description || `${formData.name} category for suppliers.`
    };

    setCategories(prev => [newCat, ...prev]);
    showToast(`Category "${newCat.name}" added successfully!`, 'success');
    setIsAddModalOpen(false);
  };

  const textileCategories = filteredCategories.filter(c => c.group === 'Textile Materials');
  const handloomCategories = filteredCategories.filter(c => c.group === 'Handloom Materials');

  return (
    <div className="supplier-categories-container fade-in" style={{ padding: '24px', paddingBottom: '90px', maxWidth: '1240px', margin: '0 auto', color: 'var(--text-primary)' }}>
      <style>{`
        .supplier-categories-container {
          color: var(--text-primary);
        }

        .cat-header-banner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 28px;
        }

        .cat-main-title {
          font-family: var(--font-heading);
          font-size: 28px;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0 0 4px 0;
        }

        .cat-sub-text {
          font-size: 14px;
          color: var(--text-secondary);
          margin: 0;
        }

        /* Top Controls */
        .cat-top-controls {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          padding: 20px;
          margin-bottom: 36px;
          box-shadow: var(--shadow-sm);
          display: flex;
          gap: 16px;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
        }

        .cat-search-input {
          flex: 1;
          min-width: 260px;
          padding: 12px 20px;
          border-radius: 25px;
          border: 1px solid var(--border-color);
          background: var(--bg-primary);
          color: var(--text-primary);
          font-size: 14px;
          outline: none;
        }

        .cat-search-input:focus {
          border-color: var(--accent-gold);
        }

        .group-filter-btns {
          display: flex;
          gap: 8px;
        }

        .filter-tab {
          padding: 8px 16px;
          border-radius: 20px;
          border: 1px solid var(--border-color);
          background: var(--bg-primary);
          color: var(--text-secondary);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .filter-tab.active {
          background: var(--accent-gold);
          color: #0A0F19;
          border-color: var(--accent-gold);
          font-weight: 700;
        }

        .group-section-title {
          font-family: var(--font-heading);
          font-size: 22px;
          font-weight: 800;
          margin-bottom: 20px;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .group-section-title::before {
          content: '';
          display: inline-block;
          width: 4px;
          height: 22px;
          background: var(--accent-gold);
          border-radius: 4px;
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 24px;
          margin-bottom: 48px;
        }

        .category-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .category-card:hover {
          transform: translateY(-4px);
          border-color: var(--accent-gold);
          box-shadow: var(--shadow-md);
        }

        .cat-img-box {
          position: relative;
          width: 100%;
          height: 160px;
          background-color: #111115;
          overflow: hidden;
        }

        .cat-img-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .category-card:hover .cat-img-box img {
          transform: scale(1.06);
        }

        .cat-badge-count {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(10, 15, 25, 0.85);
          border: 1px solid var(--accent-gold);
          color: var(--accent-gold);
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 700;
        }

        .cat-card-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .cat-card-name {
          font-family: var(--font-heading);
          font-size: 18px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 6px;
        }

        .cat-card-desc {
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.4;
          margin-bottom: 12px;
        }

        .cat-card-footer {
          margin-top: auto;
          padding-top: 10px;
          border-top: 1px dashed var(--border-color);
          font-size: 13px;
          font-weight: 600;
          color: var(--text-muted);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        /* Modal Backdrop */
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
          max-width: 500px;
          width: 100%;
          padding: 24px;
          box-shadow: var(--shadow-md);
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

      {/* Header Banner */}
      <div className="cat-header-banner">
        <div>
          <h1 className="cat-main-title">Supplier Product Categories</h1>
          <p className="cat-sub-text">
            Organize supplier inventory into Textile Materials and Handloom Materials categories.
          </p>
        </div>

        <button className="btn-primary" onClick={handleOpenAddModal} style={{ padding: '12px 24px', fontSize: '14px' }}>
          + Add Category
        </button>
      </div>

      {/* Top Search & Filter Bar */}
      <div className="cat-top-controls">
        <input
          type="text"
          className="cat-search-input"
          placeholder="Search categories by name or group..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="group-filter-btns">
          <button
            className={`filter-tab ${activeGroupFilter === 'All' ? 'active' : ''}`}
            onClick={() => setActiveGroupFilter('All')}
          >
            All ({categories.length})
          </button>
          <button
            className={`filter-tab ${activeGroupFilter === 'Textile Materials' ? 'active' : ''}`}
            onClick={() => setActiveGroupFilter('Textile Materials')}
          >
            Textile Materials
          </button>
          <button
            className={`filter-tab ${activeGroupFilter === 'Handloom Materials' ? 'active' : ''}`}
            onClick={() => setActiveGroupFilter('Handloom Materials')}
          >
            Handloom Materials
          </button>
        </div>
      </div>

      {/* Section 1: Textile Materials */}
      {(activeGroupFilter === 'All' || activeGroupFilter === 'Textile Materials') && (
        <div>
          <h2 className="group-section-title">
            Textile Materials ({textileCategories.length})
          </h2>

          {textileCategories.length === 0 ? (
            <div style={{ background: 'var(--bg-secondary)', padding: '30px', borderRadius: '12px', textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '40px' }}>
              No Textile Material categories match your search.
            </div>
          ) : (
            <div className="categories-grid">
              {textileCategories.map(cat => (
                <div key={cat.id} className="category-card">
                  <div className="cat-img-box">
                    <img src={cat.image} alt={cat.name} />
                    <span className="cat-badge-count">{cat.productCount} Products</span>
                  </div>
                  <div className="cat-card-body">
                    <h3 className="cat-card-name">{cat.name}</h3>
                    {cat.description && <p className="cat-card-desc">{cat.description}</p>}
                    <div className="cat-card-footer">
                      <span>Group: {cat.group}</span>
                      <span style={{ color: 'var(--accent-gold)' }}>View Items →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Section 2: Handloom Materials */}
      {(activeGroupFilter === 'All' || activeGroupFilter === 'Handloom Materials') && (
        <div>
          <h2 className="group-section-title">
            Handloom Materials ({handloomCategories.length})
          </h2>

          {handloomCategories.length === 0 ? (
            <div style={{ background: 'var(--bg-secondary)', padding: '30px', borderRadius: '12px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No Handloom Material categories match your search.
            </div>
          ) : (
            <div className="categories-grid">
              {handloomCategories.map(cat => (
                <div key={cat.id} className="category-card">
                  <div className="cat-img-box">
                    <img src={cat.image} alt={cat.name} />
                    <span className="cat-badge-count">{cat.productCount} Products</span>
                  </div>
                  <div className="cat-card-body">
                    <h3 className="cat-card-name">{cat.name}</h3>
                    {cat.description && <p className="cat-card-desc">{cat.description}</p>}
                    <div className="cat-card-footer">
                      <span>Group: {cat.group}</span>
                      <span style={{ color: 'var(--accent-gold)' }}>View Items →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Category Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay-backdrop" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-card-box" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '20px' }}>Add New Category</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '20px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNewCategory}>
              <div className="form-group-field">
                <label>Category Name</label>
                <input
                  type="text"
                  className="form-input-control"
                  required
                  placeholder="e.g. Silk Threads, Trims, Spindles..."
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="form-group-field">
                <label>Material Group</label>
                <select
                  className="form-input-control"
                  value={formData.group}
                  onChange={(e) => setFormData(prev => ({ ...prev, group: e.target.value as any }))}
                >
                  <option value="Textile Materials">Textile Materials</option>
                  <option value="Handloom Materials">Handloom Materials</option>
                </select>
              </div>

              <div className="form-group-field">
                <label>Initial Product Count</label>
                <input
                  type="number"
                  min="0"
                  className="form-input-control"
                  value={formData.productCount}
                  onChange={(e) => setFormData(prev => ({ ...prev, productCount: Number(e.target.value) }))}
                />
              </div>

              <div className="form-group-field">
                <label>Category Image (Local Supplier Images)</label>
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
                  placeholder="Brief description of products under this category..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn-secondary" style={{ flex: 1, padding: '10px' }} onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '10px' }}>
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierCategories;

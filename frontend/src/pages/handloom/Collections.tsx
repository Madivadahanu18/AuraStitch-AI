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

interface CollectionProduct {
  id: string;
  name: string;
  clothType: string;
  price: number;
  stock: number;
  availability: 'In Stock' | 'Low Stock' | 'Out of Stock';
  image: string;
}

interface Collection {
  id: string;
  name: string;
  description: string;
  type: 'Silk' | 'Cotton' | 'Wedding' | 'Festive' | 'Organic' | 'Summer' | 'Traditional' | 'Premium';
  productsCount: number;
  totalStock: number;
  lastUpdated: string;
  coverImage: string;
  productsList: CollectionProduct[];
}

// Helper to ensure Vite resolves imported local image assets into URL strings
const getImageSrc = (img: any): string => {
  if (!img) return '';
  if (typeof img === 'string') return img;
  if (typeof img === 'object' && 'default' in img) return (img as any).default;
  return String(img);
};

const initialCollections: Collection[] = [
  {
    id: 'col-1',
    name: 'Wedding Collection',
    description: 'Royal Kanchipuram and Banarasi silk sarees designed with rich gold zari for bridal celebrations.',
    type: 'Wedding',
    productsCount: 12,
    totalStock: 145,
    lastUpdated: '23 Jul 2026',
    coverImage: getImageSrc(pattuSareeImg),
    productsList: [
      { id: 'cp-101', name: 'Kanchipuram Heavy Zari Silk Saree', clothType: 'Saree', price: 12450, stock: 18, availability: 'In Stock', image: getImageSrc(pattuSareeImg) },
      { id: 'cp-102', name: 'Banarasi Gold Brocade Silk Saree', clothType: 'Saree', price: 8500, stock: 15, availability: 'In Stock', image: getImageSrc(pochampallyImg) },
      { id: 'cp-103', name: 'Zardozi Embroidered Bridal Dupatta', clothType: 'Dupatta', price: 4200, stock: 12, availability: 'In Stock', image: getImageSrc(mangalagiriDressImg) }
    ]
  },
  {
    id: 'col-2',
    name: 'Festival Collection',
    description: 'Vibrant Pochampally Ikat and Venkatagiri handwoven silk-cotton sarees for festival occasions.',
    type: 'Festive',
    productsCount: 10,
    totalStock: 110,
    lastUpdated: '22 Jul 2026',
    coverImage: getImageSrc(pochampallyImg),
    productsList: [
      { id: 'cp-201', name: 'Pochampally Double Ikat Silk Saree', clothType: 'Saree', price: 4850, stock: 45, availability: 'In Stock', image: getImageSrc(pochampallyImg) },
      { id: 'cp-202', name: 'Venkatagiri Jamdani Motif Zari Saree', clothType: 'Saree', price: 3600, stock: 6, availability: 'Low Stock', image: getImageSrc(mangalagiriDressImg) }
    ]
  },
  {
    id: 'col-3',
    name: 'Cotton Collection',
    description: 'Breathable 80s count handwoven Mangalagiri and Bengal cotton sarees and dress materials.',
    type: 'Cotton',
    productsCount: 15,
    totalStock: 180,
    lastUpdated: '21 Jul 2026',
    coverImage: getImageSrc(cottonSareesImg),
    productsList: [
      { id: 'cp-301', name: 'Mangalagiri Nizam Border Cotton Saree', clothType: 'Saree', price: 2450, stock: 28, availability: 'In Stock', image: getImageSrc(cottonSareesImg) },
      { id: 'cp-302', name: 'Pure Handwoven Bengal Cotton Saree', clothType: 'Saree', price: 2250, stock: 8, availability: 'Low Stock', image: getImageSrc(cottonSareesImg) }
    ]
  },
  {
    id: 'col-4',
    name: 'Silk Collection',
    description: 'Premium pure Mulberry raw silk and Tussar silk collections woven on traditional pit looms.',
    type: 'Silk',
    productsCount: 8,
    totalStock: 95,
    lastUpdated: '20 Jul 2026',
    coverImage: getImageSrc(pattuSareeImg),
    productsList: [
      { id: 'cp-401', name: 'Uppada Pure Jamdani Silk Saree', clothType: 'Saree', price: 12450, stock: 12, availability: 'In Stock', image: getImageSrc(pattuSareeImg) },
      { id: 'cp-402', name: 'Pure Raw Silk Dupatta', clothType: 'Dupatta', price: 3200, stock: 25, availability: 'In Stock', image: getImageSrc(pochampallyImg) }
    ]
  },
  {
    id: 'col-5',
    name: 'Premium Collection',
    description: 'Exclusive limited-edition handwoven sarees featuring tested silver and gold metallic zari wire.',
    type: 'Premium',
    productsCount: 6,
    totalStock: 48,
    lastUpdated: '19 Jul 2026',
    coverImage: getImageSrc(pochampallyImg),
    productsList: [
      { id: 'cp-501', name: 'Gadwal Kutni Interlocked Silk Saree', clothType: 'Saree', price: 9800, stock: 10, availability: 'In Stock', image: getImageSrc(pattuSareeImg) },
      { id: 'cp-502', name: 'Pochampally Royal Heritage Saree', clothType: 'Saree', price: 7500, stock: 14, availability: 'In Stock', image: getImageSrc(pochampallyImg) }
    ]
  },
  {
    id: 'col-6',
    name: 'Organic Collection',
    description: '100% natural plant-dyed organic cotton and unbleached linen handloom dress fabrics.',
    type: 'Organic',
    productsCount: 9,
    totalStock: 120,
    lastUpdated: '18 Jul 2026',
    coverImage: getImageSrc(mangalagiriDressImg),
    productsList: [
      { id: 'cp-601', name: 'Natural Indigo Dyed Dress Material', clothType: 'Handloom Dress Material', price: 1850, stock: 32, availability: 'In Stock', image: getImageSrc(mangalagiriDressImg) },
      { id: 'cp-602', name: 'Unbleached Organic Linen Fabric Roll', clothType: 'Fabric', price: 1450, stock: 20, availability: 'In Stock', image: getImageSrc(cottonSareesImg) }
    ]
  },
  {
    id: 'col-7',
    name: 'Summer Collection',
    description: 'Lightweight handwoven dhotis, cotton kurtis, and airy summer wear for everyday comfort.',
    type: 'Summer',
    productsCount: 11,
    totalStock: 160,
    lastUpdated: '17 Jul 2026',
    coverImage: getImageSrc(dhotiImg),
    productsList: [
      { id: 'cp-701', name: 'Traditional Handwoven Cotton Dhoti', clothType: 'Dhoti', price: 1450, stock: 50, availability: 'In Stock', image: getImageSrc(dhotiImg) },
      { id: 'cp-702', name: 'Lightweight Casual Summer Kurti', clothType: 'Kurti', price: 1250, stock: 30, availability: 'In Stock', image: getImageSrc(mangalagiriDressImg) }
    ]
  },
  {
    id: 'col-8',
    name: 'Traditional Collection',
    description: 'Classic heritage temple border sarees and timeless everyday ethnic weaves for artisans.',
    type: 'Traditional',
    productsCount: 14,
    totalStock: 155,
    lastUpdated: '16 Jul 2026',
    coverImage: getImageSrc(cottonSareesImg),
    productsList: [
      { id: 'cp-801', name: 'Temple Border Mangalagiri Cotton Saree', clothType: 'Saree', price: 2800, stock: 22, availability: 'In Stock', image: getImageSrc(cottonSareesImg) },
      { id: 'cp-802', name: 'Classic Khadi Handwoven Saree', clothType: 'Saree', price: 1950, stock: 15, availability: 'In Stock', image: getImageSrc(mangalagiriDressImg) }
    ]
  }
];

export const Collections: React.FC = () => {
  const context = useOutletContext<OutletContextType | null>();
  const showToast = (msg: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    if (context?.showToast) context.showToast(msg, type);
    else alert(msg);
  };

  const [collections, setCollections] = useState<Collection[]>(initialCollections);

  // Filters & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedCountFilter, setSelectedCountFilter] = useState<string>('All');
  const [sortOption, setSortOption] = useState<string>('recently_updated');

  // Modals State
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeViewingCollection, setActiveViewingCollection] = useState<Collection | null>(null);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [deletingCollection, setDeletingCollection] = useState<Collection | null>(null);

  // New Collection Form State
  const [newColName, setNewColName] = useState('');
  const [newColDesc, setNewColDesc] = useState('');
  const [newColType, setNewColType] = useState<Collection['type']>('Traditional');

  // Filtered & Sorted Collections
  const filteredCollections = useMemo(() => {
    let result = collections.filter(col => {
      // Search by Collection Name or Description
      const matchesSearch = !searchQuery || 
        col.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        col.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by Collection Type
      const matchesType = selectedType === 'All' || col.type === selectedType;

      // Filter by Product Count
      const matchesCount = selectedCountFilter === 'All' ||
        (selectedCountFilter === '1-10 Products' && col.productsCount <= 10) ||
        (selectedCountFilter === '10+ Products' && col.productsCount > 10);

      return matchesSearch && matchesType && matchesCount;
    });

    // Sorting Options
    return result.sort((a, b) => {
      if (sortOption === 'name_asc') return a.name.localeCompare(b.name);
      if (sortOption === 'stock_high') return b.totalStock - a.totalStock;
      if (sortOption === 'products_high') return b.productsCount - a.productsCount;
      return b.id.localeCompare(a.id); // Default: Recently Updated
    });
  }, [collections, searchQuery, selectedType, selectedCountFilter, sortOption]);

  // Create Collection Handler
  const handleAddCollectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColName.trim()) return;

    const newCol: Collection = {
      id: `col-${Date.now()}`,
      name: newColName.trim(),
      description: newColDesc.trim() || 'Handwoven collection curated for regional artisans.',
      type: newColType,
      productsCount: 0,
      totalStock: 0,
      lastUpdated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      coverImage: getImageSrc(pochampallyImg),
      productsList: []
    };

    setCollections([newCol, ...collections]);
    showToast(`Created new collection "${newCol.name}"!`, "success");
    setShowAddModal(false);
    setNewColName('');
    setNewColDesc('');
  };

  // Edit Collection Handler
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCollection) return;

    setCollections(prev => prev.map(c => {
      if (c.id === editingCollection.id) {
        return {
          ...editingCollection,
          lastUpdated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        };
      }
      return c;
    }));

    showToast(`Updated collection "${editingCollection.name}"!`, "success");
    setEditingCollection(null);
  };

  // Delete Collection Handler
  const handleConfirmDelete = () => {
    if (!deletingCollection) return;

    setCollections(collections.filter(c => c.id !== deletingCollection.id));
    showToast(`Deleted collection "${deletingCollection.name}".`, "info");
    setDeletingCollection(null);
  };

  return (
    <div className="handloom-collections-container fade-in" style={{ padding: '24px', paddingBottom: '90px', maxWidth: '1240px', margin: '0 auto', color: 'var(--text-primary)' }}>
      <style>{`
        .col-top-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .col-header-left {
          display: flex;
          align-items: baseline;
          gap: 14px;
        }

        .col-page-title {
          font-family: var(--font-heading);
          font-size: 28px;
          font-weight: 800;
          margin: 0;
          color: var(--text-primary);
        }

        .col-count-pill {
          background: rgba(197, 160, 89, 0.15);
          color: var(--accent-gold);
          border: 1px solid var(--accent-gold);
          padding: 4px 14px;
          border-radius: 16px;
          font-size: 13px;
          font-weight: 700;
        }

        /* Controls Panel */
        .col-controls-panel {
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

        .col-search-row {
          display: flex;
          gap: 14px;
          align-items: center;
          width: 100%;
        }

        .col-search-input {
          flex: 1;
          padding: 12px 20px;
          border-radius: 30px;
          border: 1px solid var(--border-color);
          background: var(--bg-primary);
          color: var(--text-primary);
          font-size: 14px;
          outline: none;
        }

        .col-search-input:focus {
          border-color: var(--accent-gold);
        }

        .btn-add-collection {
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

        .btn-add-collection:hover {
          transform: translateY(-2px);
        }

        .col-filters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
          gap: 14px;
        }

        .col-filter-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .col-filter-label {
          font-size: 11px;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .col-select-dropdown {
          padding: 9px 12px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          background: var(--bg-primary);
          color: var(--text-primary);
          font-size: 13px;
          outline: none;
          cursor: pointer;
        }

        .col-select-dropdown:focus {
          border-color: var(--accent-gold);
        }

        /* Collections Cards Grid */
        .collections-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 26px;
        }

        .collection-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease, border-color 0.3s ease;
        }

        .collection-card:hover {
          transform: translateY(-4px);
          border-color: var(--accent-gold);
          box-shadow: var(--shadow-md);
        }

        .col-cover-box {
          position: relative;
          width: 100%;
          height: 220px;
          overflow: hidden;
          background: #111;
        }

        .col-cover-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .collection-card:hover .col-cover-img {
          transform: scale(1.05);
        }

        .col-type-tag {
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

        .col-card-body {
          padding: 22px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .col-card-title {
          font-family: var(--font-heading);
          font-size: 20px;
          font-weight: 700;
          margin: 0 0 8px;
          color: var(--text-primary);
        }

        .col-card-desc {
          font-size: 13px;
          color: var(--text-secondary);
          margin-bottom: 16px;
          line-height: 1.5;
          flex: 1;
        }

        .col-stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          background: var(--bg-primary);
          padding: 12px;
          border-radius: 8px;
          font-size: 12px;
          margin-bottom: 18px;
          border: 1px solid var(--border-color);
          text-align: center;
        }

        .col-stats-row strong {
          display: block;
          font-size: 14px;
          color: var(--text-primary);
          margin-top: 2px;
        }

        .col-actions-bar {
          display: grid;
          grid-template-columns: 1fr 1fr auto;
          gap: 8px;
          margin-top: auto;
        }

        .btn-col-action {
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
        }

        .btn-col-action:hover {
          border-color: var(--accent-gold);
          color: var(--accent-gold);
        }

        .btn-col-delete {
          padding: 9px 12px;
          font-size: 12px;
          font-weight: 700;
          border-radius: 8px;
          cursor: pointer;
          border: 1px solid #e63946;
          background: rgba(230, 57, 70, 0.1);
          color: #e63946;
          transition: all 0.2s ease;
        }

        .btn-col-delete:hover {
          background: #e63946;
          color: #fff;
        }

        /* Modal Overlay */
        .col-modal-backdrop {
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

        .col-modal-box {
          background: var(--bg-secondary);
          border: 1px solid var(--accent-gold);
          border-radius: var(--border-radius-lg);
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 28px;
          box-shadow: var(--shadow-lg);
        }

        @media (max-width: 768px) {
          .col-top-header { flex-direction: column; align-items: flex-start; }
          .col-search-row { flex-direction: column; }
          .btn-add-collection { width: 100%; }
          .col-actions-bar { grid-template-columns: 1fr 1fr; }
          .btn-col-delete { grid-column: span 2; }
        }
      `}</style>

      {/* Top Header */}
      <div className="col-top-header">
        <div className="col-header-left">
          <h1 className="col-page-title">Handloom Collections</h1>
          <span className="col-count-pill">{filteredCollections.length} Total Collections</span>
        </div>
      </div>

      {/* Search & Filter Controls Panel */}
      <div className="col-controls-panel">
        {/* Search & Add Button */}
        <div className="col-search-row">
          <input 
            type="text" 
            className="col-search-input" 
            placeholder="Search collection name or description..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn-add-collection" onClick={() => setShowAddModal(true)}>
            + Add Collection
          </button>
        </div>

        {/* Filters & Sorting */}
        <div className="col-filters-grid">
          {/* Collection Type Filter */}
          <div className="col-filter-group">
            <span className="col-filter-label">Collection Type</span>
            <select className="col-select-dropdown" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
              <option value="All">All Types</option>
              <option value="Silk">Silk</option>
              <option value="Cotton">Cotton</option>
              <option value="Wedding">Wedding</option>
              <option value="Festive">Festive</option>
              <option value="Organic">Organic</option>
              <option value="Summer">Summer</option>
              <option value="Traditional">Traditional</option>
              <option value="Premium">Premium</option>
            </select>
          </div>

          {/* Number of Products Filter */}
          <div className="col-filter-group">
            <span className="col-filter-label">Number of Products</span>
            <select className="col-select-dropdown" value={selectedCountFilter} onChange={(e) => setSelectedCountFilter(e.target.value)}>
              <option value="All">All Counts</option>
              <option value="1-10 Products">1 - 10 Products</option>
              <option value="10+ Products">10+ Products</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="col-filter-group">
            <span className="col-filter-label">Sort By</span>
            <select className="col-select-dropdown" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
              <option value="recently_updated">Recently Updated</option>
              <option value="name_asc">Name: A to Z</option>
              <option value="stock_high">Total Stock: High to Low</option>
              <option value="products_high">Most Products</option>
            </select>
          </div>
        </div>
      </div>

      {/* Collections Grid */}
      {filteredCollections.length === 0 ? (
        <div style={{ background: 'var(--bg-secondary)', padding: '50px', borderRadius: '12px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No collections match your search and filter criteria.
        </div>
      ) : (
        <div className="collections-grid">
          {filteredCollections.map(collection => (
            <div key={collection.id} className="collection-card">
              <div className="col-cover-box">
                <img src={collection.coverImage} alt={collection.name} className="col-cover-img" />
                <span className="col-type-tag">✦ {collection.type}</span>
              </div>

              <div className="col-card-body">
                <h3 className="col-card-title">{collection.name}</h3>
                <p className="col-card-desc">{collection.description}</p>

                <div className="col-stats-row">
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Products</span>
                    <strong>{collection.productsCount} Items</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Total Stock</span>
                    <strong>{collection.totalStock} Units</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Updated</span>
                    <strong style={{ fontSize: '11px' }}>{collection.lastUpdated}</strong>
                  </div>
                </div>

                <div className="col-actions-bar">
                  <button className="btn-col-action" onClick={() => setActiveViewingCollection(collection)}>
                    👁️ View
                  </button>
                  <button className="btn-col-action" onClick={() => setEditingCollection({ ...collection })}>
                    ✏️ Edit
                  </button>
                  <button className="btn-col-delete" onClick={() => setDeletingCollection(collection)} title="Delete Collection">
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW COLLECTION PRODUCTS MODAL */}
      {activeViewingCollection && (
        <div className="col-modal-backdrop" onClick={() => setActiveViewingCollection(null)}>
          <div className="col-modal-box" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--accent-gold)', fontWeight: 700, textTransform: 'uppercase' }}>{activeViewingCollection.type} COLLECTION</span>
                <h2 style={{ margin: 0, fontSize: '24px', fontFamily: 'var(--font-heading)' }}>{activeViewingCollection.name}</h2>
              </div>
              <button onClick={() => setActiveViewingCollection(null)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.5 }}>
              {activeViewingCollection.description}
            </p>

            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
              Collection Products ({activeViewingCollection.productsList.length})
            </h3>

            {activeViewingCollection.productsList.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>No products assigned to this collection yet.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                {activeViewingCollection.productsList.map(prod => (
                  <div key={prod.id} style={{ display: 'flex', gap: '14px', background: 'var(--bg-primary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', alignItems: 'center' }}>
                    <img src={prod.image} alt={prod.name} style={{ width: '60px', height: '60px', borderRadius: '6px', objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 700 }}>{prod.name}</h4>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{prod.clothType} • Stock: <strong>{prod.stock}</strong></span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <strong style={{ display: 'block', fontSize: '15px', color: 'var(--accent-gold)' }}>₹{prod.price.toLocaleString()}</strong>
                      <span style={{ fontSize: '11px', color: prod.availability === 'In Stock' ? '#2a9d8f' : '#e63946', fontWeight: 700 }}>{prod.availability}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button className="btn-add-collection" style={{ width: '100%' }} onClick={() => setActiveViewingCollection(null)}>
              Close Collection
            </button>
          </div>
        </div>
      )}

      {/* ADD COLLECTION MODAL */}
      {showAddModal && (
        <div className="col-modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="col-modal-box" style={{ maxWidth: '480px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '22px', fontFamily: 'var(--font-heading)' }}>Add New Collection</h2>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleAddCollectionSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Collection Name *</label>
                <input 
                  type="text" 
                  className="col-select-dropdown" 
                  placeholder="e.g. Royal Pochampally Silk Collection" 
                  required 
                  value={newColName}
                  onChange={e => setNewColName(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Collection Type</label>
                <select className="col-select-dropdown" value={newColType} onChange={e => setNewColType(e.target.value as any)} style={{ width: '100%' }}>
                  <option value="Silk">Silk</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Festive">Festive</option>
                  <option value="Organic">Organic</option>
                  <option value="Summer">Summer</option>
                  <option value="Traditional">Traditional</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Description</label>
                <textarea 
                  className="col-select-dropdown" 
                  rows={3} 
                  placeholder="Describe the themes and weaves in this collection..."
                  value={newColDesc}
                  onChange={e => setNewColDesc(e.target.value)}
                  style={{ width: '100%', resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" className="btn-col-action" style={{ flex: 1 }} onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn-add-collection" style={{ flex: 1 }}>Create Collection</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT COLLECTION MODAL */}
      {editingCollection && (
        <div className="col-modal-backdrop" onClick={() => setEditingCollection(null)}>
          <div className="col-modal-box" style={{ maxWidth: '480px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '22px', fontFamily: 'var(--font-heading)' }}>Edit Collection</h2>
              <button onClick={() => setEditingCollection(null)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Collection Name</label>
                <input 
                  type="text" 
                  className="col-select-dropdown" 
                  value={editingCollection.name}
                  onChange={e => setEditingCollection({ ...editingCollection, name: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Collection Type</label>
                <select className="col-select-dropdown" value={editingCollection.type} onChange={e => setEditingCollection({ ...editingCollection, type: e.target.value as any })} style={{ width: '100%' }}>
                  <option value="Silk">Silk</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Festive">Festive</option>
                  <option value="Organic">Organic</option>
                  <option value="Summer">Summer</option>
                  <option value="Traditional">Traditional</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Description</label>
                <textarea 
                  className="col-select-dropdown" 
                  rows={3} 
                  value={editingCollection.description}
                  onChange={e => setEditingCollection({ ...editingCollection, description: e.target.value })}
                  style={{ width: '100%', resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" className="btn-col-action" style={{ flex: 1 }} onClick={() => setEditingCollection(null)}>Cancel</button>
                <button type="submit" className="btn-add-collection" style={{ flex: 1 }}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deletingCollection && (
        <div className="col-modal-backdrop" onClick={() => setDeletingCollection(null)}>
          <div className="col-modal-box" style={{ maxWidth: '400px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>⚠️</div>
            <h3 style={{ margin: '0 0 8px', fontSize: '20px', fontFamily: 'var(--font-heading)' }}>Delete Collection?</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Are you sure you want to remove <strong>{deletingCollection.name}</strong> from your collection portfolio?
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn-col-action" style={{ flex: 1 }} onClick={() => setDeletingCollection(null)}>Cancel</button>
              <button className="btn-col-delete" style={{ flex: 1 }} onClick={handleConfirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Collections;

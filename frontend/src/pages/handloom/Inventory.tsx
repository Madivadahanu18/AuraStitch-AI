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

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  clothType: string;
  category: string;
  availableStock: number;
  reservedStock: number;
  soldQuantity: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
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

const initialInventory: InventoryItem[] = [
  {
    id: 'inv-1',
    sku: 'HL-POC-001',
    name: 'Pochampally Ikat Saree',
    clothType: 'Saree',
    category: 'Wedding',
    availableStock: 45,
    reservedStock: 5,
    soldQuantity: 1250,
    status: 'In Stock',
    lastUpdated: '23 Jul 2026',
    image: getImageSrc(pochampallyImg)
  },
  {
    id: 'inv-2',
    sku: 'HL-KAN-002',
    name: 'Kanchipuram Pattu Saree',
    clothType: 'Saree',
    category: 'Wedding',
    availableStock: 18,
    reservedStock: 3,
    soldQuantity: 1890,
    status: 'Low Stock',
    lastUpdated: '23 Jul 2026',
    image: getImageSrc(pattuSareeImg)
  },
  {
    id: 'inv-3',
    sku: 'HL-COT-003',
    name: 'Premium Cotton Saree',
    clothType: 'Saree',
    category: 'Traditional',
    availableStock: 8,
    reservedStock: 2,
    soldQuantity: 940,
    status: 'Low Stock',
    lastUpdated: '21 Jul 2026',
    image: getImageSrc(cottonSareesImg)
  },
  {
    id: 'inv-4',
    sku: 'HL-MAN-004',
    name: 'Mangalagiri Dress Material',
    clothType: 'Handloom Dress Material',
    category: 'Casual',
    availableStock: 32,
    reservedStock: 4,
    soldQuantity: 820,
    status: 'In Stock',
    lastUpdated: '22 Jul 2026',
    image: getImageSrc(mangalagiriDressImg)
  },
  {
    id: 'inv-5',
    sku: 'HL-DHO-005',
    name: 'Handwoven Cotton Dhoti',
    clothType: 'Dhoti',
    category: 'Casual',
    availableStock: 50,
    reservedStock: 6,
    soldQuantity: 680,
    status: 'In Stock',
    lastUpdated: '20 Jul 2026',
    image: getImageSrc(dhotiImg)
  },
  {
    id: 'inv-6',
    sku: 'HL-VEN-006',
    name: 'Venkatagiri Zari Saree',
    clothType: 'Saree',
    category: 'Festive',
    availableStock: 6,
    reservedStock: 1,
    soldQuantity: 830,
    status: 'Low Stock',
    lastUpdated: '22 Jul 2026',
    image: getImageSrc(mangalagiriDressImg)
  },
  {
    id: 'inv-7',
    sku: 'HL-UPP-007',
    name: 'Uppada Jamdani Silk Saree',
    clothType: 'Saree',
    category: 'Wedding',
    availableStock: 12,
    reservedStock: 2,
    soldQuantity: 640,
    status: 'In Stock',
    lastUpdated: '20 Jul 2026',
    image: getImageSrc(pattuSareeImg)
  },
  {
    id: 'inv-8',
    sku: 'HL-KHA-008',
    name: 'Khadi Linen Fabric Roll',
    clothType: 'Fabric',
    category: 'Casual',
    availableStock: 0,
    reservedStock: 0,
    soldQuantity: 450,
    status: 'Out of Stock',
    lastUpdated: '18 Jul 2026',
    image: getImageSrc(cottonSareesImg)
  }
];

export const Inventory: React.FC = () => {
  const context = useOutletContext<OutletContextType | null>();
  const showToast = (msg: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    if (context?.showToast) context.showToast(msg, type);
    else alert(msg);
  };

  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);

  // Filters & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedClothType, setSelectedClothType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortOption, setSortOption] = useState('recently_updated');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewingItem, setViewingItem] = useState<InventoryItem | null>(null);
  const [updatingItem, setUpdatingItem] = useState<InventoryItem | null>(null);
  const [restockingItem, setRestockingItem] = useState<InventoryItem | null>(null);

  // New Inventory Item Form State
  const [newName, setNewName] = useState('');
  const [newSku, setNewSku] = useState('');
  const [newClothType, setNewClothType] = useState('Saree');
  const [newCategory, setNewCategory] = useState('Traditional');
  const [newStock, setNewStock] = useState<number>(25);

  // Restock Amount State
  const [restockAmount, setRestockAmount] = useState<number>(20);

  // Filtered & Sorted Inventory
  const filteredInventory = useMemo(() => {
    let result = inventory.filter(item => {
      const matchesSearch = !searchQuery || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.clothType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesCloth = selectedClothType === 'All' || item.clothType === selectedClothType;
      const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;

      return matchesSearch && matchesCat && matchesCloth && matchesStatus;
    });

    return result.sort((a, b) => {
      if (sortOption === 'sku_asc') return a.sku.localeCompare(b.sku);
      if (sortOption === 'stock_low_high') return a.availableStock - b.availableStock;
      if (sortOption === 'stock_high_low') return b.availableStock - a.availableStock;
      if (sortOption === 'sold_high') return b.soldQuantity - a.soldQuantity;
      return b.id.localeCompare(a.id); // Recently Updated default
    });
  }, [inventory, searchQuery, selectedCategory, selectedClothType, selectedStatus, sortOption]);

  // Export Inventory Handler
  const handleExportInventory = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["SKU,Name,Cloth Type,Category,Available Stock,Reserved Stock,Sold,Status,Last Updated"]
      .concat(filteredInventory.map(i => `"${i.sku}","${i.name}","${i.clothType}","${i.category}",${i.availableStock},${i.reservedStock},${i.soldQuantity},"${i.status}","${i.lastUpdated}"`))
      .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Handloom_Inventory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("Inventory list exported successfully as CSV!", "success");
  };

  // Add Inventory Handler
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const generatedSku = newSku.trim() ? newSku.trim().toUpperCase() : `HL-ART-${Math.floor(100 + Math.random() * 900)}`;
    const calcStatus = newStock === 0 ? 'Out of Stock' : newStock <= 10 ? 'Low Stock' : 'In Stock';

    const newItem: InventoryItem = {
      id: `inv-${Date.now()}`,
      sku: generatedSku,
      name: newName.trim(),
      clothType: newClothType,
      category: newCategory,
      availableStock: newStock,
      reservedStock: 0,
      soldQuantity: 0,
      status: calcStatus,
      lastUpdated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      image: getImageSrc(pochampallyImg)
    };

    setInventory([newItem, ...inventory]);
    showToast(`Added SKU ${newItem.sku} (${newItem.name}) to inventory list!`, "success");
    setShowAddModal(false);

    // Reset Form
    setNewName('');
    setNewSku('');
    setNewStock(25);
  };

  // Save Stock Update
  const handleSaveStockUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!updatingItem) return;

    setInventory(prev => prev.map(item => {
      if (item.id === updatingItem.id) {
        const calcStatus = updatingItem.availableStock === 0 ? 'Out of Stock' : updatingItem.availableStock <= 10 ? 'Low Stock' : 'In Stock';
        return {
          ...updatingItem,
          status: calcStatus,
          lastUpdated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        };
      }
      return item;
    }));

    showToast(`Updated stock levels for ${updatingItem.name} (${updatingItem.sku})`, "success");
    setUpdatingItem(null);
  };

  // Restock Submit Handler
  const handleRestockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockingItem || restockAmount <= 0) return;

    setInventory(prev => prev.map(item => {
      if (item.id === restockingItem.id) {
        const newTotalAvailable = item.availableStock + restockAmount;
        const calcStatus = newTotalAvailable <= 10 ? 'Low Stock' : 'In Stock';
        return {
          ...item,
          availableStock: newTotalAvailable,
          status: calcStatus,
          lastUpdated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        };
      }
      return item;
    }));

    showToast(`Restocked +${restockAmount} units for ${restockingItem.name}!`, "success");
    setRestockingItem(null);
  };

  return (
    <div className="handloom-inventory-container fade-in" style={{ padding: '24px', paddingBottom: '90px', maxWidth: '1240px', margin: '0 auto', color: 'var(--text-primary)' }}>
      <style>{`
        .inv-top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .inv-title-box {
          display: flex;
          align-items: baseline;
          gap: 14px;
        }

        .inv-main-title {
          font-family: var(--font-heading);
          font-size: 28px;
          font-weight: 800;
          margin: 0;
          color: var(--text-primary);
        }

        .inv-count-badge {
          background: rgba(197, 160, 89, 0.15);
          color: var(--accent-gold);
          border: 1px solid var(--accent-gold);
          padding: 4px 14px;
          border-radius: 16px;
          font-size: 13px;
          font-weight: 700;
        }

        /* Controls Panel */
        .inv-controls-panel {
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

        .inv-search-actions-row {
          display: flex;
          gap: 14px;
          align-items: center;
          width: 100%;
        }

        .inv-search-input {
          flex: 1;
          padding: 12px 20px;
          border-radius: 30px;
          border: 1px solid var(--border-color);
          background: var(--bg-primary);
          color: var(--text-primary);
          font-size: 14px;
          outline: none;
        }

        .inv-search-input:focus {
          border-color: var(--accent-gold);
        }

        .btn-inv-primary {
          padding: 12px 22px;
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

        .btn-inv-primary:hover {
          transform: translateY(-2px);
        }

        .btn-inv-secondary {
          padding: 12px 22px;
          border-radius: 30px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s ease;
        }

        .btn-inv-secondary:hover {
          border-color: var(--accent-gold);
          color: var(--accent-gold);
        }

        .inv-filters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 14px;
        }

        .inv-filter-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .inv-filter-label {
          font-size: 11px;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .inv-select-control {
          padding: 9px 12px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          background: var(--bg-primary);
          color: var(--text-primary);
          font-size: 13px;
          outline: none;
          cursor: pointer;
        }

        .inv-select-control:focus {
          border-color: var(--accent-gold);
        }

        /* Table Card Container */
        .inv-table-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
        }

        .inv-table-wrapper {
          width: 100%;
          overflow-x: auto;
        }

        .inv-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 13px;
        }

        .inv-table th {
          background: var(--bg-tertiary);
          color: var(--text-muted);
          font-weight: 700;
          text-transform: uppercase;
          font-size: 11px;
          letter-spacing: 0.6px;
          padding: 14px 16px;
          border-bottom: 1px solid var(--border-color);
          white-space: nowrap;
        }

        .inv-table td {
          padding: 14px 16px;
          border-bottom: 1px solid var(--border-color);
          vertical-align: middle;
        }

        .inv-table tr:hover td {
          background: rgba(197, 160, 89, 0.04);
        }

        .inv-img-thumb {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          object-fit: cover;
          border: 1px solid var(--border-color);
        }

        .sku-code {
          font-family: monospace;
          font-size: 12px;
          font-weight: 700;
          color: var(--accent-gold);
          background: rgba(197, 160, 89, 0.1);
          padding: 3px 8px;
          border-radius: 6px;
        }

        /* Status Badge Colors */
        .status-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 800;
          backdrop-filter: blur(4px);
        }

        .status-badge.In-Stock {
          background: rgba(42, 157, 143, 0.2);
          border: 1px solid #2a9d8f;
          color: #2a9d8f;
        }

        .status-badge.Low-Stock {
          background: rgba(244, 162, 97, 0.2);
          border: 1px solid #f4a261;
          color: #f4a261;
        }

        .status-badge.Out-of-Stock {
          background: rgba(230, 57, 70, 0.2);
          border: 1px solid #e63946;
          color: #e63946;
        }

        .row-actions-flex {
          display: flex;
          gap: 6px;
          align-items: center;
        }

        .btn-row-action {
          padding: 6px 10px;
          font-size: 11px;
          font-weight: 700;
          border-radius: 6px;
          cursor: pointer;
          border: 1px solid var(--border-color);
          background: var(--bg-primary);
          color: var(--text-primary);
          white-space: nowrap;
          transition: all 0.2s ease;
        }

        .btn-row-action:hover {
          border-color: var(--accent-gold);
          color: var(--accent-gold);
        }

        .btn-row-restock {
          padding: 6px 10px;
          font-size: 11px;
          font-weight: 700;
          border-radius: 6px;
          cursor: pointer;
          border: 1px solid var(--accent-gold);
          background: rgba(197, 160, 89, 0.15);
          color: var(--accent-gold);
          white-space: nowrap;
          transition: all 0.2s ease;
        }

        .btn-row-restock:hover {
          background: var(--accent-gold);
          color: #000;
        }

        /* Modal Backdrop */
        .inv-modal-backdrop {
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

        .inv-modal-dialog {
          background: var(--bg-secondary);
          border: 1px solid var(--accent-gold);
          border-radius: var(--border-radius-lg);
          width: 100%;
          max-width: 480px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 26px;
          box-shadow: var(--shadow-lg);
        }

        @media (max-width: 768px) {
          .inv-top-bar { flex-direction: column; align-items: flex-start; }
          .inv-search-actions-row { flex-direction: column; }
          .btn-inv-primary, .btn-inv-secondary { width: 100%; }
        }
      `}</style>

      {/* Top Section */}
      <div className="inv-top-bar">
        <div className="inv-title-box">
          <h1 className="inv-main-title">Inventory List</h1>
          <span className="inv-count-badge">{filteredInventory.length} Items Listed</span>
        </div>
      </div>

      {/* Search, Action Buttons & Filter Controls */}
      <div className="inv-controls-panel">
        {/* Search Bar & Action Buttons */}
        <div className="inv-search-actions-row">
          <input 
            type="text" 
            className="inv-search-input" 
            placeholder="Search SKU, product name, cloth type or category..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <button className="btn-inv-secondary" onClick={handleExportInventory}>
            📥 Export Inventory
          </button>
          <button className="btn-inv-primary" onClick={() => setShowAddModal(true)}>
            + Add Inventory
          </button>
        </div>

        {/* Filters */}
        <div className="inv-filters-grid">
          {/* Category Filter */}
          <div className="inv-filter-group">
            <span className="inv-filter-label">Category</span>
            <select className="inv-select-control" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
              <option value="All">All Categories</option>
              <option value="Traditional">Traditional</option>
              <option value="Wedding">Wedding</option>
              <option value="Festive">Festive</option>
              <option value="Casual">Casual</option>
            </select>
          </div>

          {/* Cloth Type Filter */}
          <div className="inv-filter-group">
            <span className="inv-filter-label">Cloth Type</span>
            <select className="inv-select-control" value={selectedClothType} onChange={e => setSelectedClothType(e.target.value)}>
              <option value="All">All Cloth Types</option>
              <option value="Saree">Saree</option>
              <option value="Dhoti">Dhoti</option>
              <option value="Handloom Dress Material">Dress Material</option>
              <option value="Fabric">Fabric</option>
            </select>
          </div>

          {/* Stock Status Filter */}
          <div className="inv-filter-group">
            <span className="inv-filter-label">Stock Status</span>
            <select className="inv-select-control" value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)}>
              <option value="All">All Statuses</option>
              <option value="In Stock">In Stock (Green)</option>
              <option value="Low Stock">Low Stock (Orange)</option>
              <option value="Out of Stock">Out of Stock (Red)</option>
            </select>
          </div>

          {/* Sort Option Filter */}
          <div className="inv-filter-group">
            <span className="inv-filter-label">Recently Updated / Sort</span>
            <select className="inv-select-control" value={sortOption} onChange={e => setSortOption(e.target.value)}>
              <option value="recently_updated">Recently Updated</option>
              <option value="sku_asc">SKU (A to Z)</option>
              <option value="stock_low_high">Available Stock: Low to High</option>
              <option value="stock_high_low">Available Stock: High to Low</option>
              <option value="sold_high">Sold Quantity: Highest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="inv-table-card">
        <div className="inv-table-wrapper">
          <table className="inv-table">
            <thead>
              <tr>
                <th>Product Image</th>
                <th>Product Name</th>
                <th>Cloth Type</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Available Stock</th>
                <th>Reserved Stock</th>
                <th>Sold Quantity</th>
                <th>Status</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={11} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                    No inventory records match your active search and filter settings.
                  </td>
                </tr>
              ) : (
                filteredInventory.map(item => (
                  <tr key={item.id}>
                    <td>
                      <img src={item.image} alt={item.name} className="inv-img-thumb" />
                    </td>
                    <td>
                      <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{item.name}</strong>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{item.clothType}</td>
                    <td>
                      <span className="sku-code">{item.sku}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>{item.category}</span>
                    </td>
                    <td>
                      <strong style={{ fontSize: '14px', color: item.availableStock <= 10 ? '#e63946' : 'var(--text-primary)' }}>
                        {item.availableStock} Units
                      </strong>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{item.reservedStock} Units</td>
                    <td>
                      <strong>{item.soldQuantity.toLocaleString()} Sold</strong>
                    </td>
                    <td>
                      <span className={`status-badge ${item.status.replace(/\s+/g, '-')}`}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.lastUpdated}</td>
                    <td>
                      <div className="row-actions-flex">
                        <button className="btn-row-action" onClick={() => setViewingItem(item)}>
                          👁️ View
                        </button>
                        <button className="btn-row-action" onClick={() => setUpdatingItem({ ...item })}>
                          ✏️ Update Stock
                        </button>
                        <button className="btn-row-restock" onClick={() => setRestockingItem(item)}>
                          ⚡ Restock
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW INVENTORY ITEM MODAL */}
      {viewingItem && (
        <div className="inv-modal-backdrop" onClick={() => setViewingItem(null)}>
          <div className="inv-modal-dialog" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', gap: '14px', marginBottom: '16px', alignItems: 'center' }}>
              <img src={viewingItem.image} alt={viewingItem.name} style={{ width: '70px', height: '70px', borderRadius: '8px', objectFit: 'cover' }} />
              <div>
                <span className="sku-code">{viewingItem.sku}</span>
                <h3 style={{ margin: '4px 0 2px', fontSize: '18px', fontFamily: 'var(--font-heading)' }}>{viewingItem.name}</h3>
                <span style={{ fontSize: '12px', color: 'var(--accent-gold)' }}>{viewingItem.clothType} • {viewingItem.category}</span>
              </div>
            </div>

            <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: '8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
              <div>Available Stock: <strong>{viewingItem.availableStock} Units</strong></div>
              <div>Reserved Stock: <strong>{viewingItem.reservedStock} Units</strong></div>
              <div>Total Sold: <strong>{viewingItem.soldQuantity.toLocaleString()} Sold</strong></div>
              <div>Stock Status: <strong style={{ color: viewingItem.status === 'In Stock' ? '#2a9d8f' : '#e63946' }}>{viewingItem.status}</strong></div>
              <div style={{ gridColumn: 'span 2' }}>Last Stock Update: <strong>{viewingItem.lastUpdated}</strong></div>
            </div>

            <button className="btn-inv-primary" style={{ width: '100%' }} onClick={() => setViewingItem(null)}>
              Close Item Details
            </button>
          </div>
        </div>
      )}

      {/* UPDATE STOCK MODAL */}
      {updatingItem && (
        <div className="inv-modal-backdrop" onClick={() => setUpdatingItem(null)}>
          <div className="inv-modal-dialog" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontFamily: 'var(--font-heading)' }}>Update Inventory Stock</h3>
              <button onClick={() => setUpdatingItem(null)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '18px' }}>
              Updating quantities for <strong>{updatingItem.name}</strong> (<span className="sku-code">{updatingItem.sku}</span>)
            </p>

            <form onSubmit={handleSaveStockUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Available Stock Units</label>
                <input 
                  type="number" 
                  className="inv-select-control" 
                  value={updatingItem.availableStock}
                  onChange={e => setUpdatingItem({ ...updatingItem, availableStock: Number(e.target.value) })}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Reserved Stock Units (Orders in Progress)</label>
                <input 
                  type="number" 
                  className="inv-select-control" 
                  value={updatingItem.reservedStock}
                  onChange={e => setUpdatingItem({ ...updatingItem, reservedStock: Number(e.target.value) })}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button type="button" className="btn-row-action" style={{ flex: 1, padding: '10px' }} onClick={() => setUpdatingItem(null)}>Cancel</button>
                <button type="submit" className="btn-inv-primary" style={{ flex: 1, padding: '10px' }}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESTOCK MODAL */}
      {restockingItem && (
        <div className="inv-modal-backdrop" onClick={() => setRestockingItem(null)}>
          <div className="inv-modal-dialog" style={{ maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontFamily: 'var(--font-heading)' }}>Loom Stock Restock</h3>
              <button onClick={() => setRestockingItem(null)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Add finished woven stock to <strong>{restockingItem.name}</strong> (<span className="sku-code">{restockingItem.sku}</span>).
            </p>

            <form onSubmit={handleRestockSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Restock Quantity (Units)</label>
                <input 
                  type="number" 
                  className="inv-select-control" 
                  value={restockAmount}
                  onChange={e => setRestockAmount(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                {[10, 20, 50].map(amt => (
                  <button key={amt} type="button" className="btn-row-action" style={{ flex: 1 }} onClick={() => setRestockAmount(amt)}>
                    +{amt}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button type="button" className="btn-row-action" style={{ flex: 1, padding: '10px' }} onClick={() => setRestockingItem(null)}>Cancel</button>
                <button type="submit" className="btn-inv-primary" style={{ flex: 1, padding: '10px' }}>Confirm Restock</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD INVENTORY MODAL */}
      {showAddModal && (
        <div className="inv-modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="inv-modal-dialog" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontFamily: 'var(--font-heading)' }}>Add New Inventory SKU</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Product Name *</label>
                <input 
                  type="text" 
                  className="inv-select-control" 
                  placeholder="e.g. Venkatagiri Jamdani Saree" 
                  required 
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>SKU Code (Optional)</label>
                  <input 
                    type="text" 
                    className="inv-select-control" 
                    placeholder="e.g. HL-VEN-009" 
                    value={newSku}
                    onChange={e => setNewSku(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Initial Stock Units</label>
                  <input 
                    type="number" 
                    className="inv-select-control" 
                    value={newStock}
                    onChange={e => setNewStock(Number(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Cloth Type</label>
                  <select className="inv-select-control" value={newClothType} onChange={e => setNewClothType(e.target.value)} style={{ width: '100%' }}>
                    <option value="Saree">Saree</option>
                    <option value="Dhoti">Dhoti</option>
                    <option value="Handloom Dress Material">Dress Material</option>
                    <option value="Fabric">Fabric</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Category</label>
                  <select className="inv-select-control" value={newCategory} onChange={e => setNewCategory(e.target.value)} style={{ width: '100%' }}>
                    <option value="Traditional">Traditional</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Festive">Festive</option>
                    <option value="Casual">Casual</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" className="btn-row-action" style={{ flex: 1, padding: '10px' }} onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn-inv-primary" style={{ flex: 1, padding: '10px' }}>Add SKU Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;

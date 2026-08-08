import React, { useState, useRef } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

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

interface ProductItem {
  id: string;
  name: string;
  category: 'Textile Materials' | 'Handloom Materials';
  subCategory: string;
  price: string;
  numericPrice: number;
  stock: number;
  rating: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  image: string;
  description: string;
}

const mockSupplierProducts: ProductItem[] = [
  {
    id: 'sp-1',
    name: 'Designer Glass & Pearl Beads Pack',
    category: 'Textile Materials',
    subCategory: 'Beads & Accessories',
    price: '₹450 / pack',
    numericPrice: 450,
    stock: 120,
    rating: 4.9,
    status: 'In Stock',
    image: getImageSrc(beads1Img),
    description: 'High-grade decorative glass and pearl beads for boutique dresses, blouses, and heavy embroidery work.'
  },
  {
    id: 'sp-2',
    name: 'Royal Embroidered Border Laces & Trims',
    category: 'Textile Materials',
    subCategory: 'Laces & Linings',
    price: '₹680 / roll',
    numericPrice: 680,
    stock: 85,
    rating: 4.8,
    status: 'In Stock',
    image: getImageSrc(lays1Img),
    description: 'Intricate embroidered lace borders suitable for dress materials, sarees, and designer garment borders.'
  },
  {
    id: 'sp-3',
    name: 'Multicolor Craft Beads & Embellishments',
    category: 'Textile Materials',
    subCategory: 'Beads & Dress Materials',
    price: '₹520 / pack',
    numericPrice: 520,
    stock: 14,
    rating: 4.7,
    status: 'Low Stock',
    image: getImageSrc(beads2Img),
    description: 'Assorted vibrant crafting beads and embellishments for fashion designers and custom dressmakers.'
  },
  {
    id: 'sp-4',
    name: 'Premium High-Count Weaving Yarns',
    category: 'Handloom Materials',
    subCategory: 'Yarns & Dyes',
    price: '₹1,250 / bundle',
    numericPrice: 1250,
    stock: 200,
    rating: 4.9,
    status: 'In Stock',
    image: getImageSrc(threads1Img),
    description: 'Combed cotton and silk weaving yarn spools engineered for traditional handloom pit looms.'
  },
  {
    id: 'sp-5',
    name: 'Heavy-Duty Handloom Shuttle & Spare Assembly',
    category: 'Handloom Materials',
    subCategory: 'Machine Spare Parts',
    price: '₹1,850 / set',
    numericPrice: 1850,
    stock: 42,
    rating: 4.8,
    status: 'In Stock',
    image: getImageSrc(machinary1Img),
    description: 'Precision-crafted wooden shuttles, reeds, and mechanical components for artisan looms.'
  },
  {
    id: 'sp-6',
    name: 'Industrial Loom Machinery Spare Parts',
    category: 'Handloom Materials',
    subCategory: 'Weaving Accessories',
    price: '₹2,400 / kit',
    numericPrice: 2400,
    stock: 8,
    rating: 4.9,
    status: 'Low Stock',
    image: getImageSrc(machinary2Img),
    description: 'Essential replacement gears, shafts, and weaving accessories for handloom & powerloom maintenance.'
  }
];

interface SupplierMaterialCardItem {
  id: string;
  name: string;
  category: 'Textile Materials' | 'Handloom Materials';
  price: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  image: string;
}

const featuredTextileMaterials: SupplierMaterialCardItem[] = [
  {
    id: 'tex-1',
    name: 'Cotton Fabric',
    category: 'Textile Materials',
    price: '₹350 / meter',
    status: 'In Stock',
    image: getImageSrc(lays1Img)
  },
  {
    id: 'tex-2',
    name: 'Silk Fabric',
    category: 'Textile Materials',
    price: '₹850 / meter',
    status: 'In Stock',
    image: getImageSrc(lays1Img)
  },
  {
    id: 'tex-3',
    name: 'Lining Material',
    category: 'Textile Materials',
    price: '₹120 / meter',
    status: 'In Stock',
    image: getImageSrc(lays1Img)
  },
  {
    id: 'tex-4',
    name: 'Bridal Lace',
    category: 'Textile Materials',
    price: '₹680 / roll',
    status: 'In Stock',
    image: getImageSrc(lays1Img)
  },
  {
    id: 'tex-5',
    name: 'Decorative Beads',
    category: 'Textile Materials',
    price: '₹450 / pack',
    status: 'In Stock',
    image: getImageSrc(beads1Img)
  },
  {
    id: 'tex-6',
    name: 'Designer Buttons',
    category: 'Textile Materials',
    price: '₹280 / box',
    status: 'In Stock',
    image: getImageSrc(beads1Img)
  },
  {
    id: 'tex-7',
    name: 'Zippers',
    category: 'Textile Materials',
    price: '₹150 / dozen',
    status: 'In Stock',
    image: getImageSrc(beads2Img)
  },
  {
    id: 'tex-8',
    name: 'Embroidery Thread',
    category: 'Textile Materials',
    price: '₹320 / set',
    status: 'In Stock',
    image: getImageSrc(threads1Img)
  }
];

const featuredHandloomMaterials: SupplierMaterialCardItem[] = [
  {
    id: 'hlm-1',
    name: 'Cotton Yarn',
    category: 'Handloom Materials',
    price: '₹650 / kg',
    status: 'In Stock',
    image: getImageSrc(threads1Img)
  },
  {
    id: 'hlm-2',
    name: 'Silk Yarn',
    category: 'Handloom Materials',
    price: '₹1,850 / kg',
    status: 'In Stock',
    image: getImageSrc(threads1Img)
  },
  {
    id: 'hlm-3',
    name: 'Natural Dyes',
    category: 'Handloom Materials',
    price: '₹480 / pack',
    status: 'In Stock',
    image: getImageSrc(machinary2Img)
  },
  {
    id: 'hlm-4',
    name: 'Zari Thread',
    category: 'Handloom Materials',
    price: '₹920 / spool',
    status: 'In Stock',
    image: getImageSrc(threads1Img)
  },
  {
    id: 'hlm-5',
    name: 'Loom Shuttle',
    category: 'Handloom Materials',
    price: '₹1,250 / piece',
    status: 'In Stock',
    image: getImageSrc(machinary1Img)
  },
  {
    id: 'hlm-6',
    name: 'Reed',
    category: 'Handloom Materials',
    price: '₹850 / piece',
    status: 'Low Stock',
    image: getImageSrc(machinary1Img)
  },
  {
    id: 'hlm-7',
    name: 'Machine Spare Parts',
    category: 'Handloom Materials',
    price: '₹2,400 / kit',
    status: 'Low Stock',
    image: getImageSrc(machinary2Img)
  },
  {
    id: 'hlm-8',
    name: 'Weaving Tools',
    category: 'Handloom Materials',
    price: '₹750 / set',
    status: 'In Stock',
    image: getImageSrc(machinary1Img)
  }
];

const mockRecentOrders = [
  {
    id: 'ORD-101',
    productName: 'Designer Glass & Pearl Beads Pack',
    productImage: getImageSrc(beads1Img),
    buyerName: 'Pochampally Weavers Guild',
    quantity: '25 packs',
    status: 'Processing'
  },
  {
    id: 'ORD-102',
    productName: 'Premium High-Count Weaving Yarns',
    productImage: getImageSrc(threads1Img),
    buyerName: 'Kanchi Heritage Silks',
    quantity: '50 kg',
    status: 'Ready to Ship'
  },
  {
    id: 'ORD-103',
    productName: 'Heavy-Duty Handloom Shuttle Assembly',
    productImage: getImageSrc(machinary1Img),
    buyerName: 'Mangalagiri Artisan Co-op',
    quantity: '10 sets',
    status: 'Delivered'
  }
];

const mockInventoryAlerts = [
  {
    id: 'inv-1',
    name: 'Multicolor Craft Beads & Embellishments',
    image: getImageSrc(beads2Img),
    quantityText: 'Only 5 left',
    badgeType: 'critical'
  },
  {
    id: 'inv-2',
    name: 'Industrial Loom Machinery Spare Parts',
    image: getImageSrc(machinary2Img),
    quantityText: 'Low Stock (8 units remaining)',
    badgeType: 'warning'
  },
  {
    id: 'inv-3',
    name: 'Natural Indigo Organic Dye Powder',
    image: getImageSrc(machinary1Img),
    quantityText: 'Out of Stock',
    badgeType: 'out'
  }
];

const supplierNavCards = [
  {
    icon: '📦',
    title: 'Products',
    description: 'Manage your textile and handloom material listings and pricing.'
  },
  {
    icon: '📊',
    title: 'Inventory',
    description: 'Track stock levels, set reorder points, and handle warehouse stock.'
  },
  {
    icon: '🛍️',
    title: 'Orders',
    description: 'Fulfill B2B buyer purchases, track dispatches, and delivery status.'
  },
  {
    icon: '💬',
    title: 'Messages',
    description: 'Chat directly with artisan weavers, tailors, and bulk buyers.'
  },
  {
    icon: '📈',
    title: 'Analytics',
    description: 'View sales performance, popular raw materials, and revenue insights.'
  },
  {
    icon: '⚙️',
    title: 'Settings',
    description: 'Update business GSTIN, warehouse address, and profile preferences.'
  }
];

export const SupplierDashboard: React.FC = () => {
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

  const [products] = useState<ProductItem[]>(mockSupplierProducts);
  const [activeCategory, setActiveCategory] = useState<'All' | 'Textile Materials' | 'Handloom Materials'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingProduct, setViewingProduct] = useState<ProductItem | null>(null);

  const productsSectionRef = useRef<HTMLDivElement>(null);

  const handleQuickAction = (category: 'Textile Materials' | 'Handloom Materials') => {
    setActiveCategory(category);
    if (productsSectionRef.current) {
      productsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    showToast(`Viewing ${category} catalog`, 'info');
  };

  const filteredProducts = products.filter(prod => {
    const matchesCategory = activeCategory === 'All' || prod.category === activeCategory;
    const matchesSearch = !searchQuery ||
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.subCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="supplier-dashboard-container fade-in" style={{ paddingBottom: '80px', color: 'var(--text-primary)' }}>
      <style>{`
        .supplier-dashboard-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px;
        }

        .dashboard-header-block {
          margin-bottom: 28px;
        }

        .dashboard-main-title {
          font-family: var(--font-heading);
          font-size: 28px;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 6px;
        }

        .dashboard-sub-text {
          color: var(--text-secondary);
          font-size: 14px;
          line-height: 1.5;
        }

        .summary-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-bottom: 36px;
        }

        .summary-card {
          background: linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary));
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          padding: 24px;
          box-shadow: var(--shadow-sm);
          transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
        }

        .summary-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(to bottom, var(--accent-gold), var(--accent-maroon));
        }

        .summary-card:hover {
          transform: translateY(-5px);
          border-color: var(--accent-gold);
          box-shadow: var(--shadow-hover);
        }

        .summary-card-title {
          font-size: 13px;
          color: var(--text-secondary);
          font-weight: 600;
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .summary-card-value {
          font-size: 32px;
          font-weight: 800;
          line-height: 1;
        }

        .quick-actions-section {
          margin-bottom: 48px;
        }

        .quick-actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
          gap: 24px;
        }

        .quick-action-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .quick-action-card:hover {
          transform: translateY(-4px);
          border-color: var(--accent-gold);
          box-shadow: var(--shadow-md);
        }

        .quick-card-img-wrapper {
          height: 200px;
          overflow: hidden;
          position: relative;
          background-color: #111115;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 2px;
        }

        .quick-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .quick-action-card:hover .quick-card-img {
          transform: scale(1.05);
        }

        .quick-card-content {
          padding: 24px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .quick-card-title {
          font-family: var(--font-heading);
          font-size: 20px;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 10px;
        }

        .quick-card-desc {
          color: var(--text-secondary);
          font-size: 14px;
          line-height: 1.5;
          margin-bottom: 24px;
          flex: 1;
        }

        .quick-card-btn {
          width: 100%;
          padding: 12px 20px;
          border-radius: var(--border-radius-md);
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        /* Featured Categories */
        .featured-categories-section {
          margin-bottom: 48px;
        }

        .featured-categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 20px;
        }

        .featured-category-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease, border-color 0.3s ease;
        }

        .featured-category-card:hover {
          transform: translateY(-4px);
          border-color: var(--accent-gold);
          box-shadow: var(--shadow-md);
        }

        .cat-card-img-box {
          width: 100%;
          height: 150px;
          overflow: hidden;
          background-color: #111115;
        }

        .cat-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .featured-category-card:hover .cat-card-img {
          transform: scale(1.06);
        }

        .cat-card-body {
          padding: 16px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .cat-card-title {
          font-family: var(--font-heading);
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 6px;
        }

        .cat-card-desc {
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.4;
          margin: 0;
        }

        /* Featured Textile & Handloom Materials */
        .featured-materials-section {
          margin-bottom: 48px;
        }

        .material-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 20px;
        }

        .material-item-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .material-item-card:hover {
          transform: translateY(-4px);
          border-color: var(--accent-gold);
          box-shadow: var(--shadow-md);
        }

        .material-card-img-box {
          position: relative;
          width: 100%;
          height: 160px;
          overflow: hidden;
          background-color: #111115;
        }

        .material-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .material-item-card:hover .material-card-img {
          transform: scale(1.05);
        }

        .material-status-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 700;
        }

        .material-status-badge.In-Stock {
          background: rgba(42, 157, 143, 0.2);
          border: 1px solid #2a9d8f;
          color: #2a9d8f;
        }

        .material-status-badge.Low-Stock {
          background: rgba(244, 162, 97, 0.2);
          border: 1px solid #f4a261;
          color: #f4a261;
        }

        .material-status-badge.Out-of-Stock {
          background: rgba(230, 57, 70, 0.2);
          border: 1px solid #e63946;
          color: #e63946;
        }

        .material-card-body {
          padding: 16px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .material-category-tag {
          font-size: 11px;
          font-weight: 700;
          color: var(--accent-gold);
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 4px;
        }

        .material-card-title {
          font-family: var(--font-heading);
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 8px;
          line-height: 1.3;
        }

        .material-card-price {
          font-size: 16px;
          font-weight: 800;
          color: var(--text-primary);
          margin-top: auto;
        }

        /* Recent Orders */
        .recent-orders-section {
          margin-bottom: 48px;
        }

        .recent-orders-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .recent-order-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          display: flex;
          gap: 16px;
          padding: 16px;
          align-items: center;
          transition: transform 0.3s ease, border-color 0.3s ease;
        }

        .recent-order-card:hover {
          transform: translateY(-3px);
          border-color: var(--accent-gold);
          box-shadow: var(--shadow-md);
        }

        .order-img-box {
          width: 90px;
          height: 90px;
          border-radius: var(--border-radius-md);
          overflow: hidden;
          flex-shrink: 0;
          background-color: #111115;
        }

        .order-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .order-info-box {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }

        .order-prod-title {
          font-family: var(--font-heading);
          font-size: 15px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
          line-height: 1.3;
        }

        .order-meta-text {
          font-size: 13px;
          color: var(--text-secondary);
        }

        .order-status-badge {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 700;
          width: fit-content;
          margin-top: 4px;
        }

        .order-status-badge.Processing {
          background: rgba(244, 162, 97, 0.2);
          border: 1px solid #f4a261;
          color: #f4a261;
        }

        .order-status-badge.Ready-to-Ship {
          background: rgba(42, 157, 143, 0.2);
          border: 1px solid #2a9d8f;
          color: #2a9d8f;
        }

        .order-status-badge.Delivered {
          background: rgba(58, 134, 255, 0.2);
          border: 1px solid #3a86ff;
          color: #3a86ff;
        }

        /* Inventory Alerts */
        .inventory-alerts-section {
          margin-bottom: 48px;
        }

        .inventory-alerts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .inventory-alert-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: var(--shadow-sm);
          transition: transform 0.3s ease, border-color 0.3s ease;
        }

        .inventory-alert-card.critical {
          border-left: 4px solid #e63946;
        }

        .inventory-alert-card.warning {
          border-left: 4px solid #f4a261;
        }

        .inventory-alert-card.out {
          border-left: 4px solid #d62828;
        }

        .inventory-alert-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-md);
        }

        .alert-img-box {
          width: 80px;
          height: 80px;
          border-radius: var(--border-radius-md);
          overflow: hidden;
          flex-shrink: 0;
          background-color: #111115;
        }

        .alert-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .alert-info-box {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }

        .alert-prod-name {
          font-family: var(--font-heading);
          font-size: 15px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
          line-height: 1.3;
        }

        .alert-qty-tag {
          font-size: 13px;
          font-weight: 700;
          display: inline-block;
          margin-top: 4px;
        }

        .alert-qty-tag.critical {
          color: #e63946;
        }

        .alert-qty-tag.warning {
          color: #f4a261;
        }

        .alert-qty-tag.out {
          color: #d62828;
        }

        /* Supplier Quick Nav Section */
        .supplier-nav-section {
          margin-top: 55px;
          margin-bottom: 40px;
        }

        .supplier-nav-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }

        .supplier-nav-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          padding: 22px;
          display: flex;
          align-items: flex-start;
          gap: 16px;
          box-shadow: var(--shadow-sm);
          transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
        }

        .supplier-nav-card:hover {
          transform: translateY(-4px);
          border-color: var(--accent-gold);
          box-shadow: var(--shadow-md);
        }

        .nav-card-icon {
          font-size: 28px;
          width: 50px;
          height: 50px;
          border-radius: var(--border-radius-md);
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .nav-card-body {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .nav-card-title {
          font-family: var(--font-heading);
          font-size: 17px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
        }

        .nav-card-desc {
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.4;
          margin: 0;
        }

        .section-heading {
          font-family: var(--font-heading);
          font-size: 22px;
          font-weight: 800;
          margin-bottom: 20px;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .section-heading::before {
          content: '';
          display: inline-block;
          width: 4px;
          height: 22px;
          background: var(--accent-gold);
          border-radius: 4px;
        }

        .filter-tabs-bar {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .category-tab-btn {
          padding: 8px 18px;
          border-radius: 20px;
          border: 1px solid var(--border-color);
          background: var(--bg-secondary);
          color: var(--text-secondary);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .category-tab-btn.active {
          background: var(--accent-gold);
          color: #0A0F19;
          border-color: var(--accent-gold);
          font-weight: 700;
        }

        .search-box-input {
          padding: 9px 16px;
          border-radius: 20px;
          border: 1px solid var(--border-color);
          background: var(--bg-secondary);
          color: var(--text-primary);
          font-size: 13px;
          outline: none;
          min-width: 240px;
        }

        .search-box-input:focus {
          border-color: var(--accent-gold);
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }

        .product-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease, border-color 0.3s ease;
        }

        .product-card:hover {
          transform: translateY(-4px);
          border-color: var(--accent-gold);
          box-shadow: var(--shadow-md);
        }

        .prod-img-box {
          position: relative;
          width: 100%;
          height: 220px;
          overflow: hidden;
          background-color: #111115;
        }

        .prod-img-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .product-card:hover .prod-img-box img {
          transform: scale(1.05);
        }

        .category-tag {
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

        .status-pill {
          position: absolute;
          top: 12px;
          right: 12px;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 700;
        }

        .status-pill.In-Stock {
          background: rgba(42, 157, 143, 0.2);
          border: 1px solid #2a9d8f;
          color: #2a9d8f;
        }

        .status-pill.Low-Stock {
          background: rgba(244, 162, 97, 0.2);
          border: 1px solid #f4a261;
          color: #f4a261;
        }

        .product-card-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .prod-sub-cat {
          font-size: 11px;
          font-weight: 700;
          color: var(--accent-gold);
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 4px;
        }

        .prod-title {
          font-family: var(--font-heading);
          font-size: 17px;
          font-weight: 700;
          margin-bottom: 8px;
          color: var(--text-primary);
          line-height: 1.3;
        }

        .prod-desc {
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.4;
          margin-bottom: 14px;
        }

        .prod-meta-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
          padding-top: 12px;
          border-top: 1px dashed var(--border-color);
        }

        .prod-price {
          font-size: 18px;
          font-weight: 800;
          color: var(--text-primary);
        }

        .modal-overlay {
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

        .modal-content-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          max-width: 520px;
          width: 100%;
          overflow: hidden;
          box-shadow: var(--shadow-md);
        }
      `}</style>

      <div className="dashboard-header-block">
        <h2 className="dashboard-main-title">Supplier Workspace</h2>
        <p className="dashboard-sub-text">
          Welcome back, {user?.name || 'Valued Supplier'}. Manage your material inventory, fulfill artisan orders, and expand your B2B supplier reach.
        </p>
      </div>

      <div className="summary-cards-grid">
        <div className="summary-card">
          <div className="summary-card-title">Total Products</div>
          <div className="summary-card-value" style={{ color: 'var(--accent-gold)' }}>
            {products.length}
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-card-title">Active Orders</div>
          <div className="summary-card-value" style={{ color: 'var(--accent-teal)' }}>
            18
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-card-title">Pending Deliveries</div>
          <div className="summary-card-value" style={{ color: '#E65C00' }}>
            5
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-card-title">Supplier Rating</div>
          <div className="summary-card-value" style={{ color: '#ffb703' }}>
            4.9 ★
          </div>
        </div>
      </div>

      <div className="quick-actions-section">
        <h3 className="section-heading">Quick Actions</h3>
        <div className="quick-actions-grid">
          <div className="quick-action-card">
            <div className="quick-card-img-wrapper">
              <img src={getImageSrc(beads1Img)} alt="Beads" className="quick-card-img" />
              <img src={getImageSrc(lays1Img)} alt="Laces" className="quick-card-img" />
              <img src={getImageSrc(beads2Img)} alt="Accessories" className="quick-card-img" />
            </div>
            <div className="quick-card-content">
              <h4 className="quick-card-title">Manage Textile Materials</h4>
              <p className="quick-card-desc">
                Manage fabrics, beads, laces, linings, dress materials and accessories.
              </p>
              <button
                className="quick-card-btn btn-primary"
                onClick={() => handleQuickAction('Textile Materials')}
              >
                View Products
              </button>
            </div>
          </div>

          <div className="quick-action-card">
            <div className="quick-card-img-wrapper">
              <img src={getImageSrc(threads1Img)} alt="Yarns" className="quick-card-img" />
              <img src={getImageSrc(machinary1Img)} alt="Shuttle" className="quick-card-img" />
              <img src={getImageSrc(machinary2Img)} alt="Machinery" className="quick-card-img" />
            </div>
            <div className="quick-card-content">
              <h4 className="quick-card-title">Manage Handloom Materials</h4>
              <p className="quick-card-desc">
                Manage yarns, dyes, machine spare parts and weaving accessories.
              </p>
              <button
                className="quick-card-btn btn-primary"
                onClick={() => handleQuickAction('Handloom Materials')}
              >
                View Products
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Textile Materials Section */}
      <div className="featured-materials-section">
        <h3 className="section-heading">Featured Textile Materials</h3>
        <div className="material-cards-grid">
          {featuredTextileMaterials.map((item) => (
            <div key={item.id} className="material-item-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/product-details', { state: { product: item } })}>
              <div className="material-card-img-box">
                <img src={item.image} alt={item.name} className="material-card-img" />
                <span className={`material-status-badge ${item.status.replace(/\s+/g, '-')}`}>
                  {item.status}
                </span>
              </div>
              <div className="material-card-body">
                <span className="material-category-tag">{item.category}</span>
                <h4 className="material-card-title">{item.name}</h4>
                <div className="material-card-price">{item.price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Handloom Materials Section */}
      <div className="featured-materials-section">
        <h3 className="section-heading">Featured Handloom Materials</h3>
        <div className="material-cards-grid">
          {featuredHandloomMaterials.map((item) => (
            <div key={item.id} className="material-item-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/product-details', { state: { product: item } })}>
              <div className="material-card-img-box">
                <img src={item.image} alt={item.name} className="material-card-img" />
                <span className={`material-status-badge ${item.status.replace(/\s+/g, '-')}`}>
                  {item.status}
                </span>
              </div>
              <div className="material-card-body">
                <span className="material-category-tag">{item.category}</span>
                <h4 className="material-card-title">{item.name}</h4>
                <div className="material-card-price">{item.price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="recent-orders-section">
        <h3 className="section-heading">Recent Orders</h3>
        <div className="recent-orders-grid">
          {mockRecentOrders.map(order => (
            <div key={order.id} className="recent-order-card">
              <div className="order-img-box">
                <img src={order.productImage} alt={order.productName} className="order-img" />
              </div>
              <div className="order-info-box">
                <h4 className="order-prod-title">{order.productName}</h4>
                <span className="order-meta-text">👤 <strong>Buyer:</strong> {order.buyerName}</span>
                <span className="order-meta-text">📦 <strong>Qty:</strong> {order.quantity}</span>
                <span className={`order-status-badge ${order.status.replace(/\s+/g, '-')}`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inventory Alerts Section */}
      <div className="inventory-alerts-section">
        <h3 className="section-heading">Inventory Alerts</h3>
        <div className="inventory-alerts-grid">
          {mockInventoryAlerts.map(alert => (
            <div key={alert.id} className={`inventory-alert-card ${alert.badgeType}`}>
              <div className="alert-img-box">
                <img src={alert.image} alt={alert.name} className="alert-img" />
              </div>
              <div className="alert-info-box">
                <h4 className="alert-prod-name">{alert.name}</h4>
                <span className={`alert-qty-tag ${alert.badgeType}`}>
                  ⚠️ {alert.quantityText}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div ref={productsSectionRef}>
        <h3 className="section-heading">
          Material Catalog ({filteredProducts.length})
        </h3>

        <div className="filter-tabs-bar">
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className={`category-tab-btn ${activeCategory === 'All' ? 'active' : ''}`}
              onClick={() => setActiveCategory('All')}
            >
              All Materials
            </button>
            <button
              className={`category-tab-btn ${activeCategory === 'Textile Materials' ? 'active' : ''}`}
              onClick={() => setActiveCategory('Textile Materials')}
            >
              Textile Materials
            </button>
            <button
              className={`category-tab-btn ${activeCategory === 'Handloom Materials' ? 'active' : ''}`}
              onClick={() => setActiveCategory('Handloom Materials')}
            >
              Handloom Materials
            </button>
          </div>

          <input
            type="text"
            className="search-box-input"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {filteredProducts.length === 0 ? (
          <div style={{ background: 'var(--bg-secondary)', padding: '40px', borderRadius: '12px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No materials found matching your current search or filter.
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map(prod => (
              <div key={prod.id} className="product-card">
                <div className="prod-img-box" style={{ cursor: 'pointer' }} onClick={() => navigate('/product-details', { state: { product: prod } })}>
                  <img src={prod.image} alt={prod.name} />
                  <span className="category-tag">{prod.category}</span>
                  <span className={`status-pill ${prod.status.replace(/\s+/g, '-')}`}>{prod.status}</span>
                </div>
                <div className="product-card-body">
                  <div className="prod-sub-cat">{prod.subCategory}</div>
                  <h4 className="prod-title" style={{ cursor: 'pointer' }} onClick={() => navigate('/product-details', { state: { product: prod } })}>{prod.name}</h4>
                  <p className="prod-desc">{prod.description}</p>
                  <div className="prod-meta-row">
                    <div>
                      <span className="prod-price">{prod.price}</span>
                      <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)' }}>Stock: {prod.stock} units</span>
                    </div>
                    <button
                      className="btn-secondary"
                      style={{ padding: '8px 14px', fontSize: '12px' }}
                      onClick={() => navigate('/product-details', { state: { product: prod } })}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Supplier Hub Navigation Cards */}
      <div className="supplier-nav-section">
        <h3 className="section-heading">Workspace Management</h3>
        <div className="supplier-nav-grid">
          {supplierNavCards.map((card, idx) => (
            <div
              key={idx}
              className="supplier-nav-card"
              onClick={() => showToast(`Opened ${card.title} Hub`, 'info')}
            >
              <div className="nav-card-icon">{card.icon}</div>
              <div className="nav-card-body">
                <h4 className="nav-card-title">{card.title}</h4>
                <p className="nav-card-desc">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {viewingProduct && (
        <div className="modal-overlay" onClick={() => setViewingProduct(null)}>
          <div className="modal-content-card" onClick={(e) => e.stopPropagation()}>
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
                {viewingProduct.category} • {viewingProduct.subCategory}
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '10px' }}>{viewingProduct.name}</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '20px' }}>
                {viewingProduct.description}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-primary)', padding: '14px', borderRadius: '8px', marginBottom: '20px', border: '1px solid var(--border-color)' }}>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Unit Price</span>
                  <strong style={{ fontSize: '18px', color: 'var(--text-primary)' }}>{viewingProduct.price}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Available Inventory</span>
                  <strong style={{ fontSize: '16px' }}>{viewingProduct.stock} Units</strong>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Rating</span>
                  <strong style={{ fontSize: '16px', color: '#ffb703' }}>★ {viewingProduct.rating}</strong>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn-secondary" style={{ flex: 1, padding: '10px' }} onClick={() => setViewingProduct(null)}>
                  Close
                </button>
                <button className="btn-primary" style={{ flex: 1, padding: '10px' }} onClick={() => { setViewingProduct(null); showToast(`Updated inventory settings for ${viewingProduct.name}`, 'success'); }}>
                  Update Stock
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

import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import ProductDetails, { sampleDefaultProduct, type ProductDetailsData } from '../components/ProductDetails';

// Import local image assets for dynamic product lookups
import kanchipuramSareeImg from './customer/images/kanchipuramsaree.jpg';
import pochampallyDressImg from './customer/images/pochampallydress.jpg';
import mangalagiriDressImg from './customer/images/Mangalagiridress.jpg';
import dhotiImg from './customer/images/dothi.jpg';
import dupattaImg from './customer/images/duppatta.jpg';

import beads1Img from './supplier/images/Beads1.jpg';
import beads2Img from './supplier/images/Beads2.jpg';
import lays1Img from './supplier/images/Lays1.jpg';
import machinary1Img from './supplier/images/Machinary1.jpg';
import machinary2Img from './supplier/images/Machinary2.jpg';
import threads1Img from './supplier/images/Threads1.jpg';

const getImageSrc = (img: any): string => {
  if (!img) return '';
  if (typeof img === 'string') return img;
  if (typeof img === 'object' && 'default' in img) return (img as any).default;
  return String(img);
};

// Catalogue of sample products for different roles (Handloom, Supplier, Tailor, Customer)
const productCatalogue: Record<string, ProductDetailsData> = {
  'prod-101': {
    id: 'prod-101',
    name: 'Kanchipuram Heavy Brocade Silk Saree',
    category: 'Silk Sarees',
    brandOrArtisan: 'Master Weaver K. Ramanathan (Kanchi Handlooms)',
    rating: 4.9,
    totalReviews: 142,
    price: '₹14,500',
    originalPrice: '₹18,000',
    discountPercentage: '20% OFF',
    availability: 'In Stock',
    deliveryEstimate: 'Delivered within 3-5 Business Days',
    description: 'Traditional Kanchipuram silk saree with intricate gold zari brocade work across the body and heavy temple motif pallu. Comes with an unstitched matching blouse piece.',
    images: [
      getImageSrc(kanchipuramSareeImg),
      getImageSrc(pochampallyDressImg),
      getImageSrc(mangalagiriDressImg)
    ],
    specifications: [
      { key: 'Material', value: '100% Pure Mulberry Silk' },
      { key: 'Zari Type', value: 'Pure Gold Tested Zari' },
      { key: 'Occasion', value: 'Bridal & Festive Wear' },
      { key: 'Origin', value: 'Kanchipuram, Tamil Nadu' },
      { key: 'Care', value: 'Dry Clean Only' }
    ],
    reviews: [
      {
        id: 'rev-101',
        userName: 'Savitri Devi',
        rating: 5,
        review: 'Authentic silk texture, beautiful gold shine. Highly recommended!',
        date: '01 Aug 2026'
      }
    ]
  },
  'prod-102': {
    id: 'prod-102',
    name: 'Organic Combed Cotton Yarn Cones (40s Count)',
    category: 'Handloom Materials',
    brandOrArtisan: 'AuraStitch Raw Material Suppliers Ltd.',
    rating: 4.8,
    totalReviews: 86,
    price: '₹650 / kg',
    originalPrice: '₹800 / kg',
    discountPercentage: '18% OFF',
    availability: 'In Stock',
    deliveryEstimate: 'Dispatched in 24 Hours',
    description: 'High-tensile combed 40s count cotton yarn cones engineered for warping and high-speed handlooms. Minimal linting and uniform color absorption.',
    images: [
      getImageSrc(threads1Img),
      getImageSrc(machinary2Img),
      getImageSrc(beads1Img)
    ],
    specifications: [
      { key: 'Yarn Count', value: '40s Combed Cotton' },
      { key: 'Moisture Content', value: '< 6%' },
      { key: 'Unit Weight', value: '1.2 kg per cone' },
      { key: 'Packaging', value: 'Box of 20 Cones' }
    ],
    reviews: [
      {
        id: 'rev-201',
        userName: 'Ramesh Weavers Co-op',
        rating: 5,
        review: 'Excellent strength yarn cones, breakages reduced by 50% during warp.',
        date: '04 Aug 2026'
      }
    ]
  },
  'prod-103': {
    id: 'prod-103',
    name: 'Teakwood Loom Shuttle & Steel Reed Accessories Set',
    category: 'Loom Accessories',
    brandOrArtisan: 'Telangana Loom Spares Pvt Ltd',
    rating: 4.7,
    totalReviews: 54,
    price: '₹1,250 / set',
    originalPrice: '₹1,500 / set',
    discountPercentage: '16% OFF',
    availability: 'Low Stock',
    deliveryEstimate: 'Delivered in 4-6 Days',
    description: 'Precision handcrafted seasoned teakwood flying shuttle fitted with polished brass tips, accompanied by a 100-dentu stainless steel weaving reed.',
    images: [
      getImageSrc(machinary1Img),
      getImageSrc(machinary2Img),
      getImageSrc(lays1Img)
    ],
    specifications: [
      { key: 'Shuttle Material', value: 'Seasoned Teakwood' },
      { key: 'Reed Material', value: '304 Grade Stainless Steel' },
      { key: 'Weight', value: '450 grams' }
    ],
    reviews: [
      {
        id: 'rev-301',
        userName: 'Master Weaver Apparao',
        rating: 5,
        review: 'Smoothest shuttle movement we have used this year.',
        date: '30 Jul 2026'
      }
    ]
  }
};

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const stateProduct = location.state?.product;

  let productData: ProductDetailsData = sampleDefaultProduct;

  if (stateProduct) {
    const customSpecs: { key: string; value: string }[] = stateProduct.specifications ? [...stateProduct.specifications] : [];
    
    if (stateProduct.fabric || stateProduct.fabricMaterial) {
      customSpecs.unshift({ key: 'Fabric', value: stateProduct.fabric || stateProduct.fabricMaterial });
    }
    if (stateProduct.measurements) {
      const mVal = typeof stateProduct.measurements === 'object' 
        ? Object.entries(stateProduct.measurements).map(([k, v]) => `${k}: ${v}`).join(', ') 
        : String(stateProduct.measurements);
      customSpecs.push({ key: 'Measurements', value: mVal });
    }
    if (stateProduct.customerNotes) {
      customSpecs.push({ key: 'Customer Notes', value: stateProduct.customerNotes });
    }
    if (customSpecs.length === 0) {
      customSpecs.push(
        { key: 'Material', value: 'Pure Handloom Fabric' },
        { key: 'Craft', value: 'Boutique Tailored Fit' },
        { key: 'Quality Assurance', value: 'AuraStitch Verified' }
      );
    }

    productData = {
      id: stateProduct.id || 'prod-custom',
      name: stateProduct.name || stateProduct.productName || stateProduct.designName || 'Custom Tailored Garment',
      category: stateProduct.category || stateProduct.clothType || stateProduct.garmentType || 'Boutique Fashion',
      brandOrArtisan: stateProduct.brandOrArtisan || stateProduct.tailorName || stateProduct.artisanName || 'Master Tailor Studio',
      rating: stateProduct.rating || 4.9,
      totalReviews: stateProduct.totalReviews || 98,
      price: typeof stateProduct.price === 'number' ? `₹${stateProduct.price.toLocaleString()}` : (stateProduct.price || '₹2,450'),
      originalPrice: stateProduct.originalPrice ? (typeof stateProduct.originalPrice === 'number' ? `₹${stateProduct.originalPrice.toLocaleString()}` : stateProduct.originalPrice) : undefined,
      discountPercentage: stateProduct.discountPercentage || '15% OFF',
      availability: stateProduct.availability || stateProduct.status || 'In Stock',
      deliveryEstimate: stateProduct.deliveryEstimate || 'Delivered in 3-5 Business Days',
      description: stateProduct.description || 'Custom hand-stitched garment crafted by certified master tailors using premium fabrics and precise sizing measurements.',
      images: Array.isArray(stateProduct.images) ? stateProduct.images : [stateProduct.image || stateProduct.productImage || stateProduct.designImage || getImageSrc(kanchipuramSareeImg)],
      specifications: customSpecs,
      reviews: stateProduct.reviews || sampleDefaultProduct.reviews,
      similarProducts: stateProduct.similarProducts || sampleDefaultProduct.similarProducts
    };
  } else if (id && productCatalogue[id]) {
    productData = productCatalogue[id];
  }

  return <ProductDetails product={productData} />;
};

export default ProductDetailsPage;

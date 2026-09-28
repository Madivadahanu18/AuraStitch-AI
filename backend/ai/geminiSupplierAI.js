const { GoogleGenAI } = require('@google/genai');

/**
 * Curated B2B wholesale material, fabric bolt rolls, trims, and raw textile photography.
 * Professional commercial showroom and warehouse material flat-lays.
 */
const curatedSupplierGallery = {
  silkFabrics: [
    {
      url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=85',
      name: 'Heavy Katan Mulberry Silk Wholesale Roll Bolts',
      material: '100% Pure Mulberry Silk',
      category: 'Raw Fabric Yardage'
    },
    {
      url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85',
      name: 'Gold Zari Brocade Commercial Textile Swatches',
      material: 'Silk with Metallic Tested Zari',
      category: 'Brocade & Jacquard Rolls'
    }
  ],
  cottonLinen: [
    {
      url: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=1000&q=85',
      name: 'Organic GOTS-Certified Slub Cotton Bolts',
      material: '100% Organic Handspun Cotton',
      category: 'Sustainable Natural Fabrics'
    },
    {
      url: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=1000&q=85',
      name: 'Linen-Cotton Blend Commercial Suiting Fabric',
      material: '60% French Linen, 40% Combed Cotton',
      category: 'Apparel & Shirting Yardage'
    }
  ],
  velvetSheer: [
    {
      url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=85',
      name: 'Micro-Velvet & Heavy Satin Wholesale Fabric Bolt',
      material: 'Micro-Velvet with Silk Sheen',
      category: 'Luxury Eveningwear Materials'
    },
    {
      url: 'https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&w=1000&q=85',
      name: 'Tissue Organza & Metallic Sheer Swatch Cards',
      material: 'Pure Tissue Silk & Metallic Filaments',
      category: 'Bridal Dupatta & Overlay Yardage'
    }
  ],
  trimsHardware: [
    {
      url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1000&q=85',
      name: 'Handcrafted Zardozi Borders & Aari Needlework Ribbons',
      material: 'Antique Brass Zari & Glass Seed Beads',
      category: 'Artisan Trims & Laces'
    }
  ]
};

function getCuratedSupplierConcept(category, material) {
  const q = `${category || ''} ${material || ''}`.toLowerCase();
  if (q.includes('trim') || q.includes('border') || q.includes('button') || q.includes('hardware') || q.includes('lace')) {
    const list = curatedSupplierGallery.trimsHardware;
    return list[Math.floor(Math.random() * list.length)];
  }
  if (q.includes('cotton') || q.includes('linen') || q.includes('khadi') || q.includes('organic')) {
    const list = curatedSupplierGallery.cottonLinen;
    return list[Math.floor(Math.random() * list.length)];
  }
  if (q.includes('velvet') || q.includes('organza') || q.includes('georgette') || q.includes('satin')) {
    const list = curatedSupplierGallery.velvetSheer;
    return list[Math.floor(Math.random() * list.length)];
  }
  const list = curatedSupplierGallery.silkFabrics;
  return list[Math.floor(Math.random() * list.length)];
}

/**
 * Builds a prompt specifically tuned for commercial B2B supplier raw materials,
 * fabric rolls, trim boards, and wholesale product concepts.
 */
function buildSupplierPrompt({
  productCategory,
  material,
  fabricType,
  targetCustomer,
  targetTailorBusiness,
  colorStyle,
  seasonalRequirement,
  additionalDescription
}) {
  return `Commercial wholesale B2B product photography of premium textile and material stock for high-end fashion suppliers.
Product Category: ${productCategory || 'Raw Fabric Yardage & Bolt Rolls'}.
Base Material: ${material || '100% Pure Mulberry Silk'}.
Fabric / Material Texture: ${fabricType || 'Crisp Heavy Katan Weave'}, showcasing tactile fiber weave, selvedge edge, material weight, and natural surface sheen.
Color & Aesthetic: ${colorStyle || 'Royal Emerald Green & Burnished Gold'}.
Target Market: Tailored for ${targetTailorBusiness || 'Haute Couture Bridal Ateliers'} supplying ${targetCustomer || 'Luxury Bridal Clients'}.
Seasonality: Engineered for ${seasonalRequirement || 'Festive / Wedding Season Q3-Q4'}.
Supplier Technical Specs: ${additionalDescription || 'Standard 44-inch width, 50-meter rolls, high color fastness, OEKO-TEX certified'}.
Setting: High-end commercial textile showroom or master supplier warehouse staging. Elegant cylindrical fabric bolt rolls, draped wholesale material swatch hanger cards, barcode labels, and neat sample cuts arranged on an industrial polished concrete or brushed steel trading desk.
Visual Focus: Crisp focus on raw commercial material quality, weave density, roll packaging, and color saturation. Studio product lighting. 8K ultra-sharp resolution.`;
}

/**
 * Procedural SVG B2B Material Spec Card
 */
function generateProceduralSupplierSVG({
  productCategory,
  material,
  fabricType,
  colorStyle,
  targetTailorBusiness
}) {
  const isDark = (colorStyle || '').toLowerCase().includes('dark') || 
                 (colorStyle || '').toLowerCase().includes('black') || 
                 (colorStyle || '').toLowerCase().includes('emerald') ||
                 (colorStyle || '').toLowerCase().includes('navy');
  const primaryBg = isDark ? '#0F1E36' : '#F1F5F9';
  const swatchColor = isDark ? '#0284C7' : '#0EA5E9';
  const accentGold = '#F59E0B';

  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0B131F"/>
        <stop offset="100%" stop-color="#152238"/>
      </linearGradient>
      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
      </pattern>
    </defs>
    
    <rect width="800" height="600" fill="url(%23bgGrad)"/>
    <rect width="800" height="600" fill="url(%23grid)"/>
    
    <!-- Header Banner -->
    <rect x="40" y="30" width="720" height="70" rx="8" fill="rgba(14, 165, 233, 0.1)" stroke="rgba(14, 165, 233, 0.3)" stroke-width="1"/>
    <text x="65" y="62" fill="#0EA5E9" font-family="sans-serif" font-size="12" font-weight="bold" letter-spacing="2">AURASTITCH B2B TRADE NETWORK</text>
    <text x="65" y="84" fill="#FFFFFF" font-family="sans-serif" font-size="18" font-weight="bold">${(productCategory || 'Textile Roll Material').substring(0, 40)}</text>
    <text x="650" y="72" fill="#10B981" font-family="monospace" font-size="14" font-weight="bold">IN STOCK</text>
    
    <!-- Material Swatch Card -->
    <rect x="40" y="120" width="340" height="440" rx="12" fill="${primaryBg}" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
    <rect x="60" y="140" width="300" height="240" rx="8" fill="${swatchColor}" opacity="0.85"/>
    <circle cx="210" cy="260" r="40" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-dasharray="6,6"/>
    <text x="210" y="265" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif" font-size="12" font-weight="bold">SAMPLE SWATCH</text>
    
    <text x="60" y="415" fill="#94A3B8" font-family="sans-serif" font-size="11">MATERIAL COMPOSITION</text>
    <text x="60" y="435" fill="#FFFFFF" font-family="sans-serif" font-size="15" font-weight="bold">${(material || 'Mulberry Silk').substring(0, 28)}</text>
    
    <text x="60" y="475" fill="#94A3B8" font-family="sans-serif" font-size="11">WEAVE STRUCTURE</text>
    <text x="60" y="495" fill="#FFFFFF" font-family="sans-serif" font-size="14">${(fabricType || 'Bespoke Weave').substring(0, 28)}</text>
    
    <!-- Technical & Commercial Matrix -->
    <rect x="400" y="120" width="360" height="440" rx="12" fill="rgba(18, 27, 44, 0.7)" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
    
    <!-- Data Fields -->
    <text x="425" y="160" fill="${accentGold}" font-family="sans-serif" font-size="11" font-weight="bold" letter-spacing="1">TARGET B2B SEGMENT</text>
    <text x="425" y="185" fill="#F8FAFC" font-family="sans-serif" font-size="14" font-weight="bold">${(targetTailorBusiness || 'Couture Ateliers').substring(0, 34)}</text>
    
    <line x1="425" y1="205" x2="735" y2="205" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
    
    <text x="425" y="235" fill="#0EA5E9" font-family="sans-serif" font-size="11" font-weight="bold" letter-spacing="1">RECOMMENDED MOQ</text>
    <text x="425" y="260" fill="#F8FAFC" font-family="sans-serif" font-size="16" font-weight="bold">25 - 50 Meters / Roll</text>
    
    <line x1="425" y1="280" x2="735" y2="280" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
    
    <text x="425" y="310" fill="#10B981" font-family="sans-serif" font-size="11" font-weight="bold" letter-spacing="1">PROJECTED WHOLESALE MARGIN</text>
    <text x="425" y="338" fill="#10B981" font-family="sans-serif" font-size="22" font-weight="bold">38% - 48% Gross</text>
    
    <line x1="425" y1="360" x2="735" y2="360" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
    
    <text x="425" y="390" fill="#94A3B8" font-family="sans-serif" font-size="11" font-weight="bold" letter-spacing="1">AURA STITCH DEMAND INDEX</text>
    <rect x="425" y="405" width="280" height="8" rx="4" fill="rgba(255,255,255,0.1)"/>
    <rect x="425" y="405" width="245" height="8" rx="4" fill="#0EA5E9"/>
    <text x="715" y="414" fill="#0EA5E9" font-family="monospace" font-size="11" font-weight="bold">88%</text>
    
    <!-- Barcode at bottom -->
    <rect x="425" y="460" width="310" height="70" rx="6" fill="#FFFFFF"/>
    <text x="580" y="485" text-anchor="middle" fill="#000000" font-family="monospace" font-size="18" font-weight="bold">||| |||| || ||||| |||| ||</text>
    <text x="580" y="515" text-anchor="middle" fill="#475569" font-family="monospace" font-size="10">SKU: AS-B2B-SUPPLIER-LINE-2026</text>
  </svg>`;
}

/**
 * Generate a complete Supplier B2B Product & Material Idea
 * with commercial wholesale metrics, pricing models, supply chain specs, and tech packs.
 */
async function generateSupplierProductIdea(params) {
  const {
    productCategory = 'Raw Fabric Yardage & Bolt Rolls',
    material = '100% Pure Mulberry Silk',
    fabricType = 'Crisp Heavy Katan Weave (118 GSM)',
    targetCustomer = 'Luxury Bridal & Occasionwear Clients',
    targetTailorBusiness = 'Haute Couture Bridal Ateliers & Boutiques',
    colorStyle = 'Royal Emerald & Burnished Gold',
    seasonalRequirement = 'Festive / Wedding Season Q3-Q4',
    additionalDescription = '',
    apiKey: clientApiKey
  } = params;

  const activeApiKey = (process.env.GEMINI_API_KEY || clientApiKey || '').trim();
  const prompt = buildSupplierPrompt(params);

  let imageUrl = null;
  let isLiveGemini = false;
  let commercialBlueprint = null;
  let errorNotice = null;

  if (activeApiKey && activeApiKey.trim() !== '') {
    try {
      const ai = new GoogleGenAI({ apiKey: activeApiKey.trim() });

      // Attempt 1: Imagen 3 image generation
      try {
        const imgResponse = await ai.models.generateImages({
          model: 'imagen-3.0-generate-002',
          prompt,
          config: {
            numberOfImages: 1,
            aspectRatio: '1:1',
            outputMimeType: 'image/jpeg'
          }
        });

        if (imgResponse?.generatedImages?.[0]?.image?.imageBytes) {
          imageUrl = `data:image/jpeg;base64,${imgResponse.generatedImages[0].image.imageBytes}`;
          isLiveGemini = true;
        }
      } catch (imgErr) {
        console.warn('Supplier Imagen-3 generation failed, trying gemini-2.5-flash-image:', imgErr.message);

        // Attempt 2: Try gemini-2.5-flash-image
        try {
          const flashImgResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: prompt
          });

          const candidates = flashImgResponse?.candidates || [];
          for (const candidate of candidates) {
            for (const part of candidate.content?.parts || []) {
              if (part.inlineData) {
                imageUrl = `data:${part.inlineData.mimeType || 'image/jpeg'};base64,${part.inlineData.data}`;
                isLiveGemini = true;
                break;
              }
            }
          }
        } catch (flashErr) {
          console.warn('Supplier gemini-2.5-flash-image failed:', flashErr.message);
          errorNotice = imgErr.message || flashErr.message;
        }
      }

      // Generate B2B Wholesale Commercial Tech Pack with Gemini 2.5 Flash
      try {
        const textResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `You are a Senior Textile Sourcing Director and B2B Fashion Supply Chain Strategist for AuraStitch.
Analyze the following supplier new product proposal:
- Product Category: ${productCategory}
- Material: ${material}
- Fabric / Texture: ${fabricType}
- Target End-Customer: ${targetCustomer}
- Target Tailor / Business: ${targetTailorBusiness}
- Color / Aesthetic Style: ${colorStyle}
- Seasonal Requirement: ${seasonalRequirement}
- Additional Supplier Details: ${additionalDescription}

Return a STRICTLY valid JSON object (no markdown backticks, raw JSON only) matching this exact schema:
{
  "productTitle": "Compelling B2B trade name for this commercial material",
  "skuCode": "e.g. AS-SUP-2026-KATAN-88",
  "marketOpportunitySummary": "Analysis of why this fabric/material fills a high-margin supply gap on AuraStitch for tailors and designers",
  "commercialMetrics": {
    "wholesaleCostPerUnit": "e.g. ₹950 / meter",
    "b2bSellingPricePerUnit": "e.g. ₹1,450 / meter (for orders 25m+)",
    "suggestedMSRP": "e.g. ₹2,600 / meter retail",
    "projectedGrossMargin": "e.g. 35% - 44% Gross Margin",
    "marketDemandIndex": "e.g. 92% High Demand - Wedding Peak"
  },
  "supplyChainSpecs": {
    "moq": "e.g. 25 Meters per colorway",
    "sampleAvailability": "e.g. 30x30cm Swatch Card or 2m Sample Length",
    "productionLeadTime": "e.g. 7-10 Business Days for fresh roll bolts; 48h dispatch for inventory stock",
    "rollPackagingDimensions": "e.g. 44-inch double-fold on moisture-sealed cardboard core, 50 meters/roll",
    "monthlyCapacity": "e.g. 2,500 Meters / month"
  },
  "technicalMaterialSpecs": {
    "fiberComposition": "e.g. 100% Pure Grade-6A Mulberry Silk",
    "gsmWeight": "e.g. 118 GSM (Lightweight Crisp Drape)",
    "usableWidth": "e.g. 44 inches (112 cm) excluding selvedge",
    "colorFastness": "e.g. Grade 4.5 Washing & Light Fastness (ISO 105)",
    "shrinkageRate": "e.g. Less than 1.5% Warp / Weft",
    "complianceCertifications": [
      "OEKO-TEX Standard 100 Class 1",
      "Silk Mark Authorized Certification",
      "REACH Compliant Low-Impact Dyes"
    ]
  },
  "tailorAndBusinessValueProposition": "Why bespoke tailors, boutiques, and designers will purchase this material for their clients",
  "crossSellingRecommendations": [
    "Matching antique gold zari lace trims (3.5 inch width)",
    "High-density pure cotton-silk lining fabric",
    "Polyester-core reinforced stitching thread cones (Tex 40)"
  ],
  "seasonalMarketingStrategy": [
    "Q3 Launch campaign targeting bridal atelier sample bookings",
    "Offer tiered volume discounts for early-bird wedding season orders",
    "Bundle with matching lining swatches for 1-click tailor ordering"
  ]
}`
        });

        const rawText = textResponse.text || '';
        const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        commercialBlueprint = JSON.parse(cleaned);
      } catch (textErr) {
        console.warn('Supplier tech pack generation notice:', textErr.message);
      }
    } catch (apiErr) {
      console.error('Supplier AI initialization error:', apiErr);
      errorNotice = apiErr.message;
    }
  } else {
    errorNotice = 'GEMINI_API_KEY is not configured in backend .env. Loaded master B2B supplier line sheet.';
  }

  // Fallback to curated image if image generation was skipped
  if (!imageUrl) {
    const fallbackConcept = getCuratedSupplierConcept(productCategory, material);
    imageUrl = fallbackConcept.url;
  }

  // Fallback commercial blueprint if text API was offline
  if (!commercialBlueprint) {
    commercialBlueprint = {
      productTitle: `Imperial ${fabricType} ${material}`,
      skuCode: `AS-B2B-${Date.now().toString().slice(-6)}`,
      marketOpportunitySummary: `High-yield B2B supply offering designed specifically for ${targetTailorBusiness}. Solves the acute supply shortage of premium ${colorStyle} materials for ${seasonalRequirement} collections.`,
      commercialMetrics: {
        wholesaleCostPerUnit: '₹850 - ₹1,100 / Meter',
        b2bSellingPricePerUnit: '₹1,350 - ₹1,650 / Meter (B2B Volume Tier)',
        suggestedMSRP: '₹2,400 - ₹2,900 / Meter',
        projectedGrossMargin: '38% - 46% Gross Profit',
        marketDemandIndex: '91% Strong Sourcing Demand'
      },
      supplyChainSpecs: {
        moq: '25 Meters (Single Roll Bolt)',
        sampleAvailability: 'Hanger Swatch Card (30cm x 30cm) + Full Lab Dip Set',
        productionLeadTime: '7 to 10 Business Days for custom dye lots; 48 hours for standard stock',
        rollPackagingDimensions: '44" Width, 50-meter rolls on 2-inch reinforced cardboard cores with poly-wrap',
        monthlyCapacity: '3,000 Meters monthly production output'
      },
      technicalMaterialSpecs: {
        fiberComposition: `${material} with reinforced yarn twist`,
        gsmWeight: '120 GSM - Ideal for structured tailoring and flowing silhouettes',
        usableWidth: '44 to 45 inches (114 cm)',
        colorFastness: 'Grade 4+ Washing & Rubbing Fastness (ISO 105)',
        shrinkageRate: '< 1.8% residual shrinkage',
        complianceCertifications: [
          'OEKO-TEX Standard 100 Certified',
          'Silk Mark / Handloom Mark Verification',
          'Azo-Free Eco-Friendly Pigments'
        ]
      },
      tailorAndBusinessValueProposition: `Allows master tailors and bespoke ateliers to guarantee heirloom fabric quality to ${targetCustomer} with zero slippage, excellent needle retention, and predictable drape margins.`,
      crossSellingRecommendations: [
        'Matching antique gold zari lace trims (3.5 inch width)',
        'High-density pure cotton-silk lining fabric',
        'Polyester-core reinforced stitching thread cones (Tex 40)'
      ],
      seasonalMarketingStrategy: [
        `Pre-book wholesale yardage ahead of ${seasonalRequirement}`,
        'Provide atelier sample hanger books to top-tier tailors on AuraStitch',
        'Offer 5% bulk rebate for orders exceeding 100 meters'
      ]
    };
  }

  const vectorSvg = generateProceduralSupplierSVG({
    productCategory,
    material,
    fabricType,
    colorStyle,
    targetTailorBusiness
  });

  return {
    id: `supplier-idea-${Date.now()}`,
    imageUrl,
    vectorSvg,
    isLiveGemini,
    errorNotice,
    prompt,
    inputs: {
      productCategory,
      material,
      fabricType,
      targetCustomer,
      targetTailorBusiness,
      colorStyle,
      seasonalRequirement,
      additionalDescription
    },
    blueprint: commercialBlueprint,
    createdAt: new Date().toISOString()
  };
}

module.exports = {
  generateSupplierProductIdea,
  buildSupplierPrompt,
  generateProceduralSupplierSVG
};

const { GoogleGenAI } = require('@google/genai');

/**
 * Curated high-resolution textile, weave, and print design photography.
 * STRICTLY flat-lay fabric textures, pattern repeats, borders, and print swatches.
 * ABSOLUTELY ZERO humans, faces, mannequins, or avatars.
 */
const curatedHandloomGallery = {
  brocade: [
    {
      url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85',
      name: 'Pure Banarasi Katan Silk Gold Zari Kadwa Brocade',
      textileType: 'Pure Mulberry Katan Silk',
      style: 'Kadwa Handloom Brocade',
      colors: 'Crimson Sindoor & Antique Gold Zari'
    },
    {
      url: 'https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&w=1000&q=85',
      name: 'Royal Heritage Brocade with Paisley Kalka Border',
      textileType: 'Heavy Brocade Silk',
      style: 'Zari Jaal Extra-Weft',
      colors: 'Deep Indigo & Burnished Gold'
    }
  ],
  ikat: [
    {
      url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=85',
      name: 'Pochampally Double Ikat Geometric Rhombus Weave',
      textileType: 'Handloom Cotton-Silk Blend',
      style: 'Pochampally Double Ikat',
      colors: 'Indigo Blue, Madder Red & Natural Ecru'
    },
    {
      url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=85',
      name: 'Patola Heritage Diamond Medallion Weave',
      textileType: 'Pure Mulberry Silk',
      style: 'Rajkot Double Ikat',
      colors: 'Turmeric Ochre, Emerald & Maroon'
    }
  ],
  blockprint: [
    {
      url: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=1000&q=85',
      name: 'Ajrakh 14-Stage Hand Carved Woodblock Print',
      textileType: 'Handspun Khadi Cotton',
      style: 'Ajrakh Mud-Resist Block Print',
      colors: 'Natural Indigo, Madder Red & Iron Black'
    },
    {
      url: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=1000&q=85',
      name: 'Sanganeri Delicate Botanical Floral Vine Print',
      textileType: 'Fine Chanderi Muslin',
      style: 'Hand Woodblock Print',
      colors: 'Soft Ecru, Sage Green & Pomegranate Pink'
    }
  ],
  kalamkari: [
    {
      url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1000&q=85',
      name: 'Srikalahasti Pen Kalamkari Tree of Life Tapestry',
      textileType: 'Handwoven Raw Tussar Silk',
      style: 'Freehand Bamboo Pen Kalamkari',
      colors: 'Warm Mustard, Madder Earth & Charcoal'
    }
  ],
  cotton: [
    {
      url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=85',
      name: 'Mangalagiri Micro Nizam Zari Border Cotton',
      textileType: '80s Combed Handloom Cotton',
      style: 'Pit Loom Nizam Weave',
      colors: 'Forest Green & Fine Gold Zari'
    }
  ],
  chanderi: [
    {
      url: 'https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&w=1000&q=85',
      name: 'Chanderi Gold Ashavali Buti & Sheer Texture',
      textileType: 'Chanderi Silk-Cotton Sheer',
      style: 'Extra-Weft Dobby Buti',
      colors: 'Blush Champagne & Antique Gold'
    }
  ]
};

function getCuratedHandloomConcept(weavingPrintingStyle, textileType) {
  const s = `${weavingPrintingStyle || ''} ${textileType || ''}`.toLowerCase();
  if (s.includes('ikat') || s.includes('patola') || s.includes('pochampally')) {
    const list = curatedHandloomGallery.ikat;
    return list[Math.floor(Math.random() * list.length)];
  }
  if (s.includes('block') || s.includes('ajrakh') || s.includes('dabu') || s.includes('bagh') || s.includes('print')) {
    const list = curatedHandloomGallery.blockprint;
    return list[Math.floor(Math.random() * list.length)];
  }
  if (s.includes('kalamkari') || s.includes('painted') || s.includes('tree of life')) {
    const list = curatedHandloomGallery.kalamkari;
    return list[Math.floor(Math.random() * list.length)];
  }
  if (s.includes('chanderi') || s.includes('jamdani') || s.includes('maheshwari')) {
    const list = curatedHandloomGallery.chanderi;
    return list[Math.floor(Math.random() * list.length)];
  }
  if (s.includes('cotton') || s.includes('khadi') || s.includes('mangalagiri') || s.includes('linen')) {
    const list = curatedHandloomGallery.cotton;
    return list[Math.floor(Math.random() * list.length)];
  }
  const list = curatedHandloomGallery.brocade;
  return list[Math.floor(Math.random() * list.length)];
}

/**
 * Builds a prompt strictly focused on textile patterns, motifs, printing designs, borders,
 * and fabric appearance. Strictly excludes humans, avatars, and clothing worn on bodies.
 */
function buildHandloomPrompt({
  textileType,
  weavingPrintingStyle,
  motif,
  pattern,
  colors,
  styleType,
  targetProduct,
  additionalDescription
}) {
  return `Flat-lay top-down studio macro photograph of an authentic artisanal handloom textile fabric swatch sample and repeating print pattern.
Textile Base: ${textileType || 'Pure Mulberry Katan Silk'}, showcasing visible warp and weft interlacing threads, natural fiber slub texture, tactile drape, and yarn luster.
Weaving / Printing Technique: ${weavingPrintingStyle || 'Handloom Jacquard Brocade Weave'}.
Motif Design: ${motif || 'Traditional Paisley (Kalka) and Floral Lotus Medallions'}.
Pattern Layout: ${pattern || 'Allover continuous jaal lattice with ornate engineered border'}.
Color Palette: ${colors || 'Deep Indigo, Madder Crimson & Antique Gold Zari'}.
Design Aesthetic: ${styleType || 'Traditional Heritage'}.
Target Product Format: ${targetProduct || 'Saree Fabric with Border & Pallu'}.
Artisan Specification: ${additionalDescription || 'Fine handloom thread tension, crisp motif contouring, contrast border detail, vegetable dye natural saturation'}.
Visual Composition: Pure textile cloth laid flat on an authentic rustic wooden loom workbench, studio lighting highlighting weave surface relief, metallic zari thread reflections, and selvedge edge.
STRICT NEGATIVE INSTRUCTIONS: ABSOLUTELY NO humans, NO human head, NO face, NO body, NO mannequin, NO avatar, NO model wearing clothes. Strictly pure textile pattern swatch, fabric roll, weave structure, borders, and print motifs only. 8K high-definition macro fabric detail.`;
}

/**
 * Procedural SVG Textile Swatch Generator
 * Generates mathematically authentic textile swatches with varied colors, motifs, and borders
 * to serve as an instant, interactive vector render.
 */
function generateProceduralTextileSVG({
  textileType,
  weavingPrintingStyle,
  motif,
  pattern,
  colors,
  styleType,
  targetProduct
}) {
  const isDark = (colors || '').toLowerCase().includes('indigo') || 
                 (colors || '').toLowerCase().includes('black') || 
                 (colors || '').toLowerCase().includes('navy');
  const baseBg = isDark ? '#162238' : '#FAF3E0';
  const accent1 = isDark ? '#E2B357' : '#9E2A2B';
  const accent2 = isDark ? '#C85A32' : '#2A5A44';
  const borderBg = isDark ? '#0F1826' : '#EAD9C0';

  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
    <defs>
      <!-- Weave Texture Pattern -->
      <pattern id="linenWeave" width="8" height="8" patternUnits="userSpaceOnUse">
        <rect width="8" height="8" fill="${baseBg}"/>
        <path d="M0,4 L8,4 M4,0 L4,8" stroke="rgba(0,0,0,0.06)" stroke-width="0.8"/>
        <circle cx="2" cy="2" r="0.5" fill="rgba(255,255,255,0.15)"/>
        <circle cx="6" cy="6" r="0.5" fill="rgba(255,255,255,0.15)"/>
      </pattern>
      
      <!-- Paisley / Lotus Motif Symbol -->
      <pattern id="motifGrid" width="160" height="160" patternUnits="userSpaceOnUse">
        <!-- Lattice Diamonds -->
        <path d="M80,10 L150,80 L80,150 L10,80 Z" fill="none" stroke="${accent1}" stroke-width="1.5" stroke-dasharray="3,3" opacity="0.6"/>
        
        <!-- Central Flower / Lotus Motif -->
        <circle cx="80" cy="80" r="16" fill="${accent2}" opacity="0.85"/>
        <circle cx="80" cy="80" r="8" fill="${accent1}"/>
        
        <!-- Petals -->
        <path d="M80,50 Q75,70 80,80 Q85,70 80,50 Z" fill="${accent1}"/>
        <path d="M80,110 Q75,90 80,80 Q85,90 80,110 Z" fill="${accent1}"/>
        <path d="M50,80 Q70,75 80,80 Q70,85 50,80 Z" fill="${accent1}"/>
        <path d="M110,80 Q90,75 80,80 Q90,85 110,80 Z" fill="${accent1}"/>
        
        <!-- Diagonal Paisley Kalpa Butis -->
        <circle cx="20" cy="20" r="4" fill="${accent1}"/>
        <circle cx="140" cy="20" r="4" fill="${accent1}"/>
        <circle cx="20" cy="140" r="4" fill="${accent1}"/>
        <circle cx="140" cy="140" r="4" fill="${accent1}"/>
      </pattern>
      
      <!-- Zari Border Pattern -->
      <pattern id="borderJaal" width="40" height="80" patternUnits="userSpaceOnUse">
        <rect width="40" height="80" fill="${borderBg}"/>
        <path d="M0,0 L20,40 L0,80 L40,80 L20,40 L40,0 Z" fill="${accent1}" opacity="0.35"/>
        <polygon points="20,10 35,40 20,70 5,40" fill="${accent2}" opacity="0.7"/>
        <circle cx="20" cy="40" r="3.5" fill="${accent1}"/>
        <line x1="0" y1="0" x2="40" y2="0" stroke="${accent1}" stroke-width="2"/>
        <line x1="0" y1="80" x2="40" y2="80" stroke="${accent1}" stroke-width="2"/>
      </pattern>
    </defs>
    
    <!-- Base Fabric Canvas -->
    <rect width="800" height="800" fill="url(%23linenWeave)"/>
    
    <!-- Body Field with Allover Motifs -->
    <rect x="0" y="0" width="800" height="660" fill="url(%23motifGrid)"/>
    
    <!-- Contrast Handloom Border -->
    <rect x="0" y="660" width="800" height="140" fill="url(%23borderJaal)"/>
    
    <!-- Border Zari Piping -->
    <line x1="0" y1="660" x2="800" y2="660" stroke="${accent1}" stroke-width="6"/>
    <line x1="0" y1="670" x2="800" y2="670" stroke="${accent2}" stroke-width="2"/>
    <line x1="0" y1="790" x2="800" y2="790" stroke="${accent1}" stroke-width="4"/>
    
    <!-- Textile Watermark Badge -->
    <rect x="30" y="30" width="280" height="54" rx="8" fill="rgba(0,0,0,0.65)" backdrop-filter="blur(8px)"/>
    <text x="45" y="54" fill="#E2B357" font-family="serif" font-size="14" font-weight="bold">AURA STITCH • TEXTILE CAD</text>
    <text x="45" y="72" fill="#FFFFFF" font-family="sans-serif" font-size="11">${(textileType || 'Handloom Silk').substring(0, 32)}</text>
  </svg>`;
}

/**
 * Generate a complete Handloom Textile & Print Design concept
 * with high-definition visual output and comprehensive loom technical blueprint.
 */
async function generateHandloomDesign(params) {
  const {
    textileType = 'Pure Mulberry Katan Silk',
    weavingPrintingStyle = 'Banarasi Kadwa Brocade Weave',
    motif = 'Kalka (Paisley Pine) & Lotus Medallion',
    pattern = 'Allover Continuous Jaal Lattice',
    colors = 'Turmeric Ochre, Deep Indigo & Antique Gold Zari',
    styleType = 'Traditional Heritage',
    targetProduct = 'Saree Fabric with Border & Pallu',
    additionalDescription = '',
    apiKey: clientApiKey
  } = params;

  const activeApiKey = (process.env.GEMINI_API_KEY || clientApiKey || '').trim();
  const prompt = buildHandloomPrompt(params);

  let imageUrl = null;
  let isLiveGemini = false;
  let loomTechPack = null;
  let errorNotice = null;

  if (activeApiKey && activeApiKey.trim() !== '') {
    try {
      const ai = new GoogleGenAI({ apiKey: activeApiKey.trim() });

      // Attempt 1: Try Imagen 3 high-resolution image generation
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
        console.warn('Handloom Imagen-3 generation failed, trying gemini-2.5-flash-image:', imgErr.message);

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
          console.warn('Handloom gemini-2.5-flash-image failed:', flashErr.message);
          errorNotice = imgErr.message || flashErr.message;
        }
      }

      // Generate Loom & Textile Technical Blueprint with Gemini 2.5 Flash
      try {
        const textResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `You are a Master Weaver, Textile Technologist, and Heritage Print Archival Specialist.
Analyze the following custom textile design request:
- Textile Type: ${textileType}
- Weaving / Printing Style: ${weavingPrintingStyle}
- Motif: ${motif}
- Pattern: ${pattern}
- Color Palette: ${colors}
- Style: ${styleType}
- Target Product: ${targetProduct}
- Additional Description: ${additionalDescription}

Provide a comprehensive technical Loom & Textile Print Specification Sheet.
Return a STRICTLY valid JSON object (no markdown backticks, raw JSON only) matching this exact schema:
{
  "designName": "Creative artisanal title for this textile",
  "craftClassification": "Specific regional craft classification (e.g. Varanasi Kadwa Brocade / Kutch Ajrakh Block)",
  "recommendedLoomOrApparatus": "Type of loom or printing table recommended (e.g. 120-hook Jacquard Pit Loom or Teak Woodblock Hand Table)",
  "yarnSpecs": {
    "warpYarn": "Count and composition of warp threads (e.g. 2/80s Degummed Mulberry Silk)",
    "weftYarn": "Count and composition of weft and extra-weft threads (e.g. 2/60s Mulberry Silk & Tested Pure Silver/Gold Zari)",
    "reedDensityEPI": "Ends Per Inch (EPI) (e.g. 96 EPI)",
    "pickDensityPPI": "Picks Per Inch (PPI) (e.g. 84 PPI)",
    "gsmWeight": "Grams Per Square Meter and fabric drape assessment (e.g. 115 GSM - Lightweight Fluid Drape)",
    "fabricWidth": "Standard loom reed width (e.g. 46 inches / 117 cm)"
  },
  "repeatMetrics": {
    "verticalRepeat": "Height of one motif repeat cycle (e.g. 12.5 inches / 31.7 cm)",
    "horizontalRepeat": "Width of one motif repeat cycle (e.g. 8.0 inches / 20.3 cm)",
    "repeatPatternType": "Type of mathematical layout (e.g. Straight Repeat, Half-Drop Brick, Mirror Ogee)"
  },
  "borderAndPalluSpecs": {
    "borderWidth": "Width of side border (e.g. 4.5 inches / 11.4 cm)",
    "borderMotifDetails": "Description of border elements, creepers (bel), and piping",
    "bodyFieldRatio": "Proportion of body motif density vs negative space",
    "palluOrEndPanel": "Architecture of end panel or pallu (if applicable)"
  },
  "dyeAndColorPalette": [
    { "name": "Primary shade name", "colorHex": "#2A3B5C", "pigmentSource": "Natural Indigofera Tinctoria" },
    { "name": "Accent shade name", "colorHex": "#B85A38", "pigmentSource": "Madder Root (Rubia Cordifolia)" },
    { "name": "Highlight shade name", "colorHex": "#D4A373", "pigmentSource": "Natural Metallic Zari Wire" }
  ],
  "craftExecutionWorkflow": [
    "Phase 1: Yarn preparation, degumming, and mordant dyeing",
    "Phase 2: Warp beam winding, drafting through heddles, and reed denting",
    "Phase 3: Jacquard punch card or woodblock carving preparation",
    "Phase 4: Test strike / sample weave check for tension and color fidelity",
    "Phase 5: Full yardage production with continuous pick beat-up inspection",
    "Phase 6: Traditional finishing, steam calendering, and edge selvedge trimming"
  ],
  "artisanEffortEstimation": {
    "loomSetupDays": "e.g. 3 to 4 Days for warping and jacquard harness tie-up",
    "dailyProductionRate": "e.g. 0.8 to 1.2 Meters per 8-hour artisan shift",
    "totalEstimatedDays": "e.g. 12 Days for complete saree / 6-meter yardage",
    "recommendedArtisanGrade": "Master Craftsman (Ustad Weaver) with Jacquard Experience"
  },
  "careAndPreservation": [
    "Dry clean only recommended for pure silk and metallic zari",
    "Store wrapped in unbleached pure cotton muslin cloth",
    "Avoid direct sunlight to preserve natural botanical dye luminosity",
    "Iron on reverse at low temperature with a protective cloth barrier"
  ]
}`
        });

        const rawText = textResponse.text || '';
        const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        loomTechPack = JSON.parse(cleaned);
      } catch (textErr) {
        console.warn('Handloom tech pack generation notice:', textErr.message);
      }
    } catch (apiErr) {
      console.error('Handloom AI initialization error:', apiErr);
      errorNotice = apiErr.message;
    }
  } else {
    errorNotice = 'GEMINI_API_KEY is not configured in backend .env. Loaded master handloom archive specification.';
  }

  // Graceful fallback image if Gemini generation was unavailable
  if (!imageUrl) {
    const fallbackConcept = getCuratedHandloomConcept(weavingPrintingStyle, textileType);
    imageUrl = fallbackConcept.url;
  }

  // Graceful fallback loom tech pack if text API was offline
  if (!loomTechPack) {
    loomTechPack = {
      designName: `${styleType} ${motif} on ${textileType}`,
      craftClassification: `${weavingPrintingStyle} Heritage Craft Guild`,
      recommendedLoomOrApparatus: weavingPrintingStyle.toLowerCase().includes('print') 
        ? 'Hand-carved Sheesham Woodblock Table with Pin-Registration Bed'
        : 'Fly-shuttle Pit Loom with 120-hook Jacquard Attachment & Dobby Border Control',
      yarnSpecs: {
        warpYarn: '2/80s Combed Mulberry Silk, 22 TPI High-Twist',
        weftYarn: '2/60s Mulberry Silk with Fine Metallic Tested Zari Extra-Weft',
        reedDensityEPI: '98 Ends Per Inch (EPI)',
        pickDensityPPI: '86 Picks Per Inch (PPI)',
        gsmWeight: '118 GSM - Lightweight Crisp Handloom Drape',
        fabricWidth: '45.5 inches (115.5 cm)'
      },
      repeatMetrics: {
        verticalRepeat: '10.5 inches (26.6 cm)',
        horizontalRepeat: '7.5 inches (19.0 cm)',
        repeatPatternType: 'Straight Lattice with Half-Drop Staggered Buti'
      },
      borderAndPalluSpecs: {
        borderWidth: '4.0 inches (10.1 cm) with 3-tier Karvati Temple Spire',
        borderMotifDetails: `Dense ${motif} motif flanked by dual chevron zari selvedge lines`,
        bodyFieldRatio: '70% Body Field Allover Lattice with 30% Border Accent Proportion',
        palluOrEndPanel: 'Grand 28-inch Pallu featuring twin large Kalka (Paisley) medallions'
      },
      dyeAndColorPalette: [
        { name: 'Primary Ground', colorHex: '#1E2D4A', pigmentSource: 'Natural Indigo (Indigofera Tinctoria)' },
        { name: 'Secondary Accent', colorHex: '#C85A32', pigmentSource: 'Rubia Cordifolia (Madder Root)' },
        { name: 'Highlight Zari', colorHex: '#D4A373', pigmentSource: 'Electroplated Metallic Gold Thread' },
        { name: 'Ecru Ground', colorHex: '#FAF7F2', pigmentSource: 'Unbleached Organic Silk Fiber' }
      ],
      craftExecutionWorkflow: [
        'Phase 1: Pure silk yarn scouring, degumming, and mordanting in alum baths',
        'Phase 2: Warp beam sizing using natural rice starch and hand peg warping',
        'Phase 3: Drafting through double-eyed heddles and denting into bamboo reeds',
        'Phase 4: Setting up extra-weft shuttle boxes and jacquard lifting harness',
        'Phase 5: Precision weaving maintaining 86 PPI beat-up density throughout fabric roll',
        'Phase 6: Inspection under directional daylight and hand-finishing of loose weft ends'
      ],
      artisanEffortEstimation: {
        loomSetupDays: '3 to 4 Days for warping, drafting, and harness tie-up',
        dailyProductionRate: '0.9 to 1.3 Meters per 8-hour artisan shift',
        totalEstimatedDays: '10 to 14 Days for full 6.5-meter yardage roll',
        recommendedArtisanGrade: 'Master Artisan (Senior Handloom Weaver)'
      },
      careAndPreservation: [
        'Dry clean only recommended for natural silks and metallic zari threadwork',
        'Roll on cardboard cores or store folded in breathable unbleached cotton muslin',
        'Avoid plastic polybags to prevent moisture trapping and zari tarnishing',
        'Refold along alternate fold lines every six months to prevent fiber fatigue'
      ]
    };
  }

  // Also generate dynamic SVG preview representation
  const vectorSvg = generateProceduralTextileSVG({
    textileType,
    weavingPrintingStyle,
    motif,
    pattern,
    colors,
    styleType,
    targetProduct
  });

  return {
    id: `handloom-textile-${Date.now()}`,
    imageUrl,
    vectorSvg,
    isLiveGemini,
    errorNotice,
    prompt,
    inputs: {
      textileType,
      weavingPrintingStyle,
      motif,
      pattern,
      colors,
      styleType,
      targetProduct,
      additionalDescription
    },
    techPack: loomTechPack,
    createdAt: new Date().toISOString()
  };
}

module.exports = {
  generateHandloomDesign,
  buildHandloomPrompt,
  generateProceduralTextileSVG
};

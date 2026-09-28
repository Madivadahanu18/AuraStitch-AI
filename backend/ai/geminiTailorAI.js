const { GoogleGenAI } = require('@google/genai');

/**
 * Curated atelier tailor concepts focusing on bespoke craftsmanship and garment construction
 * Used when API key is missing or quota is exhausted.
 */
const curatedTailorGallery = {
  blouse: [
    {
      url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=85',
      name: 'Princess-Cut Banarasi Brocade Bridal Blouse with Padded Cups',
      fabric: 'Heavy Banarasi Katan Silk with Gold Zari'
    },
    {
      url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=85',
      name: 'Deep-Back Choli with Handcrafted Dori Tassels',
      fabric: 'Mulberry Raw Silk'
    }
  ],
  suit: [
    {
      url: 'https://images.unsplash.com/photo-1631857455684-a54a2f03665f?auto=format&fit=crop&w=800&q=85',
      name: 'Flared Anarkali Suit with Piped Princess Seams',
      fabric: 'Silk Georgette with Shantoon Lining'
    },
    {
      url: 'https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&w=800&q=85',
      name: 'Tailored Ikat Kurti Set with Concealed Placket',
      fabric: 'Pochampally Handloom Cotton-Silk'
    }
  ],
  sherwani: [
    {
      url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=85',
      name: 'Structured Royal Bandhgala Sherwani with Canvas Chest Piece',
      fabric: 'Matte Raw Silk with Resham Embroidery'
    }
  ],
  tuxedo: [
    {
      url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=85',
      name: 'Indo-Western Velvet Tuxedo Coat with Satin Shawl Lapel',
      fabric: 'Micro-Velvet with Satin Trim'
    }
  ]
};

function getCuratedTailorConcept(garmentType) {
  const g = (garmentType || '').toLowerCase();
  let list = curatedTailorGallery.blouse;

  if (g.includes('sherwani') || g.includes('bandhgala') || g.includes('kurta') || g.includes('coat')) {
    list = curatedTailorGallery.sherwani;
  } else if (g.includes('tuxedo') || g.includes('suit') || g.includes('jacket') || g.includes('blazer')) {
    list = curatedTailorGallery.tuxedo;
  } else if (g.includes('anarkali') || g.includes('kurti') || g.includes('lehenga') || g.includes('dress')) {
    list = curatedTailorGallery.suit;
  }

  return list[Math.floor(Math.random() * list.length)];
}

/**
 * Builds a prompt specifically tuned for atelier tailor craftsmanship and seam construction
 */
function buildTailorPrompt({ garmentType, fabric, color, style, occasion, embroidery, additionalDescription }) {
  return `Haute couture master tailor atelier workshop photograph of a bespoke ${garmentType || 'Designer Garment'}.
Tailoring Style & Cut: ${style || 'Bespoke Structured Cut'}.
Fabric & Material: ${fabric || 'Luxury Silk'}, showing clear tactile weave texture, thread sheen, and material weight.
Color Palette: ${color || 'Royal Blue & Gold'}.
Occasion: ${occasion || 'Formal Celebration'}.
Embroidery & Stitching Construction: ${embroidery || 'Precise needlework with reinforced seam finishes'}.
Tailor's Technical Notes: ${additionalDescription || 'Double-needle seam reinforcements, precision dart placement, structured shoulder pads, and concealed zipper'}.
Staged in a luxury master tailor's atelier studio draped on a vintage wooden tailor's mannequin bust form, measuring tape draped nearby, fabric swatches on a clean wooden cutting table, directional studio lighting.
Strictly NO human head, NO human face, NO human body or avatar. Clear focus on garment tailoring, seamlines, collar construction, hem stitching, and material texture. High definition 8k photography.`;
}

/**
 * Generate a complete tailor garment concept with visual and technical pattern making specs
 */
async function generateTailorDesign(params) {
  const {
    garmentType = 'Bridal Blouse',
    fabric = 'Raw Silk & Banarasi Brocade',
    color = 'Deep Crimson & Antique Gold',
    style = 'Princess Cut with Deep Sweetheart Neck',
    occasion = 'Bridal Ceremony',
    embroidery = 'Zardozi Border with French Knots',
    additionalDescription = '',
    apiKey: clientApiKey
  } = params;

  const activeApiKey = (process.env.GEMINI_API_KEY || clientApiKey || '').trim();
  const prompt = buildTailorPrompt(params);

  let imageUrl = null;
  let isLiveGemini = false;
  let tailorBlueprint = null;
  let errorNotice = null;

  if (activeApiKey && activeApiKey.trim() !== '') {
    try {
      const ai = new GoogleGenAI({ apiKey: activeApiKey.trim() });

      // Attempt 1: Try Imagen 3 image generation
      try {
        const imgResponse = await ai.models.generateImages({
          model: 'imagen-3.0-generate-002',
          prompt,
          config: {
            numberOfImages: 1,
            aspectRatio: '3:4',
            outputMimeType: 'image/jpeg'
          }
        });

        if (imgResponse?.generatedImages?.[0]?.image?.imageBytes) {
          imageUrl = `data:image/jpeg;base64,${imgResponse.generatedImages[0].image.imageBytes}`;
          isLiveGemini = true;
        }
      } catch (imgErr) {
        console.warn('Tailor Imagen-3 generation failed, falling back to gemini-2.5-flash-image:', imgErr.message);

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
          console.warn('Tailor gemini-2.5-flash-image failed:', flashErr.message);
          errorNotice = imgErr.message || flashErr.message;
        }
      }

      // Generate Tailor Technical Blueprint & Job Card with Gemini 2.5 Flash
      try {
        const textResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `You are an elite Master Pattern Cutter and Senior Tailor at an haute couture bespoke atelier.
Provide a comprehensive, technical tailoring job sheet for this custom garment order:
- Garment Type: ${garmentType}
- Fabric/Material: ${fabric}
- Color: ${color}
- Style & Silhouette: ${style}
- Occasion: ${occasion}
- Embroidery & Stitching: ${embroidery}
- Additional Description: ${additionalDescription}

Return a strictly valid JSON object (no markdown backticks, raw JSON only) with this exact schema:
{
  "jobTitle": "A technical title for this tailoring project",
  "garmentArchitecture": "Detailed description of pattern pieces, cutting methodology, darts, and seam structures",
  "yardageMatrix": {
    "mainFabric": "e.g. 1.25 meters (44-inch width)",
    "liningFabric": "e.g. 1.0 meter pure cotton lining",
    "interfacingCanvas": "e.g. 0.4 meter fusible micro-canvas for collar/placket"
  },
  "stitchAndNeedleSpecs": {
    "needleType": "e.g. Size 11/75 Ballpoint for fine silk",
    "stitchDensity": "e.g. 12-14 Stitches Per Inch (SPI)",
    "seamAllowance": "e.g. 0.5 inch standard, 2.0 inch alteration margin on side seams"
  },
  "embroideryExecutionGuide": "Specific guidance on needlework type, positioning along necklines/sleeves, and thread tensions",
  "assemblySequence": [
    "Step 1: Fabric inspection, iron preshrink, and interfacing fusing",
    "Step 2: Darts and princess seam assembly",
    "Step 3: Neckline facing and piped border attachment",
    "Step 4: Sleeve insertion and side seam inlays",
    "Step 5: Hand-tacking lining, hook/eye closures, and final steam press"
  ],
  "labourBreakdown": {
    "cuttingHours": "e.g. 1.5 Hours",
    "embroideryHours": "e.g. 8-10 Hours",
    "stitchingHours": "e.g. 4.0 Hours",
    "finishingHours": "e.g. 1.5 Hours"
  },
  "qualityChecklist": [
    "Verify neckline symmetry and depth tolerance (+/- 0.25 inch)",
    "Check side seam 2-inch alteration margin",
    "Ensure lining is hand-hemmed with no puckering",
    "Inspect hook and eye firmness"
  ]
}`
        });

        const rawText = textResponse.text || '';
        const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        tailorBlueprint = JSON.parse(cleaned);
      } catch (textErr) {
        console.warn('Tailor blueprint generation notice:', textErr.message);
      }

    } catch (apiErr) {
      console.error('Tailor AI initialization error:', apiErr);
      errorNotice = apiErr.message;
    }
  } else {
    errorNotice = 'GEMINI_API_KEY is not configured in backend .env. Loaded atelier technical blueprint & concept.';
  }

  // Fallback to curated concept image if image generation was skipped or unavailable
  if (!imageUrl) {
    const fallback = getCuratedTailorConcept(garmentType);
    imageUrl = fallback.url;
  }

  // Fallback blueprint if Gemini text critique was offline
  if (!tailorBlueprint) {
    tailorBlueprint = {
      jobTitle: `${color} ${fabric} ${garmentType}`,
      garmentArchitecture: `Structured ${style.toLowerCase()} featuring precision princess seams and curved armhole contours. Engineered with 4-piece pattern drafting for anatomical contouring, reinforced collar stands, and concealed seam allowances.`,
      yardageMatrix: {
        mainFabric: '2.5–3.5 meters (44-inch width)',
        liningFabric: '2.0–3.0 meters breathable cotton-silk lining',
        interfacingCanvas: '0.6 meters woven fusible interfacing for collar, cuffs, and placket'
      },
      stitchAndNeedleSpecs: {
        needleType: 'Size 11/75 Sharp for silk/cotton; Size 14/90 for brocade/velvet',
        stitchDensity: '12–14 Stitches Per Inch (SPI) on main body seams',
        seamAllowance: '0.5 inch standard armhole seams; 2.0 inch side inlays for client alterations'
      },
      embroideryExecutionGuide: `Execute ${embroidery} with balanced thread tension to prevent puckering. Back all heavy zari regions with water-soluble tear-away stabilizer before machine or aari work.`,
      assemblySequence: [
        'Step 1: Grainline alignment, chalk drafting, and precision pattern cutting',
        'Step 2: Thermal fusing of interlining to collar, neckline facings, and cuffs',
        'Step 3: Princess seam stitching with stay-stitching along neckline curves',
        'Step 4: Sleeve setting with ease distribution over shoulder crown',
        'Step 5: Hand-basting inner lining with blind-hemming and final high-pressure steam press'
      ],
      labourBreakdown: {
        cuttingHours: '2.0 Hours',
        embroideryHours: '8–12 Hours',
        stitchingHours: '5.0 Hours',
        finishingHours: '1.5 Hours'
      },
      qualityChecklist: [
        'Check symmetrical curve balance across front left and right panels',
        'Verify 2-inch alteration inlays are ironed open and finished with serging',
        'Confirm concealed zipper operates smoothly with no teeth exposure',
        'Inspect lining tension to ensure outer fabric drapes without pulling'
      ]
    };
  }

  return {
    id: `tailor-concept-${Date.now()}`,
    imageUrl,
    isLiveGemini,
    errorNotice,
    prompt,
    inputs: {
      garmentType,
      fabric,
      color,
      style,
      occasion,
      embroidery,
      additionalDescription
    },
    blueprint: tailorBlueprint,
    createdAt: new Date().toISOString()
  };
}

module.exports = {
  generateTailorDesign,
  buildTailorPrompt
};

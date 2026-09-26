const { GoogleGenAI } = require('@google/genai');

/**
 * Curated high-resolution couture concepts for standalone dresses (no faces/avatars)
 * Used as reliable fallbacks when API key is missing or quota is exhausted.
 */
const curatedCoutureGallery = {
  lehenga: [
    {
      url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=85',
      name: 'Royal Zardozi Crimson Velvet Bridal Lehenga',
      colors: 'Crimson Red & Antique Gold'
    },
    {
      url: 'https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&w=800&q=85',
      name: 'Pastel Blush Rose Organza Embroidered Lehenga',
      colors: 'Blush Pink & Rose Gold'
    },
    {
      url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=85',
      name: 'Heritage Marigold & Emerald Hand-Embroidered Lehenga',
      colors: 'Marigold & Emerald'
    }
  ],
  saree: [
    {
      url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=85',
      name: 'Pure Kanchipuram Brocade Gold Weave Saree',
      colors: 'Crimson Red & Pure Gold'
    },
    {
      url: 'https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&w=800&q=85',
      name: 'Pochampally Double Ikat Handloom Saree',
      colors: 'Royal Indigo & Ivory'
    }
  ],
  anarkali: [
    {
      url: 'https://images.unsplash.com/photo-1631857455684-a54a2f03665f?auto=format&fit=crop&w=800&q=85',
      name: 'Imperial Teal & Gold Flared Silk Anarkali Gown',
      colors: 'Teal Blue & Gold'
    }
  ],
  gown: [
    {
      url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=85',
      name: 'Couture Silk Georgette Evening Cape Gown',
      colors: 'Midnight Navy & Silver'
    }
  ],
  kurti: [
    {
      url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=85',
      name: 'Chanderi Silk Flared Kurti with Zari Border',
      colors: 'Sage Green & Champagne'
    }
  ],
  fusion: [
    {
      url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=85',
      name: 'Contemporary Indo-Western Brocade Drape Dress',
      colors: 'Ivory & Gold'
    }
  ]
};

function getCuratedConcept(dressType, colors) {
  const typeKey = (dressType || '').toLowerCase();
  let list = curatedCoutureGallery.lehenga;

  if (typeKey.includes('saree')) list = curatedCoutureGallery.saree;
  else if (typeKey.includes('anarkali') || typeKey.includes('suit')) list = curatedCoutureGallery.anarkali;
  else if (typeKey.includes('gown') || typeKey.includes('maxi')) list = curatedCoutureGallery.gown;
  else if (typeKey.includes('kurti') || typeKey.includes('shirt')) list = curatedCoutureGallery.kurti;
  else if (typeKey.includes('fusion') || typeKey.includes('blouse')) list = curatedCoutureGallery.fusion;

  return list[Math.floor(Math.random() * list.length)];
}

/**
 * Builds a prompt strictly focused on dress couture without human avatars/faces
 */
function buildDressPrompt({ dressType, occasion, style, fabric, colors, pattern, additionalRequirements }) {
  return `Haute couture studio product concept photograph of a standalone ${dressType || 'Couture Garment'}.
Occasion: ${occasion || 'Celebration'}.
Style & Silhouette: ${style || 'Contemporary Royal'}.
Fabric & Material: ${fabric || 'Pure Silk'}, showcasing authentic weave texture, realistic light sheen, and graceful drape.
Color Palette: ${colors || 'Royal Gold & Crimson'}.
Patterns & Embellishments: ${pattern || 'Handcrafted Zari embroidery'}.
Specific Tailoring Details: ${additionalRequirements || 'Fine boutique stitching, reinforced seams, elegant finished borders'}.
Staged exclusively as a solo garment draped on an ivory linen dressmaker mannequin bust form against a minimalist studio background with warm soft directional spotlighting.
Strictly NO human head, NO human face, NO human body or avatar, NO limbs. Pure focus on dress silhouette, garment construction, fabric folds, and textile embroidery craftsmanship. Ultra-detailed 8k fashion photography.`;
}

/**
 * Generate a complete dress design concept with visual and technical fashion specs
 */
async function generateDressDesign(params) {
  const {
    dressType = 'Lehenga',
    occasion = 'Wedding Ceremony',
    style = 'Royal Heritage',
    fabric = 'Banarasi Silk',
    colors = 'Crimson Red & Antique Gold',
    pattern = 'Intricate Zardozi Work',
    additionalRequirements = '',
    apiKey: clientApiKey
  } = params;

  const activeApiKey = clientApiKey || process.env.GEMINI_API_KEY;
  const prompt = buildDressPrompt(params);

  let imageUrl = null;
  let isLiveGemini = false;
  let aiSummary = null;
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
        console.warn('Imagen-3 generation attempt failed, falling back to gemini-2.5-flash-image:', imgErr.message);

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
          console.warn('gemini-2.5-flash-image attempt failed:', flashErr.message);
          errorNotice = imgErr.message || flashErr.message;
        }
      }

      // Generate Couture Specification & Craftsmanship Notes using Gemini 2.5 Flash
      try {
        const textResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `You are an elite master fashion consultant and artisan designer for AuraStitch AI.
Analyze this custom dress order:
- Dress Type: ${dressType}
- Occasion: ${occasion}
- Style: ${style}
- Fabric: ${fabric}
- Colors: ${colors}
- Pattern: ${pattern}
- Additional Requirements: ${additionalRequirements}

Provide a JSON object (no markdown backticks, raw JSON only) with these exact keys:
{
  "title": "A regal high-fashion title for this outfit",
  "conceptSummary": "2-3 sentences describing the drape, visual balance, and aura of this design",
  "craftsmanshipNotes": "Detailed advice for weavers and master tailors on cut, border attachment, lining, and embroidery",
  "stylingTips": "Recommended jewelry, footwear, and hairstyle pairing",
  "estimatedArtisanHours": "e.g. 48-60 Artisan Hours",
  "recommendedTrims": "Specific laces, latkans, or zari threads recommended"
}`
        });

        const rawText = textResponse.text || '';
        const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        aiSummary = JSON.parse(cleaned);
      } catch (textErr) {
        console.warn('Gemini specs generation notice:', textErr.message);
      }

    } catch (apiErr) {
      console.error('Gemini initialization error:', apiErr);
      errorNotice = apiErr.message;
    }
  } else {
    errorNotice = 'GEMINI_API_KEY is not configured in backend .env or request body. Provided high-definition curated couture concept.';
  }

  // Fallback to curated studio concept if image generation did not yield a base64 image
  if (!imageUrl) {
    const fallback = getCuratedConcept(dressType, colors);
    imageUrl = fallback.url;
  }

  // Fallback specs if text generation was skipped or offline
  if (!aiSummary) {
    aiSummary = {
      title: `${colors} ${fabric} ${dressType}`,
      conceptSummary: `A bespoke ${style.toLowerCase()} concept designed for ${occasion.toLowerCase()}. Crafted in luxurious ${fabric} with rich ${colors} undertones and highlighted by intricate ${pattern.toLowerCase()}.`,
      craftsmanshipNotes: `Double-needle seam reinforcements recommended along the princess seams. Use matching ${colors.split('&')[0].trim()} cotton-silk inner lining for breathable structure. Border zari should be hand-tacked with concealed stitching.`,
      stylingTips: `Pair with antique temple gold jewelry or polki pearls. Minimalist footwear in metallic champagne gold complements the ${fabric} drape.`,
      estimatedArtisanHours: '36–48 Handcraft Hours',
      recommendedTrims: `${pattern} embroidered border lace, hand-tied silk dori tassels (latkans), and micro-beaded hems.`
    };
  }

  return {
    id: `concept-${Date.now()}`,
    imageUrl,
    isLiveGemini,
    errorNotice,
    prompt,
    specs: {
      dressType,
      occasion,
      style,
      fabric,
      colors,
      pattern,
      additionalRequirements,
      ...aiSummary
    },
    createdAt: new Date().toISOString()
  };
}

module.exports = {
  generateDressDesign,
  buildDressPrompt
};

const express = require('express');
const router = express.Router();
const { chatWithCustomer } = require('../ai/customerAI');
const { generateDressDesign } = require('../ai/geminiDressDesigner');
const { generateTailorDesign } = require('../ai/geminiTailorAI');
const { generateHandloomDesign } = require('../ai/geminiHandloomAI');
const { generateSupplierProductIdea } = require('../ai/geminiSupplierAI');

/**
 * @route   POST /customer/generate-dress
 * @desc    Generates a visual concept of a dress using Gemini (standalone garment, no avatars)
 * @access  Public
 */
router.post('/customer/generate-dress', async (req, res) => {
  try {
    const {
      dressType,
      occasion,
      fabric,
      colors,
      neckStyle,
      neckline,
      sleeveStyle,
      sleeve,
      embellishment,
      pattern,
      customRequirements,
      additionalRequirements,
      style,
      apiKey
    } = req.body;

    const designResult = await generateDressDesign({
      dressType: dressType || 'Bridal Lehenga',
      occasion: occasion || 'Wedding',
      fabric: fabric || 'Banarasi Silk',
      colors: colors || 'Maroon + Antique Gold',
      neckStyle: neckStyle || neckline || 'Sweetheart Royal',
      sleeveStyle: sleeveStyle || sleeve || 'Elbow Length',
      embellishment: embellishment || pattern || 'Intricate Zardozi & Dabka Needlework',
      customRequirements: typeof customRequirements === 'string' ? customRequirements : (additionalRequirements || ''),
      style: style || 'Haute Couture Bespoke',
      prompt: req.body.prompt,
      apiKey
    });

    return res.status(200).json(designResult);
  } catch (error) {
    console.error('Error in POST /customer/generate-dress:', error);
    const statusCode = error.statusCode || error.status || 500;
    return res.status(statusCode).json({ message: error.message || 'Error generating dress design.' });
  }
});

/**
 * @route   POST /customer/chat
 * @desc    Accepts a prompt, calls chatWithCustomer(prompt), and returns the response as JSON
 * @access  Public
 */
router.post('/customer/chat', async (req, res) => {
  const { prompt } = req.body;

  // Validate that the prompt exists and is a non-empty string
  if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
    return res.status(400).json({ message: 'Prompt is required and must be a non-empty string.' });
  }

  try {
    const response = await chatWithCustomer(prompt);
    return res.status(200).json({ response });
  } catch (error) {
    console.error('Error in POST /customer/chat endpoint:', error);
    return res.status(500).json({ message: error.message || 'Internal server error.' });
  }
});

/**
 * @route   POST /tailor/generate-design
 * @desc    Generates a bespoke tailor garment and material design concept with pattern cutting specs
 * @access  Public
 */
router.post('/tailor/generate-design', async (req, res) => {
  try {
    const {
      garmentType,
      fabric,
      color,
      style,
      occasion,
      embroidery,
      additionalDescription,
      apiKey
    } = req.body;

    const designResult = await generateTailorDesign({
      garmentType: garmentType || 'Bridal Blouse',
      fabric: fabric || 'Raw Silk',
      color: color || 'Royal Navy & Gold',
      style: style || 'Princess Cut with Sweetheart Neck',
      occasion: occasion || 'Wedding Reception',
      embroidery: embroidery || 'Zardozi Threadwork & Piping',
      additionalDescription: additionalDescription || '',
      apiKey
    });

    return res.status(200).json(designResult);
  } catch (error) {
    console.error('Error in POST /tailor/generate-design:', error);
    return res.status(500).json({ message: error.message || 'Error generating tailor design concept.' });
  }
});

/**
 * @route   POST /tailor/chat
 * @desc    Placeholder for Tailor AI chat features
 * @access  Public
 */
router.post('/tailor/chat', (req, res) => {
  return res.status(200).json({ message: 'Tailor AI features are currently under development.' });
});

/**
 * @route   POST /handloom/generate-textile
 * @desc    Generates authentic handloom textile & print design concepts with loom specs (no avatars)
 * @access  Public
 */
router.post('/handloom/generate-textile', async (req, res) => {
  try {
    const {
      textileType,
      weavingPrintingStyle,
      motif,
      pattern,
      colors,
      styleType,
      targetProduct,
      additionalDescription,
      apiKey
    } = req.body;

    const textileResult = await generateHandloomDesign({
      textileType: textileType || 'Pure Mulberry Katan Silk',
      weavingPrintingStyle: weavingPrintingStyle || 'Banarasi Kadwa Brocade Weave',
      motif: motif || 'Kalka (Paisley Pine) & Lotus Medallion',
      pattern: pattern || 'Allover Continuous Jaal Lattice',
      colors: colors || 'Turmeric Ochre, Deep Indigo & Antique Gold Zari',
      styleType: styleType || 'Traditional Heritage',
      targetProduct: targetProduct || 'Saree Fabric with Border & Pallu',
      additionalDescription: additionalDescription || '',
      apiKey
    });

    return res.status(200).json(textileResult);
  } catch (error) {
    console.error('Error in POST /handloom/generate-textile:', error);
    return res.status(500).json({ message: error.message || 'Error generating handloom textile design.' });
  }
});

/**
 * @route   POST /weaver/generate-textile
 * @desc    Alias route for Handloom / Weaver textile generator
 * @access  Public
 */
router.post('/weaver/generate-textile', async (req, res) => {
  try {
    const textileResult = await generateHandloomDesign(req.body);
    return res.status(200).json(textileResult);
  } catch (error) {
    console.error('Error in POST /weaver/generate-textile:', error);
    return res.status(500).json({ message: error.message || 'Error generating weaver textile design.' });
  }
});

/**
 * @route   POST /weaver/chat
 * @desc    Placeholder for Weaver AI chat features
 * @access  Public
 */
router.post('/weaver/chat', (req, res) => {
  return res.status(200).json({ message: 'Weaver AI features are currently under development.' });
});

/**
 * @route   POST /supplier/generate-product
 * @desc    Generates B2B product and material concepts for suppliers with commercial wholesale specs
 * @access  Public
 */
router.post('/supplier/generate-product', async (req, res) => {
  try {
    const {
      productCategory,
      material,
      fabricType,
      targetCustomer,
      targetTailorBusiness,
      colorStyle,
      seasonalRequirement,
      additionalDescription,
      apiKey
    } = req.body;

    const productResult = await generateSupplierProductIdea({
      productCategory: productCategory || 'Raw Fabric Yardage & Bolt Rolls',
      material: material || '100% Pure Mulberry Silk',
      fabricType: fabricType || 'Crisp Heavy Katan Weave (118 GSM)',
      targetCustomer: targetCustomer || 'Luxury Bridal & Occasionwear Clients',
      targetTailorBusiness: targetTailorBusiness || 'Haute Couture Bridal Ateliers & Boutiques',
      colorStyle: colorStyle || 'Royal Emerald & Burnished Gold',
      seasonalRequirement: seasonalRequirement || 'Festive / Wedding Season Q3-Q4',
      additionalDescription: additionalDescription || '',
      apiKey
    });

    return res.status(200).json(productResult);
  } catch (error) {
    console.error('Error in POST /supplier/generate-product:', error);
    return res.status(500).json({ message: error.message || 'Error generating supplier product idea.' });
  }
});

/**
 * @route   POST /supplier/generate-material
 * @desc    Alias route for supplier product & material generator
 * @access  Public
 */
router.post('/supplier/generate-material', async (req, res) => {
  try {
    const productResult = await generateSupplierProductIdea(req.body);
    return res.status(200).json(productResult);
  } catch (error) {
    console.error('Error in POST /supplier/generate-material:', error);
    return res.status(500).json({ message: error.message || 'Error generating supplier material idea.' });
  }
});

/**
 * @route   POST /supplier/chat
 * @desc    Placeholder for Supplier AI chat features
 * @access  Public
 */
router.post('/supplier/chat', (req, res) => {
  return res.status(200).json({ message: 'Supplier AI features are currently under development.' });
});

/**
 * @route   POST /admin/chat
 * @desc    Placeholder for Admin AI chat features
 * @access  Public
 */
router.post('/admin/chat', (req, res) => {
  return res.status(200).json({ message: 'Admin AI features are currently under development.' });
});

module.exports = router;

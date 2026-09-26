const express = require('express');
const router = express.Router();
const { chatWithCustomer } = require('../ai/customerAI');
const { generateDressDesign } = require('../ai/geminiDressDesigner');
const { generateTailorDesign } = require('../ai/geminiTailorAI');

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
      style,
      fabric,
      colors,
      pattern,
      additionalRequirements,
      apiKey
    } = req.body;

    const designResult = await generateDressDesign({
      dressType: dressType || 'Lehenga',
      occasion: occasion || 'Wedding Ceremony',
      style: style || 'Royal Heritage',
      fabric: fabric || 'Banarasi Silk',
      colors: colors || 'Crimson Red & Antique Gold',
      pattern: pattern || 'Intricate Zardozi Work',
      additionalRequirements: additionalRequirements || '',
      apiKey
    });

    return res.status(200).json(designResult);
  } catch (error) {
    console.error('Error in POST /customer/generate-dress:', error);
    return res.status(500).json({ message: error.message || 'Error generating dress design.' });
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
 * @route   POST /weaver/chat
 * @desc    Placeholder for Weaver AI chat features
 * @access  Public
 */
router.post('/weaver/chat', (req, res) => {
  return res.status(200).json({ message: 'Weaver AI features are currently under development.' });
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

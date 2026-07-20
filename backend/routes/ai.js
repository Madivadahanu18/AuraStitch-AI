const express = require('express');
const router = express.Router();
const { chatWithCustomer } = require('../ai/customerAI');

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

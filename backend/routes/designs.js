const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Design = require('../models/Design');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_aurastitch_123';

// Simple protect middleware
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// @route   POST /api/designs
// @desc    Save a new garment design customization
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { category, neck, sleeve, texture } = req.body;

    if (!category || !neck || !sleeve || !texture) {
      return res.status(400).json({ message: 'Please provide category, neck, sleeve and texture configurations' });
    }

    const design = await Design.create({
      user: req.user._id,
      category,
      neck,
      sleeve,
      texture
    });

    res.status(201).json(design);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/designs
// @desc    Get user saved designs
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const designs = await Design.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(designs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/designs/:id
// @desc    Delete a saved design
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);

    if (!design) {
      return res.status(404).json({ message: 'Design not found' });
    }

    // Make sure design belongs to user
    if (design.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized to delete this design' });
    }

    await design.deleteOne();
    res.json({ message: 'Design removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_aurastitch_123';

// Generate Token helper
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      role,
      phone,
      shopName,
      address,
      experience,
      specialization,
      businessName,
      stateOfOrigin,
      weavingType,
      productCategories,
      govId
    } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Auto-detect role if not explicitly passed
    let assignedRole = role || 'customer';
    if (!role) {
      const emailLower = email.toLowerCase();
      if (emailLower.includes('tailor')) assignedRole = 'tailor';
      else if (emailLower.includes('weaver') || emailLower.includes('handloom')) assignedRole = 'weaver';
      else if (emailLower.includes('supplier')) assignedRole = 'supplier';
      else if (emailLower.includes('admin')) assignedRole = 'admin';
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: assignedRole,
      phone,
      shopName,
      address,
      experience,
      specialization,
      businessName,
      stateOfOrigin,
      weavingType,
      productCategories,
      govId
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        verificationStatus: user.verificationStatus,
        onboardingCompleted: user.onboardingCompleted,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      verificationStatus: user.verificationStatus,
      onboardingCompleted: user.onboardingCompleted,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/onboarding
// @desc    Complete onboarding preferences
// @access  Private (Needs token validation, but for initial refactoring, simple handler)
router.post('/onboarding', async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.onboardingCompleted = true;
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      verificationStatus: user.verificationStatus,
      onboardingCompleted: user.onboardingCompleted
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

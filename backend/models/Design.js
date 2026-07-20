const mongoose = require('mongoose');

const DesignSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: [true, 'Please specify the garment category'],
    enum: ['blouse', 'kurti', 'lehenga', 'shirt']
  },
  neck: {
    type: String,
    required: [true, 'Please specify neck pattern']
  },
  sleeve: {
    type: String,
    required: [true, 'Please specify sleeve pattern']
  },
  texture: {
    type: String,
    required: [true, 'Please specify fabric texture/material']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Design', DesignSchema);

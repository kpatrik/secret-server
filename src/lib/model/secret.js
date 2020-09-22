const mongoose = require('mongoose');

const secretSchema = new mongoose.Schema({
  hash: {
    type: String,
    required: true,
  },
  secretText: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: false,
  },
  remainingViews: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Secret', secretSchema);

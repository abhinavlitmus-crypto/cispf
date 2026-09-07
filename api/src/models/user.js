const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  age: {
    type: Number,
  },
  language: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'language',
  },

  city: {
    type: String,
  },
  state: {
    type: String,
  },
  photoUrl: {
    type: String,
  },
  status: {
    type: Boolean,
    default: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('userDetails', userSchema);

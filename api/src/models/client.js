const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({

  outreachDate: {
    type: Date,
  },
  location: {
    type: String,
  },
  typeOfOutreach: {
    type: String,
    enum: ['physical', 'virtual'],
  },
  referralBy: {
    type: String,
    enum: ['instagram', 'facebook', 'whatsapp', 'friend', 'other', 'whatsapp', 'website', 'Ad lead'],
  },
  clientName: {
    type: String,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'transgender', 'other'],
  },
  age: {
    type: Number,
  },
  state: {
    type: String,
  },
  city: {
    type: String,
  },
  topology: {
    type: String,
    enum: ['MSM', 'transgender', 'FSW', 'PWID', 'others'],
  },
  notes: {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'admins',
  }
  ,
  status: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  }

}, {
  timestamps: true,
});





module.exports = mongoose.model('clientDetails', clientSchema);

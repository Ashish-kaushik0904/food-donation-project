const mongoose = require('mongoose');

const donateRequestSchema = new mongoose.Schema({
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  foodType: {
    type: String,
    required: true
  },
  quantity: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  availableTill: {
    type: String,
    required: true
  },
  status: {
  type: String,
  enum: ['pending', 'accepted', 'rejected'],
  default: 'pending'
},
adminMessage: {
  type: String,
  default: ''
},
  matchedWith: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NeedRequest',
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('DonateRequest', donateRequestSchema);
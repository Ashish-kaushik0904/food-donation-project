const mongoose = require('mongoose');

const needRequestSchema = new mongoose.Schema({
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  foodNeeded: {
    type: String,
    required: true
  },
  quantityNeeded: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
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
    ref: 'DonateRequest',
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('NeedRequest', needRequestSchema);
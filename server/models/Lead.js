import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    unique: true
  },
  ownerName: { 
    type: String, 
    required: [true, 'Owner name is required'], 
    trim: true 
  },
  phone: { 
    type: String, 
    required: [true, 'Phone number is required'], 
    trim: true 
  },
  location: { 
    type: String, 
    required: [true, 'Property locality is required'], 
    trim: true 
  },
  assetType: { 
    type: String, 
    default: 'Villa' 
  },
  expectedPrice: { 
    type: String, 
    default: 'Price on Request' 
  },
  details: { 
    type: String, 
    default: '' 
  },
  status: { 
    type: String, 
    enum: ['Pending Inspection', 'In Review', 'Walkthrough Scheduled', 'Verified & Published', 'Rejected'],
    default: 'Pending Inspection' 
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      ret.id = ret._id.toString();
      delete ret.__v;
      return ret;
    }
  }
});

// Auto-generate ticketId before saving if not present
leadSchema.pre('save', function () {
  if (!this.ticketId) {
    this.ticketId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
  }
});

const Lead = mongoose.models.Lead || mongoose.model('Lead', leadSchema);

export default Lead;

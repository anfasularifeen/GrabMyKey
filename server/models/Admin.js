import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Admin name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Admin email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid administrative email address']
  },
  password: {
    type: String,
    required: [true, 'Admin password is required'],
    minlength: [8, 'Password must be at least 8 characters long']
  },
  role: {
    type: String,
    enum: ['admin', 'superadmin'],
    default: 'admin'
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function (doc, ret) {
      ret.id = ret._id.toString();
      delete ret.password;
      delete ret.__v;
      return ret;
    }
  }
});

// Pre-save password hashing hook
AdminSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Password verification method
AdminSchema.methods.comparePassword = async function (candidatePassword) {
  if (!candidatePassword || !this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

export default Admin;


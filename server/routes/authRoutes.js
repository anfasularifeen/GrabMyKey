import express from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import { requireAdminAuth } from '../middleware/authMiddleware.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'grabmykey_luxury_real_estate_jwt_secret_key_2026';
const ADMIN_INVITE_KEY = process.env.ADMIN_INVITE_KEY || 'GMK-ADMIN-2026';

// Helper to generate a signed JWT token (7-day validity)
const generateToken = (admin) => {
  return jwt.sign(
    {
      id: admin._id || admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role || 'admin'
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

/**
 * POST /api/auth/signup
 * Register a new administrative user with an authorized invite key
 */
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, inviteKey } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Full name is required.' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Valid email address is required.' });
    }
    if (!password || password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long.' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if any admin already exists in the system
    const adminCount = await Admin.countDocuments();

    // If admins already exist, strictly verify the administrative invite key
    if (adminCount > 0) {
      if (!inviteKey || inviteKey.trim() !== ADMIN_INVITE_KEY) {
        return res.status(403).json({
          success: false,
          message: 'Invalid administrative invite key. Contact your system superadmin for authorization.'
        });
      }
    }

    // Check if email is already taken
    const existing = await Admin.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An administrator account with this email address already exists.'
      });
    }

    // Create the new administrator (the first one is superadmin)
    const newAdmin = await Admin.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: adminCount === 0 ? 'superadmin' : 'admin',
      lastLogin: new Date()
    });

    const token = generateToken(newAdmin);

    res.status(201).json({
      success: true,
      message: 'Administrator account registered successfully.',
      token,
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role
      }
    });
  } catch (error) {
    console.error('[Auth Signup Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create administrative account.',
      error: error.message
    });
  }
});

/**
 * POST /api/auth/login
 * Authenticate administrator with email and password
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !email.trim() || !password) {
      return res.status(400).json({
        success: false,
        message: 'Administrative email and password are required.'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const admin = await Admin.findOne({ email: normalizedEmail });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid administrative credentials.'
      });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid administrative credentials.'
      });
    }

    // Update last login timestamp
    admin.lastLogin = new Date();
    await admin.save();

    const token = generateToken(admin);

    res.status(200).json({
      success: true,
      message: 'Administrative authentication successful.',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('[Auth Login Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication service encountered an error.',
      error: error.message
    });
  }
});

/**
 * GET /api/auth/me
 * Verify current JWT token and return active admin profile
 */
router.get('/me', requireAdminAuth, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Administrator profile not found.'
      });
    }

    res.status(200).json({
      success: true,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin
      }
    });
  } catch (error) {
    console.error('[Auth Me Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve administrative profile.',
      error: error.message
    });
  }
});

/**
 * POST /api/auth/logout
 */
router.post('/logout', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Administrative session ended successfully.'
  });
});

export default router;


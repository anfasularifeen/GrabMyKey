import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import Setting from '../models/Setting.js';
import { requireAdminAuth } from '../middleware/authMiddleware.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'grabmykey_luxury_real_estate_jwt_secret_key_2026';

// Helper to fetch active dynamic invite key from database or fallback to env
const getActiveInviteKey = async () => {
  try {
    const setting = await Setting.findOne({ key: 'admin_invite_key' });
    if (setting && setting.value && String(setting.value).trim()) {
      return String(setting.value).trim();
    }
  } catch (err) {
    console.error('[Error fetching dynamic invite key]:', err);
  }
  return (process.env.ADMIN_INVITE_KEY || 'GMK-ADMIN-2026').trim();
};

// Helper to generate a signed JWT token (7-day validity)
const generateToken = (admin) => {
  return jwt.sign(
    {
      id: admin._id || admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role || 'admin',
      status: admin.status || 'approved'
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

/**
 * POST /api/auth/signup
 * Register a new administrative user.
 * - If 0 approved admins exist: auto-approves as superadmin and issues token.
 * - If approved admins already exist: requires valid dynamic invite key and creates account with 'pending' status.
 */
router.post('/signup', async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database disconnected: Unable to reach MongoDB'
    });
  }

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

    // Check if an approved admin already exists in the system
    const approvedCount = await Admin.countDocuments({ status: 'approved' });

    // If approved admins exist, strictly verify the administrative invite key
    if (approvedCount > 0) {
      const activeInviteKey = await getActiveInviteKey();
      if (!inviteKey || inviteKey.trim() !== activeInviteKey) {
        return res.status(403).json({
          success: false,
          message: 'Invalid administrative invite key. Contact an authorized administrator.'
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

    const isFirstAdmin = approvedCount === 0;

    // Create the administrator
    const newAdmin = await Admin.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: isFirstAdmin ? 'superadmin' : 'admin',
      status: isFirstAdmin ? 'approved' : 'pending',
      lastLogin: isFirstAdmin ? new Date() : null
    });

    if (isFirstAdmin) {
      const token = generateToken(newAdmin);
      return res.status(201).json({
        success: true,
        message: 'Initial administrator account created and activated successfully.',
        token,
        admin: {
          id: newAdmin._id,
          name: newAdmin.name,
          email: newAdmin.email,
          role: newAdmin.role,
          status: newAdmin.status
        }
      });
    }

    // Account created in pending status - no session token issued
    res.status(201).json({
      success: true,
      pendingApproval: true,
      message: 'Your registration request has been submitted and is pending approval from an existing administrator.',
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
        status: newAdmin.status
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
 * Authenticate administrator with email and password.
 * Strictly blocks 'pending' or 'rejected' accounts.
 */
router.post('/login', async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database disconnected: Unable to reach MongoDB'
    });
  }

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

    // Auto-migrate legacy admin records created before the status field existed
    // or ensure primary admin (contact@grabmykey.in) is always superadmin & approved
    const rawAdmin = await Admin.collection.findOne({ _id: admin._id });
    const isPrimaryAdmin = normalizedEmail === 'contact@grabmykey.in';
    const isLegacyRecord = !rawAdmin || !('status' in rawAdmin) || rawAdmin.status === null;

    if (isPrimaryAdmin || isLegacyRecord) {
      admin.status = 'approved';
      if (isPrimaryAdmin || !rawAdmin?.role || rawAdmin.role === 'admin') {
        admin.role = 'superadmin';
      }
      await admin.save();
    }

    // Check admin approval status
    const status = admin.status || 'approved';

    if (status === 'pending') {
      return res.status(403).json({
        success: false,
        pendingApproval: true,
        message: 'Your admin account is awaiting approval from an existing administrator.'
      });
    }

    if (status === 'rejected') {
      return res.status(403).json({
        success: false,
        message: 'Your administrative access request has been declined. Please contact your system administrator.'
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
        role: admin.role,
        status: admin.status || 'approved'
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
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database disconnected: Unable to reach MongoDB'
    });
  }

  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Administrator profile not found.'
      });
    }

    const status = admin.status || 'approved';
    if (status !== 'approved') {
      return res.status(403).json({
        success: false,
        message: 'Account is not in approved state.'
      });
    }

    res.status(200).json({
      success: true,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        status: admin.status,
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
 * GET /api/auth/admins
 * List all registered administrators (Protected)
 */
router.get('/admins', requireAdminAuth, async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database disconnected: Unable to reach MongoDB'
    });
  }

  try {
    const admins = await Admin.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      admins
    });
  } catch (error) {
    console.error('[Auth List Admins Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to list administrators.',
      error: error.message
    });
  }
});

/**
 * PATCH /api/auth/admins/:id/approve
 * Approve a pending admin account (Protected)
 */
router.patch('/admins/:id/approve', requireAdminAuth, async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database disconnected: Unable to reach MongoDB'
    });
  }

  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Administrator not found.'
      });
    }

    admin.status = 'approved';
    await admin.save();

    res.status(200).json({
      success: true,
      message: `Account for ${admin.name} has been approved.`,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        status: admin.status
      }
    });
  } catch (error) {
    console.error('[Auth Approve Admin Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve administrator.',
      error: error.message
    });
  }
});

/**
 * PATCH /api/auth/admins/:id/reject
 * Reject an admin account (Protected)
 */
router.patch('/admins/:id/reject', requireAdminAuth, async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database disconnected: Unable to reach MongoDB'
    });
  }

  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Administrator not found.'
      });
    }

    // Prevent rejecting own account
    if (req.admin.id === admin._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot reject your own administrator account.'
      });
    }

    // Prevent rejecting the sole superadmin
    if (admin.role === 'superadmin') {
      const superadminCount = await Admin.countDocuments({ role: 'superadmin', status: 'approved' });
      if (superadminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot reject the primary superadmin account.'
        });
      }
    }

    admin.status = 'rejected';
    await admin.save();

    res.status(200).json({
      success: true,
      message: `Account request for ${admin.name} has been rejected.`,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        status: admin.status
      }
    });
  } catch (error) {
    console.error('[Auth Reject Admin Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject administrator.',
      error: error.message
    });
  }
});

/**
 * DELETE /api/auth/admins/:id
 * Remove an administrator (Protected)
 */
router.delete('/admins/:id', requireAdminAuth, async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database disconnected: Unable to reach MongoDB'
    });
  }

  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Administrator not found.'
      });
    }

    // Prevent self-deletion
    if (req.admin.id === admin._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own administrator account.'
      });
    }

    // Prevent deleting the last superadmin
    if (admin.role === 'superadmin') {
      const superadminCount = await Admin.countDocuments({ role: 'superadmin' });
      if (superadminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete the only superadmin account.'
        });
      }
    }

    await Admin.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: `Administrator ${admin.name} removed successfully.`
    });
  } catch (error) {
    console.error('[Auth Delete Admin Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete administrator.',
      error: error.message
    });
  }
});

/**
 * GET /api/auth/invite-key
 * Get current dynamic admin invite key (Protected)
 */
router.get('/invite-key', requireAdminAuth, async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database disconnected: Unable to reach MongoDB'
    });
  }

  try {
    const inviteKey = await getActiveInviteKey();
    res.status(200).json({
      success: true,
      inviteKey
    });
  } catch (error) {
    console.error('[Auth Get Invite Key Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve invite key.',
      error: error.message
    });
  }
});

/**
 * PUT /api/auth/invite-key
 * Update dynamic admin invite key in database (Protected)
 */
router.put('/invite-key', requireAdminAuth, async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database disconnected: Unable to reach MongoDB'
    });
  }

  try {
    const { inviteKey } = req.body;

    if (!inviteKey || typeof inviteKey !== 'string' || inviteKey.trim().length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Invite key must be at least 6 characters long.'
      });
    }

    const trimmedKey = inviteKey.trim();

    await Setting.findOneAndUpdate(
      { key: 'admin_invite_key' },
      {
        key: 'admin_invite_key',
        value: trimmedKey,
        description: 'Dynamic administrative invite registration key'
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'Administrative invite key updated successfully.',
      inviteKey: trimmedKey
    });
  } catch (error) {
    console.error('[Auth Update Invite Key Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update invite key.',
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

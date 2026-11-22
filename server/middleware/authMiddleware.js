import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'grabmykey_luxury_real_estate_jwt_secret_key_2026';

/**
 * Strict Admin Authentication Middleware
 * Requires a valid, non-expired JWT token in Authorization header.
 * Returns 401 Unauthorized if missing or invalid.
 */
export const requireAdminAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    let token = null;

    if (authHeader && typeof authHeader === 'string') {
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7).trim();
      } else {
        token = authHeader.trim();
      }
    } else if (req.headers['x-auth-token']) {
      token = String(req.headers['x-auth-token']).trim();
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied: Admin authentication token required',
        code: 'AUTH_TOKEN_REQUIRED'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    const isExpired = err.name === 'TokenExpiredError';
    return res.status(401).json({
      success: false,
      message: isExpired
        ? 'Administrative session has expired. Please log in again.'
        : 'Invalid or forged authentication token.',
      code: isExpired ? 'AUTH_TOKEN_EXPIRED' : 'AUTH_TOKEN_INVALID',
      error: err.message
    });
  }
};

export default requireAdminAuth;


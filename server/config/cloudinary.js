import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

const isConfigured = Boolean(
  cloudName &&
  apiKey &&
  apiSecret &&
  cloudName !== 'your_cloud_name_here' &&
  apiKey !== 'your_api_key_here' &&
  apiSecret !== 'your_api_secret_here' &&
  !cloudName.includes('your_cloud_name')
);

if (isConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true
  });
  console.log(`[Cloudinary] Persistent cloud image storage initialized for: ${cloudName}`);
} else {
  console.log('[Cloudinary] Offline / unconfigured mode: Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in server/.env for cloud uploads.');
}

/**
 * Upload single image (base64 data URL, local path, or remote URL) to Cloudinary.
 * Returns permanent secure HTTPS URL, or original string if Cloudinary is not configured.
 */
export const uploadImageToCloudinary = async (imageInput, folder = 'grabmykey/properties') => {
  if (!imageInput || typeof imageInput !== 'string') return imageInput;

  // If already an external HTTPS/HTTP URL (not base64 data URL), keep it
  if (!imageInput.startsWith('data:image/') && imageInput.startsWith('http')) {
    return imageInput;
  }

  // Graceful fallback if Cloudinary is not configured yet
  if (!isConfigured) {
    return imageInput;
  }

  try {
    const result = await cloudinary.uploader.upload(imageInput, {
      folder,
      resource_type: 'image',
      transformation: [
        { quality: 'auto:good', fetch_format: 'auto' }
      ]
    });
    return result.secure_url;
  } catch (err) {
    console.error('[Cloudinary Upload Error]:', err.message);
    return imageInput;
  }
};

/**
 * Upload an array of images to Cloudinary in parallel
 */
export const uploadImagesToCloudinary = async (imagesArray, folder = 'grabmykey/properties') => {
  if (!Array.isArray(imagesArray)) return [];
  return Promise.all(imagesArray.map(img => uploadImageToCloudinary(img, folder)));
};

/**
 * Extract Cloudinary public_id from a secure URL
 * Example: https://res.cloudinary.com/cloudname/image/upload/v1690000000/grabmykey/properties/sample.jpg
 * Returns: grabmykey/properties/sample
 */
export const extractPublicId = (url) => {
  if (!url || typeof url !== 'string' || !url.includes('res.cloudinary.com')) return null;
  try {
    const matches = url.match(/\/upload\/(?:v\d+\/)?([^.]+)/);
    return matches ? matches[1] : null;
  } catch {
    return null;
  }
};

/**
 * Delete image from Cloudinary by public ID or URL
 */
export const deleteImageFromCloudinary = async (urlOrPublicId) => {
  if (!isConfigured || !urlOrPublicId) return;
  try {
    const publicId = urlOrPublicId.includes('http') ? extractPublicId(urlOrPublicId) : urlOrPublicId;
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
      console.log(`[Cloudinary] Removed deleted property image: ${publicId}`);
    }
  } catch (err) {
    console.warn('[Cloudinary Delete Warning]:', err.message);
  }
};

/**
 * Delete multiple images from Cloudinary
 */
export const deleteImagesFromCloudinary = async (urlsArray) => {
  if (!isConfigured || !Array.isArray(urlsArray)) return;
  await Promise.all(urlsArray.map(url => deleteImageFromCloudinary(url)));
};

export default cloudinary;

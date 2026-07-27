const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Configure Cloudinary if credentials exist in .env
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

/**
 * Upload local file to Cloudinary with local fallback
 * @param {string} localFilePath - Path to file stored by Multer
 * @param {string} folder - Target folder in Cloudinary
 * @returns {Promise<string>} - Public image URL
 */
const uploadImage = async (localFilePath, folder = 'vibely') => {
  try {
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
      const result = await cloudinary.uploader.upload(localFilePath, {
        folder: folder,
        resource_type: 'image'
      });
      // Remove temporary local file after successful Cloudinary upload
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }
      return result.secure_url;
    } else {
      // Fallback: return relative local URL served via static /uploads directory
      const filename = localFilePath.split(/[\/\\]/).pop();
      return `/uploads/${filename}`;
    }
  } catch (error) {
    console.warn('[Cloudinary Upload Warning] Cloudinary upload failed, using local file path:', error.message);
    const filename = localFilePath.split(/[\/\\]/).pop();
    return `/uploads/${filename}`;
  }
};

module.exports = {
  cloudinary,
  uploadImage
};

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure local uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set Storage Engine for local disk
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `vibely-${uniqueSuffix}${path.extname(file.originalname).toLowerCase()}`);
  }
});

// Image file type validator (JPG, JPEG, PNG, WEBP)
function checkImageType(file, cb) {
  const allowedExtensions = /jpeg|jpg|png|webp/;
  const allowedMimeTypes = /^image\/(jpeg|jpg|png|webp)$/;

  const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedMimeTypes.test(file.mimetype.toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid image format! Only JPG, JPEG, PNG, and WEBP files are allowed.'));
  }
}

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max image size limit
  fileFilter: function (req, file, cb) {
    checkImageType(file, cb);
  }
});

module.exports = upload;

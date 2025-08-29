const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the food uploads directory exists
const foodUploadsDir = path.join(__dirname, '../uploads/food');
if (!fs.existsSync(foodUploadsDir)) {
  fs.mkdirSync(foodUploadsDir, { recursive: true });
}

// Set up multer for food image uploads
const foodStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, foodUploadsDir); // Specify the directory to store the food images
  },
  filename: (req, file, cb) => {
    // Ensure the file is named with a timestamp and retains the original extension
    cb(null, 'food-' + Date.now() + path.extname(file.originalname));
  },
});

// Validate file type (accept only images)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png, gif) are allowed'));
  }
};

// Initialize the upload for food images
const uploadFoodImage = multer({
  storage: foodStorage,
  fileFilter: fileFilter, // Filter to allow only specific image formats
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

module.exports = uploadFoodImage;

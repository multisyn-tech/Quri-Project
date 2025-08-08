const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Get __dirname equivalent in CommonJS


// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let targetFolder = path.join(__dirname, '../uploads');

    if (file.fieldname === 'bg') {
      targetFolder = path.join(__dirname, '../uploads/bg');
    }

    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }

    cb(null, targetFolder);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append extension
  },
});

const upload = multer({ storage });

module.exports = upload;

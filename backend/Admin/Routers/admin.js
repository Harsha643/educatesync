const express = require('express');
const router = express.Router();
const { createAdmin } = require('../Controllers/adminController');
const { protect, authorize } = require('../../Middleware/auth');
const fs = require('fs');
const path = require('path');
const multer = require("multer");

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  },
});
const upload = multer({ storage });

// Route
router.post(
  '/register',
  (req, res, next) => { console.log("this is working1"); next(); },
  upload.single("image"),
  (req, res, next) => { console.log("this is working2"); next(); },
  createAdmin
);

module.exports = router;

// helpers/cloudinary.js
const cloudinary = require("cloudinary").v2;
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Multer memory storage setup
const storage = multer.memoryStorage();

// Create upload instance with memory storage
const upload = multer({ storage });

async function imageUploadUtil(fileBuffer) {
  const result = await cloudinary.uploader.upload(fileBuffer, {
    resource_type: "auto", // Auto-detect file type
    use_filename: true,    // Optional: Use the original file name
    unique_filename: true, // Ensure uniqueness
  });
  return result;
}

module.exports = { upload, imageUploadUtil };

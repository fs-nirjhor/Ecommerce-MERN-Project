const cloudinary = require('cloudinary').v2;
const { cloudinaryName, cloudinaryKey, cloudinarySecret } = require('../secret');

cloudinary.config({ 
  cloud_name: cloudinaryName, 
  api_key: cloudinaryKey, 
  api_secret: cloudinarySecret 
});

module.exports = cloudinary;
const createHttpError = require("http-errors");
const cloudinary  = require("../config/cloudinaryConfig");

const useCloudinary = async (path, subfolder="others") => {
  try {
    const cloudImage = await cloudinary.uploader.upload(path, {
      folder: `ecommerceMern/${subfolder}`,
      use_filename: true,
      unique_filename: false,
    });
    return cloudImage.secure_url;
  } catch (error) {
    throw createHttpError(400, `Cloudinary error: ${error.message}`);
  }
};

module.exports = useCloudinary;

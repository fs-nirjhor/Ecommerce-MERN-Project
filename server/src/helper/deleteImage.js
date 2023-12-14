const fs = require("fs").promises;
const logger = require("./winstonLogger");

const deleteImage = async (imagePath, defaultImagePath = "") => {
  try {
    if (imagePath !== defaultImagePath) {
      await fs.access(imagePath);
      await fs.unlink(imagePath);
      logger.info("Image deleted successfully");
    } else {
      logger.info("Default Image will not be deleted");
    }
  } catch (error) {
    logger.error("Image does not exist");
    throw error;
  }
};

module.exports = deleteImage;

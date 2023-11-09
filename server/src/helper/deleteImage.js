const fs = require("fs").promises;
const logger = require("./winstonLogger");

const deleteImage = async (imagePath) => {
    try {
        await fs.access(imagePath);
        await fs.unlink(imagePath);
        logger.info('Image deleted successfully')
    } catch (error) {
        logger.error('Image does not exist');
        throw error;
    }
}

module.exports = deleteImage;
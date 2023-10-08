const fs = require("fs").promises;

const deleteImage = async (imagePath) => {
    try {
        await fs.access(imagePath);
        await fs.unlink(imagePath);
        console.log('Image deleted successfully')
    } catch (error) {
        console.error('Image does not exist');
        throw error;
    }
}

module.exports = deleteImage;
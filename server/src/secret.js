// all environment variables

require('dotenv').config()

const serverPort = process.env.SERVER_PORT || 3002;
const databaseUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017/ecommerceMernDB';
const defaultUserImagePath = process.env.DEFAULT_USER_IMAGE_PATH || 'public/images/users/avatar.png';

module.exports = { serverPort, databaseUrl, defaultUserImagePath };

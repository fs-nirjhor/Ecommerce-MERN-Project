// Server for E-Commerce MERN Project

const app = require("./app");
const connectDB = require("./config/db");
const logger = require("./helper/winstonLogger");
const { serverPort } = require("./secret"); 

// listening server on port
app.listen(serverPort, async () => {
  logger.info(`E-commerce server listening on http://localhost:${serverPort}`);
  await connectDB();
});

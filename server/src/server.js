// Server for E-Commerce MERN Project

const app = require("./app");
const connectDB = require("./config/db");
const { serverPort } = require("./secret"); 

// listening server on port
app.listen(serverPort, async () => {
  console.log(`E-commerce server listening on http://localhost:${serverPort}`);
  await connectDB();
});

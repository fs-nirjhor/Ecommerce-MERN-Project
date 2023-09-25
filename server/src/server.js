// Server for E-Commerce MERN Project

const app = require("./app");
const { serverPort } = require("./secret"); 

// listening server on port
app.listen(serverPort, () => {
  console.log(`E-commerce server listening on http://localhost:${serverPort}`);
});

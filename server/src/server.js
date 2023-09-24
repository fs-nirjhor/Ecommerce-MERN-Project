// A MERN stack e-commerce projects server.

const app = require("./app");
const port = 3001;

// listening server on port
app.listen(port, () => {
  console.log(`E-commerce server listening on http://localhost:${port}`);
});

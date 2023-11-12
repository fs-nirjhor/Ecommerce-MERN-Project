// import
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const createHttpError = require("http-errors");
const { xss } = require("express-xss-sanitizer");
const { rateLimit } = require("express-rate-limit");
const userRouter = require("./routers/userRouter");
const seedRouter = require("./routers/seedRouter");
const { errorResponse } = require("./controllers/responseController");
const authRouter = require("./routers/authRouter");

// initialize
const app = express();
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 10 minutes)
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: "Too many requests. \n Please try again later.",
});

// middleware

// app.use is application level middleware. its work for all API.

// Third-party middleware
app.use(morgan("dev")); // information on console when api calling.

// built-in middleware
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(xss()); // sanitizes Cross Site Scripting (XSS) attack.  alternative for 'xss-clean' which is deprecated.
app.use(limiter); 
app.use(cookieParser()); //handle cookie

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the MERN Stack Server");
});

app.get("/test", (req, res) => {
  const text = req.query.text;
  res.status(200).send(`Server is working fine. ${text}`);
});

// using router
app.use("/api/seed", seedRouter);
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);

// errors must handle just before app.listen
// client error handler
app.use((req, res, next) => {
  next(createHttpError(404, "Route not found"));
});

// server error handler - handle all error on server
app.use((err, req, res, next) => {
  const { status, message } = err;
  return errorResponse(res, { statusCode: status, message });
});

// exporting app
module.exports = app;

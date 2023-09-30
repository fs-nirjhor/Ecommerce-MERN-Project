// importing
const express = require("express");
const morgan = require("morgan");
const createHttpError = require("http-errors");
const { xss } = require('express-xss-sanitizer');
const { rateLimit } = require('express-rate-limit');
const userRouter = require("./routers/userRouter");
const seedRouter = require("./routers/seedRouter");
const { errorResponse } = require("./controllers/responseController");


// initialization
const app = express();
const limiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 10 minutes)
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
	message: 'Too many requests. \n Please try again later.', 
})


// middleware

// custom middleware
const isLoggedIn = (req, res, next) => {
  const login = true;
  if (login) {
    req.body.id = 101;
    next();
  } else {
    console.log("Please login first.");
    return res
      .status(401)
      .json({ message: "user not logged in", status: "Unauthorized (401)" });
  }
};

// app.use is application level middleware. its work for all API.

// app.use(isLoggedIn)  // isLoggedIn is a custom middleware to check if user logged in or not.

// Third-party middleware
app.use(morgan("dev")); // morgan used for getting some information on console when api calling.

// built-in middleware
app.use(express.json()); // express.json parses incoming requests with JSON payloads
app.use(express.urlencoded({ extended: true })); // express.urlencoded parses incoming requests with URL-encoded payloads (form data)
app.use(xss()); // Express 4.x middleware which sanitizes user input data (in req.body, req.query, req.headers and req.params) to prevent Cross Site Scripting (XSS) attack. its a alternative for 'xss-clean' which is deprecated.
app.use(limiter) //Use to limit repeated requests to public APIs and/or endpoints such as password reset.


// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the MERN Stack Server");
});

app.get("/test", (req, res) => {
  res.status(200).send({
    message: "Server is working fine",
  });
});

// protected route with isLoggedIn middleware
app.get("/api/profile", isLoggedIn, (req, res) => {
    const id = req.body.id;
  res.status(200).send({id, message: "Welcome to your profile"});
});

// using router 
app.use("/api/users", userRouter);
app.use("/api/seed", seedRouter);

// errors must handle just before app.listen
// client error handler
app.use((req, res, next) => {
  next(createHttpError(404, "Route not found"));
});

// server error handler - handle all error on server
app.use((err, req, res, next) => {
    const {status, message} = err;
    return errorResponse(res, {statusCode: status, message});
});

// exporting app
module.exports = app;
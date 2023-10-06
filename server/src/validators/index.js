const { validationResult } = require("express-validator");
const { errorResponse } = require("../controllers/responseController");

const runValidations = (req, res, next) => {
  try {
    const result = validationResult(req);
    if (result.isEmpty()) {
      return next();
    }
    return errorResponse(res, {
      statusCode: 422,
      message: result.array()[0].msg,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = runValidations;

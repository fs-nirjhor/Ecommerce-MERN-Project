const { successResponse } = require("./responseController");

const handleCreateCategory = async (req, res, next) => {
  try {
    const { name } = req.body;

    return successResponse(res, {
      statusCode: 201,
      message: "Category created successfully",
      payload: {name},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { handleCreateCategory };

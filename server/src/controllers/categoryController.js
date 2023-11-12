const slugify = require("slugify");
const { successResponse } = require("./responseController");

const handleCreateCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const slug = slugify(name, {
      replacement: "-",
      remove: /[*+~.()'"!:@]/g,
      lower: true,
      strict: true,
      locale: "vi",
      trim: true,
    });
    return successResponse(res, {
      statusCode: 201,
      message: "Category created successfully",
      payload: {name, slug},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { handleCreateCategory };

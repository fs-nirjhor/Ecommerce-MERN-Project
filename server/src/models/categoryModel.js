const { Schema, model } = require("mongoose");
const createSlug = require("../helper/createSlug");

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      default: function () {
        return createSlug(this.name);
      },
      required: [true, "Category slug is required"],
      trim: true,
      unique: true,
      lowercase: true,
    },
  },
  { timestamps: true }
);

const Category = model("Category", categorySchema);

module.exports = Category;

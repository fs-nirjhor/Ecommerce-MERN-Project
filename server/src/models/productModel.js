// mongoose schema and model for users

const { Schema, model } = require("mongoose");
const { defaultProductImagePath } = require("../config/config");

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Products name is required"],
      trim: true,
      unique: true,
      maxLength: [100, "Products name should less than 100 characters"],
    },
    slug: {
      type: String,
      required: [true, "Products slug is required"],
      trim: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Products description is required"],
      trim: true,
      minLength: [10, "Products description should more than 10 characters"],
      maxLength: [500, "Products description should less than 500 characters"],
    },
    image: {
      type: String,
      default: defaultProductImagePath,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Products price is required"],
      trim: true,
      validate: {
        validator: (v) => v > 0,
        massage: (props) => `${props.value} is not a valid price`,
      },
    },
    quantity: {
      type: Number,
      required: [true, "Products quantity is required"],
      default: 1,
      trim: true,
      validate: {
        validator: (v) => v > 0 && Number.isInteger(v),
        massage: (props) => `${props.value} is not a valid quantity`,
      },
    },
    sold: {
      type: Number,
      trim: true,
      default: 0,
      min: [0, "Products sold amount is must be greater than zero"],
      validate: {
        validator: Number.isInteger,
        massage: `{VALUE} is not a valid sold amount`,
      },
    },
    shipping: {
      type: Number,
      trim: true,
      default: 0,
      min: [0, "Products shipping cost is can't be less than zero"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Categories",
      required: [true, "Products category is required"],
    },
  },
  { timestamps: true }
);

const Product = model("Products", productSchema);

module.exports = Product;

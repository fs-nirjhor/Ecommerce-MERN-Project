// mongoose schema and model for users

const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const { defaultUserImagePath } = require("../config/config");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
      minLength: [3, "User name should have at least 3 characters"],
      maxLength: [31, "User name should have at most 31 characters"],
    },
    email: {
      type: String,
      required: [true, "User email is required"],
      trim: true,
      unique: true,
      lowercase: true,
      /* validation: {
      validator: function (v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: "Invalid email address",
    }, */
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
      match: [
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/,
        "Password must have at least 8 characters and at least 1 uppercase, 1 lowercase, 1 number and 1 special character",
      ],
      set: (v) => bcrypt.hashSync(v, 10),
    },
    // TODO: image can be stored as string (save image to server and save path to database) or buffer (save image as buffer to database). Any one model should be choose here.
    image: {
      type: Buffer,
      contentType: String,
    },
    /* image: {
      type: String,
      default: defaultUserImagePath,
    }, */
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      trim: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = model("Users", userSchema);

module.exports = User;

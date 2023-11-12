const slugify = require("slugify");

const createSlug = (str) => {
  return slugify(str, {
    replacement: "-",
    remove: /[*+~.()'"!:@]/g,
    lower: true,
    strict: true,
    locale: "vi",
    trim: true,
  });
};

module.exports = createSlug;

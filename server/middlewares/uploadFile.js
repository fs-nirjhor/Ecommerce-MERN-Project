const multer = require("multer");
const path = require("path");
const { userImagePath } = require("../src/secret");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, userImagePath);
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    const filename = file.originalname.replace(extension, '') + '_' + Date.now() + extension;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;

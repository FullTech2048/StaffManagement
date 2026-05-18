const multer = require("multer");
const ApiError = require("../utils/ApiError");

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 6 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      return cb(new ApiError(400, "Photo must be a JPEG, PNG, or WebP image."));
    }

    cb(null, true);
  },
});

module.exports = upload;

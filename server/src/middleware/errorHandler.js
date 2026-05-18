const ApiError = require("../utils/ApiError");

const errorHandler = (error, req, res, next) => {
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      error: {
        message: error.message,
        details: error.details,
      },
    });
  }

  if (error.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      error: {
        message: "Photo must be 6MB or smaller.",
      },
    });
  }

  console.error(error);

  return res.status(500).json({
    error: {
      message: "An unexpected server error occurred.",
    },
  });
};

module.exports = errorHandler;

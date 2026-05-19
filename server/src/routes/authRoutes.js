const express = require("express");
const authController = require("../controllers/authController");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.post("/signup", asyncHandler(authController.signup));

module.exports = router;

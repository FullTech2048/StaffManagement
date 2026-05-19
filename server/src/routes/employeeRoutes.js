const express = require("express");
const employeeController = require("../controllers/employeeController");
const authenticateUser = require("../middleware/authenticateUser");
const upload = require("../middleware/upload");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.use(asyncHandler(authenticateUser));

router.get("/", asyncHandler(employeeController.listEmployees));
router.get("/:id/photo-url", asyncHandler(employeeController.getEmployeePhotoUrl));
router.get("/:id", asyncHandler(employeeController.getEmployee));
router.post("/", upload.single("photo"), asyncHandler(employeeController.createEmployee));
router.put("/:id", upload.single("photo"), asyncHandler(employeeController.updateEmployee));
router.delete("/:id", asyncHandler(employeeController.deleteEmployee));

module.exports = router;

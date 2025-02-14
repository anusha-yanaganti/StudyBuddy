const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const progressController = require("../controllers/progressController");

const router = express.Router();

/**
 * @route   GET /api/progress
 * @desc    Get progress data for logged-in user
 * @access  Private
 */
router.get("/", authMiddleware, progressController.getProgress);

module.exports = router;

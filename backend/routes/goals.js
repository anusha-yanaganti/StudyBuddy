const express = require("express");
const { body } = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware");
const goalController = require("../controllers/goalController");

const router = express.Router();

/**
 * @route   POST /api/goals
 * @desc    Add a new goal
 * @access  Private
 */
router.post(
    "/",
    [
        authMiddleware,
        body("title").notEmpty().withMessage("Goal title is required"),
        body("type").isIn(["daily", "weekly","monthly"]).withMessage("Type must be 'daily' or 'weekly'"),
    ],
    goalController.addGoal
);

/**
 * @route   GET /api/goals
 * @desc    Get all goals of the logged-in user
 * @access  Private
 */
router.get("/", authMiddleware, goalController.getGoals);

/**
 * @route   PUT /api/goals/:id
 * @desc    Update goal status (mark as completed/pending)
 * @access  Private
 */
router.put(
    "/:id",
    [
        authMiddleware,
        body("status").isIn(["pending", "completed"]).withMessage("Status must be 'pending' or 'completed'"),
    ],
    goalController.updateGoal
);

/**
 * @route   DELETE /api/goals/:id
 * @desc    Delete a goal
 * @access  Private
 */
router.delete("/:id", authMiddleware, goalController.deleteGoal);

module.exports = router;

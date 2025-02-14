const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const timerController = require("../controllers/timerController");

const router = express.Router();

/**
 * @route   POST /api/timer/start
 * @desc    Start Pomodoro Timer
 * @access  Private
 */
router.post("/start", authMiddleware, timerController.startTimer);

/**
 * @route   POST /api/timer/pause
 * @desc    Pause Pomodoro Timer
 * @access  Private
 */
router.post("/pause", authMiddleware, timerController.pauseTimer);

/**
 * @route   POST /api/timer/resume
 * @desc    Resume Pomodoro Timer
 * @access  Private
 */
router.post("/resume", authMiddleware, timerController.resumeTimer);

/**
 * @route   DELETE /api/timer/stop
 * @desc    Stop and Reset Pomodoro Timer
 * @access  Private
 */
router.delete("/stop", authMiddleware, timerController.stopTimer);

/**
 * @route   GET /api/timer/status
 * @desc    Get Current Timer Status
 * @access  Private
 */
router.get("/status", authMiddleware, timerController.getTimerStatus);

/**
 * @route   POST /api/timer/break
 * @desc    Select Short or Long Break
 * @access  Private
 */
router.post("/break", authMiddleware, timerController.selectBreak);

/**
 * @route   POST /api/timer/reset
 * @desc    Reset Timer with Custom Work & Break Durations
 * @access  Private
 */
router.post("/reset", authMiddleware, timerController.resetTimer);

module.exports = router;

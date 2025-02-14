const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const Goal = require("../models/Goal");
const Progress = require("../models/Progress");

// ✅ Add a new goal
exports.addGoal = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { title, type } = req.body;
        if (!title || !type) {
            return res.status(400).json({ msg: "Title and type are required" });
        }

        const newGoal = new Goal({
            userId: req.user.id,
            title,
            type,
        });

        await newGoal.save();

        // ✅ Update progress dynamically
        await updateProgress(req.user.id);

        res.status(201).json(newGoal);
    } catch (err) {
        console.error("Add Goal Error:", err.message);
        res.status(500).json({ msg: "Server error" });
    }
};

// ✅ Get all goals of logged-in user
exports.getGoals = async (req, res) => {
    try {
        const goals = await Goal.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(goals);
    } catch (err) {
        console.error("Get Goals Error:", err.message);
        res.status(500).json({ msg: "Server error" });
    }
};

// ✅ Update goal status
exports.updateGoal = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ msg: "Invalid Goal ID" });
        }

        let goal = await Goal.findById(req.params.id);
        if (!goal) {
            return res.status(404).json({ msg: "Goal not found" });
        }

        if (goal.userId.toString() !== req.user.id) {
            return res.status(403).json({ msg: "Not authorized to update this goal" });
        }

        goal.status = req.body.status;
        await goal.save();

        // ✅ Update progress dynamically
        await updateProgress(req.user.id);

        res.json(goal);
    } catch (err) {
        console.error("Update Goal Error:", err.message);
        res.status(500).json({ msg: "Server error" });
    }
};

// ✅ Delete a goal
exports.deleteGoal = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ msg: "Invalid Goal ID" });
        }

        let goal = await Goal.findById(req.params.id);
        if (!goal) {
            return res.status(404).json({ msg: "Goal not found" });
        }

        if (goal.userId.toString() !== req.user.id) {
            return res.status(403).json({ msg: "Not authorized to delete this goal" });
        }

        await goal.deleteOne();

        // ✅ Update progress dynamically
        await updateProgress(req.user.id);

        res.json({ msg: "Goal deleted successfully" });
    } catch (err) {
        console.error("Delete Goal Error:", err.message);
        res.status(500).json({ msg: "Server error" });
    }
};

// ✅ Function to update progress dynamically
const updateProgress = async (userId) => {
    try {
        const dailyGoals = await Goal.find({ userId, type: "daily" });
        const weeklyGoals = await Goal.find({ userId, type: "weekly" });
        const monthlyGoals = await Goal.find({ userId, type: "monthly" });

        const dailyCompleted = dailyGoals.filter(goal => goal.status === "completed").length;
        const weeklyCompleted = weeklyGoals.filter(goal => goal.status === "completed").length;
        const monthlyCompleted = monthlyGoals.filter(goal => goal.status === "completed").length;

        const dailyProgress = dailyGoals.length ? (dailyCompleted / dailyGoals.length) * 100 : 0;
        const weeklyProgress = weeklyGoals.length ? (weeklyCompleted / weeklyGoals.length) * 100 : 0;
        const monthlyProgress = monthlyGoals.length ? (monthlyCompleted / monthlyGoals.length) * 100 : 0;

        await Progress.findOneAndUpdate(
            { userId },
            { dailyProgress, weeklyProgress,  monthlyProgress, lastUpdated: new Date() },
            { upsert: true, new: true }
        );
    } catch (err) {
        console.error("Progress Update Error:", err.message);
    }
};

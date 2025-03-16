const Progress = require("../models/Progress");

// ✅ Get user's progress data
exports.getProgress = async (req, res) => {
    try {
        const progress = await Progress.findOne({ userId: req.user.id });

        if (!progress) {
            return res.status(404).json({ msg: "No progress data found" });
        }
        res.json(progress);
    } catch (err) {
        console.error("Get Progress Error:", err.message);
        res.status(500).json({ msg: "Server error" });
    }
};

const mongoose = require("mongoose");

const ProgressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    dailyProgress: {
        type: Number,
        default: 0 // Percentage of daily goals completed
    },
    weeklyProgress: {
        type: Number,
        default: 0 // Percentage of weekly goals completed
    },
    monthlyProgress: {
        type: Number,
        default: 0 // Percentage of monthly goals completed
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Progress", ProgressSchema);

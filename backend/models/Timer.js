const mongoose = require("mongoose");

const TimerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    isRunning: {
        type: Boolean,
        default: false,
    },
    mode: {
        type: String,
        enum: ["work", "short_break", "long_break"],
        default: "work",
    },
    remainingTime: {
        type: Number,
        required: true,
        default: 1500, // Default to 25 minutes (in seconds)
    },
    startTime: {
        type: Number, // Store as timestamp (milliseconds)
        default: null,
    },
    customDurations: {
        workDuration: { type: Number, default: 1500 }, // 25 min
        shortBreak: { type: Number, default: 300 }, // 5 min
        longBreak: { type: Number, default: 900 }, // 15 min
    },
});

module.exports = mongoose.model("Timer", TimerSchema);

const Timer = require("../models/Timer");

// ✅ Start Timer
exports.startTimer = async (req, res) => {
    try {
        let timer = await Timer.findOne({ userId: req.user.id });

        if (!timer) {
            timer = new Timer({ 
                userId: req.user.id,
                remainingTime: 1500, // Default 25 min (in seconds)
                startTime: Date.now() // Store the exact start time
            });
        } else {
            timer.isRunning = true;
            timer.startTime = Date.now(); // Update start time
        }

        await timer.save();
        res.json({ msg: "Timer started", timer });
    } catch (err) {
        console.error("Start Timer Error:", err.message);
        res.status(500).json({ msg: "Server error" });
    }
};


// ✅ Pause Timer
exports.pauseTimer = async (req, res) => {
    try {
        const timer = await Timer.findOne({ userId: req.user.id });

        if (!timer) return res.status(404).json({ msg: "Timer not found" });

        if (timer.isRunning) {
            const elapsedTime = Math.floor((Date.now() - timer.startTime) / 1000); // Time in seconds
            timer.remainingTime = Math.max(0, timer.remainingTime - elapsedTime);
            timer.isRunning = false;
        }

        await timer.save();
        res.json({ msg: "Timer paused", timer });
    } catch (err) {
        console.error("Pause Timer Error:", err.message);
        res.status(500).json({ msg: "Server error" });
    }
};


// ✅ Resume Timer
exports.resumeTimer = async (req, res) => {
    try {
        const timer = await Timer.findOne({ userId: req.user.id });

        if (!timer) return res.status(404).json({ msg: "Timer not found" });

        timer.isRunning = true;
        timer.startTime = Date.now(); // Reset start time to now

        await timer.save();
        res.json({ msg: "Timer resumed", timer });
    } catch (err) {
        console.error("Resume Timer Error:", err.message);
        res.status(500).json({ msg: "Server error" });
    }
};


// ✅ Stop & Reset Timer
exports.stopTimer = async (req, res) => {
    try {
        const timer = await Timer.findOne({ userId: req.user.id });

        if (!timer) return res.status(404).json({ msg: "Timer not found" });

        await Timer.deleteOne({ userId: req.user.id });
        res.json({ msg: "Timer stopped and reset" });
    } catch (err) {
        console.error("Stop Timer Error:", err.message);
        res.status(500).json({ msg: "Server error" });
    }
};

// ✅ Get Timer Status
exports.getTimerStatus = async (req, res) => {
    try {
        const timer = await Timer.findOne({ userId: req.user.id });

        if (!timer) return res.status(404).json({ msg: "Timer not found" });

        // Ensure remainingTime and startTime are valid
        if (timer.isRunning) {
            const currentTime = Date.now();
            const elapsedTime = timer.startTime ? Math.floor((currentTime - timer.startTime) / 1000) : 0;
            
            // Ensure remainingTime is always a valid number
            timer.remainingTime = Math.max(0, (timer.remainingTime || 0) - elapsedTime);
            timer.startTime = currentTime; // Reset start time to track next cycle

            await timer.save();
        }

        res.json({ msg: "Timer status", timer });
    } catch (err) {
        console.error("Get Timer Status Error:", err.message);
        res.status(500).json({ msg: "Server error" });
    }
};



// ✅ Select Break Type
exports.selectBreak = async (req, res) => {
    try {
        const { breakType } = req.body;

        if (!["short_break", "long_break"].includes(breakType)) {
            return res.status(400).json({ msg: "Invalid break type" });
        }

        let timer = await Timer.findOne({ userId: req.user.id });

        if (!timer) return res.status(404).json({ msg: "Timer not found" });

        timer.mode = breakType;
        timer.remainingTime = breakType === "short_break" ? timer.shortBreakDuration : timer.longBreakDuration;
        timer.isRunning = true;
        timer.lastUpdated = Date.now();
        await timer.save();

        res.json({ msg: `Break started: ${breakType}`, timer });
    } catch (err) {
        console.error("Select Break Error:", err.message);
        res.status(500).json({ msg: "Server error" });
    }
};

// ✅ Reset & Set Custom Timer Duration
exports.resetTimer = async (req, res) => {
    try {
        const { workDuration, shortBreak, longBreak } = req.body;

        if (!workDuration || !shortBreak || !longBreak) {
            return res.status(400).json({ msg: "All timer durations are required" });
        }
        if (workDuration < 5 || shortBreak < 1 || longBreak < 5) {
            return res.status(400).json({ msg: "Invalid duration values" });
        }

        let timer = await Timer.findOne({ userId: req.user.id });

        if (!timer) {
            timer = new Timer({ userId: req.user.id });
        }

        timer.workDuration = workDuration * 60;
        timer.shortBreakDuration = shortBreak * 60;
        timer.longBreakDuration = longBreak * 60;
        timer.remainingTime = timer.workDuration;
        timer.mode = "work";
        timer.isRunning = false;
        await timer.save();

        res.json({ 
            msg: "Timer reset successfully", 
            timer
        });
    } catch (err) {
        console.error("Reset Timer Error:", err.message);
        res.status(500).json({ msg: "Server error" });
    }
};

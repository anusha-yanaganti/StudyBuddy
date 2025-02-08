const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");

// Fetch user profile
router.get("/profile", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});


// Update user profile
router.put("/update", authMiddleware, async (req, res) => {
    const { name, avatar } = req.body;

    try {
        let user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: "User not found" });

        // Update fields
        if (name) user.name = name;
        if (avatar) user.avatar = avatar; // Assuming avatar is a URL

        await user.save();
        res.json({ msg: "Profile updated successfully", user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});



// ✅ Update Progress
router.put("/progress", authMiddleware, async (req, res) => {
    try {
      const userId = req.user.id;
      const { daily, weekly } = req.body;
  
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ msg: "User not found" });
  
      user.progress.daily = daily;
      user.progress.weekly = weekly;
  
      await user.save();
      res.json({ msg: "Progress updated", progress: user.progress });
    } catch (err) {
      res.status(500).json({ msg: "Server error" });
    }
  });
  
  // ✅ Get Progress
  router.get("/progress", authMiddleware, async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ msg: "User not found" });
  
      res.json(user.progress);
    } catch (err) {
      res.status(500).json({ msg: "Server error" });
    }
  });

module.exports = router;

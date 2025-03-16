const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const router = express.Router();

// Register User (Signup)
router.post("/signup", [
    body("name").notEmpty().withMessage("Name is required"),
    body("email")
        .isEmail().withMessage("Enter a valid email")
        .matches(/@gmail\.com$/).withMessage("Only Gmail accounts are allowed"),
    body("password")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
        .matches(/\d/).withMessage("Password must contain at least one digit")
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage("Password must contain at least one special character"),
    body("confirmPassword").custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Passwords do not match");
        }
        return true;
    })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ name, email, password: hashedPassword });

        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
});

// Login User
router.post("/login", [
    body("email")
        .isEmail().withMessage("Enter a valid email")
        .matches(/@gmail\.com$/).withMessage("Only Gmail accounts are allowed"),
    body("password").notEmpty().withMessage("Password is required"),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "User not found. Please sign up first." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Incorrect password. Please try again." });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.json({ 
            token, 
            user: { 
                id: user._id, 
                name: user.name,  // ✅ Now sending name back to frontend
                email: user.email 
            } 
        });
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
});

module.exports = router;

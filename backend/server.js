const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const progressRoutes = require("./routes/progress");
// Import Pomodoro Timer Routes
const pomodoroRoutes = require("./routes/timer");

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/timetable", require("./routes/timetableRoutes"));
app.use("/api/goals", require("./routes/goals"));
app.use("/api/resources", resourceRoutes);
app.use("/api/progress", progressRoutes);
// ✅ Add Pomodoro Timer Route
app.use("/api/timer", pomodoroRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

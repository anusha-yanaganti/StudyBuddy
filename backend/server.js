const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
// const progressRoutes = require("./routes/progress");
const pomodoroRoutes = require("./routes/timer");

dotenv.config();
const app = express();


// CORS Configuration
app.use(
  cors({
    // origin: "http://localhost:5173", // Allow only frontend domain
    credentials: true, 
  })
);

//middleware
app.use((req, res, next) => {
  // res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Credentials", "true"); // ✅ This must be 'true'
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});


app.use(express.json()); // Middleware to parse JSON

// Serve static files
app.use("/uploads", express.static("uploads"));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection failed:", err));

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/timetable", require("./routes/timetableRoutes"));
app.use("/api/goals", require("./routes/goals"));
app.use("/api/resources", resourceRoutes);
app.use("/api/progress", require("./routes/progress"));
app.use("/api/timer", pomodoroRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

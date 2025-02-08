const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: "" }, // Can store avatar URL later

    // ✅ Progress Tracking Fields
    progress: {
      daily: { type: Number, default: 0 }, // % of daily goals completed
      weekly: { type: Number, default: 0 }, // % of weekly goals completed
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);

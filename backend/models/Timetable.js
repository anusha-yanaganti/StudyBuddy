const mongoose = require("mongoose"); 

const TimetableSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Link timetable to user
    subjects: [
      {
        name: { type: String, required: true },
        studyHours: { type: Number, required: true }, // Hours allocated
      }
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Timetable", TimetableSchema);
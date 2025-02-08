const mongoose = require("mongoose");

const ResourceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: "Timetable.subjects", required: true },
    resourceType: { type: String, enum: ["file", "link"], required: true },
    fileURL: { type: String }, // For file uploads
    link: { type: String }, // For links
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resource", ResourceSchema);

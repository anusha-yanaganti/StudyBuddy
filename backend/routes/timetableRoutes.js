const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware"); // ✅ Fixed import
const Timetable = require("../models/Timetable");

// ✅ Add Timetable Entry
router.post("/", protect, async (req, res) => {
    const { subjects } = req.body;
    try {
      const timetable = new Timetable({
        user: req.user.id,
        subjects,
      });
  
      await timetable.save();
      res.status(201).json({ msg: "Timetable added successfully", timetable });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });
  
 // ✅ Get All Timetables for User
router.get("/", protect, async (req, res) => {
    try {
      const timetables = await Timetable.find({ user: req.user.id });  // Use find() to get all timetables
      if (!timetables || timetables.length === 0) {
        return res.status(404).json({ error: "No timetables found" });
      }
      res.status(200).json(timetables);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });
  

  router.put("/:id", async (req, res) => {
    try {
        const { subjects } = req.body;
        const timetableId = req.params.id;

        let timetable = await Timetable.findById(timetableId);
        if (!timetable) {
            return res.status(404).json({ msg: "Timetable not found" });
        }

        // Convert existing subjects array into a Map for easy lookup
        let existingSubjects = new Map(timetable.subjects.map(subj => [subj._id.toString(), subj]));

        // Update existing subjects and add new ones
        let updatedSubjects = subjects.map(subj => {
            if (subj._id && existingSubjects.has(subj._id)) {
                // Update studyHours if subject already exists
                existingSubjects.get(subj._id).studyHours = subj.studyHours;
                return existingSubjects.get(subj._id);
            } else {
                // New subject (no _id)
                return subj;
            }
        });

        // Update timetable document
        timetable.subjects = updatedSubjects;
        timetable.updatedAt = new Date();

        await timetable.save();
        res.json({ msg: "Timetable updated successfully", timetable });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
    }
});


// ✅ Delete Timetable
router.delete("/", protect, async (req, res) => {
  try {
    await Timetable.findOneAndDelete({ user: req.user.id });
    res.status(200).json({ msg: "Timetable deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
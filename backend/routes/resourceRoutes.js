const express = require("express");
const multer = require("multer");
const path = require("path");
const protect = require("../middleware/authMiddleware");
const Resource = require("../models/Resource");
const fs = require("fs");

const router = express.Router();

// Allowed file types
const allowedMimeTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    "image/jpeg",
    "image/png",
    "text/plain",
  ];
  
  // File storage configuration
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/"); // Store files in the 'uploads' folder
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`); // Unique file names
    },
  });
  
  // File filter function
  const fileFilter = (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true); // Accept the file
    } else {
      cb(new Error("Invalid file type. Only PDF, DOCX, JPG, PNG, and TXT allowed."));
    }
  };

// ✅ Dynamic Middleware (Handles both single & multiple)
const upload = multer({ storage, fileFilter }).fields([
    { name: "file", maxCount: 1 }, // Single file
    { name: "files", maxCount: 10 }, // Multiple files
  ]);


// ✅ Single & Multiple File Upload (Handled Automatically)
router.post("/upload", protect, (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
  
      let uploadedFiles = [];
  
      if (req.files["file"]) {
        // If user uploaded a single file
        uploadedFiles.push(req.files["file"][0]);
      } else if (req.files["files"]) {
        // If user uploaded multiple files
        uploadedFiles = req.files["files"];
      }
  
      if (uploadedFiles.length === 0) {
        return res.status(400).json({ error: "No file(s) uploaded" });
      }
  
      try {
        const { subject } = req.body;
        const uploadedResources = await Promise.all(
          uploadedFiles.map(async (file) => {
            const newResource = new Resource({
              user: req.user.id,
              subject,
              resourceType: "file",
              fileURL: `/uploads/${file.filename}`,
            });
  
            return await newResource.save();
          })
        );
  
        res.status(201).json({ msg: "File(s) uploaded successfully", resources: uploadedResources });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
      }
    });
  });

// POST - Add Link (Single or Multiple)
router.post("/add-link", protect, async (req, res) => {
  try {
    const { subject, link } = req.body;

    // If link is an array, process multiple links
    const links = Array.isArray(link) ? link : [link]; // Handle both single and multiple links

    if (links.length === 0) {
      return res.status(400).json({ error: "At least one link is required" });
    }

    const newResources = await Promise.all(
      links.map(async (linkItem) => {
        const newResource = new Resource({
          user: req.user.id,
          subject,
          resourceType: "link",
          link: linkItem,
        });

        return await newResource.save();
      })
    );

    res.status(201).json({
      msg: links.length > 1 ? "Multiple links added successfully" : "Link added successfully",
      resources: newResources,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET - Fetch Resources for a Subject
router.get("/:subjectId", protect, async (req, res) => {
  try {
    const subjectId = req.params.subjectId;
    const resources = await Resource.find({ user: req.user.id, subject: subjectId });
    res.status(200).json(resources);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE - Remove Resource
router.delete("/:resourceId", protect, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.resourceId);

    if (!resource) {
      return res.status(404).json({ error: "Resource not found" });
    }

    if (resource.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Delete the file from the server if it's a file resource
    if (resource.resourceType === "file") {
      fs.unlinkSync(`.${resource.fileURL}`);
    }

    await resource.deleteOne();
    res.status(200).json({ msg: "Resource deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;

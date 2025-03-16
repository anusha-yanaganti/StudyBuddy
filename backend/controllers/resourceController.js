const Resource = require("../models/Resource");

// Upload resource (file or link)
exports.uploadResource = async (req, res) => {
    const { subjectId, resourceType, link } = req.body;
    const { userId } = req.user;  // Extract user ID from authenticated user

    try {
        let resourceData = {};

        if (resourceType === "file" && req.file) {
            resourceData = {
                userId,
                subjectId,
                resourceType,
                fileURL: req.file.path
            };
        } else if (resourceType === "link" && link) {
            resourceData = {
                userId,
                subjectId,
                resourceType,
                link
            };
        } else {
            return res.status(400).json({ msg: "Invalid resource data" });
        }

        const newResource = new Resource(resourceData);
        await newResource.save();

        res.status(201).json({ msg: "Resource uploaded successfully", resource: newResource });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
};

// Get resources by subject
exports.getResources = async (req, res) => {
    const { subjectId } = req.params;
    const { userId } = req.user;

    try {
        const resources = await Resource.find({ userId, subjectId });

        if (!resources || resources.length === 0) {
            return res.status(404).json({ msg: "No resources found for this subject" });
        }

        res.json({ resources });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
};

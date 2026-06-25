// src/routes/jobRoutes.js
// All job-related endpoints

const express = require("express");
const Job = require("../models/Job");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

const router = express.Router();

// GET /jobs — get all jobs (public, no login needed)
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().populate("postedBy", "name email");
    res.json({ success: true, count: jobs.length, data: jobs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /jobs — post a new job (login required)
router.post("/", authMiddleware, async (req, res) => {
  const { title, company, location, description } = req.body;

  try {
    const job = await Job.create({
      title,
      company,
      location,
      description,
      postedBy: req.user.id,
    });

    // Notify everyone via Socket.io
    const io = req.app.get("io");
    io.emit("newJob", {
      message: `New job posted: ${title} at ${company}`,
      job,
    });

    res.status(201).json({ success: true, data: job });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /jobs/:id/apply — apply for a job (login required)
router.post("/:id/apply", authMiddleware, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found." });

    // Check if already applied
    if (job.applicants.includes(req.user.id)) {
      return res.status(400).json({ error: "Already applied." });
    }

    job.applicants.push(req.user.id);
    await job.save();

    // Notify job poster via Socket.io
    const io = req.app.get("io");
    io.emit("newApplication", {
      message: `${req.user.name} applied for ${job.title}`,
      jobId: job._id,
    });

    res.json({ success: true, message: "Applied successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /jobs/:id — delete a job (admin only)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found." });

    res.json({ success: true, message: "Job deleted." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
const express = require("express");
const router  = express.Router();
const Contact = require("../models/Contact");

// ── SEND MESSAGE ───────────────────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const { name, phone, message } = req.body;
    if (!name || !phone)
      return res.status(400).json({ message: "Name and phone are required" });

    const contact = await Contact.create({ name, phone, message });
    res.json({ message: "Message sent successfully", contact });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ── GET ALL MESSAGES (Admin) ───────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ── DELETE MESSAGE ─────────────────────────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: "Message deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
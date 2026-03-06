const router = require("express").Router();
const { Contact } = require("../models");

// POST /api/contact
router.post("/", async (req, res) => {
  try {
    const { name, phone, message } = req.body;

    if (!name || !phone || !message)
      return res.status(400).json({ message: "All fields are required" });

    const contact = await Contact.create({ name, phone, message });

    res.status(201).json({
      message: "Message sent! We will get back to you soon.",
      contact,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
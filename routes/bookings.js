const express  = require("express");
const router   = express.Router();
const Booking  = require("../models/Booking");

// ── CREATE BOOKING ─────────────────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const { name, phone, service, address, date, time, pincode, paymentMethod, paymentId, amount } = req.body;
    if (!name || !phone || !service)
      return res.status(400).json({ message: "Name, phone and service are required" });

    const booking = await Booking.create({ name, phone, service, address, date, time, pincode, paymentMethod, paymentId, amount });
    res.json({ message: "Booking confirmed successfully", booking });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ── GET ALL BOOKINGS (Admin) ───────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ── GET SINGLE BOOKING ─────────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ── UPDATE BOOKING STATUS ──────────────────────────────────────
router.put("/:id", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json({ message: "Status updated successfully", booking });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ── DELETE BOOKING ─────────────────────────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
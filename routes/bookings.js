const router = require("express").Router();
const { Booking } = require("../models");
const { protect } = require("../middleware/auth");

// ─── BOOK APPOINTMENT ────────────────────────────────────────────────────────
// POST /api/bookings   (public — no login required)
router.post("/", async (req, res) => {
  try {
    const { name, phone, service, address, date, time, pincode, location, paymentMethod } = req.body;

    if (!name || !phone || !service || !date || !time || !paymentMethod)
      return res.status(400).json({ message: "Please fill all required fields" });

    const booking = await Booking.create({
      name, phone, service, address, date, time,
      pincode, location, paymentMethod,
      userId: req.user?._id || null,
    });

    res.status(201).json({
      message: "Appointment booked successfully! We will contact you shortly.",
      booking,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ─── GET MY BOOKINGS (logged-in user) ────────────────────────────────────────
// GET /api/bookings/my
router.get("/my", protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ─── CANCEL BOOKING ──────────────────────────────────────────────────────────
// PATCH /api/bookings/:id/cancel
router.patch("/:id/cancel", protect, async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, userId: req.user._id });
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.status === "completed")
      return res.status(400).json({ message: "Cannot cancel a completed booking" });

    booking.status = "cancelled";
    await booking.save();
    res.json({ message: "Booking cancelled", booking });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
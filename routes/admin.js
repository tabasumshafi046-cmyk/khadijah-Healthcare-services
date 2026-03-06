const router = require("express").Router();
const { Booking, Contact, User } = require("../models");
const { protect, adminOnly } = require("../middleware/auth");

// All admin routes require login + admin role
router.use(protect, adminOnly);

// ─── DASHBOARD STATS ─────────────────────────────────────────────────────────
// GET /api/admin/stats
router.get("/stats", async (req, res) => {
  try {
    const [totalBookings, pendingBookings, totalUsers, totalMessages] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ status: "pending" }),
      User.countDocuments({ role: "user" }),
      Contact.countDocuments(),
    ]);
    res.json({ totalBookings, pendingBookings, totalUsers, totalMessages });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ─── ALL BOOKINGS ─────────────────────────────────────────────────────────────
// GET /api/admin/bookings
router.get("/bookings", async (req, res) => {
  try {
    const { status, service, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (service) filter.service = service;

    const bookings = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Booking.countDocuments(filter);
    res.json({ bookings, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ─── UPDATE BOOKING STATUS ────────────────────────────────────────────────────
// PATCH /api/admin/bookings/:id
router.patch("/bookings/:id", async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { ...(status && { status }), ...(paymentStatus && { paymentStatus }) },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json({ message: "Booking updated", booking });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ─── DELETE BOOKING ───────────────────────────────────────────────────────────
// DELETE /api/admin/bookings/:id
router.delete("/bookings/:id", async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ─── ALL CONTACT MESSAGES ─────────────────────────────────────────────────────
// GET /api/admin/contacts
router.get("/contacts", async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ─── ALL USERS ────────────────────────────────────────────────────────────────
// GET /api/admin/users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
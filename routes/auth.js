const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { SECRET } = require("../middleware/auth");

const generateToken = (id) => jwt.sign({ id }, SECRET, { expiresIn: "7d" });

// ─── REGISTER ────────────────────────────────────────────────────────────────
// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "Name, email and password are required" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(409).json({ message: "Email already registered" });

    const user = await User.create({ name, email, phone, password });

    res.status(201).json({
      message: "Registration successful",
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ─── USER LOGIN ──────────────────────────────────────────────────────────────
// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: "Invalid credentials" });

    res.json({
      message: "Login successful",
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
// ── ADMIN REGISTER
router.post("/admin/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Admin already exists with this email" });
    }
    const hashed = await bcrypt.hash(password, 10);
    const admin = new User({ name, email, password: hashed, role: "admin" });
    await admin.save();
    res.json({ message: "Admin created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ─── ADMIN LOGIN ─────────────────────────────────────────────────────────────
// POST /api/auth/admin/login
router.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await User.findOne({ email, role: "admin" });
    if (!admin || !(await admin.comparePassword(password)))
      return res.status(401).json({ message: "Invalid admin credentials" });

    res.json({
      message: "Admin login successful",
      token: generateToken(admin._id),
      user: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
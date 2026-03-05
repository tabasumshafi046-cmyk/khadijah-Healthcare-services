const express  = require("express");
const mongoose = require("mongoose");
const cors     = require("cors");
require("dotenv").config();

const app = express();

// ── MIDDLEWARE ─────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── DATABASE ───────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.log("❌ MongoDB connection error:", err.message));

// ── ROUTES ─────────────────────────────────────────────────────
app.use("/api/auth",     require("./routes/auth"));
app.use("/api/bookings", require("./routes/bookings"));
app.use("/api/contact",  require("./routes/contact"));
app.use("/api/payments", require("./routes/payments"));

// ── HOME ───────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "Khadijah Health Care API is running ✅" });
});

// ── START ──────────────────────────────────────────────────────
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
const express = require("express");
const router = express.Router();

// ── CREATE RAZORPAY ORDER ──────────────────────────────────────
router.post("/create-order", async (req, res) => {
  try {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(400).json({ message: "Razorpay keys not configured" });
    }

    const Razorpay = require("razorpay");
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    const { amount } = req.body;
    const order = await razorpay.orders.create({
      amount: (amount || 500) * 100,
      currency: "INR",
      receipt: "rcpt_" + Date.now()
    });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Payment error", error: err.message });
  }
});

// ── VERIFY PAYMENT ─────────────────────────────────────────────
router.post("/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const crypto = require("crypto");
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated = hmac.digest("hex");

    if (generated === razorpay_signature) {
      res.json({ message: "Payment verified successfully", verified: true });
    } else {
      res.status(400).json({ message: "Payment verification failed", verified: false });
    }
  } catch (err) {
    res.status(500).json({ message: "Verification error", error: err.message });
  }
});

module.exports = router;

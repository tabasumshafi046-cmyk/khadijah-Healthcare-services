const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// ─── USER MODEL ─────────────────────────────────────────────────────────────
const userSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  email:     { type: String, required: true, unique: true, lowercase: true },
  phone:     { type: String },
  password:  { type: String, required: true },
  role:      { type: String, enum: ["user", "admin"], default: "user" },
  createdAt: { type: Date, default: Date.now },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

const User = mongoose.model("User", userSchema);

// ─── BOOKING MODEL ───────────────────────────────────────────────────────────
const bookingSchema = new mongoose.Schema({
  name:          { type: String, required: true },
  phone:         { type: String, required: true },
  service:       { type: String, required: true },
  address:       { type: String },
  date:          { type: String, required: true },
  time:          { type: String, required: true },
  pincode:       { type: String },
  location:      { type: String },      // GPS coords
  paymentMethod: { type: String, enum: ["online", "cash"], required: true },
  paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" },
  status:        { type: String, enum: ["pending", "confirmed", "cancelled", "completed"], default: "pending" },
  userId:        { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt:     { type: Date, default: Date.now },
});

const Booking = mongoose.model("Booking", bookingSchema);

// ─── CONTACT MODEL ───────────────────────────────────────────────────────────
const contactSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  phone:     { type: String, required: true },
  message:   { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Contact = mongoose.model("Contact", contactSchema);

module.exports = { User, Booking, Contact };
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  name:          { type: String, required: true },
  phone:         { type: String, required: true },
  service:       { type: String, required: true },
  address:       { type: String, default: "" },
  date:          { type: String, default: "" },
  time:          { type: String, default: "" },
  pincode:       { type: String, default: "" },
  paymentMethod: { type: String, default: "cash" },
  paymentId:     { type: String, default: "" },
  amount:        { type: Number, default: 0 },
  status:        { type: String, enum: ["pending", "confirmed", "completed", "cancelled"], default: "pending" }
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
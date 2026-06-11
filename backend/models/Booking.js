// Booking model — replaces MySQL `rentedcars` table
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  customerUsername: { type: String, required: true },
  car:    { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" },
  bookingDate:   { type: Date, default: Date.now },
  rentStartDate: { type: Date, required: true },
  rentEndDate:   { type: Date, required: true },
  carReturnDate: { type: Date, default: null },
  fare:          { type: Number, required: true }, // base rate used
  chargeType:    { type: String, enum: ["days", "km"], default: "days" },
  distance:      { type: Number, default: null },
  noOfDays:      { type: Number, default: null },
  totalAmount:   { type: Number, default: null },
  returnStatus:  { type: String, enum: ["pending", "returned", "cancelled"], default: "pending" },

  paymentMethod: {
  type: String,
  default: "cash"
},

paymentStatus: {
  type: String,
  default: "pending"
},

transactionId: {
  type: String,
  default: null
},

currency: {
  type: String,
  default: "USD"
},

payerEmail: {
  type: String,
  default: null
},

payerName: {
  type: String,
  default: null
},

payerPhone: {
  type: String,
  default: null
},
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);

// Feedback model — replaces MySQL `feedback` table
const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  email:   { type: String, required: true },
  message: { type: String, required: true, maxlength: 500 },
  driver: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Driver"
},

rating: {
  type: Number,
  min: 1,
  max: 5
}
}, { timestamps: true });

module.exports = mongoose.model("Feedback", feedbackSchema);

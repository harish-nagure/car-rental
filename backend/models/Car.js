// Car model — replaces MySQL `cars` table
const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
  name:           { type: String, required: true },
  nameplate:      { type: String, required: true },
  image:          { type: String, default: "NA" },     // filename in /uploads
  acPrice:        { type: Number, required: true },    // per km AC
  nonAcPrice:     { type: Number, required: true },    // per km non-AC
  acPricePerDay:  { type: Number, required: true },
  nonAcPricePerDay:{ type: Number, required: true },
  availability:   { type: String, enum: ["yes", "no"], default: "yes" },
  // Owner client (admin) — matches old `clientcars` mapping
  clientUsername: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Car", carSchema);

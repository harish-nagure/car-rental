// Client (admin) model — replaces MySQL `clients` table
const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name:     { type: String, required: true },
  phone:    { type: String, required: true },
  email:    { type: String, required: true },
  address:  { type: String, required: true },
  password: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Client", clientSchema);

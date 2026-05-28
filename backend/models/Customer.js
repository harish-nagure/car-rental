// Customer model — replaces MySQL `customers` table
const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name:     { type: String, required: true },
  phone:    { type: String, required: true },
  email:    { type: String, required: true },
  address:  { type: String, required: true },
  password: { type: String, required: true } // hashed with bcrypt
}, { timestamps: true });

module.exports = mongoose.model("Customer", customerSchema);

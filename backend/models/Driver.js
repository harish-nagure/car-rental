const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema({

  username: {

    type: String,
    required: true,
    unique: true

  },

  password: {

    type: String,
    required: true

  },

  name: {

    type: String,
    required: true

  },

  dlNumber: {

    type: String,
    required: true

  },

  phone: {

    type: String,
    required: true

  },

  address: {

    type: String,
    required: true

  },

  gender: {

    type: String,

    enum: [
      "male",
      "female",
      "other"
    ],

    required: true

  },

  availability: {

    type: String,

    enum: [
      "yes",
      "no"
    ],

    default: "yes"

  }

}, {

  timestamps: true

});

module.exports = mongoose.model(
  "Driver",
  driverSchema
);
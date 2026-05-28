// Auth controller — handles register/login for both customers and clients (admins)
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Customer = require("../models/Customer");
const Client = require("../models/Client");
const Driver =
require("../models/Driver");
const signToken = (user, role) =>
  jwt.sign({ id: user._id, username: user.username, role }, process.env.JWT_SECRET, { expiresIn: "7d" });

// ---- CUSTOMER ----
exports.registerCustomer = async (req, res, next) => {
  try {
    const { username, name, phone, email, address, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Username & password required" });

    const exists = await Customer.findOne({ username });
    if (exists) return res.status(409).json({ message: "Username already taken" });

    const hashed = await bcrypt.hash(password, 10);
    const customer = await Customer.create({ username, name, phone, email, address, password: hashed });

    const token = signToken(customer, "customer");
    res.status(201).json({ token, user: { id: customer._id, username, name, role: "customer" } });
  } catch (err) { next(err); }
};

exports.loginCustomer = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const customer = await Customer.findOne({ username });
    if (!customer) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, customer.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(customer, "customer");
    res.json({ token, user: { id: customer._id, username, name: customer.name, role: "customer" } });
  } catch (err) { next(err); }
};

// ---- CLIENT (ADMIN) ----
exports.registerClient = async (req, res, next) => {
  try {
    const { username, name, phone, email, address, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Username & password required" });

    const exists = await Client.findOne({ username });
    if (exists) return res.status(409).json({ message: "Username already taken" });

    const hashed = await bcrypt.hash(password, 10);
    const client = await Client.create({ username, name, phone, email, address, password: hashed });

    const token = signToken(client, "admin");
    res.status(201).json({ token, user: { id: client._id, username, name, role: "admin" } });
  } catch (err) { next(err); }
};

exports.loginClient = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const client = await Client.findOne({ username });
    if (!client) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, client.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(client, "admin");
    res.json({ token, user: { id: client._id, username, name: client.name, role: "admin" } });
  } catch (err) { next(err); }
};
// ---- DRIVER ----

exports.registerDriver =
async (req, res, next) => {

  try {

    const {

      username,

      password,

      name,

      dlNumber,

      phone,

      address,

      gender

    } = req.body;

    if (
      !username ||
      !password
    ) {

      return res.status(400).json({

        message:
          "Username & password required"

      });

    }

    const exists =
      await Driver.findOne({
        username
      });

    if (exists) {

      return res.status(409).json({

        message:
          "Username already taken"

      });

    }

    const hashed =
      await bcrypt.hash(
        password,
        10
      );

    const driver =
      await Driver.create({

        username,

        password: hashed,

        name,

        dlNumber,

        phone,

        address,

        gender

      });

    const token =
      signToken(
        driver,
        "driver"
      );

    res.status(201).json({

      token,

      user: {

        id: driver._id,

        username,

        name,

        role: "driver"

      }

    });

  }

  catch (err) {

    next(err);

  }

};
exports.loginDriver =
async (req, res, next) => {

  try {

    const {

      username,

      password

    } = req.body;

    const driver =
      await Driver.findOne({
        username
      });

    if (!driver) {

      return res.status(401).json({

        message:
          "Invalid credentials"

      });

    }

    const ok =
      await bcrypt.compare(

        password,

        driver.password

      );

    if (!ok) {

      return res.status(401).json({

        message:
          "Invalid credentials"

      });

    }

    const token =
      signToken(
        driver,
        "driver"
      );

    res.json({

      token,

      user: {

        id: driver._id,

        username,

        name: driver.name,

        role: "driver"

      }

    });

  }

  catch (err) {

    next(err);

  }

};



// Get current user info from token
exports.me = (req, res) => res.json({ user: req.user });

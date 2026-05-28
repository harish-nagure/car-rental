// Driver controller — admin creates / lists drivers
const Driver = require("../models/Driver");

exports.list = async (req, res, next) => {
  try {
    const drivers = await Driver.find({ availability: "yes" });

    console.log(drivers);

    res.json(drivers);
  } catch (err) { 
    next(err); 
  }
};

exports.getDrivers = async (
  req,
  res,
  next
) => {

  try {

    const drivers =
      await Driver.find()
      .sort({ createdAt: -1 });

    res.json(drivers);

  }

  catch (err) {

    next(err);

  }

};

exports.all = async (
  req,
  res,
  next
) => {

  try {

    const drivers =
    await Driver.find()
    .sort({ createdAt: -1 });

    res.json(drivers);

  }

  catch (err) {

    next(err);

  }

};

exports.create = async (req, res, next) => {
  try {
    const driver = await Driver.create({ ...req.body, clientUsername: req.user.username });
    res.status(201).json(driver);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const driver = await Driver.findByIdAndDelete(req.params.id);
    if (!driver) return res.status(404).json({ message: "Driver not found" });
    res.json({ message: "Driver deleted" });
  } catch (err) { next(err); }
};
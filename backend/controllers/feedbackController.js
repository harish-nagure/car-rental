// Feedback controller — anyone can submit, admin can list
const Feedback = require("../models/Feedback");

exports.create = async (req, res, next) => {
  try {
    const { name, email, message, driver, rating } = req.body;
    if (!name || !email || !message) return res.status(400).json({ message: "All fields required" });
    const fb = await Feedback.create({
  name,
  email,
  message,
  driver,
  rating
});
    res.status(201).json(fb);
  } catch (err) { next(err); }
};


exports.list = async (req, res, next) => {
  try {
    const items = await Feedback.find()
      .populate("driver", "name")
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (err) {
    next(err);
  }
};

exports.driverFeedback =
async (req, res, next) => {

  try {

    const mongoose =
    require("mongoose");

    const feedback =
    await Feedback.find({

      driver:

      new mongoose.Types.ObjectId(
        req.user.id
      )

    }).populate("driver", "name")

    .sort({
      createdAt: -1
    });

    res.json(feedback);

  }

  catch (err) {

    next(err);

  }

};

// Car controller — list, search, get, create, update, delete cars
const Car = require("../models/Car");

// GET /api/cars  (with optional ?q=search)
exports.list = async (req, res, next) => {
  try {
    const q = (req.query.q || "").trim();
    const filter = q
      ? { $or: [
          { name: { $regex: q, $options: "i" } },
          { nameplate: { $regex: q, $options: "i" } }
        ] }
      : {};
    const cars = await Car.find(filter).sort({ createdAt: -1 });
    res.json(cars);
  } catch (err) { next(err); }
};

// GET /api/cars/:id
exports.getOne = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.json(car);
  } catch (err) { next(err); }
};

// POST /api/cars  (admin only) — multipart with image
exports.create = async (req, res, next) => {
  try {
    const data = { ...req.body, clientUsername: req.user.username };
    if (req.file) data.image = req.file.filename;
    const car = await Car.create(data);
    res.status(201).json(car);
  } catch (err) { next(err); }
};

// PUT /api/cars/:id  (admin only)
exports.update = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = req.file.filename;
    const car = await Car.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.json(car);
  } catch (err) { next(err); }
};

// DELETE /api/cars/:id  (admin only)
exports.remove = async (req, res, next) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.json({ message: "Car deleted" });
  } catch (err) { next(err); }
};

// GET /api/cars/mine — cars owned by the logged-in admin
exports.mine = async (req, res, next) => {
  try {
    const cars = await Car.find({ clientUsername: req.user.username });
    res.json(cars);
  } catch (err) { next(err); }
};

// Booking controller — create, list (per customer/admin), return car
const Booking = require("../models/Booking");
const Car = require("../models/Car");
const Driver = require("../models/Driver");
// POST /api/bookings  (customer only)
// exports.create = async (req, res, next) => {
//   try {
//     const { carId, driverId, rentStartDate, rentEndDate, chargeType, distance, fare } = req.body;
//     const car = await Car.findById(carId);
//     if (!car) return res.status(404).json({ message: "Car not found" });
//     if (car.availability !== "yes") return res.status(400).json({ message: "Car not available" });

// if (driverId) {
//   const driver = await Driver.findById(driverId);

//   if (!driver) {
//     return res.status(404).json({ message: "Driver not found" });
//   }

//   if (driver.availability !== "yes") {
//     return res.status(400).json({ message: "Driver not available" });
//   }
// }


//     // Calculate total amount based on charge type
//     const start = new Date(rentStartDate);
//     const end = new Date(rentEndDate);

//     const today = new Date();

// today.setHours(0, 0, 0, 0);
// start.setHours(0, 0, 0, 0);
// end.setHours(0, 0, 0, 0);

// if (start < today) {
//   return res.status(400).json({
//     message: "Start date cannot be in the past"
//   });
// }

// if (end < start) {
//   return res.status(400).json({
//     message: "Return date cannot be before start date"
//   });
// }
//     const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
//     const totalAmount = chargeType === "km"
//       ? Number(fare) * Number(distance || 0)
//       : Number(fare) * days;

//     const booking = await Booking.create({
//       customerUsername: req.user.username,
//       car: carId,
//       driver: driverId || null,
//       rentStartDate: start,
//       rentEndDate: end,
//       fare,
//       chargeType,
//       distance: distance || null,
//       noOfDays: days,
//       totalAmount
//     });

//     // Mark car unavailable while booked
//     car.availability = "no";
//     await car.save();

// if (driverId) {
//   await Driver.findByIdAndUpdate(driverId, {
//     availability: "no"
//   });
// }


//     res.status(201).json(booking);
//   } catch (err) { next(err); }
// };


exports.create = async (
  req,
  res,
  next
) => {

  try {

    const {

      carId,

      driverId,

      rentStartDate,

      rentEndDate,

      chargeType,

      distance,

      fare,

      currency,

      paymentMethod,

      paymentStatus,

      transactionId,

      payerEmail,

      payerName,

      payerPhone

    } = req.body;

    const car =
      await Car.findById(carId);

    if (!car) {

      return res.status(404)
      .json({

        message:
          "Car not found"

      });

    }

    if (
      car.availability !== "yes"
    ) {

      return res.status(400)
      .json({

        message:
          "Car not available"

      });

    }

    // DRIVER CHECK

    if (driverId) {

      const driver =

        await Driver.findById(
          driverId
        );

      if (!driver) {

        return res.status(404)
        .json({

          message:
            "Driver not found"

        });

      }

      if (
        driver.availability !==
        "yes"
      ) {

        return res.status(400)
        .json({

          message:
            "Driver not available"

        });

      }

    }

    // DATE VALIDATION

    const start =
      new Date(rentStartDate);

    const end =
      new Date(rentEndDate);

    const today =
      new Date();

    today.setHours(
      0,0,0,0
    );

    start.setHours(
      0,0,0,0
    );

    end.setHours(
      0,0,0,0
    );

    if (start < today) {

      return res.status(400)
      .json({

        message:
          "Start date cannot be in the past"

      });

    }

    if (end < start) {

      return res.status(400)
      .json({

        message:
          "Return date cannot be before start date"

      });

    }

    // DAYS CALCULATION

    const days = Math.max(

      1,

      Math.ceil(

        (end - start)

        /

        (1000 * 60 * 60 * 24)

      )

    );

    // IMPORTANT FIX:
    // FRONTEND ALREADY CALCULATED TOTAL

    const totalAmount =
      Number(fare);

    console.log(
      "PAYMENT DATA:",
      {

        paymentMethod,

        paymentStatus,

        transactionId,

        currency,

        payerEmail,

        payerName,

        payerPhone

      }
    );

    // CREATE BOOKING

    const booking =
      await Booking.create({

        customerUsername:
          req.user.username,

        car: carId,

        driver:
          driverId || null,

        rentStartDate:
          start,

        rentEndDate:
          end,

        fare,

        chargeType,

        distance:
          distance || null,

        noOfDays:
          days,

        totalAmount,

        // PAYMENT DETAILS

        currency:
          currency || "INR",

        paymentMethod:
          paymentMethod || "cash",

        paymentStatus:
          paymentStatus ||
          "pending",

        transactionId:
          transactionId ||
          null,

        payerEmail:
          payerEmail ||
          null,

        payerName:
          payerName ||
          null,

        payerPhone:
          payerPhone ||
          null

      });

    // MAKE CAR UNAVAILABLE

    car.availability = "no";

    await car.save();

    // MAKE DRIVER UNAVAILABLE

    if (driverId) {

      await Driver
      .findByIdAndUpdate(

        driverId,

        {
          availability: "no"
        }

      );

    }

    console.log(
      "BOOKING CREATED:",
      booking
    );

    res.status(201)
    .json(booking);

  }

  catch (err) {

    console.error(
      "BOOKING CREATE ERROR:"
    );

    console.error(err);

    console.error(
      err.stack
    );

    next(err);

  }

};

// GET /api/bookings/mine  (customer)
exports.mine = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ customerUsername: req.user.username })
      .populate("car").populate("driver").sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) { next(err); }
};

// GET /api/bookings  (admin — all bookings on cars they own)
exports.all = async (req, res, next) => {
  try {
    const bookings = await Booking.find().populate("car").populate("driver").sort({ createdAt: -1 });
    const filtered = bookings.filter(b => b.car && b.car.clientUsername === req.user.username);
    res.json(filtered);
  } catch (err) { next(err); }
};

// PUT /api/bookings/:id/return  (admin marks car as returned)
exports.returnCar = async (req, res, next) => {
  try {
   const booking = await Booking.findById(req.params.id)
  .populate("car")
  .populate("driver");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.returnStatus = "returned";
    booking.carReturnDate = new Date();
    await booking.save();

    if (booking.car) {
      booking.car.availability = "yes";
      await booking.car.save();
    }
if (booking.driver) {
  await Driver.findByIdAndUpdate(booking.driver, {
    availability: "yes"
  });
}

    res.json(booking);
  } catch (err) { next(err); }
};

exports.driverBookings = async (req, res, next) => {

  try {

    const mongoose = require("mongoose");

    const bookings = await Booking.find({

      driver: new mongoose.Types.ObjectId(
        req.user.id
      )

    })
    .populate("car")
    .populate("driver")
    .sort({ createdAt: -1 });

    res.json(bookings);

  }

  catch (err) {

    next(err);

  }

};

exports.receiveCash =
async (req, res, next) => {

  try {

    const booking =
    await Booking.findById(
      req.params.id
    );

    if (!booking) {

      return res.status(404)
      .json({

        message:
        "Booking not found"

      });

    }

    booking.paymentStatus =
    "paid";

    await booking.save();

    res.json({

      message:
      "Cash payment received",

      booking

    });

  }

  catch (err) {

    next(err);

  }

};
exports.receiveCash =
async (req, res, next) => {

  try {

    const booking =
    await Booking.findById(
      req.params.id
    );

    if (!booking) {

      return res.status(404)
      .json({

        message:
        "Booking not found"

      });

    }

    booking.paymentStatus =
    "paid";

    await booking.save();

    res.json({

      message:
      "Cash received successfully",

      booking

    });

  }

  catch (err) {

    next(err);

  }

};


exports.cancelBooking =
async (req, res, next) => {

  try {

    const booking =
      await Booking.findById(
        req.params.id
      )
      .populate("car")
      .populate("driver");

    if (!booking) {

      return res.status(404)
      .json({

        message:
          "Booking not found"

      });

    }

    booking.returnStatus =
      "cancelled";

    await booking.save();

    // FREE CAR

    if (booking.car) {

      booking.car.availability =
        "yes";

      await booking.car.save();

    }

    // FREE DRIVER

    if (booking.driver) {

      booking.driver.availability =
        "yes";

      await booking.driver.save();

    }

    res.json({
      message:
        "Booking cancelled successfully"
    });

  }

  catch (err) {

    next(err);

  }

};
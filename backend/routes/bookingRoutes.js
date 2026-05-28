const router = require("express").Router();

const c = require("../controllers/bookingController");

const { protect } = require("../middleware/auth");

router.post(
  "/",
  protect("customer"),
  c.create
);

router.get(
  "/mine",
  protect("customer"),
  c.mine
);

router.get(
  "/",
  protect("admin"),
  c.all
);

router.put(
  "/:id/return",
  protect("admin"),
  c.returnCar
);

router.get(
  "/driver",
  protect("driver"),
  c.driverBookings
);

router.put(

  "/:id/receive-cash",

  protect("driver"),

  c.receiveCash

);

router.put(
  "/:id/cancel",
 protect(
    "admin",
    "customer",
    "driver"
  ),
  c.cancelBooking
);

module.exports = router;
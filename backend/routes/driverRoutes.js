const router = require("express").Router();
const c = require("../controllers/driverController");
const { protect } = require("../middleware/auth");

router.get("/",      c.list);                       // available drivers (used in booking)
router.get(

  "/all",

  protect("admin"),

  c.all

);
router.post("/",     protect("admin"), c.create);
router.delete("/:id",protect("admin"), c.remove);
router.get(
  "/all",
  c.getDrivers
);

module.exports = router;
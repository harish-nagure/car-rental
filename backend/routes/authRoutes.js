const router = require("express").Router();
const c = require("../controllers/authController");
const { protect } = require("../middleware/auth");

// Customer
router.post("/customer/register", c.registerCustomer);
router.post("/customer/login",    c.loginCustomer);

// Client (Admin)
router.post("/client/register", c.registerClient);
router.post("/client/login",    c.loginClient);

router.post("/driver/register", c.registerDriver);
router.post("/driver/login", c.loginDriver);

// Current user
router.get("/me", protect(), c.me);

module.exports = router;

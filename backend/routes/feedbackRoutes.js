const router = require("express").Router();
const c = require("../controllers/feedbackController");
const { protect } = require("../middleware/auth");

router.post("/", c.create);                    // anyone
router.get("/",  protect("admin"), c.list);    // admin only
router.get(

  "/driver",

  protect("driver"),

  c.driverFeedback

);
module.exports = router;

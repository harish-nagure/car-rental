const router = require("express").Router();
const c = require("../controllers/carController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.get("/",        c.list);                          // public list / search
router.get("/mine",    protect("admin"), c.mine);        // admin's own cars
router.get("/:id",     c.getOne);                        // public detail
router.post("/",       protect("admin"), upload.single("image"), c.create);
router.put("/:id",     protect("admin"), upload.single("image"), c.update);
router.delete("/:id",  protect("admin"), c.remove);

module.exports = router;

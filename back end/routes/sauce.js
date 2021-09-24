const express = require("express");
const router = express.Router();
const sauceCtrl = require("../controllers/sauce");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const inputValidator = require("../middleware/input-validator");

router.get("/", auth, sauceCtrl.getAll);
router.post("/", auth, multer, inputValidator.postInput, sauceCtrl.create);
router.get("/:id", auth, sauceCtrl.getOne);
router.put("/:id", auth, multer, inputValidator.modifyInput, sauceCtrl.modify);
router.delete("/:id", auth, sauceCtrl.delete);
router.post("/:id/like", auth, sauceCtrl.like);

module.exports = router;
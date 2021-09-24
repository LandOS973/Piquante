const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const validEmail = require("../middleware/email");

router.post("/signup",validEmail, userCtrl.signup);
router.post("/login",userCtrl.login);

module.exports = router;
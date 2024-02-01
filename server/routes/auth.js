const express = require("express");
const verfiyEmail = require("../controllers/userControl.js");
const passworsReset = require("../controllers/passwordReset.js");

const router = express.Router();
router.get("/user/verify/:userId/:token", verfiyEmail);
router.get("/user/password-reset/:userId/:token", passworsReset);
module.exports = router;

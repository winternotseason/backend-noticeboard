const express = require("express");
const router = express.Router();
const User = require("../schemas/users");
const { isLoggedin, isNotLoggedin } = require("../middlewares");
const bcrypt = require("bcrypt");
const { joinUser } = require("../controllers/auth");
const { login } = require("./auth");

router.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

router.route("/").get((req, res, next) => {
  res.json({ name: 1 });
});



module.exports = router;

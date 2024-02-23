const express = require("express");
const router = express.Router();
const User = require('../schemas/users')

router.use((req, res, next) => {
  res.locals.user = null;
  next();
});

router.route("/").get((req, res, next) => {
  res.json({ name: 1 });
});

router.route("/join").post(async (req, res, next) => {
  console.log(req.body);
  const { id, nickname, password } = req.body;
  try {
    const user = new User({
      id,
      nickname,
      password,
    });
    user.save()
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;

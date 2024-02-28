const express = require("express");
const router = express.Router();
const { isLoggedin, isNotLoggedin } = require("../middlewares");
const bcrypt = require("bcrypt");
const { joinUser } = require("../controllers/auth");
const { login } = require("./auth");
const Post = require("../models/post");
const User = require("../models/user");

router.use((req, res, next) => {
  res.locals.user = null; // 라우터 들에서 공통적으로 쓰고싶은 데이터들....
  next(); // next 빼먹는 실수 주의
});

router.route("/").get(async (req, res, next) => {
  // res.json (유저 정보)
  try {
    const posts = await Post.findAll({
      include: {
        model: User,
        attributes: ["id", "nick"],
      },
      order: [["createdAt", "DESC"]],
    });
    res.json(posts);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const { isLoggedin, isNotLoggedin } = require("../middlewares");
const bcrypt = require("bcrypt");
const { joinUser } = require("../controllers/auth");
const { login } = require("./auth");
const jwt = require("jsonwebtoken");
const Post = require("../models/post");
const User = require("../models/user");

router.use((req, res, next) => {
  res.locals.user = req.user; // 라우터 들에서 공통적으로 쓰고싶은 데이터들....
  next(); // next 빼먹는 실수 주의
});

// 헤더 닉네임
router.route("/user").get((req, res, next) => {
  res.send({ user: req.user });
});

// 내 게시글
router.route("/posts").get(async (req, res, next) => {
  const posts = await Post.findAll({
    where: {
      writer: req.user.id,
    },
  });
  res.json({ posts });
});

router.route("/allposts").get(async (req, res, next) => {
  const posts = await Post.findAll({
    include: [
      {
        model: User,
        attributes : ['nickname']
      },
    ],
    attributes : ['title','createdAt']
  });
  res.json(posts);
});
module.exports = router;

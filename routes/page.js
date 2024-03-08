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

router.route("/post").get(async (req, res, next) => {
  // res.json (유저 정보)
  try {
    const posts = await Post.findAll({
      include: {
        model: User,
        attributes: ["email", "nickname"],
      },
      order: [["createdAt", "DESC"]],
    });
    res.json(posts);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.route("/profileimg").get(async (req, res, next) => {
  // res.json (유저 정보)
  const imgUrl = "https://localhost:8001/uploads/profiles"
  const result = imgUrl+"/KakaoTalk_Photo_2023-09-23-19-40-24 0081709706520427.jpeg"
  res.send(result)
});

router.route("/usernick").post(async (req, res, next) => {
  console.log(req.body);
  const user = await User.findOne({
    where: { email: req.body.email },
    attributes: ["nickname"],
  }).then((user) => res.json({ nickname: user.dataValues.nickname }));
});

router.route("/accesstokenrequest").get(async (req, res, next) => {
  const authorization = req.headers["authorization"];
  if(req.cookies){console.log('쿠키', req.cookies)}
  else{console.log('쿠키가 없습니다.')}
  if (!authorization) {
    res.json({ data: null, message: "access token이 유효하지 않습니다." });
  }
  const token = authorization.split(" ")[1];
  const tokenData = jwt.verify(token, "SECRET_KEY");
  console.log(tokenData);
  const { email } = tokenData;
  const userInfo = await User.findOne({ where: { email } });
  if (!userInfo) {
    res.json({ data: null, message: "access token has been tempered" });
  } else {
    delete userInfo.dataValues.password;
    res.json({ data: { userInfo: userInfo.dataValues }, message: "ok" });
  }
});



module.exports = router;

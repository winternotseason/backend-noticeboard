const passport = require("passport");
const local = require("./localStrategy");
// const kakao = require("./kakaoStrategy");
const User = require("../models/user")

module.exports = () => {
  passport.serializeUser((user, done) => {
    // user === exUser
    done(null, user.email);
  });
  // { 세션 쿠키 : 유저아이디 } => 메모리 저장

  passport.deserializeUser((email, done) => {
    User.findOne({ email })
      .then((user) => {
        done(null, user);
      })
      .catch((err) => done(err));
  });
};

local();

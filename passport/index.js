const passport = require("passport");
const local = require("./localStrategy");
// const kakao = require("./kakaoStrategy");
const User = require("../schemas/users");

module.exports = () => {
  passport.serializeUser((user, done) => {
    console.log('serializeUser')
    // user === exUser
    done(null, user.id);
  });
  // { 세션 쿠키 : 유저아이디 } => 메모리 저장

  passport.deserializeUser((id, done) => {
    User.findOne({ id })
      .then((user) => {
        done(null, user);
      })
      .catch((err) => done(err));
  });
};

local();

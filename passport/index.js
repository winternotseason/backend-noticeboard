const passport = require("passport");
const local = require("./localStrategy");
// const kakao = require("./kakaoStrategy");
const User = require("../models/user");

module.exports = () => {
  // 로그인에 성공하면, serializeUser 실행
  passport.serializeUser((user, done) => { // user => exUser
    console.log('유저 정보 : ', user)
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    console.log('deserialize id : ' , id )
    User.findOne({ where: { id } })
      .then((user) => done(null, user))
      .catch((err) => done(err));
  });

  local();
};

const User = require("../models/user");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const tokenService = require('../jwt')

exports.join = async (req, res, next) => {
  const { email, nickname, password } = req.body;
  try {
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      return res.redirect("/join?error=exist");
    }
    const hash = await bcrypt.hash(password, 10);
    await User.create({
      email,
      nickname,
      password: hash,
    });
    return res.json({
      status: 200,
      message: "회원가입 성공",
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.login = (req, res, next) => {
  // local strategy로 들어가 확인한 후 결과에 따라 다음 미들웨어 실행
  passport.authenticate("local", (authError, user, info) => {
     // 서버에러가 발생한 경우
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    // 로직에러가 발생한 경우
    if (!user) {
      return res.json({ status: 003, message: "회원정보가 다릅니다." });
    }
    // 로그인에 성공한 경우, 그 안에서도 과정에서 에러가 발생한 경우(매우 드물다.)
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.send({token : tokenService.getToken(user.id)});
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)
};

exports.logout = (req, res) => {
  req.logout(() => {
    res.send();
  });
};

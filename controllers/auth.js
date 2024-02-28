const User = require("../models/user");
const bcrypt = require("bcryptjs");
const passport = require("passport");

exports.join = async (req, res, next) => {
  const { email, nickname, password } = req.body;
  try {
    const exUser = await User.findOne( {where:{ email }} );
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
  passport.authenticate("local", (authError, user, info) => {
    if (authError) {
      // 서버에러
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      // 로직에러
      return res.json({ status: 003, message: "회원정보가 다릅니다." });
    }
    return req.login(user, (loginError) => {
      // 로그인 성공
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.send();
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
};

exports.logout = (req, res) => {
  req.logout(() => {
    res.send();
  });
};

const User = require("../schemas/users");
const bcrypt = require("bcryptjs");
const passport = require("passport");

exports.join = async (req, res, next) => {
  const { id, nickname, password } = req.body;
  try {
    const exUser = await User.findOne({ where: { id } });
    if (exUser) {
      return res.redirect("/join?error=exist");
    }
    const hash = await bcrypt.hash(password, 10);
    await User.create({
      id,
      nickname,
      password: hash,
    });
    return res.redirect("/");
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
      return res.redirect(`/?loginError=${info.message}`);
    }
    return req.login(user, (loginError) => {
      // 로그인 성공
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect("/");
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
};

exports.logout = (req, res) => {
  req.logout(() => {
    res.json({ message: 1 });
  });
};

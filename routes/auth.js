const express = require("express");
const passport = require("passport");
const tokenService = require("../jwt");
const { isLoggedIn, isNotLoggedIn } = require("../middlewares");
const { join, login, logout } = require("../controllers/auth");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

const router = express.Router();

// POST /auth/join
router.post("/join", isNotLoggedIn, join);

// POST /auth/login

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      const result = await bcrypt.compare(password, exUser.password);
      if (result) {
        // 로그인 성공
        res.cookie("refreshToken", tokenService.getRefreshToken(email), {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 3600,
        });
        const accessToken = tokenService.getAccessToken(email);
        res.json({
          accessToken,
          message: "ok",
        });
      } else {
        res
          .status(401)
          .send({ status: 401, message: "비밀번호가 일치하지 않습니다." });
      }
    } else {
      // 회원 없음
      res
        .status(401)
        .send({ status: 401, message: "존재하지 않는 이메일입니다." });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// GET /auth/logout
router.get("/logout", isLoggedIn, logout);

module.exports = router;

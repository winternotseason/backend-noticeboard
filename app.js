const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");
const session = require("express-session");
const dotenv = require("dotenv");
const connect = require("./schemas");
const cors = require("cors");
const passport = require("passport");

dotenv.config(); // process.env
const authRouter = require("./routes/auth");
const pageRouter = require("./routes/page");
const passportConfig = require("./passport");
connect();
const { format } = require("path");

const app = express();
passportConfig();

app.use(morgan({ format: "dev" })); // 배포할땐 combined
app.set("port", process.env.PORT || 8001);

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

app.use(express.static(path.join(__dirname, "public"))); // 프론트에서 public 폴더 허용
app.use(express.json()); // json 요청
app.use(express.urlencoded({ extended: false })); // form 요청
app.use(cookieParser(process.env.COOKIE_SECRET)); // cookie 처리
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: 'none'
  },
}));
app.use(passport.initialize());
app.use(passport.session());
// 브라우저에 connect.sid=1234134135

app.use("/", pageRouter);
app.use("/auth", authRouter);

// router들에서 안걸리면 아래로
app.use((req, res, next) => {
  const error = new Error("라우터가 없습니다.");
  error.status = 404;
  next(error);
});

// error 처리 미들웨어
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.status || 500);
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중");
});

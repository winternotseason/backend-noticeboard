const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");
const session = require("express-session");
const dotenv = require("dotenv");
const cors = require("cors");
const passport = require("passport");
const { sequelize } = require("./models");
const https = require("https");
const fs = require("fs");

const options = {
  key: fs.readFileSync("./cert/_wildcard.example.dev+3-key.pem"),
  cert: fs.readFileSync("./cert/_wildcard.example.dev+3.pem"),
};

dotenv.config(); // process.env
const authRouter = require("./routes/auth");
const pageRouter = require("./routes/page");
const postRouter = require("./routes/post");
const profileRouter = require("./routes/Profile");
const passportConfig = require("./passport");
const { format } = require("path");

const app = express();
passportConfig();

app.use(morgan({ format: "dev" })); // 배포할땐 combined
app.set("port", process.env.PORT || 8001);
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("데이터베이스 연결 성공");
  })
  .catch((err) => {
    console.error(err);
  });

app.use(cors({ origin: "https://localhost:3000", credentials: true }));

app.use(express.static(path.join(__dirname, "public")));
app.use("/img", express.static(path.join(__dirname, "uploads")));
app.use(
  "/profileimg",
  express.static(path.join(__dirname, "uploads/profiles"))
); // 프론트에서 public 폴더 허용
app.use(express.json()); // json 요청
app.use(express.urlencoded({ extended: false })); // form 요청
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 100 // 10분 후 쿠키 폭피
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
// 브라우저에 connect.sid=1234134135

app.use("/", pageRouter);
app.use("/auth", authRouter);
app.use("/post", postRouter);
app.use("/profile", profileRouter);

// router들에서 안걸리면 아래로
app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

// error 처리 미들웨어
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.status || 500);
});

https.createServer(options, app).listen(app.get("port"));

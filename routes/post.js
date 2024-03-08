const express = require("express");
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require("../middlewares");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const { afterUploadImage, uploadPost } = require("../controllers/post");

try {
  fs.readdirSync("public/uploads");
} catch (err) {
  fs.mkdirSync("public/uploads");
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, "public/uploads/");
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});
// 이미지를 uploads 폴더로 저장
// input img onchage에서 실행. url을 form 데이터로 넘김
// 제목 + 내용 + url을 포함한 form을 upload2로 받음
router.post("/img", upload.single("img"), afterUploadImage);

//
const upload2 = multer();
router.post("/", upload2.none(), uploadPost);

module.exports = router;

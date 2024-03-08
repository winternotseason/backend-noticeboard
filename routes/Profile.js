const express = require("express");
const router = express.Router();
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const {afterUploadProfile} = require("../controllers/profile")

try {
  fs.readdirSync("public/profiles");
} catch (err) {
  fs.mkdirSync("public/profiles");
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, "public/profiles/");
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post('/img', upload.single('profile-img'), afterUploadProfile)

module.exports = router;

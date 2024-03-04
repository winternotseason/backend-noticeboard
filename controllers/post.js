const Post = require("../models/post");
exports.afterUploadImage = (req, res) => {
  console.log(req.file);
  res.json({ url: `/img/${req.file.filename}` });
};

exports.uploadPost = async (req, res, next) => {
  try {
    console.log("user : ")
    console.log(req.user)
    const post = await Post.create({
      title: req.body.title,
      content: req.body.content,
      img: req.body.url,
    });
    res.json({ status: 2001 });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
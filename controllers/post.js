const Post = require("../models/post");

exports.afterUploadImage = (req, res) => {
  res.json({ url: `/img/${req.file.filename}` });
};

exports.uploadPost = async (req, res, next) => {
  try {
    const post = await Post.create({
      writer: req.user.id,
      title: req.body.title,
      content: req.body.content,
    });
    res.json({ status: 2001 });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

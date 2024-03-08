exports.afterUploadProfile = async (req, res, next) => {
  try {
    res.json({ url: `/profiles/${req.file.filename}` });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

///Users/apple/backend-noticeboard/public/
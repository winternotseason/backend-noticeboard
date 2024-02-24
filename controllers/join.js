const User = require("../schemas/users");
const bcrypt = require("bcryptjs");

exports.joinUser = async (req, res, next) => {
  const { id, nickname, password } = req.body;
  try {
    const exUser = await User.findOne({ id });
    if (exUser) {
      res.status(409).send();
    } else {
      const hash = await bcrypt.hash(password, 10);
      const user = new User({
        id,
        nickname,
        password: hash,
      });
      user.save();
      res.send();
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

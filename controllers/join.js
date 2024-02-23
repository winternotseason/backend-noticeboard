const User = require("../schemas/users");
const bcrypt = require("bcryptjs");

exports.joinUser = async (req, res, next) => {
  const { id, nickname, password } = req.body;
  try {
    const user = await User.create({
        id, nickname, password
    })

    const salt = bcrypt.genSalt(10);
    user.password = bcrypt.hash(password, salt);

    console.log(user)
    res.status(201).json(user);

  } catch (error) {
    console.error("에러");
    next(err)
  }
};
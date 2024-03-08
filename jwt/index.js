const jwt = require("jsonwebtoken");

const tokenService = {
  getAccessToken(email) {
    return jwt.sign({ email }, "SECRET_KEY", {
      expiresIn: "3h",
    });
  },

  getRefreshToken(email) {
    return jwt.sign({ email }, "SECRET_KEY", { expiresIn: "1d" });
  },
};

module.exports = tokenService;

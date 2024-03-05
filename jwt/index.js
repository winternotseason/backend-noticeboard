const jwt = require("jsonwebtoken");

const tokenService = {
  getToken(id) {
    return jwt.sign({ id }, "SECRET_KEY", {
      expiresIn: "1d",
    });
  },
  getPayload(token) {
      return jwt.verify(token, 'SECRET_KEY')
  }
};


module.exports = tokenService;
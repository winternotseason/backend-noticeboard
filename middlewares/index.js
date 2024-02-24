exports.isLogginedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    // 패스포트 통해서 로그인 했니?
    next();
  } else {
    res.status(403).send("로그인 필요");
  }
};

exports.isNotLogginedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    const message = encodeURIComponent("로그인 한 상태입니다.");
    res.redirect(message);
  }
};

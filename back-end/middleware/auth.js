const ensureAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    req.userId = req.session.user.id;
    next();
  } else {
    res.status(401).send("로그인이 필요합니다.");
  }
};

export default ensureAuthenticated;

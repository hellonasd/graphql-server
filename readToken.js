const jwt = require("jsonwebtoken");



module.exports = (req, res, next) => {
  const { token } = req.session;
  if (token) {
    const user = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
    req.user = user;
  }
  next();
};

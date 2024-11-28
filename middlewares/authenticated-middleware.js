const jwt = require("jsonwebtoken");

const authenticatedMiddleware = (req, res, next) => {
  const token = req.cookies["jobsprint-auth-token"];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const decodedToken = jwt.decode(token, process.env.JWT_SECRET);
  if (!decodedToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  req.user = decodedToken;
  next();
};

module.exports = authenticatedMiddleware;

const jwt = require("jsonwebtoken");

const authenticatedMiddleware = (req, res, next) => {
  // const token = req.cookies["jobsprint-auth-token"];
  const authHeader = req.headers["authorization"]; // Get the authorization header

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1]; // Bearer <token>

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

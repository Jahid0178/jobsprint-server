const assignRole = (req, res, next) => {
  const { email } = req.body;
  req.body.role = email.endsWith("@arnifi.com") ? "admin" : "user";
  next();
};

module.exports = assignRole;

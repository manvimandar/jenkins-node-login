const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.SECRET;

module.exports = function (req, res, next) {
  const token = req.header("access-token");

  if (!token) {
    return res
      .status(403)
      .json({ status: "error", message: "Access denied.." });
  }

  try {
    const verifyToken = jwt.verify(token, JWT_SECRET);
    // console.log(verifyToken);
    next();
  } catch (err) {
    res.status(403).json({ status: "error", message: "Token Expired!" });
  }
};

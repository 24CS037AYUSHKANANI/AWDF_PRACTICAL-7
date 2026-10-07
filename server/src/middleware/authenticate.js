const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  const header = req.get("Authorization");

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      studentId: "24CS037",
      message: "Bearer token required"
    });
  }

  const token = header.slice(7);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({
      success: false,
      studentId: "24CS037",
      message: "Token is invalid or expired"
    });
  }
}

module.exports = authenticate;

// backend/src/middlewares/auth.middleware.js
const { verifyToken } = require("../utils/jwt");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw { status: 401, code: "NO_TOKEN", message: "Authentication required" };
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    req.user = { id: decoded.userId };
    next();
  } catch (err) {
    next(err);
  }
};

// backend/src/utils/jwt.js
const jwt = require("jsonwebtoken");
const env = require("../config/env");

exports.signToken = (payload) => {
  if (!payload.userId) {
    throw new Error("JWT requires userId");
  }
  return jwt.sign(
    { userId: payload.userId },  // Minimal payload = fast
    env.jwt.secret,
    {
      expiresIn: env.jwt.expiresIn,
      algorithm: "HS256",
    }
  );
};

exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, env.jwt.secret, {
      algorithms: ["HS256"],  // Prevent "none" algorithm attacks
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw { status: 401, code: "TOKEN_EXPIRED" };
    }
    if (error.name === "JsonWebTokenError") {
      throw { status: 401, code: "INVALID_TOKEN" };
    }
    throw { status: 401, code: "AUTH_FAILED" };
  }
};

// Extract userId from verified token
exports.getUserIdFromToken = (token) => {
  const decoded = exports.verifyToken(token);
  return decoded.userId;
};

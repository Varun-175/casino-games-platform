// backend/src/utils/password.js
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 12;

exports.hashPassword = async (plainPassword) => {
  if (!plainPassword || plainPassword.length < 8) {
    throw new Error("Password must be 8+ characters");
  }
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
};

exports.comparePassword = async (plainPassword, hash) => {
  if (!plainPassword || !hash) {
    return false;
  }
  return bcrypt.compare(plainPassword, hash);
};

exports.isStrongPassword = (password) => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(password);
};

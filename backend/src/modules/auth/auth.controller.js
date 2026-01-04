// backend/src/modules/auth/auth.controller.js
const service = require("./auth.service");

exports.register = async (req, res, next) => {
  try {
    const user = await service.register(req.body);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { token, user } = await service.login(req.body);
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: { token, user },
    });
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (err) {
    next(err);
  }
};
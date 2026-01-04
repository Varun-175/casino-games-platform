// backend/src/modules/auth/auth.routes.js
const express = require("express");
const { body } = require("express-validator");
const controller = require("./auth.controller");
const authMiddleware = require("../../middlewares/auth.middleware");

const router = express.Router();

router.post(
  "/register",
  [
    body("name").trim().isLength({ min: 2 }).withMessage("Name min 2 chars"),
    body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
    body("password")
      .isLength({ min: 8 })
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage("Password: 8+ chars, 1 upper, 1 lower, 1 number"),
  ],
  controller.register
);

router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").notEmpty(),
  ],
  controller.login
);

// ✅ ADD THIS
router.get("/me", authMiddleware, controller.me);

module.exports = router;

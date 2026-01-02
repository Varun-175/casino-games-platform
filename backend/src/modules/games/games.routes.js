// backend/src/modules/games/games.routes.js
const express = require("express");
const { query } = require("express-validator");
const auth = require("../../middlewares/auth.middleware");
const controller = require("./games.controller");

const router = express.Router();

router.get(
  "/",
  auth,
  [
    query("page").optional().isInt({ min: 1 }).toInt(),
    query("limit").optional().isInt({ min: 5, max: 50 }).toInt(),
    query("provider").optional().trim().escape(),
    query("category").optional().trim().escape(),
    query("search").optional().trim().escape(),
  ],
  controller.listGames
);

module.exports = router;

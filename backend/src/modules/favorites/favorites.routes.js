// backend/src/modules/favorites/favorites.routes.js
const express = require("express");
const { param } = require("express-validator");
const auth = require("../../middlewares/auth.middleware");
const controller = require("./favorites.controller");

const router = express.Router({ mergeParams: true });

router.get("/", auth, controller.listFavorites);

router.post(
  "/:gameId",
  auth,
  [param("gameId").isInt().toInt()],
  controller.addFavorite
);

router.delete(
  "/:gameId",
  auth,
  [param("gameId").isInt().toInt()],
  controller.removeFavorite
);

module.exports = router;

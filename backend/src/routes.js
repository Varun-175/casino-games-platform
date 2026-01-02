// backend/src/routes.js
const express = require("express");

const authRoutes = require("./modules/auth/auth.routes");
const gamesRoutes = require("./modules/games/games.routes");
const favoritesRoutes = require("./modules/favorites/favorites.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/games", gamesRoutes);
router.use("/favorites", favoritesRoutes);

module.exports = router;

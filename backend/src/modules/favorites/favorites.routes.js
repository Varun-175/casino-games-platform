// backend/src/modules/favorites/favorites.routes.js - UPGRADED v2.0

const express = require("express");
const { param, validationResult } = require("express-validator");
const auth = require("../../middlewares/auth.middleware");
const controller = require("./favorites.controller");

const router = express.Router({ mergeParams: true });

/**
 * ✅ Validation Middleware
 */
const validateGameId = [
  param("gameId")
    .isInt({ min: 1 })
    .withMessage("Game ID must be a positive integer")
    .toInt(),
];

/**
 * ✅ Error Handler Middleware
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

/**
 * ✅ GET /favorites
 * List all favorites for current user
 * @route GET /api/v1/favorites
 * @access Protected (requires JWT)
 * @returns {Object} { success, data: { items, pagination } }
 */
router.get("/", auth, async (req, res, next) => {
  try {
    await controller.listFavorites(req, res);
  } catch (err) {
    next(err);
  }
});

/**
 * ✅ POST /favorites/:gameId
 * Add game to favorites
 * @route POST /api/v1/favorites/:gameId
 * @access Protected (requires JWT)
 * @param {number} gameId - Game ID (path param)
 * @returns {Object} { success, data, message }
 * @throws 400 - Invalid game ID
 * @throws 401 - Unauthorized
 * @throws 404 - Game not found
 * @throws 409 - Already favorited (treated as success)
 * @throws 500 - Server error
 */
router.post(
  "/:gameId",
  auth,
  validateGameId,
  handleValidationErrors,
  async (req, res, next) => {
    try {
      await controller.addFavorite(req, res);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * ✅ DELETE /favorites/:gameId
 * Remove game from favorites
 * @route DELETE /api/v1/favorites/:gameId
 * @access Protected (requires JWT)
 * @param {number} gameId - Game ID (path param)
 * @returns {Object} { success, message }
 * @throws 400 - Invalid game ID
 * @throws 401 - Unauthorized
 * @throws 404 - Favorite not found (treated as success)
 * @throws 500 - Server error
 */
router.delete(
  "/:gameId",
  auth,
  validateGameId,
  handleValidationErrors,
  async (req, res, next) => {
    try {
      await controller.removeFavorite(req, res);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * ✅ POST /favorites/:gameId/toggle (BONUS)
 * Toggle favorite status (smart add/remove)
 * @route POST /api/v1/favorites/:gameId/toggle
 * @access Protected (requires JWT)
 * @param {number} gameId - Game ID (path param)
 * @returns {Object} { success, is_favorite, message }
 */
router.post(
  "/:gameId/toggle",
  auth,
  validateGameId,
  handleValidationErrors,
  async (req, res, next) => {
    try {
      await controller.toggleFavorite(req, res);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * ✅ GET /favorites/:gameId (BONUS)
 * Check if game is favorited
 * @route GET /api/v1/favorites/:gameId
 * @access Protected (requires JWT)
 * @param {number} gameId - Game ID (path param)
 * @returns {Object} { success, is_favorite }
 */
router.get(
  "/:gameId",
  auth,
  validateGameId,
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const service = require("./favorites.service");
      const isFavorited = await service.isFavorited(req.user.id, req.params.gameId);
      res.json({
        success: true,
        is_favorite: isFavorited,
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;

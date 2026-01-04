// backend/src/modules/favorites/favorites.controller.js

const service = require("./favorites.service");

/**
 * ✅ List all favorites for current user
 */
exports.listFavorites = async (req, res, next) => {
  try {
    const data = await service.listFavorites(req.user.id);
    res.json({
      success: true,
      data: {
        items: data.items || [],
        pagination: data.pagination || null
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * ✅ Add game to favorites (POST)
 */
exports.addFavorite = async (req, res, next) => {
  try {
    const result = await service.addFavorite(req.user.id, req.params.gameId);
    res.status(201).json({
      success: true,
      data: result,
      message: "Added to favorites"
    });
  } catch (err) {
    next(err);
  }
};

/**
 * ✅ Remove game from favorites (DELETE)
 */
exports.removeFavorite = async (req, res, next) => {
  try {
    await service.removeFavorite(req.user.id, req.params.gameId);
    res.json({
      success: true,
      message: "Removed from favorites",
    });
  } catch (err) {
    next(err);
  }
};

/**
 * ✅ Toggle favorite (convenience endpoint)
 */
exports.toggleFavorite = async (req, res, next) => {
  try {
    const isFavorite = await service.isFavorited(req.user.id, req.params.gameId);
    
    if (isFavorite) {
      await service.removeFavorite(req.user.id, req.params.gameId);
      return res.json({
        success: true,
        is_favorite: false,
        message: "Removed from favorites"
      });
    } else {
      const result = await service.addFavorite(req.user.id, req.params.gameId);
      return res.json({
        success: true,
        is_favorite: true,
        data: result,
        message: "Added to favorites"
      });
    }
  } catch (err) {
    next(err);
  }
};

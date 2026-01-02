// backend/src/modules/favorites/favorites.controller.js
const service = require("./favorites.service");

exports.listFavorites = async (req, res, next) => {
  try {
    const data = await service.listFavorites(req.user.id);
    res.json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};

exports.addFavorite = async (req, res, next) => {
  try {
    const data = await service.addFavorite(req.user.id, req.params.gameId);
    res.status(201).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};

exports.removeFavorite = async (req, res, next) => {
  try {
    await service.removeFavorite(req.user.id, req.params.gameId);
    res.json({
      success: true,
      message: "Favorite removed",
    });
  } catch (err) {
    next(err);
  }
};

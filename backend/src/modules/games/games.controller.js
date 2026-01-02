// backend/src/modules/games/games.controller.js
const service = require("./games.service");

exports.listGames = async (req, res, next) => {
  try {
    const data = await service.listGames({
      ...req.query,
      userId: req.user.id,
    });
    res.json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};

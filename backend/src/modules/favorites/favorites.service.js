// backend/src/modules/favorites/favorites.service.js
const pool = require("../../config/db");

exports.listFavorites = async (userId) => {
  const result = await pool.query(
    `SELECT g.id, g.name, g.provider, g.category, f.created_at
     FROM favorites f
     JOIN games g ON g.id = f.game_id
     WHERE f.user_id = $1
     ORDER BY f.created_at DESC`,
    [userId]
  );
  return result.rows;
};

exports.addFavorite = async (userId, gameId) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    
    const gameExists = await client.query("SELECT 1 FROM games WHERE id = $1", [gameId]);
    if (gameExists.rowCount === 0) {
      throw {
        status: 404,
        code: "GAME_NOT_FOUND",
        message: "Game does not exist",
      };
    }

    const result = await client.query(
      `INSERT INTO favorites (user_id, game_id)
       VALUES ($1, $2)
       RETURNING id, created_at`,
      [userId, gameId]
    );

    await client.query("COMMIT");
    return {
      id: result.rows[0].id,
      gameId,
      userId,
      createdAt: result.rows[0].created_at,
    };
  } catch (err) {
    await client.query("ROLLBACK");
    if (err.code === "23505") {
      throw {
        status: 409,
        code: "ALREADY_FAVORITED",
        message: "Game already favorited",
      };
    }
    throw err;
  } finally {
    client.release();
  }
};

exports.removeFavorite = async (userId, gameId) => {
  const result = await pool.query(
    `DELETE FROM favorites
     WHERE user_id = $1 AND game_id = $2
     RETURNING id`,
    [userId, gameId]
  );

  if (result.rowCount === 0) {
    throw {
      status: 404,
      code: "FAVORITE_NOT_FOUND",
      message: "Favorite not found for this game",
    };
  }
};

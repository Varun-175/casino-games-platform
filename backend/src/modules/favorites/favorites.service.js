// backend/src/modules/favorites/favorites.service.js

const pool = require("../../config/db");

/**
 * ✅ Get all favorites for user
 */
exports.listFavorites = async (userId) => {
  const query = `
    SELECT g.*, 
      (SELECT COUNT(*)::int FROM favorites f WHERE f.game_id = g.id) as favorite_count,
      EXISTS(SELECT 1 FROM favorites f WHERE f.user_id = $1 AND f.game_id = g.id) as is_favorite
    FROM games g
    INNER JOIN favorites f ON g.id = f.game_id
    WHERE f.user_id = $1
    ORDER BY f.created_at DESC
  `;

  const result = await pool.query(query, [userId]);
  return {
    items: result.rows,
    pagination: null
  };
};

/**
 * ✅ Check if game is favorited
 */
exports.isFavorited = async (userId, gameId) => {
  const query = `
    SELECT EXISTS(
      SELECT 1 FROM favorites WHERE user_id = $1 AND game_id = $2
    ) as is_favorited
  `;

  const result = await pool.query(query, [userId, gameId]);
  return result.rows[0]?.is_favorited || false;
};

/**
 * ✅ Add to favorites (handles 409 conflict gracefully)
 */
exports.addFavorite = async (userId, gameId) => {
  const query = `
    INSERT INTO favorites (user_id, game_id)
    VALUES ($1, $2)
    ON CONFLICT (user_id, game_id) DO NOTHING
    RETURNING *
  `;

  const result = await pool.query(query, [userId, gameId]);
  
  if (result.rowCount === 0) {
    // Already exists - treat as success (idempotent)
    return { status: 409, message: "Already favorited" };
  }

  return {
    status: 201,
    is_favorite: true,
    favorite_id: result.rows[0].id
  };
};

/**
 * ✅ Remove from favorites (handles 404 gracefully)
 */
exports.removeFavorite = async (userId, gameId) => {
  const query = `
    DELETE FROM favorites
    WHERE user_id = $1 AND game_id = $2
    RETURNING id
  `;

  const result = await pool.query(query, [userId, gameId]);

  if (result.rowCount === 0) {
    // Not found - treat as success (idempotent)
    return { status: 200, message: "Not in favorites" };
  }

  return {
    status: 200,
    is_favorite: false
  };
};

/**
 * ✅ Get favorite count for game
 */
exports.getFavoriteCount = async (gameId) => {
  const query = `
    SELECT COUNT(*)::int as count FROM favorites WHERE game_id = $1
  `;

  const result = await pool.query(query, [gameId]);
  return result.rows[0]?.count || 0;
};

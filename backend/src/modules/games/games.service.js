// backend/src/modules/games/games.service.js
const pool = require("../../config/db");

exports.listGames = async ({
  search,
  provider,
  category,
  page = 1,
  limit = 12,
  userId,
}) => {
  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.min(Math.max(Number(limit), 5), 50);
  const offset = (pageNum - 1) * limitNum;

  const conditions = [];
  const values = [];

  if (search) {
    values.push(`%${search}%`);
    conditions.push(`name ILIKE $${values.length}`);
  }

  if (provider) {
    values.push(provider);
    conditions.push(`provider ILIKE $${values.length}`);
  }

  if (category) {
    values.push(category);
    conditions.push(`category = $${values.length}`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const countQuery = `
    SELECT COUNT(*)::int AS total
    FROM games
    ${whereClause}
  `;
  const countResult = await pool.query(countQuery, values);
  const total = Number(countResult.rows[0].total);

  values.push(limitNum, offset);
  const dataQuery = `
    SELECT id, name, provider, category, created_at
    FROM games
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT $${values.length - 1} OFFSET $${values.length}
  `;
  const result = await pool.query(dataQuery, values);

  return {
    items: result.rows,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum),
    },
  };
};

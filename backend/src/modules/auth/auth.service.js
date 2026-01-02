// backend/src/modules/auth/auth.service.js
const pool = require("../../config/db");
const { hashPassword, comparePassword } = require("../../utils/password");
const { signToken } = require("../../utils/jwt");

/**
 * Register new user
 */
exports.register = async ({ name, email, password }) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Check if email already exists
    const exists = await client.query(
      "SELECT id FROM users WHERE email = $1 FOR UPDATE",
      [email.toLowerCase()]
    );

    if (exists.rowCount > 0) {
      throw {
        status: 409,
        code: "EMAIL_EXISTS",
        message: "Email already registered",
      };
    }

    // Hash password using utils
    const passwordHash = await hashPassword(password);

    const result = await client.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at`,
      [name.trim(), email.toLowerCase(), passwordHash]
    );

    await client.query("COMMIT");

    return {
      id: result.rows[0].id,
      name: result.rows[0].name,
      email: result.rows[0].email,
      createdAt: result.rows[0].created_at,
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err.status
      ? err
      : {
          status: 500,
          code: "INTERNAL_ERROR",
          message: err.message || "Registration failed",
        };
  } finally {
    client.release();
  }
};

/**
 * Login user
 */
exports.login = async ({ email, password }) => {
  const result = await pool.query(
    "SELECT id, name, email, password_hash FROM users WHERE email = $1",
    [email.toLowerCase()]
  );

  if (result.rowCount === 0) {
    throw {
      status: 401,
      code: "INVALID_CREDENTIALS",
      message: "Invalid email or password",
    };
  }

  const user = result.rows[0];

  // Compare password using utils
  const isValid = await comparePassword(password, user.password_hash);
  if (!isValid) {
    throw {
      status: 401,
      code: "INVALID_CREDENTIALS",
      message: "Invalid email or password",
    };
  }

  // Generate JWT using utils
  const token = signToken({ userId: user.id });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
};

// backend/src/modules/auth/auth.service.js
const pool = require("../../config/db");
// Replace bcrypt/jwt calls with:
const { hashPassword, comparePassword } = require("../../utils/password");
const { signToken } = require("../../utils/jwt");
const env = require("../../config/env");

const SALT_ROUNDS = 12;

exports.register = async ({ name, email, password }) => {
  const client = await pool.connect();
  
  try {
    await client.query("BEGIN");

    // Atomic email check + insert
    const exists = await client.query(
      "SELECT id FROM users WHERE email = $1 FOR UPDATE",
      [email]
    );
    
    if (exists.rowCount > 0) {
      throw {
        status: 409,
        code: "EMAIL_EXISTS",
        message: "Email already registered",
      };
    }

    const hash = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await client.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at`,
      [name.trim(), email.toLowerCase(), hash]
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
    throw err.status ? err : {
      status: 500,
      code: "INTERNAL_ERROR",
      message: "Registration failed",
    };
  } finally {
    client.release();
  }
};

exports.login = async ({ email, password }) => {
  const result = await pool.query(
    "SELECT id, name, email, password_hash FROM users WHERE email = $1",
    [email.toLowerCase()]
  );

  if (result.rowCount === 0) {
    const err = {
      status: 401,
      code: "INVALID_CREDENTIALS",
      message: "Invalid email or password",
    };
    throw err;
  }

  const user = result.rows[0];
  const isValid = await bcrypt.compare(password, user.password_hash);
  
  if (!isValid) {
    const err = {
      status: 401,
      code: "INVALID_CREDENTIALS",
      message: "Invalid email or password",
    };
    throw err;
  }

  // High-performance JWT (minimal payload)
  const token = jwt.sign(
    { userId: user.id },           
    env.jwt.secret,
    { 
      expiresIn: env.jwt.expiresIn,
      algorithm: "HS256"            
    }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
};

// backend/src/config/env.js
require("dotenv").config();

/**
 * Environment configuration with validation
 * Loads .env and validates critical variables
 */
const required = ["JWT_SECRET", "DB_HOST", "DB_USER", "DB_NAME"];
required.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`❌ Missing required env var: ${key}`);
  }
});

const env = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",

  db: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || "",
    name: process.env.DB_NAME,
    maxConnections: Number(process.env.DB_MAX_CONNECTIONS) || 20,
    idleTimeout: Number(process.env.DB_IDLE_TIMEOUT) || 30000,
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  },

  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  },
};

console.log("✅ Environment loaded successfully");
console.log(`   Environment: ${env.nodeEnv}`);
console.log(`   DB Host: ${env.db.host}`);
console.log(`   Port: ${env.port}`);

module.exports = env;

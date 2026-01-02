// backend/src/config/db.js
const { Pool } = require("pg");
const env = require("./env");

/**
 * Production PostgreSQL connection pool for Casino Platform
 * Optimized for concurrent API requests + auto-recovery
 */
const pool = new Pool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.name,
  
  // Pool optimization (production defaults)
  max: env.db.maxConnections,                    // From env (default 20)
  idleTimeoutMillis: env.db.idleTimeout,         // 30s idle → recycle
  connectionTimeoutMillis: 2000,                 // 2s connect timeout
  allowExitOnIdle: false,                        // Don't exit on idle
  
  // Statement timeout (prevents hanging queries)
  statement_timeout: 30000,                      // 30s per query
  
  // SSL for production (optional)
  ssl: env.nodeEnv === "production" ? { rejectUnauthorized: false } : false,
});

// ========================================
// LIFECYCLE EVENTS (Production monitoring)
// ========================================
pool.on("connect", () => {
  console.log("✅ PostgreSQL: New connection established");
});

pool.on("acquire", (client) => {
  console.log("🔌 PostgreSQL: Client checked out from pool");
});

pool.on("remove", () => {
  console.log("🔄 PostgreSQL: Client removed from pool");
});

pool.on("error", (err, client) => {
  console.error("❌ PostgreSQL pool error:", err.message);
  console.log("💡 Pool will auto-recover - no restart needed");
  // Don't process.exit() - let pool recover automatically
});

// ========================================
// HEALTH CHECK (runs on startup)
// ========================================
const healthCheck = async () => {
  try {
    const result = await pool.query("SELECT 1 as healthy, version()");
    console.log("✅ Database healthy:", result.rows[0].version);
    console.log("📊 Pool stats:", {
      totalCount: pool.totalCount,
      idleCount: pool.idleCount,
      waitingCount: pool.waitingCount,
    });
  } catch (error) {
    console.error("❌ Database health check FAILED:", error.message);
    process.exit(1);
  }
};

healthCheck();

module.exports = pool;

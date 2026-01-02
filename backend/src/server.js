// backend/src/server.js
require("./config/env");  // Loads + validates env
const db = require("./config/db");  // Starts pool
const app = require("./app");
const env = require("./config/env");

const server = app.listen(env.port, () => {
  console.log(`🚀 Casino Platform API running`);
  console.log(`📍 http://localhost:${env.port}`);
  console.log(`🔐 Environment: ${env.nodeEnv}`);
});

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
process.on("SIGQUIT", gracefulShutdown);

async function gracefulShutdown(signal) {
  console.log(`🛑 ${signal} received. Closing connections...`);
  
  server.close(async () => {
    console.log("🔌 HTTP server closed");
    
    try {
      await db.end();
      console.log("✅ Database pool closed");
    } catch (err) {
      console.error("⚠️ DB close error:", err.message);
    }
    
    process.exit(0);
  });

  setTimeout(() => {
    console.error("💥 Force shutdown");
    process.exit(1);
  }, 10000);
}

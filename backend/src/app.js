// backend/src/app.js
const express = require("express");
const cors = require("cors");
const env = require("./config/env");

const routes = require("./routes");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

// ========================================
// Trust proxy (for prod behind load balancer)
// ========================================
app.set("trust proxy", env.nodeEnv === "production");

// ========================================
// Global middlewares
// ========================================
app.use(
  cors({
    origin: env.cors.origin,
    credentials: true,
  })
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// ========================================
// API Routes
// IMPORTANT: versioned API
// ========================================
app.use("/api/v1", routes);

// ========================================
// Global error handler (must be last)
// ========================================
app.use(errorMiddleware);

module.exports = app;

// backend/src/app.js
const express = require("express");
const cors = require("cors");
const env = require("./config/env");

const routes = require("./routes");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

// Security + performance
app.set("trust proxy", env.nodeEnv === "production");
app.use(cors({
  origin: env.cors.origin,
  credentials: true,
}));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", routes);
app.use(errorMiddleware);

module.exports = app;

// backend/src/middlewares/error.middleware.js
module.exports = (err, req, res, next) => {
  const status = err.status || 500;
  const code = err.code || "INTERNAL_ERROR";
  const message =
    err.message || "Something went wrong. Please try again later.";

  if (process.env.NODE_ENV !== "production") {
    console.error("❌ Error:", err);
  }

  res.status(status).json({
    success: false,
    error: {
      code,
      message,
    },
  });
};

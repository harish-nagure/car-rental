// Centralized error handler — keeps controllers tidy
module.exports = (err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
};

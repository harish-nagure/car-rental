// JWT auth middleware. Attach `protect` to any private route.
// Usage: router.get('/me', protect, handler) or protect('admin')
const jwt = require("jsonwebtoken");

// role: optional — "customer" or "admin" (client). If omitted, any logged-in user passes.
const protect = (role = null) => (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, username, role }

    if (role && decoded.role !== role) {
      return res.status(403).json({ message: "Forbidden — wrong role" });
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = { protect };

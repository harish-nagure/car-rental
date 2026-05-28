// MERN Car Rental — Express entry point
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static — serve uploaded car images from /uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth",      require("./routes/authRoutes"));
app.use("/api/cars",      require("./routes/carRoutes"));
app.use("/api/bookings",  require("./routes/bookingRoutes"));
app.use("/api/drivers",   require("./routes/driverRoutes"));
app.use("/api/feedback",  require("./routes/feedbackRoutes"));

// Health check
app.get("/", (req, res) => res.json({ message: "Car Rental API running" }));

// Error handler (must be last)
app.use(errorHandler);

// Start
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚗 Server running on http://localhost:${PORT}`));
});

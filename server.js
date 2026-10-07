// Entry point of the backend server.
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const foodRoutes = require("./routes/foodRoutes");

const app = express();

// Allow requests only from the React dev server
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/orders", orderRoutes);

// Unknown route
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// Last-resort error handler (e.g. invalid JSON body)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(400).json({ message: "Invalid request" });
});

const PORT = process.env.PORT || 5000;

// Check the database connection before starting to listen
pool
  .query("SELECT 1")
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
    console.error("Check your backend/.env file and make sure MySQL is running.");
    process.exit(1);
  });

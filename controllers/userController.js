const bcrypt = require("bcrypt");
const pool = require("../config/db");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9]{10}$/;
const SERVER_ERROR = "Something went wrong. Please try again later.";

// POST /api/users/register
exports.register = async (req, res) => {
  try {
    const { name, email, phone, address, password } = req.body;

    // --- Validation ---
    if (!name || !email || !phone || !address || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }
    if (!PHONE_REGEX.test(phone)) {
      return res.status(400).json({ message: "Phone number must be 10 digits" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // --- Email must be unique ---
    const cleanEmail = email.trim().toLowerCase();
    const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [cleanEmail]);
    if (existing.length > 0) {
      return res.status(409).json({ message: "This email is already registered" });
    }

    // --- Hash the password, then save the user ---
    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      "INSERT INTO users (name, email, phone, address, password) VALUES (?, ?, ?, ?, ?)",
      [name.trim(), cleanEmail, phone, address.trim(), hashed]
    );

    res.status(201).json({ message: "Registration successful! Please log in.", userId: result.insertId });
  } catch (err) {
    console.error(err);
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "This email is already registered" });
    }
    res.status(500).json({ message: SERVER_ERROR });
  }
};

// POST /api/users/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email.trim().toLowerCase()]);
    const user = rows[0];

    // Same message for unknown email and wrong password (do not reveal which one failed)
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Never send the password hash back
    const { password: _hash, ...safeUser } = user;
    res.json({ message: "Login successful", user: safeUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: SERVER_ERROR });
  }
};

// GET /api/users/:id  (a user can only read their own profile)
exports.getUser = async (req, res) => {
  try {
    if (Number(req.params.id) !== req.userId) {
      return res.status(403).json({ message: "You can only view your own profile" });
    }
    const [rows] = await pool.query(
      "SELECT id, name, email, phone, address, created_at FROM users WHERE id = ?",
      [req.userId]
    );
    if (rows.length === 0) return res.status(404).json({ message: "User not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: SERVER_ERROR });
  }
};

const pool = require("../config/db");
const SERVER_ERROR = "Something went wrong. Please try again later.";

// GET /api/foods
exports.getFoods = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM food_items ORDER BY id");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: SERVER_ERROR });
  }
};

// GET /api/foods/:id
exports.getFoodById = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM food_items WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "Food item not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: SERVER_ERROR });
  }
};

const pool = require("../config/db");
const SERVER_ERROR = "Something went wrong. Please try again later.";

// Shared query: order + food details. Callers always filter by user_id.
const ORDER_SELECT = `
  SELECT o.id, o.user_id, o.food_item_id, f.name AS food_name, f.price AS unit_price,
         o.quantity, o.total_price, o.delivery_address, o.order_status, o.order_date
  FROM orders o
  JOIN food_items f ON f.id = o.food_item_id`;

// Validate the fields shared by create and update.
// Returns { error } or { food, qty, address }.
async function validateOrderInput(body) {
  const { food_item_id, quantity, delivery_address } = body;
  const qty = Number(quantity);

  if (!food_item_id || !delivery_address || !String(delivery_address).trim()) {
    return { error: { code: 400, message: "Food item and delivery address are required" } };
  }
  if (!Number.isInteger(qty) || qty < 1 || qty > 20) {
    return { error: { code: 400, message: "Quantity must be a whole number between 1 and 20" } };
  }
  const [foods] = await pool.query("SELECT * FROM food_items WHERE id = ?", [food_item_id]);
  if (foods.length === 0) {
    return { error: { code: 404, message: "Food item not found" } };
  }
  return { food: foods[0], qty, address: String(delivery_address).trim() };
}

// POST /api/orders  (CREATE)
exports.createOrder = async (req, res) => {
  try {
    const v = await validateOrderInput(req.body);
    if (v.error) return res.status(v.error.code).json({ message: v.error.message });

    // Total is calculated on the server so it cannot be tampered with
    const total = (Number(v.food.price) * v.qty).toFixed(2);

    const [result] = await pool.query(
      "INSERT INTO orders (user_id, food_item_id, quantity, total_price, delivery_address) VALUES (?, ?, ?, ?, ?)",
      [req.userId, v.food.id, v.qty, total, v.address]
    );
    res.status(201).json({ message: "Order placed successfully!", orderId: result.insertId });
  } catch (err) {
    console.error(err);
    // Foreign key error = the logged-in user id does not exist
    if (err.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(401).json({ message: "Please log in again" });
    }
    res.status(500).json({ message: SERVER_ERROR });
  }
};

// GET /api/orders/user/:userId  (READ - all orders of one user)
exports.getUserOrders = async (req, res) => {
  try {
    if (Number(req.params.userId) !== req.userId) {
      return res.status(403).json({ message: "You can only view your own orders" });
    }
    const [rows] = await pool.query(
      `${ORDER_SELECT} WHERE o.user_id = ? ORDER BY o.order_date DESC, o.id DESC`,
      [req.userId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: SERVER_ERROR });
  }
};

// GET /api/orders/:id  (READ - one order)
exports.getOrderById = async (req, res) => {
  try {
    const [rows] = await pool.query(`${ORDER_SELECT} WHERE o.id = ? AND o.user_id = ?`, [
      req.params.id,
      req.userId,
    ]);
    if (rows.length === 0) return res.status(404).json({ message: "Order not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: SERVER_ERROR });
  }
};

// PUT /api/orders/:id  (UPDATE)
exports.updateOrder = async (req, res) => {
  try {
    // The order must exist AND belong to the logged-in user
    const [existing] = await pool.query("SELECT id FROM orders WHERE id = ? AND user_id = ?", [
      req.params.id,
      req.userId,
    ]);
    if (existing.length === 0) return res.status(404).json({ message: "Order not found" });

    const v = await validateOrderInput(req.body);
    if (v.error) return res.status(v.error.code).json({ message: v.error.message });

    const total = (Number(v.food.price) * v.qty).toFixed(2);

    await pool.query(
      "UPDATE orders SET food_item_id = ?, quantity = ?, total_price = ?, delivery_address = ? WHERE id = ? AND user_id = ?",
      [v.food.id, v.qty, total, v.address, req.params.id, req.userId]
    );
    res.json({ message: "Order updated successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: SERVER_ERROR });
  }
};

// DELETE /api/orders/:id  (DELETE)
exports.deleteOrder = async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM orders WHERE id = ? AND user_id = ?", [
      req.params.id,
      req.userId,
    ]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order cancelled successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: SERVER_ERROR });
  }
};

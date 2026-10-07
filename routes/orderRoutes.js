const express = require("express");
const router = express.Router();
const requireUser = require("../middleware/requireUser");
const {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");

// All order routes need a logged-in user
router.use(requireUser);

router.post("/", createOrder);
router.get("/user/:userId", getUserOrders);
router.get("/:id", getOrderById);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);

module.exports = router;

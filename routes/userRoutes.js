const express = require("express");
const router = express.Router();
const requireUser = require("../middleware/requireUser");
const { register, login, getUser } = require("../controllers/userController");

router.post("/register", register);
router.post("/login", login);
router.get("/:id", requireUser, getUser);

module.exports = router;

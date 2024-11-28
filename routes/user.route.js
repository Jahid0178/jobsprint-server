const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/user.controller");
const assignRole = require("../middlewares/assignRole");

router.post("/register", assignRole, registerUser);
router.post("/login", loginUser);

module.exports = router;

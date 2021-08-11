const express = require("express");
const { showMessage, registerUser } = require("../controllers/authController");

const router = express.Router();

router.get("/:message", showMessage);
router.post("/register", registerUser);

module.exports = router;

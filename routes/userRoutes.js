const express = require("express");
const { body } = require("express-validator");
const {
	isLoggedIn,
	showMessage,
	registerUser,
	loginUser,
} = require("../controllers/userController");
const { ERROR_EMPTY } = require("../utils/labels");

const router = express.Router();

const validationRegisterRules = [
	body("name").trim().notEmpty().withMessage(ERROR_EMPTY),
	body("email")
		.trim()
		.notEmpty()
		.withMessage(ERROR_EMPTY)
		.isEmail()
		.withMessage("Email must be valid"),
	body("password")
		.trim()
		.notEmpty()
		.withMessage(ERROR_EMPTY)
		.isLength({ min: 6, max: 16 }),
];

const validationLoginRules = [
	body("email").trim().notEmpty().withMessage(ERROR_EMPTY),
	body("password").trim().notEmpty().withMessage(ERROR_EMPTY),
];

router.get("/:message", isLoggedIn, showMessage);
router.post("/register", validationRegisterRules, registerUser);
router.post("/login", validationLoginRules, loginUser);

module.exports = router;

const express = require("express");
const { body } = require("express-validator");
const {
	showMessage,
	registerUser,
	loginUser,
	userInfo,
	isLoggedIn,
	logoutUser,
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

router.post("/register", validationRegisterRules, registerUser);
router.post("/login", validationLoginRules, loginUser);
router.get("/logout", logoutUser);

// Middleware checking logged user
router.use(isLoggedIn);

router.get("/user", userInfo);
router.get("/:message", showMessage);

module.exports = router;

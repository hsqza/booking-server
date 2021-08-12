const express = require("express");
const { body } = require("express-validator");
const { showMessage, registerUser } = require("../controllers/userController");
const { ERROR_EMPTY } = require("../utils/labels");

const router = express.Router();

router.get("/:message", showMessage);
router.post(
	"/register",
	[
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
	],
	registerUser
);

module.exports = router;

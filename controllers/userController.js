// @ts-nocheck
const { validationResult } = require("express-validator");
const { mappingErrorMessages } = require("../utils/functions");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("../models/userModel");

exports.isLoggedIn = async (req, res, next) => {
	if (req.cookies.jwt) {
		// 1) Verify token
		let decoded = null;

		try {
			decoded = await promisify(jwt.verify)(
				req.cookies.jwt,
				process.env.JWT_SECRET
			);
		} catch (error) {
			return res.status(401).json();
		}

		try {
			const currentUser = await User.findById(decoded.id);
			req.user = currentUser;
			return next();
		} catch (error) {
			return res.status(401).json();
		}
	}
	return res.status(401).json();
};

exports.userInfo = (req, res) => {
	if (!req.user) {
		return res.status(401).json();
	}
	return res.status(200).json({ user: req.user });
};

exports.showMessage = (req, res) => {
	return res.status(200).json({ user: req.user });
};

const signToken = (id) =>
	jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});

const createSendToken = (user, statusCode, req, res) => {
	const token = signToken(user._id);

	const cookieOptions = {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 1000
		),
		httpOnly: true,
	};

	if (process.env.NODE_ENV === "production") {
		cookieOptions.secure =
			req.secure || req.headers["x-forwarded-proto"] === "https";
	}

	res.cookie("jwt", token, cookieOptions);

	// Remove password from the output
	user.password = undefined;

	return res.status(statusCode).json({
		token,
		user,
	});
};

exports.registerUser = async (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({
			error: mappingErrorMessages(errors.array()),
		});
	}

	const userExist = await User.findOne({ email: req.body.email });

	if (userExist)
		return res
			.status(400)
			.json({ error: "The email address provided is already in use" });

	const user = new User({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
	});

	try {
		await user.save();
	} catch (error) {
		return res
			.status(400)
			.json({ error: "Something went wrong, please try again in a moment" });
	}

	createSendToken(user, 201, req, res);
};

exports.loginUser = async (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({
			error: mappingErrorMessages(errors.array()),
		});
	}

	const user = await User.findOne({ email: req.body.email }).select(
		"+password"
	);

	if (
		!user ||
		!(await user.correctPassword(req.body.password, user.password))
	) {
		return res.status(400).json({ error: "Invalid credentials" });
	}

	createSendToken(user, 200, req, res);
};

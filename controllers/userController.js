// @ts-nocheck
const { validationResult } = require("express-validator");
const { mappingErrorMessages } = require("../utils/functions");
const User = require("../models/userModel");

exports.showMessage = (req, res) => {
	res.status(200).send(req.params.message);
};

exports.registerUser = async (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({
			msg: mappingErrorMessages(errors.array()),
		});
	}

	const userExist = await User.findOne({ email: req.body.email });

	if (userExist)
		return res
			.status(400)
			.json({ msg: "The email address provided is already in use" });

	const user = new User(req.body);

	try {
		await user.save();
	} catch (error) {
		return res
			.status(400)
			.json({ msg: "Something went wrong, please try again in a moment" });
	}

	return res.status(201).json({ msg: `User "${req.body.name}" created` });
};

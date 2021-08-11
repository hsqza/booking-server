import { Schema } from "mongoose";

const mongoose = require("mongoose");

const userSchema = new Schema(
	{
		name: {
			type: String,
			trim: true,
			required: [true, "Name is required"],
		},
		email: {
			type: String,
			trim: true,
			required: [true, "Email is required"],
			unique: true,
		},
		password: {
			type: String,
			required: [true, "Password is required"],
			min: 6,
			max: 64,
		},
		stripe_account_id: "",
		stripe_seller: {},
		stripeSession: {},
	},
	{ timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;

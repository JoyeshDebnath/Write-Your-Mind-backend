const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
//create schema
const userSchema = new mongoose.Schema(
	{
		firstName: {
			required: [true, "first name is required"],
			type: String,
		},
		lastName: {
			required: [true, "last name is required"],
			type: String,
		},
		profilePhoto: {
			type: String,
			default:
				"https://cdn.pixabay.com/photo/2020/10/11/19/51/cat-5646889_1280.jpg",
		},
		email: {
			type: String,
			required: [true, "email is required "],
		},
		bio: {
			type: String,
		},
		password: {
			type: String,
			required: [true, "password is required "],
		},
		postCount: {
			type: Number,
			default: 0,
		},
		isBlocked: {
			type: Boolean,
			default: false,
		},
		isAdmin: {
			type: Boolean,
			default: false,
		},
		role: {
			type: String,
			enum: ["Admin", "Guest", "Blogger"],
		},
		isFollowing: {
			type: Boolean,
			default: false,
		},
		isUnFollowing: {
			type: Boolean,
			default: false,
		},
		isAccountVerified: {
			type: Boolean,
			default: false,
		},
		accountVerificationToken: String,
		accountVerificationTokenExpires: {
			type: Date,
		},
		viewedBy: {
			type: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
				},
			],
		},
		followers: {
			type: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
				},
			],
		},
		following: {
			type: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
				},
			],
		},
		passwordChangeAt: Date,
		passwordResetToken: String,
		passwordResetExpires: Date,

		active: {
			type: Boolean,
			default: false,
		},
	},
	{
		toJSON: {
			virtuals: true,
		},
		toObject: {
			virtuals: true,
		},
		timestamps: true,
	}
);
//hash password
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		next();
	}
	//hash password
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

//verify account
userSchema.methods.createAccountVerificationToken = async function (next) {
	//create a token
	const verificationToken = crypto.randomBytes(32).toString("hex");
	this.accountVerificationToken = crypto
		.createHash("sha256")
		.update(verificationToken)
		.digest("hex");

	//expire
	this.accountVerificationTokenExpires = Date.now() + 30 * 60 * 1000; //10 mins

	return verificationToken; //send raw token to front end
};

//reset Password
userSchema.methods.createPasswordResetToken = async function () {
	//creating a reset password  token
	const resetPasswordToken = crypto.randomBytes(32).toString("hex");
	//hash the token and update in the reset field in db
	this.passwordResetToken = crypto
		.createHash("sha256")
		.update(resetPasswordToken)
		.digest("hex");
	//set the reset password expiration field in db
	this.passwordResetExpires = Date.now() + 30 * 60 * 1000; //10 mins from now

	return resetPasswordToken; //raw token to front end to generate url and rehash
};
//match password
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
	// next();
};
//compile Schema into model

const User = mongoose.model("User", userSchema);
module.exports = User;

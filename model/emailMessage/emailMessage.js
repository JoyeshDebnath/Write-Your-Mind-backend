const mongoose = require("mongoose");

const emailMessageSchema = new mongoose.Schema(
	{
		fromEmail: {
			type: String,
			required: [true, "Email is required !"],
		},
		toEmail: {
			type: String,
			required: [true, "Email is required !"],
		},
		message: {
			type: String,
			required: [true, "message required !"],
		},
		subject: {
			type: String,
			required: true,
		},
		sentBy: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
		isFlagged: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

const EmailMessage = mongoose.model("Message", emailMessageSchema);
module.exports = EmailMessage;

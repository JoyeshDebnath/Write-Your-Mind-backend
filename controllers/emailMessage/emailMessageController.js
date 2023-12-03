const EmailMessage = require("../../model/emailMessage/emailMessage");
const expressAsyncHandler = require("express-async-handler");
const validateMongodbId = require("../../utils/validateMongodbID");
const sgMail = require("@sendgrid/mail");

//--------------------------------------------------------------------------
//send Emails message
//-------------------------------------------------------------------------
const sendEmailMessageController = expressAsyncHandler(async (req, res) => {
	const { to, subject, message } = req?.body;
	try {
		// set up message
		const msg = {
			to,
			subject,
			content: [
				{
					type: "text/plain",
					value: message,
				},
			],
			from: "itsmejoyeshdebnath26@gmail.com",
		};
		//send message
		await sgMail.send(msg);
		//save the message to db
		await EmailMessage.create({
			sentBy: req.user._id,
			fromEmail: req.user.email,
			toEmail: to,
			subject,
			message,
		});
		// await EmailMessage.save();
		// console.log(req.user);
		res.json("email message sent ");
	} catch (err) {
		res.json(err);
	}
});

module.exports = {
	sendEmailMessageController,
};

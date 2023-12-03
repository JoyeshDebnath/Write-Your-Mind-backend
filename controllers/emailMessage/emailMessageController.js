const EmailMessage = require("../../model/emailMessage/emailMessage");
const expressAsyncHandler = require("express-async-handler");
const validateMongodbId = require("../../utils/validateMongodbID");
const sgMail = require("@sendgrid/mail");
const SlangFilter = require("bad-words");
//--------------------------------------------------------------------------
//send Emails message
//-------------------------------------------------------------------------
const sendEmailMessageController = expressAsyncHandler(async (req, res) => {
	const { to, subject, message } = req?.body;
	//check for bad words in subject and email body
	let emailMessage = subject + " " + message;
	filter = new SlangFilter();
	const isSlang = filter.isProfane(emailMessage);
	if (isSlang) {
		throw new Error(
			"Email Contains Slangs ! Sending Email Failed ! Please Check your email"
		);
	}

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

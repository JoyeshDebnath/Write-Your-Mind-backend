const expressAsyncHandler = require("express-async-handler");
const User = require("../../model/user/User");
const generateToken = require("../../config/token/generateToken");
const validateMongodbId = require("../../utils/validateMongodbID");
const sgMail = require("@sendgrid/mail");
const crypto = require("crypto");
const cloudinaryUploadImage = require("../../utils/cloudinary");

//configuration  of send grid
sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

//--------------------------------------------------------------------
//Register
//--------------------------------------------------------------------

const userRegisterController = expressAsyncHandler(async (req, res) => {
	//check if the user exists before registering
	const userExists = await User.findOne({
		email: req?.body?.email,
	});
	if (userExists) {
		throw new Error("User Already Exists");
	}

	try {
		const user = await User.create({
			firstName: req?.body?.firstName,
			lastName: req?.body?.lastName,
			email: req?.body?.email,
			password: req?.body?.password,
		});
		res.json(user);
	} catch (err) {
		res.json(err);
	}
});
//---------------------------------------------------------------------
//Login
//--------------------------------------------------------------------
const userLoginController = expressAsyncHandler(async (req, res) => {
	const { email, password } = req.body;
	//check if the username and password exists
	const user = await User.findOne({
		email,
	});
	//check if the password matches the
	if (user && (await user.isPasswordMatched(password))) {
		const loginResponse = {
			_id: user?._id,
			firstName: user?.firstName,
			lastName: user?.lastName,
			email: user?.email,
			profilePhoto: user?.profilePhoto,
			isAdmin: user?.isAdmin,
			token: generateToken(user?._id),
		};

		res.json(loginResponse);
	} else {
		res.status(401);
		throw new Error(`Invalid Login Credentials!`);
	}
});

//-------------------------------------------------------------------------------
//Fetch all users
//------------------------------------------------------------------------------
const getAllUsersController = expressAsyncHandler(async (req, res) => {
	try {
		const users = await User.find({});

		res.json(users);
	} catch (err) {
		res.json(err);
	}
});
//-----------------------------------------------------------------
//delete
//------------------------------------------------------------------
const deleteUsersController = expressAsyncHandler(async (req, res) => {
	const { id } = req.params; //id of the user whom we want to delete ..
	validateMongodbId(id); //check if the id is valid or not
	try {
		const user = await User.findOneAndDelete({ _id: id });
		res.json(user);
	} catch (err) {
		res.json(err);
	}
});

//------------------------------------------------------------------------------------
//get a single user
//-----------------------------------------------------------------------------------
const getUserDetailsController = expressAsyncHandler(async (req, res) => {
	const { id } = req.params;
	validateMongodbId(id);
	try {
		const user = await User.findOne({
			_id: id,
		});
		res.json(user);
	} catch (err) {
		res.json(err);
	}
});

//---------------------------------------------------------------------------------------------------
//User Profile Controller
//---------------------------------------------------------------------------------------------------
const userProfileController = expressAsyncHandler(async (req, res) => {
	const { id } = req.params;
	validateMongodbId(id);
	try {
		const myProfile = await User.findById({
			_id: id,
		});
		res.json(myProfile);
	} catch (err) {}
});

//------------------------------------------------------------------------------------------------------
//update profile
//------------------------------------------------------------------------------------------------------
const updateUserController = expressAsyncHandler(async (req, res) => {
	const { _id } = req?.user;
	// console.log(_id);
	validateMongodbId(_id);

	const user = await User.findByIdAndUpdate(
		{
			_id: _id,
		},
		{
			firstName: req?.body?.firstName,
			lastName: req?.body?.lastName,
			email: req?.body?.email,
			bio: req?.body?.bio,
		},
		{
			new: true,
			runValidators: true,
		}
	);
	res.json(user);
});
//------------------------------------------------------------------------------------
//Update Password
//--------------------------------------------------------------------------------------
const updatePasswordController = expressAsyncHandler(async (req, res) => {
	//de-structure the logged in user ...
	const { _id } = req?.user;
	const { password } = req?.body;
	validateMongodbId(_id);

	const user = await User.findById(_id);

	if (password) {
		user.password = password;
		const updatedUser = await user.save(); //save to db
		res.json(updatedUser);
	}

	res.json(user);
});

//--------------------------------------------------------------------------------------------------------
//Following
//-------------------------------------------------------------------------------------------------------
const followingUserController = expressAsyncHandler(async (req, res) => {
	//find the user that i  want to follow and update its followers list
	const { followId } = req?.body;
	const loginUserId = req.user.id; //getting from auth middleware
	const targetUser = await User.findById(followId);
	const alreadyFollowing = targetUser?.followers?.find(
		(user) => user?.toString() === loginUserId.toString()
	);
	if (alreadyFollowing) {
		throw new Error("You have already followed this user !");
	}

	//step1
	await User.findByIdAndUpdate(
		followId,
		{
			$push: { followers: loginUserId },
			isFollowing: true,
		},
		{
			new: true,
		}
	);

	//step2
	await User.findByIdAndUpdate(
		loginUserId,
		{
			$push: { following: followId },
		},
		{ new: true }
	);
	res.json("you have successfully followed this user !");
	//update the following list of mine
});

//----------------------------------------------------------------------------------------
//Un follow users
//------------------------------------------------------------------------------------------

const unfollowUserController = expressAsyncHandler(async (req, res) => {
	const { unfollowId } = req?.body;
	const loginUserId = req.user.id;
	const targetUser = await User.findById(unfollowId);

	await User.findByIdAndUpdate(
		unfollowId,
		{
			$pull: { followers: loginUserId },
			isFollowing: false,
		},
		{
			new: true,
		}
	);

	await User.findByIdAndUpdate(
		loginUserId,
		{
			$pull: { following: unfollowId },
		},
		{ new: true }
	);

	res.json("You have successfully unfollowed this user");
});

//-------------------------------------------------------------------------------------------
//Blocking User
//------------------------------------------------------------------------------------------

const blockUserController = expressAsyncHandler(async (req, res) => {
	const { id } = req.params;
	validateMongodbId(id);
	const user = await User.findByIdAndUpdate(
		{
			_id: id,
		},
		{
			isBlocked: true,
		},
		{
			new: true,
		}
	);

	res.json(user);
});

//----------------------------------------------------------------------------------------------
//unblock user
//-----------------------------------------------------------------------------------------------
const unblockUserController = expressAsyncHandler(async (req, res) => {
	const { id } = req?.params;
	const user = await User.findByIdAndUpdate(
		{
			_id: id,
		},
		{
			isBlocked: false,
		},
		{ new: true }
	);

	res.json(user);
});

// ----------------------------------------------------------------------------------------------------
//generate email verification token
//-----------------------------------------------------------------------------------------------------
const generateVerificationTokenController = expressAsyncHandler(
	async (req, res) => {
		//get the user logged in
		const loginUser = req.user.id;
		// console.log("Logged in User:", loginUser);
		const user = await User.findById(loginUser);
		// console.log("User details", user);

		try {
			//generate a token
			const verificationToken = await user.createAccountVerificationToken(); //returns a promise so i have used await here to handle the promise
			//save the user
			await user.save();
			// console.log(verificationToken);
			//build your message
			//reset url
			const resetUrl = `If You were requested to verify your account , verify now within 10 mins , otherwise ignore this message and
							<a href="https://localhost:3000/verify-account/${verificationToken}">Click To verify</a>`;
			const msg = {
				to: "joyeshdebnath52@gmail.com",
				from: "itsmejoyeshdebnath26@gmail.com",
				subject: "Verify Your Account!!",
				html: resetUrl,
			};
			await sgMail.send(msg);
			res.json(resetUrl);
		} catch (err) {
			res.json(err);
		}
	}
);

//---------------------------------------------------------------------------------------------------------------------------------
//Account Verification
//---------------------------------------------------------------------------------------------------------------------------------
const accountVerificationController = expressAsyncHandler(async (req, res) => {
	const { token } = req.body;
	//get the haSHED token
	const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

	//find user by token
	const userFound = await User.findOne({
		accountVerificationToken: hashedToken,
		accountVerificationTokenExpires: { $gt: new Date() },
	}); //find the user whose expires session is more than current time ie current time is within the range
	if (!userFound) {
		throw new Error("Token expired, try again later !");
	}
	//1>update the isVerified property to true
	userFound.isAccountVerified = true;
	//2>reset the token to empty from account verification token
	userFound.accountVerificationToken = undefined;
	//3>reset the account verification token expire date to undefined ..
	userFound.accountVerificationTokenExpires = undefined;
	await userFound.save(); //save the updates to db
	res.json(userFound);
	// const user = await User.findOne({});
});

//-------------------------------------------------------------------------------------------------------------------------------
//Forget Password Token generator
//------------------------------------------------------------------------------------------------------------------------------
const forgetPasswordTokenController = expressAsyncHandler(async (req, res) => {
	const { email } = req.body;
	//find by email
	const user = await User.findOne({
		email: email,
	});
	if (!user) {
		throw new Error(`User Not  Found!`);
	}
	try {
		const resetPasswordToken = await user.createPasswordResetToken();
		await user.save();
		// console.log(resetPasswordToken);
		//send reset message in mail
		const resetPasswordUrl = `If You have requested to reset your password , use the link to reset password within 10 mins , otherwise ignore this message .
							<a href="https://localhost:3000/forgot-password/${resetPasswordToken}">Click To Reset Password 🚀</a>`;
		const msg = {
			to: email,
			from: "itsmejoyeshdebnath26@gmail.com",
			subject: "Reset Your Password!",
			html: resetPasswordUrl,
		};
		const emailMsg = await sgMail.send(msg);

		res.json(
			`A verification message has been sent to the user at ${user?.email}. Reset now within 10 minutes .. ${resetPasswordUrl}`
		);
	} catch (err) {
		res.json(err);
	}
});

//-------------------------------------------------------------------
//password reset
//--------------------------------------------------------------------------
const passwordResetController = expressAsyncHandler(async (req, res) => {
	const { token, password } = req?.body;
	//hash the token passed
	const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
	//find the user by this token
	const user = await User.findOne({
		passwordResetToken: hashedToken,
		passwordResetExpires: { $gt: new Date() },
	});

	if (!user) {
		throw new Error(`Token Expired , Try Again`);
	}
	//update the password field of the user
	user.password = password;
	user.passwordResetToken = undefined;
	user.passwordResetExpires = undefined;
	await user.save();

	res.json(user);
});

//-----------------------------------------------------------------------------------------
//Profile Pic upload
//-----------------------------------------------------------------------------------------
const profilePhotoUploadController = expressAsyncHandler(async (req, res) => {
	//find the user logged in
	const user = req.user;
	const { _id } = user;

	// console.log("Logged in user:", user);
	//1> get the path of image
	const localPath = `public/images/profile/${req.file.fileName}`;
	//2>Upload to cloudinary
	const imgUploaded = await cloudinaryUploadImage(localPath);
	// console.log(imgUploaded);
	const foundUser = await User.findByIdAndUpdate(
		_id,
		{
			profilePhoto: imgUploaded.url,
		},
		{ new: true }
	);

	res.json(foundUser);
});

module.exports = {
	userRegisterController,
	userLoginController,
	getAllUsersController,
	deleteUsersController,
	getUserDetailsController,
	userProfileController,
	updateUserController,
	updatePasswordController,
	followingUserController,
	unfollowUserController,
	blockUserController,
	unblockUserController,
	generateVerificationTokenController,
	accountVerificationController,
	forgetPasswordTokenController,
	passwordResetController,
	profilePhotoUploadController,
};

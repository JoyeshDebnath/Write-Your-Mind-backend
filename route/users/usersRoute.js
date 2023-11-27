const express = require("express");
const authMiddleware = require("../../middlewares/auth/authMiddleware");
const {
	profilePhotoUpload,
	profilePhotoResize,
} = require("../../middlewares/uploads/profilePhotoUpload"); //middleware for the profile photo upload

const {
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
} = require("../../controllers/users/usersController");

const userRoutes = express("router");

userRoutes.post("/register", userRegisterController);
userRoutes.post("/login", userLoginController);
userRoutes.get("/", authMiddleware, getAllUsersController);
userRoutes.put("/follow", authMiddleware, followingUserController); //following other user ..
userRoutes.post(
	"/generate-verify-email-token",
	authMiddleware,
	generateVerificationTokenController
); //generate account verification token and update the account verification token ....
userRoutes.put(
	"/verify-account",
	authMiddleware,
	accountVerificationController
); //get account verification token
userRoutes.post(
	"/forget-password-token",
	authMiddleware,
	forgetPasswordTokenController
); //forget password token generate
userRoutes.put(
	"/profilephoto-upload",
	authMiddleware,
	profilePhotoUpload.single("image"),
	profilePhotoResize,
	profilePhotoUploadController
); //upload profile photo
userRoutes.put("/reset-password", authMiddleware, passwordResetController); //reset password /update password field
userRoutes.put("/unfollow", authMiddleware, unfollowUserController); //unfollow user
userRoutes.put("/block-user/:id", authMiddleware, blockUserController); //blocking user
userRoutes.put("/unblock-user/:id", authMiddleware, unblockUserController); //un block user
userRoutes.get("/profile/:id", authMiddleware, userProfileController); //this is authorized ..
userRoutes.put("/password", authMiddleware, updatePasswordController); //password update
userRoutes.delete("/:id", deleteUsersController); //delete user
userRoutes.put("/:id", authMiddleware, updateUserController); //update user
userRoutes.get("/:id", getUserDetailsController);

module.exports = userRoutes;

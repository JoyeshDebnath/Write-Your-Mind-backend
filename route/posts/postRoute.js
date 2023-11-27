const express = require("express");
const authMiddleware = require("../../middlewares/auth/authMiddleware");
const {
	photoUpload,
	postImageResize,
} = require("../../middlewares/uploads/photoUpload");
const {
	createPostController,
} = require("../../controllers/posts/postController");

const postRoute = express.Router();

postRoute.post(
	"/",
	authMiddleware,
	photoUpload.single("image"),
	postImageResize,
	createPostController
); //create a post
module.exports = postRoute;

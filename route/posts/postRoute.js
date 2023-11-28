const express = require("express");
const authMiddleware = require("../../middlewares/auth/authMiddleware");
const {
	photoUpload,
	postImageResize,
} = require("../../middlewares/uploads/photoUpload");
const {
	createPostController,
	fetchAllPostsController,
} = require("../../controllers/posts/postController");

const postRoute = express.Router();

postRoute.post(
	"/",
	authMiddleware,
	photoUpload.single("image"),
	postImageResize,
	createPostController
); //create a post
postRoute.get("/", fetchAllPostsController); //fetch all posts
module.exports = postRoute;

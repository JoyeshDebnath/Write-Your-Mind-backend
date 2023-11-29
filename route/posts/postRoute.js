const express = require("express");
const authMiddleware = require("../../middlewares/auth/authMiddleware");
const {
	photoUpload,
	postImageResize,
} = require("../../middlewares/uploads/photoUpload");
const {
	createPostController,
	fetchAllPostsController,
	fetchPostController,
	updatePostController,
	deletePostController,
	likePostController,
	dislikePostController,
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
postRoute.put("/likes", authMiddleware, likePostController); //like a post
postRoute.put("/dislikes", authMiddleware, dislikePostController); //like a post
postRoute.get("/:id", fetchPostController); //fetch a single post .
postRoute.put("/:id", authMiddleware, updatePostController); //update a post ..
postRoute.delete("/:id", authMiddleware, deletePostController); //delete a post

module.exports = postRoute;

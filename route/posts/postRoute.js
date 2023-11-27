const express = require("express");
const authMiddleware = require("../../middlewares/auth/authMiddleware");

const {
	createPostController,
} = require("../../controllers/posts/postController");

const postRoute = express.Router();

postRoute.post("/", authMiddleware, createPostController); //create a post
module.exports = postRoute;

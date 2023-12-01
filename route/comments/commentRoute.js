const express = require("express");
const authMiddleware = require("../../middlewares/auth/authMiddleware");
const {
	createCommentController,
	fetchAllCommentsController,
	fetchSingleCommentController,
} = require("../../controllers/comments/commentController");
const commentRoute = express.Router();

commentRoute.post("/", authMiddleware, createCommentController); //create a comment
commentRoute.get("/", authMiddleware, fetchAllCommentsController); //get all comments
commentRoute.get("/:id", authMiddleware, fetchSingleCommentController); //get a single comment
module.exports = commentRoute;

const express = require("express");
const authMiddleware = require("../../middlewares/auth/authMiddleware");
const {
	createCommentController,
	fetchAllCommentsController,
	fetchSingleCommentController,
	updateCommentController,
} = require("../../controllers/comments/commentController");
const commentRoute = express.Router();

commentRoute.post("/", authMiddleware, createCommentController); //create a comment
commentRoute.get("/", authMiddleware, fetchAllCommentsController); //get all comments
commentRoute.get("/:id", authMiddleware, fetchSingleCommentController); //get a single comment
commentRoute.put("/:id", authMiddleware, updateCommentController); //update a comment
// commmentRoute.delete("/:id",authMiddleware, ); //delete a comment
module.exports = commentRoute;

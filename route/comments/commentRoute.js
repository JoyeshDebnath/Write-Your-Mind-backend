const express = require("express");
const authMiddleware = require("../../middlewares/auth/authMiddleware");
const {
	createCommentController,
} = require("../../controllers/comments/commentController");
const commentRoute = express.Router();

commentRoute.post("/", authMiddleware, createCommentController);

module.exports = commentRoute;

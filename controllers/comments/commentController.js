const expressAsyncHandler = require("express-async-handler");
const Comment = require("../../model/comment/Comment");

const createCommentController = expressAsyncHandler(async (req, res) => {
	res.json("create a new Comment ");
});

module.exports = { createCommentController };

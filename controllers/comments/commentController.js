const expressAsyncHandler = require("express-async-handler");
const Comment = require("../../model/comment/Comment");

const createCommentController = expressAsyncHandler(async (req, res) => {
	//get the id of the post
	const { postId, description } = req.body;
	//get the user
	const user = req.user;
	try {
		const comment = await Comment.create({
			post: postId,
			user: user,
			description: description,
		});

		res.json(comment);
	} catch (err) {
		res.json(err);
	}
});

module.exports = { createCommentController };

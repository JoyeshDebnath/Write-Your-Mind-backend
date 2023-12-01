const expressAsyncHandler = require("express-async-handler");
const Comment = require("../../model/comment/Comment");
//-------------------------------------------------------------
//create a comment
//--------------------------------------------------------------

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

//--------------------------------------------------------------------------------
//fetch all comments
//--------------------------------------------------------------------------------
const fetchAllCommentsController = expressAsyncHandler(async (req, res) => {
	try {
		const comments = await Comment.find({}).sort("-created");
		res.json(comments);
	} catch (err) {
		res.json(err);
	}
});

//-------------------------------------------------------------------------------------
//fetch  a single comment
//-------------------------------------------------------------------------------------
const fetchSingleCommentController = expressAsyncHandler(async (req, res) => {
	const { id } = req?.params; //comment id
	try {
		const comment = await Comment.findById(id);
		res.json(comment);
	} catch (err) {
		res.json(err);
	}
});

module.exports = {
	createCommentController,
	fetchAllCommentsController,
	fetchSingleCommentController,
};

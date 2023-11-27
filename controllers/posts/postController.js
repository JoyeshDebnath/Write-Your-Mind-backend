const Post = require("../../model/post/Post");
const expressAsyncHandler = require("express-async-handler");
const validateMongodbId = require("../../utils/validateMongodbID");
//------------------------------------------------------------------------------
//Create a post
//-----------------------------------------------------------------------------
const createPostController = expressAsyncHandler(async (req, res) => {
	//take the user id from request object

	validateMongodbId(req.body.user);
	try {
		const post = await Post.create(req?.body);
		res.json(post);
	} catch (err) {
		res.json(err);
	}
});

module.exports = {
	createPostController,
};

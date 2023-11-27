const Post = require("../../model/post/Post");
const User = require("../../model/user/User");
const expressAsyncHandler = require("express-async-handler");
const validateMongodbId = require("../../utils/validateMongodbID");
const SlangFilter = require("bad-words");
//------------------------------------------------------------------------------
//Create a post
//-----------------------------------------------------------------------------
const createPostController = expressAsyncHandler(async (req, res) => {
	const { _id } = req.user; //logged in user
	//1>check for the valid user using id
	validateMongodbId(req.body.user);
	//2>check for the slangs .
	const filter = new SlangFilter(); //create an instance
	const isSlang = filter.isProfane(req.body.title, req.body.description); //

	if (isSlang) {
		//block user
		const user = await User.findByIdAndUpdate(_id, {
			isBlocked: true,
		}); //find the logged in user in db
		throw new Error(
			`Creating Failed because your post contains Slangs!!!You have been blocked !`
		);
	}

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

const Post = require("../../model/post/Post");
const User = require("../../model/user/User");
const expressAsyncHandler = require("express-async-handler");
const validateMongodbId = require("../../utils/validateMongodbID");
const SlangFilter = require("bad-words");
const path = require("path");
const cloudinaryUploadImage = require("../../utils/cloudinary");
//------------------------------------------------------------------------------
//Create a post
//-----------------------------------------------------------------------------
const createPostController = expressAsyncHandler(async (req, res) => {
	console.log("Request file :", req.file);
	const { _id } = req.user; //logged in user
	//1>check for the valid user using id
	// validateMongodbId(req.body.user);
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

	//1> get the path of image
	const localPath = `public/images/posts/${req.file.fileName}`;
	//2>Upload to cloudinary
	const imgUploaded = await cloudinaryUploadImage(localPath);

	try {
		const post = await Post.create({
			...req.body,
			image: imgUploaded?.url,
			user: _id,
		});
		res.json(post);
	} catch (err) {
		res.json(err);
	}
});

module.exports = {
	createPostController,
};

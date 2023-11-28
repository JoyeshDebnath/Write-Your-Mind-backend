const Post = require("../../model/post/Post");
const User = require("../../model/user/User");
const expressAsyncHandler = require("express-async-handler");
const validateMongodbId = require("../../utils/validateMongodbID");
const SlangFilter = require("bad-words");
const path = require("path");
const cloudinaryUploadImage = require("../../utils/cloudinary");
const fs = require("fs"); //file system module
//------------------------------------------------------------------------------
//Create a post
//-----------------------------------------------------------------------------
const createPostController = expressAsyncHandler(async (req, res) => {
	console.log("Request file :", req.file);
	const { _id } = req.user; //logged in user

	//2>check for the slangs .
	const filter = new SlangFilter(); //create an instance
	const isSlang = filter.isProfane(req.body.title, req.body.description);

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
	//2>Upload to cloud nary
	const imgUploaded = await cloudinaryUploadImage(localPath);

	try {
		const post = await Post.create({
			...req.body,
			image: imgUploaded?.url,
			user: _id,
		});
		//Remove the file from public folder after upload
		fs.unlinkSync(`public/images/posts/${req.file.fileName}`);
		res.json(imgUploaded);
	} catch (err) {
		res.json(err);
	}
});

//----------------------------------------------------------------------------------------------
//fetch all posts controller
//----------------------------------------------------------------------------------------------
const fetchAllPostsController = expressAsyncHandler(async (req, res) => {
	try {
		const posts = await Post.find({}).populate("user");
		res.json(posts);
	} catch (err) {
		res.json(err);
	}

	res.json("All posts fetched ");
});

//---------------------------------------------------------------------------------------
//fetch a single post and populate its user details (POPULATE)
//update number of views on a post
//--------------------------------------------------------------------------------------
const fetchPostController = expressAsyncHandler(async (req, res) => {
	const { id } = req?.params;
	validateMongodbId(id); //validate the post id

	try {
		const post = await Post.findById({ _id: id }).populate("user");
		//update number of views
		await Post.findByIdAndUpdate(
			{ _id: id },
			{
				$inc: { numViews: 1 },
			},
			{ new: true }
		);
		res.json(post);
	} catch (err) {
		res.json(err);
	}
});

//-----------------------------------------------------------------------------------
//Update Post
//-----------------------------------------------------------------------------------
const updatePostController = expressAsyncHandler(async (req, res) => {
	const { id } = req?.params; //post id
	validateMongodbId(id); //validate the post id .
	console.log("Logged in user: ", req.user);
	try {
		const post = await Post.findByIdAndUpdate(
			{ _id: id },
			{
				...req.body,
				user: req.user?._id,
			},
			{ new: true }
		);
		res.json(post);
	} catch (err) {
		res.json(err);
	}
});

module.exports = {
	createPostController,
	fetchAllPostsController,
	fetchPostController,
	updatePostController,
};

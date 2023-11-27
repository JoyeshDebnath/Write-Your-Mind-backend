const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, "Post title is required !"],
			trim: true,
		},
		//admin can create category : (admin access)
		category: {
			type: String,
			required: [true, "Post category is required!"],
			default: "All",
		},
		isLiked: {
			type: Boolean,
			default: false,
		},
		numViews: {
			type: Number,
			default: 0,
		},
		isDisliked: {
			type: Boolean,
			default: false,
		},
		likes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		dislikes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: [true, "Please Author is required !"],
		},
		description: {
			type: String,
			required: [true, "Please provide post Description!"],
		},
		image: {
			type: String,
			default:
				"https://cdn.pixabay.com/photo/2018/10/19/05/12/naruto-3757871_1280.jpg",
		},
	},
	{
		toJSON: {
			virtuals: true,
		},
		toObject: {
			virtuals: true,
		},
		timestamps: true,
	}
);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;

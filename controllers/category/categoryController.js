const Category = require("../../model/category/Category");
const expressAsyncHandler = require("express-async-handler");

//---------------------------------------------------------
//create a Category
//---------------------------------------------------------
const createCategoryController = expressAsyncHandler(async (req, res) => {
	try {
		const category = await Category.create({
			user: req.user._id,
			title: req?.body?.title,
		});

		res.json(category);
	} catch (err) {
		res.json(err);
	}
});

//----------------------------------------------------------
//get all categories
//----------------------------------------------------------
const getCategoriesController = expressAsyncHandler(async (req, res) => {
	try {
		const categories = await Category.find({})
			.populate("user")
			.sort("-createdAt"); //sort by created time in ascending order
		res.json(categories);
	} catch (err) {
		res.json(err);
	}
});

//------------------------------------
module.exports = {
	createCategoryController,
	getCategoriesController,
};
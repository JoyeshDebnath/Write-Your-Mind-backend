const Category = require("../../model/category/Category");
const expressAsyncHandler = require("express-async-handler");
const validateMongodbId = require("../../utils/validateMongodbID");
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

//----------------------------------------------------
//fetch a single category
//------------------------------------
const getSingleCategoryController = expressAsyncHandler(async (req, res) => {
	const { id } = req.params;
	validateMongodbId(id); //check if the id is valid or not ...
	try {
		const category = await Category.findById(id)
			.populate("user")
			.sort("-createdAt"); //sort by created time in ascending order
		res.json(category);
	} catch (err) {
		res.json(err);
	}
});
//-----------------------------------------------------------------------
//update category
//-----------------------------------------------------------------------
const updateCategoryController = expressAsyncHandler(async (req, res) => {
	const { id } = req.params;
	validateMongodbId(id); //check if the id is valid or not ...
	try {
		const category = await Category.findByIdAndUpdate(
			id,
			{
				title: req?.body?.title,
			},
			{
				new: true,
				runValidators: true,
			}
		);
		res.json(category);
	} catch (err) {
		res.json(err);
	}
});

//-----------------------------------------------------------------------
//update category
//-----------------------------------------------------------------------
const deleteCategoryController = expressAsyncHandler(async (req, res) => {
	const { id } = req.params;
	validateMongodbId(id); //check if the id is valid or not ...
	try {
		const category = await Category.findByIdAndDelete(id);
		res.json(category);
	} catch (err) {
		res.json(err);
	}
});

module.exports = {
	createCategoryController,
	getCategoriesController,
	getSingleCategoryController,
	updateCategoryController,
	deleteCategoryController,
};

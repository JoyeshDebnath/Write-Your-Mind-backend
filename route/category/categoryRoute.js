const express = require("express");
const authMiddleware = require("../../middlewares/auth/authMiddleware");
const {
	createCategoryController,
	getCategoriesController,
	getSingleCategoryController,
	updateCategoryController,
	deleteCategoryController,
} = require("../../controllers/category/categoryController");

const categoryRoute = express.Router();

categoryRoute.post("/", authMiddleware, createCategoryController); //create a category ...
categoryRoute.get("/", authMiddleware, getCategoriesController); //get all categories ..
categoryRoute.get("/:id", authMiddleware, getSingleCategoryController); //get single category  ..
categoryRoute.put("/:id", authMiddleware, updateCategoryController); //update category route
categoryRoute.delete("/:id", authMiddleware, deleteCategoryController); //delete  category route
module.exports = categoryRoute;

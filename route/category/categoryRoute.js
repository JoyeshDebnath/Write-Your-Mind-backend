const express = require("express");
const authMiddleware = require("../../middlewares/auth/authMiddleware");
const {
	createCategoryController,
	getCategoriesController,
	getSingleCategoryController,
} = require("../../controllers/category/categoryController");

const categoryRoute = express.Router();

categoryRoute.post("/", authMiddleware, createCategoryController); //create a category ...
categoryRoute.get("/", authMiddleware, getCategoriesController); //get all categories ..
categoryRoute.get("/:id", authMiddleware, getSingleCategoryController); //get single category  ..
module.exports = categoryRoute;

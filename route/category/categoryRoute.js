const express = require("express");
const authMiddleware = require("../../middlewares/auth/authMiddleware");
const {
	createCategoryController,
} = require("../../controllers/category/categoryController");

const categoryRoute = express.Router();

categoryRoute.post("/", authMiddleware, createCategoryController); //create a category ...

module.exports = categoryRoute;

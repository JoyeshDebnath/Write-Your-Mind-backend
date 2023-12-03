const express = require("express");
const {
	sendEmailMessageController,
} = require("../../controllers/emailMessage/emailMessageController");
const authMiddleware = require("../../middlewares/auth/authMiddleware");

const emailMessageRoute = express.Router();

emailMessageRoute.post("/", authMiddleware, sendEmailMessageController);

module.exports = emailMessageRoute;

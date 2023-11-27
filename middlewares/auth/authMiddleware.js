const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../../model/user/User");

const authMiddleware = expressAsyncHandler(async (req, res, next) => {
	let token;
	if (req?.headers?.authorization?.startsWith("Bearer")) {
		try {
			token = req.headers.authorization.split(" ")[1];
			if (token) {
				const decoded = jwt.verify(token, process.env.JWT_KEY);
				//find the user by id
				const user = await User.findById({
					_id: decoded?.id,
				}).select("-password");
				//attach the user to the request object
				req.user = user;
				next();
			}
		} catch (err) {
			throw new Error(`Not Authorized Token expired , login again `);
		}
	} else {
		throw new Error(`There is no token attached to user !`);
	}
});

module.exports = authMiddleware;

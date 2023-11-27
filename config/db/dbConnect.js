const mongoose = require("mongoose");

const dbConnect = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URL);
		console.log("db connected successfully!");
	} catch (err) {
		console.log("something went wrong !", err.message);
	}
};

module.exports = dbConnect;

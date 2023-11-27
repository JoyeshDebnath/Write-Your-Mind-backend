const multer = require("multer");
const sharp = require("sharp");
const path = require("path");

//storage
const multerStorage = multer.memoryStorage(); //we are going to save the file temporarily in memory of the server

//file type check (.png , .jpeg)
const multerFilter = (req, file, cb) => {
	//check file type
	if (file.mimetype.startsWith("image")) {
		cb(null, true);
	} else {
		//reject the file
		cb(
			{
				message: `Unsupported File Format!`,
			},
			false
		);
	}
};

const photoUpload = multer({
	storage: multerStorage,
	fileFilter: multerFilter,
	limits: { fileSize: 1000000 },
}); //configuring the image with  storage , filter of file and restricting file size

//middle ware for : Resizing the image uploaded
const profilePhotoResize = async (req, res, next) => {
	//check if there is no file uploaded
	if (!req.file) return next();

	req.file.fileName = `user-${Date.now()}-${req.file.originalname}`;
	await sharp(req.file.buffer)
		.resize(250, 250)
		.toFormat("jpeg")
		.jpeg({
			quality: 90,
		})
		.toFile(path.join(`public/images/profile/${req.file.fileName}`));

	next();
};

//middle ware for : Resizing the image uploaded for post
const postImageResize = async (req, res, next) => {
	//check if there is no file uploaded
	if (!req.file) return next();

	req.file.fileName = `user-${Date.now()}-${req.file.originalname}`;
	await sharp(req.file.buffer)
		.resize(500, 500)
		.toFormat("jpeg")
		.jpeg({
			quality: 90,
		})
		.toFile(path.join(`public/images/posts/${req.file.fileName}`));

	next();
};

module.exports = {
	photoUpload,
	profilePhotoResize,
	postImageResize,
};

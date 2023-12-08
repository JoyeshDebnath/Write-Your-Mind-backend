const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const { errorHandler, notFound } = require("./middlewares/error/errorHandler");

//db import
const dbConnect = require("./config/db/dbConnect");
dotenv.config();
const app = express();
//Routes imports
const userRoutes = require("./route/users/usersRoute"); //user routes
const postRoute = require("./route/posts/postRoute"); //post Routes
const commentRoute = require("./route/comments/commentRoute"); //comment route
const emailMessageRoute = require("./route/emailMessage/emailMessageRoute"); //email routes
const categoryRoute = require("./route/category/categoryRoute"); //category route

//DB
dbConnect();
//Middleware
app.use(express.json());
//cors
app.use(cors());
//user routes
app.use("/api/users", userRoutes);
//post routes
app.use("/api/posts", postRoute);
//comment route
app.use("/api/comments", commentRoute);
//email message
app.use("/api/emails", emailMessageRoute);
//category route
app.use("/api/category", categoryRoute);
//error handler
app.use(notFound);
app.use(errorHandler);
//Server
const PORT = process.env.PORT || 5000;

console.log(app);

app.listen(PORT, () => {
	console.log(`Server is Running on port ${PORT}`);
});

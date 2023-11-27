const dotenv = require("dotenv");
const express = require("express");
const { errorHandler, notFound } = require("./middlewares/error/errorHandler");
//db import
const dbConnect = require("./config/db/dbConnect");
dotenv.config();
const app = express();
//Routes imports
const userRoutes = require("./route/users/usersRoute"); //user routes
const postRoute = require("./route/posts/postRoute"); //post Routes

//DB
dbConnect();
//Middleware
app.use(express.json());
//user routes
app.use("/api/users", userRoutes);
//post routes
app.use("/api/posts", postRoute);
//error handler
app.use(notFound);
app.use(errorHandler);
//Server
const PORT = process.env.PORT || 5000;

console.log(app);

app.listen(PORT, () => {
	console.log(`Server is Running on port ${PORT}`);
});

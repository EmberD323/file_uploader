
const express = require("express");
const app = express();
require("dotenv").config();
const router = require("./routes/router");
const path = require("node:path");
//const session = require("express-session");
//const passport = require("passport");


// //passport
// app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
// app.use(passport.session());
//ejs
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
//css
const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));
//url
app.use(express.urlencoded({ extended: true }));
//router
app.use("/", router);

//port listening
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));
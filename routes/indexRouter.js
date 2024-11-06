const { Router } = require("express");
const indexRouter = Router();
const passport = require("passport");
const userController = require("../controllers/userController");
const fileController = require("../controllers/fileController");
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })


indexRouter.get("/", (req, res) => {res.render("index", { user: req.user });});
indexRouter.get("/sign-up", userController.signUpGet);
indexRouter.post("/sign-up", userController.signUpPost);
//login
indexRouter.post(
    "/log-in",
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/"
    })
);
//logout
indexRouter.get("/log-out", (req, res, next) => {
    req.logout((err) => {
        if (err) {
        return next(err);
        }
        res.redirect("/");
    });
});


indexRouter.get("/file-upload", fileController.fileUploadGet);
indexRouter.post("/file-upload", upload.single('file'), fileController.fileUploadPost);

module.exports = indexRouter;

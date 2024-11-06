const { Router } = require("express");
const indexRouter = Router();
const passport = require("passport");
const userController = require("../controllers/userController");

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

module.exports = indexRouter;

const { Router } = require("express");
const indexRouter = Router();
const passport = require("passport");
const userController = require("../controllers/userController");

indexRouter.get("/", (req, res) => {
    res.render("index", { user: req.user });
});
indexRouter.get("/sign-up", (req, res) => res.render("sign-up-form"));
indexRouter.post("/sign-up", userController.signUpPost);

indexRouter.post(
    "/log-in",
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/"
    })
);
indexRouter.get("/log-out", (req, res, next) => {
    req.logout((err) => {
        if (err) {
        return next(err);
        }
        res.redirect("/");
    });
});

module.exports = indexRouter;

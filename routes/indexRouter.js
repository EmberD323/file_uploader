const { Router } = require("express");
const indexRouter = Router();
const passport = require("passport");
const userController = require("../controllers/userController");
const fileController = require("../controllers/fileController");
const folderController = require("../controllers/folderController");

const db = require("../prisma/queries.js");


const multer  = require('multer')
const storage = multer.memoryStorage()
const upload  = multer({ storage: storage })



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

indexRouter.get("/add-folder", folderController.folderAddGet);
indexRouter.post("/add-folder",folderController.folderAddPost);

indexRouter.get("/:folderName/renameFile",folderController.folderRenameGet);
indexRouter.post("/:folderName/renameFile",folderController.folderRenamePost);
indexRouter.post("/:folderName/deleteFile",folderController.folderDeletePost);

indexRouter.get("/:folderName/:fileName/renameFile",fileController.fileRenameGet);
indexRouter.post("/:folderName/:fileName/renameFile",fileController.fileRenamePost);
indexRouter.post("/:folderName/:fileName/deleteFile",fileController.fileDeletePost);
indexRouter.get("/:folderName/:fileName/details",fileController.fileDetailsGet);

indexRouter.get("/:folderName/:fileName/downloadFile",fileController.fileDownloadGet);

indexRouter.get("/:folderName",fileController.filesDisplayGet);

indexRouter.get("/", async function(req, res) {
    if(req.user !=undefined){
        const folders = await db.findFoldersByUserID(req.user);
        return res.render("index", {
            user: req.user,
            folders: folders,
            folderRename:false,
            folder_upload:false,
        })
    }
    res.render("index")
    res.end();
});

module.exports = indexRouter;

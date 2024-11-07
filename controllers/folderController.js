const db = require("../prisma/queries.js");
const { body, validationResult } = require("express-validator");


async function folderAddGet (req, res) {
    res.render("add-folder", { user: req.user });
}

const validatefolder= [
    body("folderName").trim()
        .escape()
        .isLength({ min: 1, max: 35 }).withMessage(`File name must be between 1 and 35 characters.`)
        .custom(async (value, { req }) => {
            const folder = await db.findFolderByNameAndId(value,req.user);
            if (folder) {
                throw new Error('Folder already exists, choose another name');
            }
        }),
];
folderAddPost = [
    validatefolder,
    async function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render("add-folder", {
                user: req.user,
                errors: errors.array(),
            });
        }
        await db.createFolder(req.body.folderName,req.user)
        res.redirect("/");
    }
]

async function folderRenameGet (req, res) {
    const folder = await db.findFolderByNameAndId(req.params.folderName,req.user);
    res.render("rename-folder", { 
        user: req.user,
        folder: folder
    });
}

folderRenamePost = [
    validatefolder,
    async function (req, res) {
        const folder = await db.findFolderByNameAndId(req.params.folderName,req.user);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render("rename-folder", {
                user: req.user,
                folder: folder,
                errors: errors.array(),
            });
        }
        await db.updateFolder(folder,req.user,req.body.folderName);
        res.redirect("/");
        return
    }
]

async function folderDeletePost (req, res) {
    try{
        const folder = await db.findFolderByNameAndId(req.params.folderName,req.user);
        console.log()
        if(folder.files[0] != undefined) throw "Folder contains files, delete files before deleting folder";
        await db.deleteFolder(folder.id);
        return res.redirect("/")
    }
    catch(err){
        const folders = await db.findFoldersByUserID(req.user);
        console.log(err)
        return res.render("index", {
            user: req.user,
            folders: folders,
            errors: [{msg:err}],
        });
    }
    
}
module.exports = {
    folderAddGet,
    folderAddPost,
    folderRenameGet,
    folderRenamePost,
    folderDeletePost
    
};
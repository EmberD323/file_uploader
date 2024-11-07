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


module.exports = {
    folderAddGet,
    folderAddPost
    
};
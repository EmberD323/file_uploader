const db = require("../prisma/queries.js");


async function folderAddGet (req, res) {
    res.render("add-folder", { user: req.user });
}

 
async function folderAddPost(req, res) {
    // if (req.file == undefined) {
    //     return res.render("file-upload", {
    //         user: req.user,
    //         errors:[{msg:"Choose a file to upload"}],
    //     });
    // }
    await db.createFolder(req.body.folderName,req.user)
    
    res.redirect("/");

}



module.exports = {
    folderAddGet,
    folderAddPost,
    
};
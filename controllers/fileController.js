const db = require("../prisma/queries.js");


async function fileUploadGet (req, res) {
    res.render("file-upload", { user: req.user });
}

async function fileUploadPost(req, res) {
    const folder = await db.findFolderByNameAndId(req.params.folderName,req.user);
    const files = await db.findFilesByFolderID(folder);
    //validate
    if (req.file == undefined) {
        return res.render("folder", { 
            user: req.user,
            files: files,
            folder:folder,
            errors:[{msg:"Choose a file to upload"}]
        });
    }
    const fileName = req.file.originalname;
    const path =req.file.path;
    const file = await db.findFileByNameAndFolderId(fileName,folder);
    if (file) {
        return res.render("folder", { 
            user: req.user,
            files: files,
            folder:folder,
            errors:[{msg:"Filename already exists in folder"}]
        });
    }
    await db.createFile(fileName,path,req.user,folder)
    return res.redirect("/"+folder.folder_name);
   
}
async function filesDisplayGet (req, res) {
    console.log(req.user)
    console.log(req.params)
    const folder = await db.findFolderByNameAndId(req.params.folderName,req.user);
    console.log(folder);
    const files = await db.findFilesByFolderID(folder);
    res.render("folder", { 
        user: req.user,
        files: files,
        folder:folder
    });
}
async function fileRenameGet (req, res) {
    const folder = await db.findFolderByNameAndId(req.params.folderName,req.user);
    const file = await db.findFileByNameAndFolderId(req.params.fileName,folder);
    res.render("rename-file", { 
        user: req.user,
        file: file
    });
}

async function fileRenamePost (req, res) {
    const folder = await db.findFolderByNameAndId(req.params.folderName,req.user);
    //validate
    const newName = req.body.fileName;
    const fileCheck = await db.findFileByNameAndFolderId(newName,folder);
    if (fileCheck) {
        return res.render("rename-file", { 
            user: req.user,
            file: file,
            errors:[{msg:"Filename already exists in folder"}]
        });
        
    }
    //rename
    const file = await db.findFileByNameAndFolderId(req.params.fileName,folder);
    await db.updateFileName(file,newName)
    return res.redirect("/"+folder.folder_name)
}

async function fileDeletePost (req, res) {
    const folder = await db.findFolderByNameAndId(req.params.folderName,req.user);
    const file = await db.findFileByNameAndFolderId(req.params.fileName,folder);
    await db.deleteFile(file.id);
    return res.redirect("/"+folder.folder_name)
}

module.exports = {
    fileUploadGet,
    fileUploadPost,
    filesDisplayGet,
    fileRenameGet,
    fileRenamePost,
    fileDeletePost
};
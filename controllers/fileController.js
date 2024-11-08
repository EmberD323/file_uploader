const db = require("../prisma/queries.js");
const {createClient} = require("@supabase/supabase-js")
require("dotenv").config();
const supabase = createClient("https://xbabombxfjcblagbhqua.supabase.co", process.env.SUPABASE_KEY)


async function fileUploadPost(req, res) {
    const folder = await db.findFolderByNameAndId(req.params.folderName,req.user);
    const files = await db.findFilesByFolderID(folder);
    //validate
    if (req.file == undefined) {
        return res.render("folder", { 
            user: req.user,
            files: files,
            folder:folder,
            fileDetail:undefined,
            fileRename:false,
            errors:[{msg:"Choose a file to upload"}]
        });
    }
    const fileName = req.file.originalname;
    const fileSize =req.file.size;
    const file = await db.findFileByNameAndFolderId(fileName,folder);
    if (file) {
        return res.render("folder", { 
            user: req.user,
            files: files,
            folder:folder,
            fileDetail:undefined,
            fileRename:false,
            errors:[{msg:"Filename already exists in folder"}]
        });
    }
    //upload
    const supabasePath = req.user.id+"/"+folder.id+"/"+fileName;
    const { data, error } = await supabase.storage
    .from('files')
    .upload(supabasePath, req.file.buffer, {
        upsert: false,
        contentType: req.file.mimetype,
    })
    if (error) {
      console.log(error)
    } else {
      //add to database
      await db.createFile(fileName,supabasePath,fileSize,req.user,folder)
    }
    return res.redirect("/user/"+folder.folder_name);
}
async function filesDisplayGet (req, res) {
    const folder = await db.findFolderByNameAndId(req.params.folderName,req.user);
    const files = await db.findFilesByFolderID(folder);
    res.render("folder", { 
        user: req.user,
        files: files,
        folder:folder,
        fileRename:false,
        fileDetail:undefined,
        error:false
    });
}
async function fileRenameGet (req, res) {
    const folder = await db.findFolderByNameAndId(req.params.folderName,req.user);
    const file = await db.findFileByNameAndFolderId(req.params.fileName,folder);
    const files = await db.findFilesByFolderID(folder);
    res.render("folder", { 
        user: req.user,
        files: files,
        folder:folder,
        fileRename:file,
        fileDetail:undefined,
        error:false
    });
}

async function fileRenamePost (req, res) {
    const folder = await db.findFolderByNameAndId(req.params.folderName,req.user);
    const file = await db.findFileByNameAndFolderId(req.params.fileName,folder);
    //validate
    const newName = req.body.fileName;
    const fileCheck = await db.findFileByNameAndFolderId(newName,folder);
    const files = await db.findFilesByFolderID(folder);
    if (fileCheck) {
        return res.render("folder", { 
            user: req.user,
            files: files,
            folder:folder,
            fileRename:file,
            fileDetail:undefined,
            error:{msg:"Filename already exists in folder"}
        });
        
    }
    const newPath = req.user.id+"/"+folder.id+"/"+newName;
    //rename on supabase
    const { data, error } = await supabase.storage.from('files').move(req.user.id+"/"+folder.id+"/"+file.file_name, req.user.id+"/"+folder.id+"/"+newName)
    if (error) {
        console.log(error)
    }else{//rename in db
        await db.updateFileName(file,newName,newPath)
    }
    return res.redirect("/user/"+folder.folder_name)
}

async function fileDeletePost (req, res) {
    const folder = await db.findFolderByNameAndId(req.params.folderName,req.user);
    const file = await db.findFileByNameAndFolderId(req.params.fileName,folder);
    //delete on supabase
    const { data, error } =  await supabase.storage.from('files').remove([req.user.id+"/"+folder.id+"/"+file.file_name])
    if (error) {
        console.log(error)
    }else{//delete from db
        await db.deleteFile(file.id);
    }
    return res.redirect("/user/"+folder.folder_name)
}
async function fileDetailsGet (req, res) {
    const folder = await db.findFolderByNameAndId(req.params.folderName,req.user);
    const files = await db.findFilesByFolderID(folder);
    const file = await db.findFileByNameAndFolderId(req.params.fileName,folder);
    res.render("folder", { 
        user: req.user,
        files: files,
        folder:folder,
        fileRename:false,
        fileDetail:file,
        error:false
    });
}
async function fileDownloadGet (req,res){
    const folder = await db.findFolderByNameAndId(req.params.folderName,req.user);
    const file = await db.findFileByNameAndFolderId(req.params.fileName,folder);
    const filePath = file.file_path;
    const { data, error } = await supabase.storage.from('files').download(filePath)
    if (error) {
        console.log(error)
    }
    // Set the header for file download
    res.setHeader(
        "Content-Disposition",
        `attachment; filename="${file.file_name}"`,
      );
    // Convert Blob to Buffer and send
    const arrayBuffer = await data.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    res.send(buffer);
}
module.exports = {
  
    fileUploadPost,
    filesDisplayGet,
    fileRenameGet,
    fileRenamePost,
    fileDeletePost,
    fileDetailsGet,
    fileDownloadGet
};


async function fileUploadGet (req, res) {
    res.render("file-upload", { user: req.user });
}

 
async function fileUploadPost(req, res) {
    if (req.file == undefined) {
        return res.render("file-upload", {
            user: req.user,
            errors:[{msg:"Choose a file to upload"}],
        });
    }
    console.log(req.file)
    //next steps: validate file attactched
    //add file database to schema
    //link to user one(user) to many (files)
    //add files to data base
    res.redirect("/");

}



module.exports = {
    fileUploadGet,
    fileUploadPost,
    
};
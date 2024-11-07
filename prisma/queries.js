
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

//create
async function createUser(username,firstName,lastName,password) {
    await prisma.user.create({
        data: {
            username: username,
            first_name:firstName,
            last_name:lastName,
            password: password
        }})
    return 
}
async function createFolder(name,user) {
    await prisma.folder.create({
        data: {
            folder_name:name,
            userId:user.id
        }
    })
    return 
}
async function createFile(name,path,user,folder) {
    await prisma.file.create({
        data: {
            file_name:name,
            file_path:path,
            userId:user.id,
            folderId:folder.id
        }
    })
    return 
}
//read
async function findAllUsers() {
    const users = await prisma.user.findMany()
    return users
}
async function findUserByUsername(username) {
    const user = await prisma.user.findUnique({
        where: {
          username: username,
        },
    })
    return user
}
async function findUserByID(id) {
    const user = await prisma.user.findUnique({
        where: {
          id: id,
        },
    })
    return user
}
async function findAllFolders() {
    const folders = await prisma.folder.findMany()
    return folders
}
async function findFoldersByUserID(user) {
    const folders = await prisma.folder.findMany({
        where: {
          userId:user.id
        },
    })
    return folders
}
async function findFolderByNameAndId(folderName,user) {
    const folders = await prisma.folder.findMany({
        include: {
            files: true,
          },
        where: {
          folder_name:folderName,
          userId:user.id
        },
    })
    return folders[0]
}
async function findAllFiles() {
    const files = await prisma.file.findMany()
    return files
}
async function findFilesByUserID(user) {
    const files = await prisma.file.findMany({
        where: {
          userId:user.id
        },
    })
    return files
}
async function findFilesByFolderID(folder) {
    const files = await prisma.file.findMany({
        where: {
          folderId:folder.id
        },
    })
    return files
}
async function findFilesByUserAndFolderID(user,folder) {
    const files = await prisma.file.findMany({
        where: {
          userId:user.id,
          folderId:folder.id
        },
    })
    return files
}
async function findFileByNameAndFolderId(fileName,folder) {
    const files = await prisma.file.findMany({
        where: {
          file_name:fileName,
          folderId:folder.id
        },
    })
    return files[0]
}
//update
async function updateFolder(folder,user,newName) {
    await prisma.folder.update({
        where: {
            id: folder.id,
            userId:user.id
        },
        data: {
          folder_name: newName,
        }
      })
    return
}
async function updateFileName(file,newName) {
    await prisma.file.update({
        where: {
            id: file.id,
        },
        data: {
          file_name: newName,
        }
      })
    return
}
async function updateFileFolder(fileID,folderID) {
    await prisma.file.update({
        where: {
            id: fileID,
        },
        data: {
          folderId:folderID,
        }
      })
    return
}
//delete
async function deleteUser(user) {
     await prisma.user.delete({
        where: {
          userId: user.id,
        },
    })
}
async function deleteFolder(folderID) {
    await prisma.folder.delete({
       where: {
         id: folderID,
       },
   })
}
async function deleteFoldersByUser(user) {
    await prisma.folder.deleteMany({
        where: {
          userId: user.id,
        },
    })
}
async function deleteFile(fileID) {
    await prisma.file.delete({
       where: {
         id: fileID,
       },
   })
}
async function deleteFilesByUser(user) {
    await prisma.file.deleteMany({
        where: {
          userId: user.id,
        },
    })
}
async function deleteFilesByFolder(folderID) {
    await prisma.file.deleteMany({
        where: {
          folderId:folderID,
        },
    })
}

module.exports = {
    createUser,
    createFolder,
    createFile,
    findUserByUsername,
    findAllUsers,
    findUserByID,
    findAllFolders,
    findFoldersByUserID,
    findFolderByNameAndId,
    findAllFiles,
    findFilesByUserID,
    findFilesByFolderID,
    findFilesByUserAndFolderID,
    findFileByNameAndFolderId,
    updateFolder,
    updateFileName,
    updateFileFolder,
    deleteUser,
    deleteFolder,
    deleteFoldersByUser,
    deleteFile,
    deleteFilesByUser,
    deleteFilesByFolder
};
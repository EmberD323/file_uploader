const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


async function main() {
    const allUsers = await prisma.user.findMany({
      include: {
        folders: true,
        files: true,
      },
    })
    console.log("All Users")
    console.log(allUsers, { depth: null })

    const allFiles = await prisma.file.findMany()
    console.log("All Files")
    console.log(allFiles, { depth: null })

    const allFolders = await prisma.folder.findMany({
      include: {
        files: true,
      }
    })
    console.log("All Folders")
    console.log(allFolders, { depth: null })
}
  

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

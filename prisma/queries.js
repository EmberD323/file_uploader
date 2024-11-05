const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()


async function findAllUsers() {
    const allUsers = await prisma.user.findMany()
    return allUsers
}
module.exports ={
    findAllUsers,
}
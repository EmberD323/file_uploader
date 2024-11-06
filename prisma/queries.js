
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

//read
async function findUserByUsername(username) {
    const user = await prisma.user.findUnique({
        where: {
          username: username,
        },
    })
    return user
}

async function findAllUsers() {
    const users = await prisma.user.findMany()
    return users
}


module.exports = {
    findUserByUsername,
    findAllUsers,
    createUser

};
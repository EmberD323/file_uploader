const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
//this approach is for running all queries at once - maybe populating dummy
async function main() {
    // ... you will write your Prisma Client queries here
    await prisma.user.create({
        data: {
          first_name: 'Alice',
          last_name:'Grey',
          email: 'alice@prisma.io',
          password: 'beans',
        },
      })
    const allUsers = await prisma.user.findMany()
    console.log(allUsers)
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
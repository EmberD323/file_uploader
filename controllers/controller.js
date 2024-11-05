const { body, validationResult } = require("express-validator");
const db = require("../prisma/queries.js");


async function homeGet (req, res) {
    const users = await db.findAllUsers();
    res.send(users);
}
module.exports = {
    homeGet
};
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const db = require("../prisma/queries.js");

function capitalize(string){
  if(typeof string !== "string"){throw new Error("A string is required as input - only letters")}
    let capitalCharacter = string.charAt(0).toUpperCase()
    let nonCapital = string.slice(1).toLowerCase();
    let result = capitalCharacter.concat(nonCapital);

    return result
}
const validateSignUp= [
    body("firstName").trim()
      .escape()
      .isAlpha().withMessage(`First Name can only be letters`)
      .isLength({ min: 1, max: 15 }).withMessage(`First name must be between 1 and 15 characters.`),
    body("lastName").trim()
        .escape()
        .isAlpha().withMessage(`Last name can only be letters`)
        .isLength({ min: 1, max: 15 }).withMessage(`Last name must be between 1 and 15 characters.`),
    body("username").custom(async value => {
      const user = await db.findUserByUsername(value);
      if (user) {
        throw new Error('E-mail already in use');
      }
    }),
    body("password")
      .isLength({ min: 8}).withMessage(`Password must be between more than 8 characters.`)
      .matches(/\d/).withMessage('Password must contain a number'),
    body('passwordConfirm').custom((value, { req }) => {
          return value === req.body.password;
      }).withMessage(`Passwords must match.`)
];

signUpPost = [
    validateSignUp,
    async function(req, res) {
        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.render("sign-up-form", {
                    errors: errors.array(),
                });
            }
            await db.createUser(req.body.username,capitalize(req.body.firstName),capitalize(req.body.lastName),hashedPassword)
            const users = await db.findAllUsers()
            console.log(users)
            res.redirect("/")
          });
    }
]

module.exports = {
    signUpPost,
};
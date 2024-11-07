const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const db = require("../prisma/queries.js");
const tools = require("./modules/tools.js");


async function signUpGet (req, res) {
    res.render("sign-up-form");
}
//sign up validation and handling
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
            await db.createUser(req.body.username,tools.capitalize(req.body.firstName),tools.capitalize(req.body.lastName),hashedPassword)
            res.redirect("/")
          });
    }
]

module.exports = {
    signUpGet,
    signUpPost,
    
};
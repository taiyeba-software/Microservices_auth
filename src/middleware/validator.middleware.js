const {body, validationResult} = require('express-validator');

const registorUserValidator =[

    body("username")
      .isString()
      .withMessage("Username must be a string")
      .isLength({ min: 3 })
      .withMessage("Username must be 3 character long"),

    body("email")
      .isEmail()
      .withMessage("Invalid email format")
      .notEmpty()
      .withMessage("Email is required"),

    body("password")
      .isString()
      .withMessage("Password must be a string")
      .isLength({ min: 6 })
      .withMessage("Password is required"),
      

    body("fullname.firstname")
      .isString()
      .withMessage("First name must be a string")
      .notEmpty()
      .withMessage("First name is required"),

    body("fullname.lastname")
      .isString()
      .withMessage("Last name must be a string")
      .notEmpty()
      .withMessage("Last name is required")
];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    registerUserValidator,
    validate
};

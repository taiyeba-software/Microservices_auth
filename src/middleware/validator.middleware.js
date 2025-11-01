const {body, validationResult} = require('express-validator');

const registerUserValidator = [

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


const loginValidator = [
  // 🔐 Login validation — accept either username OR email, plus password
  // username is optional but if provided must be a string
  body("username").optional().isString().withMessage("Username must be a string"),

  // email is optional but if provided must be valid
  body("email").optional().isEmail().withMessage("Invalid email format"),

  // password is required
  body("password")
    .isString()
    .withMessage("Password must be a string")
    .notEmpty()
    .withMessage("Password is required"),

  // custom check: require at least one of username or email
  (req, res, next) => {
    // If password missing or both username/email missing, return the
    // message expected by existing tests: 'Username and password are required'
    if (!req.body.password || (!req.body.username && !req.body.email)) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    next();
  }
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Include a top-level message for compatibility with tests and clients
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }
  next();
};

module.exports = {
    registerUserValidator,
    loginValidator,
    validate
};

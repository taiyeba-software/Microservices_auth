# Authentication Microservice

A robust authentication microservice built with Node.js, Express, and MongoDB, featuring user registration and login functionality with JWT-based authentication.

## Features

- User Registration with validation
- User Login with JWT authentication
- Secure password hashing with bcrypt
- HTTP-Only Cookie session management
- Input validation and sanitization
- MongoDB integration with Mongoose
- Comprehensive test suite with Jest
- In-memory MongoDB for testing

## Project Structure

```
.
├── src/
│   ├── controllers/
│   │   ├── auth.controller.js      # Registration controller
│   │   └── login.controller.js     # Login controller
│   ├── db/
│   │   └── db.js                  # Database connection
│   ├── middleware/
│   │   └── validator.middleware.js # Input validation
│   ├── models/
│   │   └── user.model.js          # User schema
│   ├── routes/
│   │   └── auth.routes.js         # Authentication routes
│   └── app.js                     # Express app configuration
├── tests/
│   ├── auth.login.test.js         # Login tests
│   ├── auth.register.test.js      # Registration tests
│   └── setup.js                   # Test environment setup
└── server.js                      # Server entry point
```

## Dependencies

### Production Dependencies
- `express`: ^5.1.0 - Web framework
- `mongoose`: ^8.19.2 - MongoDB ODM
- `bcryptjs`: ^3.0.2 - Password hashing
- `jsonwebtoken`: ^9.0.2 - JWT implementation
- `express-validator` - Input validation
- `dotenv`: ^17.2.3 - Environment configuration
- `cookie-parser`: ^1.4.7 - Cookie handling

### Development Dependencies
- `jest`: ^29.6.1 - Testing framework
- `supertest`: ^6.3.3 - HTTP testing
- `mongodb-memory-server`: ^8.12.2 - In-memory MongoDB for testing

## API Endpoints

### Register User
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string",
    "fullname": {
      "firstname": "string",
      "lastname": "string"
    }
  }
  ```
- **Success Response**: `201 Created`
  ```json
  {
    "message": "User registered successfully",
    "user": {
      "id": "string",
      "username": "string",
      "email": "string",
      "role": "user",
      "fullname": {
        "firstname": "string",
        "lastname": "string"
      },
      "address": []
    }
  }
  ```
- **Error Response**: `400`, `409`, or `500`

### Login User
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "message": "Login successful",
    "user": {
      "id": "string",
      "username": "string",
      "email": "string",
      "role": "user",
      "fullname": {
        "firstname": "string",
        "lastname": "string"
      },
      "address": []
    }
  }
  ```
- **Error Response**: `400`, `401`, or `500`

## Environment Setup

Create a `.env` file in the root directory:
```env
JWT_SECRET=your-secret-key-here
MONGODB_URI=your-mongodb-uri
```

## Running Tests

The project includes comprehensive test suites for both registration and login functionality. Tests use `mongodb-memory-server` for isolation.

### Windows PowerShell Notes
Due to execution policy restrictions in PowerShell, use:

```powershell
npm.cmd install  # Install dependencies
npm.cmd test     # Run tests
```

### Test Coverage
- Registration tests:
  - Successful registration (201)
  - Missing fields validation (400)
  - Duplicate user handling (409)

- Login tests:
  - Successful login (200)
  - Missing credentials (400)
  - Invalid username (401)
  - Invalid password (401)

## User Schema

```javascript
{
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  fullname: {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true }
  },
  address: [{
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  }],
  createdAt: { type: Date, default: Date.now }
}
```

## Security Features

- Password hashing using bcrypt
- JWT-based authentication
- HTTP-Only cookies for token storage
- Input validation and sanitization
- Error handling with appropriate status codes
- Request validation middleware

## Todo List

- [ ] Password reset functionality
- [ ] Email verification
- [ ] OAuth integration
- [ ] Rate limiting
- [ ] Role-based access control
- [ ] Session management
- [ ] Account deletion
- [ ] Profile updates
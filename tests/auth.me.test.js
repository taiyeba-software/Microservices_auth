// Test suite for GET /api/auth/me
// Notes for implementers:
// - Authentication is expected via an HTTP-only cookie named `token` containing a JWT.
// - The JWT should be signed with the same `JWT_SECRET` used in tests (tests/setup.js sets this).
// - The token payload used by these tests contains: { id, username, email, role }.
// - Expected response shape (one acceptable shape):
//   {
//     user: {
//       id: "<user id>",
//       username: "<username>",
//       email: "<email>",
//       role: "user|admin",
//       fullname: { firstname, lastname }, // optional
//       address: [] // optional
//     }
//   }
// - If your implementation returns top-level fields (id, username, email) instead of a nested `user` object,
//   update assertions accordingly. The comments above show the data format required for the tests to pass.

require('./setup');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

let mongoServer;
const { connectDB, closeDB } = require('../src/db/db');
const app = require('../src/app');
const User = require('../src/models/user.model');

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await connectDB(uri);
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await closeDB();
  if (mongoServer) await mongoServer.stop();
});

describe('GET /api/auth/me', () => {
  it('returns user info when authenticated (cookie token)', async () => {
    // Create test user
    const hashed = await bcrypt.hash('password123', 10);
    const user = await User.create({
      username: 'meuser',
      email: 'me@example.com',
      password: hashed,
      fullname: { firstname: 'Me', lastname: 'User' }
    });

    // Create JWT matching server expectations
    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Send request with cookie header (supertest accepts 'Cookie' header)
    const res = await request(app)
      .get('/api/auth/me')
      .set('Cookie', [`token=${token}`])
      .expect(200);

    // Assertions: we expect a `user` object with at least username and email
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('username', 'meuser');
    expect(res.body.user).toHaveProperty('email', 'me@example.com');
    // Password must never be returned
    expect(res.body.user).not.toHaveProperty('password');
  });

  it('returns 401 when no auth token is provided', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .expect(401);

    // Helpful message expected; implementation may vary
    expect(res.body).toHaveProperty('message');
  });

  it('returns 401 for invalid/expired token', async () => {
    // Send an obviously invalid token
    const res = await request(app)
      .get('/api/auth/me')
      .set('Cookie', ['token=bad.invalid.token'])
      .expect(401);

    expect(res.body).toHaveProperty('message');
  });
});

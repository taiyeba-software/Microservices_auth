require('./setup');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

let mongoServer;
const { connectDB, closeDB } = require('../src/db/db');
const app = require('../src/app');
const User = require('../src/models/user.model');

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await connectDB(uri);
});

beforeEach(async () => {
  // Create a test user before each test
  const hashedPassword = await bcrypt.hash('password123', 10);
  await User.create({
    username: 'testuser',
    email: 'test@example.com',
    password: hashedPassword,
    fullname: { firstname: 'Test', lastname: 'User' }
  });
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await closeDB();
  if (mongoServer) await mongoServer.stop();
});

describe('POST /api/auth/login', () => {
  it('should login successfully with correct credentials', async () => {
    const payload = {
      username: 'testuser',
      password: 'password123'
    };

    const res = await request(app)
      .post('/api/auth/login')
      .send(payload)
      .expect(200);

    expect(res.body).toHaveProperty('message', 'Login successful');
    expect(res.body.user).toHaveProperty('username', 'testuser');
    expect(res.body.user).toHaveProperty('email', 'test@example.com');
    expect(res.body.user).not.toHaveProperty('password');
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('should return 400 if required fields are missing', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({})
      .expect(400);

    expect(res.body).toHaveProperty('message', 'Username and password are required');
  });

  it('should return 401 with invalid username', async () => {
    const payload = {
      username: 'wronguser',
      password: 'password123'
    };

    const res = await request(app)
      .post('/api/auth/login')
      .send(payload)
      .expect(401);

    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });

  it('should return 401 with invalid password', async () => {
    const payload = {
      username: 'testuser',
      password: 'wrongpassword'
    };

    const res = await request(app)
      .post('/api/auth/login')
      .send(payload)
      .expect(401);

    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });
});
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;
const { connectDB, closeDB } = require('../src/db/db');
const app = require('../src/app');
const User = require('../src/models/user.model');

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  // connect mongoose using our helper
  await connectDB(uri);
});

afterEach(async () => {
  // clear collections between tests
  await User.deleteMany({});
});

afterAll(async () => {
  await closeDB();
  if (mongoServer) await mongoServer.stop();
});

describe('POST /auth/register', () => {
  it('creates a user and returns 201 with basic info', async () => {
    const payload = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      fullname: { firstname: 'Test', lastname: 'User' }
    };

    const res = await request(app).post('/auth/register').send(payload).expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body).toMatchObject({ username: 'testuser', email: 'test@example.com' });

    const dbUser = await User.findOne({ username: 'testuser' }).lean();
    expect(dbUser).not.toBeNull();
    expect(dbUser.email).toBe('test@example.com');
  });

  it('returns 400 if required fields are missing', async () => {
    const res = await request(app).post('/auth/register').send({}).expect(400);
    expect(res.body).toHaveProperty('message');
  });

  it('returns 409 when user already exists', async () => {
    const payload = {
      username: 'dupuser',
      email: 'dup@example.com',
      password: 'password',
      fullname: { firstname: 'Dup', lastname: 'User' }
    };

    // create first
    await request(app).post('/auth/register').send(payload).expect(201);
    // attempt duplicate
    const res = await request(app).post('/auth/register').send(payload).expect(409);
    expect(res.body).toHaveProperty('message');
  });
});

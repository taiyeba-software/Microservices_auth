# Auth Microservice (local test setup)

This repository contains a small authentication microservice used for learning and testing. I added a Jest-based test setup that uses an in-memory MongoDB so tests do not touch your real database.

## What I changed / added

- `package.json`
  - Added devDependencies: `jest`, `supertest`, `mongodb-memory-server`.
  - Added a `test` script: `jest --runInBand` and a small Jest configuration (`testEnvironment: node`).

- `src/db/db.js` (modified)
  - Now exports `connectDB(uri)` (async) which accepts an optional MongoDB URI. If `uri` is omitted it falls back to `process.env.MONGO_URI`.
  - Added `closeDB()` to disconnect mongoose cleanly (used by tests).

- `src/app.js` (modified)
  - Enabled JSON request parsing (`express.json()`).
  - Mounted new auth routes at `/auth`.

- `src/routes/auth.js` (added)
  - New, minimal `POST /auth/register` route used by tests.
  - Validates required fields, checks duplicates, creates a `User` document, and returns minimal user info.

- `tests/auth.register.test.js` (added)
  - Jest tests using `supertest` and `mongodb-memory-server`.
  - Starts an in-memory MongoDB in `beforeAll`, connects using `connectDB(uri)`, and stops the server in `afterAll`.
  - Tests cover: successful registration (201), missing fields (400), duplicate user (409).

## Installed packages (from `package.json`)

Dependencies (already in your project):
- bcryptjs ^3.0.2
- cookie-parser ^1.4.7
- dotenv ^17.2.3
- express ^5.1.0
- jsonwebtoken ^9.0.2
- mongoose ^8.19.2

DevDependencies (added for tests):
- jest ^29.6.1
- supertest ^6.3.3
- mongodb-memory-server ^8.12.2

Total packages I added during the test setup: 3 dev packages.

## Test details & results

- Tests run with an in-memory MongoDB instance (`mongodb-memory-server`) so your original DB is not used or modified.
- I ran the test suite locally; results:

  - Test Suites: 1 passed
  - Tests: 3 passed

## How to run tests locally (Windows PowerShell notes)

On Windows PowerShell some systems block `npm` script wrappers due to execution policy. Use the `npm.cmd` and `npx.cmd` shims if you hit script blocked errors.

1. Install dependencies (from repository root):

```powershell
npm.cmd install
```

2. Run tests:

```powershell
npx.cmd jest --runInBand
# or (if your environment allows)
npm test
```

Notes:
- Tests use the exported `connectDB(uri)` from `src/db/db.js` so the in-memory MongoDB URI is passed directly to mongoose for test isolation.
- The `--runInBand` flag is used to avoid Jest worker issues with in-memory MongoDB.

## Security note

- I noticed a `.env` in the project containing a live MongoDB connection string. Please remove any secrets from the repository and use environment variables in CI or local dev. The test setup avoids using this URI by passing the in-memory server URI explicitly.

## Next steps (optional)

- Replace plain password storage with `bcryptjs` hashing and add tests asserting hashed passwords.
- Add CI (GitHub Actions) that runs these tests (the in-memory DB will work on CI without extra setup).
- Improve the `/auth/register` route to include proper validation, error handling, and JWT issuance.

If you want, I can implement password hashing and update tests now.

---

If anything is unclear or you want the README expanded (examples, API contract, environment variables, CI config), tell me which section to expand and I will update it.

# Job Board

A job board where users can register, login, post jobs, and apply for them. Built this to learn JWT authentication, MongoDB, and real-time features with Socket.io.

## What it does

- Register and login with email/password
- JWT tokens for protected routes
- Post a job (login required)
- Apply for jobs (login required)
- Admin can delete any job
- Real-time notification when someone applies
- Live jobs tab pulls from Arbeitnow public API

## Tech used

- Node.js + Express
- MongoDB Atlas
- JWT + bcrypt
- Socket.io

## How to run locally

1. Clone the repo
2. Create a `.env` file:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=3000
```
3. Install and start:
```bash
npm install
npm start
```
4. Open `http://localhost:3000`

## Folder structure

```
job-board/
├── src/
│   ├── server.js
│   ├── db.js
│   ├── middleware/auth.js
│   ├── routes/authRoutes.js
│   ├── routes/jobRoutes.js
│   ├── models/User.js
│   └── models/Job.js
├── public/
│   ├── index.html
│   ├── register.html
│   ├── jobs.html
│   └── style.css
└── package.json
```

## API endpoints

| Method | Endpoint | Auth required |
|--------|----------|---------------|
| POST | /auth/register | No |
| POST | /auth/login | No |
| GET | /jobs | No |
| POST | /jobs | Yes |
| POST | /jobs/:id/apply | Yes |
| DELETE | /jobs/:id | Admin only |

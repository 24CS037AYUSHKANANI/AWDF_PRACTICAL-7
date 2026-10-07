# AWDF Practical 7 — Ayush Kanani (24CS037)

## Authentication and Middleware Pipeline

This is the Practical 7 extension of the Task Management application.

### Included
- Express + MongoDB/Mongoose backend
- User registration with bcrypt password hashing
- JWT login with 1-hour expiry
- Authentication middleware
- Protected task CRUD routes
- Server-side task validation middleware
- `/auth/me`
- Frontend 401 handling
- Logout
- Delete confirmation
- Toast notifications
- Responsive React UI
- `.env` protection and `.env.example`

## Project layout

```text
24CS037_awdf_practical7/
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   └── routes/
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Backend

```bash
cd server
npm install
```

Copy `.env.example` to `.env` and set:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/awdf_24cs037?retryWrites=true&w=majority
JWT_SECRET=use_a_long_random_secret_here
PORT=5000
```

Start:

```bash
npm start
```

## Frontend

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

Open the Vite URL shown in the terminal, normally:

```text
http://localhost:5173
```

## API test sequence

### Register

`POST /auth/register`

```json
{
  "email": "ayush24cs037@example.com",
  "password": "Password@123"
}
```

### Login

`POST /auth/login`

```json
{
  "email": "ayush24cs037@example.com",
  "password": "Password@123"
}
```

Copy the returned JWT.

### Protected requests

Use:

```text
Authorization: Bearer <token>
```

for:

```text
GET    /auth/me
GET    /tasks
POST   /tasks
PUT    /tasks/:id
DELETE /tasks/:id
```

## Validation test

Send `POST /tasks` with:

```json
{
  "description": "Title is intentionally missing"
}
```

Expected response: `400`.

## GitHub

The Practical 7 brief asks for the same repository as Practical 6, updated with commits.

Suggested commit:

```text
feat: implement JWT authentication middleware
```

Never commit:

```text
server/.env
```

The `.gitignore` already excludes it.

## Deployment

Deployment is not explicitly required by the supplied Practical 7 GitHub Deliverables. A local working application and GitHub repository are sufficient for the stated requirements.

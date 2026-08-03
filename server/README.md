# CareerForge — Backend API

Production-ready Node.js / Express / MongoDB backend for the CareerForge AI Interview Platform.

---

## Tech Stack

| Layer        | Technology              |
|--------------|-------------------------|
| Runtime      | Node.js                 |
| Framework    | Express.js              |
| Database     | MongoDB + Mongoose      |
| Security     | Helmet, CORS, bcrypt    |
| Auth (Phase 2) | JWT + Cookie Sessions |
| Logging      | Morgan + custom logger  |
| Dev Server   | Nodemon                 |

---

## Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB running locally **or** a MongoDB Atlas connection string

### Installation

```bash
# From the project root
cd server
npm install
```

### Environment Setup

```bash
# Copy the template and fill in your values
cp .env.example .env
```

Minimum required variable:

```
MONGO_URI=mongodb://localhost:27017/careerforge
```

### Run

```bash
# Development (auto-restart on file changes)
npm run dev

# Production
npm start
```

---

## Available Scripts

| Script        | Description                    |
|---------------|--------------------------------|
| `npm run dev` | Start with nodemon (hot reload) |
| `npm start`   | Start without nodemon           |

---

## API Endpoints

| Method | Endpoint     | Description          | Auth Required |
|--------|-------------|----------------------|---------------|
| GET    | /api/health | Server health check  | No            |

> More endpoints will be added in subsequent phases (Auth, Interviews, Resume, etc.)

---

## Folder Structure

```
server/
├── src/
│   ├── config/
│   │   ├── db.js           ← Mongoose connection
│   │   └── env.js          ← Environment variable validation
│   ├── controllers/        ← Route handler functions (one per feature)
│   ├── middlewares/
│   │   ├── authMiddleware.js     ← JWT auth guard (Phase 2)
│   │   ├── errorMiddleware.js    ← Global error handler
│   │   └── notFoundMiddleware.js ← 404 handler
│   ├── models/             ← Mongoose schema definitions
│   ├── modules/            ← Feature-scoped bundles (auth, interview, …)
│   ├── routes/
│   │   └── healthRoutes.js ← GET /api/health
│   ├── services/           ← Business logic layer
│   ├── utils/
│   │   ├── ApiError.js     ← Custom error class
│   │   ├── ApiResponse.js  ← Standardized response class
│   │   └── logger.js       ← Console logger wrapper
│   ├── validators/         ← express-validator rule sets
│   ├── app.js              ← Express app configuration
│   └── server.js           ← Entry point
├── .env                    ← Local environment variables (not committed)
├── .gitignore
├── package.json
└── README.md
```

---

## Error Response Format

All errors follow a consistent shape:

```json
{
  "success": false,
  "statusCode": 404,
  "message": "Route not found: GET /api/xyz"
}
```

Validation errors include a field-level `errors` array:

```json
{
  "success": false,
  "statusCode": 422,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Must be a valid email address" }
  ]
}
```

---

## Success Response Format

```json
{
  "success": true,
  "statusCode": 200,
  "message": "CareerForge Backend Running",
  "data": {
    "timestamp": "2026-08-04T00:00:00.000Z",
    "uptime": "42s",
    "env": "development"
  }
}
```

---

## Future Phases

- **Phase 2** — Authentication (Register / Login / Refresh / Logout)
- **Phase 3** — User Profile & Dashboard
- **Phase 4** — AI Mock Interview Engine
- **Phase 5** — Resume Parser & Scorer
- **Phase 6** — Roadmap & Analytics

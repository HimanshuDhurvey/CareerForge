# CareerForge 🚀
> **AI-Powered Career Development & Technical Interview Platform**

[![React 19](https://img.shields.io/badge/Frontend-React_19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js_24-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js 5](https://img.shields.io/badge/Framework-Express_5-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB Atlas](https://img.shields.io/badge/Database-MongoDB_Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/cloud/atlas)
[![Gemini AI](https://img.shields.io/badge/AI-Google_Gemini_1.5_Flash-4285F4?logo=google-gemini&logoColor=white)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 📌 Overview

**CareerForge** is an advanced, production-grade MERN (MongoDB, Express.js, React, Node.js) platform designed to empower software engineering candidates, fresh graduates, and experienced developers in preparing for technical careers.

### Problem It Solves
Traditional career preparation is fragmented and overly optimistic. Candidates lack realistic, recruiter-grade resume screening feedback and struggle to find interactive mock interviews that evaluate real-time technical depth, communication, and problem-solving.

### Target Users
- Software Engineering Candidates (Frontend, Backend, Full-Stack, System Design)
- Fresh Computer Science Graduates & Engineering Students
- Job Seekers preparing for FAANG and top-tier tech company screening rounds

### Key AI-Powered Highlights
- **FAANG-Recruiter Grade Resume Evaluation Engine**: Uses Google Gemini AI to perform strict ATS compatibility checks, structural impact audits, keyword gap analysis, and version progress tracking.
- **AI Interview Engine & Single-Request Evaluation**: Simulates real technical interview sessions and generates comprehensive multidimensional feedback (Technical Depth, Communication, Problem Solving, and question-by-question scoring).
- **Unified Central Hub Dashboard**: Single aggregated backend endpoint (`GET /api/dashboard`) calculating a dynamic Career Readiness Score, live metrics, and actionable recommendations.

---

## ✨ Features

### 🔐 Authentication Module
- User Registration & Secure Login with bcrypt password hashing.
- Standard JSON Web Token (JWT) Bearer authentication & route protection.
- Auto-initialization of profile state upon registration.
- Client-side AuthContext state management with token auto-injection.

### 👤 Career Profile Module
- Comprehensive candidate profile management (Target Role, Target Company, Academic Credentials, Bio, Social Links, Avatar).
- User document credential synchronization (Name & Avatar updates automatically reflect across User & Profile).
- Field validation with inline error messaging and read-only email protection.

### 📄 Resume Management & Preview
- Drag-and-Drop / File Picker PDF upload (PDF format only, max 5 MB).
- Native PDF streaming endpoint (`GET /api/resume/file/:filename`) for in-app preview iframe & direct downloads.
- Atomic resume replacement & file deletion cleanup.

### 🤖 AI Resume Analyzer (Gemini AI)
- **FAANG-Recruiter Persona**: Strict, non-inflated scoring guidelines matching senior recruiter standards.
- **Detailed Metrics**: Overall Resume Quality, ATS Compatibility, Technical Skills, Projects, Content Impact, Formatting, and Grammar scores.
- **Structured Feedback**: Executive summary, key strengths, weaknesses, missing keywords (+ missing link penalties), recommended projects, and ATS parser warnings.
- **Progress Tracking & Versions**: Version history cards with sub-score deltas (`▲ +8 Overall`, `▲ +5 ATS`, `▼ -2 Skills`), grade filters (`All`, `90+`, `80-89`, `70-79`, `<70`), search bar, paginated grid, and side-by-side report comparison modal.
- **Clear History / Batch Deletion**: Dedicated `DELETE /api/resume/analysis/all` route for bulk history cleanup.

### 🎙️ AI Interview Engine
- **Flexible Question Bank**: Categorized by role (Full-Stack, Frontend, Backend) and difficulty (Beginner, Intermediate, Advanced).
- **Session Tracking**: Real-time step-by-step candidate answer collection, progress indicators, timer tracking, and session status (`in_progress` → `completed`).
- **Post-Interview Guidance**: Interactive "What's Next?" action cards guiding users to feedback reports, new session setups, or resume optimization.

### 📊 AI Interview Evaluation Engine
- **Single-Request AI Processing**: Evaluates the entire completed interview in a single Gemini AI call for optimal latency and consistency.
- **Multidimensional Scoring**: Overall Performance Score, Technical Depth, Communication Clarity, and Problem Solving.
- **Question-by-Question Analysis**: Per-question score ring, strengths, missing technical concepts, and ideal sample answer.
- **Actionable Growth Steps**: Priority improvement recommendations & performance verdict (`Outstanding`, `Strong Candidate`, `Average Candidate`, `Needs Work`).

### 📊 Central Hub Dashboard
- Single aggregated endpoint `GET /api/dashboard` executing non-blocking parallel queries (`Promise.all`).
- **Profile Summary**: Avatar, User Name, Target Role, Email, Profile Completion %.
- **Resume Card**: Latest Resume Score, ATS Score, Status, Download/View CTA buttons.
- **Interview Card**: Total Interviews, Completed Count, Avg Score, Best Score, Start Interview CTA button.
- **Career Readiness Score**: Formula: `Math.round(0.4 * ResumeScore + 0.4 * InterviewScore + 0.2 * ATSScore)`.
- **Recent Activity Timeline**: Merged chronological event stream (Resume Uploaded, Analyzed, Interview Started, Completed, Evaluation Generated).
- **AI Insights & Skill Overview**: Top Strengths, Top Weaknesses, and Strong vs Weak Skills progress bars.
- **Top 5 Action Steps**: Curated priority recommendations for career readiness.
- **Recent Reports**: Direct quick-access cards to latest Resume Analysis and Interview Evaluation reports.

---

## 🛠️ Tech Stack

| Category | Technology | Description |
|:---|:---|:---|
| **Frontend** | React 19, Vite 8, React Router 7 | High-performance SPA frontend with Vite HMR |
| **Styling** | Tailwind CSS 4, Lucide React Icons | Modern responsive dark-themed UI components |
| **Backend** | Node.js v24, Express.js 5 | Layered MVC RESTful API backend server |
| **Database** | MongoDB Atlas, Mongoose 9 | NoSQL cloud database & ODM schema modeling |
| **Authentication** | JWT (jsonwebtoken), bcryptjs | Secure Bearer token authentication & hashing |
| **AI Services** | `@google/generative-ai` (Gemini 1.5 Flash) | Google AI SDK for structured resume & interview grading |
| **File Handling** | Multer, `pdf-parse` v2 | PDF upload handling, storage guard, and text extraction |
| **Validation & Security** | Helmet, CORS, `express-validator` | Security headers, request sanitization & schema validation |
| **Logging** | Winston & Morgan | HTTP request logging and structured system logger |

---

## 🏗️ System Architecture

```mermaid
graph TD
    A[Client: React 19 + Vite] -->|REST API Requests / JWT Bearer| B[Express 5 API Gateway]
    B --> C{Authentication Middleware}
    C -->|Authorized| D[Controllers Layer]
    D --> E[Service Layer]
    E -->|Mongoose ODM| F[(MongoDB Atlas)]
    E -->|PDF Text Extraction| G[pdf-parse Engine]
    E -->|Google AI SDK| H[Gemini 1.5 Flash AI API]
    G --> H
    H -->|Structured JSON Response| E
```

---

## 📁 Folder Structure

```
AI_Interview_Platform/
├── client/                      # React 19 Vite Frontend
│   ├── src/
│   │   ├── assets/              # Logos and static media assets
│   │   ├── components/          # Shared layout guards (ProtectedRoute, ProfileDropdown)
│   │   ├── context/             # AuthContext & InterviewContext global state providers
│   │   ├── features/            # Feature-driven page modules
│   │   │   ├── auth/            # Login and Register pages
│   │   │   ├── dashboard/       # Central Hub Dashboard, Sidebar, TopNavbar, Widgets
│   │   │   ├── interview/       # Interview Setup, Instructions, Session, Details, History, Feedback
│   │   │   ├── landing/         # Marketing Landing Page
│   │   │   ├── profile/         # Candidate Profile cards and Edit Modal
│   │   │   └── resume/          # Resume Analyzer, Score Rings, Version Tracker & Compare Modal
│   │   ├── services/            # Axios API service wrappers (auth, profile, resume, interview, ai, dashboard)
│   │   ├── App.jsx              # Main Router switch configuration
│   │   └── main.jsx             # React entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                      # Node.js 24 Express 5 Backend
│   ├── src/
│   │   ├── ai/                  # Gemini AI prompts, services & heuristic fallback engines
│   │   ├── config/              # Environment validator & Winston logger
│   │   ├── controllers/         # HTTP request handlers (auth, profile, resume, interview, ai, dashboard)
│   │   ├── middlewares/         # Auth (JWT), Upload (Multer), Error, and 404 handlers
│   │   ├── models/              # Mongoose schemas (User, Profile, Resume, ResumeAnalysis, Interview, Evaluation, Question)
│   │   ├── routes/              # Express REST routes (auth, profile, resume, interview, ai, dashboard)
│   │   ├── services/            # Core business logic layer (analysisService, aiEvaluationService, dashboardService)
│   │   ├── utils/               # ApiError and ApiResponse wrapper classes
│   │   ├── validators/          # Express-validator rule sets
│   │   ├── app.js               # Express application factory
│   │   └── server.js            # Server listener entry point
│   ├── uploads/                 # Local disk upload storage (PDF Resumes)
│   ├── .env                     # Server environment configuration
│   └── package.json
│
└── README.md                    # Root project documentation
```

---

## 📡 API Modules & Key Endpoints

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/register` — Register candidate account
- `POST /api/auth/login` — Authenticate and issue JWT token
- `POST /api/auth/logout` — Logout user
- `GET /api/auth/me` — Get authenticated user details

### 👤 Profile (`/api/profile`)
- `GET /api/profile` — Fetch candidate profile document
- `PUT /api/profile` — Update candidate profile & sync user attributes

### 📄 Resume & AI Analysis (`/api/resume`)
- `GET /api/resume` — Fetch active resume metadata
- `POST /api/resume/upload` — Upload PDF resume (`multipart/form-data`)
- `DELETE /api/resume` — Delete active resume and disk PDF file
- `GET /api/resume/file/:filename` — Stream PDF file for iframe preview
- `POST /api/resume/analyze` — Trigger strict Gemini AI resume analysis
- `GET /api/resume/analysis` — Fetch latest analysis report
- `GET /api/resume/analysis/history` — Fetch historical analysis versions
- `DELETE /api/resume/analysis/:id` — Delete specific analysis report
- `DELETE /api/resume/analysis/all` — Clear all analysis history reports

### 🎙️ Interview Engine (`/api/interviews`)
- `POST /api/interviews` — Initialize new interview session
- `GET /api/interviews` — Fetch user's interview history
- `GET /api/interviews/:id` — Fetch interview session details
- `PATCH /api/interviews/:id` — Save answer & update session progress
- `DELETE /api/interviews/:id` — Delete interview record

### 📊 AI Evaluation (`/api/ai`)
- `POST /api/ai/evaluate/:interviewId` — Run single-request Gemini AI evaluation
- `GET /api/ai/evaluation/:interviewId` — Fetch evaluation report for session

### 📈 Central Dashboard (`/api/dashboard`)
- `GET /api/dashboard` — Single aggregated endpoint returning profile, resume, interview, readiness score, AI insights, and activities.

---

## 🧠 AI Workflows

### 1. AI Resume Analysis Workflow
```
[ PDF Upload ] ──> [ Multer Disk Guard ] ──> [ pdf-parse Text Extraction ]
                                                       │
[ Mongoose DB ] <── [ Structured JSON ] <── [ Gemini 1.5 Flash AI Engine ]
       │
[ Frontend Dashboard ] <── [ Progress Tracker & Compare Modal ]
```

### 2. AI Interview Evaluation Workflow
```
[ Interview Session ] ──> [ Candidate Answers Collected ] ──> [ Session Completed ]
                                                                     │
[ Interview Report ] <── [ Mongoose DB ] <── [ Gemini Single-Request Evaluator ]
```

---

## ⚡ Installation & Setup Guide

### Prerequisites
- **Node.js** v18+ (v24 recommended)
- **npm** v9+
- **MongoDB Atlas** database URI (or local MongoDB instance)
- **Google Gemini AI API Key** (Get key from [Google AI Studio](https://aistudio.google.com/))

### 1. Clone Repository
```bash
git clone https://github.com/HimanshuDhurvey/CareerForge.git
cd AI_Interview_Platform
```

### 2. Backend Setup (`server`)
```bash
cd server
npm install
```
Create a `.env` file inside `server/`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/careerforge?retryWrites=true&w=majority
CLIENT_ORIGIN=http://localhost:5173
JWT_ACCESS_SECRET=careerforge_access_secret_s3cur3_k3y_2026
JWT_REFRESH_SECRET=careerforge_refresh_secret_s3cur3_k3y_2026
GEMINI_API_KEY=your_google_gemini_api_key_here
```
Run backend server:
```bash
npm run dev
```

### 3. Frontend Setup (`client`)
Open a new terminal:
```bash
cd client
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🔑 Environment Variables Reference

| Variable | Required | Sample Value | Description |
|:---|:---:|:---|:---|
| `PORT` | Yes | `5000` | Backend Express server port |
| `NODE_ENV` | Yes | `development` | Environment mode (`development` / `production`) |
| `MONGO_URI` | Yes | `mongodb+srv://user:pass@cluster.mongodb.net/db` | MongoDB Atlas connection string |
| `CLIENT_ORIGIN` | Yes | `http://localhost:5173` | Allowed CORS frontend origin |
| `JWT_ACCESS_SECRET` | Yes | `careerforge_access_secret_2026` | Secret key for signing JWT tokens |
| `JWT_REFRESH_SECRET` | Yes | `careerforge_refresh_secret_2026` | Secret key for signing refresh tokens |
| `GEMINI_API_KEY` | Yes | `AIzaSyD...` | Google Gemini AI API key for evaluation engines |

---

## 🖼️ Application Preview

<details>
<summary>📸 Click to expand Application Screenshot Placeholders</summary>

| View | Screenshot Placeholder |
|:---|:---|
| **Landing Page** | ![Landing Page](https://via.placeholder.com/800x450?text=CareerForge+Landing+Page) |
| **Central Hub Dashboard** | ![Dashboard](https://via.placeholder.com/800x450?text=CareerForge+Central+Dashboard) |
| **Resume Analyzer** | ![Resume Analyzer](https://via.placeholder.com/800x450?text=CareerForge+Resume+Analyzer) |
| **AI Resume Evaluation Report** | ![Resume Report](https://via.placeholder.com/800x450?text=CareerForge+AI+Resume+Report) |
| **Interview Setup** | ![Interview Setup](https://via.placeholder.com/800x450?text=CareerForge+Interview+Setup) |
| **Interview Session** | ![Interview Session](https://via.placeholder.com/800x450?text=CareerForge+Interview+Session) |
| **AI Interview Report** | ![Interview Report](https://via.placeholder.com/800x450?text=CareerForge+AI+Interview+Report) |
| **Candidate Profile** | ![Profile](https://via.placeholder.com/800x450?text=CareerForge+Candidate+Profile) |

</details>

---

## 📊 Current Project Status

- [x] **Authentication Module**: Register, Login, JWT Middleware, Protected Routes
- [x] **Career Profile**: Profile Management, Avatar Sync, Personal & Academic Details
- [x] **Resume Module**: Drag-and-Drop PDF Upload, Streaming Preview Modal, Replace/Delete
- [x] **AI Resume Analyzer**: Gemini AI FAANG Recruiter Evaluation, ATS Compatibility, Score Rings
- [x] **Resume Analytics & Version Tracker**: Progress History Cards, Sub-Score Deltas, Compare Reports Modal
- [x] **Interview Engine**: Question Bank, Session Setup, Dynamic Session Tracking, Next Steps Guidance
- [x] **AI Interview Evaluation**: Single-Request Gemini AI Evaluation, Question-by-Question Scoring
- [x] **Central Hub Dashboard**: Aggregated `GET /api/dashboard` endpoint, Career Readiness Score, Activity Stream
- [ ] **Coding Practice Room** *(Coming Soon)*
- [ ] **AI Career Roadmap Generator** *(Coming Soon)*
- [ ] **AI Career Mentor Coach** *(Coming Soon)*

---

## 🗺️ Product Roadmap

### Version 1.0 (Completed)
- Full MERN Architecture with JWT Bearer Token Security.
- FAANG Recruiter Grade Resume Evaluation with Version Progress Tracker.
- Single-Request AI Interview Evaluation Engine with Question-wise Feedback.
- Central Aggregated Hub Dashboard with Career Readiness Score.

### Version 2.0 (Upcoming)
- **Coding Practice Room**: Interactive code editor with test case execution.
- **AI Career Roadmap**: Personalized milestone path generation based on target roles.
- **AI Mentor Coach**: Real-time Q&A assistant for interview preparation.
- **Company-wise Question Banks**: Specialized question packages for top tech firms.
- **Admin Dashboard**: System telemetry and content management.

---

## 🔒 Security & Data Protection

- **JWT Authentication**: Secure Bearer authorization tokens with standard request header injection.
- **Route Guard Protection**: Server-side `protect` middleware guarding all sensitive profile, resume, interview, and dashboard routes.
- **Strict Input Validation**: `express-validator` schema validation preventing malformed requests.
- **File Upload Security**: Multer file filter enforcing PDF format restrictions & 5 MB file size caps.

---

## ⚡ Performance Optimization

- **Single Dashboard Aggregation Endpoint**: `GET /api/dashboard` runs non-blocking `Promise.all` queries across 5 collections, reducing round-trips to 1 request.
- **Single-Request AI Interview Evaluation**: Evaluates all interview questions in a single AI call to minimize API latency.
- **Database Query Optimization**: Mongoose indexing on `user` foreign keys and targeted `.select()` projections.
- **Frontend Optimization**: Vite 8 HMR bundler with paginated history grid and lazy loading.

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the Repository.
2. Create a feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for details.

---

## 👨‍💻 Author

**Himanshu Dhurvey**
- **GitHub**: [@HimanshuDhurvey](https://github.com/HimanshuDhurvey)
- **Repository**: [CareerForge](https://github.com/HimanshuDhurvey/CareerForge)

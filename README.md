# CareerForge – AI Powered Career Development Platform

[![React](https://img.shields.io/badge/Frontend-React_19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Bundler-Vite_8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS_4-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js_24-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Framework-Express_5-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB Atlas](https://img.shields.io/badge/Database-MongoDB_Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/cloud/atlas)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Project Status](https://img.shields.io/badge/Status-Active_Development-orange)](#current-development-progress)

---

## 📌 Project Description

**CareerForge** is a modern, full-stack MERN (MongoDB, Express.js, React, Node.js) platform designed to empower students, fresh graduates, and software engineering candidates in preparing for technical careers.

The platform provides a comprehensive suite of career preparation tools, including secure authentication, candidate profile management, interactive resume management with ATS upload capabilities, AI interview preparation, and career roadmaps. CareerForge is being developed incrementally using modular production-grade software engineering patterns.

---

## ✨ Key Features

- **🔐 Authentication & Access Control**
  - Email & password registration with client and server input validation.
  - Secure JWT authentication with localStorage persistence and Bearer header injection.
  - Protected routes guarding candidate dashboards, profile management, and career modules.

- **📊 Centralized Candidate Dashboard**
  - Responsive sidebar navigation with dark mode support.
  - Top navigation bar featuring dynamic candidate initials avatar and real-time profile integration.
  - Recent candidate activities, quick action cards, and progress metrics.

- **👤 Complete Profile Management**
  - Candidate profile details including Personal Info, Academic Info, Target Role, and Target Company.
  - Form validation with inline error messaging and editable fields (Date of Birth, Phone, College, Degree, Branch, Graduation Year, Skills, Bio, Location, Social Links, Avatar URL).
  - Synchronized user credentials (Full Name and Avatar) between `User` and `Profile` collections.
  - Read-only email address protection.

- **📄 Interactive Resume Management**
  - Drag-and-drop and file browser PDF resume upload (PDF format only, maximum size 5 MB).
  - Real-time upload progress bar and instant metadata refresh.
  - PDF preview modal with in-app `iframe` viewing and fallback "Open in New Tab" capabilities.
  - One-click resume replacement and deletion with confirmation dialogs.
  - Backend streaming endpoint serving uploaded PDFs directly.

- **🤖 AI Integration Ready**
  - Prepared Gemini AI integration layer for resume ATS scoring and interview feedback.
  - Structured prompt generators and JSON parsing services.

---

## 🚀 Current Development Progress

| Module | Status | Description |
|:---|:---:|:---|
| **Authentication Module** | ✅ Completed | Register, Login, Logout, JWT middleware, Password hashing, Protected Routes |
| **Dashboard Core** | ✅ Completed | Responsive layout, Top navbar, Sidebar, Search bar, Candidate dropdown |
| **User Profile Module** | ✅ Completed | Profile schema, GET/PUT endpoints, form validation, User document sync |
| **Resume Analyzer Module** | ✅ Completed | PDF upload, Drag & Drop, preview iframe, download, replace, delete, metadata |
| **AI Interview Module** | 🚧 In Progress | Mock interview session setup, audio recording, and feedback generation |
| **Coding Practice Room** | 🔮 Planned | Technical problem solving workspace and code executor |
| **Career Roadmap Generator** | 🔮 Planned | AI-generated learning paths tailored to candidate target roles |
| **AI Mentor Coach** | 🔮 Planned | Interactive AI career guidance and Q&A chat |

---

## 🛠️ Tech Stack

### Frontend
- **Library:** [React 19](https://react.dev/)
- **Build Tool:** [Vite 8](https://vitejs.dev/)
- **Routing:** [React Router 7](https://reactrouter.com/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **HTTP Client:** [Axios](https://axios-http.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Notifications:** [React Hot Toast](https://react-hot-toast.com/)
- **Form Management:** [React Hook Form](https://react-hook-form.com/)
- **Charts:** [Recharts](https://recharts.org/)

### Backend
- **Runtime:** [Node.js v24](https://nodejs.org/)
- **Framework:** [Express.js 5](https://expressjs.com/)
- **Database:** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **ODM:** [Mongoose 9](https://mongoosejs.com/)
- **Authentication:** [JSON Web Token (jsonwebtoken)](https://github.com/auth0/node-jsonwebtoken) & [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- **File Handling:** [Multer](https://github.com/expressjs/multer) & [pdf-parse](https://github.com/nicolas-van/pdf-parse)
- **Validation:** [Express Validator](https://express-validator.github.io/)
- **Security:** [Helmet](https://helmetjs.github.io/), [CORS](https://github.com/expressjs/cors), [cookie-parser](https://github.com/expressjs/cookie-parser)
- **Logging:** [Winston](https://github.com/winstonjs/winston) & [Morgan](https://github.com/expressjs/morgan)

### Planned AI & Cloud Services
- **AI Service:** [@google/generative-ai (Gemini 1.5 Flash)](https://ai.google.dev/)
- **Storage:** Cloudinary / Local Disk Storage

---

## 🏗️ Project Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Client Layer                       │
│      React 19 + Vite + Tailwind CSS + Axios Client      │
└────────────────────────────┬────────────────────────────┘
                             │ HTTP / REST API (JWT Header)
                             ▼
┌─────────────────────────────────────────────────────────┐
│                    Express.js Router                    │
│    CORS · Helmet Security · CookieParser · Auth Guard   │
└────────────────────────────┬────────────────────────────┘
                             │
            ┌────────────────┴────────────────┐
            ▼                                 ▼
┌───────────────────────┐         ┌───────────────────────┐
│  Auth / Profile /     │         │   Resume File Router  │
│  Interview Controllers│         │   (Multer Disk Guard) │
└───────────┬───────────┘         └───────────┬───────────┘
            │                                 │
            ▼                                 ▼
┌───────────────────────┐         ┌───────────────────────┐
│ Service Layer Logic   │         │ File Storage System   │
│ Sync User & Profile   │         │ server/uploads/resumes│
└───────────┬───────────┘         └───────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────┐
│                    MongoDB Atlas                        │
│          Collections: users · profiles · resumes        │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Folder Structure

```
AI_Interview_Platform/
├── client/                      # React Frontend Application
│   ├── src/
│   │   ├── assets/              # Static media assets and logos
│   │   ├── components/          # Reusable shared components (ProtectedRoute, ProfileDropdown)
│   │   ├── context/             # AuthContext provider and global state
│   │   ├── features/            # Feature-based pages and UI modules
│   │   │   ├── auth/            # Login and Register pages
│   │   │   ├── dashboard/       # Dashboard workspace, Sidebar, TopNavbar
│   │   │   ├── interview/       # AI Interview setup, session, and feedback pages
│   │   │   ├── landing/         # Marketing landing page
│   │   │   ├── profile/         # Candidate profile cards and edit modal
│   │   │   └── resume/          # Resume Analyzer dashboard page
│   │   ├── services/            # Axios API integration clients (authService, profileService, resumeService)
│   │   ├── App.jsx              # Main router switch configuration
│   │   └── main.jsx             # React entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                      # Node.js Express Backend Application
│   ├── src/
│   │   ├── ai/                  # Gemini AI prompts and service configuration
│   │   ├── config/              # Environment configs and logger setup
│   │   ├── controllers/         # HTTP request handler functions
│   │   ├── middlewares/        # Auth (JWT), Upload (Multer), and Error handlers
│   │   ├── models/              # Mongoose schemas (userModel, profileModel, resumeModel)
│   │   ├── routes/              # Express API route modules
│   │   ├── services/            # Business service layer
│   │   ├── utils/               # ApiError, ApiResponse wrappers
│   │   ├── validators/          # Express-validator schema rules
│   │   ├── app.js               # Express application setup
│   │   └── server.js            # Server entry point
│   ├── uploads/                 # Local disk upload storage (PDF resumes)
│   ├── .env                     # Server environment settings
│   └── package.json
│
└── README.md                    # Project documentation
```

---

## ⚡ Installation & Setup Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account or local MongoDB instance

### 1. Clone the Repository
```bash
git clone https://github.com/HimanshuDhurvey/CareerForge.git
cd AI_Interview_Platform
```

### 2. Backend Setup
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Configure environment variables (see Environment Variables section)
# Start the server in development mode
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

---

## 🔑 Environment Variables

Create a `.env` file inside the `server/` directory with the following variables:

```env
# Server Environment
NODE_ENV=development
PORT=5000

# Database Connection String (MongoDB Atlas or Local)
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/careerforge?retryWrites=true&w=majority

# Client Origin (CORS Whitelist)
CLIENT_ORIGIN=http://localhost:5173

# Authentication Secrets
JWT_ACCESS_SECRET=careerforge_access_secret_s3cur3_k3y_2026
JWT_REFRESH_SECRET=careerforge_refresh_secret_s3cur3_k3y_2026
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Gemini AI Integration (Future Phase)
GEMINI_API_KEY=your_gemini_api_key_here
```

| Variable | Required | Default | Description |
|:---|:---:|:---:|:---|
| `NODE_ENV` | Yes | `development` | Environment mode (`development` or `production`) |
| `PORT` | Yes | `5000` | HTTP port for the Express backend server |
| `MONGO_URI` | Yes | — | MongoDB connection string |
| `CLIENT_ORIGIN` | Yes | `http://localhost:5173` | Allowed frontend origin for CORS requests |
| `JWT_ACCESS_SECRET` | Yes | — | Secret key used to sign access tokens |
| `JWT_REFRESH_SECRET` | Yes | — | Secret key used to sign refresh tokens |
| `GEMINI_API_KEY` | Optional | — | Google Gemini AI API key for resume analysis |

---

## 📜 Available Scripts

### Backend (`server/`)
```bash
# Run server in development mode with nodemon auto-restart
npm run dev

# Run server in production mode
npm start
```

### Frontend (`client/`)
```bash
# Start Vite development server
npm run dev

# Build production bundle
npm run build

# Preview production build locally
npm run preview

# Run Oxlint linting check
npm run lint
```

---

## 📡 API Reference Overview

### Authentication Endpoint (`/api/auth`)
| Method | Endpoint | Access | Description |
|:---|:---|:---:|:---|
| `POST` | `/api/auth/register` | Public | Register new candidate account |
| `POST` | `/api/auth/login` | Public | Authenticate candidate and return JWT access token |
| `POST` | `/api/auth/logout` | Private | Clear candidate session credentials |
| `GET` | `/api/auth/me` | Private | Retrieve authenticated candidate profile |

### Profile Endpoints (`/api/profile`)
| Method | Endpoint | Access | Description |
|:---|:---|:---:|:---|
| `GET` | `/api/profile` | Private | Fetch candidate profile (auto-initializes if new) |
| `PUT` | `/api/profile` | Private | Update editable candidate profile fields |

### Resume Endpoints (`/api/resume`)
| Method | Endpoint | Access | Description |
|:---|:---|:---:|:---|
| `GET` | `/api/resume` | Private | Retrieve active candidate resume metadata |
| `POST` | `/api/resume/upload` | Private | Upload PDF resume (`multipart/form-data`) |
| `DELETE` | `/api/resume` | Private | Delete resume metadata and file from disk |
| `GET` | `/api/resume/file/:filename` | Public | Stream PDF file for in-app preview or download |
| `POST` | `/api/resume/analyze` | Private | Trigger Gemini AI resume analysis |

> **Note:** AI Interview API endpoints (`/api/interviews`) are currently under active development.

---

## 🔄 Core Workflows

### Authentication Flow
```
User (Browser)               React (Client)             Express (Backend)             MongoDB
      │                            │                            │                        │
      ├─── Enter Credentials ─────►│                            │                        │
      │    Submit Form             ├─── POST /api/auth/login ──►│                        │
      │                            │    { email, password }     ├─── Find User ─────────►│
      │                            │                            │    by Email            │
      │                            │                            │◄── User Doc ───────────┤
      │                            │                            │                        │
      │                            │                            ├─── Verify Password     │
      │                            │                            │    (bcrypt.compare)    │
      │                            │                            │                        │
      │                            │                            ├─── Sign JWT Token ────┐│
      │                            │                            │◄──────────────────────┘│
      │                            │◄── 200 OK + JWT + User ────┤                        │
      │                            │                            │                        │
      │                            ├─── Store JWT in            │                        │
      │                            │    localStorage            │                        │
      │                            ├─── Update AuthContext      │                        │
      │◄── Redirect to Dashboard ──┤                            │                        │
```

### Resume Upload & Storage Flow
```
User (Browser)               React (Client)             Multer / Server               MongoDB
      │                            │                            │                        │
      ├─── Drag & Drop PDF ───────►│                            │                        │
      │    or Click Upload         ├─── Validate File Type      │                        │
      │                            │    (PDF & <= 5MB)          │                        │
      │                            │                            │                        │
      │                            ├─── POST /api/resume/upload►│                        │
      │                            │    (multipart/form-data)   ├─── Multer Disk Storage │
      │                            │    Progress Callback       │    Save to uploads/    │
      │                            │◄── Progress (0 - 100%) ───│    resumes/            │
      │                            │                            │                        │
      │                            │                            ├─── Upsert Resume Doc ─►│
      │                            │                            │◄── Saved Resume Doc ───┤
      │                            │                            │                        │
      │                            │◄── 201 Created + Metadata ──┤                        │
      │◄── Render Success Toast ───┤                            │                        │
```

---

## 🖼️ Application Preview

<details>
<summary>📸 Click to view Application Screenshot Placeholders</summary>

| View | Preview Placeholder |
|:---|:---|
| **Landing Page** | ![Landing Page](https://via.placeholder.com/800x450?text=CareerForge+Landing+Page) |
| **Candidate Dashboard** | ![Dashboard](https://via.placeholder.com/800x450?text=CareerForge+Dashboard) |
| **Career Profile** | ![Profile](https://via.placeholder.com/800x450?text=CareerForge+Candidate+Profile) |
| **Resume Analyzer** | ![Resume Analyzer](https://via.placeholder.com/800x450?text=CareerForge+Resume+Analyzer) |
| **AI Interview Setup** | ![AI Interview](https://via.placeholder.com/800x450?text=CareerForge+AI+Interview+Setup) |

</details>

---

## 🗺️ Product Roadmap

- [x] **Phase 1: Foundation & Authentication**
  - [x] Project architecture setup
  - [x] User registration & login with JWT
  - [x] Client AuthContext & Protected Route guards
- [x] **Phase 2: Candidate Dashboard & Navigation**
  - [x] Responsive layout with dark theme support
  - [x] Top navigation & sidebar menus
- [x] **Phase 3: Candidate Profile Module**
  - [x] Mongoose Profile model & user synchronization
  - [x] Form validation for academic, career, and personal details
  - [x] Editable profile features with backend API integration
- [x] **Phase 4: Resume Analyzer Module**
  - [x] PDF file upload & local disk storage
  - [x] File streaming endpoint and PDF preview modal
  - [x] Full CRUD operations (upload, view, download, replace, delete)
- [ ] **Phase 5: AI Interview Module (In Progress)**
  - [ ] Interactive mock interview interface
  - [ ] Speech & text response capture
  - [ ] Gemini AI interview evaluation and scoring
- [ ] **Phase 6: Advanced Career Tools (Planned)**
  - [ ] Coding Practice room with syntax highlighting
  - [ ] AI-generated career roadmap paths
  - [ ] Real-time progress analytics and achievements

---

## 🌟 Key Engineering Highlights

- **🔐 Production-Ready JWT Security:** Authentication utilizes standard HTTP Bearer token headers, persistent state sync, and strict server-side validation using `express-validator`.
- **📂 Clean Modular Backend Architecture:** Strict layer separation (Routes → Controllers → Services → Models) guarantees high code maintainability.
- **📄 Native PDF Handling:** Complete local disk file lifecycle management with atomic replacement and cleanup on deletion.
- **🎨 Modern Responsive UI:** Modern aesthetics powered by React 19, Tailwind CSS v4, Lucide icons, and React Hot Toast.
- **⚡ Fast Developer Experience:** Vite 8 HMR frontend development combined with Nodemon auto-reloading backend environment.

---

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute to CareerForge, please follow these steps:

1. Fork the project repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).

---

## 👨‍💻 Author

**Himanshu Dhurvey**  
- GitHub: [@HimanshuDhurvey](https://github.com/HimanshuDhurvey)  
- Repository: [CareerForge](https://github.com/HimanshuDhurvey/CareerForge)

---

## 🙏 Acknowledgements

- [React Team](https://react.dev/) for React 19.
- [Vite Team](https://vitejs.dev/) for the ultra-fast build tooling.
- [Tailwind Labs](https://tailwindcss.com/) for Tailwind CSS.
- [Lucide](https://lucide.dev/) for icon designs.

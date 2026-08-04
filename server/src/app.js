'use strict';

/**
 * app.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Express application factory.
 *
 * This module configures and exports the Express app object.
 * It does NOT start the HTTP server — that is done in server.js.
 *
 * Middleware stack (in order):
 *   1. helmet          — HTTP security headers
 *   2. cors            — Cross-Origin Resource Sharing
 *   3. morgan          — HTTP request logging
 *   4. express.json    — JSON body parser
 *   5. urlencoded      — Form body parser
 *   6. cookieParser    — Cookie header parser
 *   7. Routes          — Application routes
 *   8. 404 handler     — Catch unmatched routes
 *   9. Error handler   — Global error formatter
 */

const express      = require('express');
const helmet       = require('helmet');
const cors         = require('cors');
const morgan       = require('morgan');
const cookieParser = require('cookie-parser');

const healthRoutes       = require('./routes/healthRoutes');
const authRoutes         = require('./routes/authRoutes');
const profileRoutes      = require('./routes/profileRoutes');
const resumeRoutes       = require('./routes/resumeRoutes');
const notFoundMiddleware = require('./middlewares/notFoundMiddleware');
const errorMiddleware    = require('./middlewares/errorMiddleware');

// ─── App instance ─────────────────────────────────────────────────────────────

const app = express();

// ─── Security middleware ──────────────────────────────────────────────────────

/**
 * Helmet sets recommended HTTP security headers:
 *   Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, etc.
 */
app.use(helmet());

/**
 * CORS — Allow requests from the configured frontend origin.
 * Credentials: true is required for cookie-based auth in future phases.
 */
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.CLIENT_ORIGIN || 'http://localhost:5173',
      'http://localhost:3000',
    ];

    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: Origin '${origin}' is not allowed`));
    }
  },
  credentials:         true,
  methods:             ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders:      ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders:      ['Set-Cookie'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// ─── Logging ──────────────────────────────────────────────────────────────────

/**
 * Morgan HTTP request logger.
 *   - 'dev'      → concise coloured output for development
 *   - 'combined' → Apache-style log for production (redirect to log files)
 */
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ─── Body parsers ─────────────────────────────────────────────────────────────

/** Parse incoming JSON payloads (max 10mb). */
app.use(express.json({ limit: '10mb' }));

/** Parse URL-encoded form data (e.g. HTML forms). */
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/** Parse Cookie header and populate req.cookies. */
app.use(cookieParser());

// ─── Routes ───────────────────────────────────────────────────────────────────

/** Health check — GET /api/health */
app.use('/api/health', healthRoutes);

/** Authentication — POST /api/auth/register, /login, /logout | GET /api/auth/me */
app.use('/api/auth', authRoutes);

/** Profile — GET /api/profile, PUT /api/profile */
app.use('/api/profile', profileRoutes);

/** Resume — GET /api/resume, POST /api/resume/upload, DELETE /api/resume, POST /api/resume/analyze */
app.use('/api/resume', resumeRoutes);

// ─── 404 catch-all ───────────────────────────────────────────────────────────

/** Must be after all routes. */
app.use(notFoundMiddleware);

// ─── Global error handler ─────────────────────────────────────────────────────

/** Must be the LAST middleware (4-argument signature). */
app.use(errorMiddleware);

module.exports = app;

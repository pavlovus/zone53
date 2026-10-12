import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env.js";
import { healthRouter } from "./routes/health.route.js";
import { leadRouter } from "./routes/lead.route.js";
import { errorHandler } from "./middleware/errorHandler.js";

export const app = express();

// Trust reverse proxies (Caddy, Nginx, Cloudflare) for real IP headers
app.set("trust proxy", 1);

// Security HTTP headers
app.use(helmet());

// CORS configuration (allow frontend origin, comma-separated domains, and local dev ports)
const configuredOrigins = env.FRONTEND_URL
  ? env.FRONTEND_URL.split(",").map((o) => o.trim())
  : [];

const allowedOrigins = new Set([
  ...configuredOrigins,
  "http://localhost:3000",
  "http://localhost:5173",
].filter(Boolean));

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.has(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parser with strict 10 KB limit
app.use(express.json({ limit: "10kb" }));

// Route handlers
app.use(healthRouter);
app.use(leadRouter);

// Central error handler
app.use(errorHandler);

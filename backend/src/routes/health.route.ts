import { Router } from "express";
import { env } from "../config/env.js";

export const healthRouter = Router();

healthRouter.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "zone53-backend",
    uptime: Math.round(process.uptime()),
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

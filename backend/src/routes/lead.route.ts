import { Router } from "express";
import { leadSchema, isHoneypotTriggered } from "../schemas/lead.schema.js";
import { sendTelegramLead } from "../services/telegram.service.js";
import { enforceJsonContentType } from "../middleware/security.js";
import { leadRateLimiter } from "../middleware/rateLimiter.js";

export const leadRouter = Router();

leadRouter.post(
  "/api/lead",
  enforceJsonContentType,
  leadRateLimiter,
  async (req, res) => {
    const rawBody = (req.body || {}) as Record<string, unknown>;

    // 1. Honeypot check: silently drop bots with a normal 200 OK
    if (isHoneypotTriggered(rawBody)) {
      return res.status(200).json({ ok: true, message: "Inquiry received" });
    }

    const body = {
      ...rawBody,
      investment_amount: rawBody.investment_amount ?? rawBody.package,
    };

    // 2. Strict Zod schema validation
    const validation = leadSchema.safeParse(body);
    if (!validation.success) {
      return res.status(400).json({
        ok: false,
        error: "validation_error",
        details: validation.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      });
    }

    const clientIp = req.ip || "unknown";
    const userAgent = typeof req.headers["user-agent"] === "string" ? req.headers["user-agent"] : "unknown";

    try {
      await sendTelegramLead(validation.data, {
        ip: clientIp || "unknown",
        userAgent,
        timestamp: new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC",
      });

      return res.status(200).json({ ok: true, message: "Inquiry received" });
    } catch (error: unknown) {
      if (error instanceof Error && error.message.startsWith("SERVER_MISCONFIGURED")) {
        console.error("[Lead Route Error] Server misconfigured:", error.message);
        return res.status(500).json({ ok: false, error: "server_misconfigured" });
      }

      console.error("[Lead Route Error] Telegram dispatch failure:", error);
      return res.status(502).json({ ok: false, error: "telegram_dispatch_failed" });
    }
  }
);

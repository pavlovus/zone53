import rateLimit from "express-rate-limit";

export const leadRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({
      ok: false,
      error: "rate_limit_exceeded",
      message: "Too many lead submissions from this IP. Please try again later.",
    });
  },
});

import type { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err && typeof err === "object") {
    const errorObj = err as Record<string, unknown>;

    // Payload too large (express body-parser limit exceeded)
    if (errorObj.type === "entity.too.large") {
      return res.status(413).json({
        ok: false,
        error: "payload_too_large",
        message: "Request payload exceeded maximum size (10 KB)",
      });
    }

    // Malformed JSON syntax error
    if (errorObj.type === "entity.parse.failed" || err instanceof SyntaxError) {
      return res.status(400).json({
        ok: false,
        error: "invalid_json",
        message: "Malformed JSON payload",
      });
    }
  }

  console.error("[Unhandled Server Error]", err);
  return res.status(500).json({
    ok: false,
    error: "internal_server_error",
  });
}

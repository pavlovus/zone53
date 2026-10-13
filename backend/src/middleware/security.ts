import type { Request, Response, NextFunction } from "express";

export function enforceJsonContentType(req: Request, res: Response, next: NextFunction) {
  if (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") {
    const contentType = req.headers["content-type"] || "";
    if (!contentType.toLowerCase().includes("application/json")) {
      return res.status(415).json({
        ok: false,
        error: "unsupported_media_type",
        message: "Content-Type must be application/json",
      });
    }
  }
  next();
}

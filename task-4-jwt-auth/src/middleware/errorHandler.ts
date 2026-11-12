import type { Request, Response, NextFunction } from "express";

export function notFound(req: Request, res: Response): void {
  res.status(404).json({ error: "Not Found", path: req.originalUrl });
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  const status =
    typeof err === "object" && err !== null && "status" in err && typeof err.status === "number"
      ? err.status
      : 500;

  if (status === 403) {
    res.status(403).json({ error: "Forbidden", message: "Origin not allowed by CORS policy" });
    return;
  }
  if (status === 413) {
    res.status(413).json({ error: "Payload Too Large" });
    return;
  }
  if (status >= 500) {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
  res.status(status).json({ error: "Bad Request", message: "Malformed request body" });
}
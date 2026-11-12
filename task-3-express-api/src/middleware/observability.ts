import type { Request, Response, NextFunction } from "express";

export function observability(req: Request, res: Response, next: NextFunction): void {
  const startedAt = performance.now();
  const timestamp = new Date().toISOString();

  res.on("finish", () => {
    const durationMs = performance.now() - startedAt;
    console.log(
      `[${timestamp}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${durationMs.toFixed(2)} ms)`
    );
  });

  next();
}
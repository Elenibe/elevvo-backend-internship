import type { Request, Response, NextFunction } from "express";

const API_KEY = process.env.API_KEY ?? "dev-secret-key";

export function requireAPIKey(req: Request, res: Response, next: NextFunction): void {
  const providedKey = req.header("x-api-key");

  if (providedKey !== API_KEY) {
    res.status(401).json({
      error: "Unauthorized",
      message: "A valid x-api-key header is required",
    });
    return; 
  }

  next(); 
}
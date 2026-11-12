import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { isRole } from "../types/auth";
import type { AuthUser } from "../types/auth";

function unauthorized(res: Response, message: string): void {
  res.status(401).json({ error: "Unauthorized", message });
}

function toAuthUser(payload: unknown): AuthUser | null {
  if (typeof payload !== "object" || payload === null) return null;
  const { sub, username, role } = payload as Record<string, unknown>;
  const id = Number(sub);
  if (!Number.isInteger(id) || typeof username !== "string" || !isRole(role)) return null;
  return { id, username, role };
}

export function authenticateToken(req: Request, res: Response, next: NextFunction): void {

  const header = req.header("authorization");
  if (!header || !header.startsWith("Bearer ")) {
    unauthorized(res, "Missing Authorization header. Use: Bearer <token>");
    return;
  }
  const token = header.slice("Bearer ".length).trim();

  try {
    
    const decoded: unknown = jwt.verify(token, config.jwtSecret, { algorithms: ["HS256"] });
    const user = toAuthUser(decoded);
    if (!user) {
      unauthorized(res, "Token payload is invalid");
      return;
    }
    req.user = user;
    next();
  } catch {
    unauthorized(res, "Invalid or expired token");
  }
}
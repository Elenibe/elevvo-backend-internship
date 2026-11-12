import type { Request, Response, NextFunction } from "express";
import type { Role } from "../types/auth";


export function authorizeRole(...allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized", message: "Authentication required" });
      return;
    }
    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ error: "Forbidden", message: "You do not have permission to access this resource" });
      return;
    }
    next();
  };
}
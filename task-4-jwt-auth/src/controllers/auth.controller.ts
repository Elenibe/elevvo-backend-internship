import type { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body: unknown = req.body;
    if (!isRecord(body) || !isNonEmptyString(body.username) || !isNonEmptyString(body.password)) {
      res.status(400).json({ error: "'username' and 'password' are required" });
      return;
    }
    const { username, password } = body;

    if (!/^[a-zA-Z0-9_]{3,30}$/.test(username)) {
      res.status(400).json({ error: "Username must be 3-30 characters: letters, numbers, underscore" });
      return;
    }
    
    if (password.length < 8 || Buffer.byteLength(password) > 72) {
      res.status(400).json({ error: "Password must be 8 to 72 characters" });
      return;
    }

    const user = await authService.registerUser(username, password);
    if (!user) {
      res.status(409).json({ error: "Username already taken" }); // 409 = conflict
      return;
    }
    res.status(201).json({ message: "Account created", user });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body: unknown = req.body;
    if (!isRecord(body) || !isNonEmptyString(body.username) || !isNonEmptyString(body.password)) {
      res.status(400).json({ error: "'username' and 'password' are required" });
      return;
    }

    const user = await authService.verifyCredentials(body.username, body.password);
    if (!user) {
      
      res.status(401).json({ error: "Invalid username or password" });
      return;
    }

    const token = authService.signToken(user);
    res.status(200).json({ token, tokenType: "Bearer", expiresIn: "1h", user });
  } catch (error) {
    next(error);
  }
}

export function me(req: Request, res: Response): void {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  res.status(200).json({ user: req.user });
}

export function listAllUsers(_req: Request, res: Response): void {
  const users = authService.listUsers();
  res.status(200).json({ count: users.length, users });
}
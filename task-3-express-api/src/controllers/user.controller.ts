import type { Request, Response } from "express";
import * as userService from "../services/user.service";
import type { CreateUserInput, UpdateUserInput } from "../types/user";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function listUsers(_req: Request, res: Response): void {
  const users = userService.getAllUsers();
  res.status(200).json({ count: users.length, users });
}

export function getUser(req: Request, res: Response): void {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ error: "User id must be a number" });
    return;
  }

  const user = userService.getUserById(id);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.status(200).json(user);
}

export function createUser(req: Request, res: Response): void {
  const body: unknown = req.body;
  if (!isRecord(body) || !isNonEmptyString(body.name) || !isNonEmptyString(body.email)) {
    res.status(400).json({ error: "Both 'name' and 'email' are required (non-empty text)" });
    return;
  }

  const input: CreateUserInput = { name: body.name, email: body.email };
  const user = userService.createUser(input);
  res.status(201).json(user);
}

export function updateUser(req: Request, res: Response): void {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ error: "User id must be a number" });
    return;
  }

  const body: unknown = req.body;
  if (!isRecord(body)) {
    res.status(400).json({ error: "Request body must be a JSON object" });
    return;
  }

  const input: UpdateUserInput = {};
  if (body.name !== undefined) {
    if (!isNonEmptyString(body.name)) {
      res.status(400).json({ error: "'name' must be non-empty text" });
      return;
    }
    input.name = body.name;
  }
  if (body.email !== undefined) {
    if (!isNonEmptyString(body.email)) {
      res.status(400).json({ error: "'email' must be non-empty text" });
      return;
    }
    input.email = body.email;
  }
  if (input.name === undefined && input.email === undefined) {
    res.status(400).json({ error: "Send at least one of 'name' or 'email'" });
    return;
  }

  const user = userService.updateUser(id, input);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.status(200).json(user);
}

export function deleteUser(req: Request, res: Response): void {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ error: "User id must be a number" });
    return;
  }

  const deleted = userService.deleteUser(id);
  if (!deleted) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.status(204).send();
}
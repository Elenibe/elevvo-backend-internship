import type { User, Post, Todo } from "./types";


function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function mapUser(raw: unknown): User | null {
  if (!isRecord(raw)) return null;
  const { id, name, email, address } = raw;
  if (typeof id !== "number" || typeof name !== "string" || typeof email !== "string") {
    return null;
  }
  const city = isRecord(address) && typeof address.city === "string" ? address.city : "Unknown";
  return { id, name, email, city };
}

export function mapPost(raw: unknown): Post | null {
  if (!isRecord(raw)) return null;
  const { id, userId, title } = raw;
  if (typeof id !== "number" || typeof userId !== "number" || typeof title !== "string") {
    return null;
  }
  return { id, userId, title };
}

export function mapTodo(raw: unknown): Todo | null {
  if (!isRecord(raw)) return null;
  const { id, title, completed } = raw;
  if (typeof id !== "number" || typeof title !== "string" || typeof completed !== "boolean") {
    return null;
  }
  return { id, title, completed };
}
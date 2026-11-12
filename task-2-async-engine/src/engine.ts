import { pbkdf2 } from "node:crypto";
import { promisify } from "node:util";
import type { DataSource, EngineResult, SourceFailure, User, Post, Todo } from "./types";
import { mapUser, mapPost, mapTodo } from "./mappers";

const BASE = "https://jsonplaceholder.typicode.com";

const userSource: DataSource<User> = { name: "users", url: `${BASE}/users`, mapItem: mapUser };
const postSource: DataSource<Post> = { name: "posts", url: `${BASE}/posts`, mapItem: mapPost };
const todoSource: DataSource<Todo> = { name: "todos", url: `${BASE}/todos`, mapItem: mapTodo };

// These two are broken ON PURPOSE to prove failures don't stop the engine
const brokenSource: DataSource<Todo> = {
  name: "broken-endpoint (404)",
  url: `${BASE}/this-does-not-exist`,
  mapItem: mapTodo,
};
const unreachableSource: DataSource<Todo> = {
  name: "unreachable-server (network error)",
  url: "https://this-domain-does-not-exist.invalid/todos",
  mapItem: mapTodo,
};

// Fetch ONE source and return a clean typed array
async function fetchSource<T>(source: DataSource<T>): Promise<T[]> {
  const response = await fetch(source.url, { signal: AbortSignal.timeout(8000) });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`);
  }

  const body: unknown = await response.json(); 
  if (!Array.isArray(body)) {
    throw new Error("Expected a JSON array");
  }

  const rawItems: unknown[] = body;
  const items: T[] = [];
  for (const raw of rawItems) {
    const mapped = source.mapItem(raw);
    if (mapped !== null) items.push(mapped);
  }
  return items;
}

function formatError(error: unknown): string {
  if (error instanceof Error) {
    const cause = error.cause instanceof Error ? ` (${error.cause.message})` : "";
    return `${error.message}${cause}`;
  }
  return String(error);
}


function unwrap<T>(name: string, result: PromiseSettledResult<T[]>, failures: SourceFailure[]): T[] {
  if (result.status === "fulfilled") {
    console.log(`[engine] ✓ ${name}: ${result.value.length} items`);
    return result.value;
  }
  const reason = formatError(result.reason);
  failures.push({ source: name, reason });
  console.error(`[engine] ✗ ${name} failed: ${reason}`);
  return [];
}

export async function runEngine(): Promise<EngineResult> {
  // All five requests start at the same moment
  const results = await Promise.allSettled([
    fetchSource(userSource),
    fetchSource(postSource),
    fetchSource(todoSource),
    fetchSource(brokenSource),
    fetchSource(unreachableSource),
  ]);

  const failures: SourceFailure[] = [];
  const users = unwrap(userSource.name, results[0], failures);
  const posts = unwrap(postSource.name, results[1], failures);
  const todos = unwrap(todoSource.name, results[2], failures);
  unwrap(brokenSource.name, results[3], failures);
  unwrap(unreachableSource.name, results[4], failures);

  return { users, posts, todos, failures };
}

// Bonus
const pbkdf2Async = promisify(pbkdf2);

export async function heavyProcessing(jobs: number): Promise<number> {
  const start = performance.now();
  const tasks: Promise<Buffer>[] = [];
  for (let i = 0; i < jobs; i++) {
    tasks.push(pbkdf2Async(`password-${i}`, "salt", 200_000, 64, "sha512"));
  }
  await Promise.all(tasks);
  return performance.now() - start;
}
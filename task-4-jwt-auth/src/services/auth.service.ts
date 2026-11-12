import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config";
import type { AuthUser, StoredUser, Role } from "../types/auth";

const SALT_ROUNDS = 10;


const users: StoredUser[] = [];
let nextId = 1;

function toAuthUser(user: StoredUser): AuthUser {
  return { id: user.id, username: user.username, role: user.role };
}


function seed(username: string, password: string, role: Role): void {
  users.push({ id: nextId++, username, passwordHash: bcrypt.hashSync(password, SALT_ROUNDS), role });
}
seed("admin", "Admin123!", "ADMIN");
seed("abebe", "User1234!", "USER");


const DUMMY_HASH = bcrypt.hashSync("dummy-password", SALT_ROUNDS);

function findByUsername(username: string): StoredUser | undefined {
  return users.find((user) => user.username.toLowerCase() === username.toLowerCase());
}


export async function registerUser(username: string, password: string): Promise<AuthUser | null> {
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  if (findByUsername(username)) return null;

  const user: StoredUser = { id: nextId++, username, passwordHash, role: "USER" };
  users.push(user);
  return toAuthUser(user);
}


export async function verifyCredentials(username: string, password: string): Promise<AuthUser | null> {
  const user = findByUsername(username);
  const hashToCheck = user ? user.passwordHash : DUMMY_HASH;
  const matches = await bcrypt.compare(password, hashToCheck);

  if (!user || !matches) return null;
  return toAuthUser(user);
}

export function signToken(user: AuthUser): string {
  return jwt.sign({ username: user.username, role: user.role }, config.jwtSecret, {
    subject: String(user.id), 
    expiresIn: "1h",          
    algorithm: "HS256",
  });
}

export function listUsers(): AuthUser[] {
  return users.map(toAuthUser);
}
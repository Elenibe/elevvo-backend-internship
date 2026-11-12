export type Role = "USER" | "ADMIN";


export interface StoredUser {
  id: number;
  username: string;
  passwordHash: string;
  role: Role;
}


export interface AuthUser {
  id: number;
  username: string;
  role: Role;
}

export function isRole(value: unknown): value is Role {
  return value === "USER" || value === "ADMIN";
}
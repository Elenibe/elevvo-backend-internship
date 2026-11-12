import type { User, CreateUserInput, UpdateUserInput } from "../types/user";


let users: User[] = [
  { id: 1, name: "Abebe Kebede", email: "abebe@example.com" },
  { id: 2, name: "Selam Tesfaye", email: "selam@example.com" },
  { id: 3, name: "Dawit Alemu", email: "dawit@example.com" },
];
let nextId = 4;

export function getAllUsers(): User[] {
  return users;
}

export function getUserById(id: number): User | undefined {
  return users.find((user) => user.id === id);
}

export function createUser(input: CreateUserInput): User {
  const user: User = { id: nextId++, name: input.name, email: input.email };
  users.push(user);
  return user;
}

export function updateUser(id: number, input: UpdateUserInput): User | undefined {
  const user = getUserById(id);
  if (!user) return undefined;
  if (input.name !== undefined) user.name = input.name;
  if (input.email !== undefined) user.email = input.email;
  return user;
}

export function deleteUser(id: number): boolean {
  const before = users.length;
  users = users.filter((user) => user.id !== id);
  return users.length < before;
}
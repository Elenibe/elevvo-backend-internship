import "dotenv/config"; 

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const config = {
  port: Number(process.env.PORT ?? 3000),
  jwtSecret: required("JWT_SECRET"),
  corsOrigins: (process.env.CORS_ORIGINS ?? "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim()),
};
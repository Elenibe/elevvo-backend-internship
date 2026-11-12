import rateLimit from "express-rate-limit";

const FIFTEEN_MINUTES = 15 * 60 * 1000;


export const apiLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  limit: 100,
  standardHeaders: "draft-7", 
  legacyHeaders: false,
  message: { error: "Too Many Requests", message: "Too many requests, please try again later" },
});


export const loginLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too Many Requests", message: "Too many login attempts, try again in 15 minutes" },
});
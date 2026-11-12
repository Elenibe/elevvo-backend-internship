import { Router } from "express";
import { register, login, me } from "../controllers/auth.controller";
import { authenticateToken } from "../middleware/authenticateToken";
import { loginLimiter } from "../middleware/rateLimiters";

const router = Router();

router.post("/register", register);
router.post("/login", loginLimiter, login); 
router.get("/me", authenticateToken, me);  

export default router;
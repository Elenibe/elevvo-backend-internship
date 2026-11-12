import { Router } from "express";
import { listAllUsers } from "../controllers/auth.controller";

const router = Router();

router.get("/users", listAllUsers);

export default router;
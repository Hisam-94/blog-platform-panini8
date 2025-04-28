import express, { RequestHandler } from "express";
import { register, login, getCurrentUser } from "../controllers/authController";
import { protect } from "../middleware/auth";

const router = express.Router();

// Routes
router.post("/register", register as RequestHandler);
router.post("/login", login as RequestHandler);
router.get("/me", protect as RequestHandler, getCurrentUser as RequestHandler);

export default router;

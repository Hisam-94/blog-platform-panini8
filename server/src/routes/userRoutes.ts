import express, { RequestHandler } from "express";
import {
  getUserProfile,
  updateUserProfile,
  getUserPosts,
} from "../controllers/userController";
import { protect } from "../middleware/auth";

const router = express.Router();

// Public routes
router.get("/profile/:username", getUserProfile as RequestHandler);
router.get("/posts/:username", getUserPosts as RequestHandler);

// Protected routes
router.put(
  "/profile",
  protect as RequestHandler,
  updateUserProfile as RequestHandler
);

export default router;

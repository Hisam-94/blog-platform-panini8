import express, { RequestHandler } from "express";
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  toggleLike,
} from "../controllers/postController";
import { protect } from "../middleware/auth";

const router = express.Router();

// Public routes
router.get("/", getPosts as RequestHandler);
router.get("/:id", getPostById as RequestHandler);

// Protected routes
router.post("/", protect as RequestHandler, createPost as RequestHandler);
router.put("/:id", protect as RequestHandler, updatePost as RequestHandler);
router.delete("/:id", protect as RequestHandler, deletePost as RequestHandler);
router.put(
  "/:id/like",
  protect as RequestHandler,
  toggleLike as RequestHandler
);

export default router;

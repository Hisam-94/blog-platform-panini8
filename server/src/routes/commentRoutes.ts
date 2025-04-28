import express, { RequestHandler } from "express";
import {
  createComment,
  getCommentsByPost,
  updateComment,
  deleteComment,
  toggleLikeComment,
} from "../controllers/commentController";
import { protect } from "../middleware/auth";

const router = express.Router();

// Public routes
router.get("/post/:postId", getCommentsByPost as RequestHandler);

// Protected routes
router.post("/", protect as RequestHandler, createComment as RequestHandler);
router.put("/:id", protect as RequestHandler, updateComment as RequestHandler);
router.delete(
  "/:id",
  protect as RequestHandler,
  deleteComment as RequestHandler
);
router.put(
  "/:id/like",
  protect as RequestHandler,
  toggleLikeComment as RequestHandler
);

export default router;

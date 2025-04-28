"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const commentController_1 = require("../controllers/commentController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Public routes
router.get("/post/:postId", commentController_1.getCommentsByPost);
// Protected routes
router.post("/", auth_1.protect, commentController_1.createComment);
router.put("/:id", auth_1.protect, commentController_1.updateComment);
router.delete("/:id", auth_1.protect, commentController_1.deleteComment);
router.put("/:id/like", auth_1.protect, commentController_1.toggleLikeComment);
exports.default = router;

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleLikeComment = exports.deleteComment = exports.updateComment = exports.getCommentsByPost = exports.createComment = void 0;
const Comment_1 = __importDefault(require("../models/Comment"));
const Post_1 = __importDefault(require("../models/Post"));
const mongoose_1 = __importStar(require("mongoose"));
// Create a comment
const createComment = async (req, res) => {
    try {
        const { postId, content } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid post ID",
            });
        }
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }
        // Check if post exists
        const post = await Post_1.default.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }
        // Create comment
        const comment = await Comment_1.default.create({
            content,
            author: req.user._id,
            post: postId,
        });
        // Populate author details
        await comment.populate("author", "username profilePicture");
        res.status(201).json({
            success: true,
            data: comment,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "An error occurred while creating the comment",
        });
    }
};
exports.createComment = createComment;
// Get comments for a post
const getCommentsByPost = async (req, res) => {
    try {
        const { postId } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid post ID",
            });
        }
        // Get comments
        const comments = await Comment_1.default.find({ post: postId })
            .sort({ createdAt: -1 })
            .populate("author", "username profilePicture")
            .exec();
        res.status(200).json({
            success: true,
            data: comments,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "An error occurred while fetching comments",
        });
    }
};
exports.getCommentsByPost = getCommentsByPost;
// Update a comment
const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid comment ID",
            });
        }
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }
        // Check if comment exists
        const comment = await Comment_1.default.findById(id);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found",
            });
        }
        // Get the user ID as a string for comparison
        const userId = String(req.user._id);
        const authorId = String(comment.author);
        // Check if user is the author
        if (authorId !== userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this comment",
            });
        }
        // Update comment
        const updatedComment = await Comment_1.default.findByIdAndUpdate(id, { content }, { new: true, runValidators: true }).populate("author", "username profilePicture");
        res.status(200).json({
            success: true,
            data: updatedComment,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "An error occurred while updating the comment",
        });
    }
};
exports.updateComment = updateComment;
// Delete a comment
const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid comment ID",
            });
        }
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }
        // Check if comment exists
        const comment = await Comment_1.default.findById(id);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found",
            });
        }
        // Get the user ID as a string for comparison
        const userId = String(req.user._id);
        const authorId = String(comment.author);
        // Check if user is the author
        if (authorId !== userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this comment",
            });
        }
        // Delete comment
        await Comment_1.default.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "Comment deleted successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "An error occurred while deleting the comment",
        });
    }
};
exports.deleteComment = deleteComment;
// Like or unlike a comment
const toggleLikeComment = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid comment ID",
            });
        }
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }
        // Check if comment exists
        const comment = await Comment_1.default.findById(id);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found",
            });
        }
        // Get the user ID as a string and an ObjectId
        const userId = String(req.user._id);
        const userObjectId = new mongoose_1.Types.ObjectId(userId);
        // Check if user already liked the comment
        const index = comment.likes.findIndex((id) => String(id) === userId);
        // Toggle like
        if (index === -1) {
            // Like the comment
            comment.likes.push(userObjectId);
        }
        else {
            // Unlike the comment
            comment.likes = comment.likes.filter((id) => String(id) !== userId);
        }
        await comment.save();
        res.status(200).json({
            success: true,
            data: comment,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "An error occurred while toggling comment like",
        });
    }
};
exports.toggleLikeComment = toggleLikeComment;

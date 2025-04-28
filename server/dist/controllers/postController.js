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
exports.toggleLike = exports.deletePost = exports.updatePost = exports.getPostById = exports.getPosts = exports.createPost = void 0;
const Post_1 = __importDefault(require("../models/Post"));
const mongoose_1 = __importStar(require("mongoose"));
// Create a new post
const createPost = async (req, res) => {
    try {
        const { title, content, tags, image } = req.body;
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }
        // Get user ID as ObjectId
        const userId = String(req.user._id);
        const userObjectId = new mongoose_1.Types.ObjectId(userId);
        const post = await Post_1.default.create({
            title,
            content,
            author: userObjectId,
            tags: tags || [],
            image,
        });
        res.status(201).json({
            success: true,
            data: post,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "An error occurred while creating the post",
        });
    }
};
exports.createPost = createPost;
// Get all posts with pagination and filtering
const getPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const tag = req.query.tag;
        const skip = (page - 1) * limit;
        // Build query
        let query = {};
        // Filter by tag if provided
        if (tag) {
            query.tags = tag;
        }
        // Get posts with pagination
        const posts = await Post_1.default.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("author", "username profilePicture")
            .exec();
        // Get total count
        const total = await Post_1.default.countDocuments(query);
        res.status(200).json({
            success: true,
            data: posts,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "An error occurred while fetching posts",
        });
    }
};
exports.getPosts = getPosts;
// Get a single post by ID
const getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid post ID",
            });
        }
        const post = await Post_1.default.findById(id)
            .populate("author", "username profilePicture bio")
            .exec();
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }
        res.status(200).json({
            success: true,
            data: post,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "An error occurred while fetching the post",
        });
    }
};
exports.getPostById = getPostById;
// Update a post
const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, tags, image } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
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
        const post = await Post_1.default.findById(id);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }
        // Get the user ID as a string for comparison
        const userId = String(req.user._id);
        const authorId = String(post.author);
        // Check if user is the author
        if (authorId !== userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this post",
            });
        }
        // Update post
        const updatedPost = await Post_1.default.findByIdAndUpdate(id, {
            title,
            content,
            tags,
            image,
        }, { new: true, runValidators: true }).populate("author", "username profilePicture");
        res.status(200).json({
            success: true,
            data: updatedPost,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "An error occurred while updating the post",
        });
    }
};
exports.updatePost = updatePost;
// Delete a post
const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
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
        const post = await Post_1.default.findById(id);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }
        // Get the user ID as a string for comparison
        const userId = String(req.user._id);
        const authorId = String(post.author);
        // Check if user is the author
        if (authorId !== userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this post",
            });
        }
        // Delete post
        await Post_1.default.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "Post deleted successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "An error occurred while deleting the post",
        });
    }
};
exports.deletePost = deletePost;
// Like or unlike a post
const toggleLike = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
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
        const post = await Post_1.default.findById(id);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }
        // Get the user ID as a string and an ObjectId
        const userId = String(req.user._id);
        const userObjectId = new mongoose_1.Types.ObjectId(userId);
        // Check if user already liked the post
        const index = post.likes.findIndex((id) => String(id) === userId);
        // Toggle like
        if (index === -1) {
            // Like the post
            post.likes.push(userObjectId);
        }
        else {
            // Unlike the post
            post.likes = post.likes.filter((id) => String(id) !== userId);
        }
        await post.save();
        res.status(200).json({
            success: true,
            data: post,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "An error occurred while toggling like",
        });
    }
};
exports.toggleLike = toggleLike;

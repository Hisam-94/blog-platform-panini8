"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserPosts = exports.updateUserProfile = exports.getUserProfile = void 0;
const User_1 = __importDefault(require("../models/User"));
const Post_1 = __importDefault(require("../models/Post"));
// Get user profile
const getUserProfile = async (req, res) => {
    try {
        const { username } = req.params;
        // Find user by username
        const user = await User_1.default.findOne({ username }).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        res.status(200).json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "An error occurred while fetching user profile",
        });
    }
};
exports.getUserProfile = getUserProfile;
// Update user profile
const updateUserProfile = async (req, res) => {
    try {
        const { bio, profilePicture } = req.body;
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }
        // Update profile
        const user = await User_1.default.findByIdAndUpdate(req.user._id, {
            bio,
            profilePicture,
        }, { new: true, runValidators: true }).select("-password");
        res.status(200).json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "An error occurred while updating user profile",
        });
    }
};
exports.updateUserProfile = updateUserProfile;
// Get user posts
const getUserPosts = async (req, res) => {
    try {
        const { username } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        // Find user by username
        const user = await User_1.default.findOne({ username });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        // Get user posts with pagination
        const posts = await Post_1.default.find({ author: user._id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("author", "username profilePicture")
            .exec();
        // Get total count
        const total = await Post_1.default.countDocuments({ author: user._id });
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
            message: error.message || "An error occurred while fetching user posts",
        });
    }
};
exports.getUserPosts = getUserPosts;

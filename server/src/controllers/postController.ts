import { Request, Response } from "express";
import Post from "../models/Post";
import mongoose, { Types } from "mongoose";
import { IUser } from "../models/User";

// Create a new post
export const createPost = async (req: Request, res: Response) => {
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
    const userObjectId = new Types.ObjectId(userId);

    const post = await Post.create({
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while creating the post",
    });
  }
};

// Get all posts with pagination and filtering
export const getPosts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const tag = req.query.tag as string;
    const skip = (page - 1) * limit;

    // Build query
    let query: any = {};

    // Filter by tag if provided
    if (tag) {
      query.tags = tag;
    }

    // Get posts with pagination
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "username profilePicture")
      .exec();

    // Get total count
    const total = await Post.countDocuments(query);

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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while fetching posts",
    });
  }
};

// Get a single post by ID
export const getPostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID",
      });
    }

    const post = await Post.findById(id)
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while fetching the post",
    });
  }
};

// Update a post
export const updatePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, tags, image } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
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
    const post = await Post.findById(id);

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
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        title,
        content,
        tags,
        image,
      },
      { new: true, runValidators: true }
    ).populate("author", "username profilePicture");

    res.status(200).json({
      success: true,
      data: updatedPost,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while updating the post",
    });
  }
};

// Delete a post
export const deletePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
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
    const post = await Post.findById(id);

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
    await Post.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while deleting the post",
    });
  }
};

// Like or unlike a post
export const toggleLike = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
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
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Get the user ID as a string and an ObjectId
    const userId = String(req.user._id);
    const userObjectId = new Types.ObjectId(userId);

    // Check if user already liked the post
    const index = post.likes.findIndex((id) => String(id) === userId);

    // Toggle like
    if (index === -1) {
      // Like the post
      post.likes.push(userObjectId);
    } else {
      // Unlike the post
      post.likes = post.likes.filter((id) => String(id) !== userId);
    }

    await post.save();

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while toggling like",
    });
  }
};

import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to inject the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const register = (userData: any) => api.post("/auth/register", userData);
export const login = (userData: any) => api.post("/auth/login", userData);
export const getCurrentUser = () => api.get("/auth/me");

// Posts API
export const getPosts = (page = 1, limit = 10, tag?: string) => {
  let url = `/posts?page=${page}&limit=${limit}`;
  if (tag) {
    url += `&tag=${tag}`;
  }
  return api.get(url);
};
export const getPostById = (id: string) => api.get(`/posts/${id}`);
export const createPost = (postData: any) => api.post("/posts", postData);
export const updatePost = (id: string, postData: any) =>
  api.put(`/posts/${id}`, postData);
export const deletePost = (id: string) => api.delete(`/posts/${id}`);
export const likePost = (id: string) => api.put(`/posts/${id}/like`);

// Comments API
export const getCommentsByPost = (postId: string) =>
  api.get(`/comments/post/${postId}`);
export const createComment = (commentData: any) =>
  api.post("/comments", commentData);
export const updateComment = (id: string, content: string) =>
  api.put(`/comments/${id}`, { content });
export const deleteComment = (id: string) => api.delete(`/comments/${id}`);
export const likeComment = (id: string) => api.put(`/comments/${id}/like`);

// User API
export const getUserProfile = (username: string) =>
  api.get(`/users/profile/${username}`);
export const updateUserProfile = (userData: any) =>
  api.put("/users/profile", userData);
export const getUserPosts = (username: string, page = 1, limit = 10) =>
  api.get(`/users/posts/${username}?page=${page}&limit=${limit}`);

export default api;

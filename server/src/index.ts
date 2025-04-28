// import express, { Request, Response, NextFunction } from "express";
// import cors from "cors";
// import { createServer } from "http";
// import { Server } from "socket.io";
// import mongoose from "mongoose";
// import config from "./config";
// import connectDB from "./config/db";
// import authRoutes from "./routes/authRoutes";
// import postRoutes from "./routes/postRoutes";
// import commentRoutes from "./routes/commentRoutes";
// import userRoutes from "./routes/userRoutes";

// // Connect to MongoDB
// connectDB();

// // Initialize Express app
// const app = express();
// const httpServer = createServer(app);

// // Socket.io setup
// const io = new Server(httpServer, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//   },
// });

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // API routes
// app.use("/api/auth", authRoutes);
// app.use("/api/posts", postRoutes);
// app.use("/api/comments", commentRoutes);
// app.use("/api/users", userRoutes);

// // Root route
// app.get("/", (req: Request, res: Response) => {
//   res.json({ message: "Welcome to Blog Platform API" });
// });

// // Error handling middleware
// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//   console.error(err.stack);
//   res.status(500).json({
//     success: false,
//     message: "Internal Server Error",
//   });
// });

// // Socket.io events
// io.on("connection", (socket) => {
//   console.log("A user connected:", socket.id);

//   // Join a post room for real-time comment updates
//   socket.on("joinPost", (postId: string) => {
//     socket.join(`post_${postId}`);
//     console.log(`User ${socket.id} joined post_${postId}`);
//   });

//   // Leave a post room
//   socket.on("leavePost", (postId: string) => {
//     socket.leave(`post_${postId}`);
//     console.log(`User ${socket.id} left post_${postId}`);
//   });

//   // Disconnect event
//   socket.on("disconnect", () => {
//     console.log("A user disconnected:", socket.id);
//   });
// });

// // Start server
// const PORT = config.port;
// httpServer.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import config from "./config";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import postRoutes from "./routes/postRoutes";
import commentRoutes from "./routes/commentRoutes";
import userRoutes from "./routes/userRoutes";

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();
const httpServer = createServer(app);

const allowedOrigins = [
  'http://localhost:5173', // Vite default dev server
  'http://127.0.0.1:5173', // Vite alternative
  "https://blog-platform-panini8-i4zb.vercel.app",  
];

// Configure CORS properly
const corsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Socket.io setup with matching CORS config
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    preflightContinue: false // Important for Vercel

  },
});
app.options('*', cors(corsOptions));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/users", userRoutes);

// Root route
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to Blog Platform API" });
});

// Handle preflight requests
app.options("*", cors(corsOptions));

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

// Socket.io events
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("joinPost", (postId: string) => {
    socket.join(`post_${postId}`);
    console.log(`User ${socket.id} joined post_${postId}`);
  });

  socket.on("leavePost", (postId: string) => {
    socket.leave(`post_${postId}`);
    console.log(`User ${socket.id} left post_${postId}`);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// Start server
const PORT = config.port;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
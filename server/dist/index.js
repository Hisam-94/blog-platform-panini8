"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const config_1 = __importDefault(require("./config"));
const db_1 = __importDefault(require("./config/db"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const postRoutes_1 = __importDefault(require("./routes/postRoutes"));
const commentRoutes_1 = __importDefault(require("./routes/commentRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
// Connect to MongoDB
(0, db_1.default)();
// Initialize Express app
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
// Socket.io setup
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
    },
});
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// API routes
app.use("/api/auth", authRoutes_1.default);
app.use("/api/posts", postRoutes_1.default);
app.use("/api/comments", commentRoutes_1.default);
app.use("/api/users", userRoutes_1.default);
// Root route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to Blog Platform API" });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
});
// Socket.io events
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    // Join a post room for real-time comment updates
    socket.on("joinPost", (postId) => {
        socket.join(`post_${postId}`);
        console.log(`User ${socket.id} joined post_${postId}`);
    });
    // Leave a post room
    socket.on("leavePost", (postId) => {
        socket.leave(`post_${postId}`);
        console.log(`User ${socket.id} left post_${postId}`);
    });
    // Disconnect event
    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});
// Start server
const PORT = config_1.default.port;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

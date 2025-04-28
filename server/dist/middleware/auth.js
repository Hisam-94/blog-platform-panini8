"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const User_1 = __importDefault(require("../models/User"));
const protect = async (req, res, next) => {
    let token;
    // Check if token exists in headers
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    // Check if token exists
    if (!token) {
        return res
            .status(401)
            .json({ success: false, message: "Not authorized to access this route" });
    }
    try {
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret);
        // Get user from the token
        const user = (await User_1.default.findById(decoded.id));
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }
        // Set user in request object
        req.user = user;
        next();
    }
    catch (error) {
        return res
            .status(401)
            .json({ success: false, message: "Not authorized to access this route" });
    }
};
exports.protect = protect;

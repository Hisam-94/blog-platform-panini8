"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables from .env file
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../../.env") });
const config = {
    port: process.env.PORT || 5000,
    mongodbUri: process.env.MONGODB_URI || "mongodb://localhost:27017/blog_platform",
    jwtSecret: process.env.JWT_SECRET || "default_jwt_secret",
    jwtExpire: process.env.JWT_EXPIRE || "7d",
};
exports.default = config;

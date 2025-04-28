import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file
dotenv.config();

const config = {
  port: process.env.PORT || 5000,
  mongodbUri:
    process.env.MONGODB_URI || "",
  jwtSecret: process.env.JWT_SECRET || "default_jwt_secret",
  jwtExpire: process.env.JWT_EXPIRE || "7d",
};

export default config;

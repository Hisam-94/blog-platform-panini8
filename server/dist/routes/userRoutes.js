"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Public routes
router.get("/profile/:username", userController_1.getUserProfile);
router.get("/posts/:username", userController_1.getUserPosts);
// Protected routes
router.put("/profile", auth_1.protect, userController_1.updateUserProfile);
exports.default = router;

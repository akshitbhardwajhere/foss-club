"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
/**
 * @file authRoutes.ts
 * @description Express routes for administrative authentication (`/api/auth`).
 *
 * Provides endpoints for logging in, logging out, and retrieving current session status.
 * All protected endpoints require a valid JWT token stored in an HttpOnly cookie.
 */
const router = express_1.default.Router();
router.post("/login", authController_1.loginAdmin);
router.post("/logout", authMiddleware_1.protect, authController_1.logoutAdmin);
router.get("/me", authMiddleware_1.protect, authController_1.getMe);
exports.default = router;

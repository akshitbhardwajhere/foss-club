import express from "express";
import { loginAdmin, logoutAdmin, getMe } from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";

/**
 * @file authRoutes.ts
 * @description Express routes for administrative authentication (`/api/auth`).
 * 
 * Provides endpoints for logging in, logging out, and retrieving current session status.
 * All protected endpoints require a valid JWT token stored in an HttpOnly cookie.
 */
const router = express.Router();

router.post("/login", loginAdmin);
router.post("/logout", protect, logoutAdmin);
router.get("/me", protect, getMe);

export default router;

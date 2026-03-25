import express from "express";
import {
  saveRegistrationConfig,
  getRegistrationConfig,
  submitRegistration,
  getEventRegistrations,
  stopRegistration,
} from "../controllers/registrationController";
import { protect } from "../middleware/authMiddleware";

/**
 * @file registrationRoutes.ts
 * @description Express routes for event registrations (`/api/registrations`).
 * 
 * Separate public routes (for students to register) and protected routes (for admins to manage configurations and view lists).
 */
const router = express.Router();

// Admin Routes
router.post("/config", protect, saveRegistrationConfig);
router.get("/list/:eventId", protect, getEventRegistrations);
router.patch("/stop/:eventId", protect, stopRegistration);

// Public Routes
router.get("/config/:eventId", getRegistrationConfig);
router.post("/submit", submitRegistration);

export default router;

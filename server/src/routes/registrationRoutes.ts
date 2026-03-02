import express from "express";
import {
  saveRegistrationConfig,
  getRegistrationConfig,
  submitRegistration,
  getEventRegistrations,
} from "../controllers/registrationController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// Admin Route
router.post("/config", protect, saveRegistrationConfig);
router.get("/list/:eventId", protect, getEventRegistrations);

// Public Routes
router.get("/config/:eventId", getRegistrationConfig);
router.post("/submit", submitRegistration);

export default router;

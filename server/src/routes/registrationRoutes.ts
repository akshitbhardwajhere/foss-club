import express from "express";
import {
  saveRegistrationConfig,
  getRegistrationConfig,
  submitRegistration,
  getEventRegistrations,
  stopRegistration,
} from "../controllers/registrationController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// Admin Routes
router.post("/config", protect, saveRegistrationConfig);
router.get("/list/:eventId", protect, getEventRegistrations);
router.patch("/stop/:eventId", protect, stopRegistration);

// Public Routes
router.get("/config/:eventId", getRegistrationConfig);
router.post("/submit", submitRegistration);

export default router;

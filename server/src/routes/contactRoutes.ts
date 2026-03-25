import express from "express";
import { submitContactForm, approveCommunityRequest } from "../controllers/contactController";
import { protect } from "../middleware/authMiddleware";

/**
 * @file contactRoutes.ts
 * @description Express routes for the public contact and community registration form (`/api/contact`).
 * 
 * Allows users to submit their application, and admins to approve them dashboard-side.
 */
const router = express.Router();

router.route("/").post(submitContactForm);
router.route("/approve").post(protect, approveCommunityRequest);

export default router;

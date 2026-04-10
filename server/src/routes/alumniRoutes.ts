import express from "express";
import {
  getAlumni,
  updateAlumniStatus,
} from "../controllers/alumniController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// Public route to get all alumni
router.get("/", getAlumni);

// Protected route to update the alumni status of a specific team member
router.put("/:id/status", protect, updateAlumniStatus);

export default router;

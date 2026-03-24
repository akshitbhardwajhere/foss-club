import express from "express";
import { submitContactForm, approveCommunityRequest } from "../controllers/contactController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.route("/").post(submitContactForm);
router.route("/approve").post(protect, approveCommunityRequest);

export default router;

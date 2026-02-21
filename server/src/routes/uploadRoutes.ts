import express from "express";
import { removeCloudinaryImage } from "../controllers/uploadController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.delete("/remove", protect, removeCloudinaryImage);

export default router;

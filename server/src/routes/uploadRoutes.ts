import express from "express";
import multer from "multer";
import {
  removeCloudinaryImage,
  removeCloudinaryDocument,
  uploadDocument,
} from "../controllers/uploadController";
import { protect } from "../middleware/authMiddleware";

/**
 * @file uploadRoutes.ts
 * @description Express routes dedicated to handling direct file uploads and removals (`/api/upload`).
 * 
 * Implements Multer with memory storage to pipe buffers straight into Cloudinary.
 */
const router = express.Router();

// Memory storage — we stream the buffer straight to Cloudinary, no disk writes
const pdfUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are accepted"));
    }
  },
});

router.post("/document", protect, pdfUpload.single("file"), uploadDocument);
router.delete("/remove", protect, removeCloudinaryImage);
router.delete("/remove-document", protect, removeCloudinaryDocument);

export default router;

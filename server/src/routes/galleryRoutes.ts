import express from "express";
import {
  getEventGallery,
  addGalleryImage,
  deleteGalleryImage,
} from "../controllers/galleryController";
import { protect } from "../middleware/authMiddleware";

/**
 * @file galleryRoutes.ts
 * @description Express routes for managing event gallery images (`/api/gallery`).
 * 
 * Supports retrieving images publically, and creating/deleting images strictly by admins.
 */
const router = express.Router();

router.route("/:eventId")
  .get(getEventGallery)
  .post(protect, addGalleryImage);

router.route("/:id")
  .delete(protect, deleteGalleryImage);

export default router;

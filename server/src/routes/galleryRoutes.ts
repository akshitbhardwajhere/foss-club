import express from "express";
import {
  getEventGallery,
  addGalleryImage,
  deleteGalleryImage,
  updateGalleryImage,
} from "../controllers/galleryController";
import { protect } from "../middleware/authMiddleware";
import { cachePublic } from "../middleware/cacheMiddleware";

/**
 * @file galleryRoutes.ts
 * @description Express routes for managing event gallery images (`/api/gallery`).
 * 
 * Supports retrieving images publically, and creating/updating/deleting images strictly by admins.
 */
const router = express.Router();

router.route("/:eventId")
  .get(cachePublic("5 minutes"), getEventGallery)
  .post(protect, addGalleryImage);

router.route("/:id")
  .put(protect, updateGalleryImage)
  .delete(protect, deleteGalleryImage);

export default router;

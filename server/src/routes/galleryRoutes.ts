import express from "express";
import {
  getEventGallery,
  addGalleryImage,
  deleteGalleryImage,
} from "../controllers/galleryController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.route("/:eventId")
  .get(getEventGallery)
  .post(protect, addGalleryImage);

router.route("/:id")
  .delete(protect, deleteGalleryImage);

export default router;

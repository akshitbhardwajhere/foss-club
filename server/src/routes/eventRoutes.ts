import express from "express";
import {
  getEvents,
  getNextEvent,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  downloadEventDocument,
} from "../controllers/eventController";
import { protect } from "../middleware/authMiddleware";

/**
 * @file eventRoutes.ts
 * @description Express routes for managing club events (`/api/events`).
 * 
 * Supports retrieving the next active event, downloading event brochures, 
 * and standard CRUD operations. Admin privileges required for mutative actions.
 */
const router = express.Router();

router.route("/").get(getEvents).post(protect, createEvent);
router.route("/next").get(getNextEvent);
router.route("/:id/document").get(downloadEventDocument);

router
  .route("/:id")
  .get(getEventById)
  .put(protect, updateEvent)
  .delete(protect, deleteEvent);

export default router;

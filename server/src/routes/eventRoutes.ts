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
import { cachePublic } from "../middleware/cacheMiddleware";

/**
 * @file eventRoutes.ts
 * @description Express routes for managing club events (`/api/events`).
 * 
 * Supports retrieving the next active event, downloading event brochures, 
 * and standard CRUD operations. Admin privileges required for mutative actions.
 */
const router = express.Router();

router.route("/").get(cachePublic("5 minutes"), getEvents).post(protect, createEvent);
router.route("/next").get(cachePublic("5 minutes"), getNextEvent);
router.route("/:id/document").get(cachePublic("1 day"), downloadEventDocument);

router
  .route("/:id")
  .get(cachePublic("5 minutes"), getEventById)
  .put(protect, updateEvent)
  .delete(protect, deleteEvent);

export default router;

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

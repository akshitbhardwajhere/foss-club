"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const eventController_1 = require("../controllers/eventController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const cacheMiddleware_1 = require("../middleware/cacheMiddleware");
/**
 * @file eventRoutes.ts
 * @description Express routes for managing club events (`/api/events`).
 *
 * Supports retrieving the next active event, downloading event brochures,
 * and standard CRUD operations. Admin privileges required for mutative actions.
 */
const router = express_1.default.Router();
router.route("/").get((0, cacheMiddleware_1.cachePublic)("5 minutes"), eventController_1.getEvents).post(authMiddleware_1.protect, eventController_1.createEvent);
router.route("/next").get((0, cacheMiddleware_1.cachePublic)("5 minutes"), eventController_1.getNextEvent);
router.route("/:id/document").get((0, cacheMiddleware_1.cachePublic)("1 day"), eventController_1.downloadEventDocument);
router
    .route("/:id")
    .get((0, cacheMiddleware_1.cachePublic)("5 minutes"), eventController_1.getEventById)
    .put(authMiddleware_1.protect, eventController_1.updateEvent)
    .delete(authMiddleware_1.protect, eventController_1.deleteEvent);
exports.default = router;

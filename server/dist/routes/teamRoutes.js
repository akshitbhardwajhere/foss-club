"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const teamController_1 = require("../controllers/teamController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const cacheMiddleware_1 = require("../middleware/cacheMiddleware");
/**
 * @file teamRoutes.ts
 * @description Express routes for managing team members profiles (`/api/team`).
 *
 * Supports retrieving the public roster and admin endpoints for mutative operations like reordering.
 */
const router = express_1.default.Router();
router.route("/reorder").put(authMiddleware_1.protect, teamController_1.reorderTeamMembers);
router.route("/").get((0, cacheMiddleware_1.cachePublic)("5 minutes"), teamController_1.getTeamMembers).post(authMiddleware_1.protect, teamController_1.createTeamMember);
router
    .route("/:id")
    .get((0, cacheMiddleware_1.cachePublic)("5 minutes"), teamController_1.getTeamMemberById)
    .put(authMiddleware_1.protect, teamController_1.updateTeamMember)
    .delete(authMiddleware_1.protect, teamController_1.deleteTeamMember);
exports.default = router;

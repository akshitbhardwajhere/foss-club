import express from "express";
import {
  getTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  reorderTeamMembers,
} from "../controllers/teamController";
import { protect } from "../middleware/authMiddleware";
import { cachePublic } from "../middleware/cacheMiddleware";

/**
 * @file teamRoutes.ts
 * @description Express routes for managing team members profiles (`/api/team`).
 * 
 * Supports retrieving the public roster and admin endpoints for mutative operations like reordering.
 */
const router = express.Router();

router.route("/reorder").put(protect, reorderTeamMembers);
router.route("/").get(cachePublic("5 minutes"), getTeamMembers).post(protect, createTeamMember);
router
  .route("/:id")
  .get(cachePublic("5 minutes"), getTeamMemberById)
  .put(protect, updateTeamMember)
  .delete(protect, deleteTeamMember);

export default router;

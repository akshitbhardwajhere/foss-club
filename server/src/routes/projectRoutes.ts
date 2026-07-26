import express from "express";
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects,
} from "../controllers/projectController";
import { protect } from "../middleware/authMiddleware";
import { cachePublic } from "../middleware/cacheMiddleware";

/**
 * @file projectRoutes.ts
 * @description Express routes for managing projects (`/api/projects`).
 *
 * Public endpoints allow reading projects.
 * Protected endpoints (require admin auth) handle project creation, update, reorder, and deletion.
 */
const router = express.Router();

router.route("/reorder").put(protect, reorderProjects);
router
  .route("/")
  .get(cachePublic("5 minutes"), getProjects)
  .post(protect, createProject);

router
  .route("/:id")
  .get(cachePublic("5 minutes"), getProjectById)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

export default router;

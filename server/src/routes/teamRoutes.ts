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

const router = express.Router();

router.route("/reorder").put(protect, reorderTeamMembers);
router.route("/").get(getTeamMembers).post(protect, createTeamMember);
router
  .route("/:id")
  .get(getTeamMemberById)
  .put(protect, updateTeamMember)
  .delete(protect, deleteTeamMember);

export default router;

import express from "express";
import {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController";
import { protect } from "../middleware/authMiddleware";

/**
 * @file blogRoutes.ts
 * @description Express routes for managing blogs (`/api/blogs`).
 * 
 * Public endpoints allow reading blogs.
 * Protected endpoints (require authentication) handle creation, updates, and deletions.
 */
const router = express.Router();

router.route("/").get(getBlogs).post(protect, createBlog);

router
  .route("/:id")
  .get(getBlogById)
  .put(protect, updateBlog)
  .delete(protect, deleteBlog);

export default router;

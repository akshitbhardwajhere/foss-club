import express from "express";
import {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController";
import { protect } from "../middleware/authMiddleware";
import { cachePublic } from "../middleware/cacheMiddleware";

/**
 * @file blogRoutes.ts
 * @description Express routes for managing blogs (`/api/blogs`).
 * 
 * Public endpoints allow reading blogs.
 * Protected endpoints (require authentication) handle creation, updates, and deletions.
 */
const router = express.Router();

router.route("/").get(cachePublic("5 minutes"), getBlogs).post(protect, createBlog);

router
  .route("/:id")
  .get(cachePublic("5 minutes"), getBlogById)
  .put(protect, updateBlog)
  .delete(protect, deleteBlog);

export default router;

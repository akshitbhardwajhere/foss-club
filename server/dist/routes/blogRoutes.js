"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const blogController_1 = require("../controllers/blogController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const cacheMiddleware_1 = require("../middleware/cacheMiddleware");
/**
 * @file blogRoutes.ts
 * @description Express routes for managing blogs (`/api/blogs`).
 *
 * Public endpoints allow reading blogs.
 * Protected endpoints (require authentication) handle creation, updates, and deletions.
 */
const router = express_1.default.Router();
router.route("/").get((0, cacheMiddleware_1.cachePublic)("5 minutes"), blogController_1.getBlogs).post(authMiddleware_1.protect, blogController_1.createBlog);
router
    .route("/:id")
    .get((0, cacheMiddleware_1.cachePublic)("5 minutes"), blogController_1.getBlogById)
    .put(authMiddleware_1.protect, blogController_1.updateBlog)
    .delete(authMiddleware_1.protect, blogController_1.deleteBlog);
exports.default = router;

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlog = exports.updateBlog = exports.createBlog = exports.getBlogById = exports.getBlogs = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const cloudinary_1 = require("../utils/cloudinary");
/**
 * Retrieves a list of all blogs, ordered by newest first.
 * Does not include full content to keep the payload lightweight.
 *
 * @param {Request} req - The express request object.
 * @param {Response} res - The express response object.
 */
const getBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blogs = yield prisma_1.default.blog.findMany({
            select: {
                id: true,
                title: true,
                author: true,
                tags: true,
                imageUrl: true,
                createdAt: true,
                updatedAt: true
            },
            orderBy: { createdAt: "desc" },
        });
        res.json(blogs);
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});
exports.getBlogs = getBlogs;
/**
 * Retrieves a single blog by its ID, including full content.
 *
 * @param {Request} req - The express request object containing the blog ID in params.
 * @param {Response} res - The express response object.
 * @returns {Promise<void>}
 */
const getBlogById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const blog = yield prisma_1.default.blog.findUnique({ where: { id } });
        if (blog) {
            res.json(blog);
        }
        else {
            res.status(404).json({ message: "Blog not found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});
exports.getBlogById = getBlogById;
/**
 * Creates a new blog post.
 *
 * @param {Request} req - The express request object containing blog data in body.
 * @param {Response} res - The express response object.
 */
const createBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content, author, tags, imageUrl } = req.body;
        const blog = yield prisma_1.default.blog.create({
            data: {
                title,
                content,
                author,
                tags: tags || [],
                imageUrl,
            },
        });
        res.status(201).json(blog);
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});
exports.createBlog = createBlog;
/**
 * Updates an existing blog post.
 * If a new image URL is provided, securely deletes the old image from Cloudinary.
 *
 * @param {Request} req - The express request object containing updated blog data in body and ID in params.
 * @param {Response} res - The express response object.
 * @returns {Promise<void>}
 */
const updateBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content, author, tags, imageUrl } = req.body;
        const id = req.params.id;
        const blogExists = yield prisma_1.default.blog.findUnique({ where: { id } });
        if (blogExists) {
            if (imageUrl !== undefined &&
                blogExists.imageUrl &&
                imageUrl !== blogExists.imageUrl) {
                yield (0, cloudinary_1.deleteCloudinaryImage)(blogExists.imageUrl);
            }
            const updatedBlog = yield prisma_1.default.blog.update({
                where: { id },
                data: {
                    title: title || undefined,
                    content: content || undefined,
                    author: author || undefined,
                    tags: tags ? { set: tags } : undefined,
                    imageUrl: imageUrl === "" ? null : imageUrl || undefined,
                },
            });
            res.json(updatedBlog);
        }
        else {
            res.status(404).json({ message: "Blog not found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});
exports.updateBlog = updateBlog;
/**
 * Deletes a specifically identified blog post.
 * Also removes any associated images from Cloudinary to prevent orphaned assets.
 *
 * @param {Request} req - The express request object containing the blog ID in params.
 * @param {Response} res - The express response object.
 * @returns {Promise<void>}
 */
const deleteBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const blogExists = yield prisma_1.default.blog.findUnique({ where: { id } });
        if (blogExists) {
            if (blogExists.imageUrl) {
                yield (0, cloudinary_1.deleteCloudinaryImage)(blogExists.imageUrl);
            }
            yield prisma_1.default.blog.delete({ where: { id } });
            res.json({ message: "Blog removed" });
        }
        else {
            res.status(404).json({ message: "Blog not found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});
exports.deleteBlog = deleteBlog;

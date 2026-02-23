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
const getBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blogs = yield prisma_1.default.blog.findMany({
            orderBy: { createdAt: "desc" },
        });
        res.json(blogs);
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});
exports.getBlogs = getBlogs;
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

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
exports.deleteNews = exports.updateNews = exports.createNews = exports.getNews = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const getNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const news = yield prisma_1.default.news.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(news);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.getNews = getNews;
const createNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content, author, imageUrl } = req.body;
        const newsItem = yield prisma_1.default.news.create({
            data: {
                title,
                content,
                author,
                imageUrl,
            }
        });
        res.status(201).json(newsItem);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.createNews = createNews;
const updateNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content, author, imageUrl } = req.body;
        const { id } = req.params;
        const newsExists = yield prisma_1.default.news.findUnique({ where: { id } });
        if (newsExists) {
            const updatedNews = yield prisma_1.default.news.update({
                where: { id },
                data: {
                    title: title || undefined,
                    content: content || undefined,
                    author: author || undefined,
                    imageUrl: imageUrl || undefined,
                }
            });
            res.json(updatedNews);
        }
        else {
            res.status(404).json({ message: 'News not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.updateNews = updateNews;
const deleteNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const newsExists = yield prisma_1.default.news.findUnique({ where: { id } });
        if (newsExists) {
            yield prisma_1.default.news.delete({ where: { id } });
            res.json({ message: 'News removed' });
        }
        else {
            res.status(404).json({ message: 'News not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.deleteNews = deleteNews;

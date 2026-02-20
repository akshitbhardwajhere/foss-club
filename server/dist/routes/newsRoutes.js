"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const newsController_1 = require("../controllers/newsController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.route('/')
    .get(newsController_1.getNews)
    .post(authMiddleware_1.protect, newsController_1.createNews);
router.route('/:id')
    .put(authMiddleware_1.protect, newsController_1.updateNews)
    .delete(authMiddleware_1.protect, newsController_1.deleteNews);
exports.default = router;

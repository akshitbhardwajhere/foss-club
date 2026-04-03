"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const uploadController_1 = require("../controllers/uploadController");
const authMiddleware_1 = require("../middleware/authMiddleware");
/**
 * @file uploadRoutes.ts
 * @description Express routes dedicated to handling direct file uploads and removals (`/api/upload`).
 *
 * Implements Multer with memory storage to pipe buffers straight into Cloudinary.
 */
const router = express_1.default.Router();
// Memory storage — we stream the buffer straight to Cloudinary, no disk writes
const pdfUpload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
    fileFilter: (_req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        }
        else {
            cb(new Error("Only PDF files are accepted"));
        }
    },
});
router.post("/document", authMiddleware_1.protect, pdfUpload.single("file"), uploadController_1.uploadDocument);
router.delete("/remove", authMiddleware_1.protect, uploadController_1.removeCloudinaryImage);
router.delete("/remove-document", authMiddleware_1.protect, uploadController_1.removeCloudinaryDocument);
exports.default = router;

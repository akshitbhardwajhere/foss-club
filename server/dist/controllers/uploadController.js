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
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadDocument = exports.removeCloudinaryDocument = exports.removeCloudinaryImage = void 0;
const cloudinary_1 = require("../utils/cloudinary");
/**
 * Deletes an image resource securely from Cloudinary.
 * Designed to return a 200 OK even if Cloudinary fails, ensuring the frontend form state can safely reset without being permanently blocked.
 *
 * @param {Request} req - The express request object containing `imageUrl`.
 * @param {Response} res - The express response object.
 * @returns {Promise<void>}
 */
const removeCloudinaryImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { imageUrl } = req.body;
        if (!imageUrl) {
            res.status(400).json({ message: "Image URL is required" });
            return;
        }
        // Best-effort deletion from Cloudinary — don't block the UI if it fails
        const success = yield (0, cloudinary_1.deleteCloudinaryImage)(imageUrl);
        if (success) {
            res
                .status(200)
                .json({ message: "Image successfully deleted from Cloudinary" });
        }
        else {
            // Still return 200 so the frontend can clear the form state
            // The image may not exist in Cloudinary or the URL may not be valid
            res.status(200).json({
                message: "Image reference cleared (Cloudinary asset may not exist)",
            });
        }
    }
    catch (error) {
        // Still return 200 so the UI isn't blocked
        console.error("Image deletion error:", error instanceof Error ? error.message : error);
        res
            .status(200)
            .json({ message: "Image reference cleared (cleanup error logged)" });
    }
});
exports.removeCloudinaryImage = removeCloudinaryImage;
/**
 * Deletes a raw document resource (like PDF) securely from Cloudinary.
 * Designed to return a graceful 200 OK even if the document was already deleted.
 *
 * @param {Request} req - The express request object containing `documentUrl`.
 * @param {Response} res - The express response object.
 * @returns {Promise<void>}
 */
const removeCloudinaryDocument = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { documentUrl } = req.body;
        if (!documentUrl) {
            res.status(400).json({ message: "Document URL is required" });
            return;
        }
        const success = yield (0, cloudinary_1.deleteCloudinaryResource)(documentUrl, "raw");
        if (success) {
            res
                .status(200)
                .json({ message: "Document successfully deleted from Cloudinary" });
        }
        else {
            res.status(200).json({
                message: "Document reference cleared (Cloudinary asset may not exist)",
            });
        }
    }
    catch (error) {
        console.error("Document deletion error:", error instanceof Error ? error.message : error);
        res
            .status(200)
            .json({ message: "Document reference cleared (cleanup error logged)" });
    }
});
exports.removeCloudinaryDocument = removeCloudinaryDocument;
/**
 * POST /api/upload/document  (protected)
 * Accepts a multipart/form-data request with a 'file' field containing a PDF.
 * Uploads to Cloudinary server-side so access_mode=public is guaranteed,
 * avoiding the 401 that occurs with unsigned direct-to-Cloudinary uploads.
 */
const uploadDocument = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const file = req.file;
        if (!file) {
            res.status(400).json({ message: "No file provided" });
            return;
        }
        if (file.mimetype !== "application/pdf") {
            res.status(400).json({ message: "Only PDF files are accepted" });
            return;
        }
        const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
        if (file.size > MAX_BYTES) {
            res.status(400).json({ message: "PDF must be smaller than 10 MB" });
            return;
        }
        const secureUrl = yield (0, cloudinary_1.uploadBufferToCloudinary)(file.buffer);
        res.status(200).json({ url: secureUrl });
    }
    catch (error) {
        console.error("Document upload error:", error instanceof Error ? error.message : error);
        res.status(500).json({ message: "Failed to upload document" });
    }
});
exports.uploadDocument = uploadDocument;

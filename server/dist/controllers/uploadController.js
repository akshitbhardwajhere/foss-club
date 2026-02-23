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
exports.removeCloudinaryImage = void 0;
const cloudinary_1 = require("../utils/cloudinary");
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
            console.warn("Cloudinary deletion returned false for:", imageUrl);
            res.status(200).json({
                message: "Image reference cleared (Cloudinary asset may not exist)",
            });
        }
    }
    catch (error) {
        console.error("Error in removeCloudinaryImage controller:", error);
        // Still return 200 so the UI isn't blocked
        res
            .status(200)
            .json({ message: "Image reference cleared (cleanup error logged)" });
    }
});
exports.removeCloudinaryImage = removeCloudinaryImage;

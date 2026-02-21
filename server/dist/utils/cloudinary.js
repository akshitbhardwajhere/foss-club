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
exports.deleteCloudinaryImage = void 0;
const cloudinary_1 = require("cloudinary");
// Configure Cloudinary with environment variables
// Expects: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});
/**
 * Extracts the public ID from a Cloudinary URL and deletes the asset from Cloudinary storage.
 * @param imageUrl The full secure_url or url returned from a Cloudinary upload
 */
const deleteCloudinaryImage = (imageUrl) => __awaiter(void 0, void 0, void 0, function* () {
    if (!imageUrl)
        return false;
    try {
        // A standard Cloudinary URL looks like:
        // https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder_name/public_id.jpg
        // We need to extract 'folder_name/public_id' without the extension
        const parts = imageUrl.split("/");
        // Get the part after 'upload/' (which includes version, folder, and filename)
        const uploadIndex = parts.findIndex((p) => p === "upload");
        if (uploadIndex === -1)
            return false; // Not a valid cloudinary URL
        // Skip the version string (which starts with 'v' followed by numbers)
        let startIndex = uploadIndex + 1;
        if (parts[startIndex] &&
            parts[startIndex].startsWith("v") &&
            !isNaN(Number(parts[startIndex].substring(1)))) {
            startIndex++;
        }
        // Join the remaining parts (folder + filename)
        const fileWithExtension = parts.slice(startIndex).join("/");
        // Remove the extension to get the clean public ID
        const publicId = fileWithExtension.substring(0, fileWithExtension.lastIndexOf("."));
        if (!publicId)
            return false;
        // Call Cloudinary SDK to destroy the asset
        const result = yield cloudinary_1.v2.uploader.destroy(publicId);
        console.log(`Cloudinary deletion result for ${publicId}:`, result);
        return result.result === "ok";
    }
    catch (error) {
        console.error("Error attempting to delete image from Cloudinary:", error);
        return false;
    }
});
exports.deleteCloudinaryImage = deleteCloudinaryImage;

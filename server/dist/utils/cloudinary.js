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
exports.uploadBufferToCloudinary = exports.deleteCloudinaryImage = exports.deleteCloudinaryResource = void 0;
/**
 * @file cloudinary.ts
 * @description Provides wrapper utilities around the official Cloudinary SDK for uploading and deleting media assets.
 * Uses lazy initialization to ensure environment variables are loaded securely before config.
 */
const cloudinary_1 = require("cloudinary");
let isConfigured = false;
// Lazy initialization: configure Cloudinary only when first needed,
// after dotenv.config() has loaded environment variables in index.ts.
function ensureConfigured() {
    if (!isConfigured) {
        cloudinary_1.v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
            secure: true,
        });
        isConfigured = true;
    }
}
/**
 * Extracts the public ID from a Cloudinary URL and deletes the asset.
 * @param assetUrl  The full secure_url returned from a Cloudinary upload
 * @param resourceType  'image' (default) | 'raw' | 'video'
 */
const deleteCloudinaryResource = (assetUrl_1, ...args_1) => __awaiter(void 0, [assetUrl_1, ...args_1], void 0, function* (assetUrl, resourceType = "image") {
    if (!assetUrl)
        return false;
    ensureConfigured();
    try {
        // A standard Cloudinary URL looks like:
        // https://res.cloudinary.com/cloud_name/<type>/upload/v123.../folder/public_id.ext
        // We need to extract 'folder/public_id' without the extension.
        const parts = assetUrl.split("/");
        const uploadIndex = parts.findIndex((p) => p === "upload");
        if (uploadIndex === -1)
            return false;
        // Skip the version segment (e.g. 'v1234567890')
        let startIndex = uploadIndex + 1;
        if (parts[startIndex] &&
            parts[startIndex].startsWith("v") &&
            !isNaN(Number(parts[startIndex].substring(1)))) {
            startIndex++;
        }
        const fileWithExtension = parts.slice(startIndex).join("/");
        const publicId = fileWithExtension.substring(0, fileWithExtension.lastIndexOf("."));
        if (!publicId)
            return false;
        const result = yield cloudinary_1.v2.uploader.destroy(publicId, {
            resource_type: resourceType,
        });
        return result.result === "ok";
    }
    catch (error) {
        console.error("Cloudinary deletion error:", error instanceof Error ? error.message : error);
        return false;
    }
});
exports.deleteCloudinaryResource = deleteCloudinaryResource;
/**
 * Convenience wrapper that deletes an image asset (resource_type = 'image').
 * Kept for backward compatibility.
 */
const deleteCloudinaryImage = (imageUrl) => (0, exports.deleteCloudinaryResource)(imageUrl, "image");
exports.deleteCloudinaryImage = deleteCloudinaryImage;
/**
 * Uploads a raw Buffer to Cloudinary as a raw resource with public access.
 * Using server-side upload ensures access_mode: 'public' is honoured,
 * unlike unsigned client-side uploads which default to private for raw files.
 */
const uploadBufferToCloudinary = (buffer, folder = "event-documents") => {
    ensureConfigured();
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({
            resource_type: "raw",
            type: "upload", // "upload" = publicly accessible (vs "private" / "authenticated")
            folder,
        }, (error, result) => {
            if (error || !result) {
                console.error("[cloudinary] upload_stream error:", error);
                reject(error !== null && error !== void 0 ? error : new Error("Cloudinary upload returned no result"));
            }
            else {
                resolve(result.secure_url);
            }
        });
        uploadStream.end(buffer);
    });
};
exports.uploadBufferToCloudinary = uploadBufferToCloudinary;

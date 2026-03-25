/**
 * @file cloudinary.ts
 * @description Provides wrapper utilities around the official Cloudinary SDK for uploading and deleting media assets.
 * Uses lazy initialization to ensure environment variables are loaded securely before config.
 */
import { v2 as cloudinary } from "cloudinary";

let isConfigured = false;

type CloudinaryResourceType = "image" | "raw" | "video";

// Lazy initialization: configure Cloudinary only when first needed,
// after dotenv.config() has loaded environment variables in index.ts.
function ensureConfigured() {
  if (!isConfigured) {
    cloudinary.config({
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
export const deleteCloudinaryResource = async (
  assetUrl: string | null | undefined,
  resourceType: CloudinaryResourceType = "image",
): Promise<boolean> => {
  if (!assetUrl) return false;

  ensureConfigured();

  try {
    // A standard Cloudinary URL looks like:
    // https://res.cloudinary.com/cloud_name/<type>/upload/v123.../folder/public_id.ext
    // We need to extract 'folder/public_id' without the extension.

    const parts = assetUrl.split("/");
    const uploadIndex = parts.findIndex((p) => p === "upload");
    if (uploadIndex === -1) return false;

    // Skip the version segment (e.g. 'v1234567890')
    let startIndex = uploadIndex + 1;
    if (
      parts[startIndex] &&
      parts[startIndex].startsWith("v") &&
      !isNaN(Number(parts[startIndex].substring(1)))
    ) {
      startIndex++;
    }

    const fileWithExtension = parts.slice(startIndex).join("/");
    const publicId = fileWithExtension.substring(
      0,
      fileWithExtension.lastIndexOf("."),
    );

    if (!publicId) return false;

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result.result === "ok";
  } catch (error) {
    console.error(
      "Cloudinary deletion error:",
      error instanceof Error ? error.message : error,
    );
    return false;
  }
};

/**
 * Convenience wrapper that deletes an image asset (resource_type = 'image').
 * Kept for backward compatibility.
 */
export const deleteCloudinaryImage = (
  imageUrl: string | null | undefined,
): Promise<boolean> => deleteCloudinaryResource(imageUrl, "image");

/**
 * Uploads a raw Buffer to Cloudinary as a raw resource with public access.
 * Using server-side upload ensures access_mode: 'public' is honoured,
 * unlike unsigned client-side uploads which default to private for raw files.
 */
export const uploadBufferToCloudinary = (
  buffer: Buffer,
  folder: string = "event-documents",
): Promise<string> => {
  ensureConfigured();

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        type: "upload", // "upload" = publicly accessible (vs "private" / "authenticated")
        folder,
      },
      (error, result) => {
        if (error || !result) {
          console.error("[cloudinary] upload_stream error:", error);
          reject(error ?? new Error("Cloudinary upload returned no result"));
        } else {
          resolve(result.secure_url);
        }
      },
    );
    uploadStream.end(buffer);
  });
};

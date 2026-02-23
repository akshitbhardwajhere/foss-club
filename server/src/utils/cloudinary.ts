import { v2 as cloudinary } from "cloudinary";

let isConfigured = false;

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
 * Extracts the public ID from a Cloudinary URL and deletes the asset from Cloudinary storage.
 * @param imageUrl The full secure_url or url returned from a Cloudinary upload
 */
export const deleteCloudinaryImage = async (
  imageUrl: string | null | undefined,
): Promise<boolean> => {
  if (!imageUrl) return false;

  ensureConfigured();

  try {
    // A standard Cloudinary URL looks like:
    // https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder_name/public_id.jpg
    // We need to extract 'folder_name/public_id' without the extension

    const parts = imageUrl.split("/");
    // Get the part after 'upload/' (which includes version, folder, and filename)
    const uploadIndex = parts.findIndex((p) => p === "upload");
    if (uploadIndex === -1) return false; // Not a valid cloudinary URL

    // Skip the version string (which starts with 'v' followed by numbers)
    let startIndex = uploadIndex + 1;
    if (
      parts[startIndex] &&
      parts[startIndex].startsWith("v") &&
      !isNaN(Number(parts[startIndex].substring(1)))
    ) {
      startIndex++;
    }

    // Join the remaining parts (folder + filename)
    const fileWithExtension = parts.slice(startIndex).join("/");

    // Remove the extension to get the clean public ID
    const publicId = fileWithExtension.substring(
      0,
      fileWithExtension.lastIndexOf("."),
    );

    if (!publicId) return false;

    // Call Cloudinary SDK to destroy the asset
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === "ok";
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Cloudinary deletion error");
    }
    return false;
  }
};

import { Request, Response } from "express";
import { deleteCloudinaryImage } from "../utils/cloudinary";

export const removeCloudinaryImage = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      res.status(400).json({ message: "Image URL is required" });
      return;
    }

    // Best-effort deletion from Cloudinary — don't block the UI if it fails
    const success = await deleteCloudinaryImage(imageUrl);

    if (success) {
      res
        .status(200)
        .json({ message: "Image successfully deleted from Cloudinary" });
    } else {
      // Still return 200 so the frontend can clear the form state
      // The image may not exist in Cloudinary or the URL may not be valid
      res.status(200).json({
        message: "Image reference cleared (Cloudinary asset may not exist)",
      });
    }
  } catch (error) {
    // Still return 200 so the UI isn't blocked
    if (process.env.NODE_ENV !== "production") {
      console.error("Image deletion error");
    }
    res
      .status(200)
      .json({ message: "Image reference cleared (cleanup error logged)" });
  }
};

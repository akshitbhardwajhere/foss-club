import { Request, Response } from "express";
import prisma from "../config/prisma";

/**
 * Retrieves all gallery images associated with a specific event.
 *
 * @param {Request} req - The express request object capturing `eventId` in params.
 * @param {Response} res - The express response object.
 */
export const getEventGallery = async (req: Request, res: Response) => {
  try {
    const eventId = req.params.eventId as string;
    const images = await prisma.eventGalleryImage.findMany({
      where: { eventId },
      orderBy: { order: "asc" },
    });
    res.json(images);
  } catch (error) {
    console.error("Error fetching event gallery:", error);
    res.status(500).json({ message: "Server error fetching gallery" });
  }
};

/**
 * Uploads a record for a new gallery image attached to an event.
 * Enforces a strict limit of 10 gallery photos per event.
 *
 * @param {Request} req - The express request object capturing the URL and description.
 * @param {Response} res - The express response object.
 */
export const addGalleryImage = async (req: Request, res: Response) => {
  try {
    const eventId = req.params.eventId as string;
    const { url, description, order } = req.body;
    console.log(`[Gallery] Uploading image for event ${eventId}...`, { url, description });

    if (!url || !description) {
      return res.status(400).json({ message: "URL and description are required" });
    }

    // Check maximum 10 images limit
    const count = await prisma.eventGalleryImage.count({
      where: { eventId },
    });

    if (count >= 10) {
      return res.status(400).json({ message: "Maximum limit of 10 images reached for this event." });
    }

    const image = await prisma.eventGalleryImage.create({
      data: {
        eventId,
        url,
        description,
        order: order !== undefined ? order : count,
      },
    });

    console.log(`[Gallery] Image uploaded gracefully! ID: ${image.id}`);
    res.status(201).json(image);
  } catch (error) {
    console.error("Error adding gallery image:", error);
    res.status(500).json({ message: "Server error adding image to gallery" });
  }
};

/**
 * Deletes an existing gallery image database record by its exact ID.
 * Note: Cloudinary image deletion logic operates separately or via cleanup jobs.
 *
 * @param {Request} req - The express request object including the image ID.
 * @param {Response} res - The express response object.
 */
export const deleteGalleryImage = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.eventGalleryImage.delete({
      where: { id },
    });
    res.json({ message: "Image removed from gallery successfully" });
  } catch (error) {
    console.error("Error deleting gallery image:", error);
    res.status(500).json({ message: "Server error deleting image" });
  }
};

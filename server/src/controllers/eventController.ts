import { Request, Response } from "express";
import prisma from "../config/prisma";
import {
  deleteCloudinaryImage,
  deleteCloudinaryResource,
} from "../utils/cloudinary";

/**
 * Retrieves all events sorted by creation date in descending order.
 * Fetches basic details and the registration configuration's validUntil date.
 *
 * @param {Request} req - The express request object.
 * @param {Response} res - The express response object.
 */
export const getEvents = async (req: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        date: true,
        isDateTentative: true,
        location: true,
        imageUrl: true,
        registrationConfig: {
          select: {
            validUntil: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * Retrieves the closest upcoming active event (including events happening today).
 * Used primarily for the homepage countdown component.
 *
 * @param {Request} req - The express request object.
 * @param {Response} res - The express response object.
 */
export const getNextEvent = async (req: Request, res: Response) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const nextEvent = await prisma.event.findFirst({
      where: {
        date: {
          gte: startOfToday, // Include live events happening today
        },
      },
      orderBy: {
        date: "asc", // Get the chronologically closest one first
      },
      include: { registrationConfig: true },
    });

    // It's perfectly normal for this to be null if there are no upcoming events
    res.json(nextEvent);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * Retrieves a specific event by its ID.
 * Also includes its associated registration configuration if any.
 *
 * @param {Request} req - The express request object containing the event ID in params.
 * @param {Response} res - The express response object.
 * @returns {Promise<void>}
 */
export const getEventById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const event = await prisma.event.findUnique({
      where: { id },
      include: { registrationConfig: true },
    });
    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * Creates a new event entry in the database.
 * 
 * @param {Request} req - The express request object containing event payload in body.
 * @param {Response} res - The express response object.
 */
export const createEvent = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      category,
      date,
      isDateTentative,
      location,
      imageUrl,
      documentUrl,
    } = req.body;

    const event = await prisma.event.create({
      data: {
        title,
        description,
        category,
        date: new Date(date),
        isDateTentative: isDateTentative || false,
        location,
        imageUrl,
        documentUrl: documentUrl || null,
      },
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * Updates an existing event.
 * If a new image or document URL is provided, it automatically deletes the old asset from Cloudinary.
 *
 * @param {Request} req - The express request object containing the updated fields in body and event ID in params.
 * @param {Response} res - The express response object.
 * @returns {Promise<void>}
 */
export const updateEvent = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const {
      title,
      description,
      category,
      date,
      isDateTentative,
      location,
      imageUrl,
      documentUrl,
    } = req.body;
    const id = req.params.id as string;

    const eventExists = await prisma.event.findUnique({ where: { id } });

    if (eventExists) {
      if (
        imageUrl !== undefined &&
        eventExists.imageUrl &&
        imageUrl !== eventExists.imageUrl
      ) {
        await deleteCloudinaryImage(eventExists.imageUrl);
      }

      // If documentUrl was explicitly cleared or replaced, remove old one from Cloudinary
      if (
        documentUrl !== undefined &&
        eventExists.documentUrl &&
        documentUrl !== eventExists.documentUrl
      ) {
        await deleteCloudinaryResource(eventExists.documentUrl, "raw");
      }

      const updatedEvent = await prisma.event.update({
        where: { id },
        data: {
          title: title || undefined,
          description: description || undefined,
          category: category || undefined,
          date: date ? new Date(date) : undefined,
          isDateTentative:
            isDateTentative !== undefined ? isDateTentative : undefined,
          location: location || undefined,
          imageUrl: imageUrl === "" ? null : imageUrl || undefined,
          documentUrl: documentUrl === "" ? null : documentUrl || undefined,
        },
      });
      res.json(updatedEvent);
    } else {
      res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * Deletes an event by its ID.
 * Gracefully removes associated images and documents from Cloudinary before deleting the database record.
 *
 * @param {Request} req - The express request object containing the event ID in params.
 * @param {Response} res - The express response object.
 * @returns {Promise<void>}
 */
export const deleteEvent = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params.id as string;

    const eventExists = await prisma.event.findUnique({ where: { id } });

    if (eventExists) {
      if (eventExists.imageUrl) {
        await deleteCloudinaryImage(eventExists.imageUrl);
      }
      if (eventExists.documentUrl) {
        await deleteCloudinaryResource(eventExists.documentUrl, "raw");
      }
      await prisma.event.delete({ where: { id } });
      res.json({ message: "Event removed" });
    } else {
      res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * Streams the associated PDF document of an event to the client.
 * Fetches the document from Cloudinary server-side to avoid CORS issues.
 *
 * @param {Request} req - The express request object containing the event ID.
 * @param {Response} res - The express response object used to stream the PDF file.
 * @returns {Promise<void>}
 */
export const downloadEventDocument = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params.id as string;

    const event = await prisma.event.findUnique({ where: { id } });

    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    if (!event.documentUrl) {
      res.status(404).json({ message: "No document attached to this event" });
      return;
    }

    // Fetch the file from Cloudinary server-side (avoids all CORS issues)
    console.log("[doc-download] fetching:", event.documentUrl);
    const fileResponse = await fetch(event.documentUrl);
    console.log(
      "[doc-download] status:",
      fileResponse.status,
      fileResponse.statusText,
    );

    if (!fileResponse.ok) {
      const errText = await fileResponse.text().catch(() => "");
      console.error("[doc-download] body:", errText.slice(0, 300));
      res
        .status(502)
        .json({ message: "Failed to fetch document from storage" });
      return;
    }

    // Build a safe filename from the event title
    const safeName = event.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${safeName}-brochure.pdf"`,
    );

    // Stream the Cloudinary response body directly to the client
    const reader = (fileResponse.body as any)?.getReader?.();
    if (!reader) {
      // Fallback: buffer the entire response
      const buffer = await fileResponse.arrayBuffer();
      res.send(Buffer.from(buffer));
      return;
    }

    const pump = async (): Promise<void> => {
      const { done, value } = await reader.read();
      if (done) {
        res.end();
        return;
      }
      res.write(value);
      await pump();
    };

    await pump();
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

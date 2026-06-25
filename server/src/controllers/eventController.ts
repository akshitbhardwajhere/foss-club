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
    // Query database using Prisma Client. Select only public properties to reduce payload size.
    const events = await prisma.event.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        date: true,
        isDateTentative: true,
        imageUrl: true,
        registrationUrl: true,
        speakers: {
          select: {
            id: true,
            name: true,
            role: true,
            imageUrl: true,
          },
        },
      },
      // Order chronologically in descending order (newest first)
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
    // Set timestamp reference to the start of today to ensure live events
    // happening later today are still captured as "upcoming".
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
      include: { speakers: true },
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
    // Query database for unique event record matching primary key ID
    const event = await prisma.event.findUnique({
      where: { id },
      include: { speakers: true },
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
      registrationUrl,
      speakers,
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
        registrationUrl: registrationUrl || null,
        speakers: speakers && speakers.length > 0 ? {
          create: speakers.map((s: any) => ({
            name: s.name,
            role: s.role,
            org: s.org,
            imageUrl: s.imageUrl || null,
            github: s.github || null,
            linkedin: s.linkedin || null,
            bio: s.bio,
          })),
        } : undefined,
      },
      include: {
        speakers: true,
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
      registrationUrl,
      speakers,
    } = req.body;
    const id = req.params.id as string;

    // Check if the event exists before attempting updates
    const eventExists = await prisma.event.findUnique({ where: { id } });

    if (eventExists) {
      // If a new image is provided and there was an old one, delete the old image from Cloudinary
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

      // Delete existing speakers associated with this event to avoid duplicates before rewriting
      await prisma.speaker.deleteMany({
        where: { eventId: id },
      });

      // Update the event with the new parameters
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
          registrationUrl: registrationUrl === "" ? null : registrationUrl || undefined,
          speakers: speakers ? {
            create: speakers.map((s: any) => ({
              name: s.name,
              role: s.role,
              org: s.org,
              imageUrl: s.imageUrl || null,
              github: s.github || null,
              linkedin: s.linkedin || null,
              bio: s.bio,
            })),
          } : undefined,
        },
        include: {
          speakers: true,
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
      // Clean up Cloudinary storage media to save space and prevent dead links
      if (eventExists.imageUrl) {
        await deleteCloudinaryImage(eventExists.imageUrl);
      }
      if (eventExists.documentUrl) {
        await deleteCloudinaryResource(eventExists.documentUrl, "raw");
      }
      // Delete event from DB (speakers delete automatically via Prisma cascade configuration)
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

    // Fetch the file from Cloudinary server-side (avoids all client CORS issues)
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

    // Build a safe, URL-friendly filename from the event title
    const safeName = event.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric chars with dashes
      .replace(/(^-|-$)/g, "");   // Trim leading/trailing dashes

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${safeName}-brochure.pdf"`,
    );

    // Stream the Cloudinary response body directly to the client to avoid loading large files into RAM
    const reader = (fileResponse.body as any)?.getReader?.();
    if (!reader) {
      // Fallback: buffer the entire response if streaming is unsupported
      const buffer = await fileResponse.arrayBuffer();
      res.send(Buffer.from(buffer));
      return;
    }

    // Pump response data chunks to client response stream
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

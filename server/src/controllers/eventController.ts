import { Request, Response } from "express";
import prisma from "../config/prisma";
import { deleteCloudinaryImage } from "../utils/cloudinary";

export const getEvents = async (req: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const getNextEvent = async (req: Request, res: Response) => {
  try {
    const nextEvent = await prisma.event.findFirst({
      where: {
        date: {
          gt: new Date(), // Only events in the future
        },
      },
      orderBy: {
        date: "asc", // Get the chronologically closest one first
      },
    });

    // It's perfectly normal for this to be null if there are no upcoming events
    res.json(nextEvent);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const getEventById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const event = await prisma.event.findUnique({ where: { id } });
    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const createEvent = async (req: Request, res: Response) => {
  try {
    const { title, description, category, date, location, imageUrl } = req.body;

    const event = await prisma.event.create({
      data: {
        title,
        description,
        category,
        date: new Date(date),
        location,
        imageUrl,
      },
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateEvent = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { title, description, category, date, location, imageUrl } = req.body;
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

      const updatedEvent = await prisma.event.update({
        where: { id },
        data: {
          title: title || undefined,
          description: description || undefined,
          category: category || undefined,
          date: date ? new Date(date) : undefined,
          location: location || undefined,
          imageUrl: imageUrl === "" ? null : imageUrl || undefined,
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
      await prisma.event.delete({ where: { id } });
      res.json({ message: "Event removed" });
    } else {
      res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

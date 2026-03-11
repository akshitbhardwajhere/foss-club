import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { sendRegistrationEmail } from "../utils/email";

const prisma = new PrismaClient();

// Create or update registration config for an event (Admin)
export const saveRegistrationConfig = async (req: Request, res: Response) => {
  try {
    const { eventId, validUntil } = req.body;

    if (!eventId || !validUntil) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const config = await prisma.eventRegistrationConfig.upsert({
      where: {
        eventId,
      },
      update: {
        validUntil: new Date(validUntil),
      },
      create: {
        eventId,
        validUntil: new Date(validUntil),
      },
    });

    res.status(200).json(config);
  } catch (error) {
    console.error("Save Registration Config Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get registration config for an event (public)
export const getRegistrationConfig = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;

    if (typeof eventId !== "string") {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const config = await prisma.eventRegistrationConfig.findUnique({
      where: {
        eventId,
      },
      include: {
        event: {
          select: {
            title: true,
            date: true,
            location: true,
          },
        },
      },
    });

    if (!config) {
      return res
        .status(404)
        .json({ message: "Registration form not found for this event" });
    }

    res.status(200).json(config);
  } catch (error) {
    console.error("Get Registration Config Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Submit a registration response (public)
export const submitRegistration = async (req: Request, res: Response) => {
  try {
    const {
      eventId,
      name,
      email,
      institute,
      enrollmentNo,
      branch,
      isIndividual,
      teamName,
      teamMembers,
      areaOfInterest,
    } = req.body;

    if (
      !eventId ||
      !name ||
      !email ||
      !institute ||
      !branch ||
      !areaOfInterest
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find the config
    const config = await prisma.eventRegistrationConfig.findUnique({
      where: { eventId },
      include: {
        event: true,
      },
    });

    if (!config) {
      return res
        .status(404)
        .json({ message: "Registration form not active for this event" });
    }

    // Check if form is still valid
    if (new Date() > new Date(config.validUntil)) {
      return res.status(403).json({ message: "Registration form is closed" });
    }

    // Create the registration
    const registration = await prisma.eventRegistration.create({
      data: {
        configId: config.id,
        name,
        email,
        institute,
        enrollmentNo: enrollmentNo || null,
        branch,
        isIndividual,
        teamName: teamName || null,
        teamMembers: teamMembers || [],
        areaOfInterest,
      },
    });

    // Send confirmation email asynchronously
    if (config.event) {
      sendRegistrationEmail(email, name, config.event.title, eventId).catch(
        (err) => console.error("Failed to send email silently:", err),
      );
    }

    res.status(201).json(registration);
  } catch (error: any) {
    if (error.code === "P2002") {
      return res
        .status(409)
        .json({ message: "Email already registered for this event." });
    }
    console.error("Submit Registration Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Admin Route to stop (close early) the registration form for an event
export const stopRegistration = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;

    if (typeof eventId !== "string") {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const config = await prisma.eventRegistrationConfig.findUnique({
      where: { eventId },
    });

    if (!config) {
      return res
        .status(404)
        .json({ message: "Registration config not found for this event" });
    }

    const updated = await prisma.eventRegistrationConfig.update({
      where: { eventId },
      data: {
        validUntil: new Date(Date.now() - 1000), // Set 1 second in the past to immediately close
      },
    });

    res.status(200).json(updated);
  } catch (error) {
    console.error("Stop Registration Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Admin Route to fetch all registrations for a specific event
export const getEventRegistrations = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { eventId } = req.params;

    if (typeof eventId !== "string") {
      res.status(400).json({ message: "Event ID is required" });
      return;
    }

    const config = await prisma.eventRegistrationConfig.findUnique({
      where: { eventId },
      include: {
        event: {
          select: { title: true },
        },
        registrations: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!config) {
      res.status(404).json({
        message: "No registration configuration found for this event.",
      });
      return;
    }

    res.status(200).json({
      eventTitle: config.event.title,
      registrations: config.registrations,
    });
  } catch (error) {
    console.error("Get Event Registrations Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

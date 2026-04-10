import { Request, Response } from "express";
import prisma from "../config/prisma";
import { deleteCloudinaryImage } from "../utils/cloudinary";

/**
 * Retrieves all core team members.
 * Sorts them by their custom order first, then chronologically by creation date.
 *
 * @param {Request} req - The express request object.
 * @param {Response} res - The express response object.
 * @returns {Promise<void>}
 */
export const getTeamMembers = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const teamMembers = await prisma.teamMember.findMany({
      where: { isAlumni: false },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    res.json(teamMembers);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * Retrieves a single team member by their unique ID.
 *
 * @param {Request} req - The express request object containing the ID in params.
 * @param {Response} res - The express response object.
 * @returns {Promise<void>}
 */
export const getTeamMemberById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const teamMember = await prisma.teamMember.findUnique({
      where: { id },
    });

    if (teamMember) {
      res.json(teamMember);
    } else {
      res.status(404).json({ message: "Team member not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * Creates a new team member profile.
 * Only accessible by administrators.
 *
 * @param {Request} req - The express request object containing the new member's details.
 * @param {Response} res - The express response object.
 * @returns {Promise<void>}
 */
export const createTeamMember = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, role, email, githubUrl, linkedinUrl, imageUrl } = req.body;

    const teamMember = await prisma.teamMember.create({
      data: {
        name,
        role,
        email,
        githubUrl,
        linkedinUrl,
        imageUrl,
      },
    });

    res.status(201).json(teamMember);
  } catch (error) {
    console.error(
      "Team member creation error:",
      error instanceof Error ? error.message : error,
    );
    res.status(500).json({ message: "Failed to create team member" });
  }
};

/**
 * Updates an existing team member's profile.
 * Automatically handles the deletion of their old image from Cloudinary if a new one is provided.
 *
 * @param {Request} req - The express request object containing the updated fields.
 * @param {Response} res - The express response object.
 * @returns {Promise<void>}
 */
export const updateTeamMember = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, role, email, githubUrl, linkedinUrl, imageUrl } = req.body;

    const id = req.params.id as string;
    const teamMember = await prisma.teamMember.findUnique({
      where: { id },
    });

    if (!teamMember) {
      res.status(404).json({ message: "Team member not found" });
      return;
    }

    if (
      imageUrl !== undefined &&
      teamMember.imageUrl &&
      imageUrl !== teamMember.imageUrl
    ) {
      await deleteCloudinaryImage(teamMember.imageUrl);
    }

    const updatedTeamMember = await prisma.teamMember.update({
      where: { id },
      data: {
        name,
        role,
        email,
        githubUrl: githubUrl === "" ? null : githubUrl,
        linkedinUrl: linkedinUrl === "" ? null : linkedinUrl,
        imageUrl: imageUrl === "" ? null : imageUrl,
      },
    });

    res.json(updatedTeamMember);
  } catch (error) {
    res.status(500).json({ message: "Failed to update team member" });
  }
};

/**
 * Removes a team member completely from the database.
 * Also cleans up their associated image asset from Cloudinary.
 *
 * @param {Request} req - The express request object containing the member ID.
 * @param {Response} res - The express response object.
 * @returns {Promise<void>}
 */
export const deleteTeamMember = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const teamMember = await prisma.teamMember.findUnique({
      where: { id },
    });

    if (!teamMember) {
      res.status(404).json({ message: "Team member not found" });
      return;
    }

    if (teamMember.imageUrl) {
      await deleteCloudinaryImage(teamMember.imageUrl);
    }

    await prisma.teamMember.delete({
      where: { id },
    });

    res.json({ message: "Team member removed" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete team member" });
  }
};

/**
 * Reorders team members dynamically based on drag-and-drop actions in the UI.
 * Uses a bulk transaction to ensure complete atomicity of the order update.
 *
 * @param {Request} req - The express request object containing an array of `{ id, order }`.
 * @param {Response} res - The express response object.
 * @returns {Promise<void>}
 */
export const reorderTeamMembers = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items)) {
      res.status(400).json({
        message: "Invalid payload format. Expected { items: [{ id, order }] }",
      });
      return;
    }

    // Perform bulk update in a transaction
    const updatePromises = items.map((item: { id: string; order: number }) =>
      prisma.teamMember.update({
        where: { id: item.id },
        data: { order: item.order },
      }),
    );

    await prisma.$transaction(updatePromises);

    res.json({ message: "Team members reordered successfully" });
  } catch (error) {
    console.error(
      "Team reorder error:",
      error instanceof Error ? error.message : error,
    );
    res.status(500).json({ message: "Failed to reorder team members" });
  }
};

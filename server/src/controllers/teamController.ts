import { Request, Response } from "express";
import prisma from "../config/prisma";

// @desc    Get all team members
// @route   GET /api/team
// @access  Public
export const getTeamMembers = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const teamMembers = await prisma.teamMember.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    res.json(teamMembers);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get single team member
// @route   GET /api/team/:id
// @access  Public
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

// @desc    Create a team member
// @route   POST /api/team
// @access  Private/Admin
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
    console.error("Failed to create team member:", error);
    res
      .status(500)
      .json({ message: "Failed to create team member", error: String(error) });
  }
};

// @desc    Update a team member
// @route   PUT /api/team/:id
// @access  Private/Admin
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

    const updatedTeamMember = await prisma.teamMember.update({
      where: { id },
      data: {
        name,
        role,
        email,
        githubUrl,
        linkedinUrl,
        imageUrl,
      },
    });

    res.json(updatedTeamMember);
  } catch (error) {
    res.status(500).json({ message: "Failed to update team member" });
  }
};

// @desc    Delete a team member
// @route   DELETE /api/team/:id
// @access  Private/Admin
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

    await prisma.teamMember.delete({
      where: { id },
    });

    res.json({ message: "Team member removed" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete team member" });
  }
};

// @desc    Reorder team members
// @route   PUT /api/team/reorder
// @access  Private/Admin
export const reorderTeamMembers = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items)) {
      res
        .status(400)
        .json({
          message:
            "Invalid payload format. Expected { items: [{ id, order }] }",
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
    console.error("Reorder error:", error);
    res.status(500).json({ message: "Failed to reorder team members" });
  }
};

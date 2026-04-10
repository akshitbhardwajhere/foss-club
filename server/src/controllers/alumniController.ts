import { Request, Response } from "express";
import prisma from "../config/prisma";

/**
 * Retrieves all alumni team members.
 */
export const getAlumni = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const alumni = await prisma.teamMember.findMany({
      where: { isAlumni: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    res.json(alumni);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * Updates the alumni status and info of a team member.
 */
export const updateAlumniStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { isAlumni, company, role } = req.body;

    const teamMember = await prisma.teamMember.findUnique({
      where: { id },
    });

    if (!teamMember) {
      res.status(404).json({ message: "Team member not found" });
      return;
    }

    const updated = await prisma.teamMember.update({
      where: { id },
      data: {
        isAlumni,
        company: company === "" ? null : company,
        role: role || teamMember.role,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error("Alumni update error:", error);
    res.status(500).json({ message: "Failed to update alumni status" });
  }
};

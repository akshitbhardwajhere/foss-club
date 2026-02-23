import { Request, Response } from "express";
import prisma from "../config/prisma";

export const getDashboardStats = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const totalEvents = await prisma.event.count();

    const upcomingEvents = await prisma.event.count({
      where: {
        date: {
          gt: new Date(),
        },
      },
    });

    const pastEvents = await prisma.event.count({
      where: {
        date: {
          lte: new Date(),
        },
      },
    });

    const totalTeamMembers = await prisma.teamMember.count();

    const totalBlogs = await prisma.blog.count();

    res.json({
      events: {
        total: totalEvents,
        upcoming: upcomingEvents,
        past: pastEvents,
      },
      team: {
        total: totalTeamMembers,
      },
      blogs: {
        total: totalBlogs,
      },
    });
  } catch (error) {
    console.error("Stats fetch error");
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({
      message: "Error fetching dashboard stats",
      error: errorMessage,
    });
  }
};

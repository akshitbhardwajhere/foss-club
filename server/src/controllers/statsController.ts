import { Request, Response } from "express";
import prisma from "../config/prisma";

export const getDashboardStats = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    console.log("Fetching dashboard stats...");

    const totalEvents = await prisma.event.count();
    console.log("Total events:", totalEvents);

    const upcomingEvents = await prisma.event.count({
      where: {
        date: {
          gt: new Date(),
        },
      },
    });
    console.log("Upcoming events:", upcomingEvents);

    const pastEvents = await prisma.event.count({
      where: {
        date: {
          lte: new Date(),
        },
      },
    });
    console.log("Past events:", pastEvents);

    const totalTeamMembers = await prisma.teamMember.count();
    console.log("Total team members:", totalTeamMembers);

    const totalBlogs = await prisma.blog.count();
    console.log("Total blogs:", totalBlogs);

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
    console.error("Stats fetch error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({
      message: "Error fetching dashboard stats",
      error: errorMessage,
    });
  }
};

import { Request, Response } from "express";
import prisma from "../config/prisma";
import { sheets } from "../config/google";

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;

/**
 * Aggregates various statistics from the database and Google Sheets to display on the admin dashboard.
 * 
 * Includes counts for: total events, upcoming events, past events, team members, blogs, and sheet queries.
 *
 * @param {Request} req - The express request object.
 * @param {Response} res - The express response object.
 * @returns {Promise<void>}
 */
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

    let totalQueries = 0;
    if (SHEET_ID) {
      try {
        const sheetResponse = await sheets.spreadsheets.values.get({
          spreadsheetId: SHEET_ID,
          range: "Sheet1!A:G",
        });
        const rows = sheetResponse.data.values || [];
        totalQueries = rows.filter((r: any[]) => r[0] && String(r[0]).toLowerCase() !== "date").length;
      } catch (e) {
        console.error("Could not fetch sheet queries:", e);
      }
    }

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
      queries: {
        total: totalQueries,
      },
    });
  } catch (error) {
    console.error(
      "Stats fetch error:",
      error instanceof Error ? error.message : error,
    );
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({
      message: "Error fetching dashboard stats",
      error: errorMessage,
    });
  }
};

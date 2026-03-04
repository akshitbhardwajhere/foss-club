import { Request, Response } from "express";
import { sheets } from "../config/google";

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;

// GET all rows
export const getEntries = async (req: Request, res: Response) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "Sheet1!A:G", // Date, Name, Email, Phone, Institute, Enrollment, Expertise
    });

    res.json(response.data.values || []);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// POST new entry
export const addEntry = async (req: Request, res: Response) => {
  // Fields match contact form
  const { name, email, phone, institute, enrollment, expertise } = req.body;

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "Sheet1!A:G",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            new Date().toISOString(),
            name,
            email,
            phone,
            institute,
            enrollment,
            expertise,
          ],
        ],
      },
    });

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// PUT update entry by row index (assumes row index comes from frontend, e.g. 1-indexed in Google Sheets but 0-indexed in array)
export const updateEntry = async (req: Request, res: Response) => {
  const { rowIndex } = req.params; // String representing actual sheet row, e.g. "2" for the first data row
  const { name, email, phone, institute, enrollment, expertise } = req.body;

  try {
    // Assuming we don't modify the creation date, we only update B:G
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `Sheet1!B${rowIndex}:G${rowIndex}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[name, email, phone, institute, enrollment, expertise]],
      },
    });

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE entry by row index
export const deleteEntry = async (req: Request, res: Response) => {
  const { rowIndex } = req.params; // string representing sheet row e.g. "2"

  try {
    const rowIdx = parseInt(rowIndex as string, 10);
    if (isNaN(rowIdx)) {
      return res.status(400).json({ error: "Invalid row index" });
    }

    // Google Sheets API requires deleteDimension for deleting a row entirely
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SHEET_ID,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: 0, // Assuming Sheet1 is the first sheet with ID 0
                dimension: "ROWS",
                startIndex: rowIdx - 1, // 0-indexed inclusive
                endIndex: rowIdx, // 0-indexed exclusive
              },
            },
          },
        ],
      },
    });

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// POST setup headers with colored background
export const initSheet = async (req: Request, res: Response) => {
  try {
    // 1. Add headers
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: "Sheet1!A1:G1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            "Date",
            "Name",
            "Email",
            "Phone",
            "Institute",
            "Enrollment",
            "Expertise",
          ],
        ],
      },
    });

    // 2. Format headers (colored background, bold)
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SHEET_ID,
      requestBody: {
        requests: [
          {
            repeatCell: {
              range: {
                sheetId: 0, // Assuming Sheet1 is 0
                startRowIndex: 0,
                endRowIndex: 1,
                startColumnIndex: 0,
                endColumnIndex: 7, // A to G
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: {
                    red: 0.03, // approx #08B74F but whatever green
                    green: 0.71,
                    blue: 0.31,
                  },
                  textFormat: {
                    foregroundColor: {
                      red: 1.0,
                      green: 1.0,
                      blue: 1.0,
                    },
                    bold: true,
                  },
                },
              },
              fields: "userEnteredFormat(backgroundColor,textFormat)",
            },
          },
        ],
      },
    });

    res.json({
      success: true,
      message: "Sheet headers initialized and formatted.",
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

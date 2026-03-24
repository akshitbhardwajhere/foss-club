import { Request, Response } from "express";
import { sheets } from "../config/google";
import { Client } from "node-mailjet";

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;

// GET all rows
export const getEntries = async (req: Request, res: Response) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "Sheet1!A:H", // Date, Name, Email, Phone, Institute, Enrollment, Expertise, Status
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
      range: "Sheet1!A:H",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            new Date().toISOString(),
            name,
            email,
            phone ? `'${phone}` : "", // prepend single quote to force text formatting (left-align)
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
        values: [
          [
            name,
            email,
            phone ? `'${phone}` : "",
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

// DELETE entry by row index
export const deleteEntry = async (req: Request, res: Response) => {
  const { rowIndex } = req.params; // string representing sheet row e.g. "2"

  try {
    const rowIdx = parseInt(rowIndex as string, 10);
    if (isNaN(rowIdx)) {
      return res.status(400).json({ error: "Invalid row index" });
    }

    let emailToNotify = "";
    let nameToNotify = "";
    let isApproved = false;

    try {
      const rowRes = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: `Sheet1!A${rowIdx}:H${rowIdx}`,
      });
      const rowData = rowRes.data.values?.[0];
      if (rowData && rowData.length >= 3) {
         nameToNotify = rowData[1];
         emailToNotify = rowData[2];
         if (rowData[7] && rowData[7].toString().trim() === "Approved") {
            isApproved = true;
         }
      }
    } catch (e) {
      console.error("Could not fetch row before deletion", e);
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

    if (emailToNotify && process.env.MAILJET_API_KEY && process.env.MAILJET_API_SECRET) {
      try {
        const mailjet = new Client({
          apiKey: process.env.MAILJET_API_KEY,
          apiSecret: process.env.MAILJET_API_SECRET,
        });

        const subjectTag = isApproved 
          ? "Update Regarding Your FOSS Community Membership" 
          : "Update on Your FOSS Community Application";

        const paragraph1 = isApproved
          ? "This email is to inform you that your membership in the <strong>FOSS Community</strong> at NIT Srinagar has been revoked, and your access has been removed by the core team."
          : "Thank you for applying to the <strong>FOSS Community</strong> at NIT Srinagar. After careful review of your application, we regret to inform you that we will not be moving forward with your request at this time.";

        const paragraph2 = isApproved
          ? "We appreciate the time you spent with the community. If you believe this was an error or wish to discuss this decision, please reach out to the core admin team directly."
          : "We received many strong applications this cycle and had to make some very difficult decisions. We truly appreciate your passion for Free and Open Source Software. Please continue contributing and feel free to apply again in the future!";

        const notifyHtml = `
<!DOCTYPE html>
<html lang="en">
<body style="margin:0;padding:0;background-color:#050B08;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#050B08;width:100% !important;min-width:100%;table-layout:fixed;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="100%" max-width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;margin:0 auto;background-color:#08100C;border:1px solid #182A20;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="padding:40px 40px 30px 40px;border-bottom:1px solid #182A20;">
              <h1 style="margin:0;font-size:24px;color:#ffffff;">${subjectTag}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 20px 0;font-size:16px;color:#ffffff;font-weight:500;">Dear ${nameToNotify},</h2>
              <p style="margin:0 0 24px 0;font-size:15px;color:#D4D4D8;line-height:1.6;">
                ${paragraph1}
              </p>
              <p style="margin:0 0 30px 0;font-size:15px;color:#D4D4D8;line-height:1.6;">
                ${paragraph2}
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #182A20;padding-top:20px;">
                <tr>
                  <td>
                    <p style="margin:0;font-size:14px;color:#E4E4E7;line-height:1.5;">
                      <strong style="color:#ffffff;">Best regards,</strong><br/>
                      The FOSS Core Team<br/>
                      NIT Srinagar
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

        await mailjet.post("send", { version: "v3.1" }).request({
          Messages: [
            {
              From: { Email: process.env.MAILJET_FROM_EMAIL!, Name: "FOSS Club NIT Srinagar" },
              To: [{ Email: emailToNotify, Name: nameToNotify }],
              Subject: subjectTag,
              HTMLPart: notifyHtml,
            }
          ]
        });
      } catch (err) {
        console.error("Failed to send rejection email", err);
      }
    }

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
      range: "Sheet1!A1:H1",
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
            "Status",
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
                endColumnIndex: 8, // A to H
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

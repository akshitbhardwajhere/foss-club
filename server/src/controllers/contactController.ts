import { Request, Response } from "express";
import { Client } from "node-mailjet";
import { sheets } from "../config/google";

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;

function buildEmailHtml(data: {
  name: string;
  email: string;
  phone: string;
  institute: string;
  enrollment: string;
  expertise: string;
}) {
  const isNitSrinagar = data.institute === "NIT Srinagar";
  const organizationDetail = isNitSrinagar
    ? `<p style="color: #e4e4e7; font-size: 16px; line-height: 1.5; margin: 8px 0;"><strong>Registration No:</strong> ${data.enrollment}</p>`
    : `<p style="color: #e4e4e7; font-size: 16px; line-height: 1.5; margin: 8px 0;"><strong>Institute:</strong> ${data.institute}</p>`;

  const dashboardUrl = process.env.CLIENT_URL || "http://localhost:3000";

  return `
    <div style="font-family: Arial, sans-serif; background-color: #050B08; color: #ffffff; padding: 40px; margin: 0; max-width: 600px; border-radius: 12px; border: 1px solid #1b3123;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #08B74F; margin: 0; font-size: 28px;">New Community Application</h1>
      </div>
      
      <p style="color: #e4e4e7; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
        A new application has been submitted for the FOSS Community at NIT Srinagar.
      </p>
      
      <div style="background-color: #0A1610; padding: 20px; border-radius: 8px; border: 1px solid #182A20; margin-bottom: 24px;">
        <h3 style="color: #08B74F; margin-top: 0; margin-bottom: 16px; font-size: 18px;">Applicant Details</h3>
        <p style="color: #e4e4e7; font-size: 16px; line-height: 1.5; margin: 8px 0;"><strong>Name:</strong> ${data.name}</p>
        <p style="color: #e4e4e7; font-size: 16px; line-height: 1.5; margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${data.email}" style="color: #08B74F; text-decoration: none;">${data.email}</a></p>
        <p style="color: #e4e4e7; font-size: 16px; line-height: 1.5; margin: 8px 0;"><strong>Phone:</strong> ${data.phone}</p>
        ${organizationDetail}
      </div>

      <div style="background-color: #0A1610; padding: 20px; border-radius: 8px; border: 1px solid #182A20; margin-bottom: 32px;">
        <h3 style="color: #08B74F; margin-top: 0; margin-bottom: 16px; font-size: 18px;">Primary Expertise</h3>
        <p style="color: #e4e4e7; font-size: 15px; line-height: 1.6; font-family: monospace; white-space: pre-wrap; margin: 0;">${data.expertise}</p>
      </div>

      <div style="text-align: center; margin-top: 40px; margin-bottom: 40px;">
        <a href="${dashboardUrl}" style="background-color: #08B74F; color: #000000; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
          Open Dashboard
        </a>
      </div>
      
      <hr style="border-color: #1b3123; border-style: solid; border-bottom: none; margin-top: 40px;" />
      
      <p style="color: #a1a1aa; font-size: 14px; text-align: center; margin-top: 20px;">
        System generated notification<br/>
        <strong>FOSS Community NIT Srinagar</strong>
      </p>
    </div>
  `;
}

function buildAutoReplyHtml(name: string) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Request Received - FOSS Community</title>
</head>
<body style="margin:0;padding:0;background-color:#050B08;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#050B08;width:100% !important;min-width:100%;table-layout:fixed;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        
        <table role="presentation" width="100%" max-width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;margin:0 auto;background-color:#08100C;border:1px solid #182A20;border-radius:12px;overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td style="padding:40px 40px 30px 40px;border-bottom:1px solid #182A20;">
              <p style="margin:0 0 8px 0;color:#08B74F;font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;">
                Application Update
              </p>
              <h1 style="margin:0;font-size:24px;font-weight:600;color:#ffffff;letter-spacing:-0.5px;">
                FOSS Club NIT Srinagar
              </h1>
            </td>
          </tr>

          <!-- Message Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 20px 0;font-size:18px;color:#ffffff;font-weight:500;">Dear ${name},</h2>
              
              <p style="margin:0 0 20px 0;font-size:15px;color:#D4D4D8;line-height:1.6;">
                Thank you for applying to join the Free and Open Source Software (FOSS) Community at NIT Srinagar. We have successfully received your membership application.
              </p>
              
              <p style="margin:0 0 30px 0;font-size:15px;color:#D4D4D8;line-height:1.6;">
                Our core team is currently reviewing applications and will reach out to you shortly with updates or next steps regarding your onboarding process.
              </p>
              
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-left:3px solid #08B74F;background-color:#0A1610;margin-top:10px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0;font-size:14px;color:#E4E4E7;line-height:1.5;">
                      <strong style="color:#ffffff;">Best regards,</strong><br/>
                      The FOSS Team<br/>
                      NIT Srinagar
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#050B08;padding:30px;text-align:center;border-top:1px solid #182A20;">
              <p style="margin:0;font-size:12px;color:#52525B;">
                This is an automated system response. Please do not reply directly to this email.
              </p>
            </td>
          </tr>

        </table>
        
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export const submitContactForm = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, email, phone, institute, enrollment, expertise } = req.body;

    if (!name || !email || !phone || !institute || !enrollment || !expertise) {
      res.status(400).json({ message: "All fields are required." });
      return;
    }

    // Validate environment variables
    if (
      !process.env.MAILJET_API_KEY ||
      !process.env.MAILJET_API_SECRET ||
      !process.env.MAILJET_FROM_EMAIL
    ) {
      res.status(500).json({
        message:
          "Email service is not properly configured. Please try again later.",
      });
      return;
    }

    // Attempt to append to Google Sheets
    if (SHEET_ID) {
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
      } catch (sheetError) {
        console.error("Failed to append to Google Sheets:", sheetError);
        // Continue even if sheet append fails to still send email
      }
    }

    const adminHtml = buildEmailHtml({
      name,
      email,
      phone,
      institute,
      enrollment,
      expertise,
    });
    const userHtml = buildAutoReplyHtml(name);

    // Initialize Mailjet client
    const mailjet = new Client({
      apiKey: process.env.MAILJET_API_KEY,
      apiSecret: process.env.MAILJET_API_SECRET,
    });

    const adminEmail =
      process.env.ADMIN_EMAIL || "akshitbhardwaj257448@gmail.com";

    // Return success immediately to avoid timeout
    res
      .status(201)
      .json({ message: "Your request has been submitted successfully!" });

    // Send emails asynchronously (fire and forget)
    (async () => {
      try {
        // Send notification to FOSS Community admin
        const adminResponse = await mailjet
          .post("send", { version: "v3.1" })
          .request({
            Messages: [
              {
                From: {
                  Email: process.env.MAILJET_FROM_EMAIL,
                  Name: "FOSS Community NIT Srinagar",
                },
                To: [
                  {
                    Email: adminEmail,
                  },
                ],
                Subject: `New Membership Request from ${name}`,
                TextPart: `New membership request from ${name} (${email})\n\nPhone: ${phone}\nInstitute: ${institute}\nEnrollment: ${enrollment}\n\nExpertise:\n${expertise}`,
                HTMLPart: adminHtml,
              },
            ],
          });

        // Send auto-reply to the user
        const userResponse = await mailjet
          .post("send", { version: "v3.1" })
          .request({
            Messages: [
              {
                From: {
                  Email: process.env.MAILJET_FROM_EMAIL,
                  Name: "FOSS Community NIT Srinagar",
                },
                To: [
                  {
                    Email: email,
                  },
                ],
                Subject: "We've received your FOSS Community request!",
                TextPart: `Hi ${name},\n\nThank you for your interest in joining the FOSS Community at NIT Srinagar! We have received your membership request and will review it soon.\n\nBest regards,\nThe FOSS Team`,
                HTMLPart: userHtml,
              },
            ],
          });
      } catch (emailError: any) {
        // Email errors are logged but don't affect form submission response
      }
    })();
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to submit your request. Please try again later.",
    });
  }
};

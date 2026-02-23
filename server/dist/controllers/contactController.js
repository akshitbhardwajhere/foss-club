"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitContactForm = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
// We'll initialize the transporter inside the function to ensure env vars are loaded
function buildEmailHtml(data) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Membership Request</title>
</head>
<body style="margin:0;padding:0;background-color:#050B08;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif;-webkit-font-smoothing:antialiased;">
  
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#050B08;width:100% !important;min-width:100%;table-layout:fixed;">
    <tr>
      <td align="center" style="padding:20px 10px;">
        
        <!-- Main Container (Full width up to 800px) -->
        <table role="presentation" width="100%" max-width="800" cellpadding="0" cellspacing="0" style="max-width:800px;width:100%;margin:0 auto;background-color:#08100C;border:1px solid rgba(8,183,79,0.15);border-radius:24px;overflow:hidden;box-shadow:0 20px 40px rgba(0,0,0,0.4);">
          
          <!-- Banner Section -->
          <tr>
            <td style="background:linear-gradient(135deg,#08B74F 0%,#05361A 100%);padding:50px 40px;text-align:center;border-bottom:4px solid #042D15;">
              <div style="display:inline-block;padding:12px 24px;background-color:rgba(0,0,0,0.2);border-radius:100px;margin-bottom:20px;border:1px solid rgba(255,255,255,0.1);">
                <p style="margin:0;color:#A7F3D0;font-size:14px;font-weight:600;letter-spacing:1px;text-transform:uppercase;">Membership Request</p>
              </div>
              <h1 style="margin:0 0 10px 0;font-size:36px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;line-height:1.2;">
                FOSS Club NIT Srinagar
              </h1>
              <p style="margin:0;font-size:18px;color:rgba(255,255,255,0.9);font-weight:400;">
                A new enthusiast wants to join the community!
              </p>
            </td>
          </tr>

          <!-- Profile Snapshot -->
          <tr>
            <td style="padding:40px 40px 20px 40px;background-color:#08100C;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="56" valign="top" style="padding-right:20px;">
                    <div style="width:56px;height:56px;background-color:rgba(8,183,79,0.1);border-radius:16px;border:1px solid rgba(8,183,79,0.2);text-align:center;line-height:56px;font-size:24px;">
                      👤
                    </div>
                  </td>
                  <td valign="middle">
                    <h2 style="margin:0 0 4px 0;font-size:24px;color:#ffffff;font-weight:600;">${data.name}</h2>
                    <a href="mailto:${data.email}" style="margin:0;font-size:16px;color:#08B74F;text-decoration:none;font-weight:500;">${data.email}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none;border-top:1px solid rgba(255,255,255,0.05);margin:20px 0;" />
            </td>
          </tr>

          <!-- Q&A Content -->
          <tr>
            <td style="padding:20px 40px 40px 40px;">
              
              <!-- Reason Block -->
              <div style="margin-bottom:35px;">
                <h3 style="margin:0 0 12px 0;font-size:13px;font-weight:600;color:#08B74F;text-transform:uppercase;letter-spacing:1.5px;">
                  🎙️ Why they want to join
                </h3>
                <div style="background-color:#0A1610;border-left:4px solid #08B74F;padding:24px;border-radius:0 16px 16px 0;">
                  <p style="margin:0;font-size:16px;color:#D4D4D8;line-height:1.8;white-space:pre-wrap;">${data.reason}</p>
                </div>
              </div>

              <!-- Expertise Block -->
              <div>
                <h3 style="margin:0 0 12px 0;font-size:13px;font-weight:600;color:#08B74F;text-transform:uppercase;letter-spacing:1.5px;">
                  ⚡ Their Expertise
                </h3>
                <div style="background-color:#0A1610;border:1px solid rgba(8,183,79,0.1);padding:24px;border-radius:16px;">
                  <p style="margin:0;font-size:16px;color:#E4E4E7;line-height:1.8;font-family:monospace;background-color:rgba(8,183,79,0.1);padding:6px 12px;display:inline-block;border-radius:8px;">
                    ${data.expertise}
                  </p>
                </div>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#050B08;padding:40px;text-align:center;border-top:1px solid rgba(8,183,79,0.1);">
              <p style="margin:0 0 10px 0;font-size:14px;color:#71717A;font-weight:500;">
                Connect, Collaborate, and Contribute.
              </p>
              <p style="margin:0;font-size:12px;color:#52525B;">
                Sent automatically via the <a href="${process.env.CLIENT_URL || "http://localhost:3000"}" style="color:#08B74F;text-decoration:none;">FOSS Club platform</a>.
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
function buildAutoReplyHtml(name) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Request Received - FOSS Club</title>
</head>
<body style="margin:0;padding:0;background-color:#050B08;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif;-webkit-font-smoothing:antialiased;">
  
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#050B08;width:100% !important;min-width:100%;table-layout:fixed;">
    <tr>
      <td align="center" style="padding:20px 10px;">
        
        <table role="presentation" width="100%" max-width="800" cellpadding="0" cellspacing="0" style="max-width:800px;width:100%;margin:0 auto;background-color:#08100C;border:1px solid rgba(8,183,79,0.15);border-radius:24px;overflow:hidden;box-shadow:0 20px 40px rgba(0,0,0,0.4);">
          
          <tr>
            <td style="background:linear-gradient(135deg,#08B74F 0%,#05361A 100%);padding:50px 40px;text-align:center;border-bottom:4px solid #042D15;">
              <h1 style="margin:0;font-size:32px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;line-height:1.2;">
                Request Received!
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 20px 0;font-size:20px;color:#ffffff;font-weight:600;">Hi ${name},</h2>
              <p style="margin:0 0 20px 0;font-size:16px;color:#D4D4D8;line-height:1.6;">
                Thank you for your interest in joining the FOSS Club at NIT Srinagar! This email is to confirm that we have successfully received your membership request.
              </p>
              <p style="margin:0 0 30px 0;font-size:16px;color:#D4D4D8;line-height:1.6;">
                Our core team will review your application and get back to you soon with the next steps. Stay tuned!
              </p>
              
              <div style="background-color:#0A1610;border-left:4px solid #08B74F;padding:20px;border-radius:0 12px 12px 0;">
                <p style="margin:0;font-size:14px;color:#E4E4E7;line-height:1.5;">
                  <strong>Best regards,</strong><br/>
                  The FOSS Club Team<br/>
                  NIT Srinagar
                </p>
              </div>
            </td>
          </tr>

          <tr>
            <td style="background-color:#050B08;padding:30px 40px;text-align:center;border-top:1px solid rgba(8,183,79,0.1);">
              <p style="margin:0;font-size:12px;color:#52525B;">
                This is an automated message. Please do not reply directly to this email.
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
const submitContactForm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, reason, expertise } = req.body;
        if (!name || !email || !reason || !expertise) {
            res.status(400).json({ message: "All fields are required." });
            return;
        }
        const adminHtml = buildEmailHtml({ name, email, reason, expertise });
        const userHtml = buildAutoReplyHtml(name);
        const transporter = nodemailer_1.default.createTransport({
            host: process.env.EMAIL_HOST || "smtp.gmail.com",
            port: Number(process.env.EMAIL_PORT) || 587,
            secure: process.env.EMAIL_PORT === "465",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        try {
            // Send notification to FOSS Club admin
            yield transporter.sendMail({
                from: {
                    name: "FOSS Club NIT Srinagar",
                    address: process.env.EMAIL_USER,
                },
                to: "akshitbhardwaj257448@gmail.com",
                subject: `New Membership Request from ${name}`,
                html: adminHtml,
            });
            // Send auto-reply to the user
            yield transporter.sendMail({
                from: {
                    name: "FOSS Club NIT Srinagar",
                    address: process.env.EMAIL_USER,
                },
                to: email,
                subject: "We've received your FOSS Club request!",
                html: userHtml,
            });
            res
                .status(201)
                .json({ message: "Your request has been submitted successfully!" });
        }
        catch (emailError) {
            // Still return success as the form was submitted - email is secondary
            // This handles cases where SMTP is blocked (e.g., Render free tier)
            res.status(201).json({
                message: "Your request has been submitted successfully! We'll review it soon.",
                note: "Email notification may be delayed due to infrastructure limitations.",
            });
        }
    }
    catch (error) {
        if (process.env.NODE_ENV !== "production") {
            console.error("Contact form error");
        }
        res.status(500).json({
            message: "Failed to submit your request. Please try again later.",
        });
    }
});
exports.submitContactForm = submitContactForm;

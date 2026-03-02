import Mailjet from "node-mailjet";

const mailjetClient = Mailjet.apiConnect(
  process.env.MAILJET_API_KEY || "",
  process.env.MAILJET_API_SECRET || "",
);

export const sendRegistrationEmail = async (
  toEmail: string,
  userName: string,
  eventName: string,
  eventId: string,
) => {
  const senderEmail = process.env.MAILJET_FROM_EMAIL || "foss@nitsri.ac.in";
  // Ensure the CLIENT_URL doesn't end in a trailing slash to avoid double slashes in the URL
  const baseClientUrl = (
    process.env.CLIENT_URL || "http://localhost:3000"
  ).replace(/\/$/, "");
  const eventUrl = `${baseClientUrl}/events/${eventId}`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #050B08; color: #ffffff; padding: 40px; margin: 0; max-width: 600px; border-radius: 12px; border: 1px solid #1b3123;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #08B74F; margin: 0; font-size: 28px;">Registration Confirmed</h1>
      </div>
      
      <p style="color: #e4e4e7; font-size: 16px; line-height: 1.5;">Hi ${userName},</p>
      
      <p style="color: #e4e4e7; font-size: 16px; line-height: 1.5;">
        You have successfully registered for <strong>${eventName}</strong>. We are excited to have you onboard!
      </p>

      <p style="color: #e4e4e7; font-size: 16px; line-height: 1.5;">
        Your registration will be fully confirmed only upon replying to this email. Please hit "Reply" and let us know you're ready to participate!
      </p>

      <div style="text-align: center; margin-top: 40px; margin-bottom: 40px;">
        <a href="${eventUrl}" style="background-color: #08B74F; color: #000000; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
          Event Details
        </a>
      </div>
      
      <hr style="border-color: #1b3123; border-style: solid; border-bottom: none; margin-top: 40px;" />
      
      <p style="color: #a1a1aa; font-size: 14px; text-align: center; margin-top: 20px;">
        Best regards,<br/>
        <strong>FOSS Club NIT Srinagar</strong>
      </p>
    </div>
  `;

  try {
    const request = await mailjetClient
      .post("send", { version: "v3.1" })
      .request({
        Messages: [
          {
            From: {
              Email: senderEmail,
              Name: "FOSS Club NIT Srinagar",
            },
            To: [
              {
                Email: toEmail,
                Name: userName,
              },
            ],
            Subject: `Registration Confirmed - ${eventName}`,
            HTMLPart: htmlContent,
          },
        ],
      });

    console.log(`Email sent successfully to ${toEmail}`);
    return true;
  } catch (error: any) {
    console.error(
      "Error sending registration email:",
      error.statusCode,
      error.message,
    );
    return false;
  }
};

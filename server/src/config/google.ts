import { google } from "googleapis";

// Robustly parse the private key to handle different hosting provider escapes
let privateKey = process.env.GOOGLE_PRIVATE_KEY;
if (privateKey) {
  // Remove surrounding quotes if the hosting provider added them
  if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
    privateKey = privateKey.slice(1, -1);
  }
  // Replace literal '\n' sequences with standard newline characters
  privateKey = privateKey.replace(/\\n/g, "\n");
}

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: privateKey,
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

export const sheets = google.sheets({ version: "v4", auth });

import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";

// Routes
import authRoutes from "./routes/authRoutes";
import eventRoutes from "./routes/eventRoutes";
import blogRoutes from "./routes/blogRoutes";
import teamRoutes from "./routes/teamRoutes";
import alumniRoutes from "./routes/alumniRoutes";
import statsRoutes from "./routes/statsRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import contactRoutes from "./routes/contactRoutes";
import sheetRoutes from "./routes/sheetRoutes";
import galleryRoutes from "./routes/galleryRoutes";

// Load environmental configurations from local .env files
dotenv.config();

// Identify critical env variables needed to start up successfully
const requiredEnvVars = ["JWT_SECRET"];
// Identify non-breaking but important variables needed for specific features
const optionalButImportantEnvVars = ["GOOGLE_SHEET_ID"];

// Check for missing keys in process.env
const missingRequired = requiredEnvVars.filter(
  (envVar) => !process.env[envVar],
);
const missingOptional = optionalButImportantEnvVars.filter(
  (envVar) => !process.env[envVar],
);

// Terminate execution if required environment variables are absent
if (missingRequired.length > 0) {
  console.error(
    "❌ Missing required environment variables:",
    missingRequired.join(", "),
  );
  process.exit(1);
}

// Warn developers during development if optional keys are missing
if (missingOptional.length > 0 && process.env.NODE_ENV !== "production") {
  console.warn(
    "⚠️  Missing optional environment variables:",
    missingOptional.join(", "),
  );
  console.warn("   App will continue but some features may not work properly");
}

// Connect to the database using configurations
import connectDB from "./config/db";
import prisma from "./config/prisma";
connectDB();

// Initialize the Express framework instance
const app: Express = express();

// Middleware
// Define the allowed CORS origins. Filters out undefined values from variables
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
  "https://foss.nitsri.ac.in",
  "https://www.foss.nitsri.ac.in",
].filter(Boolean) as string[];

if (process.env.NODE_ENV !== "production") {
  console.log("Allowed CORS origins:", allowedOrigins);
}

// Enable Cross-Origin Resource Sharing (CORS) rules
app.use(
  cors({
    origin: function (origin, callback) {
      if (process.env.NODE_ENV !== "production") {
        console.log("CORS request from origin:", origin);
      }
      // Allow requests with no origin (like mobile apps, postman, curl)
      if (!origin) {
        callback(null, true);
      } else if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        if (process.env.NODE_ENV !== "production") {
          console.error("CORS blocked request from:", origin);
        }
        callback(new Error("Not allowed by CORS"));
      }
    },
    // Permit credentials (cookies/authorization headers) to pass through
    credentials: true,
  }),
);
app.use(compression()); // Gzip compression middleware to shrink response payload
app.use(express.json()); // Body-parser for JSON payloads
app.use(cookieParser()); // Parser for reading cookies from req.cookies

// Main Route Configurations
app.use("/api/admin", authRoutes);            // Authentication flow (Admin side logins)
app.use("/api/admin/stats", statsRoutes);      // Admin dashboard statistics counters
app.use("/api/events", eventRoutes);          // Public events & registrations
app.use("/api/blogs", blogRoutes);            // Blog posting and reading
app.use("/api/team", teamRoutes);            // Club core members
app.use("/api/alumni", alumniRoutes);          // Alumni network catalog
app.use("/api/upload", uploadRoutes);          // File/Media upload controller (Cloudinary integration)
app.use("/api/contact", contactRoutes);        // Contact form submissions
app.use("/api/sheet", sheetRoutes);            // Google sheets synchronization
app.use("/api/gallery", galleryRoutes);        // Public event image gallery

// Health check endpoint
// Tests database responsiveness as well as server process availability
app.get("/health", async (req: Request, res: Response) => {
  try {
    // Run a fast query to test Prisma client communication with the DB
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", message: "Server and database are healthy" });
  } catch (error) {
    console.error(
      "Health check failed:",
      error instanceof Error ? error.message : error,
    );
    res.status(500).json({
      status: "error",
      message: "Database connection failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Root welcome message
app.get("/", (req: Request, res: Response) => {
  res.send("FOSS Club API Server (Prisma/Postgres) is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  if (process.env.NODE_ENV !== "production") {
    console.log(`
╔════════════════════════════════════════╗
║   FOSS Club Server Started             ║
╚════════════════════════════════════════╝

📌 Environment: ${process.env.NODE_ENV || "development"}
🔌 Port: ${PORT}
🛡️  CORS Origins: ${allowedOrigins.join(", ")}
📊 Google Sheets: ${process.env.GOOGLE_SHEET_ID ? "✓ Configured" : "✗ Not configured"}
🔐 Auth: JWT configured

Server is ready to accept requests.
    `);
  } else {
    console.log(`FOSS Club API Server started on port ${PORT}`);
  }
});

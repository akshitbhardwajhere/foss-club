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
import registrationRoutes from "./routes/registrationRoutes";
import sheetRoutes from "./routes/sheetRoutes";
import galleryRoutes from "./routes/galleryRoutes";

// Load env vars
dotenv.config();

// Validate critical environment variables
const requiredEnvVars = ["JWT_SECRET"];
const optionalButImportantEnvVars = ["GOOGLE_SHEET_ID"];

const missingRequired = requiredEnvVars.filter(
  (envVar) => !process.env[envVar],
);
const missingOptional = optionalButImportantEnvVars.filter(
  (envVar) => !process.env[envVar],
);

if (missingRequired.length > 0) {
  console.error(
    "❌ Missing required environment variables:",
    missingRequired.join(", "),
  );
  process.exit(1);
}

if (missingOptional.length > 0 && process.env.NODE_ENV !== "production") {
  console.warn(
    "⚠️  Missing optional environment variables:",
    missingOptional.join(", "),
  );
  console.warn("   App will continue but some features may not work properly");
}

// Connect to database securely
import connectDB from "./config/db";
import prisma from "./config/prisma";
connectDB();

const app: Express = express();

// Middleware
// Allow localhost for development and use CLIENT_URL from env for production
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

app.use(
  cors({
    origin: function (origin, callback) {
      if (process.env.NODE_ENV !== "production") {
        console.log("CORS request from origin:", origin);
      }
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
    credentials: true,
  }),
);
app.use(compression());
app.use(express.json());
app.use(cookieParser());

// Main Routes
app.use("/api/admin", authRoutes);
app.use("/api/admin/stats", statsRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/alumni", alumniRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/registration", registrationRoutes);
app.use("/api/sheet", sheetRoutes);
app.use("/api/gallery", galleryRoutes);

// Health check endpoint
app.get("/health", async (req: Request, res: Response) => {
  try {
    // Test database connection
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

// Basic route
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

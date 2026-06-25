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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const compression_1 = __importDefault(require("compression"));
// Routes
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const eventRoutes_1 = __importDefault(require("./routes/eventRoutes"));
const blogRoutes_1 = __importDefault(require("./routes/blogRoutes"));
const teamRoutes_1 = __importDefault(require("./routes/teamRoutes"));
const alumniRoutes_1 = __importDefault(require("./routes/alumniRoutes"));
const statsRoutes_1 = __importDefault(require("./routes/statsRoutes"));
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
const contactRoutes_1 = __importDefault(require("./routes/contactRoutes"));
const sheetRoutes_1 = __importDefault(require("./routes/sheetRoutes"));
const galleryRoutes_1 = __importDefault(require("./routes/galleryRoutes"));
// Load environmental configurations from local .env files
dotenv_1.default.config();
// Identify critical env variables needed to start up successfully
const requiredEnvVars = ["JWT_SECRET"];
// Identify non-breaking but important variables needed for specific features
const optionalButImportantEnvVars = ["GOOGLE_SHEET_ID"];
// Check for missing keys in process.env
const missingRequired = requiredEnvVars.filter((envVar) => !process.env[envVar]);
const missingOptional = optionalButImportantEnvVars.filter((envVar) => !process.env[envVar]);
// Terminate execution if required environment variables are absent
if (missingRequired.length > 0) {
    console.error("❌ Missing required environment variables:", missingRequired.join(", "));
    process.exit(1);
}
// Warn developers during development if optional keys are missing
if (missingOptional.length > 0 && process.env.NODE_ENV !== "production") {
    console.warn("⚠️  Missing optional environment variables:", missingOptional.join(", "));
    console.warn("   App will continue but some features may not work properly");
}
// Connect to the database using configurations
const db_1 = __importDefault(require("./config/db"));
const prisma_1 = __importDefault(require("./config/prisma"));
(0, db_1.default)();
// Initialize the Express framework instance
const app = (0, express_1.default)();
// Middleware
// Define the allowed CORS origins. Filters out undefined values from variables
const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    process.env.CLIENT_URL,
    process.env.FRONTEND_URL,
    "https://foss.nitsri.ac.in",
    "https://www.foss.nitsri.ac.in",
].filter(Boolean);
if (process.env.NODE_ENV !== "production") {
    console.log("Allowed CORS origins:", allowedOrigins);
}
// Enable Cross-Origin Resource Sharing (CORS) rules
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (process.env.NODE_ENV !== "production") {
            console.log("CORS request from origin:", origin);
        }
        // Allow requests with no origin (like mobile apps, postman, curl)
        if (!origin) {
            callback(null, true);
        }
        else if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            if (process.env.NODE_ENV !== "production") {
                console.error("CORS blocked request from:", origin);
            }
            callback(new Error("Not allowed by CORS"));
        }
    },
    // Permit credentials (cookies/authorization headers) to pass through
    credentials: true,
}));
app.use((0, compression_1.default)()); // Gzip compression middleware to shrink response payload
app.use(express_1.default.json()); // Body-parser for JSON payloads
app.use((0, cookie_parser_1.default)()); // Parser for reading cookies from req.cookies
// Main Route Configurations
app.use("/api/admin", authRoutes_1.default); // Authentication flow (Admin side logins)
app.use("/api/admin/stats", statsRoutes_1.default); // Admin dashboard statistics counters
app.use("/api/events", eventRoutes_1.default); // Public events & registrations
app.use("/api/blogs", blogRoutes_1.default); // Blog posting and reading
app.use("/api/team", teamRoutes_1.default); // Club core members
app.use("/api/alumni", alumniRoutes_1.default); // Alumni network catalog
app.use("/api/upload", uploadRoutes_1.default); // File/Media upload controller (Cloudinary integration)
app.use("/api/contact", contactRoutes_1.default); // Contact form submissions
app.use("/api/sheet", sheetRoutes_1.default); // Google sheets synchronization
app.use("/api/gallery", galleryRoutes_1.default); // Public event image gallery
// Health check endpoint
// Tests database responsiveness as well as server process availability
app.get("/health", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Run a fast query to test Prisma client communication with the DB
        yield prisma_1.default.$queryRaw `SELECT 1`;
        res.json({ status: "ok", message: "Server and database are healthy" });
    }
    catch (error) {
        console.error("Health check failed:", error instanceof Error ? error.message : error);
        res.status(500).json({
            status: "error",
            message: "Database connection failed",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}));
// Root welcome message
app.get("/", (req, res) => {
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
    }
    else {
        console.log(`FOSS Club API Server started on port ${PORT}`);
    }
});

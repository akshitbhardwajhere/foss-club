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
// Routes
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const eventRoutes_1 = __importDefault(require("./routes/eventRoutes"));
const blogRoutes_1 = __importDefault(require("./routes/blogRoutes"));
const teamRoutes_1 = __importDefault(require("./routes/teamRoutes"));
const statsRoutes_1 = __importDefault(require("./routes/statsRoutes"));
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
const contactRoutes_1 = __importDefault(require("./routes/contactRoutes"));
// Load env vars
dotenv_1.default.config();
// Connect to database securely
const db_1 = __importDefault(require("./config/db"));
const prisma_1 = __importDefault(require("./config/prisma"));
(0, db_1.default)();
const app = (0, express_1.default)();
// Middleware
// Allow localhost for development and use CLIENT_URL from env for production
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
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (process.env.NODE_ENV !== "production") {
            console.log("CORS request from origin:", origin);
        }
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
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Main Routes
app.use("/api/admin", authRoutes_1.default);
app.use("/api/admin/stats", statsRoutes_1.default);
app.use("/api/events", eventRoutes_1.default);
app.use("/api/blogs", blogRoutes_1.default);
app.use("/api/team", teamRoutes_1.default);
app.use("/api/upload", uploadRoutes_1.default);
app.use("/api/contact", contactRoutes_1.default);
// Health check endpoint
app.get("/health", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Test database connection
        yield prisma_1.default.$queryRaw `SELECT 1`;
        res.json({ status: "ok", message: "Server and database are healthy" });
    }
    catch (error) {
        if (process.env.NODE_ENV !== "production") {
            console.error("Health check failed:", error);
        }
        res.status(500).json({
            status: "error",
            message: "Database connection failed",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}));
// Basic route
app.get("/", (req, res) => {
    res.send("FOSS Club API Server (Prisma/Postgres) is running");
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    if (process.env.NODE_ENV !== "production") {
        console.log(`=== FOSS Club Server Started ===`);
    }
});

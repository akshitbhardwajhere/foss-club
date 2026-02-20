"use strict";
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
// Load env vars
dotenv_1.default.config();
// Connect to database securely
const db_1 = __importDefault(require("./config/db"));
(0, db_1.default)();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
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
// Basic route
app.get("/", (req, res) => {
    res.send("FOSS Club API Server (Prisma/Postgres) is running");
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

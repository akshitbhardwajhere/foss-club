import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

// Routes
import authRoutes from "./routes/authRoutes";
import eventRoutes from "./routes/eventRoutes";
import blogRoutes from "./routes/blogRoutes";
import teamRoutes from "./routes/teamRoutes";
import statsRoutes from "./routes/statsRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import contactRoutes from "./routes/contactRoutes";

// Load env vars
dotenv.config();

// Connect to database securely
import connectDB from "./config/db";
connectDB();

const app: Express = express();

// Middleware
const allowedOrigins = ["http://localhost:3000", process.env.CLIENT_URL].filter(
  Boolean,
) as string[];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

// Main Routes
app.use("/api/admin", authRoutes);
app.use("/api/admin/stats", statsRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/contact", contactRoutes);

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.send("FOSS Club API Server (Prisma/Postgres) is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

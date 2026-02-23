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
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../config/prisma"));
const protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    // Log request details for debugging (dev only)
    if (process.env.NODE_ENV !== "production") {
        const origin = req.get("origin");
        const referer = req.get("referer");
        console.log(`\n[AUTH] ${req.method} ${req.path}`);
        console.log(`  Origin: ${origin}`);
        console.log(`  Referer: ${referer}`);
        console.log(`  Cookies: ${JSON.stringify(req.cookies)}`);
        console.log(`  Authorization header: ${req.headers.authorization ? "present" : "missing"}`);
    }
    // Check for token in cookies first, fallback to Authorization header
    if (req.cookies.jwt) {
        token = req.cookies.jwt;
        if (process.env.NODE_ENV !== "production") {
            console.log("✓ Token found in cookies");
        }
    }
    else if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
        if (process.env.NODE_ENV !== "production") {
            console.log("✓ Token found in Authorization header");
        }
    }
    if (token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "supersecretjwtkey_change_me_later");
            const admin = yield prisma_1.default.admin.findUnique({
                where: { id: decoded.id },
                select: { id: true, email: true, createdAt: true, updatedAt: true },
            });
            if (!admin) {
                console.error("Auth error: Admin not found with ID:", decoded.id);
                res.status(401).json({ message: "Not authorized, admin not found" });
                return;
            }
            req.admin = admin;
            if (process.env.NODE_ENV !== "production") {
                console.log("✓ Authentication successful for:", admin.email);
            }
            next();
        }
        catch (error) {
            console.error("Auth error: Token verification failed");
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    }
    else {
        if (process.env.NODE_ENV !== "production") {
            console.log("Auth: No token provided. Cookies:", Object.keys(req.cookies));
        }
        res.status(401).json({ message: "Not authorized, no token" });
    }
});
exports.protect = protect;

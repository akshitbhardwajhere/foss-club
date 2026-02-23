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
    // Check for token in cookies first, fallback to Authorization header
    if (req.cookies.jwt) {
        token = req.cookies.jwt;
        console.log("Token found in cookies");
    }
    else if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
        console.log("Token found in Authorization header");
    }
    if (token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "supersecretjwtkey_change_me_later");
            const admin = yield prisma_1.default.admin.findUnique({
                where: { id: decoded.id },
                select: { id: true, email: true, createdAt: true, updatedAt: true }, // Exclude passwordHash
            });
            if (!admin) {
                console.warn("Admin not found with ID:", decoded.id);
                res.status(401).json({ message: "Not authorized, admin not found" });
                return;
            }
            req.admin = admin;
            next();
        }
        catch (error) {
            console.error("Token verification error:", error);
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    }
    else {
        console.warn("No token provided. Cookies:", Object.keys(req.cookies), "Auth header:", req.headers.authorization ? "present" : "missing");
        res.status(401).json({ message: "Not authorized, no token" });
    }
});
exports.protect = protect;

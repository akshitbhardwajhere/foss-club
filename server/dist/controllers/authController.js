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
exports.getMe = exports.logoutAdmin = exports.loginAdmin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../config/prisma"));
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET || "supersecretjwtkey_change_me_later", {
        expiresIn: "30d",
    });
};
const setTokenCookie = (res, token) => {
    const isProduction = process.env.NODE_ENV === "production";
    const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
        maxAge: 30 * 24 * 60 * 60 * 1000,
    };
    res.cookie("jwt", token, cookieOptions);
};
/**
 * Handles the login process for an admin user.
 *
 * Verifies the credentials against the database. If successful,
 * it generates a JWT token and attaches it to an HttpOnly cookie.
 *
 * @param {Request} req - The Express request object, expecting `email` and `password` in the body.
 * @param {Response} res - The Express response object used to set the cookie and return the session info.
 * @returns {Promise<void>}
 */
const loginAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const admin = yield prisma_1.default.admin.findUnique({ where: { email } });
        if (admin && (yield bcryptjs_1.default.compare(password, admin.passwordHash))) {
            const token = generateToken(admin.id);
            setTokenCookie(res, token);
            res.json({
                id: admin.id,
                email: admin.email,
                message: "Login successful",
            });
        }
        else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    }
    catch (error) {
        console.error("Login error:", error instanceof Error ? error.message : error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.loginAdmin = loginAdmin;
/**
 * Handles the logout process for an admin user.
 *
 * Clears the JWT HTTP-only cookie by setting its expiration date to the past.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object used to clear the cookie.
 * @returns {Promise<void>}
 */
const logoutAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("jwt", "", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
        expires: new Date(0),
    });
    res.status(200).json({ message: "Logged out successfully" });
});
exports.logoutAdmin = logoutAdmin;
/**
 * Retrieves the currently authenticated admin's profile.
 *
 * Assumes that the `protect` middleware has already attached the admin
 * object to the request.
 *
 * @param {Request} req - The Express request object containing the admin data.
 * @param {Response} res - The Express response object.
 * @returns {Promise<void>}
 */
const getMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // admin is attached by the protect middleware
    const admin = req.admin;
    if (admin) {
        res.json({
            id: admin.id,
            email: admin.email,
        });
    }
    else {
        res.status(404).json({ message: "Admin not found" });
    }
});
exports.getMe = getMe;

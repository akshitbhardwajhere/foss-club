import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma";

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  let token;

  // Log request details for debugging
  const origin = req.get("origin");
  const referer = req.get("referer");
  console.log(`\n[AUTH] ${req.method} ${req.path}`);
  console.log(`  Origin: ${origin}`);
  console.log(`  Referer: ${referer}`);
  console.log(`  Cookies: ${JSON.stringify(req.cookies)}`);
  console.log(
    `  Authorization header: ${req.headers.authorization ? "present" : "missing"}`,
  );

  // Check for token in cookies first, fallback to Authorization header
  if (req.cookies.jwt) {
    token = req.cookies.jwt;
    console.log("✓ Token found in cookies");
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    console.log("✓ Token found in Authorization header");
  }

  if (token) {
    try {
      const decoded: any = jwt.verify(
        token,
        process.env.JWT_SECRET || "supersecretjwtkey_change_me_later",
      );

      const admin = await prisma.admin.findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true, createdAt: true, updatedAt: true },
      });

      if (!admin) {
        console.warn("✗ Admin not found with ID:", decoded.id);
        res.status(401).json({ message: "Not authorized, admin not found" });
        return;
      }

      (req as any).admin = admin;
      console.log("✓ Authentication successful for:", admin.email);

      next();
    } catch (error) {
      console.error("✗ Token verification error:", error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    console.warn(
      "✗ No token provided. Cookies present:",
      Object.keys(req.cookies),
      "Auth header:",
      req.headers.authorization ? "present" : "missing",
    );
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

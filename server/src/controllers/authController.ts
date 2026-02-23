import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma";

const generateToken = (id: string) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || "supersecretjwtkey_change_me_later",
    {
      expiresIn: "30d",
    },
  );
};

const setTokenCookie = (res: Response, token: string) => {
  const isProduction = process.env.NODE_ENV === "production";
  const cookieOptions: any = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  };

  res.cookie("jwt", token, cookieOptions);
};

export const loginAdmin = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const admin = await prisma.admin.findUnique({ where: { email } });

    if (admin && (await bcrypt.compare(password, admin.passwordHash))) {
      const token = generateToken(admin.id);
      setTokenCookie(res, token);

      res.json({
        id: admin.id,
        email: admin.email,
        message: "Login successful",
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Login error");
    }
    res.status(500).json({ message: "Server error" });
  }
};

export const logoutAdmin = async (
  req: Request,
  res: Response,
): Promise<void> => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  // admin is attached by the protect middleware
  const admin = (req as any).admin;
  if (admin) {
    res.json({
      id: admin.id,
      email: admin.email,
    });
  } else {
    res.status(404).json({ message: "Admin not found" });
  }
};

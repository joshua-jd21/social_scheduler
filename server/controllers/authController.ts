import { Request, Response } from "express";
import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const generateToken = (id: string) => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign({ id }, jwtSecret, { expiresIn: "30d" });
};

// Register User
// POST /api/auth/register
export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      !email ||
      !password
    ) {
      res.status(400).json({
        message: "Name, email and password are required",
      });
      return;
    }

    if (typeof email !== "string" || !emailRegex.test(email.trim())) {
      res.status(400).json({
        message: "Please provide a valid email address",
      });
      return;
    }

    if (typeof password !== "string" || password.length < 6) {
      res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
      return;
    }

    const normalizedEmail = normalizeEmail(email);
    const userExists = await User.findOne({ email: normalizedEmail });

    if (userExists) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(400).json({
        message: "Invalid user data",
      });
    }
  } catch (error: any) {
    res.status(500).json({
      message: error?.message || "Server error",
    });
  }
};

// Login User
// POST /api/auth/login
export const loginUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        message: "Email and password are required",
      });
      return;
    }

    if (typeof email !== "string" || !emailRegex.test(email.trim())) {
      res.status(400).json({
        message: "Please provide a valid email address",
      });
      return;
    }

    if (typeof password !== "string" || password.length < 6) {
      res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
      return;
    }

    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(401).json({
        message: "Invalid email or password",
      });
    }
  } catch (error: any) {
    res.status(500).json({
      message: error?.message || "Server error",
    });
  }
};

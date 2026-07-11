import { Router } from "express";
import {
  loginUser,
  registerUser,
} from "../controllers/authController.js";

const authRouter = Router();

// Register User
// POST /api/auth/register
authRouter.post("/register", registerUser);

// Login User
// POST /api/auth/login
authRouter.post("/login", loginUser);

export default authRouter;
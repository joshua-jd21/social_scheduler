import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";

import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";

const app = express();

// Database Connection
await connectDB();

// Middleware
app.use(
  cors({
    origin:
      process.env.CLIENT_ORIGIN?.split(",") ?? [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
      ],
    credentials: true,
  })
);

app.use(express.json());

// Port
const port = process.env.PORT || 3000;

// Health Check Route
app.get("/", (_req: Request, res: Response) => {
  res.send("Server is Live!");
});

// Routes
app.use("/api/auth", authRouter);

// Global Error Handler
app.use(
  (
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    console.error(err);

    res
      .status(500)
      .send(err?.response?.data?.message || err?.message || "Server Error");
  }
);

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});
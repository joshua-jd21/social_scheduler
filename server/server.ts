import "dotenv/config";
import express, {
  NextFunction,
  Request,
  Response,
} from "express";
import cors from "cors";

import connectDB from "./config/db.js";

import authRouter from "./routes/authRoutes.js";
import socialAuthRouter from "./routes/socialauthRoutes.js";
import accountRouter from "./routes/accountRoutes.js";
import postRouter from "./routes/postRoutes.js";
import activityRouter from "./routes/activityRoutes.js";

import { initScheduler } from "./services/schedulerService.js";

const app = express();

/* ===========================
   Database Connection
=========================== */
await connectDB();

/* ===========================
   Middleware
=========================== */
app.use(
  cors({
    origin:
      process.env.CLIENT_ORIGIN?.split(",") || [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
      ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ===========================
   Port
=========================== */
const PORT = process.env.PORT || 3000;

/* ===========================
   Health Check
=========================== */
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is Live!",
  });
});

/* ===========================
   API Routes
=========================== */
app.use("/api/auth", authRouter);

app.use("/api/oauth", socialAuthRouter);

app.use("/api/accounts", accountRouter);

app.use("/api/posts", postRouter);

app.use("/api/activity", activityRouter);

/* ===========================
   Scheduler
=========================== */
initScheduler();

/* ===========================
   404 Route
=========================== */
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/* ===========================
   Global Error Handler
=========================== */
app.use(
  (
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    console.error("Server Error:", err);

    res.status(err.status || 500).json({
      success: false,
      message:
        err?.response?.data?.message ||
        err?.message ||
        "Internal Server Error",
    });
  }
);

/* ===========================
   Start Server
=========================== */
app.listen(PORT, () => {
  console.log(
    `🚀 Server is running at http://localhost:${PORT}`
  );
});
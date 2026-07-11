import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddlewware.js";
import { ActivityLog } from "../models/ActivityLogs.js";

// Get all activity
// GET /api/activity
export const getActivity = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user?._id) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const activity = await ActivityLog.find({
      user: req.user._id,
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("relatedPost", "content");

    res.status(200).json({
      success: true,
      count: activity.length,
      activity,
    });
  } catch (error: any) {
    console.error("Get Activity Error:", error);

    res.status(500).json({
      success: false,
      message: error?.message || "Server Error",
    });
  }
};
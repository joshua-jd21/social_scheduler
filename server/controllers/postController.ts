import { Response } from "express";
import axios from "axios";
import { GoogleGenAI } from "@google/genai";

import { AuthRequest } from "../middlewares/authMiddlewware.js";

import { Generation } from "../models/Generation.js";
import { Post } from "../models/Post.js";

import { cloudinary } from "../config/cloudinary.js";

const ALLOWED_TONES = [
  "professional",
  "casual",
  "friendly",
  "formal",
  "humorous",
  "motivational",
  "persuasive",
];

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

const generateFluxImage = async (
  prompt: string,
  apiKey: string
): Promise<string> => {
  try {
    const response = await axios.post(
      "https://gen.pollinations.ai/v1/images/generations",
      {
        prompt,
        model: "flux",
        n: 1,
        size: "1024x1024",
        quality: "medium",
        response_format: "url",
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.data?.data?.length) {
      throw new Error("No image returned from Pollinations.");
    }

    return response.data.data[0].url;
  } catch (err: any) {
    console.error(
      "Pollinations Error:",
      err.response?.data || err.message
    );

    throw new Error("Pollinations image generation failed.");
  }
};

const uploadToCloudinary = async (
  imageUrl: string
): Promise<string> => {
  const uploaded = await cloudinary.uploader.upload(imageUrl, {
    folder: "ai-generations",
  });

  return uploaded.secure_url;
};

const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Generate post
// POST /api/posts/generate
export const generatePost = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { prompt, tone, generateImage } = req.body;

    // Validate prompt
    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      res.status(400).json({
        message: "Prompt is required.",
      });
      return;
    }

    // Validate Gemini key
    if (!process.env.GEMINI_API_KEY) {
      res.status(400).json({
        message:
          "Gemini API Key is missing. Add GEMINI_API_KEY to your .env file.",
      });
      return;
    }

    // Validate Pollinations key only if image generation requested
    if (generateImage && !process.env.POLLINATIONS_API_KEY) {
      res.status(400).json({
        message:
          "Pollinations API Key is missing. Add POLLINATIONS_API_KEY to your .env file.",
      });
      return;
    }

    // Tone validation
    const selectedTone = ALLOWED_TONES.includes(tone)
      ? tone
      : "professional";

    // Generate social media post using Gemini
    const textResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
You are an expert social media content creator.

Generate ONLY valid JSON.

{
  "content":"Complete social media caption",
  "imagePrompt":"Highly detailed AI image prompt"
}

Prompt:
${prompt}

Tone:
${selectedTone}

Instructions:

• Start with a strong hook.
• Use emojis naturally.
• Make it engaging.
• Add relevant hashtags.
• Do NOT return markdown.
• Return ONLY JSON.
`,
      config: {
        responseMimeType: "application/json",
      },
    });

    const rawText = textResponse.text || "";

    let content = "";
    let imagePrompt = prompt;

    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);

      const data = jsonMatch
        ? JSON.parse(jsonMatch[0])
        : {
            content: rawText,
            imagePrompt: prompt,
          };

      content =
        typeof data.content === "string"
          ? data.content
          : rawText;

      imagePrompt =
        typeof data.imagePrompt === "string"
          ? data.imagePrompt
          : prompt;
    } catch {
      content = rawText;
      imagePrompt = prompt;
    }

    if (!content.trim()) {
      res.status(500).json({
        message: "Gemini returned an empty response.",
      });
      return;
    }

    let mediaUrl = "";
    let imageError: string | null = null;

    // -----------------------------
    // Generate Image
    // -----------------------------
    if (generateImage) {
      try {
        // Generate Pollinations image
        const pollinationsUrl = await generateFluxImage(
          imagePrompt,
          process.env.POLLINATIONS_API_KEY!
        );

        // Upload to Cloudinary
        mediaUrl = await uploadToCloudinary(
          pollinationsUrl
        );
      } catch (error: any) {
        console.error(
          "Image Generation Error:",
          error
        );

        imageError =
          error?.message ||
          "Unable to generate image.";
      }
    }

    // Save generation
    const generation = await Generation.create({
      user: req.user._id,
      prompt,
      content,
      mediaUrl,
      mediaType: mediaUrl ? "image" : undefined,
      tone: selectedTone,
    });

    res.status(201).json({
      success: true,
      generation,
      imageError,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      message:
        error?.message || "Internal Server Error",
    });
  }
};

// ==========================================
// Get AI Generations
// GET /api/posts/generations
// ==========================================
export const getGenerations = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const generations = await Generation.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: generations.length,
      generations,
    });
  } catch (error: any) {
    console.error("Get Generations Error:", error);

    res.status(500).json({
      message: error?.message || "Server Error",
    });
  }
};

// ==========================================
// Get Scheduled Posts
// GET /api/posts
// ==========================================
export const getPosts = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const posts = await Post.find({
      user: req.user._id,
    }).sort({
      scheduledFor: 1,
    });

    res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error: any) {
    console.error("Get Posts Error:", error);

    res.status(500).json({
      message: error?.message || "Server Error",
    });
  }
};
// ==========================================
// Schedule Post
// POST /api/posts
// ==========================================
export const schedulePost = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      content,
      platforms,
      scheduledFor,
    } = req.body;

    if (!content || !content.trim()) {
      res.status(400).json({
        message: "Post content is required.",
      });
      return;
    }

    if (!platforms || !Array.isArray(platforms) || platforms.length === 0) {
      res.status(400).json({
        message: "Select at least one platform.",
      });
      return;
    }

    if (!scheduledFor) {
      res.status(400).json({
        message: "Schedule date is required.",
      });
      return;
    }

    let mediaUrl = "";
    let mediaType: "image" | "video" | undefined;

    // Upload user-selected media to Cloudinary
    if (req.file) {
      const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
        "base64"
      )}`;

      const uploadResult = await cloudinary.uploader.upload(base64, {
        folder: "scheduled-posts",
        resource_type: "auto",
      });

      mediaUrl = uploadResult.secure_url;

      if (req.file.mimetype.startsWith("image")) {
        mediaType = "image";
      } else if (req.file.mimetype.startsWith("video")) {
        mediaType = "video";
      }
    }

    const post = await Post.create({
      user: req.user._id,
      content,
      mediaUrl,
      mediaType,
      platforms,
      scheduledFor: new Date(scheduledFor),
      status: "scheduled",
    });

    res.status(201).json({
      success: true,
      message: "Post scheduled successfully.",
      post,
    });
  } catch (error: any) {
    console.error("Schedule Post Error:", error);

    res.status(500).json({
      message: error?.message || "Server Error",
    });
  }
};
import { Request, Response } from "express";
import zernio from "../config/zernio.js";
import { User } from "../models/User.js";
import { Account } from "../models/Account.js";
import { AuthRequest } from "../middlewares/authMiddlewware.js";

// Helper to ensure user has a Zernio Profile.
// TODO: listProfiles() is not scoped to this user — it currently grabs
// profiles[0] from the ENTIRE Zernio workspace, meaning multiple users
// could get assigned the same profile. Check user.zernioProfileId in
// Mongo first, and/or filter listProfiles() by an external/user ID if
// the Zernio API supports it.
const getOrCreateZernioProfile = async (user: any): Promise<string> => {
  try {
    const result = await zernio.profiles.listProfiles();
    const data = result.data as any;
    const profiles: any[] = Array.isArray(data) ? data : data?.profiles || data?.data || [];

    if (profiles.length > 0) {
      const pid = profiles[0]._id || profiles[0].id;
      await User.findByIdAndUpdate(user._id, { zernioProfileId: pid });
      return pid;
    }

    const createResult = await zernio.profiles.createProfile({
      body: { name: `${user.name || user.email}'s workspace` } as any,
    });
    const created = (createResult.data as any)?.profile || createResult.data;

    const pid = created?._id || created?.id;

    if (!pid) {
      throw new Error("Failed to create Zernio profile — no ID returned");
    }

    await User.findByIdAndUpdate(user._id, { zernioProfileId: pid });
    return pid;
  } catch (error: any) {
    console.error("getOrCreateZernioProfile Error:", error?.message || error);
    throw error;
  }
};

// Generate OAuth authorization URL
// GET /api/auth/:platform
export const generateAuthUrl = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { platform } = req.params;
    const profileId = await getOrCreateZernioProfile(req.user);

    // Fallback if Origin header is missing (e.g. server-to-server calls)
    const origin = req.headers.origin || process.env.CLIENT_URL;
    if (!origin) {
      throw new Error("Could not determine redirect origin — no Origin header and no CLIENT_URL env var set");
    }
    const redirectUrl = `${origin}/accounts`;

    const result = await zernio.connect.getConnectUrl({
      path: { platform: platform as any },
      query: {
        profileId,
        redirect_url: redirectUrl,
      },
    });

    const data = result.data as any;
    console.log("getConnectUrl response:", JSON.stringify(data, null, 2));

    const authUrl = data.authUrl;

    if (!authUrl) {
      throw new Error(`Zernio returned no authUrl. Full response: ${JSON.stringify(data)}`);
    }

    res.json({ url: authUrl });
  } catch (error: any) {
    res.status(500).json({ message: error?.message || "Server error" });
  }
};

// Sync connected accounts from Zernio into MongoDB
// GET /api/auth/sync
export const syncAccounts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const profileId = await getOrCreateZernioProfile(req.user);
    const result = await zernio.accounts.listAccounts({
      query: { profileId } as any,
    });

    const data = result.data as any;
    // TODO: confirm with team whether Zernio ever nests accounts under
    // data.data the way it does for profiles — if so this silently
    // returns [] instead of the real list.
    const zernioAccounts: any[] = data?.accounts || (Array.isArray(data) ? data : []);
    const supportedPlatforms = ["twitter", "linkedin", "facebook", "instagram"];
    const syncedAccounts = [];

    for (const zAccount of zernioAccounts) {
      const zid = zAccount._id || zAccount.id;
      if (!zid) {
        console.warn("Skipping account with no ID:", zAccount);
        continue;
      }

      const rawPlatform = (zAccount.platform || zAccount.type || "").toLowerCase();
      const normalizedPlatform = supportedPlatforms.find((p) => rawPlatform.includes(p));

      if (!normalizedPlatform) {
        console.log(`Skipping unsupported platform: "${rawPlatform}"`);
        continue;
      }

      const account = await Account.findOneAndUpdate(
        { zernioAccountId: zid },
        {
          user: req.user._id,
          platform: normalizedPlatform,
          handle: zAccount.username || zAccount.name || zAccount.handle || "Unknown",
          zernioAccountId: zid,
          status: "connected",
          avatarUrl: zAccount.avatarUrl || zAccount.picture || zAccount.profile_image_url,
        },
        { upsert: true, new: true } // fixed: was `returnDocument: 'after'`, invalid for Mongoose
      );
      syncedAccounts.push(account);
    }

    res.json(syncedAccounts);
  } catch (error: any) {
    res.status(500).json({ message: error?.message || "Server error" });
  }
};
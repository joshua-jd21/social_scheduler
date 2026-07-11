import cron from "node-cron";
import { Post } from "../models/Post.js";
import { Account } from "../models/Account.js";
import { ActivityLog } from "../models/ActivityLogs.js";
import zernio from "../config/zernio.js";

export const initScheduler = () => {
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();

      const postsToPublish = await Post.find({
        status: "scheduled",
        scheduledFor: {
          $lte: now,
        },
      });

      if (postsToPublish.length === 0) {
        return;
      }

      console.log(
        `Found ${postsToPublish.length} scheduled post(s) to publish.`
      );

      for (const post of postsToPublish) {
        try {
          const accounts = await Account.find({
            user: post.user,
            platform: {
              $in: post.platforms,
            },
            status: "connected",
          });

          if (accounts.length === 0) {
            console.log(
              `No connected accounts found for post ${post._id}`
            );
            continue;
          }

          const zernioAccounts = accounts
            .filter((account) => account.zernioAccountId)
            .map((account) => ({
              accountId: account.zernioAccountId!,
              platform: account.platform,
            }));

          if (zernioAccounts.length === 0) {
            console.log(
              `No Zernio accounts linked for post ${post._id}`
            );
            continue;
          }

          const publishPayload = {
            content: post.content,
            publishNow: true,
            platforms: zernioAccounts,

            ...(post.mediaUrl && {
              mediaItems: [
                {
                  type: post.mediaType || "image",
                  url: post.mediaUrl,
                },
              ],
            }),
          };

          console.log(
            `Publishing post ${post._id}...`
          );

          const response = await zernio.posts.createPost({
            body: publishPayload,
          });

          const publishedPost =
            (response.data as any)?.post ||
            response.data;

          if (!publishedPost) {
            throw new Error(
              "Failed to get post object from Zernio response."
            );
          }

          console.log(
            `Post published successfully: ${
              publishedPost._id ||
              publishedPost.id
            }`
          );

          post.status = "published";
          await post.save();

          await ActivityLog.create({
            user: post.user,
            actionType: "POST_PUBLISHED",
            description: `Published post to ${accounts
              .map((account) => account.platform)
              .join(", ")}`,
            relatedPost: post._id,
          });
        } catch (err: any) {
          console.error(
            `Failed to publish post ${post._id}:`,
            err?.response?.data || err?.message
          );

          post.status = "failed";
          await post.save();
        }
      }

      console.log(
        `Finished checking ${postsToPublish.length} scheduled post(s).`
      );
    } catch (error: any) {
      console.error(
        "Scheduler error:",
        error?.message || error
      );
    }
  });

  console.log("Scheduler service initialized.");
};

import { useMemo, useState } from "react";
import {
  CalendarClock,
  CheckCircle2,
  Clock,
  ImagePlus,
  Loader2,
  Send,
  UploadCloud,
} from "lucide-react";

import {
  dummyPostsData,
  PLATFORMS,
} from "../assets/assets";

type PostStatus = "draft" | "scheduled" | "published" | "failed";

interface ScheduledPost {
  _id: string;
  content: string;
  platforms: string[];
  scheduledFor: string;
  status: PostStatus;
  mediaUrl?: string;
  mediaType?: string;
}

const defaultContent =
  "Launch week is here. We built a smarter workflow for creators who want to generate, schedule, and publish social content without jumping between five different tools.";

const Scheduler = () => {
  const [content, setContent] = useState(defaultContent);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([
    "instagram",
  ]);
  const [scheduledDate, setScheduledDate] = useState("2026-07-09");
  const [scheduledTime, setScheduledTime] = useState("10:30");
  const [mediaName, setMediaName] = useState("");
  const [isScheduling, setIsScheduling] = useState(false);
  const [posts, setPosts] = useState<ScheduledPost[]>(
    dummyPostsData.slice(0, 6)
  );

  const scheduledPosts = useMemo(
    () => posts.filter((post) => post.status === "scheduled"),
    [posts]
  );

  const publishedPosts = useMemo(
    () => posts.filter((post) => post.status === "published"),
    [posts]
  );

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms((current) =>
      current.includes(platformId)
        ? current.filter((item) => item !== platformId)
        : [...current, platformId]
    );
  };

  const handleSchedule = () => {
    if (!content.trim() || selectedPlatforms.length === 0) return;

    setIsScheduling(true);
    window.setTimeout(() => {
      const scheduledFor = new Date(
        `${scheduledDate}T${scheduledTime}:00`
      ).toISOString();

      setPosts((current) => [
        {
          _id: `local-${Date.now()}`,
          content,
          platforms: selectedPlatforms,
          scheduledFor,
          status: "scheduled",
          mediaType: mediaName ? "image" : undefined,
        },
        ...current,
      ]);
      setIsScheduling(false);
    }, 700);
  };

  const formatDate = (value: string) =>
    new Intl.DateTimeFormat("en", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));

  const getPlatformName = (platformId: string) =>
    PLATFORMS.find((platform) => platform.id === platformId)?.name ??
    platformId;

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 py-1 text-sm font-medium text-red-600">
            <CalendarClock className="h-4 w-4" />
            Publishing Queue
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
            Schedule posts across every channel
          </h2>
          <p className="mt-2 max-w-2xl text-slate-500">
            Select platforms, add media, choose date and time, then queue the
            post for automatic publishing.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <p className="text-2xl font-bold text-slate-900">
              {scheduledPosts.length}
            </p>
            <p className="text-xs font-medium text-slate-500">Scheduled</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <p className="text-2xl font-bold text-slate-900">
              {publishedPosts.length}
            </p>
            <p className="text-xs font-medium text-slate-500">Published</p>
          </div>
          <div className="col-span-2 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm sm:col-span-1">
            <p className="text-2xl font-bold text-slate-900">
              {selectedPlatforms.length}
            </p>
            <p className="text-xs font-medium text-slate-500">Platforms</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-500">
              <Send className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Create Schedule</h3>
              <p className="text-sm text-slate-500">
                Compose or paste AI-generated content.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <label className="text-sm font-medium text-slate-700">
              Caption
            </label>
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={8}
              className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition focus:border-red-300 focus:bg-white focus:ring-4 focus:ring-red-100"
              placeholder="Write or paste your post caption..."
            />
          </div>

          <div className="mt-6">
            <label className="text-sm font-medium text-slate-700">
              Platforms
            </label>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {PLATFORMS.map((platform) => {
                const Icon = platform.icon;
                const isSelected = selectedPlatforms.includes(platform.id);

                return (
                  <button
                    key={platform.id}
                    onClick={() => togglePlatform(platform.id)}
                    className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
                      isSelected
                        ? "border-red-200 bg-red-50 text-red-600"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">{platform.name}</p>
                      <p className="truncate text-xs text-slate-500">
                        {platform.description}
                      </p>
                    </div>
                    {isSelected && <CheckCircle2 className="h-5 w-5" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Date
              </label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(event) => setScheduledDate(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-red-300 focus:ring-4 focus:ring-red-100"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">
                Time
              </label>
              <input
                type="time"
                value={scheduledTime}
                onChange={(event) => setScheduledTime(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-red-300 focus:ring-4 focus:ring-red-100"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="text-sm font-medium text-slate-700">
              Media
            </label>
            <label className="mt-2 flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-8 text-center transition hover:border-red-200 hover:bg-red-50">
              <UploadCloud className="mb-3 h-8 w-8 text-slate-400" />
              <span className="text-sm font-semibold text-slate-700">
                {mediaName || "Upload image or creative"}
              </span>
              <span className="mt-1 text-xs text-slate-500">
                PNG, JPG, or campaign artwork
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) =>
                  setMediaName(event.target.files?.[0]?.name ?? "")
                }
              />
            </label>
          </div>

          <button
            onClick={handleSchedule}
            disabled={
              isScheduling ||
              !content.trim() ||
              selectedPlatforms.length === 0
            }
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-red-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600 disabled:opacity-60 sm:w-auto"
          >
            {isScheduling ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CalendarClock className="h-4 w-4" />
            )}
            Publish Later
          </button>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Post Preview</h3>
            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
              <div className="flex aspect-video items-center justify-center bg-slate-50">
                <ImagePlus className="h-10 w-10 text-slate-300" />
              </div>
              <div className="space-y-4 p-4">
                <div className="flex flex-wrap gap-2">
                  {selectedPlatforms.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600"
                    >
                      {getPlatformName(item)}
                    </span>
                  ))}
                </div>
                <p className="whitespace-pre-line text-sm leading-6 text-slate-700">
                  {content || "Your scheduled post content will appear here."}
                </p>
                <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-500">
                  <Clock className="h-4 w-4" />
                  {scheduledDate} at {scheduledTime}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Upcoming Queue</h3>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                {scheduledPosts.length} posts
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {scheduledPosts.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                  No posts scheduled yet.
                </div>
              ) : (
                scheduledPosts.map((post) => (
                  <div
                    key={post._id}
                    className="rounded-2xl border border-slate-200 p-4"
                  >
                    <p className="line-clamp-2 text-sm font-medium leading-6 text-slate-800">
                      {post.content}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {post.platforms.map((item) => (
                        <span
                          key={`${post._id}-${item}`}
                          className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                        >
                          {getPlatformName(item)}
                        </span>
                      ))}
                    </div>
                    <p className="mt-3 text-xs font-medium text-slate-400">
                      {formatDate(post.scheduledFor)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
};

export default Scheduler

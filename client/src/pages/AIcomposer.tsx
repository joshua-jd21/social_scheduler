import { useState } from "react";
import {
  Copy,
  Download,
  ImageIcon,
  Loader2,
  RefreshCw,
  Save,
  Send,
  Sparkles,
  Wand2,
} from "lucide-react";

import {
  dummyGenerationData,
  PLATFORMS,
} from "../assets/assets";

type PlatformId = "instagram" | "linkedin" | "facebook" | "twitter";

const tones = [
  "Professional",
  "Friendly",
  "Casual",
  "Marketing",
  "Funny",
  "Motivational",
];

const platformHints: Record<PlatformId, string> = {
  instagram: "visual, energetic, emoji-rich",
  linkedin: "insightful, polished, professional",
  facebook: "community-focused and conversational",
  twitter: "short, sharp, and hook-led",
};

const imagePresets = [
  "Minimal product studio",
  "Modern office campaign",
  "Neon social graphic",
  "Clean creator thumbnail",
];

const buildCaption = (
  prompt: string,
  tone: string,
  platform: PlatformId,
  includeEmoji: boolean,
  includeHashtags: boolean
) => {
  const emoji = includeEmoji ? "✨ " : "";
  const platformLine =
    platform === "twitter"
      ? "Big idea, short format: "
      : `For ${PLATFORMS.find((item) => item.id === platform)?.name}: `;

  const body =
    prompt.trim() ||
    "launching a new AI-powered content workflow for busy creators";

  const hashtags = includeHashtags
    ? "\n\n#SocialMediaMarketing #AIContent #CreatorTools #ContentStrategy"
    : "";

  return `${emoji}${platformLine}${body}\n\n${tone} angle: Turn one clear message into a post that is easy to scan, useful to the audience, and ready to publish. Add a specific call-to-action so followers know what to do next.${hashtags}`;
};

const AIcomposer = () => {
  const [prompt, setPrompt] = useState(
    "Write an Instagram post about healthy eating for busy professionals."
  );
  const [imagePrompt, setImagePrompt] = useState(
    "Minimalist healthy meal prep on a bright kitchen counter"
  );
  const [tone, setTone] = useState(tones[0]);
  const [platform, setPlatform] = useState<PlatformId>("instagram");
  const [includeEmoji, setIncludeEmoji] = useState(true);
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [caption, setCaption] = useState("");
  const [generatedImage, setGeneratedImage] = useState("");
  const [isGeneratingCaption, setIsGeneratingCaption] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [copied, setCopied] = useState(false);
  const [recentGenerations, setRecentGenerations] = useState(
    dummyGenerationData.slice(0, 4)
  );

  const handleGenerateCaption = () => {
    setIsGeneratingCaption(true);
    window.setTimeout(() => {
      setCaption(
        buildCaption(
          prompt,
          tone,
          platform,
          includeEmoji,
          includeHashtags
        )
      );
      setIsGeneratingCaption(false);
    }, 650);
  };

  const handleGenerateImage = () => {
    setIsGeneratingImage(true);
    window.setTimeout(() => {
      const encodedPrompt = encodeURIComponent(imagePrompt || imagePresets[0]);
      setGeneratedImage(
        `https://image.pollinations.ai/prompt/${encodedPrompt}?width=900&height=900&seed=${Date.now()}`
      );
      setIsGeneratingImage(false);
    }, 700);
  };

  const handleCopy = async () => {
    if (!caption) return;

    await navigator.clipboard.writeText(caption);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const handleSave = () => {
    if (!caption) return;

    setRecentGenerations((current) => [
      {
        _id: `local-${Date.now()}`,
        user: "local",
        prompt,
        content: caption,
        mediaUrl: generatedImage,
        mediaType: generatedImage ? "image" : undefined,
        tone,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      ...current,
    ]);
  };

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 py-1 text-sm font-medium text-red-600">
            <Sparkles className="h-4 w-4" />
            AI Content Studio
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
            Create captions and campaign visuals
          </h2>
          <p className="mt-2 max-w-2xl text-slate-500">
            Draft platform-specific posts, generate hashtags, preview the
            result, and prepare content for scheduling.
          </p>
        </div>

        <button
          onClick={handleGenerateCaption}
          disabled={isGeneratingCaption}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-red-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600 disabled:opacity-60 sm:w-auto"
        >
          {isGeneratingCaption ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="h-4 w-4" />
          )}
          Generate Caption
        </button>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-500">
                <Send className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">
                  Caption Generator
                </h3>
                <p className="text-sm text-slate-500">
                  Choose the platform, tone, and format.
                </p>
              </div>
            </div>

            <label className="text-sm font-medium text-slate-700">
              Content prompt
            </label>
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              rows={6}
              className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition focus:border-red-300 focus:bg-white focus:ring-4 focus:ring-red-100"
              placeholder="Describe the post you want AI to create..."
            />

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Platform
                </label>
                <select
                  value={platform}
                  onChange={(event) =>
                    setPlatform(event.target.value as PlatformId)
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-red-300 focus:ring-4 focus:ring-red-100"
                >
                  {PLATFORMS.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Tone
                </label>
                <select
                  value={tone}
                  onChange={(event) => setTone(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-red-300 focus:ring-4 focus:ring-red-100"
                >
                  {tones.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                Emoji support
                <input
                  type="checkbox"
                  checked={includeEmoji}
                  onChange={(event) => setIncludeEmoji(event.target.checked)}
                  className="h-4 w-4 accent-red-500"
                />
              </label>

              <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                Generate hashtags
                <input
                  type="checkbox"
                  checked={includeHashtags}
                  onChange={(event) =>
                    setIncludeHashtags(event.target.checked)
                  }
                  className="h-4 w-4 accent-red-500"
                />
              </label>
            </div>

            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
              Writing style: {platformHints[platform]}.
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                  <ImageIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    AI Image Generator
                  </h3>
                  <p className="text-sm text-slate-500">
                    Create a visual to pair with the post.
                  </p>
                </div>
              </div>
            </div>

            <input
              value={imagePrompt}
              onChange={(event) => setImagePrompt(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-red-300 focus:bg-white focus:ring-4 focus:ring-red-100"
              placeholder="Describe the image you want..."
            />

            <div className="mt-4 flex flex-wrap gap-2">
              {imagePresets.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setImagePrompt(preset)}
                  className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                  {preset}
                </button>
              ))}
            </div>

            <button
              onClick={handleGenerateImage}
              disabled={isGeneratingImage}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-60 sm:w-auto"
            >
              {isGeneratingImage ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : generatedImage ? (
                <RefreshCw className="h-4 w-4" />
              ) : (
                <ImageIcon className="h-4 w-4" />
              )}
              {generatedImage ? "Regenerate Image" : "Generate Image"}
            </button>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold text-slate-900">Post Preview</h3>
                <p className="text-sm text-slate-500">
                  Ready for copy or scheduling.
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                {PLATFORMS.find((item) => item.id === platform)?.name}
              </span>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
              {generatedImage ? (
                <img
                  src={generatedImage}
                  alt="Generated social media creative"
                  className="aspect-square w-full object-cover"
                />
              ) : (
                <div className="flex aspect-square w-full flex-col items-center justify-center bg-slate-50 text-center text-slate-400">
                  <ImageIcon className="mb-3 h-10 w-10" />
                  <p className="text-sm font-medium">No image generated yet</p>
                </div>
              )}
            </div>

            <div className="mt-5 min-h-48 whitespace-pre-line rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
              {caption ||
                "Generate a caption to see the final post copy here."}
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <button
                onClick={handleCopy}
                disabled={!caption}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                <Copy className="h-4 w-4" />
                {copied ? "Copied" : "Copy"}
              </button>
              <button
                onClick={handleSave}
                disabled={!caption}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                Save
              </button>
              <a
                href={generatedImage || "#"}
                download
                className={`inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold transition ${
                  generatedImage
                    ? "text-slate-700 hover:bg-slate-50"
                    : "pointer-events-none text-slate-300"
                }`}
              >
                <Download className="h-4 w-4" />
                Image
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">
              Generation History
            </h3>
            <div className="mt-4 space-y-3">
              {recentGenerations.map((item) => (
                <button
                  key={item._id}
                  onClick={() => {
                    setPrompt(item.prompt);
                    setCaption(item.content);
                    if (item.mediaUrl) setGeneratedImage(item.mediaUrl);
                  }}
                  className="w-full rounded-xl border border-slate-200 p-4 text-left transition hover:border-red-200 hover:bg-red-50"
                >
                  <p className="line-clamp-1 text-sm font-semibold text-slate-900">
                    {item.prompt}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                    {item.content}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
};

export default AIcomposer

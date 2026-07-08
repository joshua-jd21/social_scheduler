import {
  CheckCircle,
  ExternalLink,
  Loader2,
  X,
} from "lucide-react";
import { PLATFORMS } from "../assets/assets";

interface PlatformPickerModalProps {
  connectedIds: string[];
  connecting: string | null;
  onClose: () => void;
  onConnect: (platformId: string) => void;
}

const PlatformPickerModal = ({
  connectedIds,
  connecting,
  onClose,
  onConnect,
}: PlatformPickerModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-900">
            Choose a Platform
          </h3>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Platform List */}
        <div className="flex flex-col gap-2 p-6">
          {PLATFORMS.map((platform) => {
            const isConnected = connectedIds.includes(platform.id);
            const isConnecting = connecting === platform.id;

            return (
              <button
                key={platform.id}
                disabled={isConnected || isConnecting}
                onClick={() => onConnect(platform.id)}
                className={`
                  flex items-center gap-4 rounded-xl border p-4 text-left transition-all
                  ${
                    isConnected
                      ? "border-red-100 bg-red-50 cursor-not-allowed"
                      : "border-slate-200 hover:border-red-300 hover:bg-red-50"
                  }
                `}
              >
                {/* Icon */}
                <div className="rounded-lg bg-slate-100 p-2">
                  <platform.icon
                    className={`h-5 w-5 ${
                      isConnected ? "text-red-600" : "text-slate-600"
                    }`}
                  />
                </div>

                {/* Label */}
                <div className="min-w-0 flex-1">
                  <p
                    className={`font-medium ${
                      isConnected ? "text-red-700" : "text-slate-900"
                    }`}
                  >
                    {platform.name}
                  </p>

                  <p className="truncate text-sm text-slate-500">
                    {isConnected
                      ? "Already connected"
                      : platform.description}
                  </p>
                </div>

                {/* Status */}
                {isConnected && (
                  <CheckCircle className="h-5 w-5 shrink-0 text-red-500" />
                )}

                {isConnecting && (
                  <Loader2 className="h-5 w-5 shrink-0 animate-spin text-red-500" />
                )}

                {!isConnected && !isConnecting && (
                  <ExternalLink className="h-4 w-4 shrink-0 text-slate-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PlatformPickerModal;
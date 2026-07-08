import {
  AlertCircle,
  CheckCircle2,
  Link2Off,
  Plus,
} from "lucide-react";
import { PLATFORMS } from "../assets/assets";

interface SocialAccount {
  _id: string;
  platform: string;
  handle: string;
  status: "connected" | "disconnected";
}

interface AccountListProps {
  accounts: SocialAccount[];
  onDisconnect: (accountId: string) => Promise<void>;
}

const AccountList = ({
  accounts,
  onDisconnect,
}: AccountListProps) => {
  const handleDisconnect = async (accountId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to disconnect this account?"
    );

    if (!confirmed) return;

    await onDisconnect(accountId);
  };

  if (accounts.length === 0) {
    return (
      <div
        className="
          bg-white
          rounded-2xl
          border-2
          border-dashed
          border-slate-200
          flex
          flex-col
          items-center
          justify-center
          py-20
          px-6
        "
      >
        <div
          className="
            size-14
            bg-slate-50
            rounded-2xl
            flex
            items-center
            justify-center
            mb-4
            border
            border-slate-100
          "
        >
          <Plus className="size-6 text-slate-400" />
        </div>

        <h3 className="text-lg font-semibold text-slate-900">
          No accounts connected
        </h3>

        <p className="mt-2 max-w-md text-center text-slate-500">
          Connect your first social platform to start scheduling
          and automating your content.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      {accounts.map((account) => {
        const meta = PLATFORMS.find(
          (platform) => platform.id === account.platform
        );

        if (!meta) return null;

        const Icon = meta.icon;

        return (
          <div
            key={account._id}
            className="
              group
              bg-white
              border
              border-slate-200
              rounded-2xl
              p-5
              flex
              items-center
              justify-between
              shadow-sm
              transition-all
              hover:border-slate-300
              hover:shadow-md
            "
          >
            <div className="flex items-center gap-4">
              <div
                className="
                  size-12
                  rounded-xl
                  bg-slate-50
                  flex
                  items-center
                  justify-center
                "
              >
                <Icon className="size-6 text-slate-600" />
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 truncate">
                  {account.handle}
                </h3>

                <p className="text-sm text-slate-500">
                  {meta.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {account.status === "connected" ? (
                <>
                  <CheckCircle2 className="size-4 text-emerald-500" />

                  <span className="text-xs font-medium text-emerald-600">
                    Connected
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="size-4 text-amber-500" />

                  <span className="text-xs font-medium text-amber-600">
                    Disconnected
                  </span>
                </>
              )}

              <button
                onClick={() => handleDisconnect(account._id)}
                title="Disconnect account"
                className="
                  ml-2
                  p-2
                  rounded-lg
                  text-slate-400
                  transition-all
                  hover:bg-red-50
                  hover:text-red-500
                "
              >
                <Link2Off className="size-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AccountList;
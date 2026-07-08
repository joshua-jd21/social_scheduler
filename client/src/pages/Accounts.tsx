/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { Plus } from "lucide-react";

import AccountList from "../components/AccountList";
import PlatformPickerModal from "../components/PlatformPickerModal";
import { dummyAccountsData, PLATFORMS } from "../assets/assets";

const Accounts = () => {
  const [accounts, setAccounts] = useState<any[]>(dummyAccountsData);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [showPlatformPicker, setShowPlatformPicker] = useState(false);

  // Connect account
  const handleConnect = async (platformId: string) => {
    setConnecting(platformId);

    // TODO:
    // Replace with OAuth + backend integration
    setTimeout(() => {
      const platform = PLATFORMS.find((item) => item.id === platformId);

      setConnecting(null);

      setAccounts((prev) => [
        ...prev,
        {
          _id: `demo-${platformId}`,
          handle: platform?.name ?? platformId,
          platform: platformId,
          status: "connected",
        },
      ]);

      setShowPlatformPicker(false);
    }, 1000);
  };

  // Disconnect account
  const handleDisconnect = async (accountId: string) => {
    // TODO:
    // Replace with backend API call
    setAccounts((prev) =>
      prev.filter((account) => account._id !== accountId)
    );
  };

  // Platforms already connected
  const connectedIds = accounts.map((account) => account.platform);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Connected Accounts
          </h2>

          <p className="mt-1 text-slate-500">
            {accounts.length} of {PLATFORMS.length} platforms connected
          </p>
        </div>

        <button
          onClick={() => setShowPlatformPicker(true)}
          className="
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-full
            bg-red-500
            px-5
            py-2.5
            font-medium
            text-white
            transition-all
            duration-200
            hover:bg-red-600
            hover:shadow-lg
            active:scale-95
            sm:w-auto
          "
        >
          <Plus className="h-4 w-4" />
          Connect Account
        </button>
      </div>

      {/* Platform Picker Modal */}
      {showPlatformPicker && (
        <PlatformPickerModal
          connectedIds={connectedIds}
          connecting={connecting}
          onClose={() => setShowPlatformPicker(false)}
          onConnect={handleConnect}
        />
      )}

      {/* Connected Accounts */}
      <AccountList
        accounts={accounts}
        onDisconnect={handleDisconnect}
      />
    </div>
  );
};

export default Accounts;

"use client";
import { PollCoinBundles } from "@/components/shop/components/PollCoinBundles";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import BuyPollcoinsFlow from "@/components/shop/components/dialogs/BuyPollcoins";

export default function BuyPollCoinsPage() {
  const router = useRouter();

  return (
    <div className="md:px-10 px-4 pb-16 py-8 pt-0 max-md:w-screen">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Buy PollCoin</span>
        </button>
      </div>

      <PollCoinBundles />

      {/* PollCoin Purchase Dialog */}
      <BuyPollcoinsFlow>
        <div style={{ display: "none" }} />
      </BuyPollcoinsFlow>
    </div>
  );
}

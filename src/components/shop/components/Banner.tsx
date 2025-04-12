import React from "react";
import { useShopStore } from "../store/useShopStore";
import { useUserBalance } from "../queries/useBalance";
import { Skeleton } from "@/components/ui/skeleton";

export function Banner() {
  const { data, isLoading } = useUserBalance();
  const { unrestrictedBalance } = data || {};
  return (
    <div className="bg-gradient-to-br from-[#9D50BB] via-[#5B03B2] to-[#260D3E] w-full py-5 px-4 text-white rounded-lg">
      <p>Coin Balance</p>
      {isLoading ? (
        <Skeleton className="h-6 w-full mt-2" />
      ) : (
        <h4 className="font-bold text-2xl mt-2">
          {unrestrictedBalance || 0}pc
        </h4>
      )}
    </div>
  );
}

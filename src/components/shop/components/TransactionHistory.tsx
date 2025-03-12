import Link from "next/link";
import React from "react";

export function TransactionHistory() {
  return (
    <div className="mt-[29px]">
      <div className="flex items-center justify-between">
        <p className="text-xl font-bold">Transaction History</p>

        <div>
          <Link href="#" className="font-bold text-[#5B03B2]">
            <span className="underline">See All</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

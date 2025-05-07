"use client";

import React, { useState } from "react";
import { usePendingPayouts } from "./queries/usePendingPayouts";
import { PendingPayoutsTable } from "./components/table";

export function PayoutPage() {
  const [page, setPage] = useState(1);
  const { data: payoutPendingData, isLoading } = usePendingPayouts(page);
  const payouts = payoutPendingData?.data || [];
  const total = payoutPendingData?.total ?? 0;
  const pageSize = payoutPendingData?.page_size ?? 20;
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="p-2 sm:p-4 w-full">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
        Payouts Overview
      </h2>

      <div>
        <PendingPayoutsTable
          payoutData={payouts}
          isHistoryLoading={isLoading}
          pagination={
            payoutPendingData?.page
              ? {
                  page: payoutPendingData?.page,
                  totalPages: totalPages,
                  setPage: setPage,
                }
              : undefined
          }
        />
      </div>
    </div>
  );
}

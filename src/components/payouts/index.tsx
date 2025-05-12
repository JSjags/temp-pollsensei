"use client";
import React, { useState } from "react";
import { Analytics } from "./components/Analytics";
import { PayoutsHistoryTable } from "./components/table";
import { usePayoutHistory } from "./queries/usePayoutHistory";

export function PayoutPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = usePayoutHistory({ page });
  const total = data?.total ?? 0;
  const pageSize = data?.page_size ?? 20;
  const totalPages = Math.ceil(total / pageSize);
  return (
    <>
      <Analytics />
      <div className="max-md:px-5 ">
        <PayoutsHistoryTable
          payoutData={data?.data || []}
          isHistoryLoading={isLoading}
          pagination={
            data?.page && {
              page: data.page,
              totalPages: totalPages,
              setPage: setPage,
            }
          }
        />
      </div>
    </>
  );
}

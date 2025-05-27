"use client";
import React, { useEffect, useState } from "react";
import { Analytics } from "./components/Analytics";
import { PayoutsHistoryTable } from "./components/table";
import { usePayoutHistory } from "./queries/usePayoutHistory";
import { usePayoutStore } from "./store/usePayoutStore";
import { PayoutDialog } from "./components/dialogs";
import { toast } from "react-toastify";
import { useStripePayoutBanks } from "./queries/useStripePayoutBanks";

export function PayoutPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = usePayoutHistory({ page });
  const total = data?.total ?? 0;
  const pageSize = data?.page_size ?? 20;
  const totalPages = Math.ceil(total / pageSize);
  const { setDialogOpen, setStep, setSelectedOption,setWasRedirected } = usePayoutStore();
  const {data:PayoutBanks} = useStripePayoutBanks()
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("account_link_status") === "success") {
      setDialogOpen(true);
      setStep("checkout");
      setSelectedOption("Stripe");
      setWasRedirected(true);
      toast.success("Stripe account successfully connected");
      const url = new URL(window.location.href);
      url.searchParams.delete("account_link_status");
      window.history.replaceState({}, document.title, url.toString());
    }
  }, []);
  return (
    <>
      <PayoutDialog>
        <div className="hidden" />
      </PayoutDialog>
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

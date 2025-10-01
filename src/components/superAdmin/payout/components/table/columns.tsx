"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { ColumnHeader } from "@/components/ui/table/header";
import { OtpPayout } from "@/services/api/getPendingPaystackPayout";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import FinalizePayment from "../dialog";

const otpRequestedStatus: Record<string, boolean> = {};
const confirmedPayments: Record<string, boolean> = {};

export function makePendingPayoutColumns(
  requestOtp: (payload: { transfer_code: string }) => Promise<any>
) {
  const columns = createColumnHelper<OtpPayout>();

  const transactionIdColumn = columns.accessor("transaction_id", {
    header: ({ column }) => (
      <div className="flex items-center gap-3 min-w-[103px]">
        <ColumnHeader column={column}>Transaction ID</ColumnHeader>
      </div>
    ),
    cell: ({ getValue }) => <div className="text-sm">{getValue()}</div>,
  });

  const amountColumn = columns.accessor("amount", {
    header: ({ column }) => (
      <div className="flex min-w-[100px]">
        <ColumnHeader column={column}>Amount</ColumnHeader>
      </div>
    ),
    cell: ({ getValue }) => (
      <div className="text-sm">₦{getValue().toLocaleString()}</div>
    ),
  });

  const gatewayColumn = columns.accessor("gateway", {
    header: ({ column }) => (
      <div className="flex min-w-[100px]">
        <ColumnHeader column={column}>Gateway</ColumnHeader>
      </div>
    ),
    cell: ({ getValue }) => (
      <div className="text-sm capitalize">{getValue()}</div>
    ),
  });

  const transferCodeColumn = columns.accessor("transfer_code", {
    header: ({ column }) => (
      <div className="flex min-w-[150px]">
        <ColumnHeader column={column}>Transfer Code</ColumnHeader>
      </div>
    ),
    cell: ({ getValue }) => <div className="text-sm">{getValue()}</div>,
  });

  const dateColumn = columns.accessor("createdAt", {
    header: ({ column }) => (
      <div className="min-w-[120px]">
        <ColumnHeader column={column}>Date</ColumnHeader>
      </div>
    ),
    cell: ({ row }) => {
      const formatted = format(new Date(row.original.createdAt), "MM/dd/yy");
      return <div className="text-sm">{formatted}</div>;
    },
  });

  const statusColumn = columns.accessor("status", {
    header: ({ column }) => (
      <div className="flex min-w-[100px]">
        <ColumnHeader column={column}>Status</ColumnHeader>
      </div>
    ),
    cell: ({ getValue, row }) => {
      const status = getValue();
      // If payment is confirmed, show "completed" status
      const isConfirmed = confirmedPayments[row.original.transfer_code];
      const displayStatus = isConfirmed ? "paid" : status;

      return (
        <div
          className={cn(
            "min-w-[100px] py-1 flex items-center justify-center rounded-full capitalize text-sm",
            {
              "bg-[#FCCC951A] text-[#AE5F04]": status === "pending",
              "bg-[#D3FAEC]/60 text-[#069662]": status === "paid",
              "bg-[#DB44371A] text-[#DB4437]": status === "failed",
              "bg-gray-200 text-black": status === "otp",
              "bg-black/50 text-white": status === "abandoned",
            }
          )}
        >
          {displayStatus}
        </div>
      );
    },
  });

  const actionsColumns = columns.display({
    id: "actions",
    header: () => <div className="min-w-[107px]"></div>,
    cell: ({ row }) => {
      return <RowActions row={row.original} requestOtp={requestOtp} />;
    },
  });

  return [
    transactionIdColumn,
    amountColumn,
    transferCodeColumn,
    gatewayColumn,
    dateColumn,
    statusColumn,
    actionsColumns,
  ];
}

// Component for row-specific actions and state
function RowActions({
  row,
  requestOtp,
}: {
  row: OtpPayout;
  requestOtp: (payload: { transfer_code: string }) => Promise<any>;
}) {
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const [hasRequestedOtp, setHasRequestedOtp] = useState(
    !!otpRequestedStatus[row.transfer_code]
  );
  const [isConfirmed, setIsConfirmed] = useState(
    !!confirmedPayments[row.transfer_code]
  );

  const isPaid = row.status === "paid";
  const isAbandoned = row.status === "abandoned";

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (hasRequestedOtp) {
      timeout = setTimeout(() => {
        setHasRequestedOtp(false);
        otpRequestedStatus[row.transfer_code] = false;
      }, 1 * 60 * 1000);
    }
    return () => clearTimeout(timeout);
  }, [hasRequestedOtp, row.transfer_code]);

  const handleRequestOtp = async () => {
    if (isRequestingOtp || isConfirmed || isPaid) return;
    setIsRequestingOtp(true);
    try {
      await requestOtp({ transfer_code: row.transfer_code });
      setHasRequestedOtp(true);
      otpRequestedStatus[row.transfer_code] = true;
    } catch (error) {
      console.error("Failed to request OTP:", error);
    } finally {
      setIsRequestingOtp(false);
    }
  };

  const handlePaymentConfirmed = () => {
    setIsConfirmed(true);
    confirmedPayments[row.transfer_code] = true;
  };

  const disableActions = isPaid || isConfirmed || isAbandoned;

  return (
    <div className="flex gap-2 -z-0">
      <Button
        variant="outline"
        onClick={handleRequestOtp}
        disabled={disableActions || isRequestingOtp || hasRequestedOtp}
        className="min-w-[140px] opacity-100"
      >
        {isPaid
          ? "OTP Requested"
          : isRequestingOtp
          ? "Requesting..."
          : hasRequestedOtp
          ? "OTP Sent"
          : "Request OTP"}
      </Button>
      <FinalizePayment
        transferCode={row.transfer_code}
        amount={row.amount}
        onSuccess={handlePaymentConfirmed}
      >
        <Button
          variant="gradient"
          className="rounded-md min-w-[120px]"
          disabled={disableActions}
        >
          {isPaid ? "Completed" : "Finalize"}
        </Button>
      </FinalizePayment>
    </div>
  );
}

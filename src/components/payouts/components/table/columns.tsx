"use client";
import { createColumnHelper } from "@tanstack/react-table";
import { ColumnHeader } from "@/components/ui/table/header";

import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { TransactionHistory } from "@/components/shop/types";

export type PayoutTransaction = Omit<TransactionHistory, "timestamp" | "type" | 'status'> & {
  details: string;
  activity: "Ads" | "Survey";
  status: "Pending" | "Paid";
};

export function makeTransactionHistoryColumns() {
  const columns = createColumnHelper<PayoutTransaction>();

  /* -------------------------------------------------------------------------------------------------
   * Transaction Id column
   * -----------------------------------------------------------------------------------------------*/
  const transactionIdColumn = columns.accessor("transactionId", {
    header: ({ column }) => (
      <div className="flex items-center gap-3 min-w-[103px]">
        <ColumnHeader column={column}>Transaction Id</ColumnHeader>
      </div>
    ),
    cell: ({ getValue }) => {
      return (
        <div className="flex items-center gap-3 w-full">
          <div className="flex items-center">
            <div className="flex flex-col gap-1.5">
              <div className="text-sm">
                <span className="text-sm">{getValue()}</span>
              </div>
            </div>
          </div>
        </div>
      );
    },
  });

  /* -------------------------------------------------------------------------------------------------
   * Date column
   * -----------------------------------------------------------------------------------------------*/
  const DATE_HEADER_NAME = "Date";
  const dateColumn = columns.accessor("date", {
    header: ({ column }) => (
      <div className="min-w-[120px]">
        <ColumnHeader column={column}>Date</ColumnHeader>
      </div>
    ),
    cell: ({ getValue }) => {
      const date = getValue() as Date;
      const formattedDate = format(date, "M/d/yy");

      return (
        <div className="flex gap-2 items-center">
          <p className="text-sm">{formattedDate}</p>
        </div>
      );
    },
    meta: { headerName: DATE_HEADER_NAME },
  });

  /* -------------------------------------------------------------------------------------------------
   * Status column
   * -----------------------------------------------------------------------------------------------*/
  const STATUS_HEADER_NAME = "Status";
  const statusColumn = columns.accessor("status", {
    header: ({ column }) => (
      <div className="flex min-w-[120px]">
        <ColumnHeader column={column}>Status</ColumnHeader>
      </div>
    ),
    cell: ({ getValue }) => {
      const status = getValue();
    
      return (
        <div
          className={cn(
            "min-w-[100px] py-1 flex items-center justify-center rounded-full text-sm",
            {
              "bg-[#FCCC951A] text-[#AE5F04]": status === "Pending",
              "bg-[#D3FAEC] text-[#04AE73]": status === "Paid",

            }
          )}
        >
          <p>{status}</p>
        </div>
      );
    },
    meta: { headerName: STATUS_HEADER_NAME },
  });

  /* -------------------------------------------------------------------------------------------------
   * Activity column
   * -----------------------------------------------------------------------------------------------*/
  const ACTIVITY_HEADER_NAME = "Activity";
  const activityColumn = columns.accessor("activity", {
    header: ({ column }) => (
      <div className="flex min-w-[120px]">
        <ColumnHeader column={column}>Activity Type</ColumnHeader>
      </div>
    ),
    cell: ({ getValue }) => {
      const activity = getValue(); // "Ads" | "Survey"
  
      return (
        <div
          className={cn(
            "min-w-[100px] py-1 px-3 flex items-center justify-center rounded-xl text-sm",
            {
              "bg-[#4EEDF81A] text-[#068098]": activity === "Survey",
              "bg-[#D195FC1A] text-[#A804AE]": activity === "Ads",
            }
          )}
        >
          {activity}
        </div>
      );
    },
    meta: { headerName: ACTIVITY_HEADER_NAME },
  });
  

  /* -------------------------------------------------------------------------------------------------
   * Details column
   * -----------------------------------------------------------------------------------------------*/
  const DETAILS_HEADER_NAME = "Details";
  const detailsColumn = columns.accessor("details", {
    header: ({ column }) => (
      <div className="flex min-w-[120px]">
        <ColumnHeader column={column}>Type</ColumnHeader>
      </div>
    ),
    cell: ({ getValue }) => {
      return (
        <div className="min-w-[100px] py-1 flex items-center justify-center">
          <p className={cn("text-sm")}>{getValue()}</p>
        </div>
      );
    },
    meta: { headerName: DETAILS_HEADER_NAME },
  });

  /* -------------------------------------------------------------------------------------------------
   * Amount column
   * -----------------------------------------------------------------------------------------------*/
  const AMOUNT_HEADER_NAME = "Amount";
  const amountColumn = columns.accessor("amount", {
    header: ({ column }) => (
      <div className="flex min-w-[120px]">
        <ColumnHeader column={column}>Amount</ColumnHeader>
      </div>
    ),
    cell: ({ getValue }) => {
      return (
        <div>
          <p className={cn("text-sm")}>${getValue()}</p>
        </div>
      );
    },
    meta: { headerName: AMOUNT_HEADER_NAME },
  });

  return [
    transactionIdColumn,
    dateColumn,
    statusColumn,
    activityColumn,
    detailsColumn,
    amountColumn,
  ];
}

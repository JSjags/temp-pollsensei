"use client";
import { createColumnHelper } from "@tanstack/react-table";
import { ColumnHeader } from "@/components/ui/table/header";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export type PayoutStatus =
  | "pending"
  | "paid"
  | "in_transit"
  | "failed"
  | "reversed"
  | "canceled"
  | "otp"
  | "abandoned";

export type PayoutTransaction = {
  _id: string;
  transaction_id: string;
  status: PayoutStatus;
  details: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
  __v?: number;
};
export function makePayoutHistoryColumns(isNigeria: boolean = true) {
  const columns = createColumnHelper<PayoutTransaction>();

  /* -------------------------------------------------------------------------------------------------
   * Transaction Id column
   * -----------------------------------------------------------------------------------------------*/
  const transactionIdColumn = columns.accessor("transaction_id", {
    header: ({ column }) => (
      <div className="flex items-center gap-3">
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
  const dateColumn = columns.accessor("createdAt", {
    header: ({ column }) => (
      <div className="">
        <ColumnHeader column={column}>Date</ColumnHeader>
      </div>
    ),
    cell: ({ row }) => {
      const rawDate = row.original.createdAt;
      const date = new Date(rawDate);
      const formattedDate = format(date, "MM/dd/yy");
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
      <div className="flex">
        <ColumnHeader column={column}>Status</ColumnHeader>
      </div>
    ),
    cell: ({ getValue }) => {
      const status = getValue();

      return (
        <div
          className={cn(
            "px-2 py-1 flex items-center justify-center rounded-full text-sm",
            {
              "bg-[#FCCC951A] text-[#AE5F04]": status === "pending",
              "bg-[#D3FAEC]/60 text-[#069662]": status === "paid",
              "bg-[#DB44371A] text-[#DB4437]": status === "failed",
              "bg-gray-200 text-black": status === "otp",
              "bg-black/50 text-white": status === "abandoned",
            }
          )}
        >
          <p className="capitalize">{status}</p>
        </div>
      );
    },
    meta: { headerName: STATUS_HEADER_NAME },
  });

  /* -------------------------------------------------------------------------------------------------
   * Details column
   * -----------------------------------------------------------------------------------------------*/
  const DETAILS_HEADER_NAME = "Details";
  const detailsColumn = columns.accessor("details", {
    header: ({ column }) => (
      <div className="flex">
        <ColumnHeader column={column}>Type</ColumnHeader>
      </div>
    ),
    cell: ({ getValue }) => {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <p className="text-sm text-muted-foreground max-w-[170px] truncate">
              {getValue()}
            </p>
          </TooltipTrigger>
          <TooltipContent>{getValue()}</TooltipContent>
        </Tooltip>
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
      <div className="flex">
        <ColumnHeader column={column}>Amount</ColumnHeader>
      </div>
    ),
    cell: ({ getValue }) => {
      return (
        <div>
          <p className={cn("text-sm")}>
            {" "}
            {isNigeria ? "₦" : "$"}
            {getValue().toLocaleString()}
          </p>
        </div>
      );
    },
    meta: { headerName: AMOUNT_HEADER_NAME },
  });

  return [
    transactionIdColumn,
    dateColumn,
    statusColumn,
    detailsColumn,
    amountColumn,
  ];
}

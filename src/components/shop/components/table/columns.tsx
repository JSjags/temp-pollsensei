"use client";
import { createColumnHelper } from "@tanstack/react-table";
import { ColumnHeader } from "@/components/ui/table/header";
import { HistoryStatus, HistoryType, TransactionHistory } from "../../types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function makeTransactionHistoryColumns() {
  const columns = createColumnHelper<TransactionHistory>();

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
      // const { transctionId, collectionImage } = row.original;
      return (
        <div className="flex items-center gap-3 w-full">
          {/* <div className="text-center min-w-[30px]">{row.index + 1}</div> */}
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
  // const FLOORPRICE_HEADER_NAME = "Floor Price";
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
    // meta: { headerName: FLOORPRICE_HEADER_NAME },
  });

  /* -------------------------------------------------------------------------------------------------
   * Type column
   * -----------------------------------------------------------------------------------------------*/
  const VOLUME_HEADER_NAME = "Volume";
  const typeColumn = columns.accessor("type", {
    header: ({ column }) => (
      <div className="flex min-w-[120px]">
        <ColumnHeader column={column}>Type</ColumnHeader>
      </div>
    ),
    cell: ({ getValue }) => {
      const type = getValue() as HistoryType;

      return (
        <div
          className={cn("bg-[#FFDFE080] text-[#BF0508] min-w-[100px] py-1 flex items-center justify-center rounded-full", {
            "bg-[#D3FAEC] text-[#069662]": type === "Credit",
          })}
        >
          <p className={cn("text-sm")}>{type}</p>
        </div>
      );
    },
    meta: { headerName: VOLUME_HEADER_NAME },
  });

  /* -------------------------------------------------------------------------------------------------
   * Status column
   * -----------------------------------------------------------------------------------------------*/
  // const HOLDERCOUNT_HEADER_NAME = "Holder Count";
  const statusColumn = columns.accessor("status", {
    header: ({ column }) => (
      <div className="flex min-w-[120px]">
        <ColumnHeader column={column}>Status</ColumnHeader>
      </div>
    ),
    cell: ({ getValue }) => {
      const status = getValue() as HistoryStatus;

      return (
        <div
          className={cn("bg-[#D195FC1A] text-[#6704AE] min-w-[100px] py-1 flex items-center justify-center rounded-full", {
            "bg-[#FFDFE080] text-[#BF0508]": status === "Failed",
            "bg-[#FCCC951A] text-[#AE5F04]": status === "Pending",
          })}
        >
          <p className={cn("text-sm")}>{status}</p>
        </div>
      );
    },
    // meta: { headerName: HOLDERCOUNT_HEADER_NAME },
  });

  /* -------------------------------------------------------------------------------------------------
   * Activity column
   * -----------------------------------------------------------------------------------------------*/
  const activityColumn = columns.accessor("activity", {
    header: ({ column }) => (
      <div className="flex min-w-[120px]">
        <ColumnHeader column={column}>Activity Type</ColumnHeader>
      </div>
    ),
    cell: ({ getValue }) => {
      return (
        <div>
          <p className={cn("text-sm")}>{getValue()}</p>
        </div>
      );
    },
    // meta: { headerName: HOLDERCOUNT_HEADER_NAME },
  });

  /* -------------------------------------------------------------------------------------------------
   * Amount column
   * -----------------------------------------------------------------------------------------------*/
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
    // meta: { headerName: HOLDERCOUNT_HEADER_NAME },
  });
  /* -------------------------------------------------------------------------------------------------
   * Timestamp column
   * -----------------------------------------------------------------------------------------------*/

  const timestampColumn = columns.accessor("timestamp", {
    header: ({ column }) => (
      <div className="min-w-[120px]">
        <ColumnHeader column={column}>Time</ColumnHeader>
      </div>
    ),
    cell: ({ getValue }) => (
      <div className="text-sm text-muted-foreground">{getValue()}</div>
    ),
  });

  return [
    transactionIdColumn,
    dateColumn,
    timestampColumn,
    typeColumn,
    statusColumn,
    activityColumn,
    amountColumn,
  ];
}

"use client";
import { createColumnHelper } from "@tanstack/react-table";
import { ColumnHeader } from "@/components/ui/table/header";
import { HistoryStatus, HistoryType, TransactionHistory } from "../../types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useGeoLocation } from "@/subpages/settings/subscription/PricingCards";

export function makeTransactionHistoryColumns() {
  const columns = createColumnHelper<TransactionHistory>();
  const { data: locationData } = useGeoLocation();
  const isNigeria = locationData?.isNigeria;

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
  // const dateColumn = columns.accessor("date", {
  //   header: ({ column }) => (
  //     <div className="min-w-[120px]">
  //       <ColumnHeader column={column}>Date</ColumnHeader>
  //     </div>
  //   ),
  //   cell: ({ getValue }) => {
  //     const date = getValue() as Date;
  //     const formattedDate = format(date, "M/d/yy");

  //     return (
  //       <div className="flex gap-2 items-center">
  //         <p className="text-sm">{formattedDate}</p>
  //       </div>
  //     );
  //   },
  //   meta: { headerName: DATE_HEADER_NAME },
  // });
  const dateColumn = columns.accessor("date", {
    header: ({ column }) => (
      <div className="min-w-[120px]">
        <ColumnHeader column={column}>{DATE_HEADER_NAME}</ColumnHeader>
      </div>
    ),
    cell: ({ row }) => {
      const rawDate = row.original.date ?? row.original.timestamp;
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
   * Type column
   * -----------------------------------------------------------------------------------------------*/
  const TYPE_HEADER_NAME = "Type";
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
          className={cn(
            "bg-[#FFDFE080] text-[#BF0508] min-w-[100px] py-1 flex items-center justify-center rounded-full",
            {
              "bg-[#D3FAEC]/60 text-[#069662]": type === "credit",
            }
          )}
        >
          <p className={cn("text-sm capitalize")}>{type}</p>
        </div>
      );
    },
    meta: { headerName: TYPE_HEADER_NAME },
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
      const status = getValue() as HistoryStatus;

      return (
        <div
          className={cn(
            "bg-[#D195FC1A] text-[#6704AE] min-w-[100px] py-1 flex items-center justify-center rounded-full",
            {
              "bg-[#FFDFE080] text-[#BF0508]": status === "Failed",
              "bg-[#FCCC951A] text-[#AE5F04]": status === "Pending",
            }
          )}
        >
          <p className={cn("text-sm capitalize")}>{status}</p>
        </div>
      );
    },
    meta: { headerName: STATUS_HEADER_NAME },
  });

  /* -------------------------------------------------------------------------------------------------
   * Description column
   * -----------------------------------------------------------------------------------------------*/
  const DESCRIPTION_HEADER_NAME = "Description";
  const descriptionColumn = columns.accessor(
    (row) => row.details?.description ?? "—",
    {
      id: "description",
      header: ({ column }) => (
        <div className="flex min-w-[200px]">
          <ColumnHeader column={column}>Description</ColumnHeader>
        </div>
      ),
      cell: ({ getValue }) => (
        <p className="text-sm text-muted-foreground">{getValue()}</p>
      ),
      meta: { headerName: DESCRIPTION_HEADER_NAME },
    }
  );

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
    cell: ({ getValue, row }) => {
      const amount = getValue().toLocaleString();
      const description = row.original.details?.description?.toLowerCase() || "";

  
      let displayValue = `$${amount}`; // default
      if (description.includes("purchase") && description.includes("credits")) {
        displayValue = `${amount}pc`;
      }
  
      return (
        <div>
          <p className="text-sm">{displayValue}</p>
        </div>
      );
    },
    meta: { headerName: AMOUNT_HEADER_NAME },
  });
  
  /* -------------------------------------------------------------------------------------------------
   * Timestamp column
   * -----------------------------------------------------------------------------------------------*/
  const TIMESTAMP_HEADER_NAME = "Timestamp";
  const timestampColumn = columns.accessor("timestamp", {
    header: ({ column }) => (
      <div className="min-w-[120px]">
        <ColumnHeader column={column}>{TIMESTAMP_HEADER_NAME}</ColumnHeader>
      </div>
    ),
    cell: ({ getValue }) => {
      const timestamp = getValue() as number;
      const formatted = format(new Date(timestamp), "HH:mm:ss");
      return <div className="text-sm text-muted-foreground">{formatted}</div>;
    },
    meta: { headerName: TIMESTAMP_HEADER_NAME },
  });

  return [
    transactionIdColumn,
    dateColumn,
    timestampColumn,
    typeColumn,
    statusColumn,
    descriptionColumn,
    amountColumn,
  ];
}

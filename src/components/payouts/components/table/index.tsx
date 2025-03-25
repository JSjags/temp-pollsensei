import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getFilteredRowModel,
  getExpandedRowModel,
} from "@tanstack/react-table";
import { makeTransactionHistoryColumns, PayoutTransaction } from "./columns";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { FilterConfig, TableLayout } from "@/components/ui/table/table-layout";
import { Table } from "@/components/ui/table/index";
import type { Table as TanStackTable } from "@tanstack/react-table";

import Image from "next/image";

type TxnHistoryTableProps = {
  isHistoryLoading: boolean;
  payoutData: PayoutTransaction[];
};

export function PayoutsHistoryTable({
  isHistoryLoading,
  payoutData,
}: TxnHistoryTableProps) {
  const table = useReactTable<PayoutTransaction>({
    columns: makeTransactionHistoryColumns(),
    data: payoutData ?? [],
    getExpandedRowModel: getExpandedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  // Filter options
  const payoutFilters: FilterConfig<
    "status",
    "All" | "Completed" | "Active"
  >[] = [
    { label: "All", value: "All", column: null, isDefault: true },
    { label: "Completed", value: "Completed", column: "status" },
    { label: "Active", value: "Active", column: "status" },
  ];

  // Custom filtering logic for status
  const handlePayoutFilterChange = (
    selectedFilter: FilterConfig<string, string | null>,
    table: TanStackTable<PayoutTransaction>
  ) => {
    const statusColumn = table.getColumn("status");

    if (!statusColumn) return;

    switch (selectedFilter.value) {
      case "Completed":
        statusColumn.setFilterValue("Paid");
        break;
      case "Active":
        statusColumn.setFilterValue("Pending");
        break;
      default:
        statusColumn.setFilterValue(undefined);
    }
  };

  return (
    <HydrationBoundary state={dehydrate}>
      <TableLayout<PayoutTransaction>
        title="Transaction History"
        table={table}
        filters={payoutFilters}
        onFilterChange={handlePayoutFilterChange}
      >
        <Table isLoading={isHistoryLoading} hasHover table={table}>
          <div className="flex flex-col gap-4 items-center">
            <Image
              src={"/assets/payout/EmptyCart.svg"}
              alt="empty state"
              width={485}
              height={420}
            />
            <div className="max-md:text-center">
              <p className="mb-6 text-lg">You have not made any payouts</p>
            </div>
          </div>
        </Table>
      </TableLayout>
    </HydrationBoundary>
  );
}

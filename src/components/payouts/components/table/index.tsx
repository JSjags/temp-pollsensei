import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getFilteredRowModel,
  getExpandedRowModel,
} from "@tanstack/react-table";
import {
  makePayoutHistoryColumns,
  PayoutStatus,
  PayoutTransaction,
} from "./columns";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { FilterConfig, TableLayout } from "@/components/ui/table/table-layout";
import { Table } from "@/components/ui/table/index";
import type { Table as TanStackTable } from "@tanstack/react-table";

import Image from "next/image";
import { useGeoLocation } from "@/subpages/settings/subscription/PricingCards";

type TxnHistoryTableProps = {
  isHistoryLoading: boolean;
  payoutData: PayoutTransaction[];
  pagination?: {
    page: number;
    totalPages: number;
    setPage: (page: number) => void;
  };
};

export function PayoutsHistoryTable({
  isHistoryLoading,
  payoutData,
  pagination,
}: TxnHistoryTableProps) {
  const { data: locationData } = useGeoLocation();
  const isNigeria = locationData?.isNigeria;
  const table = useReactTable<PayoutTransaction>({
    columns: makePayoutHistoryColumns(isNigeria),
    data: payoutData ?? [],
    getExpandedRowModel: getExpandedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  // Filter options
  const payoutFilters: FilterConfig<"status", "All" | PayoutStatus>[] = [
    { label: "All", value: "All", column: null, isDefault: true },
    { label: "Paid", value: "paid", column: "status" },
    { label: "Pending", value: "pending", column: "status" },
    { label: "Abandoned", value: "abandoned", column: "status" },
    { label: "Failed", value: "failed", column: "status" },
    // { label: "Reversed", value: "reversed", column: "status" },
    // { label: "Canceled", value: "canceled", column: "status" },
  ];

  // Custom filtering logic for status
  const handlePayoutFilterChange = (
    selectedFilter: FilterConfig<string, string | null>,
    table: TanStackTable<PayoutTransaction>
  ) => {
    const statusColumn = table.getColumn("status");

    if (!statusColumn) return;

    if (selectedFilter.value === "All") {
      statusColumn.setFilterValue(undefined);
    } else {
      statusColumn.setFilterValue(selectedFilter.value);
    }
  };

  return (
    <HydrationBoundary state={dehydrate}>
      <TableLayout<PayoutTransaction>
        title="Payout History"
        table={table}
        filters={payoutFilters}
        onFilterChange={handlePayoutFilterChange}
        pagination={pagination}
      >
        <Table isLoading={isHistoryLoading} hasHover table={table}>
          {table.getRowModel().rows.length === 0 ? (
          <div className="flex flex-col gap-4 items-center">
            <Image
              src={"/assets/payout/EmptyCart.svg"}
              alt="empty state"
              width={485}
              height={420}
            />
            <div className="max-md:text-center">
              <p className="mb-6 text-lg">
                {payoutData.length === 0
                  ? "You have not made any payout."
                  : "No data found."}
              </p>
            </div>
          </div>
        ) : null}
        </Table>
      </TableLayout>
    </HydrationBoundary>
  );
}

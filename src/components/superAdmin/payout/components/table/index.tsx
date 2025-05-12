// "use client";

// import {
//   getCoreRowModel,
//   getSortedRowModel,
//   useReactTable,
//   getFilteredRowModel,
//   getExpandedRowModel,
// } from "@tanstack/react-table";

// import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
// import { FilterConfig, TableLayout } from "@/components/ui/table/table-layout";
// import { Table } from "@/components/ui/table/index";
// import type { Table as TanStackTable } from "@tanstack/react-table";

// import Image from "next/image";
// import { OtpPayout, otpPayoutStatus } from "@/services/api/getPendingPaystackPayout";
// import { makePendingPayoutColumns } from "./columns";
// import { useRequestPayoutOtp } from "../../queries/useRequestOtp";
// import { useState, useEffect } from "react";

// type TxnHistoryTableProps = {
//   isHistoryLoading: boolean;
//   payoutData: OtpPayout[];
//   pagination?: {
//     page: number;
//     totalPages: number;
//     setPage: (page: number) => void;
//   };
// };

// export function PendingPayoutsTable({
//   isHistoryLoading,
//   payoutData,
//   pagination,
// }: TxnHistoryTableProps) {
//   const { mutateAsync } = useRequestPayoutOtp();
//   const [selectedFilterLabel, setSelectedFilterLabel] = useState<string>("All");
//   const [tableData, setTableData] = useState<OtpPayout[]>(payoutData || []);

//   // Update table data when payoutData changes
//   useEffect(() => {
//     setTableData(payoutData || []);
//   }, [payoutData]);
  
//   const table = useReactTable<OtpPayout>({
//     columns: makePendingPayoutColumns(mutateAsync),
//     data: tableData,
//     getExpandedRowModel: getExpandedRowModel(),
//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//   });

//   const payoutFilters: FilterConfig<"status", "All" | otpPayoutStatus>[] = [
//     { label: "All", value: "All", column: null, isDefault: true },
//     { label: "OTP", value: "otp", column: "status" },
//     { label: "Completed", value: "paid", column: "status" },
//     { label: "Abandoned", value: "abandoned", column: "status" },
//     { label: "Failed", value: "failed", column: "status" },
//   ];

//   const handlePayoutFilterChange = (
//     selectedFilter: FilterConfig<string, string | null>,
//     table: TanStackTable<OtpPayout>
//   ) => {
//     const statusColumn = table.getColumn("status");

//     if (!statusColumn) return;

//     setSelectedFilterLabel(selectedFilter.label);

//     if (selectedFilter.value === "All") {
//       statusColumn.setFilterValue(undefined);
//     } else {
//       statusColumn.setFilterValue(selectedFilter.value);
//     }
//   };

//   return (
//     <HydrationBoundary state={dehydrate}>
//       <TableLayout<OtpPayout>
//         title="Pending Payouts"
//         table={table}
//         filters={payoutFilters}
//         onFilterChange={handlePayoutFilterChange}
//         pagination={pagination}
//       >
//         <Table superAdmin isLoading={isHistoryLoading} hasHover table={table}>
//           {table.getRowModel().rows.length === 0 ? (
//           <div className="flex flex-col gap-4 items-center">
//             <Image
//               src={"/assets/payout/EmptyCart.svg"}
//               alt="empty state"
//               width={485}
//               height={420}
//             />
//             <div className="max-md:text-center">
//               <p className="mb-6 text-lg">
//                 {payoutData.length === 0
//                   ? "You have no pending payouts"
//                   : selectedFilterLabel === "All" 
//                     ? "You do not have any payouts" 
//                     : `You do not have ${selectedFilterLabel} payouts`}
//               </p>
//             </div>
//           </div>
//         ) : null}
//         </Table>
//       </TableLayout>
//     </HydrationBoundary>
//   );
// }

// You do not have any Pending OTP Payout Transaction

// You do not have any Failed Payout Transaction
"use client";

import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getFilteredRowModel,
  getExpandedRowModel,
} from "@tanstack/react-table";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { FilterConfig, TableLayout } from "@/components/ui/table/table-layout";
import { Table } from "@/components/ui/table/index";
import type { Table as TanStackTable } from "@tanstack/react-table";

import Image from "next/image";
import { OtpPayout, otpPayoutStatus } from "@/services/api/getPendingPaystackPayout";
import { makePendingPayoutColumns } from "./columns";
import { useRequestPayoutOtp } from "../../queries/useRequestOtp";
import { useState, useEffect } from "react";

type TxnHistoryTableProps = {
  isHistoryLoading: boolean;
  payoutData: OtpPayout[];
  pagination?: {
    page: number;
    totalPages: number;
    setPage: (page: number) => void;
  };
};

export function PendingPayoutsTable({
  isHistoryLoading,
  payoutData,
  pagination,
}: TxnHistoryTableProps) {
  const { mutateAsync } = useRequestPayoutOtp();
  const [selectedFilterLabel, setSelectedFilterLabel] = useState<string>("All");
  const [tableData, setTableData] = useState<OtpPayout[]>(payoutData || []);

  // Update table data when payoutData changes
  useEffect(() => {
    setTableData(payoutData || []);
  }, [payoutData]);
  
  const table = useReactTable<OtpPayout>({
    columns: makePendingPayoutColumns(mutateAsync),
    data: tableData,
    getExpandedRowModel: getExpandedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const payoutFilters: FilterConfig<"status", "All" | otpPayoutStatus>[] = [
    { label: "All", value: "All", column: null, isDefault: true },
    { label: "OTP", value: "otp", column: "status" },
    { label: "Completed", value: "paid", column: "status" },
    { label: "Abandoned", value: "abandoned", column: "status" },
    { label: "Failed", value: "failed", column: "status" },
  ];

  const handlePayoutFilterChange = (
    selectedFilter: FilterConfig<string, string | null>,
    table: TanStackTable<OtpPayout>
  ) => {
    const statusColumn = table.getColumn("status");

    if (!statusColumn) return;

    setSelectedFilterLabel(selectedFilter.label);

    if (selectedFilter.value === "All") {
      statusColumn.setFilterValue(undefined);
    } else {
      statusColumn.setFilterValue(selectedFilter.value);
    }
  };

  // Generate appropriate empty state message based on filter
  const getEmptyStateMessage = () => {
    if (payoutData.length === 0) {
      return "You have no pending payouts";
    }
    
    if (selectedFilterLabel === "All") {
      return "You do not have any payouts";
    }
    
    return `You do not have any ${selectedFilterLabel} Payout Transaction`;
  };

  return (
    <HydrationBoundary state={dehydrate}>
      <TableLayout<OtpPayout>
        title="Pending Payouts"
        table={table}
        filters={payoutFilters}
        onFilterChange={handlePayoutFilterChange}
        pagination={pagination}
      >
        <Table superAdmin isLoading={isHistoryLoading} hasHover table={table}>
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
                {getEmptyStateMessage()}
              </p>
            </div>
          </div>
        ) : null}
        </Table>
      </TableLayout>
    </HydrationBoundary>
  );
}
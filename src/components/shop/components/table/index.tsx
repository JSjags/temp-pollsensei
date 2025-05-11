import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getFilteredRowModel,
  getExpandedRowModel,
} from "@tanstack/react-table";
import { makeTransactionHistoryColumns } from "./columns";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { TransactionHistory } from "../../types";
import { TableLayout } from "@/components/ui/table/table-layout";
import { Table } from "@/components/ui/table/index";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Arrow } from "@/assets/images";
import BuyPollcoinsFlow from "../dialogs/BuyPollcoins";
import { useGeoLocation } from "@/subpages/settings/subscription/PricingCards";

type TxnHistoryTableProps = {
  isHistoryLoading: boolean;
  historyData: TransactionHistory[];
  pagination?: {
    page: number;
    totalPages: number;
    setPage: (page: number) => void;
  };
};

export function TransactionHistoryTable({
  isHistoryLoading,
  historyData,
  pagination,
}: TxnHistoryTableProps) {
  const { data: locationData } = useGeoLocation();
  const isNigeria = locationData?.isNigeria;
  const table = useReactTable<TransactionHistory>({
    columns: makeTransactionHistoryColumns(isNigeria),
    data: historyData ?? [],
    getExpandedRowModel: getExpandedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <HydrationBoundary state={dehydrate}>
      <TableLayout
        table={table}
        title="Transaction History"
        // renderSeeAll
        pagination={pagination}
      >
        <Table isLoading={isHistoryLoading} hasHover table={table}>
          {table.getRowModel().rows.length === 0 ? (
            <div className="flex flex-col items-center gap-4">
              <Image
                src={"/assets/shop/table_empty.png"}
                alt="empty state"
                width={285}
                height={220}
                className="max-w-[285px] w-full"
              />

              <div className="md:max-w-[500px] max-md:text-center">
                {historyData.length === 0 ? (
                  <div className="flex items-center justify-center flex-col">
                    <p className="mb-6 text-lg text-center">
                      Oops! No recorded transactions yet. Buy Pollcoins to use
                      the AI features of PollSensei
                    </p>
                    <BuyPollcoinsFlow>
                      <Button
                        variant={"gradient"}
                        className="font-bold gap-1 text-sm"
                      >
                        Buy Pollcoins{" "}
                        <Image src={Arrow} alt="icons" className="size-3.5" />
                      </Button>
                    </BuyPollcoinsFlow>
                  </div>
                ) : (
                  <p className="text-lg">
                    No data found.
                  </p>
                )}
              </div>
            </div>
          ) : null}
        </Table>
      </TableLayout>
    </HydrationBoundary>
  );
}

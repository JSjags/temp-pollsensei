import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getFilteredRowModel,
  getExpandedRowModel,
} from "@tanstack/react-table";
import { makeTransactionHistoryColumns } from "./columns";

import { useRouter } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { TransactionHistory } from "../../types";
import { TableLayout } from "@/components/ui/table/table-layout";
import { Table } from "@/components/ui/table/index";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Arrow } from "@/assets/images";
import BuyPollcoinsFlow from "../dialogs/BuyPollcoins";

type TxnHistoryTableProps = {
  isHistoryLoading: boolean;
  historyData: TransactionHistory[];
};

export function TransactionHistoryTable({
  isHistoryLoading,
  historyData,
}: TxnHistoryTableProps) {
  const router = useRouter();

  const table = useReactTable<TransactionHistory>({
    columns: makeTransactionHistoryColumns(),
    data: historyData ?? [],
    getExpandedRowModel: getExpandedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <HydrationBoundary state={dehydrate}>
      <TableLayout table={table}>
        <Table isLoading={isHistoryLoading} hasHover table={table}>
          <>
            <p className="mb-6 text-lg">
              Oops! No recorded transactions yet. Buy Pollcoins to use the AI
              features of PollSensei
            </p>

            <BuyPollcoinsFlow>
              <Button variant={"gradient"} className="font-bold gap-1 text-sm">
                Buy Pollcoins{" "}
                <Image src={Arrow} alt="icons" className="size-3.5" />
              </Button>
            </BuyPollcoinsFlow>
          </>
        </Table>
      </TableLayout>
    </HydrationBoundary>
  );
}

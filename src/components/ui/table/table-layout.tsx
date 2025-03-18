import React, { useEffect, useState } from "react";
import { Table } from "@tanstack/react-table";
import { Checkbox } from "@/components/shop/components/Checkbox";
import Link from "next/link";
import { Columns } from "./columns";
import { cn } from "@/lib/utils";

type TableLayoutProps<T> = {
  title?: string;
  children: React.ReactNode;
  table: Table<T>;
};
export function TableLayout<T>({
  title,
  children,
  table,
}: TableLayoutProps<T>) {
  const [selectedOption, setSelectedOption] = useState("All");
  const disabled = table.getRowModel().rows.length === 0;

  useEffect(() => {
    if (selectedOption === "All") {
      table.getColumn("type")?.setFilterValue(undefined);
      table.getColumn("status")?.setFilterValue(undefined);
    } else if (selectedOption === "Credit" || selectedOption === "Debit") {
      table.getColumn("type")?.setFilterValue(selectedOption);
      table.getColumn("status")?.setFilterValue(undefined);
    } else {
      table.getColumn("status")?.setFilterValue(selectedOption);
      table.getColumn("type")?.setFilterValue(undefined);
    }
  }, [selectedOption, table]);
  return (
    <div className="flex flex-col w-full mt-10 max-md:px-5">
      <div className="flex items-center justify-between mt-[29px] mb-[51px] max-md:flex-col max-md:gap-4">
        <div className="flex items-center max-md:justify-between max-md:w-full">
          <p className="text-xl font-bold">Transaction History</p>
          {table.getRowModel().rows.length > 0 && (
            <div className="md:hidden">
              <Columns table={table} />
            </div>
          )}
        </div>

        <div className="md:flex items-center justify-between md:w-[55%] w-full">
          <div className="flex items-center md:gap-[22.5px] gap-3">
            {["All", "Credit", "Debit", "Completed", "Pending"].map(
              (option) => (
                <div
                  onClick={() => setSelectedOption(option)}
                  key={option}
                  className="flex items-center gap-2"
                >
                  <Checkbox
                    disabled={disabled}
                    checked={selectedOption === option}
                    onCheckedChange={() => setSelectedOption(option)}
                  />
                  <label
                    className={cn("max-md:text-xs", { "opacity-30": disabled })}
                  >
                    {option}
                  </label>
                </div>
              )
            )}
          </div>
          <Link href="#" className="font-bold text-[#5B03B2] max-md:hidden">
            <span className="underline">See All</span>
          </Link>
        </div>
      </div>
      <div className="w-full table-auto">{children}</div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { Table } from "@tanstack/react-table";
import { Checkbox } from "@/components/shop/components/Checkbox";
import Link from "next/link";

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
    <div className="flex flex-col w-full">
      <div className="mt-[29px] mb-[51px]">
        <div className="flex items-center justify-between">
          <p className="text-xl font-bold">Transaction History</p>

          <div className="flex items-center justify-between w-[55%]">
            <div className="flex items-center gap-[22.5px]">
              {["All", "Credit", "Debit", "Completed", "Pending"].map(
                (option) => (
                  <div
                    onClick={() => setSelectedOption(option)}
                    key={option}
                    className="flex items-center gap-2"
                  >
                    <Checkbox
                      checked={selectedOption === option}
                      onCheckedChange={() => setSelectedOption(option)}
                    />
                    <label>{option}</label>
                  </div>
                )
              )}
            </div>
            <Link href="#" className="font-bold text-[#5B03B2]">
              <span className="underline">See All</span>
            </Link>
          </div>
        </div>
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
}

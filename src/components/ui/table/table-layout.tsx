import React, { useEffect, useState, useMemo, useRef } from "react";
import { Table } from "@tanstack/react-table";
import { Checkbox } from "@/components/shop/components/Checkbox";
import Link from "next/link";
import { Columns } from "./columns";
import { cn } from "@/lib/utils";
import { HistoryStatus, HistoryType } from "@/components/shop/types";

export type FilterConfig<ColumnType extends string, ValueType extends string | null> = {
  label: string;
  value: ValueType;
  column: ColumnType | null;
  isDefault?: boolean;
}

type TransactionFilterValue = HistoryType | HistoryStatus | "All";

type TableLayoutProps<T> = {
  title?: string;
  children: React.ReactNode;
  table: Table<T>;
  renderSeeAll?: boolean;
  filters?: FilterConfig<string, string | null>[];
  onFilterChange?: (selectedFilter: FilterConfig<string, string | null>, table: Table<T>) => void;
  seeAllLink?: string;
};

// Default transaction filters with proper typing
const defaultTransactionFilters: FilterConfig<"type" | "status", TransactionFilterValue | null>[] = [
  { label: "All", value: "All", column: null, isDefault: true },
  { label: "Credit", value: "Credit", column: "type" },
  { label: "Debit", value: "Debit", column: "type" },
  { label: "Completed", value: "Completed", column: "status" },
  { label: "Pending", value: "Pending", column: "status" }
];

export function TableLayout<T>({
  title,
  children,
  table,
  filters = defaultTransactionFilters as FilterConfig<string, string | null>[],
  onFilterChange,
  renderSeeAll = false,
  seeAllLink = "#",
}: TableLayoutProps<T>) {
  // Find default filter or use first one
  const defaultFilter = filters.find(f => f.isDefault) || filters[0];
  const [selectedFilter, setSelectedFilter] = useState<FilterConfig<string, string | null>>(defaultFilter);
  const disabled = table.getRowModel().rows.length === 0;

  // Use useMemo to compute filter columns only when filters change
  const filterColumns = useMemo(() => {
    const columns = new Set<string>();
    filters.forEach(filter => {
      if (filter.column !== null) {
        columns.add(filter.column);
      }
    });
    return Array.from(columns);
  }, [filters]);

  // useEffect(() => {
  //   // If custom filter handler is provided, use it
  //   if (onFilterChange) {
  //     onFilterChange(selectedFilter, table);
  //     return;
  //   }

  //   // Clear all relevant filters first
  //   filterColumns.forEach(column => {
  //     const tableColumn = table.getColumn(column);
  //     if (tableColumn) {
  //       tableColumn.setFilterValue(undefined);
  //     }
  //   });

  //   // Apply the selected filter
  //   if (selectedFilter.column && selectedFilter.value !== "All") {
  //     const column = table.getColumn(selectedFilter.column);
  //     if (column) {
  //       column.setFilterValue(selectedFilter.value);
  //     } else {
  //       console.warn(`Column "${selectedFilter.column}" not found in table.`);
  //     }
  //   }
  // }, [selectedFilter, table, filterColumns, onFilterChange]);
  const lastFilterRef = useRef<string | null>(null);

  useEffect(() => {
    const currentValue = selectedFilter.value;
  
    if (onFilterChange) {
      if (lastFilterRef.current !== currentValue) {
        lastFilterRef.current = currentValue;
        onFilterChange(selectedFilter, table);
      }
      return;
    }
  
    // Clear filters
    filterColumns.forEach(column => {
      const tableColumn = table.getColumn(column);
      if (tableColumn) {
        tableColumn.setFilterValue(undefined);
      }
    });
  
    // Apply selected filter
    if (selectedFilter.column && selectedFilter.value !== "All") {
      const column = table.getColumn(selectedFilter.column);
      if (column) {
        column.setFilterValue(selectedFilter.value);
      }
    }
  }, [selectedFilter, table, filterColumns, onFilterChange]);
  
  const handleFilterChange = (filter: FilterConfig<string, string | null>) => {
    if (!disabled) {
      setSelectedFilter(filter);
    }
  };
  
  return (
    <div className="flex flex-col w-full mt-10 max-md:px-5">
      <div className="flex items-center justify-between mt-[29px] mb-[51px] max-md:flex-col max-md:gap-4">
        <div className="flex items-center max-md:justify-between max-md:w-full">
          <p className="text-xl font-bold">{title}</p>
          {table.getRowModel().rows.length > 0 && (
            <div className="md:hidden">
              <Columns table={table} />
            </div>
          )}
        </div>

        <div className="flex justify-end w-1/2">
          <div className="md:flex items-center justify-between w-auto gap-7">
            <div className="flex items-center md:gap-[22.5px] gap-3 flex-wrap">
              {filters.map((filter) => (
                <div
                  onClick={() => handleFilterChange(filter)}
                  key={filter.value}
                  className="flex items-center gap-2"
                >
                  <Checkbox
                    disabled={disabled}
                    checked={selectedFilter.value === filter.value}
                    onCheckedChange={() => handleFilterChange(filter)}
                  />
                  <label
                    className={cn("max-md:text-xs", {
                      "opacity-30": disabled,
                    })}
                  >
                    {filter.label}
                  </label>
                </div>
              ))}
            </div>
            {renderSeeAll && (
              <Link href={seeAllLink} className="font-bold text-[#5B03B2] max-md:hidden">
                <span className="underline">See All</span>
              </Link>
            )}
          </div>
        </div>
      </div>
      <div className="w-full table-auto">{children}</div>
    </div>
  );
}
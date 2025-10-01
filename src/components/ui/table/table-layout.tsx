import React, { useEffect, useState, useMemo, useRef } from "react";
import { Table } from "@tanstack/react-table";
import { Checkbox } from "@/components/shop/components/Checkbox";
import Link from "next/link";
import { Columns } from "./columns";
import { cn } from "@/lib/utils";
import { HistoryStatus, HistoryType } from "@/components/shop/types";
import { Button } from "../button";

export type FilterConfig<
  ColumnType extends string,
  ValueType extends string | null
> = {
  label: string;
  value: ValueType;
  column: ColumnType | null;
  isDefault?: boolean;
};

type TransactionFilterValue = HistoryType | HistoryStatus | "All";

type TableLayoutProps<T> = {
  title?: string;
  children: React.ReactNode;
  table: Table<T>;
  renderSeeAll?: boolean;
  filters?: FilterConfig<string, string | null>[];
  onFilterChange?: (
    selectedFilter: FilterConfig<string, string | null>,
    table: Table<T>
  ) => void;
  seeAllLink?: string;
  pagination?: {
    page: number;
    totalPages: number;
    setPage: (page: number) => void;
  };
};

const defaultTransactionFilters: FilterConfig<
  "type" | "status",
  TransactionFilterValue | null
>[] = [
  { label: "All", value: "All", column: null, isDefault: true },
  { label: "Credit", value: "credit", column: "type" },
  { label: "Debit", value: "debit", column: "type" },
  { label: "Completed", value: "Completed", column: "status" },
  { label: "Pending", value: "Pending", column: "status" },
];

export function TableLayout<T>({
  title,
  children,
  table,
  filters = defaultTransactionFilters as FilterConfig<string, string | null>[],
  onFilterChange,
  renderSeeAll = false,
  seeAllLink = "#",
  pagination,
}: TableLayoutProps<T>) {
  const defaultFilter = filters.find((f) => f.isDefault) || filters[0];
  const [selectedFilter, setSelectedFilter] =
    useState<FilterConfig<string, string | null>>(defaultFilter);

  const filterColumns = useMemo(() => {
    const columns = new Set<string>();
    filters.forEach((filter) => {
      if (filter.column !== null) {
        columns.add(filter.column);
      }
    });
    return Array.from(columns);
  }, [filters]);
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

    filterColumns.forEach((column) => {
      const tableColumn = table.getColumn(column);
      if (tableColumn) {
        tableColumn.setFilterValue(undefined);
      }
    });

    if (selectedFilter.column && selectedFilter.value !== "All") {
      const column = table.getColumn(selectedFilter.column);
      if (column) {
        column.setFilterValue(selectedFilter.value);
      }
    }
  }, [selectedFilter, table, filterColumns, onFilterChange]);

  const handleFilterChange = (filter: FilterConfig<string, string | null>) => {
    setSelectedFilter(filter);
  };

  return (
    <div className="flex flex-col w-full mt-10">
      <div className="flex justify-between mt-[29px] mb-[51px] flex-col gap-6">
        <div className="flex items-center justify-between w-full mb-8">
          <p className="text-xl font-bold">{title}</p>
          <div className="md:hidden block">
          <Columns table={table} />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="md:flex items-center justify-between w-auto gap-7">
            <div className="flex md:items-center md:gap-[22.5px] gap-3 flex-wrap">
              {filters.map((filter) => (
                <div
                  onClick={() => handleFilterChange(filter)}
                  key={filter.value}
                  className="flex items-center gap-2"
                >
                  <Checkbox
                    checked={selectedFilter.value === filter.value}
                    onCheckedChange={() => handleFilterChange(filter)}
                  />
                  <label className={cn("max-md:text-xs", {})}>
                    {filter.label}
                  </label>
                </div>
              ))}
            </div>
            {renderSeeAll && (
              <Link
                href={seeAllLink}
                className="font-bold text-[#5B03B2] max-md:hidden"
              >
                <span className="underline">See All</span>
              </Link>
            )}
          </div>
          <div className="hidden md:block">
          <Columns table={table} />
          </div>

        </div>
      </div>
      {children}
      {pagination && (
        <div className="flex justify-end items-center mt-6">
          <div className="space-x-2 flex items-center">
            <Button
              variant="outline"
              disabled={pagination.page === 1}
              onClick={() => pagination.setPage(pagination.page - 1)}
            >
              Previous
            </Button>
            <div className="bg-[#F0EFFD] size-10 flex items-center justify-center rounded-sm">
              <p className="text-sm text-muted-foreground">{pagination.page}</p>
            </div>

            <Button
              variant="outline"
              disabled={pagination.page === pagination.totalPages}
              onClick={() => pagination.setPage(pagination.page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

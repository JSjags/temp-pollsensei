"use client";
import { flexRender, Table as ReactTable } from "@tanstack/react-table";
import { TableEmptyState } from "./empty";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode, useRef } from "react";
import { ScrollArea } from "../scrollarea";
import { Skeleton } from "../skeleton";
import { useSidebar } from "../sidebar";
import { useMediaQuery } from "@uidotdev/usehooks";

type TableProps<T> = {
  table: ReactTable<T>;
  children?: ReactNode;
  hasHover?: boolean;
  rowDivider?: boolean;
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
  superAdmin?: boolean;
  onRowPointerEnter?: (event: PointerEvent) => void;
  onRowPointerLeave?: (event?: PointerEvent) => void;
};

export function Table<T>({
  table,
  superAdmin = false,
  onRowClick,
  isLoading,
  children,
}: TableProps<T>) {
  const { open } = useSidebar();
  const isBelow1280 = useMediaQuery("(max-width: 1280px)");
  const isBelow1320 = useMediaQuery("(max-width: 1320px)");
  const rows = table.getRowModel().rows;
  const totalColumns = table.getAllColumns().length;
  if (isLoading) return <SkeletonEl />;
  return (
    <div
      id="table-wrapper"
      className="relative"
    >
      <div suppressHydrationWarning>
        <ScrollArea.Root>
          <table
            className={cn("w-full border-none", {
              "!table-auto": (open && isBelow1280) || isBelow1320,
            })}
          >
            <>
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className={cn(
                          "h-9 px-3 text-sm text-new-muted-foreground bg-special-bg font-normal text-left align-middle font-sans whitespace-nowrap",
                          "first:sticky first:left-0 first:bg-[#F7F8FB] first:pl-6 first:z-10 first:rounded-l-md last:rounded-r-md",
                          "md:last:sticky md:last:right-0 md:last:bg-special-bg md:last:z-10"
                        )}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody className="p-4 mx-4 max-sm:mx-0 max-sm:p-0 w-full">
                <tr className="h-8 max-sm:px-0 px-6" />
                {rows.map((row, index) => (
                  <motion.tr
                    key={row.id}
                    onClick={() => onRowClick?.(row.original)}
                    initial={{ opacity: 0, y: -34 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 340,
                      damping: 48,
                      delay: index * 0.08,
                    }}
                    className={cn(
                      "bg-[#FEF5FED6] hover:bg-table-hover hover:z-20 cursor-pointer z-20",
                      {
                        "bg-[#F7EEFED9]": index % 2 === 0,
                      }
                    )}
                  >
                    {row.getVisibleCells().map((cell, index) => (
                      <motion.td
                        key={cell.id}
                        initial={{ opacity: 0, y: -24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 340,
                          damping: 48,
                          delay: index * 0.05,
                        }}
                        className={cn(
                          "group/row h-16 hover:bg-table-hover",
                          "first:sticky first:left-0 max-md:first:bg-[#FEF5FED6] first:pl-3 first:z-10 group-first/row:hover:bg-table-hover",
                          "last:sticky md:last:right-0 md:last:card md:last:pr-3 md:last:z-10 first:rounded-l-xl last:rounded-r-xl",
                          {
                            "!md:last:z-0": superAdmin,
                          }
                        )}
                      >
                        <div className="h-full flex items-center group-last/row:justify-start first:pl-3 last:pr-3 group-last/row:rounded-r-xl group-data-[highlighted]:ring-2 ring-new-terciary group-first/row:rounded-l-xl first:group-data-[highlighted]:bg-tertiary">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </div>
                      </motion.td>
                    ))}
                  </motion.tr>
                ))}

                {!isLoading && rows.length === 0 && (
                  <tr>
                    <td colSpan={totalColumns} className="p-16">
                      <TableEmptyState>{children}</TableEmptyState>
                    </td>
                  </tr>
                )}
              </tbody>
            </>
          </table>
        </ScrollArea.Root>
      </div>
    </div>
  );
}

function SkeletonEl() {
  return (
    <div>
      <div className="flex w-full justify-between gap-4 p-4 border-b border-b-border">
        <Skeleton className="h-7 w-full" />
      </div>

      <div className="flex flex-col gap-1 pt-2 p-4 w-full">
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton key={index} className="h-16 w-full" />
        ))}
      </div>
    </div>
  );
}

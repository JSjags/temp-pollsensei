import { ReactNode } from "react";
import { HeaderContext } from "@tanstack/react-table";
import { cn } from "@/lib/utils";

type HeaderProps<T> = {
  children: ReactNode;
  column: HeaderContext<T, unknown>["column"];
  noSort?: boolean;
};

export function ColumnHeader<T>({
  children,
  column,
  noSort = false,
}: HeaderProps<T>) {
  const sort = column.getIsSorted();

  return (
    <div
      className="flex gap-2 items-center cursor-pointer text-sm font-normal text-black/60"
      onClick={column.getToggleSortingHandler()}
    >
      {children}
      {!noSort && (
        <div className="flex flex-col justify-center items-center">
          <Caret
            className={cn(
              "rotate-90 text-black/60",
              sort === "asc" && "text-sec-text"
            )}
          />
          <Caret
            className={cn(
              "-rotate-90 text-black/60 -mt-1",
              sort === "desc" && "text-[#09090B]"
            )}
          />
        </div>
      )}
    </div>
  );
}

function Caret({ className }: { className: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M7.36343 7.99935L10.3335 10.9694L9.48507 11.8178L5.66663 7.99935L9.48507 4.18095L10.3335 5.02935L7.36343 7.99935Z"
        fill="currentColor"
      />
    </svg>
  );
}

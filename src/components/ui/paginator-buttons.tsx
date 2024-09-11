import React, { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getNumberOfPages } from "@/lib/utils";

type Props = {
  total: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

const PaginatorButtons: React.FC<Props> = ({
  total,
  pageSize,
  currentPage,
  onPageChange,
}) => {
  const [totalPages] = useState(getNumberOfPages(total, pageSize));
  const renderPageNumbers = () => {
    const pageNumbers = [];

    if (totalPages <= 5) {
      // Display all page numbers if total pages are 5 or less
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={i === currentPage}
              onClick={(e) => {
                e.preventDefault();
                onPageChange(i);
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Handle pages for more than 5 total pages
      // Always show the first page
      if (currentPage > 3) {
        pageNumbers.push(
          <PaginationItem key={1}>
            <PaginationLink
              href="#"
              isActive={currentPage === 1}
              onClick={(e) => {
                e.preventDefault();
                onPageChange(1);
              }}
            >
              1
            </PaginationLink>
          </PaginationItem>
        );
        if (currentPage > 4) {
          pageNumbers.push(<PaginationEllipsis key="start-ellipsis" />);
        }
      }

      // Show 2 pages before the current page if possible
      for (let i = Math.max(2, currentPage - 2); i < currentPage; i++) {
        pageNumbers.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={false}
              onClick={(e) => {
                e.preventDefault();
                onPageChange(i);
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      // Show the current page
      pageNumbers.push(
        <PaginationItem key={currentPage}>
          <PaginationLink
            href="#"
            isActive={true}
            onClick={(e) => {
              e.preventDefault();
              onPageChange(currentPage);
            }}
          >
            {currentPage}
          </PaginationLink>
        </PaginationItem>
      );

      // Show 2 pages after the current page if possible
      for (
        let i = currentPage + 1;
        i <= Math.min(totalPages - 1, currentPage + 2);
        i++
      ) {
        pageNumbers.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={false}
              onClick={(e) => {
                e.preventDefault();
                onPageChange(i);
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      // Show ellipsis and last page if currentPage is far from the last page
      if (currentPage < totalPages - 3) {
        if (currentPage < totalPages - 3) {
          pageNumbers.push(<PaginationEllipsis key="end-ellipsis" />);
        }
        pageNumbers.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              href="#"
              isActive={currentPage === totalPages}
              onClick={(e) => {
                e.preventDefault();
                onPageChange(totalPages);
              }}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return pageNumbers;
  };

  return (
    <div className="mt-8 mb-6">
      <Pagination>
        <PaginationContent className="flex flex-row items-center justify-between w-full">
          <PaginationItem
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) {
                onPageChange(currentPage - 1);
              }
            }}
            className={`rounded ${
              currentPage === 1
                ? "opacity-50 cursor-not-allowed"
                : " cursor-pointer"
            }`}
          >
            <PaginationPrevious
              isActive={currentPage === 1}
              className="rounded"
            />
          </PaginationItem>
          <div className="flex flex-1 justify-center items-center gap-2">
            {renderPageNumbers()}
          </div>
          <PaginationItem
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) {
                onPageChange(currentPage + 1);
              }
            }}
            className={`rounded ${
              currentPage === totalPages
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}
          >
            <PaginationNext
              isActive={currentPage === totalPages}
              className="rounded"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default PaginatorButtons;

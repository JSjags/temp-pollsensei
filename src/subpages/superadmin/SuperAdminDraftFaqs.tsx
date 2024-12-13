"use client"

import PageControl from "@/components/common/PageControl";
import FaqAccordion from "@/components/superadmin-faqs/FaqAccordion";
import { useAllFAQsQuery } from "@/services/superadmin.service";
import React, { useState } from "react";

const SuperAdminDraftFaqs = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, isError, refetch } = useAllFAQsQuery({
    pagesNumber: currentPage,
    filter_by:"draft"
  })
  const totalItems = data?.data?.total || 0;
  const totalPages = Math.ceil(totalItems / 20);

  const navigatePage = (direction: "next" | "prev") => {
    setCurrentPage((prevIndex) => {
      if (direction === "next") {
        return prevIndex < totalPages ? prevIndex + 1 : prevIndex;
      } else {
        return prevIndex > 1 ? prevIndex - 1 : prevIndex;
      }
    });
    refetch();
  };
  console.log(data);
  console.log(currentPage);


  return (
    <div className="p-6">
      <FaqAccordion items={data?.data?.data} isLoading={isLoading} isError={isError} />
      <div className="mt-6 sm:mt-8 flex justify-between items-center">
        <p className="text-xs font-medium">
          {totalItems > 0
            ? `Showing ${(currentPage - 1) * 20 + 1}-${Math.min(
                currentPage * 20,
                totalItems
              )} of ${totalItems}`
            : "No items to display"}
        </p>
        <PageControl
          currentPage={currentPage}
          totalPages={totalPages}
          onNavigate={navigatePage}
        />
      </div>
    </div>
  );
};

export default SuperAdminDraftFaqs;

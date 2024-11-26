"use client"

import PageControl from "@/components/common/PageControl";
import FaqAccordion from "@/components/superadmin-faqs/FaqAccordion";
import { useAllFAQsQuery } from "@/services/superadmin.service";
import React, { useState } from "react";

const SuperAdminLiveFaqs = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, error, refetch } = useAllFAQsQuery({
    pagesNumber: currentPage,
    filter_by:"live"
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


  const faqItems = [
    {
      question: "How do I create a survey?",
      answer: "You can create a survey by clicking on the 'Create Survey' button...",
    },
    {
      question: "Can I customize the survey design and layout?",
      answer: "Yes, you can customize the survey design and layout...",
    },
    {
      question: "Is my survey data kept confidential and secure?",
      answer: "Your survey data is kept confidential using our security measures...",
    },
  ];

  return (
    <div className="p-6">
      <FaqAccordion items={data?.data?.data} />
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

export default SuperAdminLiveFaqs;
